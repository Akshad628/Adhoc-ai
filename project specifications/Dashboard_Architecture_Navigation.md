# ADhoc.ai

# Document 10 — Dashboard Architecture & Navigation Specification

**Version:** 1.0

**Status:** Final

---

# 1. Purpose

This document defines the global dashboard architecture for ADhoc.ai.

Rather than describing each dashboard individually, this document establishes the common layout, navigation system, interaction model, responsive behavior, and shared components used across every authenticated experience.

Every role-specific dashboard (Student, Parent, Faculty, Counsellor, Placement Officer, Administrator, and Super Administrator) must inherit this architecture.

---

# 2. Design Philosophy

The dashboard should feel like an enterprise AI operating system rather than a traditional ERP.

Primary characteristics:

* Minimal
* Modern
* AI-first
* Fast
* Spacious
* Premium
* Highly interactive
* Consistent

The dashboard should remain visually consistent with the landing website while prioritizing productivity over storytelling.

---

# 3. Dashboard Layout

Desktop Layout

```text
┌────────────────────────────────────────────────────────────┐
│                    Top Navigation Bar                      │
├──────────────┬─────────────────────────────────────────────┤
│              │                                             │
│              │                                             │
│              │                                             │
│   Sidebar    │            Main Content Area               │
│ Navigation   │                                             │
│              │                                             │
│              │                                             │
│              │                                             │
├──────────────┴─────────────────────────────────────────────┤
│                   Status / Notifications                  │
└────────────────────────────────────────────────────────────┘
```

---

# 4. Primary Layout Components

Every dashboard contains:

* Sidebar Navigation
* Top Navigation
* Main Workspace
* Notification Center
* AI Copilot
* Voice Assistant
* User Profile
* Command Palette
* Search

---

# 5. Sidebar Navigation

Position:

Left

Behavior:

Fixed

Collapsible

Scrollable

Persistent

---

Expanded Width

280px

Collapsed Width

88px

---

Navigation Items

Dashboard

AI Copilot

Role Modules

Notifications

Documents

Analytics

Settings

Profile

Logout

Navigation should indicate:

* Active page
* Hover state
* Notification badges
* Expansion state

---

# 6. Top Navigation

The top navigation remains fixed.

Contains:

Global Search

Command Palette Shortcut

Notification Bell

Voice Assistant

Institution Selector (if applicable)

Profile Menu

Quick Actions

Current Page Title

Breadcrumb Navigation

---

Height

72px

Glass background with slight blur.

---

# 7. Global Search

Purpose

Search the entire platform.

Search should support:

Students

Parents

Faculty

Documents

Courses

Fees

Attendance

Conversations

Notifications

Settings

AI Conversations

Recent Items

---

Search Behavior

Instant suggestions

Keyboard navigation

Search history

Recent searches

Search highlighting

---

# 8. Command Palette

Shortcut

Ctrl + K

Purpose

Provide keyboard-first navigation.

Examples

Open Dashboard

Search Student

View Attendance

Open Notifications

Start AI Chat

Upload Document

Navigate to Settings

---

The command palette should appear as a centered modal.

---

# 9. Notification Center

Notification Types

Information

Success

Warning

Error

Reminder

Academic

Administrative

Placement

Voice

AI

Each notification contains:

Title

Description

Timestamp

Priority

Read Status

Action Button

---

# 10. AI Copilot Panel

Accessible globally.

Desktop

Docked right panel.

Tablet

Slide-over panel.

Mobile

Fullscreen overlay.

Capabilities

Chat

Voice

Document Search

Institution Knowledge

Recommendations

Conversation History

---

The AI Copilot remains available from every dashboard screen.

---

# 11. Voice Assistant

Persistent floating action button.

States

Idle

Listening

Processing

Speaking

Completed

Voice interface displays:

Waveform

Live Transcript

Microphone Status

End Call

Conversation Timer

---

# 12. Main Workspace

Purpose

Display page-specific content.

Characteristics

Responsive

Scrollable

Consistent spacing

Large content width

Card-based layout

Widgets should align using a responsive grid.

---

# 13. Widget System

Every dashboard is built using reusable widgets.

Widget Types

Statistics

Charts

Tables

Recent Activity

Tasks

Notifications

Calendar

AI Summary

Quick Actions

Progress Indicators

Widgets must support:

Loading State

Empty State

Error State

Refresh

Fullscreen

---

# 14. Card System

Cards remain the primary UI component.

Each card includes:

Title

Description

Primary Content

Optional Actions

Hover Effect

Loading Placeholder

Cards should never exceed comfortable reading widths.

---

# 15. Breadcrumb Navigation

Every internal page displays:

Dashboard

>

Current Module

>

Current Page

This helps users understand hierarchy.

---

# 16. User Profile Menu

Contains

Profile

Preferences

Theme (Future)

Activity

Sessions

Help

Logout

---

# 17. Responsive Behavior

Desktop

Full sidebar

Multi-column layouts

---

Laptop

Reduced spacing

Collapsible sidebar

---

Tablet

Hidden sidebar

Drawer navigation

---

Mobile

Bottom navigation

Hamburger menu

Single-column layouts

Floating AI button

---

# 18. Dashboard Home Page

Every dashboard homepage should include:

Greeting

Quick Statistics

Recent Activity

Notifications

Upcoming Events

AI Summary

Quick Actions

Role-specific widgets

The dashboard should immediately answer:

"What do I need to do today?"

---

# 19. Quick Actions

Every dashboard contains role-specific shortcuts.

Examples

Upload Document

Start AI Chat

Create Report

Call Student

Book Appointment

Generate Analytics

These actions should reduce navigation depth.

---

# 20. Empty States

Every module should include meaningful empty states.

Example

"No notifications yet."

Provide:

Illustration

Helpful text

Suggested action

---

# 21. Loading States

Use skeleton components.

Never display blank pages.

Charts

Tables

Cards

Widgets

Forms

All require loading placeholders.

---

# 22. Error States

Errors should include:

Friendly message

Retry button

Support option

No technical stack traces.

---

# 23. Dashboard Animations

Animations should be subtle.

Allowed animations

Fade

Scale

Slide

Opacity

Number Counters

Progress Bars

Hover Lift

Accordion

Drawer

Avoid excessive movement.

---

# 24. Keyboard Accessibility

Support

Tab Navigation

Enter

Escape

Arrow Keys

Ctrl + K

Accessible focus indicators required.

---

# 25. Session Persistence

The dashboard should preserve:

Sidebar state

Last visited page

Search history

Recent AI conversations

Widget preferences

Where appropriate.

---

# 26. Global Components

Available from every page:

AI Copilot

Voice Assistant

Notifications

Search

Command Palette

Profile Menu

Help

These should never require page navigation.

---

# 27. Performance Requirements

Dashboard interactions should feel instantaneous.

Target metrics

Navigation

<200 ms

Sidebar

<150 ms

Search

<500 ms

Widget refresh

<500 ms

Animations

60 FPS

---

# 28. Acceptance Criteria

The dashboard architecture is complete when:

* Every role shares a common navigation experience.
* Global tools remain accessible throughout the application.
* Navigation is intuitive and consistent.
* Widgets are reusable.
* Responsive layouts function across devices.
* AI Copilot and Voice Assistant remain universally accessible.
* Performance targets are achieved.

---

# 29. Document Approval

**Status:** Approved

This document establishes the shared dashboard architecture, navigation model, layout system, and interaction framework that all authenticated experiences within ADhoc.ai must follow. Role-specific dashboard specifications will build upon this foundation in subsequent documents.
