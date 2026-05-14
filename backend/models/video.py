from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class VideoBase(BaseModel):
    user_id: str
    original_url: Optional[str] = None
    original_filename: Optional[str] = None
    title: Optional[str] = None
    duration_seconds: Optional[int] = None
    status: str = "pending"
    error_message: Optional[str] = None
    r2_key: Optional[str] = None

class VideoCreate(VideoBase):
    pass

class Video(VideoBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
