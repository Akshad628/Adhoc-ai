# ADhoc.ai

# Document 08 — Landing Website Specification

**Version:** 1.0

**Status:** Final

---

# 1. Purpose

This document defines the complete functional and visual specification for the public-facing ADhoc.ai website.

The website serves as the first impression of the product and is responsible for educating visitors, demonstrating capabilities, building trust, and converting visitors into registered users or demo requests.

Unlike traditional SaaS landing pages, the ADhoc.ai website should function as an immersive storytelling experience.

---

# 2. Website Objectives

The website shall:

* Present ADhoc.ai as a premium AI platform.
* Showcase product capabilities.
* Explain the educational problems being solved.
* Demonstrate AI-powered workflows.
* Build credibility.
* Encourage demo bookings.
* Encourage user registration.
* Introduce the SaaS platform.
* Showcase the technology stack.
* Explain the AI architecture.
* Drive user engagement through interactive experiences.

---

# 3. Design Direction

The website should feel:

* Futuristic
* Premium
* Intelligent
* Minimal
* Interactive
* Smooth
* Enterprise-ready

Visual inspiration comes primarily from **Callohm**, combined with the premium interaction quality of Apple, Linear, Vercel, and ElevenLabs.

---

# 4. Overall Experience

The homepage is not a collection of sections.

It is a **continuous narrative**.

Each section introduces a new concept while smoothly transitioning into the next.

The user should never feel abrupt jumps between sections.

---

# 5. Navigation Bar

## Position

Fixed

Transparent initially.

Transitions into a glassmorphic navigation bar after scrolling.

---

## Contents

Left:

* ADhoc.ai Logo

Center:

* Features
* AI Agents
* Architecture
* Technology
* Pricing (Placeholder)
* About

Right:

* Login
* Get Started

---

## Behavior

* Blur on scroll
* Shrinks slightly while scrolling
* Smooth hover animations
* Active section highlighting
* Mobile collapsible navigation

---

# 6. Hero Section

The Hero occupies the full viewport.

---

## Left Side

Large headline.

Example hierarchy:

Headline

Supporting description

Primary CTA

Secondary CTA

Small trust indicators

---

## Right Side

Interactive AI visualization.

The visualization should become the visual identity of ADhoc.ai.

No stock illustrations.

No Lottie animations.

Only custom Three.js / React Three Fiber experiences.

---

## Hero Animation

The AI Core should:

* Float continuously
* Rotate slightly
* Respond to cursor movement
* Emit subtle glow
* Use bloom effects
* Include floating particles
* Maintain idle motion
* Feel alive without distracting the user

---

## Background

Background includes:

* Dynamic gradients
* Noise texture
* Floating particles
* Soft light rays
* Ambient glow
* Layered depth

---

# 7. Scroll Behavior

Scrolling should drive storytelling.

Animations include:

* Fade
* Scale
* Blur
* Parallax
* Mask reveals
* Text reveal
* Section pinning
* Smooth camera movement

The page should maintain 60 FPS throughout.

---

# 8. Trusted By Section

Purpose:

Establish credibility.

Contents:

Institution logos

Partner logos

Technology logos

Animation:

Continuous marquee with pause-on-hover.

---

# 9. Problem Statement Section

Explain the operational challenges educational institutions face.

Layout:

Large heading

Interactive problem cards

Each card expands on hover.

Problems include:

* Admission enquiries
* Student counselling
* Parent communication
* Fee management
* Placement coordination
* Administrative workload
* Document verification
* Attendance tracking

Cards should include subtle hover elevation and animated borders.

---

# 10. Solution Section

Introduce ADhoc.ai as the unified solution.

Layout:

Large illustration

Feature summary

Interactive workflow

Animated transitions

This section bridges the problem to the product.

---

# 11. AI Agents Section

Introduce all AI-powered assistants.

Cards include:

Admission Agent

Course Recommendation Agent

Student Counselling Assistant

Parent Support Agent

Scholarship Advisor

Document Verification Assistant

Student Onboarding Assistant

Attendance Notification Agent

ITI / Skill Development Counsellor

Placement Assistant

Each card includes:

* Icon
* Description
* Capabilities
* Hover animation
* Glow effects
* Voice indicator

---

# 12. Interactive Voice Demo

The centerpiece of the website.

Visitors can experience AI conversations.

Components:

Microphone

Waveform

Transcript

AI Response

Voice Controls

Conversation History

Visualizer

Sample Prompts

Typing animation

The interaction should simulate the production application.

---

# 13. Product Features

Display major platform capabilities.

Suggested layout:

Interactive Bento Grid.

Feature Cards:

* AI Voice
* AI Chat
* Workflow Automation
* Analytics
* Knowledge Hub
* Prompt Studio
* Dashboard
* Notifications
* Document Management
* Placement Support
* Attendance Management
* Parent Portal

Cards animate independently while scrolling.

---

# 14. Architecture Section

Visualize the technical architecture.

Flow:

User

↓

Browser / Phone

↓

WebRTC / Twilio

↓

FastAPI

↓

Speech-to-Text

↓

Prompt Layer

↓

LLM

↓

Text-to-Speech

↓

Database

↓

Analytics

The diagram should animate data movement between nodes.

Hovering over each component displays a tooltip.

---

# 15. Technology Stack

Display technologies used throughout the platform.

Frontend

Backend

AI

Voice

Database

Infrastructure

Every technology logo should animate into view.

---

# 16. Dashboard Preview

Showcase the authenticated platform.

Display previews of:

Student Dashboard

Parent Dashboard

Faculty Dashboard

Counsellor Dashboard

Placement Dashboard

Administrator Dashboard

Each preview opens inside a floating glass device frame.

Hovering slightly enlarges the preview.

---

# 17. Workflow Showcase

Illustrate how ADhoc.ai automates institutional workflows.

Example:

Admission Enquiry

↓

AI Voice Conversation

↓

Document Verification

↓

Counselling

↓

Application

↓

Admission

↓

Student Onboarding

↓

Academic Journey

↓

Placement

Animations should guide users visually through each stage.

---

# 18. Analytics Section

Demonstrate reporting capabilities.

Charts include:

Admissions

Attendance

Voice Calls

Response Time

Student Engagement

Placement Analytics

Charts animate when entering the viewport.

---

# 19. Testimonials

Display customer testimonials.

Cards include:

Profile

Institution

Review

Rating

Cards auto-scroll horizontally.

Pause on hover.

---

# 20. FAQ

Accordion layout.

Only one panel remains open at a time.

Transitions:

Height animation

Opacity

Arrow rotation

---

# 21. Call to Action

Large section encouraging users to begin.

Primary CTA

"Book a Demo"

Secondary CTA

"Get Started"

Background:

Animated gradients

Glow

Floating particles

---

# 22. Footer

Contains:

Company

Product

Resources

Documentation

Privacy Policy

Terms

Contact

Social Links

Newsletter

Copyright

---

# 23. Page Transitions

Transitions between pages should include:

Fade

Scale

Blur

No browser flash.

Maintain visual continuity.

---

# 24. Performance Requirements

Homepage must achieve:

* Lighthouse Performance >95
* Accessibility >95
* Best Practices >95
* SEO >95

Animations should remain GPU accelerated.

---

# 25. Responsive Behavior

Desktop:

Full immersive experience.

Tablet:

Reduced motion.

Optimized layouts.

Mobile:

Simplified interactions.

Touch-friendly controls.

Optimized 3D rendering.

---

# 26. Accessibility

Support:

Keyboard navigation

Reduced motion

Screen readers

High contrast

Touch accessibility

Semantic HTML

---

# 27. Technical Requirements

Framework:

React + Vite

Animation:

GSAP

Framer Motion

Three.js

React Three Fiber

Smooth Scroll:

Lenis

Styling:

Tailwind CSS

Component Library:

shadcn/ui

---

# 28. Acceptance Criteria

The landing website is considered complete when:

* It delivers a premium first impression.
* Visitors understand the product without external explanation.
* Interactive elements remain performant.
* Animations support storytelling rather than distract from it.
* Calls-to-action are clear and accessible.
* The design remains consistent across devices.
* The transition from marketing website to authenticated platform feels seamless.

---

# 29. Document Approval

**Status:** Approved

This document serves as the definitive specification for the public-facing ADhoc.ai marketing website and should guide all design, animation, frontend development, and content implementation.
