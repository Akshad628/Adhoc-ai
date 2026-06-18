import os
import uuid
import logging
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db.session import get_db
from app.db.models import User, UserRole
from app.core.security import decode_access_token
from app.services.rag_service import RAGService

logger = logging.getLogger(__name__)
router = APIRouter()

async def get_current_admin(authorization: Optional[str] = Header(None), db: AsyncSession = Depends(get_db)) -> User:
    """
    Dependency to authorize requests, restricting to authenticated users with the Admin role.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authorization header missing or invalid")
        
    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Session expired or invalid credentials")
        
    user_id = payload.get("sub")
    try:
        user_uuid = uuid.UUID(user_id)
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid token payload user ID")
        
    result = await db.execute(select(User).where(User.id == user_uuid))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User account not found")
        
    if user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Forbidden: Administrator privileges required")
        
    return user

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """
    Endpoint for uploading a PDF document, vectorizing it using pgvector, and storing chunks.
    Restricted to users with the Admin role.
    """
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
        
    # Save the file temporarily
    temp_filename = f"temp_{uuid.uuid4().hex}_{file.filename}"
    temp_path = os.path.join(os.getcwd(), temp_filename)
    
    try:
        with open(temp_path, "wb") as f:
            content = await file.read()
            f.write(content)
            
        # Ingest the document
        chunk_count = await RAGService.ingest_document(db, temp_path, file.filename)
        
        return {
            "success": True,
            "filename": file.filename,
            "chunks_ingested": chunk_count,
            "message": f"Successfully ingested document '{file.filename}' into vector database."
        }
        
    except Exception as e:
        logger.error(f"Error handling document upload: {e}")
        raise HTTPException(status_code=500, detail=f"Ingestion failed: {str(e)}")
        
    finally:
        # Clean up temporary file
        if os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except Exception as ex:
                logger.error(f"Failed to remove temp file {temp_path}: {ex}")
