# ADhoc.ai Database Design & ER Diagram Spec

This document defines the complete production database schema and logical Entity-Relationship (ER) mapping for ADhoc.ai in PostgreSQL.

---

## 1. Database Philosophy & Tenancy Model

The database is built on a **Shared-Database, Shared-Schema Multi-Tenant Model** utilizing PostgreSQL **Row-Level Security (RLS)**.
* Every table containing institutional data is isolated using an `institution_id` foreign key.
* Soft delete logic is implemented using a `deleted_at` timestamp. Queries are automatically filtered using views or active RLS policies (`WHERE deleted_at IS NULL`).
* Primary keys are `UUID` values generated on the server using `gen_random_uuid()` to prevent ID enumeration.
* Timestamps use `TIMESTAMP WITH TIME ZONE` (`TIMESTAMPTZ`) to maintain accurate audit records across local time zones.

---

## 2. Complete Database Schema Definitions

### 1. Multi-Tenancy & Identity Core

#### Table: `institutions`
* **Purpose:** Stores root configuration and schema isolation keys for educational institutions.
* **Columns:**
  * `id`: `UUID` (PRIMARY KEY, Default: `gen_random_uuid()`)
  * `name`: `VARCHAR(255)` (NOT NULL, UNIQUE)
  * `subdomain`: `VARCHAR(100)` (NOT NULL, UNIQUE, INDEX)
  * `logo_url`: `VARCHAR(512)` (NULLABLE)
  * `brand_color_primary`: `VARCHAR(7)` (NOT NULL, Default: `#FF7A18`)
  * `brand_color_secondary`: `VARCHAR(7)` (NOT NULL, Default: `#5B8CFF`)
  * `created_at`: `TIMESTAMPTZ` (NOT NULL, Default: `now()`)
  * `updated_at`: `TIMESTAMPTZ` (NOT NULL, Default: `now()`)
  * `deleted_at`: `TIMESTAMPTZ` (NULLABLE)

#### Table: `users`
* **Purpose:** Centralized user registry containing login credentials, multi-tenant link, and statuses.
* **Columns:**
  * `id`: `UUID` (PRIMARY KEY, Default: `gen_random_uuid()`)
  * `institution_id`: `UUID` (NOT NULL, FK -> `institutions(id)`, ON DELETE RESTRICT)
  * `full_name`: `VARCHAR(255)` (NOT NULL)
  * `email`: `VARCHAR(255)` (NOT NULL, UNIQUE, INDEX)
  * `phone_number`: `VARCHAR(50)` (NULLABLE)
  * `password_hash`: `VARCHAR(255)` (NULLABLE, for local password login)
  * `mfa_secret`: `VARCHAR(100)` (NULLABLE)
  * `account_status`: `VARCHAR(20)` (NOT NULL, Default: `'PENDING'`, Check: `account_status IN ('PENDING', 'ACTIVE', 'SUSPENDED', 'DISABLED', 'DELETED')`)
  * `created_at`: `TIMESTAMPTZ` (NOT NULL, Default: `now()`)
  * `updated_at`: `TIMESTAMPTZ` (NOT NULL, Default: `now()`)
  * `deleted_at`: `TIMESTAMPTZ` (NULLABLE)
* **Indexes:**
  * `idx_users_email_institution`: Unique index on `(email, institution_id)`

#### Table: `roles`
* **Purpose:** Stores role templates per institution.
* **Columns:**
  * `id`: `UUID` (PRIMARY KEY, Default: `gen_random_uuid()`)
  * `institution_id`: `UUID` (NOT NULL, FK -> `institutions(id)`, ON DELETE CASCADE)
  * `name`: `VARCHAR(100)` (NOT NULL)
  * `is_system_role`: `BOOLEAN` (NOT NULL, Default: `FALSE`)
  * `created_at`: `TIMESTAMPTZ` (NOT NULL, Default: `now()`)
  * `updated_at`: `TIMESTAMPTZ` (NOT NULL, Default: `now()`)
* **Constraints:**
  * Unique constraint on `(name, institution_id)`

#### Table: `permissions`
* **Purpose:** Global list of application access capabilities.
* **Columns:**
  * `id`: `UUID` (PRIMARY KEY, Default: `gen_random_uuid()`)
  * `name`: `VARCHAR(100)` (NOT NULL, UNIQUE)
  * `description`: `TEXT` (NULLABLE)

#### Table: `role_permissions`
* **Purpose:** Junction table mapping permissions to roles.
* **Columns:**
  * `role_id`: `UUID` (NOT NULL, FK -> `roles(id)`, ON DELETE CASCADE)
  * `permission_id`: `UUID` (NOT NULL, FK -> `permissions(id)`, ON DELETE CASCADE)
* **Primary Key:** `(role_id, permission_id)`

#### Table: `user_roles`
* **Purpose:** Junction table assigning roles to users.
* **Columns:**
  * `user_id`: `UUID` (NOT NULL, FK -> `users(id)`, ON DELETE CASCADE)
  * `role_id`: `UUID` (NOT NULL, FK -> `roles(id)`, ON DELETE CASCADE)
* **Primary Key:** `(user_id, role_id)`

#### Table: `oauth_accounts`
* **Purpose:** Links external SSO login entities (Google, Microsoft) to the local user account.
* **Columns:**
  * `id`: `UUID` (PRIMARY KEY, Default: `gen_random_uuid()`)
  * `user_id`: `UUID` (NOT NULL, FK -> `users(id)`, ON DELETE CASCADE)
  * `provider`: `VARCHAR(50)` (NOT NULL) (e.g. `'google'`, `'microsoft'`)
  * `provider_user_id`: `VARCHAR(255)` (NOT NULL)
  * `created_at`: `TIMESTAMPTZ` (NOT NULL, Default: `now()`)
* **Constraints:**
  * Unique constraint on `(provider, provider_user_id)`

#### Table: `sessions`
* **Purpose:** Active login session registry to track access devices and location history.
* **Columns:**
  * `id`: `UUID` (PRIMARY KEY, Default: `gen_random_uuid()`)
  * `user_id`: `UUID` (NOT NULL, FK -> `users(id)`, ON DELETE CASCADE)
  * `ip_address`: `VARCHAR(45)` (NULLABLE)
  * `user_agent`: `TEXT` (NULLABLE)
  * `last_activity_at`: `TIMESTAMPTZ` (NOT NULL, Default: `now()`)
  * `created_at`: `TIMESTAMPTZ` (NOT NULL, Default: `now()`)

#### Table: `refresh_tokens`
* **Purpose:** Registry for cryptographically secure long-term API access rotation.
* **Columns:**
  * `id`: `UUID` (PRIMARY KEY, Default: `gen_random_uuid()`)
  * `user_id`: `UUID` (NOT NULL, FK -> `users(id)`, ON DELETE CASCADE)
  * `token_hash`: `VARCHAR(255)` (NOT NULL, UNIQUE)
  * `expires_at`: `TIMESTAMPTZ` (NOT NULL)
  * `is_revoked`: `BOOLEAN` (NOT NULL, Default: `FALSE`)
  * `created_at`: `TIMESTAMPTZ` (NOT NULL, Default: `now()`)

---

### 2. User Profiles (Extensible Details)

#### Table: `student_profiles`
* **Purpose:** Stores student-specific parameters.
* **Columns:**
  * `id`: `UUID` (PRIMARY KEY, Default: `gen_random_uuid()`)
  * `user_id`: `UUID` (NOT NULL, UNIQUE, FK -> `users(id)`, ON DELETE CASCADE)
  * `roll_number`: `VARCHAR(50)` (NOT NULL)
  * `current_cgpa`: `NUMERIC(4,2)` (NOT NULL, Default: `0.00`)
  * `current_semester`: `INT` (NOT NULL, Default: `1`)
  * `placement_readiness_score`: `NUMERIC(5,2)` (NOT NULL, Default: `0.00`)
* **Constraints:**
  * Unique constraint on `(roll_number, user_id)`

#### Table: `parent_profiles`
* **Purpose:** Parent details database.
* **Columns:**
  * `id`: `UUID` (PRIMARY KEY, Default: `gen_random_uuid()`)
  * `user_id`: `UUID` (NOT NULL, UNIQUE, FK -> `users(id)`, ON DELETE CASCADE)

#### Table: `parent_student_mappings`
* **Purpose:** Junction table defining guardianship mapping.
* **Columns:**
  * `parent_id`: `UUID` (NOT NULL, FK -> `parent_profiles(id)`, ON DELETE CASCADE)
  * `student_id`: `UUID` (NOT NULL, FK -> `student_profiles(id)`, ON DELETE CASCADE)
* **Primary Key:** `(parent_id, student_id)`

#### Table: `faculty_profiles`
* **Purpose:** Faculty specific metrics database.
* **Columns:**
  * `id`: `UUID` (PRIMARY KEY, Default: `gen_random_uuid()`)
  * `user_id`: `UUID` (NOT NULL, UNIQUE, FK -> `users(id)`, ON DELETE CASCADE)
  * `employee_id`: `VARCHAR(50)` (NOT NULL)
  * `office_hours`: `VARCHAR(255)` (NULLABLE)
  * `biography`: `TEXT` (NULLABLE)

#### Table: `councellor_profiles`
* **Purpose:** Admission counsellor profiles.
* **Columns:**
  * `id`: `UUID` (PRIMARY KEY, Default: `gen_random_uuid()`)
  * `user_id`: `UUID` (NOT NULL, UNIQUE, FK -> `users(id)`, ON DELETE CASCADE)
  * `employee_id`: `VARCHAR(50)` (NOT NULL)

#### Table: `placement_officer_profiles`
* **Purpose:** Placement management profile details.
* **Columns:**
  * `id`: `UUID` (PRIMARY KEY, Default: `gen_random_uuid()`)
  * `user_id`: `UUID` (NOT NULL, UNIQUE, FK -> `users(id)`, ON DELETE CASCADE)
  * `employee_id`: `VARCHAR(50)` (NOT NULL)

#### Table: `admin_profiles`
* **Purpose:** Administrative parameters registry.
* **Columns:**
  * `id`: `UUID` (PRIMARY KEY, Default: `gen_random_uuid()`)
  * `user_id`: `UUID` (NOT NULL, UNIQUE, FK -> `users(id)`, ON DELETE CASCADE)
  * `employee_id`: `VARCHAR(50)` (NOT NULL)

---

### 3. Academics & Organization Structure

#### Table: `departments`
* **Purpose:** College department database (e.g. Computer Science).
* **Columns:**
  * `id`: `UUID` (PRIMARY KEY, Default: `gen_random_uuid()`)
  * `institution_id`: `UUID` (NOT NULL, FK -> `institutions(id)`, ON DELETE RESTRICT)
  * `name`: `VARCHAR(100)` (NOT NULL)
  * `code`: `VARCHAR(20)` (NOT NULL)
* **Constraints:**
  * Unique constraint on `(institution_id, code)`

#### Table: `programs`
* **Purpose:** Educational degrees database (e.g. B.Tech, M.Tech).
* **Columns:**
  * `id`: `UUID` (PRIMARY KEY, Default: `gen_random_uuid()`)
  * `department_id`: `UUID` (NOT NULL, FK -> `departments(id)`, ON DELETE RESTRICT)
  * `name`: `VARCHAR(255)` (NOT NULL)
  * `duration_years`: `INT` (NOT NULL, Default: `4`)

#### Table: `semesters`
* **Purpose:** Timeline segments configuration.
* **Columns:**
  * `id`: `UUID` (PRIMARY KEY, Default: `gen_random_uuid()`)
  * `institution_id`: `UUID` (NOT NULL, FK -> `institutions(id)`, ON DELETE CASCADE)
  * `academic_year`: `VARCHAR(20)` (NOT NULL) (e.g., `'2025-2026'`)
  * `term_number`: `INT` (NOT NULL)
  * `start_date`: `DATE` (NOT NULL)
  * `end_date`: `DATE` (NOT NULL)

#### Table: `courses`
* **Purpose:** Courses catalogue linked to departments.
* **Columns:**
  * `id`: `UUID` (PRIMARY KEY, Default: `gen_random_uuid()`)
  * `department_id`: `UUID` (NOT NULL, FK -> `departments(id)`, ON DELETE CASCADE)
  * `code`: `VARCHAR(50)` (NOT NULL)
  * `name`: `VARCHAR(255)` (NOT NULL)
  * `credits`: `INT` (NOT NULL)

#### Table: `subjects`
* **Purpose:** Individual semester classes map.
* **Columns:**
  * `id`: `UUID` (PRIMARY KEY, Default: `gen_random_uuid()`)
  * `course_id`: `UUID` (NOT NULL, FK -> `courses(id)`, ON DELETE CASCADE)
  * `semester_id`: `UUID` (NOT NULL, FK -> `semesters(id)`, ON DELETE CASCADE)
  * `faculty_id`: `UUID` (NOT NULL, FK -> `faculty_profiles(id)`, ON DELETE RESTRICT)

---

### 4. Classroom Operations & Progress

#### Table: `attendance`
* **Purpose:** Class student attendance records.
* **Columns:**
  * `id`: `UUID` (PRIMARY KEY, Default: `gen_random_uuid()`)
  * `subject_id`: `UUID` (NOT NULL, FK -> `subjects(id)`, ON DELETE CASCADE)
  * `student_id`: `UUID` (NOT NULL, FK -> `student_profiles(id)`, ON DELETE CASCADE)
  * `date`: `DATE` (NOT NULL)
  * `status`: `VARCHAR(20)` (NOT NULL, Check: `status IN ('PRESENT', 'ABSENT', 'EXCUSED')`)
  * `created_at`: `TIMESTAMPTZ` (NOT NULL, Default: `now()`)
* **Constraints:**
  * Unique constraint on `(subject_id, student_id, date)`

#### Table: `assignments`
* **Purpose:** Assignments posted by faculty.
* **Columns:**
  * `id`: `UUID` (PRIMARY KEY, Default: `gen_random_uuid()`)
  * `subject_id`: `UUID` (NOT NULL, FK -> `subjects(id)`, ON DELETE CASCADE)
  * `title`: `VARCHAR(255)` (NOT NULL)
  * `description`: `TEXT` (NULLABLE)
  * `due_date`: `TIMESTAMPTZ` (NOT NULL)
  * `max_marks`: `INT` (NOT NULL)
  * `file_url`: `VARCHAR(512)` (NULLABLE)
  * `created_at`: `TIMESTAMPTZ` (NOT NULL, Default: `now()`)

#### Table: `assignment_submissions`
* **Purpose:** Student submissions storage.
* **Columns:**
  * `id`: `UUID` (PRIMARY KEY, Default: `gen_random_uuid()`)
  * `assignment_id`: `UUID` (NOT NULL, FK -> `assignments(id)`, ON DELETE CASCADE)
  * `student_id`: `UUID` (NOT NULL, FK -> `student_profiles(id)`, ON DELETE CASCADE)
  * `submission_text`: `TEXT` (NULLABLE)
  * `file_url`: `VARCHAR(512)` (NULLABLE)
  * `submitted_at`: `TIMESTAMPTZ` (NOT NULL, Default: `now()`)
  * `marks_obtained`: `NUMERIC(5,2)` (NULLABLE)
  * `grading_feedback`: `TEXT` (NULLABLE)

#### Table: `assessments`
* **Purpose:** In-class evaluations (quizzes, lab work, midterms).
* **Columns:**
  * `id`: `UUID` (PRIMARY KEY, Default: `gen_random_uuid()`)
  * `subject_id`: `UUID` (NOT NULL, FK -> `subjects(id)`, ON DELETE CASCADE)
  * `name`: `VARCHAR(100)` (NOT NULL)
  * `max_score`: `NUMERIC(5,2)` (NOT NULL)
  * `date`: `DATE` (NOT NULL)

#### Table: `grades`
* **Purpose:** Registry for consolidated student assessment performance.
* **Columns:**
  * `id`: `UUID` (PRIMARY KEY, Default: `gen_random_uuid()`)
  * `assessment_id`: `UUID` (NOT NULL, FK -> `assessments(id)`, ON DELETE CASCADE)
  * `student_id`: `UUID` (NOT NULL, FK -> `student_profiles(id)`, ON DELETE CASCADE)
  * `score_obtained`: `NUMERIC(5,2)` (NOT NULL)
* **Constraints:**
  * Unique constraint on `(assessment_id, student_id)`

#### Table: `exams`
* **Purpose:** Registry for institutional terminal exams.
* **Columns:**
  * `id`: `UUID` (PRIMARY KEY, Default: `gen_random_uuid()`)
  * `semester_id`: `UUID` (NOT NULL, FK -> `semesters(id)`, ON DELETE CASCADE)
  * `subject_id`: `UUID` (NOT NULL, FK -> `subjects(id)`, ON DELETE CASCADE)
  * `exam_date`: `TIMESTAMP` (NOT NULL)
  * `room`: `VARCHAR(50)` (NULLABLE)

#### Table: `hall_tickets`
* **Purpose:** Exam hall gatepasses.
* **Columns:**
  * `id`: `UUID` (PRIMARY KEY, Default: `gen_random_uuid()`)
  * `student_id`: `UUID` (NOT NULL, FK -> `student_profiles(id)`, ON DELETE CASCADE)
  * `semester_id`: `UUID` (NOT NULL, FK -> `semesters(id)`, ON DELETE CASCADE)
  * `reference_code`: `VARCHAR(100)` (NOT NULL, UNIQUE)
  * `is_approved`: `BOOLEAN` (NOT NULL, Default: `FALSE`)

---

### 5. Finances & Admissions Support

#### Table: `scholarships`
* **Purpose:** Catalog of institutional scholarships.
* **Columns:**
  * `id`: `UUID` (PRIMARY KEY, Default: `gen_random_uuid()`)
  * `institution_id`: `UUID` (NOT NULL, FK -> `institutions(id)`, ON DELETE CASCADE)
  * `name`: `VARCHAR(255)` (NOT NULL)
  * `amount`: `NUMERIC(10,2)` (NOT NULL)
  * `eligibility_cgpa`: `NUMERIC(3,2)` (NOT NULL, Default: `0.00`)
  * `deadline`: `DATE` (NOT NULL)

#### Table: `scholarship_applications`
* **Purpose:** Tracks scholarship requests.
* **Columns:**
  * `id`: `UUID` (PRIMARY KEY, Default: `gen_random_uuid()`)
  * `scholarship_id`: `UUID` (NOT NULL, FK -> `scholarships(id)`, ON DELETE CASCADE)
  * `student_id`: `UUID` (NOT NULL, FK -> `student_profiles(id)`, ON DELETE CASCADE)
  * `status`: `VARCHAR(20)` (NOT NULL, Default: `'PENDING'`, Check: `status IN ('PENDING', 'APPROVED', 'REJECTED')`)
  * `created_at`: `TIMESTAMPTZ` (NOT NULL, Default: `now()`)

#### Table: `fees`
* **Purpose:** Semester fee definitions.
* **Columns:**
  * `id`: `UUID` (PRIMARY KEY, Default: `gen_random_uuid()`)
  * `student_id`: `UUID` (NOT NULL, FK -> `student_profiles(id)`, ON DELETE CASCADE)
  * `semester_id`: `UUID` (NOT NULL, FK -> `semesters(id)`, ON DELETE CASCADE)
  * `total_due`: `NUMERIC(10,2)` (NOT NULL)
  * `due_date`: `DATE` (NOT NULL)

#### Table: `fee_payments`
* **Purpose:** Payment transaction registry.
* **Columns:**
  * `id`: `UUID` (PRIMARY KEY, Default: `gen_random_uuid()`)
  * `fee_id`: `UUID` (NOT NULL, FK -> `fees(id)`, ON DELETE RESTRICT)
  * `amount_paid`: `NUMERIC(10,2)` (NOT NULL)
  * `payment_method`: `VARCHAR(50)` (NOT NULL)
  * `transaction_reference`: `VARCHAR(100)` (NOT NULL, UNIQUE)
  * `payment_status`: `VARCHAR(20)` (NOT NULL, Default: `'COMPLETED'`)
  * `paid_at`: `TIMESTAMPTZ` (NOT NULL, Default: `now()`)

---

### 6. Document Storage & Vector RAG

#### Table: `documents`
* **Purpose:** Global upload directory metadata.
* **Columns:**
  * `id`: `UUID` (PRIMARY KEY, Default: `gen_random_uuid()`)
  * `institution_id`: `UUID` (NOT NULL, FK -> `institutions(id)`, ON DELETE CASCADE)
  * `owner_id`: `UUID` (NOT NULL, FK -> `users(id)`, ON DELETE CASCADE)
  * `title`: `VARCHAR(255)` (NOT NULL)
  * `file_url`: `VARCHAR(512)` (NOT NULL)
  * `doc_type`: `VARCHAR(50)` (NOT NULL) (e.g. `'POLICY'`, `'RESUME'`)
  * `is_verified`: `BOOLEAN` (NOT NULL, Default: `FALSE`)
  * `created_at`: `TIMESTAMPTZ` (NOT NULL, Default: `now()`)

#### Table: `knowledge_bases`
* **Purpose:** Collection details for RAG vector parsing.
* **Columns:**
  * `id`: `UUID` (PRIMARY KEY, Default: `gen_random_uuid()`)
  * `institution_id`: `UUID` (NOT NULL, FK -> `institutions(id)`, ON DELETE CASCADE)
  * `document_id`: `UUID` (NOT NULL, UNIQUE, FK -> `documents(id)`, ON DELETE CASCADE)
  * `indexed_status`: `VARCHAR(20)` (NOT NULL, Default: `'PENDING'`, Check: `indexed_status IN ('PENDING', 'INDEXED', 'FAILED')`)
  * `last_indexed_at`: `TIMESTAMPTZ` (NULLABLE)

#### Table: `knowledge_chunks`
* **Purpose:** Text chunks and numerical embeddings for vector search.
* **Columns:**
  * `id`: `UUID` (PRIMARY KEY, Default: `gen_random_uuid()`)
  * `knowledge_base_id`: `UUID` (NOT NULL, FK -> `knowledge_bases(id)`, ON DELETE CASCADE)
  * `chunk_index`: `INT` (NOT NULL)
  * `content`: `TEXT` (NOT NULL)
  * `embedding`: `vector(384)` (NOT NULL) (using `pgvector` 384-dimension embeddings, matching standard SentenceTransformers like MiniLM)
* **Indexes:**
  * `idx_knowledge_chunks_embedding` (using HNSW or IVFFlat index on `embedding`)

---

### 7. AI & Voice Communication Logs

#### Table: `ai_conversations`
* **Purpose:** Active chat sessions.
* **Columns:**
  * `id`: `UUID` (PRIMARY KEY, Default: `gen_random_uuid()`)
  * `user_id`: `UUID` (NOT NULL, FK -> `users(id)`, ON DELETE CASCADE)
  * `agent_role`: `VARCHAR(50)` (NOT NULL) (e.g., `'STUDENT'`, `'FACULTY'`, `'PARENT'`)
  * `created_at`: `TIMESTAMPTZ` (NOT NULL, Default: `now()`)

#### Table: `ai_messages`
* **Purpose:** Conversational chat messages logs.
* **Columns:**
  * `id`: `UUID` (PRIMARY KEY, Default: `gen_random_uuid()`)
  * `conversation_id`: `UUID` (NOT NULL, FK -> `ai_conversations(id)`, ON DELETE CASCADE)
  * `sender`: `VARCHAR(10)` (NOT NULL, Check: `sender IN ('USER', 'AI')`)
  * `message_text`: `TEXT` (NOT NULL)
  * `created_at`: `TIMESTAMPTZ` (NOT NULL, Default: `now()`)

#### Table: `voice_sessions`
* **Purpose:** Real-time WebRTC audio interactions registry.
* **Columns:**
  * `id`: `UUID` (PRIMARY KEY, Default: `gen_random_uuid()`)
  * `user_id`: `UUID` (NOT NULL, FK -> `users(id)`, ON DELETE CASCADE)
  * `duration_seconds`: `INT` (NOT NULL, Default: `0`)
  * `transcript`: `TEXT` (NULLABLE)
  * `call_direction`: `VARCHAR(10)` (NOT NULL, Default: `'INBOUND'`, Check: `call_direction IN ('INBOUND', 'OUTBOUND')`)
  * `created_at`: `TIMESTAMPTZ` (NOT NULL, Default: `now()`)

#### Table: `voice_logs`
* **Purpose:** Call log timestamps audit.
* **Columns:**
  * `id`: `UUID` (PRIMARY KEY, Default: `gen_random_uuid()`)
  * `voice_session_id`: `UUID` (NOT NULL, FK -> `voice_sessions(id)`, ON DELETE CASCADE)
  * `event_type`: `VARCHAR(50)` (NOT NULL) (e.g., `'CALL_START'`, `'USER_SPEAKING'`, `'AI_SPEAKING'`, `'CALL_END'`)
  * `created_at`: `TIMESTAMPTZ` (NOT NULL, Default: `now()`)

---

### 8. Workflows & Notifications Engine

#### Table: `workflow_definitions`
* **Purpose:** Configuration file defining automated trigger actions.
* **Columns:**
  * `id`: `UUID` (PRIMARY KEY, Default: `gen_random_uuid()`)
  * `institution_id`: `UUID` (NOT NULL, FK -> `institutions(id)`, ON DELETE CASCADE)
  * `name`: `VARCHAR(100)` (NOT NULL)
  * `trigger_event`: `VARCHAR(100)` (NOT NULL) (e.g. `'ATTENDANCE_MARKED'`)
  * `conditions`: `JSONB` (NOT NULL, Default: `'{}'::jsonb`)
  * `actions`: `JSONB` (NOT NULL, Default: `'[]'::jsonb`)
  * `is_active`: `BOOLEAN` (NOT NULL, Default: `TRUE`)
  * `created_at`: `TIMESTAMPTZ` (NOT NULL, Default: `now()`)

#### Table: `workflow_executions`
* **Purpose:** History log of trigger executions.
* **Columns:**
  * `id`: `UUID` (PRIMARY KEY, Default: `gen_random_uuid()`)
  * `workflow_definition_id`: `UUID` (NOT NULL, FK -> `workflow_definitions(id)`, ON DELETE CASCADE)
  * `triggered_by_entity_id`: `UUID` (NOT NULL)
  * `status`: `VARCHAR(20)` (NOT NULL) (Check: `status IN ('SUCCESS', 'FAILED')`)
  * `execution_logs`: `TEXT` (NULLABLE)
  * `executed_at`: `TIMESTAMPTZ` (NOT NULL, Default: `now()`)

#### Table: `notifications`
* **Purpose:** Global user dashboard and push notifications log.
* **Columns:**
  * `id`: `UUID` (PRIMARY KEY, Default: `gen_random_uuid()`)
  * `user_id`: `UUID` (NOT NULL, FK -> `users(id)`, ON DELETE CASCADE)
  * `title`: `VARCHAR(255)` (NOT NULL)
  * `message`: `TEXT` (NOT NULL)
  * `priority`: `VARCHAR(10)` (NOT NULL, Default: `'MEDIUM'`, Check: `priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')`)
  * `is_read`: `BOOLEAN` (NOT NULL, Default: `FALSE`)
  * `created_at`: `TIMESTAMPTZ` (NOT NULL, Default: `now()`)

#### Table: `analytics_events`
* **Purpose:** Usage logging repository for system charts metrics.
* **Columns:**
  * `id`: `UUID` (PRIMARY KEY, Default: `gen_random_uuid()`)
  * `institution_id`: `UUID` (NOT NULL, FK -> `institutions(id)`, ON DELETE CASCADE)
  * `user_id`: `UUID` (NULLABLE, FK -> `users(id)`, ON DELETE SET NULL)
  * `event_type`: `VARCHAR(100)` (NOT NULL)
  * `payload`: `JSONB` (NULLABLE)
  * `created_at`: `TIMESTAMPTZ` (NOT NULL, Default: `now()`)

---

### 9. Prompt Management & Agent Config

#### Table: `prompt_templates`
* **Purpose:** Prompt templates database.
* **Columns:**
  * `id`: `UUID` (PRIMARY KEY, Default: `gen_random_uuid()`)
  * `institution_id`: `UUID` (NOT NULL, FK -> `institutions(id)`, ON DELETE CASCADE)
  * `name`: `VARCHAR(100)` (NOT NULL)
  * `system_prompt`: `TEXT` (NOT NULL)
  * `version`: `INT` (NOT NULL, Default: `1`)
  * `created_at`: `TIMESTAMPTZ` (NOT NULL, Default: `now()`)
* **Constraints:**
  * Unique constraint on `(name, version, institution_id)`

#### Table: `ai_agent_configs`
* **Purpose:** Global parameter maps for the AI modules.
* **Columns:**
  * `id`: `UUID` (PRIMARY KEY, Default: `gen_random_uuid()`)
  * `institution_id`: `UUID` (NOT NULL, FK -> `institutions(id)`, ON DELETE CASCADE)
  * `agent_type`: `VARCHAR(50)` (NOT NULL) (Check: `agent_type IN ('ADMISSION', 'STUDENT', 'PARENT', 'FACULTY', 'COUNSELLOR', 'PLACEMENT', 'ADMINISTRATOR')`)
  * `model_name`: `VARCHAR(100)` (NOT NULL, Default: `'llama3.3-70b'`)
  * `temperature`: `NUMERIC(3,2)` (NOT NULL, Default: `0.70`)
  * `is_active`: `BOOLEAN` (NOT NULL, Default: `TRUE`)
  * `prompt_template_id`: `UUID` (NOT NULL, FK -> `prompt_templates(id)`, ON DELETE RESTRICT)

---

### 10. Placement Management

#### Table: `companies`
* **Purpose:** Recruitment partner profiles.
* **Columns:**
  * `id`: `UUID` (PRIMARY KEY, Default: `gen_random_uuid()`)
  * `institution_id`: `UUID` (NOT NULL, FK -> `institutions(id)`, ON DELETE CASCADE)
  * `name`: `VARCHAR(255)` (NOT NULL)
  * `industry`: `VARCHAR(100)` (NULLABLE)
  * `contact_email`: `VARCHAR(255)` (NOT NULL)
  * `contact_phone`: `VARCHAR(50)` (NULLABLE)
  * `website`: `VARCHAR(255)` (NULLABLE)

#### Table: `placement_drives`
* **Purpose:** Campus recruitment calendar.
* **Columns:**
  * `id`: `UUID` (PRIMARY KEY, Default: `gen_random_uuid()`)
  * `company_id`: `UUID` (NOT NULL, FK -> `companies(id)`, ON DELETE CASCADE)
  * `drive_date`: `DATE` (NOT NULL)
  * `eligible_cgpa`: `NUMERIC(4,2)` (NOT NULL, Default: `0.00`)
  * `registration_deadline`: `DATE` (NOT NULL)
  * `status`: `VARCHAR(20)` (NOT NULL, Default: `'UPCOMING'`)

#### Table: `resumes`
* **Purpose:** Student upload metadata registry with parsed ATS feedback.
* **Columns:**
  * `id`: `UUID` (PRIMARY KEY, Default: `gen_random_uuid()`)
  * `student_id`: `UUID` (NOT NULL, FK -> `student_profiles(id)`, ON DELETE CASCADE)
  * `document_id`: `UUID` (NOT NULL, UNIQUE, FK -> `documents(id)`, ON DELETE CASCADE)
  * `ats_score`: `NUMERIC(5,2)` (NOT NULL, Default: `0.00`)
  * `parsed_text`: `TEXT` (NULLABLE)
  * `feedback`: `JSONB` (NULLABLE)

#### Table: `interviews`
* **Purpose:** Interview schedule entries.
* **Columns:**
  * `id`: `UUID` (PRIMARY KEY, Default: `gen_random_uuid()`)
  * `student_id`: `UUID` (NOT NULL, FK -> `student_profiles(id)`, ON DELETE CASCADE)
  * `drive_id`: `UUID` (NOT NULL, FK -> `placement_drives(id)`, ON DELETE CASCADE)
  * `interview_date`: `TIMESTAMPTZ` (NOT NULL)
  * `mode`: `VARCHAR(20)` (NOT NULL, Default: `'ONLINE'`)
  * `status`: `VARCHAR(20)` (NOT NULL, Default: `'SCHEDULED'`)
  * `feedback`: `TEXT` (NULLABLE)
  * `outcome`: `VARCHAR(20)` (NOT NULL, Default: `'PENDING'`)

#### Table: `offers`
* **Purpose:** Released job offer tracking.
* **Columns:**
  * `id`: `UUID` (PRIMARY KEY, Default: `gen_random_uuid()`)
  * `student_id`: `UUID` (NOT NULL, FK -> `student_profiles(id)`, ON DELETE CASCADE)
  * `company_id`: `UUID` (NOT NULL, FK -> `companies(id)`, ON DELETE CASCADE)
  * `package_lpa`: `NUMERIC(10,2)` (NOT NULL)
  * `acceptance_status`: `VARCHAR(20)` (NOT NULL, Default: `'PENDING'`, Check: `acceptance_status IN ('PENDING', 'ACCEPTED', 'DECLINED')`)
  * `joining_date`: `DATE` (NULLABLE)

---

### 11. Core Administration & Audits

#### Table: `audit_logs`
* **Purpose:** Strict audit trail registry mapping user session transactions.
* **Columns:**
  * `id`: `UUID` (PRIMARY KEY, Default: `gen_random_uuid()`)
  * `user_id`: `UUID` (NULLABLE, FK -> `users(id)`, ON DELETE SET NULL)
  * `institution_id`: `UUID` (NOT NULL, FK -> `institutions(id)`, ON DELETE CASCADE)
  * `action`: `VARCHAR(255)` (NOT NULL)
  * `ip_address`: `VARCHAR(45)` (NOT NULL)
  * `created_at`: `TIMESTAMPTZ` (NOT NULL, Default: `now()`)

#### Table: `settings`
* **Purpose:** Extensible configuration key-value storage for institutions.
* **Columns:**
  * `id`: `UUID` (PRIMARY KEY, Default: `gen_random_uuid()`)
  * `institution_id`: `UUID` (NOT NULL, UNIQUE, FK -> `institutions(id)`, ON DELETE CASCADE)
  * `configuration`: `JSONB` (NOT NULL, Default: `'{}'::jsonb`)
  * `updated_at`: `TIMESTAMPTZ` (NOT NULL, Default: `now()`)

#### Table: `feature_flags`
* **Purpose:** Multi-tenant feature toggling framework database.
* **Columns:**
  * `id`: `UUID` (PRIMARY KEY, Default: `gen_random_uuid()`)
  * `name`: `VARCHAR(100)` (NOT NULL, UNIQUE)
  * `description`: `TEXT` (NULLABLE)
  * `is_globally_enabled`: `BOOLEAN` (NOT NULL, Default: `FALSE`)

#### Table: `tenant_feature_flags`
* **Purpose:** Junction override registry mapping feature flags dynamically to tenants.
* **Columns:**
  * `institution_id`: `UUID` (NOT NULL, FK -> `institutions(id)`, ON DELETE CASCADE)
  * `feature_flag_id`: `UUID` (NOT NULL, FK -> `feature_flags(id)`, ON DELETE CASCADE)
  * `is_enabled`: `BOOLEAN` (NOT NULL, Default: `TRUE`)
* **Primary Key:** `(institution_id, feature_flag_id)`
