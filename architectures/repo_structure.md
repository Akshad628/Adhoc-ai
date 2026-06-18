# ADhoc.ai Repository Structure Specification

This document defines the production folder structure for the ADhoc.ai project to maintain strict decoupling, clean boundaries, and support seamless code management for multiple years.

---

## 1. Project Organization Overview

The repository is organized as a monorepo containing distinct frontend, backend, docker, and infrastructure workspaces:

```text
ADhoc.ai/
│
├── .github/                 # CI/CD Workflows (Linting, Testing, Building)
├── architectures/           # Architectural Blueprints & Specs
├── project specifications/  # Core Requirements & User Journeys (Source of truth)
│
├── frontend/                # React 19 + TypeScript + Vite Single Page Application
│   ├── public/              # Global assets, favicon, index.html
│   └── src/                 # Application codebase
│
├── backend/                 # FastAPI (Python 3.12+) Service Layer
│   ├── app/                 # Main code packages
│   └── scripts/             # Data migration, seeding, and model setup scripts
│
├── docker/                  # Local and Production Docker-Compose configurations
│   ├── nginx/               # Configuration files for static routing & SSL
│   └── ollama/              # Model manifests and installation maps
│
├── storage/                 # Local directory mounts for simulated S3/MinIO
└── README.md                # General onboarding and setup notes
```

---

## 2. Detailed Directory Structure

### 1. Frontend Architecture (`/frontend`)
The React structure follows a feature-based modular layout:
* `src/app/`: Root layout config, providers (React Query, router), global styles.
* `src/components/`: Core UI design system components (buttons, input fields, modals, drawer, custom tables). Inherits shadcn/ui and Radix.
* `src/features/`: Independent business feature folders:
  * `/auth/`: Registration, Login, Forgot Password UI and logic.
  * `/student/`: Student Overview, Attendance line charts, course timeline.
  * `/faculty/`: Class lists, mark attendance bulk tables, grades manager.
  * `/parent/`: Academic indicators, fee invoices, advisory logs.
  * `/counsellor/`: Leads pipeline board, schedule calendar views.
  * `/placement/`: Recruitment campaigns, resume review ATS score boards.
  * `/admin/`: Prompt editor, knowledge document indexer, system audits.
* `src/hooks/`: Global custom React hooks (e.g., `useAuth`, `useWebSocket`).
* `src/services/`: Centralized API clients using Axios wrapped inside React Query wrappers.
* `src/store/`: Zustand stores for reactive UI states (e.g., token, user state).
* `src/styles/`: Design tokens, Tailwind base configurations.

---

### 2. Backend Architecture (`/backend`)
The backend is structured using a Clean Architecture Service-Repository layer:
* `app/main.py`: Gateway initialization, CORS handlers, routing setups.
* `app/api/`: Endpoint routing handlers:
  * `/v1/auth.py`: JWT Login/Register endpoints.
  * `/v1/student.py`: Course listings and attendance lookups.
  * `/v1/faculty.py`: Marks and attendance markers.
  * `/v1/counsellor.py`: Leads pipelines and counselling session audits.
  * `/v1/placement.py`: ATS resume evaluations and drives scheduler.
  * `/v1/admin.py`: Prompt version controls and settings.
* `app/services/`: Core business logic engine:
  * `ai_agent.py`: Prompt builder orchestrator.
  * `rag.py`: Parsers, vector loaders, similarity engines.
  * `voice.py`: Signaling and WebRTC session coordinators.
  * `workflow.py`: Event trigger state checks.
* `app/models/`: SQLAlchemy database models maps.
* `app/schemas/`: Pydantic payload models (request and response formatting models).
* `app/repositories/`: Data access layers wrapping raw SQL queries inside repository patterns.
* `app/middleware/`: JWT verification, multitenancy header injectors.
* `app/database/`: Postgres session instances, Alembic migration files directory.

---

### 3. Docker Configurations (`/docker`)
Contains containers templates:
* `nginx/`: Nginx reverse proxy configuration files containing HTTPS keys, proxy headers for WebSockets (`Upgrade` and `Connection` setups).
* `ollama/`: Docker configurations mapping local Phi-3 environments for the fallback system.
* `whisper/`: Configurations mapping local Whisper pipelines.
* `docker-compose.yml`: Local multi-container compose deployment template.
* `docker-compose.prod.yml`: Production environment container stack.
