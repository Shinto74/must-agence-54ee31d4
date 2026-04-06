# Sustainable Fashion E-Commerce Design System

**Product:** Mobile-first e-commerce marketplace for sustainable fashion
**Target Audience:** Young adults aged 18-35
**Platforms:** iOS & Android (React Native / Flutter)
**Design Approach:** Bold, colorful, eco-conscious aesthetic

---

## 1. Design Philosophy

Our design system balances **environmental consciousness** with **vibrant energy** to appeal to young adults passionate about sustainable fashion. The visual identity is:

- **Bold & Energetic:** Vibrant colors and confident typography to stand out
- **Eco-Conscious:** Natural elements, earth tones balanced with accent colors
- **Digital-First:** Mobile-optimized with touch-friendly interactions
- **Accessible:** WCAG 2.1 AA compliant for all users
- **Sustainable:** Minimal motion, efficient data usage, and reduced cognitive load

---

## 2. Color Palette

### Primary Colors
- **Primary Green (Eco):** `#2D8659` - Represents growth, sustainability, trust
- **Primary Green (Light):** `#4CAF7F` - Secondary eco color for UI elements
- **Deep Charcoal:** `#1F2937` - Text, high contrast content

### Accent Colors (Bold & Vibrant)
- **Vibrant Coral:** `#FF6B6B` - Call-to-action, highlights, badges
- **Electric Teal:** `#00D9FF` - Secondary accent, interactive states
- **Warm Amber:** `#FFB84D` - Success states, sustainability badges
- **Soft Plum:** `#B88EDF` - Secondary accent for diversity
- **Natural Tan:** `#E8D5C4` - Neutral warm background

### Neutral Colors
- **White:** `#FFFFFF` - Primary background
- **Soft Gray:** `#F3F4F6` - Secondary background, disabled states
- **Medium Gray:** `#D1D5DB` - Dividers, borders
- **Dark Gray:** `#6B7280` - Secondary text, placeholders

### Semantic Colors
- **Success:** `#10B981` (green)
- **Error:** `#EF4444` (red)
- **Warning:** `#F59E0B` (amber)
- **Info:** `#3B82F6` (blue)

### Color Usage
```
Dark text on light backgrounds:
- Deep Charcoal (#1F2937) for body text
- Medium Gray (#6B7280) for secondary text

Light text on dark backgrounds:
- White (#FFFFFF) for primary text
- Soft Gray (#F3F4F6) for secondary text

CTA Buttons: Vibrant Coral (#FF6B6B)
Success/Verified: Warm Amber (#FFB84D)
Sustainable Badge: Primary Green (#2D8659)
Interactive Focus: Electric Teal (#00D9FF)
```

---

## 3. Typography

### Font Stack

**Primary (Headlines & Bold):**
```
iOS: San Francisco (native)
Android: Roboto
Fallback: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
```

**Secondary (Body & UI):**
```
iOS: San Francisco (native)
Android: Roboto
Fallback: system-ui, -apple-system, sans-serif
```

### Type Scale

| Role | Size | Weight | Line Height | Letter Spacing |
|------|------|--------|-------------|-----------------|
| H1 (Hero) | 32px | 700 (Bold) | 1.2 | -0.5px |
| H2 (Section) | 24px | 700 (Bold) | 1.3 | -0.3px |
| H3 (Subsection) | 18px | 600 (Semi-bold) | 1.4 | 0px |
| H4 (Card Title) | 16px | 600 (Semi-bold) | 1.5 | 0px |
| Body Large | 16px | 400 (Regular) | 1.5 | 0.3px |
| Body Regular | 14px | 400 (Regular) | 1.6 | 0.3px |
| Body Small | 12px | 400 (Regular) | 1.5 | 0.3px |
| Caption | 11px | 400 (Regular) | 1.4 | 0.2px |
| Button | 14px | 600 (Semi-bold) | 1.4 | 0.5px |
| Label | 12px | 600 (Semi-bold) | 1.3 | 0.4px |

### Typography Rules
- **Headlines:** Use bold weights (600-700) for hierarchy
- **Body Text:** Regular weight (400) for readability
- **Interactive Elements:** Semi-bold (600) for clarity
- **Accessibility:** Minimum 14px for body text on mobile
- **Contrast:** Maintain 4.5:1 ratio for normal text, 3:1 for large text

---

## 4. Spacing System

Use an 8px base unit for consistent spacing.

### Spacing Scale
```
xs: 4px (0.5 units)
sm: 8px (1 unit)
md: 16px (2 units)
lg: 24px (3 units)
xl: 32px (4 units)
2xl: 48px (6 units)
3xl: 64px (8 units)
```

### Component Spacing Guidelines
- **Padding:** Inner spacing within components
  - Buttons: 12px vertical × 16px horizontal (sm/md mix)
  - Cards: 16px (md)
  - Input Fields: 12px (sm/md)
  - List Items: 16px (md)

- **Margins:** Spacing between components
  - Section spacing: 24-32px (lg/xl)
  - Card spacing: 16px (md)
  - List item spacing: 8-12px (sm/md)

---

## 5. Component Library

### 5.1 Buttons

**Primary Button**
```
Background: Vibrant Coral (#FF6B6B)
Text: White (#FFFFFF)
Size (default): 48px height × full width
Padding: 12px vertical × 16px horizontal
Border Radius: 12px
Font: 14px, Semi-bold, letter-spacing 0.5px
States:
  Default: #FF6B6B
  Pressed/Active: #E55A5A (10% darker)
  Disabled: #D1D5DB with opacity 0.5
  Focus: Border 2px Electric Teal (#00D9FF)
```

**Secondary Button**
```
Background: Soft Gray (#F3F4F6)
Text: Deep Charcoal (#1F2937)
Border: 1px Medium Gray (#D1D5DB)
Size: 48px height × full width
Border Radius: 12px
States:
  Default: Gray bg, Charcoal text
  Pressed: #E5E7EB background
  Disabled: 0.5 opacity
```

**Tertiary Button (Text-Only)**
```
Background: Transparent
Text: Primary Green (#2D8659)
Size: 40px height (flexible width)
Border Radius: 8px
States:
  Default: Green text
  Pressed: Green bg with 10% opacity
  Disabled: 0.5 opacity
```

**Icon Button**
```
Size: 44px × 44px (min touch target)
Border Radius: 8px
Icon: 24px centered
States:
  Default: Deep Charcoal (#1F2937)
  Pressed: Soft Gray (#F3F4F6) background
  Active/Selected: Electric Teal (#00D9FF)
```

### 5.2 Input Fields

**Text Input**
```
Height: 48px
Padding: 12px (top/bottom) × 14px (left/right)
Border: 1px Medium Gray (#D1D5DB)
Border Radius: 8px
Font: 14px, Regular
Text Color: Deep Charcoal (#1F2937)
Placeholder: Medium Gray (#6B7280) at 0.6 opacity
Background: White (#FFFFFF)
States:
  Focused: Border 2px Electric Teal (#00D9FF), shadow 0 0 0 4px teal at 10% opacity
  Error: Border 1px Error red (#EF4444), error icon in right corner
  Disabled: Background #F3F4F6, text opacity 0.5
  Filled: Border #4CAF7F
```

**Text Area**
```
Min Height: 120px
Padding: 12px
Border: 1px Medium Gray (#D1D5DB)
Border Radius: 8px
Font: 14px, Regular
Character counter at bottom right (optional)
States: Same as text input
```

**Checkbox & Radio**
```
Size: 20px × 20px
Border Radius: 4px (checkbox), 50% (radio)
Border: 2px Medium Gray (#D1D5DB)
Checked State:
  Background: Primary Green (#2D8659)
  Border: Primary Green (#2D8659)
  Icon: White (#FFFFFF), 12px
Focus State: 2px Electric Teal (#00D9FF) outline
Disabled: 0.5 opacity
```

**Toggle Switch**
```
Size: 50px width × 28px height
Border Radius: 14px
Off State: Background #D1D5DB, toggle at left
On State: Background Primary Green (#2D8659), toggle at right
Animation: 250ms ease
Disabled: 0.5 opacity
```

### 5.3 Cards

**Product Card (Primary)**
```
Background: White (#FFFFFF)
Border: 1px Medium Gray (#D1D5DB)
Border Radius: 16px
Padding: 0 (image bleed)
Overflow: Hidden
Shadow: 0 1px 3px rgba(0,0,0,0.1)
States:
  Hover/Pressed: Shadow elevation 0 4px 12px rgba(0,0,0,0.15)
  Selected: Border 2px Primary Green (#2D8659)
```

**Card Structure:**
```
- Image: Full width, aspect ratio 1:1, top border radius 16px
- Content: 12px padding
  - Brand/Category: 11px, Medium Gray (#6B7280), uppercase
  - Title: 16px, Semi-bold, Deep Charcoal (#1F2937)
  - Price: 16px, Bold, Primary Green (#2D8659)
  - Sustainability Badge: 12px, Warm Amber (#FFB84D) bg, Deep Charcoal text
  - Rating: 12px, Medium Gray with star icon
- CTA Button: Primary button, full width within card
```

**Info Card**
```
Background: Natural Tan (#E8D5C4) at 0.3 opacity
Border: 1px Primary Green (#2D8659)
Border Radius: 12px
Padding: 12px 14px
Icon: Primary Green (#2D8659), 20px, left aligned
Text: 14px, Regular, Deep Charcoal (#1F2937)
```

### 5.4 Navigation

**Bottom Tab Navigation**
```
Height: 56px + safe area
Background: White (#FFFFFF)
Border Top: 1px Medium Gray (#D1D5DB)
Shadow: 0 -2px 8px rgba(0,0,0,0.08)
Items: 4-5 icons per row, centered
Icon Size: 24px
Label: 10px, Semi-bold (optional below icon)
Spacing: Equal distribution

States:
  Active: Icon Primary Green (#2D8659), Label Primary Green
  Inactive: Icon Medium Gray (#6B7280), Label same
  Badge: Vibrant Coral (#FF6B6B), 12px, absolute top-right
```

**Top Navigation / Header**
```
Height: 56px (no safe area)
Background: White (#FFFFFF)
Border Bottom: 1px Medium Gray (#D1D5DB)
Content: Left icon/back, center title, right actions
Title Font: 16px, Semi-bold, Deep Charcoal (#1F2937)
Sticky: Fixed position, z-index 100
```

### 5.5 Modals & Overlays

**Modal**
```
Background: White (#FFFFFF)
Border Radius: 20px top, 0 bottom
Padding: 16px (top with safe area), 16px (sides), 20px (bottom with safe area)
Overlay: Black (#000000) at 0.4 opacity, non-interactive
Animation: Slide up from bottom, 300ms ease
Handle: Gray (#D1D5DB), 4px × 40px, centered top
Header: 18px Semi-bold, close icon top-right
Dismiss: Swipe down, back button, close icon
```

**Alert Dialog**
```
Background: White (#FFFFFF)
Border Radius: 16px
Padding: 20px
Icon: 40px × 40px, colored by status (success, error, warning)
Title: 16px Semi-bold
Message: 14px Regular, Medium Gray (#6B7280)
Buttons: Primary + Secondary stacked, full width
Animation: Scale in from center, 200ms ease
```

### 5.6 Badges & Tags

**Sustainability Badge**
```
Background: Warm Amber (#FFB84D)
Text: Deep Charcoal (#1F2937), 10px Semi-bold
Padding: 4px 8px
Border Radius: 6px
Icon: Leaf or eco symbol, 12px, left of text
Usage: On product cards, listings, filters
```

**Status Badge**
```
Sizes: sm (20px), md (24px), lg (32px)
Styles:
  Success: Background #10B981, text white
  Pending: Background #F59E0B, text white
  New: Background Vibrant Coral (#FF6B6B), text white
  Sale: Background Vibrant Coral, animated pulse
Border Radius: 50% (circular) or 6px (pill)
```

**Tag / Chip**
```
Background: Soft Gray (#F3F4F6)
Text: 12px, Regular, Deep Charcoal (#1F2937)
Padding: 6px 12px
Border Radius: 6px
Icon: Optional 16px left
Close Button: Optional right icon (16px)
States:
  Selected: Background Primary Green (#2D8659), text white
  Interactive: Tappable, 40px min height including padding
```

### 5.7 Separators & Dividers

**Divider**
```
Color: Medium Gray (#D1D5DB)
Height: 1px
Margin: 16px 0 (md spacing)
Full width or inset 16px
```

**Section Header with Divider**
```
Text: 12px, Semi-bold, Medium Gray (#6B7280), uppercase
Padding: 16px 16px
Background: Soft Gray (#F3F4F6)
Divider: 1px Medium Gray, inset 16px
```

---

## 6. Layout & Grid System

### Mobile Grid (Default)
- **Columns:** 2 columns for most layouts
- **Gutter:** 12px (md spacing)
- **Margin:** 16px (md) on left/right
- **Max Width:** Full width up to 480px
- **Safe Area:** Top and bottom insets for notch/home indicator

### Layout Patterns

**Full Width Single Column**
```
Used for: Onboarding, hero sections, full-width CTAs
Padding: 16px horizontal (md), 24px vertical (lg)
Content: Edge-to-edge minus safe margins
```

**Two-Column Grid**
```
Used for: Product listings, category grids
Column width: (Screen width - 16px margin - 16px margin - 12px gutter) / 2
Aspect ratio: 1:1 for product cards
Row spacing: 16px (md)
```

**List Layout**
```
Used for: Orders, favorites, search results
Item height: 80-120px depending on content
Full width minus margin
Border between items: 1px Medium Gray (#D1D5DB)
```

**Hero Section**
```
Height: 300-360px on mobile
Content alignment: Bottom, inset 16px
Gradient overlay: Black at 0-40% opacity (top to bottom)
Image: Cover/aspect-fill
CTA button: Positioned at bottom
```

---

## 7. Interaction & Animation

### Motion Principles
- **Purposeful:** Every animation serves a function (feedback, navigation, hierarchy)
- **Subtle:** 200-400ms duration for most animations
- **Responsive:** Immediate feedback on tap
- **Accessible:** Respects `prefers-reduced-motion` setting

### Animation Timing

**Standard Easing:** `cubic-bezier(0.4, 0, 0.2, 1)` (material standard)

| Animation | Duration | Easing | Usage |
|-----------|----------|--------|-------|
| Tap feedback | 100ms | ease-out | Button press, icon tap |
| State change | 200ms | ease-in-out | Toggle, checkbox state |
| Page transition | 250ms | ease-out | Screen navigation |
| Modal enter | 300ms | ease-out | Bottom sheet, dialog |
| Scroll trigger | 400ms | ease-in-out | Reveal animations |
| Loading spinner | 1000ms | linear | Continuous animation |

### Interaction Patterns

**Button Tap Feedback**
```
1. Scale: 98% (press) → 100% (release)
2. Opacity: Default → 0.8 (press)
3. Shadow: Subtle increase on press
4. Duration: 100ms ease-out
Ripple effect (optional): 400ms, 40px radius, opacity fade
```

**Card Interaction**
```
Tap:
  - Scale 99% on press, 100% on release
  - Shadow elevation increase on press
  - Duration: 100ms ease-out
Swipe (horizontal, on lists):
  - Dismiss action (optional)
  - Swipe > 50% width to dismiss
  - Spring animation on release
```

**Pull-to-Refresh**
```
Trigger: Pull down > 80px
Animation:
  - Rotation spinner: 360° per 1000ms
  - Linear easing (continuous)
  - Fade out on completion
```

**Loading States**
```
Skeleton Screens:
  - Pulse animation: opacity 0.6 → 1.0 → 0.6
  - Duration: 1500ms, infinite
  - Color: #E5E7EB
  - Easing: ease-in-out
Progress Indicators:
  - Indeterminate: Animated progress bar with 2s loop
  - Determinate: Linear animation to target percentage
```

---

## 8. Images & Media

### Image Guidelines

**Product Images**
```
Format: JPEG or WebP (for modern browsers)
Aspect Ratio: 1:1 (preferred), 4:5 (alternate)
Minimum Resolution: 400×400px (mobile), 600×600px (desktop)
Compression: Optimized for mobile, <200KB per image
Lazy Loading: Implement for lists/grids
Placeholder: Soft Gray (#F3F4F6) skeleton or low-res blur
Corner Radius: 16px on cards, 8px in thumbnails
```

**Background Images**
```
Format: JPEG or WebP
Optimization: <300KB, mobile-optimized dimensions
Overlay: Gradient or semi-transparent layer for text contrast
Fallback: Solid color or pattern for unsupported formats
```

**Icons**
```
Format: SVG preferred for scalability
Sizes: 16px, 20px, 24px, 32px (common sizes)
Stroke Weight: 2px for consistency
Color: Inherit text color or specified color
Accessibility: aria-hidden for decorative icons, role="img" for semantic
```

**Video (Optional)**
```
Format: MP4 H.264 or WebM
Aspect Ratio: 16:9 or 9:16 (mobile vertical)
Size: <5MB for hero videos, autoplay muted
Thumbnail: High-contrast static frame
Poster: Image shown before video loads
```

---

## 9. Accessibility

### WCAG 2.1 AA Compliance

**Color Contrast Ratios**
```
Normal text: 4.5:1 minimum
Large text (18px+): 3:1 minimum
Icons & UI components: 3:1 minimum
Non-text contrast: 3:1 minimum
Ensure color is not sole means of conveying information
```

**Touch Targets**
```
Minimum size: 44px × 44px (Apple), 48dp × 48dp (Android)
Padding: 8px between adjacent targets
Icon buttons: 44-48px with full hit area
```

**Text & Readability**
```
Minimum font size: 12px body text
Line height: 1.5× for body, 1.2× for headings
Line length: 40-60 characters optimal (mobile: 30-50)
Letter spacing: Increase by 0.12em for dyslexia-friendly
Font weight: Avoid thin weights (<400)
```

**Motion & Animation**
```
Respect prefers-reduced-motion: Disable animations if set
No autoplay: Videos & animations default to paused
Flashing: Avoid content flashing > 3 times per second
Duration: Allow users to pause/control motion
```

**Semantics & Labels**
```
Form labels: Always associated with inputs
Error messages: Clear, specific, linked to field
Instructions: Provided before form fields
Focus indicators: Always visible, 2px minimum outline
Tab order: Logical, follows visual order
Screen readers: Proper heading hierarchy (H1-H6)
Icons: Alternative text or aria-label
```

**Keyboard Navigation**
```
All functionality: Accessible via keyboard
Tab order: Forward and backward (Shift+Tab)
Escape key: Close modals, cancel actions
Focus visible: Always visible focus indicator
Shortcuts: Documented and avoidable by others
```

---

## 10. Dark Mode Support (Future)

### Dark Mode Color Palette (Optional)
```
Background: #121212 (OLED-safe)
Surface: #1E1E1E
Primary Text: #FFFFFF
Secondary Text: #E0E0E0
Primary Green: #4CAF7F (adjusted)
Accent Coral: #FF8A80 (adjusted for visibility)
Borders: #2C2C2C
```

### Implementation
```
CSS: prefers-color-scheme media query
React Native: useColorScheme hook
Flutter: ThemeData.dark()
Toggle: User preference in settings
Persistence: Save in local storage/user defaults
```

---

## 11. Framework-Specific Implementation

### React Native

**File Structure**
```
/design-system
  /colors
    - index.ts (color constants)
  /typography
    - index.ts (font scale, styles)
  /spacing
    - index.ts (spacing constants)
  /components
    - Button.tsx
    - Card.tsx
    - Input.tsx
    - Modal.tsx
    - ...
  /theme
    - theme.ts (complete theme object)
  /hooks
    - useTheme.ts
    - useResponsive.ts
```

**Color Export Example**
```typescript
export const colors = {
  primary: {
    green: '#2D8659',
    lightGreen: '#4CAF7F',
  },
  accent: {
    coral: '#FF6B6B',
    teal: '#00D9FF',
    amber: '#FFB84D',
    plum: '#B88EDF',
  },
  neutral: {
    charcoal: '#1F2937',
    white: '#FFFFFF',
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      300: '#D1D5DB',
      600: '#6B7280',
    },
  },
  semantic: {
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
  },
};
```

**Button Component Example**
```typescript
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, spacing, typography } from '../design-system/theme';

interface ButtonProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onPress,
  style,
}) => {
  const styles = useButtonStyles(variant, size, disabled);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.container, style]}
      activeOpacity={0.8}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const useButtonStyles = (
  variant: string,
  size: string,
  disabled: boolean,
) => {
  const baseStyles = StyleSheet.create({
    container: {
      height: 48,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      opacity: disabled ? 0.5 : 1,
    },
    text: {
      fontSize: typography.button.size,
      fontWeight: '600',
      letterSpacing: 0.5,
    },
  });

  let variantStyles: any = {};
  if (variant === 'primary') {
    variantStyles = {
      container: {
        backgroundColor: colors.accent.coral,
      },
      text: {
        color: colors.neutral.white,
      },
    };
  } else if (variant === 'secondary') {
    variantStyles = {
      container: {
        backgroundColor: colors.neutral.gray[100],
        borderWidth: 1,
        borderColor: colors.neutral.gray[300],
      },
      text: {
        color: colors.neutral.charcoal,
      },
    };
  }

  return StyleSheet.create({
    container: [baseStyles.container, variantStyles.container],
    text: [baseStyles.text, variantStyles.text],
  });
};
```

### Flutter

**File Structure**
```
/lib
  /design_system
    - colors.dart
    - typography.dart
    - spacing.dart
    - theme.dart
  /components
    - button.dart
    - card.dart
    - input_field.dart
    - modal.dart
    - ...
```

**Theme Configuration Example**
```dart
import 'package:flutter/material.dart';

class AppColors {
  static const Color primaryGreen = Color(0xFF2D8659);
  static const Color primaryGreenLight = Color(0xFF4CAF7F);
  static const Color deepCharcoal = Color(0xFF1F2937);
  static const Color vibrantCoral = Color(0xFFFF6B6B);
  static const Color electricTeal = Color(0xFF00D9FF);
  static const Color warmAmber = Color(0xFFFFB84D);

  static const Color white = Color(0xFFFFFFFF);
  static const Color softGray = Color(0xFFF3F4F6);
  static const Color mediumGray = Color(0xFFD1D5DB);
  static const Color darkGray = Color(0xFF6B7280);
}

class AppTheme {
  static ThemeData lightTheme() {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: AppColors.primaryGreen,
        brightness: Brightness.light,
      ),
      typography: Typography.material2021(),
      textTheme: TextTheme(
        displayLarge: TextStyle(
          fontSize: 32,
          fontWeight: FontWeight.w700,
          letterSpacing: -0.5,
        ),
        bodyMedium: TextStyle(
          fontSize: 14,
          fontWeight: FontWeight.w400,
          letterSpacing: 0.3,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.vibrantCoral,
          foregroundColor: AppColors.white,
          minimumSize: Size(double.infinity, 48),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        contentPadding: EdgeInsets.symmetric(
          horizontal: 14,
          vertical: 12,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(color: AppColors.mediumGray),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(
            color: AppColors.electricTeal,
            width: 2,
          ),
        ),
      ),
    );
  }
}
```

**Button Component Example**
```dart
import 'package:flutter/material.dart';
import 'colors.dart';

class PrimaryButton extends StatelessWidget {
  final String label;
  final VoidCallback onPressed;
  final bool isLoading;

  const PrimaryButton({
    required this.label,
    required this.onPressed,
    this.isLoading = false,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 48,
      child: ElevatedButton(
        onPressed: isLoading ? null : onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.vibrantCoral,
          foregroundColor: AppColors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
        child: isLoading
            ? SizedBox(
                height: 20,
                width: 20,
                child: CircularProgressIndicator(
                  valueColor: AlwaysStoppedAnimation<Color>(
                    AppColors.white,
                  ),
                ),
              )
            : Text(
                label,
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 0.5,
                ),
              ),
      ),
    );
  }
}
```

---

## 12. Component Specifications (Advanced)

### Detailed Component States & Variations

**Form Input - Full Spec**
```
Default State:
  - Border: 1px #D1D5DB
  - Background: #FFFFFF
  - Text: #1F2937, 14px Regular
  - Placeholder: #6B7280, opacity 0.6

Focused State:
  - Border: 2px #00D9FF
  - Shadow: 0 0 0 4px rgba(0, 217, 255, 0.1)
  - Background: #FFFFFF (unchanged)

Error State:
  - Border: 1px #EF4444
  - Icon: Error red #EF4444, 20px, right aligned
  - Error message: 12px, #EF4444, below input
  - Background: rgba(239, 68, 68, 0.05)

Filled/Success State:
  - Border: 1px #10B981
  - Icon: Check mark, #10B981, right aligned

Disabled State:
  - Border: 1px #D1D5DB
  - Background: #F3F4F6
  - Text: opacity 0.5
  - Cursor: not-allowed
```

**Product Card - Full Visual Hierarchy**
```
Layer 1 (Image):
  - Full width, 1:1 aspect ratio
  - Border radius top: 16px
  - Object-fit: cover

Layer 2 (Overlay - Optional):
  - Gradient from transparent to rgba(0,0,0,0.2) (bottom)
  - For sale/new badges

Layer 3 (Badge - Top Right):
  - Position: absolute, 8px from top/right
  - Z-index: 10
  - Background: Warm Amber (#FFB84D)
  - Padding: 4px 8px
  - Border radius: 6px
  - Text: "Sustainable" or "Sale"

Layer 4 (Content Area):
  - Padding: 12px
  - Category: 11px, Medium Gray (#6B7280), all caps, line-height 1.4
  - Brand: 11px, Medium Gray (#6B7280), optional
  - Title: 16px, Semi-bold, Deep Charcoal, 2 line clamp
  - Price: 16px, Bold, Primary Green (#2D8659)
  - Rating: 12px, Medium Gray, star + count (optional)

Layer 5 (Button):
  - Primary button, full width minus padding
  - 48px height, Vibrant Coral (#FF6B6B)
```

---

## 13. Error States & Empty States

### Error Handling

**Form Field Error**
```
Visual:
  - Border turns red #EF4444
  - Error icon appears (right side)
  - Error message in red below field
Message Format:
  - Specific: "Email format invalid"
  - Not: "Error"
  - Actionable: Include suggestion if possible
Animation:
  - Shake animation (100ms): left -2px, right +2px, repeat 3x
```

**API Error Messages**
```
Network Error:
  - Title: "Connection Error"
  - Message: "Unable to connect. Check your internet and try again."
  - Action: "Retry" button

Server Error (5xx):
  - Title: "Something went wrong"
  - Message: "Please try again later"
  - Action: "Retry" or "Go Home"

Not Found (404):
  - Title: "Page not found"
  - Message: "The item you're looking for doesn't exist"
  - Action: "Browse Items"

Unauthorized (401):
  - Title: "Session expired"
  - Message: "Please log in again"
  - Action: "Log in"
```

### Empty States

**Empty Shopping Cart**
```
Icon: Large shopping bag (120px), Light Gray (#D1D5DB)
Title: "Your cart is empty"
Message: "Add items to get started"
CTA: "Continue Shopping" (Primary button)
```

**No Search Results**
```
Icon: Magnifying glass (120px), Light Gray (#D1D5DB)
Title: "No results found"
Message: "Try different keywords or filters"
Suggestions:
  - Related categories or popular items
  - Similar search terms
```

**No Favorites**
```
Icon: Heart outline (120px), Light Gray (#D1D5DB)
Title: "No favorites yet"
Message: "Save items to view later"
CTA: "Explore" (Primary button)
```

---

## 14. Responsive Design & Breakpoints

### Mobile-First Approach (Primary)
```
Base: 360px - 480px (portrait)
- 2-column layouts
- Full-width cards
- Stacked bottom navigation
```

### Tablet (Optional, if responsive web)
```
768px+:
- 3-4 column layouts
- Side navigation or drawer
- Wider content areas
- Increased spacing
```

### Design Considerations
- Start mobile designs at 375px width (iPhone 12/13/14)
- Test at 360px (Android minimum)
- Portrait orientation primary
- Landscape: Alternative layout or rotate lock recommended
- Safe areas: Account for notch, home indicator, status bar

---

## 15. Internationalization (i18n)

### Text Sizing
```
EN typical: "See all products" (16 chars)
DE typical: "Alle Produkte anzeigen" (22 chars, 37% longer)
Design for +30% text expansion
Avoid center alignment for flexibility
Use flexible width containers
```

### RTL Support (Optional)
```
Mirroring: Flip layout for Arabic, Hebrew, Persian
Navigation: Right tab bar for RTL languages
Text alignment: Auto-direction based on language
Icons: Some icons may need mirroring (arrows, etc.)
```

---

## 16. Performance Considerations

### Mobile Optimization
```
Image optimization:
  - Use WebP with JPEG fallback
  - Lazy load images in lists
  - Responsive images (srcset)
  - Compression: Mobile < 200KB, desktop < 400KB

Bundle size:
  - Tree-shake unused components
  - Code split by route (React)
  - Font subsetting (only needed characters)

Animation performance:
  - Use GPU-accelerated properties (transform, opacity)
  - Avoid expensive animations on low-end devices
  - Respect prefers-reduced-motion

Data efficiency:
  - Minimal network requests
  - Local caching for user data
  - Pagination for lists
```

---

## 17. Testing & QA

### Design System Testing

**Visual Regression Testing**
```
Tools: Percy, BackstopJS, or similar
Capture: Each component state variation
Baseline: Create on implementation
Compare: Detect unintended changes
Frequency: Per pull request
```

**Accessibility Testing**
```
Tools: axe DevTools, WAVE, NVDA, VoiceOver
Check: Color contrast, keyboard nav, semantics
Manual testing: Screen reader testing
Automated: Run on CI/CD pipeline
Standards: WCAG 2.1 AA minimum
```

**Component Testing**
```
Unit tests: Props, state changes, callbacks
Integration: Component interactions
Snapshot tests: Visual changes detection
E2E: Full user flows (onboarding, purchase)
```

### Device Testing
```
iOS:
  - iPhone 12/13/14/15 (primary)
  - iPhone SE (small screen)
  - iOS 15+ (target versions)

Android:
  - Pixel 6/7/8 (primary)
  - Samsung Galaxy A series
  - Android 12+ (target versions)

Tablets (optional):
  - iPad (7th gen+)
  - iPad Pro 11"
  - Android tablets (common sizes)
```

---

## 18. Design Tokens (JSON Export)

```json
{
  "colors": {
    "primary": {
      "green": "#2D8659",
      "greenLight": "#4CAF7F"
    },
    "accent": {
      "coral": "#FF6B6B",
      "teal": "#00D9FF",
      "amber": "#FFB84D",
      "plum": "#B88EDF"
    },
    "neutral": {
      "charcoal": "#1F2937",
      "white": "#FFFFFF",
      "gray50": "#F9FAFB",
      "gray100": "#F3F4F6",
      "gray300": "#D1D5DB",
      "gray600": "#6B7280"
    },
    "semantic": {
      "success": "#10B981",
      "error": "#EF4444",
      "warning": "#F59E0B",
      "info": "#3B82F6"
    }
  },
  "spacing": {
    "xs": "4px",
    "sm": "8px",
    "md": "16px",
    "lg": "24px",
    "xl": "32px",
    "2xl": "48px",
    "3xl": "64px"
  },
  "typography": {
    "h1": {
      "fontSize": "32px",
      "fontWeight": 700,
      "lineHeight": 1.2
    },
    "body": {
      "fontSize": "14px",
      "fontWeight": 400,
      "lineHeight": 1.6
    }
  },
  "borderRadius": {
    "sm": "8px",
    "md": "12px",
    "lg": "16px",
    "full": "50%"
  },
  "shadows": {
    "sm": "0 1px 3px rgba(0,0,0,0.1)",
    "md": "0 4px 12px rgba(0,0,0,0.15)",
    "lg": "0 12px 24px rgba(0,0,0,0.2)"
  }
}
```

---

## 19. Documentation & Handoff

### Figma/Design Tool Setup
1. Create "Components" page with all base components
2. Use component variants for states (default, hover, active, disabled)
3. Create "Patterns" page for common layouts
4. Document spacing with measurements
5. Export to design tokens (Figma Tokens plugin)
6. Maintain master file as source of truth

### Developer Handoff
1. Provide design tokens in code-friendly format (JSON, TS)
2. Include responsive behavior specs
3. Document animation timings and easing
4. Provide accessibility requirements
5. Include iOS/Android platform specifics
6. Create component storybook/showcase app

### Maintenance
1. Version the design system (major.minor.patch)
2. Document breaking changes
3. Provide migration guides for updates
4. Regular audits for consistency
5. Gather feedback from teams using it
6. Iterate based on new use cases

---

## 20. Example User Flows

### User Flow 1: Product Discovery
```
Screen 1: Home Tab
  - Hero banner with featured collection
  - Category grid (2 columns)
  - Recent items section
  - Bottom navigation

Screen 2: Category View
  - Header with back button
  - Filter/Sort bar
  - Product grid (2 columns)
  - Pull-to-refresh

Screen 3: Product Detail
  - Image carousel (swipeable)
  - Product info section
  - Sustainability badge prominent
  - Add to cart button (fixed bottom)
  - Reviews section
```

### User Flow 2: Checkout
```
Screen 1: Shopping Cart
  - List of items with remove option
  - Quantity adjustable
  - Subtotal display
  - Promo code input
  - Checkout button (prominent)

Screen 2: Shipping Address
  - Address form (full width inputs)
  - Saved addresses (cards, selectable)
  - Add new address button

Screen 3: Payment
  - Payment method selection
  - Card form (number, exp, CVC)
  - Order summary (sticky)
  - Place order button

Screen 4: Order Confirmation
  - Success message with checkmark
  - Order number
  - Estimated delivery
  - Order tracking link
  - Continue shopping button
```

---

## 21. Sustainability Integration

### Visual Cues for Eco-Consciousness
```
Sustainability Badge:
  - Warm Amber (#FFB84D) background
  - "Sustainable" or "Eco-Friendly" label
  - Leaf icon (20px)
  - Appears on product cards, detail pages

Material Information:
  - Dedicated section on product detail
  - Icons for: Organic, Recycled, Fair Trade, etc.
  - Breakdown of materials used
  - Care instructions for longevity

Impact Metrics:
  - "Water saved" badges
  - "Carbon offset" information
  - "Fair wages" indicators
  - Show cumulative impact per user

Green Section:
  - Featured sustainable products
  - Collections by impact
  - Transparency: Certifications visible
  - Brand stories and ethos
```

### Messaging Guidelines
```
Positive tone:
  - Celebrate eco-choices
  - Educate without guilt
  - Show tangible impact
  - Community-driven language

Examples:
  "By choosing this organic cotton shirt, you're
   saving 700 gallons of water compared to
   conventional cotton."

  "Join 50,000+ people making sustainable choices"

  "This item is 100% recycled polyester"
```

---

## 22. Rollout & Training

### Phase 1: Design System Foundation (Week 1-2)
- Finalize color palette, typography, spacing
- Create base components
- Build Figma library
- Document design principles

### Phase 2: Developer Implementation (Week 3-4)
- Code design tokens
- Implement components (React Native/Flutter)
- Create storybook/showcase app
- Write component documentation

### Phase 3: Integration (Week 5-6)
- Integrate into main app codebase
- Update existing screens
- Test on real devices
- Gather feedback

### Phase 4: Launch & Support (Week 7+)
- Release to production
- Monitor for issues
- Collect team feedback
- Plan iterations

### Team Training
- Design kickoff meeting
- Developer workshop on components
- Bi-weekly design reviews
- Slack channel for questions (#design-system)
- Wiki/documentation portal

---

## 23. Future Enhancements

### Planned Additions
1. **Dark Mode:** Complete dark theme with adjusted colors
2. **Animation Storybook:** Micro-interactions showcase
3. **Accessibility Toolkit:** A11y guidelines per component
4. **Localization:** Support for 5+ languages
5. **Performance Variants:** Lightweight component versions
6. **AR Integration:** Virtual try-on components
7. **Data Visualization:** Charts and graphs system

### Scalability
- Design for enterprise features (admin dashboards, analytics)
- Support for custom themes
- White-label capabilities
- Component library marketplace integration

---

## 24. Design System Governance

### Approval Process
1. **Design Tokens:** Approved by design lead
2. **Components:** Design + Engineering review
3. **Breaking Changes:** Product + Design sign-off
4. **Deprecations:** 2-week notice to teams

### Versioning
```
Major (x.0.0): Breaking changes
  - Component API changes
  - Color/spacing overhauls

Minor (x.y.0): New features
  - New components
  - Variant additions
  - Non-breaking additions

Patch (x.y.z): Fixes
  - Bug fixes
  - Documentation updates
```

### Change Log Template
```
## [1.2.0] - 2026-04-15
### Added
- New Badge component variants
- Dark mode color tokens

### Changed
- Button focus state styling
- Increased input field height to 48px

### Fixed
- Input field shadow on focus
- Modal dismiss animation timing

### Deprecated
- OldButton component (use Button instead)
```

---

## 25. Quick Reference Guide

### Most Used Components
1. Button (Primary, Secondary, Tertiary)
2. Card (Product, Info)
3. Input (Text, TextArea)
4. Navigation (Bottom Tab, Header)
5. Modal (Sheet, Dialog)
6. Badge (Status, Sustainability)
7. Empty States
8. Error States

### Color Quick Pick
```
Primary Action: #FF6B6B (Coral)
Secondary Action: #2D8659 (Green)
Text: #1F2937 (Charcoal)
Success: #10B981 (Green)
Error: #EF4444 (Red)
Background: #FFFFFF (White)
Disabled: #F3F4F6 (Gray)
```

### Spacing Quick Pick
```
Small gap: 8px
Medium gap: 16px
Large gap: 24px
Container padding: 16px
Component padding: 12px
```

### Animation Defaults
```
Standard: 200-300ms cubic-bezier(0.4, 0, 0.2, 1)
Entrance: 300ms ease-out
Exit: 200ms ease-in
Continuous: 1000ms linear
```

---

## Conclusion

This design system provides a solid foundation for building a bold, eco-conscious mobile e-commerce experience. It balances aesthetic appeal with accessibility and performance, ensuring the app resonates with young adults passionate about sustainable fashion.

**Key Takeaways:**
- Mobile-first approach for iOS and Android
- Strong eco-conscious branding through color and imagery
- Accessibility built-in from day one
- Detailed component specifications for both React Native and Flutter
- Clear, actionable guidelines for designers and developers
- Framework for scaling and maintaining the design system

For questions or updates, refer to the design system documentation and maintain active communication between design and engineering teams.

