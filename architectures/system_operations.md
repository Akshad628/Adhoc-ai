# ADhoc.ai System Operations Specification

This document details the internal systems logic, event-driven architectures, storage plans, environment maps, and deployment specifications for the ADhoc.ai platform.

---

## 1. Event-Driven Architecture

To keep the platform lightweight and performant without the overhead of Celery, the backend uses **FastAPI BackgroundTasks, asyncio task loops, and Redis PubSub** for asynchronous event propagation.

### Core System Events

| Event Name | Publisher | Subscribers | Asynchronous Action |
| :--- | :--- | :--- | :--- |
| `student_registered` | `/auth/register` | `notification_service`, `email_sender` | Dispatches email verification link, inserts initial student audit record. |
| `attendance_marked` | `/faculty/attendance` | `workflow_engine`, `parent_notifier` | Evaluates if attendance falls below 75%; triggers SMS/email alert to Parent. |
| `document_uploaded` | `/documents/upload` | `knowledge_indexing_worker` | Triggers recursive text parsing, chunks text, generates embeddings, and saves to pgvector. |
| `resume_uploaded` | `/placement/resume` | `ats_evaluation_worker` | Scans resume against job descriptors, calculates ATS scores using LLaMA. |
| `placement_scheduled` | `/placement/drives`| `notification_center` | Dispatches push alerts and calendar entries to all eligible students. |
| `payment_completed` | `/fees/payment` | `fee_ledger_service` | Generates official invoice PDF, stores it inside storage folder, sends confirmation receipt. |

### Asynchronous Implementation & Retry Strategy
* **Event Loop Dispatch:** FastAPI utilizes `asyncio.create_task` or `BackgroundTasks` to offload event logic immediately, keeping API responses under 300ms.
* **Transient Failure Recovery:** Network operations (e.g., email dispatch, external API calls) utilize exponential backoff retries (using the `tenacity` library) for up to 3 attempts.
* **Audit Logging:** Every event writes a success or failure status into the `workflow_executions` table, maintaining a verifiable institutional log.

---

## 2. Storage Strategy

To avoid paid cloud object storage fees, the system implements a unified local storage structure that maps to an S3-compatible API (using a self-hosted instance of **MinIO** or directly mapping persistent Docker volumes to local paths).

### Directory Layout (`/storage`)
```text
/storage/
├── [institution_id]/
│   ├── documents/
│   │   ├── student_profiles/   # Student uploaded files (Identity, Grades)
│   │   └── policies/           # Institution policy manuals (Knowledge Source)
│   ├── resumes/                # Uploaded PDF/DOCX resumes for ATS scanning
│   ├── voice_records/          # Optional call logs (.wav files)
│   └── reports/                # Generated PDF report cards, placement sheets
└── temp/                       # Temporary files directory for parsing cache
```

### Management Policies
* **Naming Convention:** Files are saved using UUID prefixes to prevent naming collisions:
  `[user_id]_[document_type]_[timestamp].[extension]`
* **Cleanup Strategy:** A lightweight background task runs at 02:00 AM daily, purging all files in `/storage/temp` that are older than 24 hours.
* **Security & Permissions:** Directly access files via the FastAPI gateway using signed tokens. Nginx blocks direct public URL listing for all directories under `/storage` to ensure confidentiality.

---

## 3. Docker Compose Architecture

The application runs inside a secure, containerized environment managed by Docker Compose.

```yaml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - frontend
      - backend
    volumes:
      - ./docker/nginx:/etc/nginx/conf.d
      - certs_vol:/etc/letsencrypt
    networks:
      - adhoc_net

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    networks:
      - adhoc_net

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - ./storage:/app/storage
    env_file:
      - .env
    networks:
      - adhoc_net

  postgres:
    image: pgvector/pgvector:pg16
    environment:
      POSTGRES_DB: adhoc_db
      POSTGRES_USER: adhoc_admin
      POSTGRES_PASSWORD: secure_db_password
    volumes:
      - db_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U adhoc_admin -d adhoc_db"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - adhoc_net

  redis:
    image: redis:alpine
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
    networks:
      - adhoc_net

  ollama:
    image: ollama/ollama:latest
    volumes:
      - ollama_models:/root/.ollama
    networks:
      - adhoc_net

networks:
  adhoc_net:
    driver: bridge

volumes:
  db_data:
  ollama_models:
  certs_vol:
```

---

## 4. Environment Variables Map

Create a `.env` file in the root folder containing the following configurations.

| Variable Name | Purpose | Example / Required Format |
| :--- | :--- | :--- |
| `ENVIRONMENT` | Defines system state (development/production). | `development` / `production` |
| `PORT` | API runtime port mapping. | `8000` |
| `DATABASE_URL` | PostgreSQL connection string. | `postgresql+asyncpg://adhoc_admin:password@postgres:5432/adhoc_db` |
| `REDIS_URL` | Redis endpoint link. | `redis://redis:6379/0` |
| `JWT_SECRET_KEY` | Cryptographic key for token signatures. | `32_byte_hexadecimal_string` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Expire time for JWT. | `15` |
| `REFRESH_TOKEN_EXPIRE_DAYS` | Expire time for Refresh Token. | `7` |
| `GROQ_API_KEY` | External Groq LLaMA models inference key. | `gsk_key_string` |
| `GOOGLE_CLIENT_ID` | Google OAuth registration identifier. | `client_id_string.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret. | `client_secret_string` |
| `MICROSOFT_CLIENT_ID` | Microsoft OAuth identifier. | `client_uuid_string` |
| `MICROSOFT_CLIENT_SECRET`| Microsoft OAuth secret. | `client_secret_string` |
| `OLLAMA_URL` | Local fallback Ollama endpoint inside container. | `http://ollama:11434` |
| `STORAGE_PATH` | Storage mount folder path. | `/app/storage` |

---

## 5. CI/CD Pipeline Design

```text
[ Commit Push ] ──► [ Lint & Format ] ──► [ Run Tests ] ──► [ Build Containers ] ──► [ Zero-Downtime Deploy ]
```

### GitHub Actions Stages
1. **Validation:** Executes code styling reviews:
   * Backend: Run `black --check .` and `flake8`.
   * Frontend: Run `npm run lint` and `npm run format:check`.
2. **Testing:** Spins up mock services and runs unit tests using `pytest` and Vitest.
3. **Database Migration Strategy:**
   * Backend startup triggers Alembic migrations automatically: `alembic upgrade head`.
   * If a migration fails, the deployment aborts, preventing broken databases.
4. **Deploy & Rollback:**
   * Nginx directs traffic to secondary containers during backend updates (Blue-Green deployment).
   * In case of service initialization failure (health check returns non-200), Nginx instantly routes requests back to primary containers.

---

## 6. Testing Strategy

| Test Category | Target Scope | Success Criteria |
| :--- | :--- | :--- |
| **Unit Tests** | DB operations, Pydantic schemas, password cryptos. | 100% assertions pass. Code coverage >80%. |
| **Integration Tests** | Multi-tenant isolation, database row operations. | Tests must confirm that users cannot access records belonging to other institutions. |
| **API Endpoints** | All protected routes under RBAC permissions. | Validation checks return HTTP 403 on invalid permissions. |
| **AI RAG Tests** | Context extraction accuracy, prompt formatting. | Output parses to correct Pydantic JSON structure. Fallbacks trigger on timeouts. |
| **Performance Tests**| Load testing via k6 on APIs, WebSockets. | API requests `<300ms`, socket response `<200ms` at 1000 concurrent calls. |
| **Accessibility** | Frontend dashboard forms, screen reads, high-contrast layouts. | WCAG AA compliance validation passes (using axe-core tests). |

---

## 7. Performance & Security Analysis

### Potential Bottlenecks & Caching
* **Vector Search Load:** Standard pgvector searches can slow down as the database grows.
  * *Mitigation:* Apply **HNSW indexing** on `embedding` columns. Use **Redis cache** to store query context associations for 1 hour.
* **Voice Transcription Latency:** Processing raw audio can block threads.
  * *Mitigation:* Offload STT processing using standard asynchronous task models.
* **Data Leak Risks:** Shared-database layouts run the risk of tenancy leakage.
  * *Mitigation:* Strictly implement PostgreSQL RLS. Audit policies automatically on each commit using custom integration test scripts.

---

## 8. Final Audit

### Foreseen Risks
1. **Groq Free-Tier Rate Limits:** Heavy production usage will exhaust token allocations quickly.
   * *Mitigation:* Set token budgets per user per day inside the `users` config settings.
2. **Local Audio Model Load:** Hosting local Whisper and Piper containers requires dedicated GPU routing in production.
   * *Mitigation:* Fall back to cloud APIs (HuggingFace, OpenRouter) if hardware bounds are reached.
3. **Drafting specifications:** Parent and Counsellor models are newly defined; schemas must remain loosely coupled to prevent dependency locks.

### Technical Debt to Avoid
* Do not write business logic inside UI React files; always isolate services in the `services/` layer.
* Never implement database interactions directly in FastAPI route paths; use repositories to decouple DB changes.
* Avoid raw SQL queries in application logic; manage all structural mutations through Alembic.
