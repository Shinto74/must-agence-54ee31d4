# Healthcare Analytics Platform - Design System

## Executive Overview

This design system is tailored for a B2B SaaS healthcare analytics platform targeting hospital administrators and data analysts. The design emphasizes professional credibility, medical trustworthiness, clarity of complex data visualization, and compliance-ready aesthetics. The system leverages Next.js for server-side rendering, optimal SEO, and enterprise-grade performance.

**Primary Style:** Modern Medical Minimalism with Accent Highlights
**Target Audience:** Hospital administrators, clinical data analysts, healthcare IT professionals
**Platforms:** Web (responsive: desktop, tablet, mobile)
**Framework:** Next.js (React-based)
**Data Focus:** Complex analytics dashboards, patient outcomes, operational metrics

---

## Color Palette

### Primary Colors
- **Brand Blue (Trust/Stability):** `#0052CC`
  - Primary CTA buttons, key actionable elements
  - Conveys medical professionalism and reliability
  - Passes WCAG AA contrast ratios

- **Complementary Teal:** `#00A3E0`
  - Secondary interactive elements, hover states
  - Represents healthcare innovation and patient care
  - Works well for data insights highlights

### Secondary Colors
- **Slate Gray (Text/Neutral):** `#344054`
  - Primary text color for readability
  - Reduces eye strain for long analytical sessions
  - Professional, non-clinical feel

- **Light Neutral Background:** `#F5F7FA`
  - Dashboard backgrounds, card containers
  - Improves contrast and reduces glare
  - Supports accessibility (WCAG AA+)

### Semantic/Status Colors
- **Success (Green):** `#22C55E`
  - Patient improvements, positive KPIs
  - Within safe medical ranges
  - Data validation confirmations

- **Warning (Amber):** `#F59E0B`
  - Alerts requiring review
  - Unusual patterns in patient data
  - Action required notifications

- **Critical/Error (Red):** `#EF4444`
  - Critical patient alerts
  - Data anomalies
  - System errors requiring immediate attention

- **Information (Blue):** `#3B82F6`
  - Data insights, contextual information
  - Learning materials, help text
  - Non-urgent notifications

- **Neutral Disabled:** `#9CA3AF`
  - Disabled form fields
  - Inactive menu items
  - Historical/archived data indicators

### Extended Palette for Data Visualization
- **Chart Colors (distinct palette):**
  - Series 1: `#0052CC` (Primary Blue)
  - Series 2: `#00A3E0` (Teal)
  - Series 3: `#7C3AED` (Purple - hospital specialties)
  - Series 4: `#EC4899` (Pink - patient demographics)
  - Series 5: `#F59E0B` (Amber - warnings)
  - Series 6: `#10B981` (Emerald - outcomes)

### Accessibility Considerations
- All status colors meet WCAG AA standard (4.5:1 contrast minimum)
- Colorblind-safe palette; semantic meaning not solely color-dependent
- Gray text on white provides 12.5:1 contrast ratio
- Blue text on light gray provides 6.2:1 contrast ratio

---

## Typography System

### Font Pairing: Inter (Headings) + Lato (Body)

#### Inter (Google Fonts)
**Purpose:** Headings, nav items, labels, call-to-action text
**Characteristics:**
- Humanist sans-serif with excellent screen legibility
- Narrow letterforms ensure clarity in data labels
- Vetted for medical/formal contexts
- OpenType variable font (performance optimized)

**Weights Used:**
- `font-weight: 700` — Display headings, primary CTAs
- `font-weight: 600` — Section headings, card titles
- `font-weight: 500` — Subheadings, active states
- `font-weight: 400` — Form labels, secondary text

#### Lato (Google Fonts)
**Purpose:** Body text, descriptions, data tables
**Characteristics:**
- Friendly yet professional sans-serif
- Excellent readability at small sizes (important for analytics)
- Warm, approachable tone offsetting clinical nature
- Supports extended character sets for international healthcare records

**Weights Used:**
- `font-weight: 400` — Primary body text
- `font-weight: 700` — Emphasis within body copy
- `font-weight: 300` — Secondary/reduced emphasis text

### Type Scale

```
Heading 1 (H1):     48px / 60px leading | Inter 700 | Usage: Page titles, key metrics
Heading 2 (H2):     36px / 44px leading | Inter 600 | Usage: Section titles, dashboard regions
Heading 3 (H3):     28px / 36px leading | Inter 600 | Usage: Card titles, subsections
Heading 4 (H4):     24px / 32px leading | Inter 500 | Usage: Form titles, data breakdowns
Heading 5 (H5):     18px / 28px leading | Inter 500 | Usage: Labels, small headers
Heading 6 (H6):     14px / 22px leading | Inter 500 | Usage: Timestamps, metadata

Body Large:         16px / 24px leading | Lato 400 | Usage: Main descriptive text, chart labels
Body Regular:       14px / 21px leading | Lato 400 | Usage: Standard body text, table content
Body Small:         12px / 18px leading | Lato 400 | Usage: Help text, form hints, captions
Body XSmall:        11px / 16px leading | Lato 400 | Usage: Timestamps, minimal metadata

Caption:            12px / 16px leading | Lato 300 | Usage: Secondary info, disclaimers
```

### Line Height & Spacing
- **Prose Content:** 1.5x line height (relaxed for medical clarity)
- **Data Tables:** 1.4x line height (compact for dense analytics)
- **Form Labels:** 1.2x line height (tight alignment)
- **Letter Spacing:** 0.3px on all-caps labels (improves clinical terminology readability)

---

## Component Patterns

### Buttons & CTAs

#### Primary Button (Brand Blue)
```
Background: #0052CC
Text: White, Inter 600, 14px
Padding: 12px 24px
Border-radius: 6px
Box-shadow: 0 1px 3px rgba(0,0,0,0.1)

Hover: Background #0041A3, shadow increase
Active: Background #003399
Disabled: Background #D1D5DB, cursor not-allowed
```

**Usage:** Primary actions (Export Report, Save Alert, Generate Dashboard)

#### Secondary Button (Teal)
```
Background: transparent
Border: 2px solid #00A3E0
Text: #00A3E0, Inter 600, 14px
Padding: 10px 22px
Border-radius: 6px

Hover: Background #E0F7FF
Active: Background #B3E5FC
```

**Usage:** Secondary actions, navigation, data filters

#### Tertiary Button (Text)
```
Background: transparent
Text: #0052CC, Inter 500, 14px
Padding: 8px 16px

Hover: Background #F5F7FA, text #0041A3
Active: Text #003399
```

**Usage:** Minimal actions, inline links, collapsible sections

#### Icon Button
```
Size: 36x36px, centered icon
Icon: 18px stroke-width 1.5
Background on hover: #F5F7FA
Padding: 9px (equal on all sides)
Border-radius: 6px
```

**Usage:** Close buttons, minimize, expand, data refresh

### Form Elements

#### Text Input
```
Width: Full container width (responsive)
Height: 40px
Padding: 10px 12px
Border: 1px solid #D1D5DB
Border-radius: 6px
Font: Lato 14px #344054
Background: White
Focus: Border #0052CC, box-shadow: 0 0 0 3px rgba(0,82,204,0.1)
```

**States:**
- Default: Border gray
- Focus: Border blue, shadow
- Filled: Show character count if >100 chars expected
- Error: Border #EF4444, message below in error red
- Disabled: Background #F5F7FA, border #E5E7EB

#### Select/Dropdown
```
Height: 40px
Padding: 10px 12px
Font: Lato 14px
Border: 1px solid #D1D5DB
Border-radius: 6px
Dropdown icon: Chevron down, #6B7280
Background: White
Max options shown: 6 (scrollable)
```

**Usage:** Department filters, metric selection, date ranges

#### Checkbox
```
Size: 18x18px
Border: 2px solid #D1D5DB
Border-radius: 3px
Checked: Background #0052CC, check icon white
Focus: Ring 3px rgba(0,82,204,0.1)
Spacing from label: 8px
Label: Lato 14px, clickable target area
```

**Usage:** Multi-select filters, notification preferences, bulk actions

#### Radio Button
```
Size: 18x18px
Border: 2px solid #D1D5DB
Border-radius: 50%
Selected: Border #0052CC, inner circle #0052CC
Focus: Ring 3px rgba(0,82,204,0.1)
Spacing from label: 8px
```

**Usage:** Single-select options, view modes, alert thresholds

#### Toggle Switch
```
Width: 44px, Height: 24px
Background off: #D1D5DB
Background on: #22C55E
Handle: 20px white circle
Border-radius: 12px
Transition: 200ms ease-in-out
Label: Lato 14px, positioned to left or above
```

**Usage:** Alert activation, data visibility toggles, chart type selection

### Cards & Containers

#### Metric Card (KPI Dashboard)
```
Background: White
Border: 1px solid #E5E7EB
Border-radius: 8px
Padding: 20px
Box-shadow: 0 1px 2px rgba(0,0,0,0.05)

Header: Metric name (Lato 12px, #6B7280)
Value: Large number (Inter 32px 700, #344054)
Sparkline: Small trend chart (4px height, accent color)
Footer: Change indicator (±5.2%, color-coded status)

Hover: Box-shadow 0 4px 6px rgba(0,0,0,0.1), subtle lift
```

**Usage:** Primary metrics, KPIs, patient statistics

#### Data Card
```
Background: White
Border-left: 4px solid status-color
Border-radius: 4px
Padding: 16px
Box-shadow: 0 1px 3px rgba(0,0,0,0.1)
```

**Usage:** Alert cards, contextual information, clinical notes

#### Panel/Section Container
```
Background: #F5F7FA
Border-radius: 8px
Padding: 20px
Border: 1px solid #E5E7EB

Header: Bold title (Inter 18px 600)
Body: Content area (Lato 14px)
Footer: Actions or metadata (optional)
```

**Usage:** Grouped dashboard sections, filter panels, report sections

### Navigation

#### Top Navigation Bar
```
Height: 56px
Background: White
Border-bottom: 1px solid #E5E7EB
Padding: 0 24px
Sticky: top: 0, z-index: 40

Logo: 32px mark, left-aligned
Nav Items: Lato 14px 500, #344054
Active Item: Border-bottom 3px #0052CC
Spacing between items: 32px

Right side: User profile menu, notification bell, help
```

**Usage:** Main app navigation, consistent across all pages

#### Sidebar Navigation
```
Width: 260px
Background: White
Border-right: 1px solid #E5E7EB
Padding: 20px 0

Menu items:
- Height: 40px
- Padding: 0 16px
- Font: Lato 13px 500, #344054
- Icon: 18px, left-aligned, 12px margin-right

Active state:
- Background: #E0F2FF
- Text: #0052CC
- Left border: 3px solid #0052CC

Hover: Background #F5F7FA
```

**Usage:** Primary navigation for dashboards, collapsible menu groups

#### Breadcrumbs
```
Separator: "/" (Lato 14px, #9CA3AF)
Links: Lato 14px, #0052CC
Active: Lato 14px, #344054 (not clickable)
Padding: 12px 0

Example: Home / Patients / John Doe / Vitals
```

**Usage:** Nested navigation, contextual path awareness

### Data Visualization

#### Table Header
```
Background: #F5F7FA
Border-bottom: 2px solid #E5E7EB
Padding: 12px 16px
Font: Inter 12px 600, #6B7280
Text-transform: uppercase
Letter-spacing: 0.3px

Sortable column: Cursor pointer, hover background #EEEFF2
Sort indicator: Small chevron (blue if active)
```

#### Table Row
```
Height: 44px
Padding: 12px 16px
Border-bottom: 1px solid #E5E7EB
Font: Lato 14px, #344054

Hover: Background #FAFBFC
Selected: Background #EFF6FF, border-left 3px #0052CC

Alternating rows (optional): Gray background every 2nd row at #FAFBFC
```

#### Chart Typography
```
Title: Inter 16px 600, #344054
Subtitle: Lato 12px, #6B7280
Axis labels: Lato 11px, #9CA3AF
Legend items: Lato 12px, #344054
Tooltips: Lato 12px, white text on dark background
```

#### Chart Color Guidance
- **Line Charts:** Use primary blue and teal for 2-series comparisons
- **Bar Charts:** Semantic colors for status (green=good, amber=caution, red=critical)
- **Pie/Donut:** 6-color rotating palette for department breakdown
- **Sparklines:** Single accent color with light gray background
- **Heat Maps:** Green→Yellow→Red gradient for intensity visualization

### Modals & Overlays

#### Modal Window
```
Background: White
Border-radius: 8px
Box-shadow: 0 20px 25px rgba(0,0,0,0.15)
Max-width: 600px
Padding: 24px

Header: Inter 20px 600, #344054 (with close button × on right)
Body: Lato 14px, #344054
Footer: Button group (right-aligned, 12px gap)

Overlay: Background rgba(0,0,0,0.5), z-index 50
Scrim: Click to dismiss (unless critical alert)
```

**Usage:** Confirm dialogs, data entry forms, alerts

#### Toast/Notification
```
Position: Bottom-right (24px from edges)
Background: Semantic color (success/warning/error/info)
Text: White, Lato 14px
Padding: 12px 16px
Border-radius: 6px
Max-width: 400px
Box-shadow: 0 4px 6px rgba(0,0,0,0.1)

Auto-dismiss: 4-6 seconds (errors: manual)
Action button: Optional secondary action
Progress bar: Optional countdown indicator
```

**Usage:** Form submissions, data saves, error messages

#### Tooltip
```
Background: #344054 (dark)
Text: White, Lato 12px
Padding: 8px 12px
Border-radius: 4px
Arrow: 6px pointing to target
Delay: 300ms on hover
Max-width: 300px (wraps text)

Dark theme: Gray-900, white text
Light theme: Gray-100, dark text
```

**Usage:** Clarify metrics, explain medical terminology, show help

---

## Landing Page Structure

### Hero Section
```
Height: 600px (desktop), 400px (mobile)
Background: Linear gradient from #0052CC to #00A3E0
Text alignment: Center, vertically centered

Headline: Inter 48px 700, white
Subheadline: Lato 18px 400, white with 70% opacity
CTA Button: Primary white-text button (see Button section)
Secondary CTA: Ghost button (border white, transparent background)

Background imagery: Subtle healthcare-related abstract (blurred patient dashboard)
```

### Feature Showcase Section
```
Layout: 3-column grid (desktop), 1 column (mobile)
Gap: 32px
Padding: 60px 24px
Background: White

Feature Card:
- Icon: 48px, #0052CC
- Title: Inter 20px 600
- Description: Lato 14px, #6B7280
- Link: Small arrow indicator (optional)
- Hover: Subtle shadow lift, border-left 4px #00A3E0

Features: Data Security, Real-time Alerts, Compliance Dashboard, Integration Hub
```

### Testimonial/Social Proof Section
```
Background: #F5F7FA
Padding: 60px 24px

Section title: Inter 36px 600
Cards: 2-column grid, white background, left border 4px #0052CC

Quote: Lato 16px italic
Author: Inter 14px 600
Role/Hospital: Lato 12px, #6B7280

Rating: 5-star icon (optional)
```

### CTA Section
```
Background: #0052CC (or white with blue border)
Padding: 40px 24px
Text alignment: Center

Headline: Inter 32px 600 (white text)
Subheadline: Lato 16px (white/light)
CTA: Primary button
Compliance note: Lato 11px, muted (HIPAA compliant, SOC 2 certified)
```

### Footer
```
Background: #1F2937 (dark slate)
Padding: 40px 24px
Text: White, Lato 13px

Columns:
- Product links
- Compliance/Legal links
- Company info
- Contact

Logo: Top left, white mark
Copyright: Bottom, Lato 11px
```

---

## Data Visualization Recommendations

### Recommended Chart Types for Healthcare Analytics

#### 1. Patient Outcomes Over Time
- **Type:** Line Chart
- **Series:** Multiple patient cohorts or conditions
- **Colors:** Primary blue for main cohort, secondary colors for subgroups
- **Use Case:** Showing improvement trends, medication effectiveness
- **Next.js Component:** Recharts (lightweight, HIPAA-friendly)

#### 2. Department Performance Metrics
- **Type:** Horizontal Bar Chart
- **Colors:** Semantic (green for high performance, amber for average, red for low)
- **Labels:** Show actual values above/beside bars
- **Use Case:** Quick visual scan of department KPIs
- **Interaction:** Click to drill into department details

#### 3. Patient Demographics Breakdown
- **Type:** Donut or Pie Chart
- **Colors:** 6-color rotation from palette
- **Labels:** Percentage + count, legend on right
- **Use Case:** Age groups, gender, insurance status
- **Alternative:** Stacked bar chart for comparison across hospitals

#### 4. Alert/Incident Tracking
- **Type:** Stacked Column Chart
- **Colors:** Red (critical), Amber (warning), Gray (resolved)
- **X-axis:** Time periods (daily/weekly)
- **Use Case:** Show alert volume trends and resolution rates

#### 5. Operational Efficiency (Wait Times, Bed Occupancy)
- **Type:** Combination Chart (Area + Line)
- **Primary:** Area chart for bed occupancy (teal)
- **Secondary:** Line chart for wait times (red)
- **Use Case:** Identify capacity bottlenecks

#### 6. Compliance Metrics Dashboard
- **Type:** Gauge/Progress Charts
- **Colors:** Green (compliant), Amber (approaching limit), Red (non-compliant)
- **Label:** Target vs. actual percentage
- **Use Case:** HIPAA compliance, quality metrics

#### 7. Predictive Analytics
- **Type:** Scatter plot with trend line
- **Colors:** Series color + confidence interval shading
- **Use Case:** Readmission risk, patient deterioration prediction
- **Interaction:** Hover to see confidence intervals

### Anti-Patterns to Avoid

#### 1. Color Overuse
- **Don't:** Use all 6 colors in a single chart
- **Do:** Limit palette to 2-3 colors, use semantic meanings
- **Reason:** Reduces cognitive load for clinical staff viewing dozens of metrics daily

#### 2. Low Contrast Data Labels
- **Don't:** Gray text on gray background in charts
- **Do:** Always ensure 4.5:1 WCAG AA contrast for readability
- **Reason:** Hospital staff work in variable lighting; clinical decisions depend on data clarity

#### 3. Unnecessary 3D Effects
- **Don't:** Use 3D pie charts or exploded segments
- **Do:** Flat 2D charts, simple visual hierarchy
- **Reason:** 3D distorts proportions; inaccurate for medical decision-making

#### 4. Dense Data Without Filtering
- **Don't:** Show 12 months of data for 30 departments in one view
- **Do:** Implement smart defaults (last 30 days, top 5 departments) with drill-down
- **Reason:** Information overload leads to missed alerts

#### 5. Vague Medical Terminology
- **Don't:** Use medical abbreviations without tooltips (e.g., "LOS", "AKI")
- **Do:** Provide hover explanations and full terms
- **Reason:** Data analysts may have varying clinical backgrounds

#### 6. Ignoring Temporal Context
- **Don't:** Show metrics without clear timestamps
- **Do:** Always include date range, last-updated time, and comparison periods
- **Reason:** Outdated data can lead to incorrect clinical decisions

#### 7. Flashing/Animated Alerts
- **Don't:** Use rapid animations for critical alerts
- **Do:** Bold color + static design, sound optional (with mute)
- **Reason:** Accessibility (photosensitive epilepsy risk); professional aesthetic

#### 8. Unvalidated Data Assumptions
- **Don't:** Auto-calculate aggregations without user confirmation
- **Do:** Show calculated metrics with clear methodology in tooltips
- **Reason:** Data interpretation errors have clinical consequences

---

## Implementation Guide: Next.js

### Project Setup
```bash
# Create Next.js project with TypeScript
npx create-next-app@latest healthcare-analytics \
  --typescript \
  --tailwind \
  --eslint \
  --git

# Install design system dependencies
npm install recharts lucide-react classnames
npm install -D tailwindcss-safe-area
```

### Tailwind Configuration
```javascript
// tailwind.config.ts
export default {
  theme: {
    colors: {
      primary: '#0052CC',
      'primary-dark': '#0041A3',
      'primary-light': '#E0F2FF',
      secondary: '#00A3E0',
      success: '#22C55E',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
      slate: {
        900: '#344054',
        600: '#6B7280',
        400: '#9CA3AF',
        200: '#E5E7EB',
      },
      'neutral-bg': '#F5F7FA',
    },
    extend: {
      fontFamily: {
        'sans': ['var(--font-inter)', 'var(--font-lato)'],
        'inter': ['var(--font-inter)'],
        'lato': ['var(--font-lato)'],
      },
    },
  },
}
```

### Font Loading (Next.js 13+)
```typescript
// app/layout.tsx
import { Inter, Lato } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
})

const lato = Lato({
  subsets: ['latin'],
  variable: '--font-lato',
  weight: ['300', '400', '700'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${lato.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

### Component Structure
```
/components
  /ui
    /Button.tsx          # Primary, secondary, tertiary variants
    /Card.tsx            # Metric card, data card
    /Modal.tsx           # Modal dialog
    /Toast.tsx           # Toast notifications
    /Input.tsx           # Form inputs
    /Select.tsx          # Dropdown select
    /Checkbox.tsx        # Checkbox input
    /Toggle.tsx          # Toggle switch
  /layout
    /Navigation.tsx      # Top nav bar
    /Sidebar.tsx         # Sidebar navigation
    /Footer.tsx          # Footer section
  /dashboard
    /MetricCard.tsx      # KPI display with sparkline
    /DataTable.tsx       # Sortable data table
    /ChartContainer.tsx  # Recharts wrapper

/pages or /app
  /landing              # Landing page
  /dashboard            # Main dashboard
  /reports              # Analytics reports
  /settings             # User settings
```

### Responsive Design Breakpoints
```css
/* Mobile-first approach */
/* sm: 640px */
/* md: 768px */
/* lg: 1024px */
/* xl: 1280px */
/* 2xl: 1536px */

/* Healthcare-specific: Account for sidebar navigation */
/* On desktop: 260px sidebar + content area */
/* On mobile: Full-width stacked layout */
```

### Accessibility Checklist
- [ ] Semantic HTML (`<button>`, `<nav>`, `<main>`, `<header>`)
- [ ] ARIA labels for chart interactions (`aria-label`, `role="img"`)
- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] Focus indicators (visible 3px outline)
- [ ] Color contrast ratios (4.5:1 minimum for text)
- [ ] Form labels associated with inputs (`htmlFor`)
- [ ] Error messages linked to inputs (`aria-describedby`)
- [ ] Alert roles for critical notifications (`role="alert"`)
- [ ] Skip navigation link on landing page
- [ ] Alt text for all meaningful images

### Performance Optimizations
```typescript
// Image optimization
import Image from 'next/image'

<Image
  src="/healthcare-dashboard.png"
  alt="Healthcare analytics dashboard showing patient metrics"
  width={1200}
  height={600}
  priority
/>

// Code splitting for charts
import dynamic from 'next/dynamic'

const PatientTrendChart = dynamic(
  () => import('@/components/dashboard/PatientTrendChart'),
  { loading: () => <ChartSkeleton /> }
)

// Lazy load modals
const PatientDetailsModal = dynamic(
  () => import('@/components/modals/PatientDetailsModal')
)
```

### SEO & Meta Tags (Landing Page)
```typescript
// app/page.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Healthcare Analytics Platform | Hospital Data Insights',
  description: 'Real-time patient analytics, compliance dashboards, and operational metrics for hospital administrators and data analysts.',
  keywords: ['healthcare analytics', 'hospital dashboard', 'patient data', 'compliance'],
  openGraph: {
    title: 'Healthcare Analytics Platform',
    description: 'Transform hospital data into actionable insights',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
}
```

### Compliance & Security Notes
- **HIPAA Compliance:** Ensure all API calls use HTTPS, implement end-to-end encryption
- **Data Minimization:** Don't log patient identifiers in client-side analytics
- **Access Control:** Implement role-based access (admin, analyst, clinician) at API layer
- **Audit Trail:** Log all data access for compliance audits
- **Session Management:** Auto-logout after 15 minutes of inactivity
- **Rate Limiting:** Protect against brute-force attacks on authentication endpoints

### Dark Mode Support (Optional)
```typescript
// If implementing dark mode for night-shift hospital staff
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning>
      <body className="light dark:bg-slate-900 dark:text-white">
        {children}
      </body>
    </html>
  )
}
```

**Dark mode palette:**
- Background: `#111827` (dark slate)
- Surfaces: `#1F2937` (slightly lighter)
- Text: `#F3F4F6` (light gray)
- Accent: `#3B82F6` (lighter blue for contrast)

---

## Design Specifications Summary

| Element | Specification |
|---------|---------------|
| **Primary Font** | Inter (headings, UI labels) |
| **Body Font** | Lato (body text, descriptions) |
| **Primary Color** | #0052CC (Brand Blue) |
| **Secondary Color** | #00A3E0 (Teal) |
| **Success Color** | #22C55E (Green) |
| **Warning Color** | #F59E0B (Amber) |
| **Error Color** | #EF4444 (Red) |
| **Border Radius** | 6px (components), 8px (cards) |
| **Button Height** | 40px |
| **Form Input Height** | 40px |
| **Spacing Scale** | 4px, 8px, 12px, 16px, 20px, 24px, 32px, 40px, 48px |
| **Shadow (Subtle)** | 0 1px 2px rgba(0,0,0,0.05) |
| **Shadow (Medium)** | 0 4px 6px rgba(0,0,0,0.1) |
| **Shadow (Lift)** | 0 10px 15px rgba(0,0,0,0.1) |
| **Focus Ring** | 3px rgba(0,82,204,0.1) |
| **Transition Timing** | 200ms ease-in-out (buttons, hovers) |
| **Viewport Widths** | Mobile: 320-767px, Tablet: 768-1023px, Desktop: 1024px+ |

---

## Medical & Professional Considerations

### Trust Signaling
1. **Certification Badges:** Display HIPAA, SOC 2, ISO 27001 badges in footer
2. **Company Authority:** About page with team credentials, board certifications
3. **Data Security:** Prominent security statements (encryption, audit trails)
4. **Privacy Policy:** Clear, plain-language privacy documentation

### Inclusivity & Accessibility
1. **Language Options:** Consider Spanish for diverse hospital staff
2. **Readable Typography:** Sans-serif, 14px minimum for body text
3. **Color Independence:** Status conveyed through icons + color, not color alone
4. **Keyboard Accessibility:** Full navigation without mouse required
5. **Screen Reader Support:** Semantic HTML, descriptive ARIA labels

### Clinical Appropriateness
1. **Avoid Medical Imagery:** No cartoonish doctor/nurse illustrations
2. **Professional Tone:** Formal, clinical language; avoid casual/folksy
3. **Data Integrity:** Never show fabricated patient data in demos
4. **Terminology Clarity:** Define medical abbreviations on first use
5. **Regulatory Awareness:** Include disclaimers about clinical decision support

---

## Deployment Considerations

### Next.js Deployment (Vercel Recommended)
```bash
# Environment variables
NEXT_PUBLIC_API_URL=https://api.healthcare-analytics.com
DATABASE_URL=postgresql://...
HIPAA_ENCRYPTION_KEY=...

# Vercel deployment
npm run build
vercel deploy --prod
```

### Performance Targets
- **Lighthouse Score:** 90+ on desktop, 85+ on mobile
- **First Contentful Paint (FCP):** <1.5s
- **Cumulative Layout Shift (CLS):** <0.1
- **Time to Interactive (TTI):** <2.5s
- **Bundle Size:** <150KB gzipped (for landing page)

### Monitoring & Analytics
- **Error Tracking:** Sentry integration for exception monitoring
- **Performance Monitoring:** Vercel Web Analytics or Google Analytics 4
- **Compliance Logging:** Supabase Postgres for audit trail
- **Uptime Monitoring:** UptimeRobot or Datadog

---

## Conclusion

This design system provides a comprehensive, production-ready foundation for a B2B SaaS healthcare analytics platform. The Modern Medical Minimalism approach balances professional credibility with approachable usability, ensuring that hospital administrators and data analysts can navigate complex medical data with confidence.

The system is optimized for Next.js, prioritizes accessibility and regulatory compliance, and includes specific guidance for healthcare-appropriate data visualization. All color, typography, and component specifications are tailored to the clinical context while maintaining modern, professional aesthetics.

**Key Principles:**
- Trust through clarity and simplicity
- Data integrity and medical appropriateness
- Regulatory compliance and security
- Inclusive and accessible design
- Performance-optimized for healthcare environments

**Next Steps:**
1. Create component library using Storybook or Chromatic
2. Build landing page with Hero, Features, Testimonials, CTA
3. Implement main dashboard with sample data visualization
4. Set up authentication and role-based access control
5. Conduct user testing with hospital administrators and data analysts
6. Implement HIPAA audit logging and compliance monitoring
7. Deploy to production with security and performance monitoring
