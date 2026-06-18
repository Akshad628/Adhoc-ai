import uuid
import logging
from datetime import datetime
from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Header, Query
from fastapi.responses import RedirectResponse
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.db.session import get_db
from app.db.models import User, UserRole, StudentProfile, ParentProfile, FacultyProfile
from app.core.security import create_access_token, decode_access_token, get_password_hash, verify_password
from app.core.config import settings

logger = logging.getLogger(__name__)
router = APIRouter()

# Schema for Onboarding
class OnboardingRequest(BaseModel):
    role: UserRole
    first_name: str
    last_name: str
    phone: Optional[str] = None
    
    # Student specific
    roll_number: Optional[str] = None
    branch: Optional[str] = None
    semester: Optional[int] = 1
    
    # Parent specific
    student_roll_number: Optional[str] = None
    
    # Faculty specific
    employee_id: Optional[str] = None
    department: Optional[str] = None
    designation: Optional[str] = None

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    email: str
    password: str
    role: UserRole

# Standard Password Register (for fallback/development/testing)
@router.post("/register")
async def register(data: RegisterRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalars().first()
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = User(
        email=data.email,
        hashed_password=get_password_hash(data.password),
        role=data.role
    )
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    token = create_access_token(data={"sub": str(new_user.id), "email": new_user.email, "role": new_user.role.value})
    return {"access_token": token, "token_type": "bearer", "user": {"email": new_user.email, "role": new_user.role}}

# Standard Password Login (for fallback/development/testing)
@router.post("/login")
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalars().first()
    if not user or not user.hashed_password or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    role_val = user.role.value if user.role else None
    token = create_access_token(data={"sub": str(user.id), "email": user.email, "role": role_val})
    return {"access_token": token, "token_type": "bearer", "user": {"email": user.email, "role": role_val}}

# ----------------- DYNAMIC PROVIDER LOGIN PATHS -----------------

@router.get("/{provider}/login")
async def provider_login(provider: str, state: Optional[str] = None):
    """
    Exposes a dynamic endpoint for provider SSO logins.
    """
    if provider == "google":
        return await google_login(state)
    elif provider == "microsoft":
        return await microsoft_login(state)
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported authentication provider: {provider}")

@router.get("/{provider}/callback")
async def provider_callback(provider: str, code: str, state: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    """
    Exposes a dynamic callback endpoint for provider SSO authorizations.
    """
    if provider == "google":
        return await google_callback(code, state, db)
    elif provider == "microsoft":
        return await microsoft_callback(code, state, db)
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported callback provider: {provider}")

# ----------------- GOOGLE SSO OAUTH ROUTES -----------------

@router.get("/google")
async def google_login(state: Optional[str] = None):
    """
    Initiates Google SSO OAuth Flow. If client ID/Secret are not configured,
    redirects directly to the callback route in mock development mode.
    """
    if not settings.GOOGLE_CLIENT_ID or not settings.GOOGLE_CLIENT_SECRET:
        logger.warning("Google Client ID/Secret not configured. Using Mock OAuth login.")
        mock_callback_url = f"http://localhost:8000/api/v1/auth/google/callback?code=mock_google_auth_code_123&state={state or ''}"
        return RedirectResponse(url=mock_callback_url)
    
    redirect_uri = "http://localhost:8000/api/v1/auth/google/callback"
    google_auth_url = (
        "https://accounts.google.com/o/oauth2/v2/auth"
        f"?client_id={settings.GOOGLE_CLIENT_ID}"
        f"&redirect_uri={redirect_uri}"
        "&response_type=code"
        "&scope=openid%20email%20profile"
        f"&state={state or ''}"
    )
    return RedirectResponse(url=google_auth_url)

@router.get("/google/callback")
async def google_callback(code: str, state: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    """
    Handles Google OAuth Callback. Exchanges code for user info,
    updates/creates the user record, and redirects back to React frontend.
    """
    import httpx  # type: ignore
    
    email = None
    sub_id = None
    
    if code.startswith("mock_"):
        email = "google_mock_user@gcet.edu.in"
        sub_id = "mock-google-sub-id-12345"
    else:
        redirect_uri = "http://localhost:8000/api/v1/auth/google/callback"
        async with httpx.AsyncClient() as client:
            token_res = await client.post(
                "https://oauth2.googleapis.com/token",
                data={
                    "client_id": settings.GOOGLE_CLIENT_ID,
                    "client_secret": settings.GOOGLE_CLIENT_SECRET,
                    "code": code,
                    "redirect_uri": redirect_uri,
                    "grant_type": "authorization_code"
                }
            )
            if token_res.status_code != 200:
                raise HTTPException(status_code=400, detail=f"Failed to fetch Google OAuth token: {token_res.text}")
            
            token_data = token_res.json()
            access_token = token_data.get("access_token")
            
            userinfo_res = await client.get(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                headers={"Authorization": f"Bearer {access_token}"}
            )
            if userinfo_res.status_code != 200:
                raise HTTPException(status_code=400, detail="Failed to fetch Google user profile")
            
            profile_data = userinfo_res.json()
            email = profile_data.get("email")
            sub_id = profile_data.get("sub")
            
    if not email or not sub_id:
        raise HTTPException(status_code=400, detail="Email or sub identifier not provided by Google")
        
    result = await db.execute(select(User).where((User.email == email) | (User.google_id == sub_id)))
    user = result.scalars().first()
    
    is_new = False
    if not user:
        is_new = True
        user = User(
            email=email,
            google_id=sub_id,
            role=None
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
    elif user.role is None:
        is_new = True
        
    role_val = user.role.value if user.role else None
    token = create_access_token(data={"sub": str(user.id), "email": user.email, "role": role_val})
    
    if is_new:
        # Redirect to onboarding selection screen
        redirect_url = f"{settings.FRONTEND_URL}/onboarding?token={token}"
    else:
        # Redirect to login page to trigger dashboard routing
        redirect_url = f"{settings.FRONTEND_URL}/login?token={token}"
        
    return RedirectResponse(url=redirect_url)

# ----------------- MICROSOFT SSO OAUTH ROUTES -----------------

@router.get("/microsoft")
async def microsoft_login(state: Optional[str] = None):
    """
    Initiates Microsoft SSO OAuth Flow. If client ID/Secret are not configured,
    redirects directly to the callback route in mock development mode.
    """
    if not settings.MICROSOFT_CLIENT_ID or not settings.MICROSOFT_CLIENT_SECRET:
        logger.warning("Microsoft Client ID/Secret not configured. Using Mock OAuth login.")
        mock_callback_url = f"http://localhost:8000/api/v1/auth/microsoft/callback?code=mock_microsoft_auth_code_123&state={state or ''}"
        return RedirectResponse(url=mock_callback_url)
        
    redirect_uri = "http://localhost:8000/api/v1/auth/microsoft/callback"
    microsoft_auth_url = (
        "https://login.microsoftonline.com/common/oauth2/v2.0/authorize"
        f"?client_id={settings.MICROSOFT_CLIENT_ID}"
        f"&redirect_uri={redirect_uri}"
        "&response_type=code"
        "&scope=openid%20email%20profile%20User.Read"
        f"&state={state or ''}"
    )
    return RedirectResponse(url=microsoft_auth_url)

@router.get("/microsoft/callback")
async def microsoft_callback(code: str, state: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    """
    Handles Microsoft OAuth Callback. Exchanges code for user info,
    updates/creates the user record, and redirects back to React frontend.
    """
    import httpx  # type: ignore
    
    email = None
    sub_id = None
    
    if code.startswith("mock_"):
        email = "microsoft_mock_user@gcet.edu.in"
        sub_id = "mock-microsoft-sub-id-12345"
    else:
        redirect_uri = "http://localhost:8000/api/v1/auth/microsoft/callback"
        async with httpx.AsyncClient() as client:
            token_res = await client.post(
                "https://login.microsoftonline.com/common/oauth2/v2.0/token",
                data={
                    "client_id": settings.MICROSOFT_CLIENT_ID,
                    "client_secret": settings.MICROSOFT_CLIENT_SECRET,
                    "code": code,
                    "redirect_uri": redirect_uri,
                    "grant_type": "authorization_code"
                }
            )
            if token_res.status_code != 200:
                raise HTTPException(status_code=400, detail=f"Failed to fetch Microsoft OAuth token: {token_res.text}")
                
            token_data = token_res.json()
            access_token = token_data.get("access_token")
            
            graph_res = await client.get(
                "https://graph.microsoft.com/v1.0/me",
                headers={"Authorization": f"Bearer {access_token}"}
            )
            if graph_res.status_code != 200:
                raise HTTPException(status_code=400, detail="Failed to fetch Microsoft Graph user profile")
                
            profile_data = graph_res.json()
            email = profile_data.get("mail") or profile_data.get("userPrincipalName")
            sub_id = profile_data.get("id")
            
    if not email or not sub_id:
        raise HTTPException(status_code=400, detail="Email or sub identifier not provided by Microsoft")
        
    result = await db.execute(select(User).where((User.email == email) | (User.microsoft_id == sub_id)))
    user = result.scalars().first()
    
    is_new = False
    if not user:
        is_new = True
        user = User(
            email=email,
            microsoft_id=sub_id,
            role=None
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
    elif user.role is None:
        is_new = True
        
    role_val = user.role.value if user.role else None
    token = create_access_token(data={"sub": str(user.id), "email": user.email, "role": role_val})
    
    if is_new:
        redirect_url = f"{settings.FRONTEND_URL}/onboarding?token={token}"
    else:
        redirect_url = f"{settings.FRONTEND_URL}/login?token={token}"
        
    return RedirectResponse(url=redirect_url)

# ----------------- GENERAL AUTH ENDPOINTS -----------------

@router.get("/me")
async def get_me(authorization: Optional[str] = Header(None), db: AsyncSession = Depends(get_db)):
    """
    Decodes the Bearer token and returns user profile database details.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authorization header missing or invalid")
        
    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Session expired or invalid token")
        
    user_id = payload.get("sub")
    try:
        user_uuid = uuid.UUID(user_id)
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid token payload user ID")
        
    result = await db.execute(select(User).where(User.id == user_uuid))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    profile_data = {}
    if user.role == UserRole.student:
        student_res = await db.execute(select(StudentProfile).where(StudentProfile.user_id == user.id))
        student = student_res.scalars().first()
        if student:
            profile_data = {
                "firstName": student.first_name,
                "lastName": student.last_name,
                "fullName": f"{student.first_name} {student.last_name}",
                "phone": student.phone,
                "rollNumber": student.roll_number,
                "branch": student.branch,
                "semester": student.semester,
                "cgpa": student.cgpa,
                "attendancePercentage": student.attendance_percentage
            }
    elif user.role == UserRole.parent:
        parent_res = await db.execute(select(ParentProfile).where(ParentProfile.user_id == user.id))
        parent = parent_res.scalars().first()
        if parent:
            profile_data = {
                "firstName": parent.first_name,
                "lastName": parent.last_name,
                "fullName": f"{parent.first_name} {parent.last_name}",
                "phone": parent.phone
            }
    elif user.role == UserRole.faculty:
        faculty_res = await db.execute(select(FacultyProfile).where(FacultyProfile.user_id == user.id))
        faculty = faculty_res.scalars().first()
        if faculty:
            profile_data = {
                "firstName": faculty.first_name,
                "lastName": faculty.last_name,
                "fullName": "Faculty Member",
                "employeeId": faculty.employee_id,
                "department": faculty.department,
                "designation": faculty.designation
            }
            
    if not profile_data.get("fullName"):
        prefix = user.email.split("@")[0].replace(".", " ").replace("_", " ")
        profile_data["fullName"] = prefix.title()

    role_val = user.role.value if user.role else None
    return {
        "id": str(user.id),
        "email": user.email,
        "role": role_val,
        **profile_data
    }

@router.post("/onboarding")
async def perform_onboarding(
    data: OnboardingRequest, 
    authorization: Optional[str] = Header(None), 
    db: AsyncSession = Depends(get_db)
):
    """
    Submits role-specific metadata details for a new OAuth user (role is null) and
    finalizes onboarding by saving details, setting the user role, and returning a final JWT.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authorization header missing or invalid")
        
    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Session expired or invalid token")
        
    user_id = payload.get("sub")
    try:
        user_uuid = uuid.UUID(user_id)
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid token payload user ID")
        
    result = await db.execute(select(User).where(User.id == user_uuid))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if user.role is not None:
        raise HTTPException(status_code=400, detail="User has already completed onboarding")
        
    user.role = data.role
    
    if data.role == UserRole.student:
        if not data.roll_number or not data.branch:
            raise HTTPException(status_code=400, detail="Roll number and Branch are required for Student onboarding")
        existing_student = await db.execute(select(StudentProfile).where(StudentProfile.roll_number == data.roll_number))
        if existing_student.scalars().first():
            raise HTTPException(status_code=400, detail="Roll number already in use")
            
        profile = StudentProfile(
            user_id=user.id,
            first_name=data.first_name,
            last_name=data.last_name,
            phone=data.phone,
            roll_number=data.roll_number,
            branch=data.branch,
            semester=data.semester or 1,
            cgpa=0.0,
            attendance_percentage=100.0
        )
        db.add(profile)
        
    elif data.role == UserRole.parent:
        student_profile_id = None
        if data.student_roll_number:
            student_res = await db.execute(select(StudentProfile).where(StudentProfile.roll_number == data.student_roll_number))
            student = student_res.scalars().first()
            if not student:
                raise HTTPException(status_code=400, detail="Target student roll number not found")
            student_profile_id = student.id
            
        profile = ParentProfile(
            user_id=user.id,
            first_name=data.first_name,
            last_name=data.last_name,
            phone=data.phone,
            student_profile_id=student_profile_id
        )
        db.add(profile)
        
    elif data.role == UserRole.faculty:
        if not data.employee_id or not data.department or not data.designation:
            raise HTTPException(status_code=400, detail="Employee ID, Department, and Designation are required for Faculty onboarding")
        existing_faculty = await db.execute(select(FacultyProfile).where(FacultyProfile.employee_id == data.employee_id))
        if existing_faculty.scalars().first():
            raise HTTPException(status_code=400, detail="Employee ID already in use")
            
        profile = FacultyProfile(
            user_id=user.id,
            employee_id=data.employee_id,
            department=data.department,
            designation=data.designation
        )
        db.add(profile)
        
    elif data.role in [UserRole.coordinator, UserRole.counsellor, UserRole.admin]:
        pass
        
    await db.commit()
    await db.refresh(user)
    
    final_token = create_access_token(data={"sub": str(user.id), "email": user.email, "role": user.role.value})
    
    return {
        "access_token": final_token,
        "token_type": "bearer",
        "user": {
            "id": str(user.id),
            "email": user.email,
            "role": user.role.value,
            "fullName": f"{data.first_name} {data.last_name}",
            "phone": data.phone
        }
    }
