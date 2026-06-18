# ADhoc.ai

# Document 09 — Authentication & Authorization Specification

**Version:** 1.0

**Status:** Final

---

# 1. Purpose

This document defines the complete authentication, authorization, identity management, and access control system for ADhoc.ai.

Authentication is responsible for verifying user identity, while authorization determines what authenticated users are permitted to access.

This document establishes the security model used throughout the platform.

---

# 2. Objectives

The authentication system shall:

* Secure user accounts.
* Prevent unauthorized access.
* Support multiple authentication methods.
* Provide seamless login experiences.
* Protect institutional data.
* Support role-based access.
* Maintain secure user sessions.
* Support future enterprise integrations.

---

# 3. Authentication Methods

The platform supports the following login methods.

### Email & Password

Traditional authentication using email address and password.

---

### Google OAuth

Users may authenticate using Google.

After successful authentication:

* Create account if new.
* Link existing account if email matches.
* Redirect to assigned dashboard.

---

### Microsoft OAuth

Enterprise institutions may authenticate using Microsoft accounts.

---

# 4. Registration Flow

The registration process consists of:

Step 1

Select Role

Options:

* Student
* Parent
* Faculty
* Counsellor
* Placement Officer
* Administrator

---

Step 2

Basic Information

Required fields:

* Full Name
* Email Address
* Mobile Number
* Password
* Confirm Password

---

Step 3

Institution Information

Required:

Institution Name

Optional:

Department

Course

Roll Number

Employee ID

Depending on role.

---

Step 4

Email Verification

Verification link or OTP.

Account remains inactive until verified.

---

Step 5

Profile Creation

After verification:

User profile

Permissions

Institution mapping

Dashboard assignment

---

# 5. Login Flow

Login Screen

↓

Credentials

↓

Validation

↓

Authentication

↓

JWT Generation

↓

Refresh Token

↓

Role Validation

↓

Institution Validation

↓

Dashboard Redirect

---

# 6. Forgot Password Flow

User selects:

Forgot Password

↓

Enter Email

↓

Verification Email

↓

Reset Link

↓

New Password

↓

Confirmation

↓

Login

---

# 7. Session Management

Each authenticated session contains:

* User ID
* Institution ID
* Role
* JWT Access Token
* Refresh Token
* Login Timestamp
* Last Activity
* Device Information

Sessions expire after inactivity.

---

# 8. Logout Flow

Logout must:

* Destroy session.
* Revoke refresh token.
* Clear browser storage.
* Redirect to homepage.

---

# 9. Role-Based Access Control (RBAC)

Supported Roles

Student

Parent

Faculty

Counsellor

Placement Officer

Administrator

Super Administrator

Every authenticated request shall validate:

* User Identity
* Institution
* Role
* Permission

---

# 10. Permission Matrix

## Student

Can:

* View personal information
* Chat with AI
* Use Voice Assistant
* Upload documents
* View attendance
* View fees
* View placements
* Update profile

Cannot:

* Access other students
* Modify institution data
* View administrative analytics

---

## Parent

Can:

* View linked student's data
* Pay fees
* Download reports
* Communicate with institution
* Use Parent AI

Cannot:

* Modify academic records
* View unrelated students

---

## Faculty

Can:

* Manage attendance
* Publish grades
* Upload assignments
* Generate reports
* Use Faculty AI

Cannot:

* Access institution settings
* Manage users

---

## Counsellor

Can:

* Manage admission leads
* Schedule counselling
* Update enquiry status
* Generate follow-ups

Cannot:

* Change institution settings

---

## Placement Officer

Can:

* Manage companies
* Manage interviews
* Review resumes
* Generate placement reports

Cannot:

* Modify institutional configuration

---

## Administrator

Can:

* Manage users
* Configure AI
* Upload knowledge
* Configure prompts
* Access analytics
* Manage voice settings

Cannot:

* Access platform-wide infrastructure

---

## Super Administrator

Full platform access.

Can manage:

* Institutions
* Billing
* Infrastructure
* Global settings
* Subscription plans

---

# 11. Authentication Pages

The authentication module consists of:

Landing

↓

Login

↓

Signup

↓

Email Verification

↓

Forgot Password

↓

Reset Password

↓

Dashboard

---

# 12. Login Page Specification

Layout

Split Screen

Left

Branding

Headline

Description

Background animation

Right

Login Form

---

Form Fields

Email

Password

Remember Me

Forgot Password

Login Button

Google Login

Microsoft Login

Signup Link

---

Validation

Required fields

Valid email

Password length

Error messages

Loading indicator

---

# 13. Signup Page Specification

Fields

Role

Full Name

Email

Phone

Institution

Password

Confirm Password

Terms & Conditions

Signup Button

Google Signup

Microsoft Signup

---

Validation

Duplicate email

Password strength

Phone validation

Institution validation

---

# 14. Password Policy

Minimum:

8 characters

Must include:

Uppercase

Lowercase

Number

Special character

Prevent common passwords.

---

# 15. Email Verification

Verification email includes:

Institution branding

Secure verification link

Expiration time

Resend option

---

# 16. JWT Specification

Access Token

Purpose:

API Authentication

Refresh Token

Purpose:

Generate new access token

Tokens should never contain sensitive user data.

---

# 17. Route Protection

Protected Routes

Dashboard

Settings

Analytics

Documents

AI

Voice

Profile

Public Routes

Landing Page

Login

Signup

Forgot Password

Privacy Policy

Terms

---

# 18. Unauthorized Access

Unauthorized users should receive:

401 Unauthorized

Access denied page

Redirect to Login

No sensitive information exposed.

---

# 19. Account Status

Possible account states:

Pending Verification

Active

Suspended

Disabled

Deleted

Only Active users may authenticate.

---

# 20. Activity Logging

Log:

Login

Logout

Failed Login

Password Reset

Profile Update

Session Expiration

Permission Changes

Device Changes

---

# 21. Security Measures

Implement:

HTTPS

Password Hashing

JWT

Refresh Tokens

Rate Limiting

CSRF Protection

XSS Prevention

SQL Injection Protection

Secure Headers

Input Validation

Secure File Uploads

---

# 22. Multi-Institution Support

Every authenticated user belongs to exactly one institution unless explicitly assigned administrative access across institutions.

All authentication and authorization logic must validate institution ownership before allowing access to institutional resources.

---

# 23. Authentication API Endpoints

Authentication module exposes:

POST /register

POST /login

POST /logout

POST /refresh

POST /forgot-password

POST /reset-password

POST /verify-email

GET /me

PATCH /profile

DELETE /account

---

# 24. Authentication UI States

Every authentication screen shall support:

Loading

Success

Validation Error

Authentication Failure

Network Failure

Session Expired

Account Disabled

Verification Pending

---

# 25. Acceptance Criteria

Authentication is considered complete when:

* Users can securely register.
* Users can authenticate using supported providers.
* Email verification functions correctly.
* JWT authentication protects all secured resources.
* Role-based permissions are enforced.
* Sessions are securely managed.
* Unauthorized users cannot access protected modules.
* Authentication remains seamless across devices and browsers.

---

# 26. Document Approval

**Status:** Approved

This document defines the official authentication and authorization architecture for ADhoc.ai Version 1.0 and shall be followed by all frontend, backend, security, and DevOps implementations.
