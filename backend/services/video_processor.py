import subprocess
import os
import json
from typing import List, Dict, Any

class VideoProcessor:
    def __init__(self, temp_dir: str = "/tmp/ai-clipper"):
        self.temp_dir = temp_dir
        os.makedirs(self.temp_dir, exist_ok=True)

    def get_video_dimensions(self, video_path: str) -> Dict[str, int]:
        """Gets video width and height using ffprobe."""
        command = [
            "ffprobe", "-v", "error", "-select_streams", "v:0",
            "-show_entries", "stream=width,height", "-of", "json", video_path
        ]
        result = subprocess.run(command, capture_output=True, text=True)
        data = json.loads(result.stdout)
        return {
            "width": data["streams"][0]["width"],
            "height": data["streams"][0]["height"]
        }

    def process_clip(self, video_path: str, start: float, end: float, transcript_segments: List[Dict[str, Any]], output_path: str):
        """Processes a single clip: cut, crop, scale, subtitles, optimize."""
        
        dimensions = self.get_video_dimensions(video_path)
        width = dimensions["width"]
        height = dimensions["height"]

        # 1. Cut and Crop to 9:16
        # Target aspect ratio is 9/16. 
        # If original is 16:9, we take a center crop.
        target_aspect = 9/16
        if width / height > target_aspect:
            # Video is wider than 9:16 (e.g. 16:9)
            new_width = int(height * target_aspect)
            crop_x = (width - new_width) // 2
            crop_filter = f"crop={new_width}:{height}:{crop_x}:0"
        else:
            # Video is narrower than 9:16 or already 9:16
            new_height = int(width / target_aspect)
            crop_y = (height - new_height) // 2
            crop_filter = f"crop={width}:{new_height}:0:{crop_y}"

        # 2. Generate SRT for this clip
        srt_path = os.path.join(self.temp_dir, "temp_subs.srt")
        self.generate_srt(transcript_segments, start, end, srt_path)

        # 3. FFmpeg Pipeline
        # We combine cut, crop, scale, subtitles, and optimization in one or two steps.
        # For simplicity and style, we'll do it in one complex filter if possible, or sequential.
        
        # Style: FontSize=18,PrimaryColour=&HFFFFFF,OutlineColour=&H000000,Outline=2,Bold=1,Alignment=2
        # Alignment=2 is bottom center. 6 is top center. 10 is middle center.
        
        command = [
            "ffmpeg", "-i", video_path,
            "-ss", str(start), "-to", str(end),
            "-vf", f"{crop_filter},scale=1080:1920,subtitles={srt_path}:force_style='FontSize=18,PrimaryColour=&HFFFFFF,OutlineColour=&H000000,Outline=2,Bold=1,Alignment=2'",
            "-c:v", "libx264", "-crf", "23", "-c:a", "aac", "-b:a", "128k",
            output_path, "-y"
        ]
        
        subprocess.run(command, check=True, capture_output=True)
        
        # Cleanup SRT
        if os.path.exists(srt_path):
            os.remove(srt_path)

    def generate_srt(self, segments: List[Dict[str, Any]], start_limit: float, end_limit: float, output_path: str):
        """Generates an SRT file for the specific clip time range."""
        with open(output_path, "w", encoding="utf-8") as f:
            count = 1
            for seg in segments:
                s = seg["start"]
                e = seg["end"]
                
                # Check if segment overlaps with our clip
                if e <= start_limit or s >= end_limit:
                    continue
                
                # Adjust timestamps relative to clip start
                rel_s = max(0, s - start_limit)
                rel_e = min(end_limit - start_limit, e - start_limit)
                
                f.write(f"{count}\n")
                f.write(f"{self.format_timestamp(rel_s)} --> {self.format_timestamp(rel_e)}\n")
                f.write(f"{seg['text'].strip()}\n\n")
                count += 1

    def format_timestamp(self, seconds: float) -> str:
        """Formats seconds into SRT timestamp format: HH:MM:SS,mmm"""
        hrs = int(seconds // 3600)
        mins = int((seconds % 3600) // 60)
        secs = int(seconds % 60)
        mils = int((seconds * 1000) % 1000)
        return f"{hrs:02d}:{mins:02d}:{secs:02d},{mils:03d}"
