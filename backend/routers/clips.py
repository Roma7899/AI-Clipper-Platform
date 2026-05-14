from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def get_clips():
    return {"message": "Clips router"}
