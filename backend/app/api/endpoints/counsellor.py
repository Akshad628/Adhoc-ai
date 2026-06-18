from fastapi import APIRouter

router = APIRouter()

@router.get("/leads")
async def get_counsellor_leads():
    return {
        "success": True,
        "data": []
    }
