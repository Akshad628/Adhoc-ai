# ADhoc.ai

# Document 14 — Counsellor Dashboard Specification

**Version:** 1.0

**Status:** Final

---

# 1. Purpose

This document defines the complete functional, visual, and interaction specification for the Counsellor Dashboard.

The Counsellor Dashboard is the operational workspace for admission counsellors. It centralizes enquiry management, lead nurturing, appointment scheduling, AI-assisted counselling, communication, and conversion analytics into a single intelligent platform.

The dashboard is designed to maximize admission conversions while minimizing manual effort through AI-driven automation.

---

# 2. Objectives

The Counsellor Dashboard shall enable counsellors to:

* Manage admission enquiries
* Track prospective students
* Conduct counselling sessions
* Schedule appointments
* View enquiry history
* Use AI-assisted counselling
* Track admission conversions
* Generate reports
* Communicate through chat and voice
* Receive AI recommendations

---

# 3. Dashboard Layout

The dashboard follows the global dashboard architecture defined in **Document 10**.

Components include:

* Sidebar Navigation
* Top Navigation
* Dashboard Workspace
* AI Counsellor Assistant
* Voice Assistant
* Notification Center
* Profile Menu

---

# 4. Sidebar Navigation

Modules

* Dashboard
* Admission Leads
* Prospective Students
* Counselling Sessions
* Appointments
* Voice Calls
* Documents
* Reports
* AI Assistant
* Notifications
* Profile
* Settings
* Logout

---

# 5. Dashboard Home

The landing dashboard displays today's priorities.

Widgets

* Active Leads
* Today's Appointments
* Pending Follow-ups
* Conversion Funnel
* AI Recommendations
* Recent Conversations
* Notifications
* Calendar
* Quick Actions

---

# 6. Lead Management

Displays

* New Enquiries
* Active Leads
* Follow-up Required
* Converted Students
* Closed Leads

Each lead includes

* Student Name
* Contact Details
* Preferred Course
* Institution
* Lead Source
* Current Stage
* Assigned Counsellor
* Last Interaction
* Next Follow-up

Supported actions

* View
* Edit
* Assign
* Archive
* Convert

---

# 7. Student Profile

Each prospective student profile displays

Personal Information

Academic Background

Preferred Course

Documents

Previous Conversations

Counselling Notes

Voice Call History

Application Status

Scholarship Interest

Communication Timeline

---

# 8. Counselling Sessions

Counsellors may

Schedule

Start

Complete

Reschedule

Cancel

Sessions

Each session records

Date

Time

Duration

Participants

Meeting Notes

Action Items

Recording Reference (if enabled)

---

# 9. Appointment Management

Supports

Daily Schedule

Weekly Schedule

Monthly Schedule

Appointments display

Student

Time

Purpose

Status

Meeting Link (if applicable)

Reminder Status

---

# 10. Voice Call Center

Supports

Browser Calls

Incoming Calls

Outgoing Calls

Call History

Live Transcripts

Call Recording Status

Call Duration

Voice Quality Indicator

During a live call, the interface displays

* Active Transcript
* AI Suggestions
* Student Information
* Recommended Responses
* Notes Panel

---

# 11. AI Counsellor Assistant

Available globally.

Capabilities

* Summarize student profiles
* Recommend counselling strategies
* Suggest suitable courses
* Explain fee structures
* Explain scholarships
* Draft follow-up emails
* Generate meeting summaries
* Answer institutional questions
* Recommend next actions

Supports

Chat

Voice

Conversation History

Suggested Prompts

---

# 12. Follow-up Manager

Displays

Today's Follow-ups

Upcoming Follow-ups

Missed Follow-ups

Completed Follow-ups

Each follow-up includes

Student

Priority

Deadline

Communication Method

Status

Notes

---

# 13. Admission Pipeline

Pipeline stages

New Enquiry

↓

Contacted

↓

Counselling Scheduled

↓

Counselling Completed

↓

Documents Submitted

↓

Application Submitted

↓

Admission Confirmed

↓

Student Onboarded

Pipeline supports drag-and-drop interaction.

---

# 14. Document Center

Counsellors may

View

Verify

Request

Approve (where permitted)

Documents include

Identity Proof

Academic Records

Transfer Certificates

Scholarship Documents

Application Forms

---

# 15. Reports

Generate

Lead Reports

Conversion Reports

Counselling Reports

Follow-up Reports

Admission Statistics

Reports may be exported as

PDF

CSV

Excel

---

# 16. Analytics

Displays

Lead Sources

Daily Enquiries

Monthly Admissions

Conversion Rate

Average Response Time

Average Counselling Duration

Top Courses

Counsellor Performance

Charts

Line

Bar

Pie

Funnel

---

# 17. Calendar

Displays

Appointments

Meetings

Admission Deadlines

Events

Institution Activities

Supports

Day

Week

Month

Agenda

---

# 18. Notifications

Categories

Admissions

Appointments

Voice Calls

Students

Documents

Institution

AI

System

Supports

Search

Filter

Read

Archive

---

# 19. Communication Center

Supports

Chat

Voice Calls

Email History

Meeting Requests

Conversation Timeline

All communications are stored in the student timeline.

---

# 20. AI Daily Brief

Generated automatically.

Example

> "You have 14 follow-ups scheduled today. Three high-priority leads have not been contacted in the last 48 hours. Two students are awaiting document verification."

Displayed at every login.

---

# 21. Quick Actions

Examples

* Start Voice Call
* Schedule Counselling
* Add Lead
* Verify Documents
* Ask AI
* Generate Report
* View Pipeline

---

# 22. Search

Search supports

Students

Leads

Documents

Appointments

Reports

Knowledge Base

AI Conversations

Voice Calls

---

# 23. Profile

Counsellors may update

Profile Photo

Contact Information

Office Hours

Password

Language

Notification Preferences

---

# 24. Settings

Includes

Account

Security

Sessions

Notifications

Voice Preferences

Accessibility

Privacy

---

# 25. Empty States

Example

"No admission enquiries assigned."

Display

Illustration

Description

Primary Action

---

# 26. Loading States

Use

Skeleton Cards

Placeholder Tables

Animated Charts

Loading Indicators

---

# 27. Error Handling

Provide

Friendly explanation

Retry action

Support contact

Technical details must remain hidden.

---

# 28. Responsive Behavior

Desktop

Three-column workspace

Laptop

Adaptive layout

Tablet

Drawer navigation

Mobile

Single-column interface

Floating AI Assistant

Touch-optimized controls

---

# 29. Accessibility

Support

Keyboard Navigation

Screen Readers

Reduced Motion

High Contrast

Accessible Forms

Scalable Typography

---

# 30. Performance Requirements

Dashboard Load

<3 seconds

Lead Search

<500 ms

Voice Call Initialization

<2 seconds

AI Response Begins

<2 seconds

Report Generation

<3 seconds

---

# 31. Security & Permissions

Counsellors may access only:

* Assigned leads
* Authorized student records
* Admission workflows
* Counselling reports

Counsellors cannot:

* Modify institutional settings
* Manage user roles
* Access financial administration
* View unrelated departments

All actions must be logged for audit purposes.

---

# 32. Acceptance Criteria

The Counsellor Dashboard is considered complete when counsellors can:

* Manage admission enquiries.
* Track prospective students.
* Schedule and conduct counselling sessions.
* Make and receive voice calls.
* Monitor the admission pipeline.
* Verify documents.
* Use AI-powered counselling assistance.
* Generate reports and analytics.
* Complete admission workflows from a single interface.

---

# 33. Document Approval

**Status:** Approved

This document defines the complete Counsellor Dashboard specification for ADhoc.ai Version 1.0 and serves as the implementation reference for frontend, backend, AI, voice services, and UX development teams.
