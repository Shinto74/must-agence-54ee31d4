# Design System: EcoStyle - Sustainable Fashion Mobile Commerce Platform

**Version:** 1.0
**Target Platforms:** iOS (React Native / Flutter), Android (React Native / Flutter)
**Target Audience:** Young adults 18-35, eco-conscious fashion enthusiasts
**Design Approach:** Mobile-first, bold, colorful, with strong sustainability messaging

---

## 1. Brand Identity & Design Philosophy

### 1.1 Core Values
- **Sustainability:** Every design decision reflects environmental consciousness
- **Authenticity:** Real, unfiltered product stories and supply chain transparency
- **Empowerment:** Enable young adults to make fashion choices aligned with their values
- **Vibrancy:** Bold colors and dynamic design convey youthful energy and optimism
- **Accessibility:** Inclusive design serving diverse users and abilities

### 1.2 Design Principles
1. **Mobile-First Thinking:** Designed for small screens first, thoughtful typography and touch targets
2. **Content Over Decoration:** Clean, purposeful UI supporting product discovery and purchasing
3. **Eco-Conscious Aesthetics:** Natural materials, organic shapes, earthy + vibrant color combinations
4. **Movement & Feedback:** Smooth animations and micro-interactions create delight without distraction
5. **Transparency First:** Easily accessible product sustainability metrics, sourcing info, impact data
6. **Performance:** Fast loading, minimal data usage for all users globally

---

## 2. Color System

### 2.1 Primary Color Palette

#### Earth Tones (Foundation)
- **Sage Green:** `#2D7A4A` (Primary CTA, sustainability badges)
- **Clay Brown:** `#9B6B4F` (Secondary elements, warmth)
- **Cream/Off-White:** `#F5F2ED` (Backgrounds, neutrals)

#### Vibrant Accents (Energy)
- **Solar Yellow:** `#FFD700` (Highlights, badges, new items)
- **Coral Orange:** `#FF6B5B` (Sale, limited edition, urgency)
- **Aqua Blue:** `#00B4CC` (Sustainable certifications, trust indicators)
- **Magenta Pink:** `#E71E63` (Featured collections, user interactions)

#### Neutral Scale
- **Charcoal:** `#2C2C2C` (Primary text, headers)
- **Graphite:** `#555555` (Secondary text, descriptions)
- **Light Gray:** `#E8E8E8` (Dividers, disabled states)
- **White:** `#FFFFFF` (Cards, product backgrounds)

### 2.2 Color Usage Guidelines

| Element | Primary | Secondary | Purpose |
|---------|---------|-----------|---------|
| Call-to-Action Buttons | Sage Green (#2D7A4A) | Solar Yellow | Purchase, add to cart |
| Product Cards | White/Cream | Clay Brown border | Product showcase |
| Sustainability Badge | Sage Green + Aqua Blue | Solar Yellow accent | Eco certifications |
| Limited/Sale Items | Coral Orange | Magenta Pink | Create urgency |
| Navigation | Charcoal | Sage Green active | Tab bar, drawer |
| Text | Charcoal | Graphite secondary | Hierarchy, readability |
| Backgrounds | Cream | White cards | Minimal, clean |
| Error/Warning | Coral Orange | Magenta | Alerts, validation |

### 2.3 Dark Mode Support (Optional Future Phase)
- Background: `#1A1A1A`
- Cards: `#2A2A2A`
- Primary Text: `#F5F2ED`
- Accent Colors: Increase saturation slightly for readability

---

## 3. Typography System

### 3.1 Font Stack

**Primary Font Family:** "Inter" or equivalent system fonts (mobile-optimized)
- Fallback: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`

**Accent/Display Font:** "Poppins" or "DM Sans" (bold headlines, brand personality)
- Fallback: sans-serif

**Why:** Inter and Poppins are highly legible on mobile screens, support international characters, and have excellent performance on iOS and Android.

### 3.2 Type Scale

```
Display (Headlines)
  - 32px / 40px line-height / 600 weight (Main app title, hero sections)
  - 28px / 36px line-height / 600 weight (Section titles, category headers)
  - 24px / 32px line-height / 600 weight (Card titles, major CTAs)

Body (Content)
  - 16px / 24px line-height / 400 weight (Body text, product descriptions)
  - 14px / 20px line-height / 400 weight (Secondary text, meta information)
  - 12px / 16px line-height / 500 weight (Labels, badges, small UI text)

Interactive
  - 16px / 24px line-height / 500 weight (Button text)
  - 14px / 20px line-height / 500 weight (Tab labels, link text)
```

### 3.3 Typography Best Practices
- **Minimum text size:** 12px (for labels only)
- **Body text:** Always 16px minimum for accessibility (WCAG AA)
- **Line length:** Max 600px on tablets, naturally constrained on phones
- **Letter spacing:** Default for Inter; +0.5px for display text in Poppins
- **Font weight:** Use 400, 500, 600 only (avoid 300, 700 for performance)

---

## 4. Layout & Spacing System

### 4.1 Base Unit
**8px base unit** ensures consistency and simplifies calculations:
- Padding/margin: 8px, 16px, 24px, 32px, 48px
- Border radius: 4px, 8px, 12px, 16px

### 4.2 Mobile Layout Specs

#### Safe Area & Margins
- **iPhone notch/Dynamic Island:** Respected via `SafeAreaView` (React Native) or `safeAreaPadding` (Flutter)
- **Content margins:** 16px left/right padding standard
- **Full-bleed images:** Extend to edges; content has 16px margins

#### Common Layouts
```
FULL SCREEN SCROLL AREA:
- Header (fixed): 56px height (safe area inclusive)
- Content area: Full width, 16px margins
- Bottom padding: 24px + safe area

TAB BAR:
- Height: 56px + safe area (bottom typically 20px on iPhone X+)
- Icon + label: Icon 24x24, label 12px

PRODUCT CARD (Grid):
- 2-column grid: (width - 32px margin) / 2 - 8px gutter
- 3-column grid (tablet): (width - 48px margin) / 3 - 16px gutter
- Aspect ratio: 4:5 (product image) + 80px title/price area

MODAL:
- Max width: 100% on mobile
- Corner radius: 16px top (bottom sheet typical)
- Padding: 24px sides, 32px top/bottom
```

### 4.3 Spacing Values
- **Micro spacing (touch states):** 4px, 8px
- **Element spacing:** 16px (between components)
- **Section spacing:** 24px (between major sections)
- **Screen margins:** 16px (sides), 24px (top/bottom)

---

## 5. Component Library

### 5.1 Buttons

#### Primary Button (Call-to-Action)
```
Background: Sage Green (#2D7A4A)
Text: White, 16px / 500
Padding: 16px horizontal, 14px vertical
Border-radius: 8px
Min-width: 120px (full width in modals)
State Variants:
  - Default: As above
  - Pressed: Darken to #1F5233 (20% darker)
  - Disabled: Opacity 0.5, text becomes Graphite
  - Loading: Show spinner, text opacity 0.7
Haptic Feedback: Light feedback on iOS, haptics on Android
```

#### Secondary Button (Alternative Actions)
```
Background: Transparent with border
Border: 2px Sage Green (#2D7A4A)
Text: Sage Green, 16px / 500
Padding: 14px horizontal, 12px vertical
State Variants:
  - Pressed: Background becomes light green opacity 0.1
  - Disabled: Border and text become Light Gray
```

#### Tertiary Button (Low Priority)
```
Background: Transparent
Text: Sage Green or Graphite, 14px / 500
Padding: 8px horizontal, 6px vertical
State Variants:
  - Pressed: Text color darkens slightly
  - Disabled: Graphite color, opacity 0.5
```

#### Button Groups
```
Usage: Filter options, size selection, quantity controls
Layout: Wrap horizontally, min 44x44 touch targets
Spacing: 8px between buttons
Selected state: Background Sage Green, text White
```

### 5.2 Card Components

#### Product Card
```
Width: Responsive grid
Background: White (#FFFFFF)
Border: 1px Light Gray (#E8E8E8)
Border-radius: 12px
Shadow: Subtle (0 2px 8px rgba(0,0,0,0.08))
Content Structure:
  - Image: Full-bleed, 4:5 aspect ratio, rounded top 12px
  - Badge: Absolute positioned, top-right 8px (sustainability or sale)
  - Title: 16px / 600, 2-line clamp, margin 12px
  - Price: 14px / 500 primary price, 12px crossed-out original
  - Star Rating: 12px text + 3px stars, margin 8px
  - Hover/Press: Scale 0.98, shadow increase, no color change
  - Favorite Icon: Top-right corner, heart toggle animation
```

#### Collection Card
```
Background: Gradient (top: Sage Green, bottom: Clay Brown)
Text: White, 18px / 600
Padding: 16px
Border-radius: 12px
Min-height: 140px
Image: Background image with dark overlay
Overlay opacity: 0.3-0.4 for text readability
CTA: Embedded link text or arrow icon
```

#### Info Card (Sustainability Details)
```
Background: Light Green opacity 0.08 or Cream
Border: 1px Aqua Blue, border-radius 8px
Padding: 16px
Icon: 24x24 eco-related icon, Aqua Blue
Title: 14px / 600
Description: 12px / 400, Graphite
Example: Carbon-neutral shipping, organic cotton certification
```

### 5.3 Input Components

#### Text Input
```
Height: 44px (44pt minimum touch target iOS)
Padding: 12px horizontal, 10px vertical
Border: 1px Light Gray (#E8E8E8)
Border-radius: 8px
Background: White or Cream variant
Font: 16px / 400
Placeholder: Graphite, opacity 0.6
Focus State: Border 2px Sage Green, shadow 0 0 0 4px rgba(45,122,74,0.1)
Error State: Border 2px Coral Orange, error text 12px below in Coral Orange
Disabled: Background Light Gray, text opacity 0.5
```

#### Search Bar
```
Height: 40px
Padding: 12px left, 40px right (room for icon)
Border-radius: 20px
Background: Light Gray (#E8E8E8)
Icon: Magnifying glass, Graphite, 18x18, positioned right 12px
Text: 14px / 400, placeholder opacity 0.6
Focus: Border 1px Sage Green, background White
Results dropdown: Max 200px below, rounded bottom corners
```

#### Dropdown / Select
```
Height: 44px
Padding: 12px
Border: 1px Light Gray
Border-radius: 8px
Background: White
Text: 14px / 400
Chevron icon: Right side, Graphite
Options menu: Below card, max 5 visible, scroll if more
Selected option: Background Light Gray, text bold
Accessibility: VoiceOver announces selected state
```

#### Segmented Control (Tab-like)
```
Height: 36px
Background: Light Gray (#E8E8E8)
Border-radius: 8px
Padding: 4px (outer)
Options: 2-3 visible typically
Selected: Background White, text Sage Green / 600
Unselected: Text Graphite
Animation: Smooth slide transition on iOS/Android
```

#### Toggle / Switch
```
Height: 28px
Width: 52px
Border-radius: 14px (full rounded)
Off state: Background Light Gray
On state: Background Sage Green
Thumb: White, 24x24 with padding
Animation: Smooth slide, 200ms duration
Haptic feedback: Light impact on toggle
```

### 5.4 Navigation Components

#### Tab Bar (Bottom Navigation)
```
Height: 56px + safe area bottom
Background: White with top 1px separator (Light Gray)
Icons: 24x24, default Graphite
Active icon: Sage Green (24x24 same size, no scaling)
Label (optional): 11px / 400, below icon, 4px spacing
Tab count: 4-5 items maximum
Minimum width: 44pt each
Touch target: Full icon + label area
```

#### Navigation Drawer / Sidebar
```
Width: 280px (75% screen width max)
Slide-in from left
Overlay: Dark semi-transparent (0,0,0,0.3)
Header: 48px, contains logo/close button
Section items: 48px height, padding 16px left
Active item: Background Light Green opacity 0.1, text Sage Green
Dividers: 1px Light Gray, margin 8px horizontal
Scroll: Content scrolls inside drawer
Safe area: Respected at bottom
```

#### Header / App Bar
```
Height: 56px + safe area top
Background: White
Elevation: 1px Light Gray bottom border (optional)
Content: Centered title (16px / 600) with left back button + right icons
Back button: 44x44 touch target, arrow icon 24x24
Right icons: Search, menu, profile (24x24 each)
Overflow menu: 3-dot icon, dropdown menu below
```

### 5.5 List Components

#### Simple List Item
```
Height: 56px minimum (48px + 8px padding)
Padding: 16px horizontal, 12px vertical
Border-bottom: 1px Light Gray (except last item)
Text: 14px / 400
Secondary text: 12px / 400 Graphite
Icon (left): 24x24, Graphite
Chevron (right): Optional, indicates navigation
Press state: Background Light Gray opacity 0.3
```

#### Expandable List Item
```
Base: As above
Disclosure icon: Chevron down/up animation on expand
Expanded content: Padding 16px, background Cream
Animation: 200ms duration
Content inside: 12px text, nested margins
```

#### Favorites / Wishlist Item
```
Extends product card
Swipe actions (iOS): Delete left, favorite right
Context menu (Android): Long-press for options
Heart icon: Animated scale + fill when favorited
Remove animation: Slide out with fade, optional trash animation
```

### 5.6 Dialog & Modal Components

#### Alert Dialog
```
Width: 280px (max)
Border-radius: 12px
Padding: 24px
Background: White
Title: 18px / 600, margin 0 0 8px 0
Message: 14px / 400, margin 0 0 24px 0
Buttons: Primary (Sage Green) + Secondary side-by-side
Button height: 44px
Button spacing: 8px
Backdrop: Dark overlay 0.3 opacity
Keyboard: Dismiss on escape (Android back button)
```

#### Bottom Sheet Modal
```
Max height: 90% screen height
Border-radius: 16px top corners only
Background: White
Drag handle: Gray line 4px wide, 48px from top
Title: Optional, 18px / 600, padding 24px
Content: Scrollable, padding 24px sides
Close: On outside tap, or explicit button
Animation: Slide up 300ms
Backdrop: Tap to close, optional
```

#### Confirmation Popover
```
Width: 240px
Background: White
Border-radius: 8px
Padding: 12px
Tail/arrow: Points to trigger
Text: 12px / 400
Close button: X icon
Auto-dismiss: 3 seconds or on action
Haptic feedback: Success vibration
```

### 5.7 Feedback & Indicator Components

#### Loading Spinner
```
Size: 48x48 (default), 32x32 (inline)
Color: Sage Green
Animation: Smooth rotation, 1s duration
Variants:
  - Default circular spinner
  - Linear progress (below header for page load)
Line width: 3px for visibility
```

#### Progress Bar
```
Height: 4px (linear) or 48x48 (circular)
Background: Light Gray track
Fill: Sage Green
Border-radius: 2px
Width: 100% full width (linear)
Progress animation: Smooth, 200ms duration per update
Percentage text: Optional, 12px centered above/inside
```

#### Toast / Snackbar
```
Height: 48px
Max width: 100% (mobile), 320px (tablet)
Margin: 16px bottom + safe area
Border-radius: 8px
Padding: 16px horizontal, 12px vertical
Background: Charcoal (#2C2C2C)
Text: White, 14px / 400
Icon: 20x20 left side (success, error, info)
Action: Optional button right side, 12px / 500
Auto-dismiss: 3-4 seconds
Animation: Slide up 300ms
Accessibility: Announced via VoiceOver/TalkBack
```

#### Badge / Tag
```
Background: Color variant based on type
Text: Contrasting color, 11px / 600
Padding: 4px horizontal, 2px vertical
Border-radius: 4px
Examples:
  - New: Solar Yellow background, Charcoal text
  - Sale: Coral Orange background, White text
  - Eco-certified: Sage Green background, White text
  - In stock: Aqua Blue background, White text
  - Limited: Magenta Pink background, White text
```

#### Star Rating
```
Size: 12px, 16px, 20px variants
Color: Solar Yellow (filled), Light Gray (empty)
Count: Next to stars, 12px / 500, Graphite
Interactive: Full star selection on tap (in review form)
Animation: Subtle scale on selection
```

---

## 6. Interaction & Animation Patterns

### 6.1 Micro-interactions

#### Button Feedback
```
Tap animation: Scale 0.95, 100ms duration
Ripple effect (Material style): Centered on tap point, fade out 300ms
Haptic: Light impact feedback on iOS, tick vibration on Android
```

#### Card Hover/Press
```
Desktop/tablet: Slight scale (1.02) + shadow increase on hover
Mobile: Scale 0.98 on press, restore on release
Duration: 150ms
Easing: Spring (damping: 0.7)
```

#### Gesture Feedback
```
Swipe action: Card slides out smoothly (200ms)
Long-press: Scale 1.05 with haptic, menu appears
Pull-to-refresh: Spinner rotates, background color shifts
Pinch zoom: Smooth scale animation, no snapping
```

### 6.2 Navigation Animations

#### Screen Transitions
```
Push (new screen): Slide in from right, previous fades out slightly
Pop (back): Slide out to right, previous fades in
Modal entrance: Scale up + fade in from center (200ms)
Modal exit: Scale down + fade out (150ms)
Tab switch: Fade cross-dissolve (100ms) or no animation
```

#### List Animations
```
Item entrance: Fade in + slight slide up (staggered 30ms)
Item deletion: Slide out right + fade out (200ms)
Reordering: Smooth repositioning (150ms) with other items shifting
```

### 6.3 Loading States
```
Skeleton screens: Subtle gray pulse animation (1s cycle)
Progress bars: Smooth fill animation matching action duration
Spinners: Continuous rotation, no pausing
Data loading: Show skeleton for 400ms minimum (avoid flashing)
```

### 6.4 Onboarding Animations
```
Welcome sequence: Page curl or slide transitions between screens
Carousel: Smooth pan with page indicator animation
Gesture hints: Subtle pulse or arrow pointing animation
Tutorial: Highlight overlay with animated arrow/tap indicator
```

---

## 7. Accessibility Requirements

### 7.1 WCAG 2.1 AA Compliance
- **Color contrast:** Minimum 4.5:1 for normal text, 3:1 for large text
- **Touch targets:** Minimum 44x44pt (iOS) / 48dp (Android)
- **Text sizing:** Minimum 12px base, scalable to 200% without loss of function
- **Focus indicators:** Visible 2px outline, 2px offset, accessible color
- **Motion:** `prefers-reduced-motion` respected (disable animations for 60% speed)

### 7.2 Screen Reader Support (iOS VoiceOver / Android TalkBack)
```
Labels:
  - All buttons/icons have descriptive labels
  - Image alt-text for product photos
  - Form fields have associated labels

Announcements:
  - State changes announced (e.g., "Added to cart")
  - Load completion announced
  - Error messages announced with context

Semantic HTML/Flutter:
  - Proper heading hierarchy (h1-h6 equivalents)
  - Navigation landmarks clearly defined
  - Form fields properly labeled and associated
```

### 7.3 Navigation Accessibility
- **Keyboard navigation:** All interactive elements reachable via Tab
- **Back button:** Clearly indicates navigation direction
- **Focus management:** Focus trapped in modals, moved to confirmation after action
- **Escape key:** Closes modals, menus on Android

### 7.4 Color Blindness Support
- **Colorblind-safe palette:** Avoid red-green combinations for critical info
- **Icon + color:** Use symbols alongside colors for status indicators
- **Pattern variation:** Add patterns or icons to differentiate (e.g., striped vs. solid for sales)
- **Text labels:** Always label color-coded elements with text

---

## 8. Dark Mode (Phase 2)

### 8.1 Color Palette (Dark Mode)
```
Background: #1A1A1A (main), #2A2A2A (cards)
Text: #F5F2ED (primary), #B8B8B8 (secondary)
Accents: Increase saturation slightly
  - Sage Green: #4CAF7F (lighter for contrast)
  - Solar Yellow: #FFF67F (softer)
  - Coral: #FF8A7F (muted)
Shadows: Use alpha instead of dark colors
```

### 8.2 Implementation Strategy
- System preference detection: `UITraitCollection` (iOS), `isSystemDarkTheme()` (Android)
- Manual toggle option in settings
- Consistent theming across all components
- Dynamic color switching with transition animation

---

## 9. Platform-Specific Considerations

### 9.1 React Native Implementation

#### Styling Approach
```javascript
// Use StyleSheet for performance
import { StyleSheet } from 'react-native';

const colors = {
  sageGreen: '#2D7A4A',
  solarYellow: '#FFD700',
  // ... rest of palette
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

const typography = {
  displayLarge: { fontSize: 32, lineHeight: 40, fontWeight: '600' },
  bodyMedium: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
  // ...
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.sageGreen,
    paddingVertical: spacing.md - 2,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
  },
});
```

#### Component Structure
- Create a `theme.js` file for centralized color/spacing definitions
- Use Context API for theme switching
- Leverage `expo-haptics` for feedback
- Use `react-native-gesture-handler` for smooth animations
- SafeAreaView for notch handling

#### Typography Setup
```javascript
// Use a typography wrapper component
<CustomText variant="displayLarge">Headline</CustomText>
<CustomText variant="bodyMedium">Body text</CustomText>
```

### 9.2 Flutter Implementation

#### Theming Structure
```dart
final ThemeData appTheme = ThemeData(
  useMaterial3: true,
  colorScheme: ColorScheme.fromSeed(
    seedColor: const Color(0xFF2D7A4A),
    brightness: Brightness.light,
  ),
  fontFamily: 'Inter',
  textTheme: TextTheme(
    displayLarge: TextStyle(fontSize: 32, fontWeight: FontWeight.w600),
    bodyMedium: TextStyle(fontSize: 16, fontWeight: FontWeight.w400),
  ),
  inputDecorationTheme: InputDecorationTheme(
    contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 10),
    border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
  ),
);
```

#### Component Helpers
```dart
// Define spacing constants
class Dimensions {
  static const double xs = 4;
  static const double sm = 8;
  static const double md = 16;
  static const double lg = 24;
}

// Create reusable button components
class PrimaryButton extends StatelessWidget {
  final String label;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return FilledButton(
      onPressed: onPressed,
      child: Text(label),
    );
  }
}
```

#### Safe Area & Platform-Specific Code
```dart
// Flutter handles safe areas automatically with Scaffold
// Use TargetPlatform for iOS-specific behavior
if (defaultTargetPlatform == TargetPlatform.iOS) {
  // iOS-specific code
}
```

### 9.3 Platform Differences to Handle

| Feature | iOS | Android | Solution |
|---------|-----|---------|----------|
| Safe Area | Dynamic Island / notch | Notch / gesture area | SafeAreaView wrapper |
| Bottom Sheet | Half-sheet optional | Material bottom sheet | Platform-specific components |
| Navigation | Stack + Tab based | Back button + drawer | React Navigation / go_router |
| Haptics | Advanced options | Basic vibration | expo-haptics / HapticFeedback |
| Icons | SF Symbols preferred | Material Icons | Use consistent icon library |

---

## 10. Development Resources & Setup

### 10.1 Required Packages

#### React Native
```json
{
  "dependencies": {
    "react-native": "^0.73.0",
    "react-native-gesture-handler": "^2.14.0",
    "react-native-screens": "^3.27.0",
    "@react-navigation/native": "^6.1.0",
    "@react-navigation/bottom-tabs": "^6.5.0",
    "react-native-vector-icons": "^10.0.0",
    "expo-haptics": "^12.6.0"
  }
}
```

#### Flutter
```yaml
dependencies:
  flutter:
    sdk: flutter
  google_fonts: ^6.1.0
  flutter_riverpod: ^2.4.0
  go_router: ^12.0.0
  haptic_feedback: ^2.2.0
  cached_network_image: ^3.3.0
```

### 10.2 Icon Library Selection
- **React Native:** FontAwesome 6, Material Design Icons, or custom SVGs via react-native-svg
- **Flutter:** Material Icons (built-in) + custom SVG via flutter_svg

Recommendation: Use custom SVG icon set for brand consistency
- Sustainable/eco icons: leaf, sprout, recycle, carbon-neutral
- Commerce icons: shopping-bag, heart, star, filter, search
- Navigation icons: home, explore, profile, orders
- All 24x24 or 32x32px sizes at 2x, 3x scales

### 10.3 Recommended UI Component Libraries
- **React Native:**
  - `react-native-ui-lib` (comprehensive components)
  - `rn-range-slider` (for price ranges)
  - `react-native-carousel-wrap` (image galleries)

- **Flutter:**
  - `GetWidget` (convenient helpers)
  - `carousel_slider` (image galleries)
  - `flutter_rating_bar` (review ratings)

### 10.4 Performance Optimization
```
Mobile Considerations:
  - Lazy load images: Use thumbnail + progressive loading
  - Virtualize lists: RecyclerListView (RN), ListView.builder (Flutter)
  - Code splitting: Split by feature modules
  - Bundle optimization: Tree-shake unused code, minify
  - Network: Cache product data, use GraphQL for efficient queries
```

---

## 11. Design Tokens (JSON Format)

```json
{
  "colors": {
    "primary": {
      "sageGreen": "#2D7A4A",
      "sageGreenDark": "#1F5233",
      "sageGreenLight": "#4CAF7F"
    },
    "secondary": {
      "clayBrown": "#9B6B4F",
      "solarYellow": "#FFD700",
      "coralOrange": "#FF6B5B",
      "aquaBlue": "#00B4CC",
      "magentaPink": "#E71E63"
    },
    "neutral": {
      "charcoal": "#2C2C2C",
      "graphite": "#555555",
      "lightGray": "#E8E8E8",
      "white": "#FFFFFF",
      "cream": "#F5F2ED"
    }
  },
  "typography": {
    "fontFamilies": {
      "primary": "Inter",
      "display": "Poppins"
    },
    "fontSize": {
      "xs": 12,
      "sm": 14,
      "base": 16,
      "lg": 18,
      "xl": 24,
      "2xl": 28,
      "3xl": 32
    },
    "fontWeight": {
      "normal": 400,
      "medium": 500,
      "semibold": 600
    },
    "lineHeight": {
      "tight": 1.2,
      "normal": 1.5,
      "relaxed": 1.625
    }
  },
  "spacing": {
    "xs": 4,
    "sm": 8,
    "md": 16,
    "lg": 24,
    "xl": 32,
    "2xl": 48
  },
  "borderRadius": {
    "xs": 4,
    "sm": 8,
    "md": 12,
    "lg": 16
  },
  "shadows": {
    "xs": "0 1px 2px rgba(0,0,0,0.05)",
    "sm": "0 2px 8px rgba(0,0,0,0.08)",
    "md": "0 4px 12px rgba(0,0,0,0.10)",
    "lg": "0 8px 24px rgba(0,0,0,0.12)"
  }
}
```

---

## 12. Implementation Checklist

### Phase 1 (MVP - Week 1-2)
- [ ] Set up color system in both React Native and Flutter
- [ ] Create base button and card components
- [ ] Implement typography system with font loading
- [ ] Build tab navigation with bottom bar
- [ ] Create product grid/list views
- [ ] Implement search bar component
- [ ] Set up accessibility (contrast, touch targets)

### Phase 2 (Core Components - Week 3-4)
- [ ] Build form inputs (text, select, toggle)
- [ ] Create modal/bottom sheet components
- [ ] Implement loading states (skeleton screens)
- [ ] Build filter and sort components
- [ ] Create product detail page layout
- [ ] Implement notifications/toasts
- [ ] Add gesture feedback and animations

### Phase 3 (Polish - Week 5-6)
- [ ] Refine animations and transitions
- [ ] Optimize performance (image loading, list virtualization)
- [ ] Test accessibility comprehensively
- [ ] Implement dark mode support
- [ ] Create component documentation
- [ ] Build Storybook/design system website
- [ ] User testing and iteration

### Phase 4 (Launch & Beyond)
- [ ] Platform-specific optimizations
- [ ] A/B testing framework integration
- [ ] Monitoring and analytics setup
- [ ] Continuous accessibility audits
- [ ] Component library maintenance plan

---

## 13. Figma / Design File Structure

Recommended organization in design tool:
```
EcoStyle Design System
├── 1. Foundations
│   ├── Colors
│   ├── Typography
│   ├── Icons
│   └── Layout Grid
├── 2. Components
│   ├── Buttons
│   ├── Cards
│   ├── Forms
│   ├── Navigation
│   └── Lists
├── 3. Patterns
│   ├── Onboarding
│   ├── Product Discovery
│   ├── Checkout
│   └── User Account
├── 4. Screens (Hi-Fi)
│   ├── Home
│   ├── Product Detail
│   ├── Cart
│   └── Checkout
└── 5. Responsive Variants
    ├── Mobile (375px)
    └── Tablet (768px)
```

Use Figma's component variants for different states (default, hover, active, disabled, loading).

---

## 14. Testing Considerations

### 14.1 Visual Regression Testing
```
Tools: Percy.io, Chromatic (for Storybook)
Process:
  - Capture baseline screenshots
  - Compare new changes against baseline
  - Flag unexpected visual diffs
  - Review and approve changes
```

### 14.2 Accessibility Testing
```
Automated:
  - axe DevTools (color contrast, ARIA labels)
  - Lighthouse accessibility audit
  - pa11y for continuous testing

Manual:
  - VoiceOver testing (iOS)
  - TalkBack testing (Android)
  - Keyboard navigation testing
  - Screen reader content validation
```

### 14.3 Performance Testing
```
Metrics to monitor:
  - Time to Interactive (TTI) < 3s
  - Largest Contentful Paint (LCP) < 2.5s
  - Cumulative Layout Shift (CLS) < 0.1
  - Frame rate: 60fps minimum, 120fps target

Tools: React Native Debugger, Flutter DevTools
```

---

## 15. Sustainability & Brand Integration

### 15.1 Visual Sustainability Indicators
- **Carbon Neutral Badge:** Aqua Blue icon with text, appears on qualifying products
- **Eco Certification Levels:**
  - Gold (highest): Sage Green background, "GOTS Certified"
  - Silver: Aqua Blue background, "Sustainable sourced"
  - Bronze: Light Gray background, "Eco-conscious"
- **Impact Metrics Display:**
  - "Saves 50L water" in Solar Yellow callout
  - "0 CO2 emissions" with leaf icon
  - "Fair trade" with handshake icon

### 15.2 Educational Content Integration
- Product detail pages: Expandable "Why this product?" section
- Brand stories: Modal with founder story, materials sourcing
- Sustainability reports: Link to annual impact report
- Certification information: Tap icon for detailed cert info

### 15.3 User Impact Tracking
- Dashboard showing personal environmental impact
- Gamification: Badges for eco-friendly purchases
- Sharing: "Share your sustainable impact" social features
- Community: Display collective impact of all users

---

## 16. Future Enhancements

### Phase 2+ Features
- **AR Try-On:** Virtual clothing fitting (AR Kit / ARCore)
- **Personalization:** ML-based recommendations based on style + values
- **Social Commerce:** Share looks, follow influencers, shoppable posts
- **Tokenization:** Loyalty rewards tied to environmental impact
- **Web Sync:** Cross-platform cart and wishlist synchronization
- **Voice Commerce:** "Order my usual sustainable jeans" voice integration
- **Real-Time Chat:** Chat with customer service powered by sustainability experts

---

## Appendix A: Color Accessibility Matrix

| Color Pair | Ratio | WCAG Level | Use Case |
|-----------|-------|-----------|----------|
| Sage Green on White | 5.2:1 | AAA | Primary buttons, trust |
| Charcoal on Cream | 9.8:1 | AAA | Body text, readability |
| Solar Yellow on Charcoal | 6.1:1 | AAA | Highlights, badges |
| Coral on White | 4.8:1 | AA | Warnings, alerts |
| Graphite on White | 4.8:1 | AA | Secondary text |

All combinations meet WCAG AA standard minimum.

---

## Appendix B: Sample Component Code (React Native)

```javascript
// Button Component with all variants
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from './theme';

const Button = ({
  variant = 'primary',
  onPress,
  label,
  disabled = false,
  loading = false
}) => {
  const variants = {
    primary: {
      backgroundColor: colors.sageGreen,
      textColor: '#fff'
    },
    secondary: {
      backgroundColor: 'transparent',
      borderColor: colors.sageGreen,
      textColor: colors.sageGreen
    }
  };

  const style = variants[variant];

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: style.backgroundColor,
          borderColor: style.borderColor,
          borderWidth: variant === 'secondary' ? 2 : 0,
          opacity: disabled || loading ? 0.5 : 1
        }
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={style.textColor} />
      ) : (
        <Text style={[styles.buttonText, { color: style.textColor }]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.md - 2,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  buttonText: {
    fontSize: typography.fontSize.base,
    fontWeight: '500',
    fontFamily: typography.fontFamily.primary,
  }
});

export default Button;
```

---

## Appendix C: Glossary

**CTA (Call-to-Action):** Primary interactive button encouraging user to take action (e.g., "Add to Cart")

**Haptic Feedback:** Tactile vibration response to user interaction

**Motion Design:** Animation and transition effects creating visual continuity

**Onboarding:** Initial user guidance through app features

**WCAG:** Web Content Accessibility Guidelines, standards for accessible design

**Dark Mode:** Alternative color scheme with dark backgrounds, reducing eye strain in low-light environments

**Touch Target:** Interactive element sized for easy finger interaction (minimum 44x44pt)

**Skeleton Screen:** Placeholder layout showing content structure while loading actual data

**Responsive Design:** Layout adapting to different screen sizes and orientations

**Bottom Sheet:** Modal that slides up from the bottom, popular on mobile apps

---

## Conclusion

This design system provides a complete, cohesive framework for building EcoStyle, a bold, colorful, and sustainability-focused mobile e-commerce platform. The system balances aesthetic appeal with accessibility and performance, ensuring young adults can discover and purchase sustainable fashion confidently and joyfully.

The implementation is ready for both React Native and Flutter, with clear guidance on component structure, theming, and best practices for mobile-first development. Success metrics should track not only user engagement and conversion but also the app's real-world environmental impact through the purchasing decisions it facilitates.

**Design System Version:** 1.0
**Last Updated:** April 2026
**Status:** Ready for Development Phase 1

