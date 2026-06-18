from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.init_db import init_models
from app.api.endpoints import auth, student, counsellor, admin, voice

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Auto-initialize Postgres schemas on boot
    await init_models()
    yield

app = FastAPI(
    title="ADhoc.ai Enterprise API Engine",
    version="1.0.0",
    lifespan=lifespan
)

# CORS setup for local frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API v1 routes inclusion
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(student.router, prefix="/api/v1/student", tags=["Student/Parent Dashboard"])
app.include_router(counsellor.router, prefix="/api/v1/counsellor", tags=["Counsellor Dashboard"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin Settings/Telemetry"])
app.include_router(voice.router, prefix="/api/v1/voice", tags=["Real-time Telephony WebSocket"])

@app.get("/health")
async def health_check():
    return {"status": "online", "system": "ADhoc.ai Backend API Node"}
