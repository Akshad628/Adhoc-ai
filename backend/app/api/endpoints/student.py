from fastapi import APIRouter

router = APIRouter()

@router.get("/overview")
async def get_student_overview():
    return {
        "success": True,
        "data": {
            "attendance_percentage": 82.0,
            "cgpa": 8.4,
            "pending_assignments_count": 2
        }
    }
