from fastapi import APIRouter, BackgroundTasks, UploadFile, File, Form, HTTPException
from typing import Optional
import uuid
import os
from services.downloader import VideoDownloader
from services.transcriber import AudioTranscriber
from services.analyzer import VideoAnalyzer
from services.video_processor import VideoProcessor
from services.excel_generator import ExcelGenerator
from services.storage import R2Storage
from utils.helpers import get_supabase

router = APIRouter()

# Initialize services
downloader = VideoDownloader()
transcriber = AudioTranscriber()
analyzer = VideoAnalyzer()
processor = VideoProcessor()
excel_gen = ExcelGenerator()
storage = R2Storage()
supabase = get_supabase()

@router.post("/submit")
async def submit_video(
    background_tasks: BackgroundTasks,
    url: Optional[str] = Form(None),
    platform: str = Form("TikTok"),
    subtitle_language: str = Form("ar"),
    user_id: str = Form(...) # In a real app, this would come from auth
):
    video_id = str(uuid.uuid4())
    job_id = str(uuid.uuid4())
    
    # Create initial records in Supabase
    supabase.table("videos").insert({
        "id": video_id,
        "user_id": user_id,
        "original_url": url,
        "status": "pending"
    }).execute()
    
    supabase.table("jobs").insert({
        "id": job_id,
        "video_id": video_id,
        "user_id": user_id,
        "status": "pending",
        "progress": 0
    }).execute()
    
    background_tasks.add_task(
        process_video_pipeline, 
        video_id, job_id, url, platform, subtitle_language, user_id
    )
    
    return {"job_id": job_id, "video_id": video_id, "status": "pending"}

@router.get("/status/{job_id}")
async def get_status(job_id: str):
    res = supabase.table("jobs").select("*").eq("id", job_id).single().execute()
    if not res.data:
        raise HTTPException(status_code=404, detail="Job not found")
    return res.data

@router.get("/results/{job_id}")
async def get_results(job_id: str):
    job = supabase.table("jobs").select("*").eq("id", job_id).single().execute()
    if not job.data:
        raise HTTPException(status_code=404, detail="Job not found")
    
    video = supabase.table("videos").select("*").eq("id", job.data["video_id"]).single().execute()
    clips = supabase.table("clips").select("*").eq("video_id", job.data["video_id"]).execute()
    
    return {
        "video_info": video.data,
        "clips": clips.data,
        "excel_url": job.data.get("excel_url")
    }

async def process_video_pipeline(video_id: str, job_id: str, url: str, platform: str, subtitle_language: str, user_id: str):
    temp_files = []
    try:
        def update_job(status: str, step: str, progress: int, steps_completed: list = None):
            update_data = {"status": status, "current_step": step, "progress": progress}
            if steps_completed:
                update_data["steps_completed"] = steps_completed
            supabase.table("jobs").update(update_data).eq("id", job_id).execute()
            supabase.table("videos").update({"status": status}).eq("id", video_id).execute()

        steps_completed = []

        # 1. Downloading
        update_job("downloading", "downloading_video", 10)
        video_info = downloader.download_video(url)
        video_path = video_info["file_path"]
        temp_files.append(video_path)
        steps_completed.append("downloading")
        
        # Update video title/duration
        supabase.table("videos").update({
            "title": video_info["title"],
            "duration_seconds": video_info["duration"]
        }).eq("id", video_id).execute()

        # 2. Extracting Audio
        update_job("extracting_audio", "extracting_audio", 20, steps_completed)
        audio_path = os.path.join("/tmp/ai-clipper", f"{video_id}.mp3")
        transcriber.extract_audio(video_path, audio_path)
        temp_files.append(audio_path)
        steps_completed.append("extracting_audio")

        # 3. Transcribing
        update_job("transcribing", "transcribing", 40, steps_completed)
        transcript_data = transcriber.transcribe(audio_path)
        steps_completed.append("transcribing")

        # 4. Analyzing
        update_job("analyzing", "analyzing", 60, steps_completed)
        analysis_results = analyzer.analyze_transcript(
            transcript_data, video_info["duration"], platform, subtitle_language
        )
        steps_completed.append("analyzing")

        # 5. Processing Clips
        update_job("processing_clips", "processing_clips", 70, steps_completed)
        processed_clips = []
        total_clips = len(analysis_results["clips"])
        
        for i, clip_data in enumerate(analysis_results["clips"]):
            clip_number = i + 1
            clip_filename = f"clip_{clip_number}.mp4"
            clip_path = os.path.join("/tmp/ai-clipper", f"{video_id}_{clip_filename}")
            
            processor.process_clip(
                video_path, 
                clip_data["start_time"], 
                clip_data["end_time"], 
                transcript_data["segments"],
                clip_path
            )
            
            # Upload clip to R2
            r2_key = f"clips/{user_id}/{job_id}/{clip_filename}"
            clip_url = storage.upload_file(clip_path, r2_key)
            temp_files.append(clip_path)
            
            # Save clip to Supabase
            clip_record = {
                "video_id": video_id,
                "user_id": user_id,
                "clip_number": clip_number,
                "clip_url": clip_url,
                "start_time_seconds": clip_data["start_time"],
                "end_time_seconds": clip_data["end_time"],
                "duration_seconds": clip_data["end_time"] - clip_data["start_time"],
                "viral_score": clip_data["viral_score"],
                "suggested_title": clip_data["suggested_title"],
                "suggested_title_ar": clip_data["suggested_title_ar"],
                "keywords": clip_data["keywords"],
                "description": clip_data["description"],
                "description_ar": clip_data["description_ar"],
                "hook_line": clip_data["hook_line"],
                "clip_type": clip_data["clip_type"],
                "emojis": clip_data["emojis"],
                "platform": platform,
                "subtitles_language": subtitle_language,
                "r2_key": r2_key
            }
            res = supabase.table("clips").insert(clip_record).execute()
            processed_clips.append(res.data[0])
            
            # Update progress
            progress = 70 + int((i + 1) / total_clips * 15)
            update_job("processing_clips", f"processing_clip_{clip_number}", progress)

        steps_completed.append("processing_clips")

        # 6. Generating Excel
        update_job("generating_excel", "generating_excel", 90, steps_completed)
        excel_filename = "results.xlsx"
        excel_path = os.path.join("/tmp/ai-clipper", f"{video_id}_{excel_filename}")
        
        video_meta = {
            "title": video_info["title"],
            "original_url": url,
            "video_summary": analysis_results.get("video_summary", ""),
            "video_summary_ar": analysis_results.get("video_summary_ar", "")
        }
        excel_gen.generate_results_excel(video_meta, processed_clips, excel_path)
        temp_files.append(excel_path)
        steps_completed.append("generating_excel")

        # 7. Uploading
        update_job("uploading", "uploading_results", 95, steps_completed)
        excel_r2_key = f"excels/{user_id}/{job_id}/{excel_filename}"
        excel_url = storage.upload_file(excel_path, excel_r2_key)
        
        # Update clips with excel_url (optional, prompt says excel_url in clips table too)
        supabase.table("clips").update({"excel_url": excel_url}).eq("video_id", video_id).execute()
        
        update_job("completed", "completed", 100, steps_completed)
        supabase.table("jobs").update({
            "excel_url": excel_url, 
            "total_clips": total_clips
        }).eq("id", job_id).execute()

    except Exception as e:
        print(f"Error in pipeline: {e}")
        supabase.table("jobs").update({
            "status": "failed", 
            "error_message": str(e)
        }).eq("id", job_id).execute()
        supabase.table("videos").update({
            "status": "failed", 
            "error_message": str(e)
        }).eq("id", video_id).execute()
    finally:
        # Cleanup temp files
        for f in temp_files:
            if os.path.exists(f):
                os.remove(f)
