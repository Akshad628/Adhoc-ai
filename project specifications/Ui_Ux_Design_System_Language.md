# ADhoc.ai

# Document 07 — UI/UX Design System & Design Language

**Version:** 1.0

**Status:** Final

---

# 1. Purpose

This document establishes the complete visual identity, design language, interaction principles, and user experience standards for ADhoc.ai.

Every screen, component, animation, interaction, and layout must follow these specifications to ensure visual consistency throughout the platform.

This document acts as the **single source of truth** for all UI/UX decisions.

---

# 2. Design Philosophy

The design language should communicate:

* Intelligence
* Innovation
* Precision
* Simplicity
* Trust
* Premium Quality
* Enterprise Reliability

The interface should feel closer to products like **Linear, Vercel, Stripe, Apple, OpenAI, ElevenLabs, and Callohm** than to traditional ERP systems.

Users should immediately perceive ADhoc.ai as a modern AI platform rather than educational software.

---

# 3. Core Design Principles

Every interface should satisfy the following principles.

### Minimal

Remove unnecessary visual noise.

Every component should have a purpose.

---

### Intelligent

Interfaces should proactively assist users rather than overwhelm them.

AI should appear integrated rather than separate.

---

### Fast

Animations should enhance responsiveness rather than slow interaction.

---

### Elegant

Whitespace should be generous.

Typography should remain highly readable.

Transitions should feel effortless.

---

### Consistent

Buttons, cards, colors, icons, and spacing should remain identical throughout the platform.

---

# 4. Visual Identity

Overall appearance:

* Dark Theme First
* Premium SaaS
* Soft Glassmorphism
* Floating Panels
* Layered Depth
* Ambient Lighting
* Subtle Gradients
* High Contrast
* Minimal Borders

The interface should feel calm, futuristic, and professional.

---

# 5. Color Palette

## Primary Background

```text
#050505
```

---

## Secondary Background

```text
#111111
```

---

## Surface

```text
#181818
```

---

## Glass Surface

```text
rgba(255,255,255,0.06)
```

---

## Primary Accent

```text
#FF7A18
```

---

## Secondary Accent

```text
#5B8CFF
```

---

## Gradient

```text
Orange → Purple → Blue
```

Use gradients sparingly to emphasize important areas.

---

# 6. Typography

Primary Font

**Inter**

Fallback

System Sans

---

Heading Sizes

Hero

72–96px

Section Heading

48–64px

Card Heading

24–32px

Body

16–18px

Caption

14px

Navigation

15–16px

---

Typography should prioritize readability over decoration.

---

# 7. Spacing System

Base Grid

8px

Allowed spacing:

8

16

24

32

40

48

64

80

96

128

No arbitrary spacing values should be introduced.

---

# 8. Border Radius

Small

12px

Medium

18px

Large

24px

Cards

28px

Buttons

999px (pill)

---

# 9. Shadows

Use soft shadows.

Avoid harsh black shadows.

Cards should appear to float rather than sit on the background.

---

# 10. Glassmorphism

Glass cards should include:

Background Blur

12–24px

Opacity

5–10%

Thin translucent border

Soft shadow

Subtle reflection

---

# 11. Layout System

Maximum Width

1440px

Content Width

1280px

Container Padding

Desktop

80px

Tablet

40px

Mobile

20px

---

# 12. Navigation

Navigation remains fixed.

Contains:

Logo

Navigation Links

CTA Button

Theme (future)

Profile (after login)

Scroll behavior:

Transparent at top

Glass effect after scrolling

---

# 13. Buttons

Button Types

Primary

Secondary

Ghost

Outline

Danger

Icon

Floating Action Button

---

Primary Button

Orange gradient

Glow on hover

Subtle lift

---

Secondary Button

Glass

Border

Blur

Hover highlight

---

Button States

Default

Hover

Active

Loading

Disabled

Success

Error

---

# 14. Cards

Cards should:

Float

Cast soft shadows

Use glass surfaces

Scale slightly on hover

Respond to cursor movement

Remain readable

---

# 15. Forms

Forms should provide:

Floating labels

Real-time validation

Helpful error messages

Success indicators

Accessible keyboard navigation

Large touch targets

---

# 16. Icons

Style

Outlined

Rounded

Simple

Modern

Consistent stroke width

Icons should never dominate content.

---

# 17. Charts

Charts should be:

Minimal

Interactive

Responsive

Animated

Readable

Avoid excessive colors.

---

# 18. Tables

Requirements

Sticky header

Sorting

Filtering

Pagination

Search

Responsive behavior

Hover highlighting

---

# 19. Motion Design

Motion should feel:

Premium

Purposeful

Natural

Responsive

Every animation should support usability.

Avoid decorative animations without purpose.

---

# 20. Animation Guidelines

Animation duration

150ms

250ms

400ms

800ms

Long cinematic transitions

1000–1500ms

Use easing rather than linear motion.

---

# 21. Scroll Behavior

Scrolling should include:

Smooth scrolling

Section reveal

Parallax

Fade

Scale

Pinned sections

Mask reveals

Progressive storytelling

No abrupt transitions.

---

# 22. Hover Behavior

Hover effects should include:

Glow

Lift

Scale

Border illumination

Cursor response

Subtle shadow

Avoid excessive movement.

---

# 23. Mouse Interaction

Interactive components should respond to cursor movement.

Examples:

Cards tilt

AI Orb rotates

Particles react

Buttons attract cursor slightly

Light follows cursor

These interactions should remain subtle.

---

# 24. Loading Experience

Every loading state should include:

Skeleton UI

Animated placeholders

Progress indicators

No empty white screens.

---

# 25. Empty States

Every empty state should include:

Illustration

Helpful message

Recommended action

CTA Button

---

# 26. Error States

Errors should provide:

Explanation

Suggested action

Retry button

Contact support option

Avoid technical language.

---

# 27. Notification Design

Notifications should be:

Minimal

Timed

Animated

Non-blocking

Grouped when necessary

Support:

Success

Warning

Information

Error

---

# 28. Dashboard Layout

Every dashboard should contain:

Sidebar Navigation

Top Navigation

Content Area

AI Copilot Access

Notification Center

Profile Menu

Responsive Grid

Consistent spacing

---

# 29. Landing Website Style

The marketing website should emphasize storytelling.

Sections should transition naturally through:

Fade

Scale

Parallax

Blur

Mask reveals

Layered animations

Each section should introduce one major concept before transitioning to the next.

---

# 30. Accessibility

All interfaces must support:

Keyboard navigation

Screen readers

High contrast

Reduced motion

Responsive scaling

Accessible focus indicators

---

# 31. Responsive Design

Desktop

1440px+

Laptop

1024px+

Tablet

768px+

Mobile

375px+

Layouts should adapt while preserving usability.

---

# 32. Component Consistency

Reusable components include:

Buttons

Cards

Inputs

Dropdowns

Tables

Charts

Dialogs

Tooltips

Modals

Tabs

Badges

Avatars

Alerts

Every component should share identical interaction patterns.

---

# 33. Design Tokens

The design system should define reusable tokens for:

Colors

Typography

Spacing

Radius

Elevation

Animation

Opacity

Blur

Borders

Transitions

These tokens should be implemented within Tailwind configuration.

---

# 34. UI Quality Standards

Every screen should satisfy:

Visual balance

Consistent spacing

Readable typography

Minimal clutter

Logical hierarchy

Smooth interaction

Professional appearance

---

# 35. Acceptance Criteria

The design system is considered complete when:

* Every page follows the same visual language.
* Components are reusable.
* Animations remain consistent.
* Accessibility requirements are met.
* Responsive behavior is verified.
* Users can immediately recognize ADhoc.ai's visual identity.

---

# 36. Document Approval

**Status:** Approved

This document establishes the official design language and UI/UX standards for all current and future interfaces within the ADhoc.ai platform. No screen or component should deviate from these guidelines without an approved design revision.
