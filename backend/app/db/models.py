import enum
import uuid
from datetime import datetime
from typing import List, Optional
from sqlalchemy import Enum, ForeignKey, String, Text, Float, Integer, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

class Base(DeclarativeBase):
    pass

class UserRole(str, enum.Enum):
    student = "student"
    parent = "parent"
    faculty = "faculty"
    coordinator = "coordinator"
    counsellor = "counsellor"
    admin = "admin"

class LeadStatus(str, enum.Enum):
    new = "new"
    contacted = "contacted"
    scheduled = "scheduled"
    admitted = "admitted"
    lost = "lost"

class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    role: Mapped[Optional[UserRole]] = mapped_column(Enum(UserRole), nullable=True, default=None)
    google_id: Mapped[Optional[str]] = mapped_column(String(255), unique=True, nullable=True)
    microsoft_id: Mapped[Optional[str]] = mapped_column(String(255), unique=True, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    student_profile: Mapped[Optional["StudentProfile"]] = relationship("StudentProfile", back_populates="user", cascade="all, delete-orphan", uselist=False)
    parent_profile: Mapped[Optional["ParentProfile"]] = relationship("ParentProfile", back_populates="user", cascade="all, delete-orphan", uselist=False)
    faculty_profile: Mapped[Optional["FacultyProfile"]] = relationship("FacultyProfile", back_populates="user", cascade="all, delete-orphan", uselist=False)
    telemetry_logs: Mapped[List["TelemetryLog"]] = relationship("TelemetryLog", back_populates="user", cascade="all, delete-orphan")


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)
    phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    roll_number: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    branch: Mapped[str] = mapped_column(String(50), nullable=False)  # CSE, ECE, EEE, ME, CE, etc.
    semester: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    cgpa: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    attendance_percentage: Mapped[float] = mapped_column(Float, default=100.0, nullable=False)

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="student_profile")
    parents: Mapped[List["ParentProfile"]] = relationship("ParentProfile", back_populates="student_profile")


class ParentProfile(Base):
    __tablename__ = "parent_profiles"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)
    phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    student_profile_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("student_profiles.id", ondelete="SET NULL"), nullable=True)

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="parent_profile")
    student_profile: Mapped[Optional["StudentProfile"]] = relationship("StudentProfile", back_populates="parents")


class FacultyProfile(Base):
    __tablename__ = "faculty_profiles"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    employee_id: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    department: Mapped[str] = mapped_column(String(100), nullable=False)  # e.g., CSE
    designation: Mapped[str] = mapped_column(String(100), nullable=False) # e.g., Assistant Professor

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="faculty_profile")


class AdmissionLead(Base):
    __tablename__ = "admission_leads"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str] = mapped_column(String(50), nullable=False)
    course_interest: Mapped[str] = mapped_column(String(255), nullable=False)  # e.g., Computer Science
    status: Mapped[LeadStatus] = mapped_column(Enum(LeadStatus), nullable=False, default=LeadStatus.new)
    ai_score: Mapped[int] = mapped_column(Integer, default=50, nullable=False)  # 0-100 probability
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)


class TelemetryLog(Base):
    __tablename__ = "telemetry_logs"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    interaction_type: Mapped[str] = mapped_column(String(50), nullable=False)  # "voice" or "text"
    duration_seconds: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    latency_ms: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    sentiment_score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    transcript_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    user: Mapped[Optional["User"]] = relationship("User", back_populates="telemetry_logs")
