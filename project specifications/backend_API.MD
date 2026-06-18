# ADhoc.ai — Backend & AI Implementation Specification (v1.0)

## 1. Purpose

This document defines the backend architecture, AI architecture, APIs, workflows, security, database interactions, and deployment approach for ADhoc.ai. It serves as the primary implementation guide for backend, AI, and DevOps engineers.

---

# 2. Technology Stack

## Backend

* Python 3.12+
* FastAPI
* SQLAlchemy
* Alembic
* PostgreSQL
* Redis (Caching & Queues)
* Celery / Background Tasks
* WebSockets
* JWT Authentication

## AI

* Groq Llama 3.3 70B
* Microsoft Phi Models
* Whisper STT
* Piper / Coqui TTS
* LangChain/LlamaIndex (RAG)
* pgvector (Vector Search)

## Infrastructure

* Docker
* Nginx
* Ubuntu
* GitHub Actions
* HTTPS
* S3 Compatible Storage

---

# 3. Backend Architecture

```
Client
    │
REST / WebSocket / WebRTC
    │
FastAPI Gateway
    │
────────────────────────────────
Authentication
User Management
Dashboard Services
AI Services
Voice Services
Workflow Engine
Notification Service
Analytics Service
Knowledge Service
Document Service
────────────────────────────────
PostgreSQL
Redis
Object Storage
LLM APIs
```

Every module must remain independent and communicate through service interfaces.

---

# 4. Recommended Folder Structure

```
backend/
│
├── api/
├── auth/
├── models/
├── schemas/
├── services/
├── repositories/
├── ai/
├── workflows/
├── websocket/
├── notifications/
├── analytics/
├── knowledge/
├── voice/
├── middleware/
├── utils/
├── database/
└── main.py
```

---

# 5. Authentication

Support:

* Email & Password
* Google OAuth
* Microsoft OAuth

Authentication Flow

```
Login

↓

Validate Credentials

↓

Generate JWT

↓

Generate Refresh Token

↓

Validate Role

↓

Load Permissions

↓

Dashboard
```

JWT contains

* User ID
* Institution ID
* Role
* Expiry

Passwords must use bcrypt hashing.

---

# 6. Role Based Access Control

Supported Roles

* Student
* Parent
* Faculty
* Counsellor
* Placement Officer
* Administrator

Each API validates

* Authentication
* Institution
* Role
* Permission

Unauthorized requests return HTTP 401/403.

---

# 7. Backend Modules

### Authentication Service

* Login
* Registration
* Password Reset
* Email Verification

### User Service

* CRUD Users
* Profile Management
* Role Assignment

### Academic Service

* Attendance
* Courses
* Grades
* Assignments

### Placement Service

* Companies
* Drives
* Resumes
* Interviews

### Knowledge Service

* Upload
* Index
* Search
* Versioning

### Notification Service

* Email
* In-App
* Voice
* Push

### Analytics Service

* Reports
* Charts
* KPIs

---

# 8. Database

Core Tables

* users
* roles
* permissions
* institutions
* students
* faculty
* parents
* counsellors
* attendance
* assignments
* grades
* courses
* companies
* placements
* documents
* ai_conversations
* voice_sessions
* notifications
* workflows
* audit_logs

Guidelines

* UUID Primary Keys
* Foreign Keys
* Index frequently searched columns
* Soft delete for important records
* ACID transactions

---

# 9. API Standards

REST naming

```
GET    /students
GET    /students/{id}
POST   /students
PATCH  /students/{id}
DELETE /students/{id}
```

Response

```json
{
  "success": true,
  "message": "Completed",
  "data": {}
}
```

Errors

```json
{
  "success": false,
  "error": "Invalid Token"
}
```

---

# 10. WebSockets

Used for

* AI Streaming
* Voice Streaming
* Notifications
* Live Dashboard Updates
* Chat

Events

```
connect

message

typing

stream

notification

disconnect
```

---

# 11. Background Tasks

Run asynchronously

* Email Sending
* Notification Dispatch
* Document Indexing
* AI Summaries
* Report Generation
* Voice Calls
* Daily Analytics

Redis Queue recommended.

---

# 12. File Management

Supported

* PDF
* DOCX
* PPTX
* Images

Flow

```
Upload

↓

Virus Scan

↓

Store

↓

Metadata

↓

Knowledge Index
```

---

# 13. AI Architecture

Pipeline

```
User

↓

Permission Validation

↓

Conversation Context

↓

Knowledge Retrieval

↓

Prompt Builder

↓

LLM

↓

Response Validation

↓

Formatter

↓

Client
```

---

# 14. AI Components

* Prompt Manager
* Memory Manager
* Context Builder
* Knowledge Retriever
* LLM Router
* Response Validator
* Conversation Logger

Each component should be independently replaceable.

---

# 15. AI Agents

Student AI

* Academic Questions
* Scholarships
* Attendance
* Placements

Faculty AI

* Quiz Generation
* Notes
* Assignments
* Reports

Parent AI

* Attendance
* Fees
* Student Progress

Counsellor AI

* Lead Qualification
* Follow-ups
* Admission Guidance

Placement AI

* Resume Review
* ATS Analysis
* Interview Preparation

Administrator AI

* Reports
* Analytics
* Knowledge Search
* Workflow Assistance

---

# 16. Prompt Engineering

Prompt Structure

```
System Prompt

+

Institution Prompt

+

Role Prompt

+

Conversation Memory

+

Retrieved Knowledge

+

Current User Query
```

Prompt variables

* Institution
* User Role
* Language
* Department
* User Name

---

# 17. Memory

Short-Term

* Current Conversation

Long-Term

* Previous Conversations
* User Preferences
* Frequently Asked Questions

Memory expires based on configurable retention policy.

---

# 18. RAG Architecture

```
PDF

↓

Chunking

↓

Embeddings

↓

Vector Database

↓

Similarity Search

↓

Top K Results

↓

Prompt Injection

↓

LLM
```

Knowledge Sources

* Prospectus
* Policies
* Academic Calendar
* Fee Structure
* FAQs
* Circulars

---

# 19. Voice AI

Pipeline

```
Microphone

↓

WebRTC

↓

Whisper STT

↓

Prompt Engine

↓

LLM

↓

Piper TTS

↓

Browser Audio
```

States

* Idle
* Listening
* Processing
* Speaking
* Finished

---

# 20. Workflow Automation

Supported Workflows

* Admission
* Student Onboarding
* Attendance Alerts
* Fee Reminders
* Placement Pipeline
* Scholarship Notifications
* Document Verification

Each workflow consists of

Trigger → Conditions → Actions

---

# 21. Notifications

Channels

* In-App
* Email
* Voice
* Browser Push

Priority

* Low
* Medium
* High
* Critical

---

# 22. Security

Mandatory

* HTTPS
* JWT
* OAuth
* Rate Limiting
* CSRF Protection
* XSS Protection
* SQL Injection Protection
* File Validation
* Audit Logs
* Secure Headers

Sensitive data must never be exposed to AI without permission validation.

---

# 23. Monitoring

Track

* API Latency
* AI Latency
* Voice Latency
* Error Rate
* Token Usage
* Active Users
* Queue Length
* Database Performance

Centralized logging is required.

---

# 24. Deployment

```
Internet

↓

Nginx

↓

React

↓

FastAPI

↓

Redis

↓

PostgreSQL

↓

Object Storage

↓

LLM APIs
```

Deployment Requirements

* Docker Compose
* Environment Variables
* CI/CD Pipeline
* Automatic Rollback
* Daily Backups
* SSL
* Health Checks

---

# 25. Performance Targets

| Component         | Target |
| ----------------- | ------ |
| API Response      | <300ms |
| Dashboard Load    | <3s    |
| AI First Token    | <2s    |
| Voice Response    | <3s    |
| WebSocket Latency | <200ms |
| Search            | <500ms |
| Uptime            | 99.9%  |

---

# 26. Acceptance Criteria

The backend implementation is complete when:

* All APIs are secured using JWT and RBAC.
* Role-based dashboards retrieve data correctly.
* AI responses are grounded using institutional knowledge.
* Voice conversations support real-time streaming.
* Documents are automatically indexed for RAG.
* Workflow automation executes reliably.
* Notifications are delivered across supported channels.
* Audit logs capture all critical operations.
* Performance targets are consistently met.
* Infrastructure is containerized, scalable, monitored, and production-ready.

---

**End of Document**
