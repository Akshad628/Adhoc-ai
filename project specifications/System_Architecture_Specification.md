# ADhoc.ai

# Document 06 — System Architecture Specification (High-Level Architecture)

**Version:** 1.0

**Status:** Final

---

# 1. Purpose

This document defines the complete high-level architecture of ADhoc.ai.

It explains how every subsystem communicates, how data flows through the platform, and how frontend, backend, AI, databases, voice services, and external integrations interact to deliver the overall product experience.

This document serves as the primary architectural reference for frontend, backend, DevOps, AI, and infrastructure teams.

---

# 2. Architectural Philosophy

ADhoc.ai follows an **AI-First, API-Driven, Modular Enterprise Architecture**.

Every system component must remain:

* Independent
* Loosely Coupled
* Easily Maintainable
* Scalable
* Secure
* Replaceable
* Cloud Ready

Business logic must remain isolated from presentation logic.

---

# 3. High-Level Architecture

```text
                          USERS
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
 Marketing Website      SaaS Dashboard       Browser Voice Call
        │                     │                     │
        └──────────────┬──────┴──────────────┬──────┘
                       ▼
              React + TypeScript Frontend
                       │
         REST APIs + WebSockets + WebRTC
                       │
                FastAPI Backend Server
                       │
 ┌───────────┬──────────┬───────────┬──────────┬──────────┐
 │           │          │           │          │
 ▼           ▼          ▼           ▼          ▼
Auth      AI Engine  Voice Engine Database Analytics
 │           │          │           │          │
 │           │          │           │          │
JWT      Groq/Phi    Whisper     PostgreSQL Reports
OAuth    Prompt      Piper TTS   Storage     Metrics
RBAC     RAG         Twilio      Sessions    Logs
```

---

# 4. System Layers

The platform is divided into seven architectural layers.

---

## Layer 1 — Presentation Layer

Responsible for:

* Landing Website
* Authentication
* Dashboards
* AI Chat Interface
* Voice Interface
* Analytics
* Forms
* Tables
* Visualizations

Technology

* React
* TypeScript
* TailwindCSS
* Framer Motion
* GSAP
* React Three Fiber
* Three.js

Responsibilities

* Render UI
* Capture User Input
* Display Data
* Maintain State
* Trigger API Calls

---

## Layer 2 — Communication Layer

Responsible for communication between frontend and backend.

Protocols

REST APIs

WebSockets

WebRTC

Responsibilities

* API Requests
* Authentication
* Streaming Responses
* Voice Communication
* Live Notifications

---

## Layer 3 — Backend Layer

Technology

FastAPI

Responsibilities

* Business Logic
* Session Management
* Authentication
* Authorization
* API Routing
* AI Orchestration
* Workflow Execution
* Database Operations

---

## Layer 4 — AI Layer

Responsible for conversational intelligence.

Components

LLM

Prompt Engine

Memory

Knowledge Retrieval

Response Validation

Responsibilities

* Understand Context
* Generate Responses
* Retrieve Information
* Maintain Conversation Memory
* Route AI Tasks

Supported Models

Groq LLaMA

Microsoft Phi

---

## Layer 5 — Voice Layer

Responsible for voice communication.

Components

Speech-to-Text

Text-to-Speech

WebRTC

Twilio

Responsibilities

* Receive Audio
* Convert Speech
* Generate Responses
* Convert Text
* Stream Voice

---

## Layer 6 — Data Layer

Technology

PostgreSQL

Responsibilities

Store

Users

Institutions

Attendance

Fees

Courses

Documents

Chats

Voice Logs

Analytics

Reports

Permissions

Configurations

---

## Layer 7 — Infrastructure Layer

Responsible for deployment.

Components

Docker

Nginx

Ubuntu

GitHub Actions

SSL

Responsibilities

Deployment

Scaling

Security

Monitoring

Logging

Backups

Recovery

---

# 5. Frontend Architecture

The frontend follows a modular component-based architecture.

Major modules:

Landing Website

Authentication

Dashboard Layout

Role Modules

AI Components

Voice Components

Charts

Settings

Notifications

Profile

Common Components

Every module should be independently reusable.

---

# 6. Backend Architecture

The backend exposes REST APIs and WebSocket endpoints.

Responsibilities include:

Authentication

Authorization

Business Logic

AI Requests

Voice Streaming

Notifications

Database Operations

Workflow Management

Analytics

Document Processing

---

# 7. AI Architecture

The AI subsystem consists of:

Prompt Layer

↓

Context Builder

↓

Knowledge Retrieval

↓

LLM

↓

Response Validator

↓

Formatter

↓

Client

Responsibilities

* Understand requests
* Search knowledge
* Generate responses
* Maintain memory
* Return structured output

---

# 8. Voice Architecture

Voice Flow

User Speech

↓

Browser Microphone

↓

WebRTC

↓

FastAPI

↓

Speech-to-Text

↓

Prompt Engine

↓

LLM

↓

Text-to-Speech

↓

Browser Audio

Live transcripts should update continuously throughout the conversation.

---

# 9. Authentication Architecture

Authentication Flow

User Login

↓

Credentials

↓

FastAPI

↓

JWT

↓

Role Validation

↓

Session Creation

↓

Dashboard

Every API request must validate the access token before processing.

---

# 10. Role-Based Access Control

Permissions are evaluated using RBAC.

Roles include:

Student

Parent

Faculty

Counsellor

Placement Officer

Administrator

Super Administrator

Every request must validate:

Identity

Role

Permission

Institution

---

# 11. Database Architecture

The database is the single source of truth.

Primary entities include:

Users

Institutions

Roles

Permissions

Courses

Attendance

Fees

Scholarships

Placements

Documents

AI Conversations

Voice Calls

Notifications

Analytics

Audit Logs

Relationships are normalized to reduce redundancy and improve consistency.

---

# 12. AI Request Flow

User Message

↓

Frontend

↓

API

↓

Authentication

↓

Prompt Builder

↓

Knowledge Retrieval

↓

LLM

↓

Validation

↓

Response

↓

Conversation History

↓

Client

---

# 13. Voice Request Flow

Voice Input

↓

Speech-to-Text

↓

Prompt Engine

↓

AI

↓

Text Response

↓

Text-to-Speech

↓

Audio Stream

↓

Browser

---

# 14. Analytics Flow

Application Events

↓

Backend

↓

Database

↓

Aggregation

↓

Analytics Engine

↓

Dashboard

Analytics should update continuously without requiring page refreshes where possible.

---

# 15. Notification Flow

System Event

↓

Notification Service

↓

Database

↓

WebSocket

↓

Frontend

↓

User

Supported notification types:

Information

Success

Warning

Error

Reminder

---

# 16. Security Architecture

Security exists at every layer.

Frontend

Protected Routes

↓

Backend

JWT Validation

↓

Authorization

↓

Database Access

↓

Logging

↓

Audit Trail

No request reaches business logic before authentication and authorization succeed.

---

# 17. Deployment Architecture

Client

↓

Nginx

↓

React Application

↓

FastAPI

↓

AI Services

↓

PostgreSQL

↓

Storage

↓

Monitoring

All services should remain independently deployable.

---

# 18. Scalability Strategy

The architecture supports:

Horizontal Scaling

Stateless Backend Services

Database Optimization

API Versioning

Containerized Deployment

Load Balancing

Independent AI Services

Future microservice migration

---

# 19. Fault Tolerance

The platform should:

Retry temporary failures

Recover interrupted sessions

Maintain database consistency

Log unexpected failures

Provide meaningful error responses

Prevent cascading failures

---

# 20. Design Principles

Every architectural decision should satisfy:

* Separation of Concerns
* Single Responsibility Principle
* API-First Development
* Modular Components
* Secure by Default
* Scalable Infrastructure
* Performance Optimization
* Maintainability
* Reusability

---

# 21. Acceptance Criteria

The architecture is considered compliant when:

* All system layers communicate correctly.
* Authentication protects every secured resource.
* AI requests complete successfully.
* Voice conversations stream with low latency.
* Dashboards update dynamically.
* APIs remain modular and reusable.
* Infrastructure supports future scaling without redesign.

---

# 22. Document Approval

**Status:** Approved

This document establishes the high-level architectural blueprint for ADhoc.ai Version 1.0 and serves as the foundational reference for frontend, backend, AI, DevOps, and infrastructure implementation.
