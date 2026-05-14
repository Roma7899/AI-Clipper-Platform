from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import videos, clips, auth
import uvicorn
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="AI Clipper API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, set this to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(videos.router, prefix="/api/videos", tags=["videos"])
app.include_router(clips.router, prefix="/api/clips", tags=["clips"])

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "AI Clipper is running!"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
