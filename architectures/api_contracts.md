# ADhoc.ai API Contracts Specification

This document details the unified HTTP REST and WebSocket API interfaces for the ADhoc.ai platform.

---

## 1. General Standards

* **Base URL:** `https://api.adhoc.ai/api/v1` or `https://[subdomain].adhoc.ai/api/v1`
* **Response Wrapper (Success 200/201):**
  ```json
  {
    "success": true,
    "message": "Operation completed successfully",
    "data": {}
  }
  ```
* **Response Wrapper (Error 4xx/5xx):**
  ```json
  {
    "success": false,
    "error": "Descriptive error message code",
    "details": {}
  }
  ```
* **Pagination Parameters:** `page` (default: 1), `limit` (default: 10, max: 100).
* **Sorting Parameters:** `sort_by` (field name), `order` (`asc` or `desc`).
* **Global Rate Limit:** 100 requests per minute per IP. Auth endpoints are limited to 10 requests per minute per IP.

---

## 2. API Endpoints Catalog

### 1. Authentication Module (`/auth`)

#### `POST /auth/register`
* **Purpose:** Registers a new tenant user.
* **Authentication:** None.
* **Rate Limit:** 5 req/min.
* **Request Schema:**
  ```json
  {
    "role": "student",
    "full_name": "John Doe",
    "email": "john.doe@mit.edu",
    "phone_number": "+1234567890",
    "institution_subdomain": "mit",
    "password": "Password123!"
  }
  ```
* **Validation:** Role must be a valid system role. Password must be >= 8 chars, containing uppercase, lowercase, numbers, and special characters. Email must be valid format.
* **Success Response (201):**
  ```json
  {
    "success": true,
    "message": "Registration successful. Please verify your email.",
    "data": {
      "user_id": "8e3b7b32-8dfb-402a-a92c-806859345091",
      "email": "john.doe@mit.edu",
      "status": "PENDING"
    }
  }
  ```
* **Error Response (400):** Email already exists or validation fails.

#### `POST /auth/login`
* **Purpose:** Authenticates user and sets session.
* **Authentication:** None.
* **Rate Limit:** 10 req/min.
* **Request Schema:**
  ```json
  {
    "email": "john.doe@mit.edu",
    "password": "Password123!"
  }
  ```
* **Success Response (200):** Returns access token in payload, and sets the secure HttpOnly cookie for the refresh token.
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "access_token": "eyJhbGciOiJIUzI1NiIsIn...",
      "token_type": "Bearer",
      "expires_in": 900,
      "user": {
        "id": "8e3b7b32-8dfb-402a-a92c-806859345091",
        "full_name": "John Doe",
        "role": "student",
        "institution_id": "0d2eb05b-8003-49d7-862d-0a8111e1f181"
      }
    }
  }
  ```
* **Error Response (401):** Invalid credentials.

#### `POST /auth/refresh`
* **Purpose:** Rotates access token using HttpOnly refresh token cookie.
* **Authentication:** Valid Refresh Token Cookie.
* **Success Response (200):**
  ```json
  {
    "success": true,
    "message": "Token refreshed successfully",
    "data": {
      "access_token": "eyJhbGciOiJIUzI1NiIsIn..."
    }
  }
  ```

---

### 2. Student Dashboard Module (`/student`)

#### `GET /student/overview`
* **Purpose:** Fetch summary widgets for home panel.
* **Authentication:** JWT (Student Role).
* **Success Response (200):**
  ```json
  {
    "success": true,
    "message": "Overview loaded",
    "data": {
      "attendance_percentage": 85.5,
      "current_cgpa": 8.75,
      "pending_assignments_count": 3,
      "placement_readiness_score": 78.0,
      "recent_activities": [
        { "timestamp": "2026-06-17T12:00:00Z", "event": "Assignment 2 Submitted" }
      ]
    }
  }
  ```

#### `GET /student/courses`
* **Purpose:** List enrolled courses.
* **Authentication:** JWT (Student Role).
* **Success Response (200):**
  ```json
  {
    "success": true,
    "message": "Enrolled courses loaded",
    "data": {
      "courses": [
        {
          "course_id": "31b2661f-132d-45df-95bf-798835848bb2",
          "code": "CS302",
          "name": "Database Management Systems",
          "credits": 4,
          "faculty_name": "Dr. Sarah Connor"
        }
      ]
    }
  }
  ```

---

### 3. Faculty Dashboard Module (`/faculty`)

#### `POST /faculty/attendance/mark`
* **Purpose:** Submits student attendance logs for a subject session.
* **Authentication:** JWT (Faculty Role).
* **Request Schema:**
  ```json
  {
    "subject_id": "5174092d-94c6-48ee-a010-388e34891cc1",
    "date": "2026-06-17",
    "records": [
      { "student_id": "8e3b7b32-8dfb-402a-a92c-806859345091", "status": "PRESENT" },
      { "student_id": "a823b2aa-c923-4bda-a0ee-6c1e95648834", "status": "ABSENT" }
    ]
  }
  ```
* **Success Response (200):**
  ```json
  {
    "success": true,
    "message": "Attendance marked successfully",
    "data": { "marked_records": 2 }
  }
  ```

---

### 4. Parent Dashboard Module (`/parent`)

#### `GET /parent/child-summary`
* **Purpose:** Parent accesses child metrics.
* **Authentication:** JWT (Parent Role).
* **Success Response (200):**
  ```json
  {
    "success": true,
    "message": "Child summary loaded",
    "data": {
      "child_name": "John Doe",
      "roll_number": "CS034",
      "attendance_overall": 85.5,
      "grades_cgpa": 8.75,
      "fee_status": "PAID"
    }
  }
  ```

---

### 5. Counsellor Module (`/counsellor`)

#### `POST /counsellor/leads`
* **Purpose:** Adds a new admission enquiry lead.
* **Authentication:** JWT (Counsellor Role).
* **Request Schema:**
  ```json
  {
    "student_name": "Alice Green",
    "email": "alice.g@gmail.com",
    "phone": "+1234999222",
    "preferred_course": "Computer Science",
    "lead_source": "Website Enquiry"
  }
  ```
* **Success Response (201):**
  ```json
  {
    "success": true,
    "message": "Lead added successfully",
    "data": {
      "lead_id": "78ee4a23-455b-4c4f-9e8c-8f43c3f256da",
      "status": "NEW_ENQUIRY"
    }
  }
  ```

---

### 6. Placement Module (`/placement`)

#### `POST /placement/drives`
* **Purpose:** Placement Officer creates a recruitment campaign.
* **Authentication:** JWT (Placement Officer Role).
* **Request Schema:**
  ```json
  {
    "company_id": "99b0c26d-89ee-47b1-912f-9818ab4847aa",
    "drive_date": "2026-07-15",
    "eligible_cgpa": 7.50,
    "registration_deadline": "2026-07-01"
  }
  ```
* **Success Response (201):**
  ```json
  {
    "success": true,
    "message": "Placement drive scheduled",
    "data": { "drive_id": "022d4f5b-11bc-49b5-90ee-93d3b7daab90" }
  }
  ```

---

### 7. Document & Knowledge Hub (`/documents`)

#### `POST /documents/upload`
* **Purpose:** Uploads raw documents (PDF, DOCX) to repository.
* **Authentication:** JWT (Any role with upload capabilities).
* **Request Type:** `multipart/form-data` (requires parameter `file` binary and `doc_type`).
* **Success Response (201):**
  ```json
  {
    "success": true,
    "message": "Document uploaded successfully",
    "data": {
      "id": "18f9c211-ee44-48da-90bb-83df3e4881cc",
      "title": "academic_policies_2026.pdf",
      "file_url": "/storage/mit/documents/academic_policies_2026.pdf",
      "doc_type": "POLICY"
    }
  }
  ```

---

### 8. AI & Voice Streaming Channels (WebSocket)

#### `WS /api/v1/ai/chat`
* **Protocol:** WebSocket
* **Authentication:** Validated via query parameters: `/ws/chat?token=Bearer_JWT`
* **Lifecycle Events:**
  * **Client Send Message (Input):**
    ```json
    {
      "event": "user_message",
      "data": { "text": "What is the fee structure for B.Tech CSE?" }
    }
    ```
  * **Server Response (Streaming Output Tokens):**
    ```json
    {
      "event": "ai_token",
      "data": { "token": "The ", "is_final": false }
    }
    ```
  * **Server Complete Signal:**
    ```json
    {
      "event": "ai_complete",
      "data": { "full_response_text": "The fee structure is..." }
    }
    ```

#### `WS /api/v1/voice/signaling`
* **Protocol:** WebSocket (Signaling WebRTC exchange)
* **Authentication:** `/ws/voice/signaling?token=Bearer_JWT`
* **Payloads:** Standard WebRTC Session Description Protocol (SDP) offer/answer and ICE candidates exchange.
  * **Client Offer:**
    ```json
    {
      "event": "offer",
      "sdp": "v=0\r\no=- 46117314..."
    }
    ```
  * **Server Answer:**
    ```json
    {
      "event": "answer",
      "sdp": "v=0\r\no=- 89134112..."
    }
    ```
* **Media Stream:** Once signals are resolved, audio flows directly via WebRTC peer connection (UDP) using standard Opus media codecs.
