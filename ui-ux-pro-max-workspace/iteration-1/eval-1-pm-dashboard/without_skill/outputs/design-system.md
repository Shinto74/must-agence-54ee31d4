# SaaS Project Management Dashboard Design System

## Overview

A comprehensive design system for a modern, professional React-based project management dashboard built for remote tech teams. This design system emphasizes clarity, efficiency, and visual hierarchy while maintaining accessibility and scalability.

---

## 1. Brand & Philosophy

### Core Principles

- **Clarity First**: Information hierarchy is paramount. Users should instantly understand what they're looking at.
- **Efficiency**: Every interaction should reduce friction and save time.
- **Trustworthiness**: Professional appearance builds confidence in a tool managing critical workflows.
- **Dark-Mode Native**: Designed for extended use by developers and tech workers.
- **Accessibility**: WCAG 2.1 AA compliance as a baseline.

### Target User Context

- Remote tech professionals working across distributed teams
- Multi-tasking knowledge workers
- Varying levels of technical expertise within engineering/product teams
- Users spending 4-8 hours daily in the dashboard

---

## 2. Color Palette

### Primary Colors

| Color | Hex | Usage | Purpose |
|-------|-----|-------|---------|
| Primary Blue | `#0066CC` | CTAs, links, active states | Trust, professionalism |
| Success Green | `#00A342` | Completed tasks, approval | Positive confirmation |
| Warning Amber | `#FF9500` | Pending items, warnings | Attention needed |
| Error Red | `#E23E3E` | Failures, destructive actions | Critical alerts |
| Neutral Gray | `#6B7280` | Secondary text, dividers | Hierarchy support |

### Background Colors (Light Mode)

| Element | Hex | Usage |
|---------|-----|-------|
| Primary BG | `#FFFFFF` | Main canvas |
| Secondary BG | `#F9FAFB` | Cards, sections |
| Tertiary BG | `#F3F4F6` | Hover states, subtle areas |
| Border | `#E5E7EB` | Dividers, outlines |

### Background Colors (Dark Mode)

| Element | Hex | Usage |
|---------|-----|-------|
| Primary BG | `#0F172A` | Main canvas |
| Secondary BG | `#1E293B` | Cards, sections |
| Tertiary BG | `#334155` | Hover states, subtle areas |
| Border | `#475569` | Dividers, outlines |

### Text Colors

| Purpose | Light Mode | Dark Mode |
|---------|-----------|----------|
| Primary Text | `#111827` | `#F8FAFC` |
| Secondary Text | `#6B7280` | `#CBD5E1` |
| Tertiary Text | `#9CA3AF` | `#94A3B8` |
| Disabled | `#D1D5DB` | `#64748B` |

---

## 3. Typography

### Font Family

```css
/* Primary: Inter for UI (clean, modern, highly readable) */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Monospace: JetBrains Mono for code/data (developer-friendly) */
font-family: 'JetBrains Mono', 'Courier New', monospace;
```

### Type Scale

| Level | Font Size | Line Height | Font Weight | Usage |
|-------|-----------|-------------|-------------|-------|
| Display | 32px | 40px | 700 | Page titles, major sections |
| Headline | 24px | 32px | 700 | Section headers, modal titles |
| Title | 20px | 28px | 600 | Card headers, subtitles |
| Subtitle | 16px | 24px | 600 | Form labels, emphasis |
| Body Large | 16px | 24px | 400 | Primary content, descriptions |
| Body Regular | 14px | 20px | 400 | Default body text |
| Body Small | 12px | 16px | 400 | Secondary text, metadata |
| Label | 12px | 16px | 600 | Form labels, badges |
| Caption | 11px | 14px | 400 | Timestamps, hints |

### Text Styles

```css
/* Display */
font-size: 32px;
line-height: 1.25;
font-weight: 700;
letter-spacing: -0.5px;

/* Body Regular (default) */
font-size: 14px;
line-height: 1.43;
font-weight: 400;
letter-spacing: 0;

/* Caption */
font-size: 11px;
line-height: 1.27;
font-weight: 400;
letter-spacing: 0.5px;
```

---

## 4. Spacing System

### Base Unit: 4px

All spacing uses multiples of 4px for consistency and alignment.

| Token | Size | Usage |
|-------|------|-------|
| xs | 4px | Minimal spacing, icon gaps |
| sm | 8px | Small padding, tight spacing |
| md | 12px | Default padding, moderate spacing |
| lg | 16px | Card padding, section spacing |
| xl | 24px | Major sections, gaps |
| 2xl | 32px | Page margins, large gaps |
| 3xl | 48px | Section separation, hero areas |
| 4xl | 64px | Major layout spacing |

### Examples

```css
/* Card padding */
padding: 16px; /* lg */

/* Between cards */
gap: 16px; /* lg */

/* Between sections */
margin-bottom: 32px; /* 2xl */

/* Icon + text */
gap: 8px; /* sm */
```

---

## 5. Component Library

### 5.1 Buttons

#### Primary Button
```
State: Default
Background: #0066CC
Text: White
Padding: 10px 16px
Border Radius: 6px
Height: 40px

State: Hover
Background: #0052A3
Cursor: pointer

State: Active
Background: #003D7A
Box Shadow: inset 0 2px 4px rgba(0,0,0,0.2)

State: Disabled
Background: #D1D5DB
Text: #9CA3AF
Cursor: not-allowed
```

#### Secondary Button
```
State: Default
Background: #F3F4F6
Text: #111827 (dark) / #F8FAFC (light)
Border: 1px solid #E5E7EB
Padding: 10px 16px
Border Radius: 6px

State: Hover
Background: #E5E7EB

State: Active
Background: #D1D5DB
```

#### Danger Button
```
Background: #E23E3E
Text: White
Hover: #C93030
Focus: Box-shadow with red at 20% opacity
```

#### Button Sizes
```
Small: height 32px, font 12px
Medium: height 40px, font 14px (default)
Large: height 48px, font 16px
```

---

### 5.2 Input Fields

#### Text Input
```
Default State:
Border: 1px solid #E5E7EB
Background: White (#FFFFFF)
Padding: 10px 12px
Border Radius: 6px
Font Size: 14px
Height: 40px

Focus State:
Border: 2px solid #0066CC
Box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1)
Padding: 9px 11px (adjusted for border width)

Hover State:
Border: 1px solid #D1D5DB
Background: #F9FAFB

Disabled State:
Background: #F3F4F6
Color: #9CA3AF
Cursor: not-allowed
Border: 1px solid #E5E7EB

Error State:
Border: 2px solid #E23E3E
Background: #FEF2F2
Icon: Red error icon inside right
Padding-right: 36px
```

#### Input Variations
```
With Icon:
Icon Size: 16px
Icon Color: #6B7280
Icon Position: 12px from left/right
Padding-left/right: 36px (when icon present)

With Label:
Label: 12px, 600 weight, #111827
Margin below label: 8px
Required indicator: red asterisk

With Help Text:
Font: 12px
Color: #6B7280
Margin above: 4px
Max-width: match input width

With Placeholder:
Color: #D1D5DB
Font style: not italic
```

---

### 5.3 Dropdown/Select

```
Default State:
Height: 40px
Border: 1px solid #E5E7EB
Background: White
Border-radius: 6px
Padding: 10px 12px
Icon: Chevron-down, 16px, right-aligned

Expanded State:
Border: 2px solid #0066CC
Box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1)
Option items below input

Option Items:
Height: 36px per item
Padding: 10px 12px
Hover: Background #F3F4F6
Selected: Background #E8F4FD, left border 3px #0066CC
Font: 14px

Disabled:
Background: #F3F4F6
Color: #9CA3AF
Cursor: not-allowed
```

---

### 5.4 Cards

#### Default Card
```
Background: White (#FFFFFF in light, #1E293B in dark)
Border: 1px solid #E5E7EB
Border-radius: 8px
Padding: 16px
Box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05)

On Hover:
Box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1)
Transition: box-shadow 200ms ease-in-out
```

#### Card Variations

**Interactive Card (clickable)**
```
Cursor: pointer
On Hover: slight scale (1.02) + shadow increase
Border-left: 3px solid transparent
On Selected: Border-left #0066CC, background #F3F4F6
```

**Elevated Card**
```
Box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08)
Used for: Modals, focused content
```

**Compact Card**
```
Padding: 12px
Used for: List items, summaries
```

---

### 5.5 Badge/Tags

#### Status Badge
```
Padding: 4px 8px
Border-radius: 12px
Font-size: 12px
Font-weight: 600
Height: 24px

Colors by Status:
Success: Background #D1FAE5, Text #065F46
Warning: Background #FEF3C7, Text #92400E
Error: Background #FEE2E2, Text #991B1B
Info: Background #DBEAFE, Text #1E40AF
```

#### Custom Tag
```
Similar to badge
With optional close icon (X) on right
Hover: darker background
Close icon hover: increases opacity
```

---

### 5.6 Modal/Dialog

```
Backdrop:
Background: rgba(0, 0, 0, 0.5)
Animation: fade in 200ms

Modal Container:
Max-width: 600px
Border-radius: 12px
Background: White (#FFFFFF)
Box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15)
Position: centered on screen

Header:
Padding: 20px
Border-bottom: 1px solid #E5E7EB
Title: 20px, 600 weight
Close button: top-right, 24x24, gray icon

Body:
Padding: 20px
Max-height: 70vh
Overflow-y: auto

Footer:
Padding: 16px 20px
Border-top: 1px solid #E5E7EB
Display: flex, justify-content flex-end
Gap: 12px between buttons

Animation:
Scale from 0.95 + fade in 250ms cubic-bezier(0.16, 1, 0.3, 1)
```

---

### 5.7 Checkbox

```
Size: 20x20px
Border: 2px solid #D1D5DB
Border-radius: 4px
Background: White

Checked State:
Background: #0066CC
Border: 2px solid #0066CC
Icon: white checkmark, 12px

Hover:
Cursor: pointer
Unchecked: Border #9CA3AF
Checked: Background #0052A3

Focus:
Box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1)
Border: 2px solid #0066CC

Disabled:
Background: #F3F4F6
Border: 2px solid #E5E7EB
Cursor: not-allowed
```

---

### 5.8 Radio Button

```
Size: 20x20px
Border: 2px solid #D1D5DB
Border-radius: 50%
Background: White

Checked State:
Border: 2px solid #0066CC
Inner circle: 8px diameter, #0066CC

Hover:
Cursor: pointer
Border: 2px solid #9CA3AF

Focus:
Box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1)

Disabled:
Background: #F3F4F6
Border: 2px solid #E5E7EB
Cursor: not-allowed
```

---

### 5.9 Switches/Toggles

```
Size: 48px width x 24px height
Border-radius: 12px
Background (off): #D1D5DB
Background (on): #00A342

Toggle Circle:
Size: 20x20px
Border-radius: 50%
Position: 2px from edge
Transition: 200ms ease-in-out

Hover:
Cursor: pointer
Slightly increased opacity

Disabled:
Opacity: 0.5
Cursor: not-allowed
```

---

### 5.10 Toast Notifications

```
Position: Bottom-right (or top-right alternative)
Width: 380px max
Padding: 16px
Border-radius: 8px
Box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15)
Gap between toasts: 12px

Animation:
Slide in from right + fade in 300ms
Auto-dismiss: 4 seconds (configurable)
Slide out on dismiss 200ms

Variants:

Success Toast:
Background: #D1FAE5
Border-left: 4px solid #00A342
Icon: checkmark (green)
Text: #065F46

Error Toast:
Background: #FEE2E2
Border-left: 4px solid #E23E3E
Icon: X or alert (red)
Text: #991B1B

Warning Toast:
Background: #FEF3C7
Border-left: 4px solid #FF9500
Icon: alert (amber)
Text: #92400E

Info Toast:
Background: #DBEAFE
Border-left: 4px solid #0066CC
Icon: info (blue)
Text: #1E40AF
```

---

### 5.11 Loading States

#### Spinner
```
Circular animated border
Size: 40px (default, scalable)
Border: 3px
Border-color: #E5E7EB
Border-top-color: #0066CC
Animation: rotate 1s linear infinite

Sizes:
Small: 24px
Default: 40px
Large: 56px
```

#### Skeleton/Placeholder
```
Background: #F3F4F6 (light) or #334155 (dark)
Border-radius: matches intended content
Animation: shimmer 1.5s ease-in-out infinite
  - Gradient from transparent to white/dark, then back

Common patterns:
Text line: height 12px, width 60%
Avatar: 40x40px circle
Card: full width, 150px height
```

#### Progress Bar
```
Height: 6px
Background: #E5E7EB
Border-radius: 3px
Fill color: #0066CC
Animation: smooth transition 300ms ease-in-out
Show percentage: optional label above bar
```

---

## 6. Layout System

### Grid & Containers

#### Page Container
```
Max-width: 1440px
Horizontal padding: 24px (md devices), 32px (lg devices)
Margin: 0 auto
```

#### Grid System
```
12-column grid
Gutter: 16px (lg) or 12px (md)

Breakpoints:
Mobile: 320px - 639px (1 column, 100% width)
Tablet: 640px - 1023px (2 columns, 50% width)
Desktop: 1024px + (4-6 columns typical)
Large: 1440px + (full 12 columns available)
```

#### Common Layouts

**Two-Column Main Layout**
```
Sidebar: 280px width (collapsible on mobile)
Main content: flex: 1
Gap: 24px
Sticky sidebar: position sticky, top 0
```

**Three-Column Admin/Project View**
```
Left panel: 320px (filters, navigation)
Center: flex 1 (main content)
Right panel: 320px (details, metadata)
Gap: 16px
Responsive: right panel moves to bottom on tablet
```

---

## 7. Elevation & Depth (Shadow System)

```
Level 1 (Default Card):
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

Level 2 (Hover Card):
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

Level 3 (Floating/Menu):
box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);

Level 4 (Modal):
box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);

Level 5 (Top Modal/Popover):
box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
```

---

## 8. Transitions & Animations

### Standard Timings
```
Fast: 150ms (button hover, icon changes)
Base: 200ms (card transitions, simple slides)
Slow: 300ms (modal enter/exit, complex animations)
Slowest: 500ms (page transitions, important focus shifts)
```

### Easing Functions
```
Ease-in-out: cubic-bezier(0.4, 0, 0.2, 1) - default
Ease-out: cubic-bezier(0, 0, 0.2, 1) - elements entering
Ease-in: cubic-bezier(0.4, 0, 1, 1) - elements leaving
Bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55) - playful interactions
```

### Common Animations
```
Fade: opacity transition
Slide: transform translateX/Y
Scale: transform scale
Rotate: transform rotate
Bounce: keyframe animation with scale
```

### Example: Button Hover
```css
.button {
  transition: all 150ms ease-out;
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

---

## 9. Forms & Validation

### Form Layout
```
Vertical alignment: labels above inputs
Label spacing: 8px below label to input
Field spacing: 16px between fields
Group spacing: 24px between groups

Form group:
Padding: 16px
Border-radius: 8px
Background: #F9FAFB (light mode)
Border: 1px solid #E5E7EB
```

### Validation States

**Error**
```
Input border: 2px solid #E23E3E
Input background: #FEF2F2
Error message below input
Message color: #E23E3E
Message font: 12px
Message icon: X or alert icon
```

**Success**
```
Input border: 2px solid #00A342
Icon: checkmark (green) on right
Message: optional
Message color: #065F46
```

**Warning**
```
Input border: 2px solid #FF9500
Message color: #92400E
Icon: alert
```

**Validation Rules Display**
```
Below password field: show strength indicator
- Weak: red, 1/3 bars filled
- Fair: amber, 2/3 bars filled
- Strong: green, 3/3 bars filled

Real-time validation:
- Show error only after blur or attempt to submit
- Show success only after valid input
```

---

## 10. Data Visualization

### Table Design

```
Header row:
Background: #F3F4F6
Font: 12px, 600 weight
Text: #6B7280
Padding: 12px
Border-bottom: 2px solid #E5E7EB
Sortable columns: pointer cursor, hover background
Sort icons: chevron up/down, 12px

Data rows:
Height: 44px
Padding: 12px per cell
Border-bottom: 1px solid #E5E7EB
Hover: background #F9FAFB

Alternating rows (optional):
Row 2, 4, 6...: background #F9FAFB
No alternating in dark mode (too distracting)

Striped table (dark mode):
Row 1, 3, 5...: background #1E293B
Row 2, 4, 6...: background #0F172A
```

### Chart/Graph Components
```
Background: transparent or card
Grid lines: #E5E7EB (light) / #475569 (dark)
Data colors: use primary palette
Hover tooltip: background #1E293B, text white, shadow

Legend:
Position: bottom or right
Item spacing: 16px
Colors: match chart data
```

---

## 11. Accessibility

### WCAG 2.1 AA Compliance

**Color Contrast**
```
Normal text: minimum 4.5:1 ratio
Large text (18pt+): minimum 3:1 ratio
Graphics/UI components: minimum 3:1 ratio

Test colors:
Primary blue (#0066CC) on white: 8.2:1 ✓
Secondary gray (#6B7280) on white: 4.57:1 ✓
Error red (#E23E3E) on white: 5.3:1 ✓
```

**Focus States**
```
All interactive elements must have visible focus
Focus outline: 2px solid, color #0066CC
Focus outline offset: 2px
Never remove outline (use outline: none)
```

**Keyboard Navigation**
```
Tab order: logical reading order
Tab trap prevention: focus returns to trigger on dismiss
Skip links: "Skip to main content" at top
Shortcuts: documented keyboard shortcuts for power users
ARIA labels: for icon-only buttons
```

**Semantic HTML**
```
Use semantic elements: <button>, <input>, <select>, etc.
Form inputs with <label> elements
Links should be <a> tags
Headings: h1-h6 in logical order
```

**Screen Reader Testing**
```
Test with: NVDA, JAWS, VoiceOver
Form labels: associated with input via htmlFor
Error messages: linked to input via aria-describedby
Live regions: use aria-live for updates
Images: alt text or role="presentation" if decorative
```

---

## 12. Responsive Design

### Breakpoints

```
Mobile First Approach:
xs: 320px (base)
sm: 640px (tablet small)
md: 1024px (tablet large)
lg: 1280px (desktop)
xl: 1440px (large desktop)
2xl: 1920px (ultra-wide)
```

### Responsive Adjustments

**Navigation**
```
Mobile (xs-sm): hamburger menu, vertical layout
Tablet (md): collapsible sidebar
Desktop (lg+): fixed sidebar or horizontal nav
```

**Grid**
```
Mobile: 1 column, full width
Tablet: 2 columns, 12px gutter
Desktop: 4-6 columns, 16px gutter
```

**Padding/Margins**
```
Mobile: 12px
Tablet: 16px
Desktop: 24px-32px
```

**Font Sizes (reduced on mobile)**
```
Body text: 16px (mobile) → 14px (desktop)
Headlines: 24px (mobile) → 32px (desktop)
Labels: 12px (consistent)
```

---

## 13. Dark Mode Implementation

### Color Mapping
```
Light Mode → Dark Mode:
White (#FFFFFF) → #0F172A
Off-white (#F9FAFB) → #1E293B
Light gray (#F3F4F6) → #334155
Border (#E5E7EB) → #475569
Primary text (#111827) → #F8FAFC
Secondary text (#6B7280) → #CBD5E1
```

### Implementation Strategy
```
CSS Variables:
--color-bg-primary: light/dark
--color-bg-secondary: light/dark
--color-text-primary: light/dark
etc.

Toggle mechanism:
localStorage: 'theme' key
System preference: prefers-color-scheme media query
Manual toggle: button in settings
Smooth transition: 200ms on theme change
```

### Dark Mode Specific Rules
```
- No alternating row colors (too busy)
- Slightly reduced saturation on colors
- Icons: use subtle glows or shadows for depth
- Modals: slightly elevated background
- Text: reduced opacity on secondary text (CBD5E1 vs pure white)
```

---

## 14. Component States & Patterns

### Common State Combinations

**Enabled + Default**
```
Full interactivity
Neutral colors
Ready for user action
```

**Hover + Focus**
```
Background change + outline
Shows action is possible
Accessible to keyboard users
```

**Loading**
```
Disabled state with spinner
Prevent duplicate submissions
Clear feedback to user
```

**Error**
```
Red styling + error message
Prevent form submission
Clear error text
```

**Success**
```
Green checkmark + confirmation message
Auto-dismiss or user action required
Optional: redirect or next action
```

---

## 15. Design Tokens (CSS/SCSS Variables)

```css
/* Colors */
--color-primary: #0066CC;
--color-success: #00A342;
--color-warning: #FF9500;
--color-error: #E23E3E;
--color-neutral: #6B7280;

/* Spacing */
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 12px;
--spacing-lg: 16px;
--spacing-xl: 24px;
--spacing-2xl: 32px;

/* Typography */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', monospace;
--font-size-body: 14px;
--font-weight-regular: 400;
--font-weight-semibold: 600;
--font-weight-bold: 700;

/* Sizing */
--size-button-height: 40px;
--size-input-height: 40px;
--size-icon: 16px;
--size-avatar: 40px;

/* Shadows */
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);

/* Border Radius */
--radius-sm: 4px;
--radius-md: 6px;
--radius-lg: 8px;
--radius-full: 9999px;

/* Transitions */
--transition-fast: 150ms ease-out;
--transition-base: 200ms ease-in-out;
--transition-slow: 300ms ease-in-out;

/* Z-Index Scale */
--z-dropdown: 100;
--z-sticky: 200;
--z-modal: 1000;
--z-tooltip: 1100;
--z-notification: 1200;
```

---

## 16. Component Documentation Examples

### Example: Button Component

**Props**
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger'; // default: primary
  size?: 'small' | 'medium' | 'large'; // default: medium
  disabled?: boolean;
  loading?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  children: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}
```

**Usage**
```jsx
<Button variant="primary" onClick={handleSubmit}>
  Create Project
</Button>

<Button variant="secondary" size="large" icon={<PlusIcon />}>
  Add Team Member
</Button>

<Button variant="danger" disabled>
  Delete
</Button>

<Button loading>
  Saving...
</Button>
```

---

### Example: Input Component

**Props**
```typescript
interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number';
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  helpText?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  required?: boolean;
}
```

**Usage**
```jsx
<Input
  label="Project Name"
  value={name}
  onChange={setName}
  placeholder="Enter project name"
  required
/>

<Input
  type="email"
  label="Email"
  value={email}
  onChange={setEmail}
  error="Invalid email format"
  icon={<EnvelopeIcon />}
/>
```

---

### Example: Card Component

**Props**
```typescript
interface CardProps {
  title?: string;
  subtitle?: string;
  interactive?: boolean;
  onClick?: () => void;
  selected?: boolean;
  children: React.ReactNode;
  footer?: React.ReactNode;
}
```

**Usage**
```jsx
<Card title="Q1 Roadmap">
  <p>Project details and timeline</p>
  <Card.Footer>
    <Button>Edit</Button>
  </Card.Footer>
</Card>

<Card interactive onClick={openProject} selected={isSelected}>
  <h3>Mobile App Redesign</h3>
  <p>Team: 4 members | Due: 2026-05-15</p>
</Card>
```

---

## 17. Usage Guidelines

### When to Use Each Component

| Component | Use Case | Avoid |
|-----------|----------|-------|
| Primary Button | Main CTAs, form submission | Multiple primary buttons in a section |
| Secondary Button | Alternative actions, cancel | Primary action |
| Danger Button | Destructive actions | Non-critical actions |
| Card | Grouped content, container | Wrapping single text line |
| Badge | Status indicators, labels | Main navigation |
| Modal | Important decisions, forms | Simple confirmations (use toast) |
| Toast | Notifications, temporary feedback | Persistent important info |
| Table | Tabular data, lists | Long-form prose |
| Sidebar | Navigation, filters | Main content area |
| Dropdown | Selecting from options | Too many options (20+) |
| Checkbox | Multiple selections | Single selection (use radio) |
| Radio | Single selection | Multiple selections (use checkbox) |
| Switch | Binary on/off | Multiple options |

---

## 18. Performance & Optimization

### Best Practices

**CSS**
```
- Use CSS variables for theming (no JS recalculation)
- Minimize repaints: batch DOM updates
- Use will-change sparingly: only on animated elements
- Remove unused shadows and effects on mobile
```

**Components**
```
- Lazy load modals and heavy components
- Memoize expensive computations (React.memo)
- Virtual scrolling for long lists (1000+ items)
- Debounce search/filter inputs (300ms)
```

**Images & Icons**
```
- Icons: use SVG sprites or icon fonts (0.5KB overhead vs 10KB per image)
- Avatar images: compress to WebP, lazy load
- Use srcset for responsive images
- Preload hero images
```

---

## 19. Browser Support

```
Chrome: 90+
Firefox: 88+
Safari: 14+
Edge: 90+

Polyfills needed for:
- CSS Grid (auto-fallback to flexbox)
- CSS Variables (no fallback, require modern browsers)
```

---

## 20. Maintenance & Evolution

### Design System Versioning

```
Semantic versioning: MAJOR.MINOR.PATCH

MAJOR: breaking changes (API changes)
MINOR: new components, features
PATCH: bug fixes, refinements

Changelog: document all updates
Deprecation warnings: 2-3 versions before removal
```

### Adding New Components

```
1. Define props and API
2. Create in isolation (Storybook)
3. Test for accessibility (WCAG AA)
4. Test responsive behavior
5. Document with examples
6. Iterate based on feedback
```

---

## Conclusion

This design system provides a comprehensive foundation for building a modern, accessible, and professional project management dashboard. It emphasizes clarity, efficiency, and developer experience while maintaining flexibility for future expansion. All components follow consistent patterns for accessibility and responsive behavior, ensuring a seamless experience across devices and for users with varying abilities.

The system should be reviewed and refined regularly based on user feedback and usage metrics in the production environment.
