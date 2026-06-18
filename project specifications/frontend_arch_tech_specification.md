# ADhoc.ai — Frontend Architecture & Technical Specification (v1.0)

## 1. Purpose

This document defines the frontend architecture, project structure, component system, state management, routing, UI implementation, animations, API integration, and performance standards for ADhoc.ai.

---

# 2. Technology Stack

Framework

* React 19
* TypeScript
* Vite

Styling

* Tailwind CSS
* shadcn/ui
* Radix UI

Animations

* Framer Motion
* GSAP
* Lenis
* React Three Fiber
* Three.js

Utilities

* Axios
* React Query (TanStack Query)
* React Hook Form
* Zod
* React Router
* Zustand

---

# 3. Frontend Architecture

```text
User

↓

React Application

↓

Pages

↓

Layouts

↓

Components

↓

Hooks

↓

Services

↓

REST API / WebSocket

↓

FastAPI
```

The frontend should remain modular and component-driven.

---

# 4. Recommended Folder Structure

```text
src/
│
├── app/
├── pages/
├── layouts/
├── routes/
├── components/
├── features/
├── hooks/
├── services/
├── store/
├── contexts/
├── lib/
├── utils/
├── assets/
├── types/
└── styles/
```

---

# 5. Application Layout

Application consists of

* Landing Website
* Authentication
* Dashboard

Dashboard Layout

```text
Top Navigation

↓

Sidebar

↓

Main Workspace

↓

AI Copilot

↓

Notification Center

↓

Voice Assistant
```

---

# 6. Routing

Public Routes

* /
* /about
* /pricing
* /login
* /signup

Protected Routes

* /dashboard
* /student/*
* /faculty/*
* /parent/*
* /placement/*
* /admin/*

Role Guards validate access before rendering pages.

---

# 7. State Management

Use Zustand for

* Authentication
* User Session
* Theme
* Notifications
* Voice State
* AI Conversation

Use React Query for

* API Data
* Caching
* Pagination
* Background Refresh
* Synchronization

---

# 8. Component Architecture

Reusable Components

* Button
* Card
* Input
* Table
* Modal
* Drawer
* Sheet
* Dialog
* Form
* Calendar
* Badge
* Avatar
* Tooltip
* Charts

Business Components

* Attendance Card
* Course Card
* Resume Viewer
* Analytics Widgets
* AI Chat
* Voice Panel

---

# 9. Design System

Follow a single design language.

Spacing

* 8px Grid

Colors

* Dark Theme
* Orange Accent
* Blue Accent

Typography

* Inter

Radius

* Rounded Cards
* Pill Buttons

Animations

* Smooth
* Minimal
* GPU Accelerated

---

# 10. API Integration

Every API call should pass through a centralized API client.

Example

```text
services/

auth.ts

student.ts

faculty.ts

placement.ts

analytics.ts

ai.ts
```

Automatically attach

* JWT Token
* Refresh Token
* Institution ID

---

# 11. AI Integration

Frontend Responsibilities

* Chat Interface
* Streaming Responses
* Markdown Rendering
* Code Highlighting
* Suggested Prompts
* Conversation History

Streaming via WebSocket.

---

# 12. Voice Integration

Components

* Microphone
* Live Transcript
* Audio Player
* Waveform
* Conversation Timer

Voice States

* Idle
* Listening
* Processing
* Speaking

---

# 13. Forms

Use

* React Hook Form
* Zod Validation

Every form supports

* Validation
* Loading
* Error
* Success
* Reset

---

# 14. Dashboard Widgets

Common Widgets

* Statistics
* Charts
* Calendar
* Tasks
* Activity Feed
* Notifications
* AI Summary
* Quick Actions

Widgets should be reusable across all dashboards.

---

# 15. Search

Global Search

Supports

* Students
* Faculty
* Documents
* Courses
* Companies
* AI Conversations

Features

* Debouncing
* Suggestions
* Keyboard Navigation
* Recent Searches

---

# 16. Notifications

Types

* Success
* Warning
* Error
* Information

Channels

* Toast
* Notification Center
* Browser Notifications

---

# 17. Performance

Optimization

* Lazy Loading
* Route Splitting
* Image Optimization
* Memoization
* Virtual Lists
* Code Splitting
* Suspense
* Prefetching

---

# 18. Security

* Protected Routes
* Secure Token Storage
* CSP Headers
* XSS Prevention
* CSRF Protection
* Input Validation
* File Validation

Never expose sensitive backend logic.

---

# 19. Responsive Design

Desktop

* Multi-column

Laptop

* Adaptive Grid

Tablet

* Drawer Navigation

Mobile

* Bottom Navigation
* Floating AI Button

---

# 20. Accessibility

Support

* Keyboard Navigation
* Screen Readers
* Focus Indicators
* Reduced Motion
* High Contrast
* ARIA Labels

---

# 21. Error Handling

Every screen supports

* Loading
* Empty State
* Error State
* Retry
* Offline Handling

---

# 22. Deployment

Build

```text
React

↓

Vite Build

↓

Nginx

↓

CDN
```

Production

* Minification
* Tree Shaking
* Compression
* Asset Caching
* Source Maps (Development Only)

---

# 23. Coding Standards

* Functional Components
* Custom Hooks
* Strict TypeScript
* Atomic Components
* Feature-Based Structure
* No Business Logic Inside UI Components

---

# 24. Performance Targets

| Component    | Target  |
| ------------ | ------- |
| Initial Load | <2 sec  |
| Dashboard    | <3 sec  |
| Route Change | <300 ms |
| Search       | <500 ms |
| Animation    | 60 FPS  |
| Lighthouse   | >95     |

---

# 25. Acceptance Criteria

The frontend implementation is complete when:

* All dashboards use reusable components.
* Responsive layouts work across all devices.
* API integration is centralized.
* AI and Voice modules stream in real time.
* Route protection is enforced.
* Performance meets defined benchmarks.
* UI follows the design system consistently.
* Accessibility standards are satisfied.
* Production build is optimized and deployment-ready.

---

**End of Document**
