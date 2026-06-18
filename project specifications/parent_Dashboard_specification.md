# ADhoc.ai

# Document 12 — Parent Dashboard Specification

**Version:** 1.0

**Status:** Final

---

# 1. Purpose

This document defines the complete functional, visual, and interaction specification for the Parent Dashboard.

The Parent Dashboard is designed to provide parents or guardians with a centralized, real-time view of their child's academic journey. It offers visibility into attendance, academic performance, fee status, examinations, institutional communication, and AI-powered insights while maintaining appropriate access controls.

The Parent Dashboard is intended to strengthen collaboration between parents and educational institutions by improving transparency and communication.

---

# 2. Objectives

The Parent Dashboard shall enable parents to:

* Monitor academic progress
* Track attendance
* Monitor fee payments
* View examination schedules and results
* Access institutional announcements
* Communicate with faculty or administration
* Download reports and documents
* Receive AI-generated summaries
* Use an AI assistant for institutional queries

---

# 3. Dashboard Layout

The Parent Dashboard follows the global dashboard architecture defined in **Document 10**.

Components include:

* Sidebar Navigation
* Top Navigation
* Main Dashboard Workspace
* AI Parent Assistant
* Notification Center
* Voice Assistant
* User Profile

---

# 4. Sidebar Navigation

Modules

* Dashboard
* Student Overview
* Attendance
* Academic Performance
* Fees
* Assignments
* Examinations
* Calendar
* Documents
* Communication
* AI Assistant
* Notifications
* Profile
* Settings
* Logout

---

# 5. Dashboard Home

The landing dashboard provides a high-level summary of the linked student's current academic status.

Widgets

* Student Profile
* Attendance Summary
* Academic Performance
* Fee Summary
* Upcoming Exams
* Assignments
* Institution Announcements
* AI Weekly Summary
* Notifications
* Calendar
* Quick Actions

---

# 6. Student Overview

Displays:

* Student Name
* Roll Number
* Course
* Department
* Semester
* Academic Year
* Class Advisor
* Profile Photo

Quick Information

* Current CGPA
* Attendance Percentage
* Fee Status
* Placement Status
* Recent Activities

---

# 7. AI Weekly Summary

Generated automatically.

Example

> "Your child attended 5 out of 5 scheduled classes this week. Attendance remains above institutional requirements. One assignment is due in three days, and no pending fee payments are recorded."

The summary should refresh weekly and whenever significant academic events occur.

---

# 8. Parent AI Assistant

Available globally.

Capabilities

* Explain attendance
* Explain fee structure
* Answer academic questions
* Search institutional policies
* Explain examination schedules
* Explain scholarship eligibility
* Provide assignment summaries
* Answer campus-related questions

Supports:

* Chat
* Voice
* Suggested Questions
* Conversation History

---

# 9. Voice Assistant

Parents may communicate with the AI assistant using voice.

Features

* Push-to-talk
* Live transcription
* Audio playback
* AI responses
* Voice conversation history

---

# 10. Attendance Module

Displays

Overall Attendance

Monthly Attendance

Semester Attendance

Subject-wise Attendance

Visualizations

* Progress Ring
* Attendance Timeline
* Subject Comparison

Alerts

The system automatically highlights attendance concerns based on institutional thresholds.

---

# 11. Academic Performance

Displays

Current CGPA

Semester GPA

Subject Grades

Recent Assessments

Performance Trends

Class Performance Summary

Charts

* Line Chart
* Bar Chart
* Grade Distribution

---

# 12. Assignment Tracker

Displays

Pending Assignments

Submitted Assignments

Upcoming Deadlines

Recently Evaluated Assignments

Each assignment displays

* Subject
* Title
* Due Date
* Submission Status
* Marks (when available)

---

# 13. Examination Module

Displays

Upcoming Exams

Exam Timetable

Results

Performance Summary

Hall Ticket Availability

Result Release Notifications

---

# 14. Fee Management

Displays

Total Fees

Paid Amount

Pending Amount

Next Due Date

Payment History

Receipt Downloads

Fee Notifications

Payment status indicators:

Paid

Pending

Overdue

---

# 15. Documents

Parents may access:

Report Cards

Fee Receipts

Bonafide Certificates (if permitted)

Academic Certificates

Circulars

Institution Notices

Supported actions

View

Download

Print

---

# 16. Communication Center

Provides communication with:

Faculty

Class Advisor

Counsellor

Administration

Available features

* Message Threads
* Meeting Requests
* Appointment Scheduling
* Conversation History

---

# 17. Calendar

Displays

Academic Calendar

Exam Dates

Assignment Deadlines

Parent Meetings

Institution Events

Holiday Schedule

Supports

Monthly

Weekly

Agenda View

---

# 18. Notifications

Categories

Academic

Attendance

Fees

Assignments

Examinations

Institution

Meetings

AI

Supports

Read

Unread

Archive

Filter

Search

---

# 19. Reports

Parents may download:

Attendance Reports

Academic Reports

Semester Report Cards

Fee Statements

Student Progress Reports

Reports are available in PDF format.

---

# 20. Activity Timeline

Displays

Attendance Updates

Assignment Activity

Exam Results

Fee Payments

Document Downloads

AI Conversations

Recent Notifications

---

# 21. Quick Actions

Examples

* Ask AI
* View Attendance
* Download Report Card
* Pay Fees
* Book Meeting
* Contact Faculty
* View Assignments

---

# 22. Search

Search supports

Announcements

Documents

Assignments

Fees

Examinations

Notifications

Knowledge Base

AI Conversations

---

# 23. Profile

Parents may update

Profile Photo

Phone Number

Email Address

Password

Notification Preferences

Language

Emergency Contact

---

# 24. Settings

Settings include

Account

Security

Sessions

Notifications

Accessibility

Voice Preferences

Privacy

---

# 25. Empty States

Every module shall provide meaningful empty states.

Example

"No upcoming examinations scheduled."

Each empty state includes

Illustration

Explanation

Suggested Action

---

# 26. Loading States

The dashboard shall use

Skeleton Cards

Placeholder Tables

Animated Charts

Progress Indicators

Loading animations should remain lightweight.

---

# 27. Error Handling

Errors shall provide

Friendly explanation

Retry option

Support contact

No technical implementation details should be exposed.

---

# 28. Responsive Behavior

Desktop

Multi-column dashboard

Laptop

Adaptive grid

Tablet

Drawer navigation

Mobile

Single-column layout

Floating AI Assistant

Touch-optimized controls

---

# 29. Accessibility

Support

Keyboard Navigation

Screen Readers

Reduced Motion

High Contrast

Scalable Typography

Accessible Form Controls

---

# 30. Performance Requirements

Dashboard Load

<3 seconds

Navigation

<200 ms

Chart Rendering

<500 ms

AI Response Begins

<2 seconds

Voice Response Begins

<3 seconds

---

# 31. Security & Privacy

Parents may only access information explicitly linked to their authorized student account.

The system shall prevent access to:

* Other students' records
* Administrative functions
* Faculty management
* Institutional configuration
* Restricted analytics

All sensitive data must be protected through authentication, authorization, and encrypted communication.

---

# 32. Acceptance Criteria

The Parent Dashboard is considered complete when parents can:

* Monitor academic progress.
* Track attendance.
* View fee information.
* Access examination details.
* Download academic documents.
* Communicate with the institution.
* Receive AI-powered summaries.
* Use the AI assistant through chat and voice.
* Navigate the dashboard intuitively across all supported devices.

---

# 33. Document Approval

**Status:** Approved

This document defines the complete Parent Dashboard specification for ADhoc.ai Version 1.0 and serves as the implementation reference for frontend, backend, AI, and UX teams.
