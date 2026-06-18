# ADhoc.ai AI & Voice Architecture Specification

This document details the multi-agent AI system, the dynamic prompt assembly pipeline, and the WebRTC voice communication layer.

---

## 1. Modular AI Agent System

Instead of a single, generic conversational block, ADhoc.ai implements a **Role-Scoped Multi-Agent System**. Individual agents inherit system configurations but operate with isolated system prompts, RAG document parameters, and capabilities.

### Agent Registry

```text
                               ┌──────────────────┐
                               │   Router Agent   │
                               └────────┬─────────┘
                                        │ (Evaluates & delegates)
       ┌──────────────┬─────────────────┼─────────────────┬──────────────┐
       ▼              ▼                 ▼                 ▼              ▼
┌──────────────┐┌──────────────┐┌──────────────┐┌──────────────┐┌──────────────┐
│  Admission   ││   Student    ││    Parent    ││   Faculty    ││  Placement   │
│    Agent     ││    Agent     ││    Agent     ││    Agent     ││    Agent     │
└──────────────┘└──────────────┘└──────────────┘└──────────────┘└──────────────┘
```

#### 1. Router Agent
* **Responsibilities:** Analyzes incoming chat tokens. Identifies user role context (e.g., whether student query matches placements or academics) and routes to the specific sub-agent.
* **Escalation:** If a user query falls outside of institutional knowledge (e.g., personal inquiries or political concepts), it redirects immediately to the fallback safe agent.

#### 2. Admission Agent (Counselling Assistant)
* **Responsibilities:** Handles prospective student inquiries, explains courses, lists eligibility requirements, and guides lead conversion.
* **Context Access:** Institution prospectus documents, general tuition fee metrics, and enrollment guides.

#### 3. Student Agent
* **Responsibilities:** Answers academic questions, details student attendance percentage, lists assignment due dates, and links to course syllabi.
* **Context Access:** The student's private grade sheets, individual course syllabi, and calendar schedules.

#### 4. Parent Agent
* **Responsibilities:** Explains student academic performance, alerts parent to low attendance metrics, and details payment due dates.
* **Context Access:** Student attendance records, linked child academic history, and fee ledger summaries.

#### 5. Faculty Agent
* **Responsibilities:** Generates assessments, drafts lecture syllabi notes, compiles class metrics, and drafts announcements.
* **Context Access:** Academic curricula files, course materials database, and class attendance registers.

#### 6. Placement Agent
* **Responsibilities:** Suggests resume keywords, performs mock interview voice trials, checks registration deadlines.
* **Context Access:** Company recruitment sheets, student ATS scores, mock interview prompts, and placement timeline records.

---

## 2. Dynamic Prompt Pipeline

Every prompt sent to the LLM is assembled dynamically based on a contextual layer model:

```text
+-------------------------------------------------------------+
| System Prompt: Global behavioral guidelines, safety rules. |
+-------------------------------------------------------------+
                              +
+-------------------------------------------------------------+
| Role Prompt: Student, Parent, Faculty, Counsellor scopes.   |
+-------------------------------------------------------------+
                              +
+-------------------------------------------------------------+
| Institution Prompt: Subdomain brand, academic policies.    |
+-------------------------------------------------------------+
                              +
+-------------------------------------------------------------+
| Conversation Memory: Last 5 chat messages (from database).  |
+-------------------------------------------------------------+
                              +
+-------------------------------------------------------------+
| Retrieved Knowledge: RAG vector context chunks (pgvector).  |
+-------------------------------------------------------------+
                              +
+-------------------------------------------------------------+
| Current User Query: Raw text message or STT transcript.     |
+-------------------------------------------------------------+
```

### Safety & Output Verification
1. **Context Grounding Filter:** Prompt instructs the model to refuse response formatting if query parameters cannot be resolved from the retrieved knowledge.
2. **Pydantic Model Output:** To ensure compatibility with client charts and widgets, prompts instruct LLM outputs to structure responses inside clean JSON schemas (validated by Pydantic on the server).
3. **Local fallbacks:** If Groq API throws a rate-limit error (HTTP 429), the prompt engine is routed to a local Ollama container running the Microsoft Phi-3 model, ensuring high availability.

---

## 3. WebRTC-Based Voice Engine

To meet the NFR target latency of under 3 seconds, ADhoc.ai avoids standard HTTP polling and implements WebRTC for low-latency bidirectional voice streams.

```text
Browser User                    Signaling Gateway                 FastAPI Server
     │                                  │                                │
     ├────────── SDP Offer ────────────►│                                │
     │                                  ├───────── WebRTC Setup ────────►│
     │◄───────── SDP Answer ────────────┤                                │
     │                                  │                                │
     │◄────────────────────── WebRTC UDP Media Stream ──────────────────►│ (Opus Codec)
     │                                                                   │
     │                                                                   ▼
     │                                                           [ Audio Buffer ]
     │                                                                   │
     │                                                                   ▼
     │                                                           [ Whisper STT ]
     │                                                                   │
     │                                                                   ▼
     │                                                           [ Prompt Engine ]
     │                                                                   │
     │                                                                   ▼
     │                                                           [ LLM Output ]
     │                                                                   │
     │                                                                   ▼
     │                                                           [ Piper TTS ]
     │                                                                   │
     │◄────────────────────── Real-Time Audio Return ────────────────────┘ (Raw PCM stream)
```

### Key Protocols & Voice Lifecycles:
* **Audio Capture:** Browser captures microphone input using the Web Audio API at 16kHz (mono channel) and streams audio packets via a WebRTC `MediaStreamTrack`.
* **Speech-to-Text:** The backend processes audio frames using a local instance of Whisper STT. When silence threshold boundaries are detected (using Voice Activity Detection - VAD), the transcript is sent to the prompt engine.
* **Text-to-Speech:** The resulting LLM text tokens are piped to Piper TTS, which synthesizes audio chunks on the fly. These synthesized audio chunks are encoded to Opus packets and returned over the WebRTC audio track to the user.
* **Transcripts Sync:** As text tokens are processed, the server concurrently transmits the text transcript to the client dashboard via WebSockets so the user can read the conversation in real-time.
