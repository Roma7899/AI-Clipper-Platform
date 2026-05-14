import yt_dlp
import os
import uuid
from typing import Dict, Any, Optional

class VideoDownloader:
    def __init__(self, temp_dir: str = "/tmp/ai-clipper"):
        self.temp_dir = temp_dir
        os.makedirs(self.temp_dir, exist_ok=True)

    def download_video(self, url: str) -> Dict[str, Any]:
        """Downloads a video from a URL and returns info and file path."""
        video_id = str(uuid.uuid4())
        output_template = os.path.join(self.temp_dir, f"{video_id}.%(ext)s")
        
        ydl_opts = {
            'format': 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
            'outtmpl': output_template,
            'noplaylist': True,
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            file_path = ydl.prepare_filename(info)
            
            return {
                "id": video_id,
                "file_path": file_path,
                "title": info.get("title"),
                "duration": info.get("duration"),
                "thumbnail": info.get("thumbnail"),
                "ext": info.get("ext"),
                "width": info.get("width"),
                "height": info.get("height"),
            }

    def cleanup(self, file_path: str):
        """Deletes a local file."""
        if os.path.exists(file_path):
            os.remove(file_path)
