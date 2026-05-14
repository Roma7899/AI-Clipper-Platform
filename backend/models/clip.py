from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ClipBase(BaseModel):
    video_id: str
    user_id: str
    clip_number: int
    clip_url: Optional[str] = None
    excel_url: Optional[str] = None
    start_time_seconds: float
    end_time_seconds: float
    duration_seconds: float
    viral_score: int
    suggested_title: str
    suggested_title_ar: str
    keywords: List[str]
    description: str
    description_ar: str
    hook_line: str
    clip_type: str
    emojis: str
    platform: str = "TikTok"
    subtitles_language: str = "ar"
    r2_key: Optional[str] = None

class ClipCreate(ClipBase):
    pass

class Clip(ClipBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True
