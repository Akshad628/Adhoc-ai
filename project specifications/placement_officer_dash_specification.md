# ADhoc.ai

# Document 15 — Placement Officer Dashboard Specification

**Version:** 1.0

**Status:** Final

---

# 1. Purpose

This document defines the complete functional, visual, and interaction specification for the Placement Officer Dashboard.

The Placement Dashboard serves as the centralized recruitment management system for educational institutions. It enables placement officers to coordinate with companies, evaluate students, schedule interviews, monitor recruitment drives, analyze placement performance, and streamline the end-to-end campus recruitment process.

The objective is to transform placement management into an AI-assisted, data-driven workflow.

---

# 2. Objectives

The Placement Dashboard shall enable placement officers to:

* Manage recruiting companies
* Organize placement drives
* Track eligible students
* Review resumes
* Schedule interviews
* Monitor placement progress
* Generate placement reports
* Use AI-assisted recruitment tools
* Analyze placement performance
* Communicate with recruiters and students

---

# 3. Dashboard Layout

The dashboard follows the Global Dashboard Architecture defined in **Document 10**.

Components include:

* Sidebar Navigation
* Top Navigation
* Dashboard Workspace
* AI Placement Assistant
* Notification Center
* Voice Assistant
* Profile Menu

---

# 4. Sidebar Navigation

Modules

* Dashboard
* Companies
* Placement Drives
* Students
* Resume Database
* Interview Management
* Offers
* Analytics
* Reports
* AI Assistant
* Notifications
* Profile
* Settings
* Logout

---

# 5. Dashboard Home

Displays today's placement overview.

Widgets

* Active Companies
* Upcoming Interviews
* Placement Statistics
* Eligible Students
* Pending Resume Reviews
* AI Placement Summary
* Notifications
* Calendar
* Quick Actions

---

# 6. Company Management

Placement officers may:

* Add Company
* Edit Company
* Archive Company
* View Company Profile
* Schedule Drive
* Assign Recruiters

Each company profile contains:

* Company Name
* Industry
* Contact Person
* Email
* Phone
* Website
* Job Roles
* Package Details
* Eligibility Criteria
* Hiring Status
* Recruitment Timeline

---

# 7. Placement Drives

Displays:

Upcoming Drives

Ongoing Drives

Completed Drives

Cancelled Drives

Each drive contains:

* Company
* Date
* Venue / Online Link
* Eligible Branches
* Eligible CGPA
* Registration Deadline
* Current Status
* Number of Applicants

Supported Actions

Create

Edit

Cancel

Close

Publish

---

# 8. Student Management

Displays

Eligible Students

Applied Students

Selected Students

Rejected Students

Placed Students

Student profile includes:

Academic Details

CGPA

Attendance

Skills

Certifications

Resume

Placement History

Interview History

Current Status

---

# 9. Resume Database

Supports

Resume Upload

Resume Review

Resume Search

Resume Download

Resume Version History

Resume Approval

Resume Status

Filters

Department

CGPA

Skills

Graduation Year

Placement Status

---

# 10. AI Resume Review

The AI Placement Assistant shall:

* Analyze resumes
* Suggest improvements
* Detect missing information
* Identify ATS issues
* Recommend stronger keywords
* Generate resume summaries

Each resume receives:

Resume Score

ATS Compatibility Score

Skill Match Score

Completeness Score

Improvement Suggestions

---

# 11. Interview Management

Supports

Interview Scheduling

Interview Rescheduling

Interview Cancellation

Interview Feedback

Interview Results

Each interview contains

Company

Candidate

Date

Time

Mode

Panel Members

Status

Feedback

Outcome

---

# 12. Offer Management

Displays

Offers Released

Offers Accepted

Offers Declined

Pending Offers

Each offer contains

Company

Role

Package

Location

Offer Date

Acceptance Status

Joining Date

Documents

---

# 13. AI Placement Assistant

Available globally.

Capabilities

* Match students to companies
* Analyze resumes
* Generate placement reports
* Recommend interview questions
* Explain eligibility criteria
* Summarize company profiles
* Generate emails
* Search institutional knowledge
* Answer placement-related queries

Supports

Chat

Voice

Conversation History

Suggested Prompts

---

# 14. Placement Analytics

Displays

Placement Percentage

Department-wise Placements

Company Participation

Average Salary

Highest Package

Median Package

Interview Success Rate

Student Readiness

Charts

Bar

Line

Pie

Heatmap

Funnel

---

# 15. Placement Readiness

Each student receives a readiness score.

Factors include

Academic Performance

Resume Quality

Skill Certifications

Attendance

Interview Performance

Applications Submitted

Placement History

The score is continuously updated.

---

# 16. Reports

Generate

Placement Reports

Company Reports

Student Reports

Offer Reports

Salary Reports

Recruitment Analytics

Export Formats

PDF

CSV

Excel

---

# 17. Calendar

Displays

Placement Drives

Interviews

Company Visits

Training Sessions

Deadlines

Supports

Day

Week

Month

Agenda

---

# 18. Notifications

Categories

Placement

Company

Interview

Offer

Training

AI

Institution

System

Supports

Search

Filter

Read

Archive

---

# 19. Communication Center

Supports communication with:

Students

Companies

Recruiters

Faculty

Administration

Conversation types

Messages

Emails

Meeting Requests

Voice Calls

Conversation History

---

# 20. AI Daily Brief

Generated automatically.

Example

> "Today you have three scheduled interviews, two companies visiting campus, and twenty-one resumes pending review. Five students have become eligible for upcoming recruitment drives."

Displayed upon login.

---

# 21. Quick Actions

Examples

* Schedule Drive
* Add Company
* Review Resume
* Schedule Interview
* Generate Report
* Ask AI
* View Analytics

---

# 22. Search

Supports searching

Companies

Students

Resumes

Offers

Placement Drives

Reports

Knowledge Base

AI Conversations

---

# 23. Profile

Placement Officers may update

Profile Photo

Contact Information

Department

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

"No placement drives scheduled."

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

Display

Friendly explanation

Retry action

Support contact

Do not expose technical implementation details.

---

# 28. Responsive Behavior

Desktop

Three-column workspace

Laptop

Adaptive layout

Tablet

Drawer navigation

Mobile

Single-column layout

Floating AI Assistant

Touch-optimized interactions

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

Resume Search

<500 ms

Interview Scheduling

<500 ms

AI Response Begins

<2 seconds

Analytics Rendering

<1 second

---

# 31. Security & Permissions

Placement Officers may access only:

* Placement records
* Student placement profiles
* Recruitment companies
* Placement analytics
* Interview management
* Resume database

Placement Officers cannot:

* Modify institution settings
* Manage platform users
* Configure AI prompts
* Access financial administration
* View unrelated institutional data

Every placement-related activity shall be recorded in the audit log.

---

# 32. Acceptance Criteria

The Placement Dashboard is considered complete when placement officers can:

* Manage recruiting companies.
* Organize placement drives.
* Review and evaluate resumes.
* Track student eligibility.
* Schedule interviews.
* Monitor offers.
* Generate placement reports.
* Use AI-assisted recruitment tools.
* Analyze placement performance.
* Complete the recruitment lifecycle from a unified dashboard.

---

# 33. Document Approval

**Status:** Approved

This document defines the complete Placement Officer Dashboard specification for ADhoc.ai Version 1.0 and serves as the implementation reference for frontend, backend, AI, analytics, and UX development teams.
