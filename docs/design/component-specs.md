# HITMIT Component Specifications

Detailed specifications for all UI components in the HITMIT design system.

---

## Table of Contents

1. [Navigation](#navigation)
2. [Hero Section](#hero-section)
3. [Buttons](#buttons)
4. [Cards](#cards)
5. [Form Elements](#form-elements)
6. [Social Media Components](#social-media-components)
7. [Stats Display](#stats-display)
8. [Footer](#footer)

---

## Navigation

### Header Component

**Purpose**: Primary navigation for the landing page and site-wide navigation.

**Variants**:
- `default` - Solid background
- `transparent` - Transparent, for use over hero images
- `scrolled` - Appears after scrolling, with shadow

**Structure**:
```tsx
interface HeaderProps {
  variant?: 'default' | 'transparent' | 'scrolled';
  logo: React.ReactNode;
  navItems: NavItem[];
  ctaButton?: {
    label: string;
    href: string;
  };
}

interface NavItem {
  label: string;
  href: string;
  isActive?: boolean;
}
```

**Specifications**:
| Property | Value |
|----------|-------|
| Height | 72px (desktop) / 64px (mobile) |
| Background (default) | `#ffffff` |
| Background (transparent) | `transparent` |
| Background (scrolled) | `#ffffff` with shadow |
| Shadow (scrolled) | `0 4px 20px rgba(0,0,0,0.08)` |
| Logo max-width | 140px |
| Nav item spacing | 32px |
| Font (nav items) | Plus Jakarta Sans, 500, 14px |
| Transition | All 300ms ease-out |

**Responsive Behavior**:
- Desktop (≥1024px): Full horizontal nav
- Tablet/Mobile (<1024px): Hamburger menu with slide-out drawer

**States**:
- Default: Normal appearance
- Hover (nav item): Color changes to `accent-500`
- Active (nav item): Color `accent-500`, font-weight 600

---

## Hero Section

### Primary Hero

**Purpose**: Main landing page hero with headline, subtext, and CTA.

**Structure**:
```tsx
interface HeroProps {
  headline: {
    main: string;
    accent: string; // Styled differently (italic + accent color)
    suffix?: string;
  };
  subheadline: string;
  ctaPrimary: {
    label: string;
    href: string;
  };
  ctaSecondary?: {
    label: string;
    href: string;
  };
  image: {
    src: string;
    alt: string;
  };
  stats?: StatItem[];
}
```

**Specifications**:
| Property | Value |
|----------|-------|
| Min-height | 100vh |
| Padding (desktop) | 128px 0 |
| Padding (mobile) | 96px 0 |
| Background | Gradient from `#fafafa` to `#ffffff` |
| Max-width (content) | 1280px |

**Typography**:
| Element | Font | Size (desktop) | Size (mobile) | Weight |
|---------|------|----------------|---------------|--------|
| Headline | Bebas Neue | 128px | 64px | 900 |
| Accent word | Bebas Neue (italic) | 128px | 64px | 900 |
| Subheadline | Plus Jakarta Sans | 18px | 16px | 400 |

**Layout**:
- 2-column grid on desktop (text left, image right)
- Single column on mobile (text top, image bottom)
- Image should extend beyond grid for dynamic feel

**Animation**:
- Headline: Fade in + slide up, 600ms, delay 0ms
- Subheadline: Fade in + slide up, 600ms, delay 150ms
- CTA buttons: Fade in + slide up, 600ms, delay 300ms
- Image: Fade in + scale from 0.95, 800ms, delay 400ms

---

## Buttons

### Button Base

**Variants**:
- `primary` - Accent background, white text
- `secondary` - Black background, white text
- `ghost` - Transparent with border
- `link` - Text only with underline animation

**Sizes**:
- `sm` - Height 32px, padding 12px 16px, font 14px
- `md` - Height 44px, padding 14px 24px, font 15px
- `lg` - Height 52px, padding 16px 32px, font 16px
- `xl` - Height 60px, padding 20px 40px, font 18px

**Structure**:
```tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
  isDisabled?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  href?: string; // Renders as link if provided
}
```

**Specifications**:

| Variant | Background | Text | Border | Hover BG | Hover Shadow |
|---------|------------|------|--------|----------|--------------|
| primary | `#f14011` | `#ffffff` | none | `#f45d3a` | accent glow |
| secondary | `#0a0a0a` | `#ffffff` | none | `#1f1f1f` | lg |
| ghost | transparent | `#0a0a0a` | 2px `#0a0a0a` | `#0a0a0a` | none |
| link | transparent | `#0a0a0a` | none | none | none |

**States**:
| State | Changes |
|-------|---------|
| Hover | Background lightens, shadow appears, scale 1.02 |
| Active | Scale 0.98, shadow reduces |
| Disabled | Opacity 0.5, cursor not-allowed |
| Loading | Content replaced with spinner |

**Transitions**:
- All: 200ms ease-out
- Transform: 150ms ease-out

---

## Cards

### Vehicle Card

**Purpose**: Display vehicle listings in grid format.

**Structure**:
```tsx
interface VehicleCardProps {
  id: string;
  image: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: string;
  transmission: 'Automatic' | 'Manual';
  location?: string;
  isFeatured?: boolean;
  isNew?: boolean;
}
```

**Specifications**:
| Property | Value |
|----------|-------|
| Border radius | 16px |
| Background | `#ffffff` |
| Shadow (default) | card token |
| Shadow (hover) | cardHover token |
| Image aspect ratio | 4:3 |
| Content padding | 24px |

**Layout**:
```
┌─────────────────────────┐
│                         │
│     Image (4:3)         │
│                         │
├─────────────────────────┤
│ Make Model              │
│ Year • Mileage • Trans  │
│                         │
│ $XX,XXX           [♡]   │
└─────────────────────────┘
```

**Typography**:
| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Title | Clash Display | 20px | 700 | primary-900 |
| Specs | Plus Jakarta Sans | 14px | 400 | neutral-500 |
| Price | JetBrains Mono | 24px | 700 | accent-500 |

**Hover Animation**:
- Card: translateY(-4px), shadow increases
- Image: scale(1.05), 500ms ease-out
- Duration: 300ms

### Feature Card

**Purpose**: Display platform features/benefits.

**Structure**:
```tsx
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href?: string;
}
```

**Specifications**:
| Property | Value |
|----------|-------|
| Border radius | 16px |
| Background | `#f5f5f5` |
| Border | 1px `#e5e5e5` |
| Border (hover) | 1px `#f14011` |
| Padding | 32px |
| Icon container size | 56px × 56px |
| Icon container bg | accent-500/10 |
| Icon size | 28px |
| Icon color | accent-500 |

**Typography**:
| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Title | Clash Display | 20px | 700 | primary-900 |
| Description | Plus Jakarta Sans | 16px | 400 | neutral-600 |

---

## Form Elements

### Text Input

**Structure**:
```tsx
interface InputProps {
  type?: 'text' | 'email' | 'tel' | 'number';
  placeholder?: string;
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  isDisabled?: boolean;
  isRequired?: boolean;
}
```

**Specifications**:
| Property | sm | md | lg |
|----------|----|----|----|
| Height | 40px | 48px | 56px |
| Padding X | 16px | 20px | 24px |
| Font size | 14px | 15px | 16px |
| Border radius | full (9999px) |

**Colors**:
| State | Background | Border | Text |
|-------|------------|--------|------|
| Default | `#f5f5f5` | transparent | primary-900 |
| Focus | `#ffffff` | 2px `#f14011` | primary-900 |
| Error | `#fee2e2` | 2px `#ef4444` | primary-900 |
| Disabled | `#e5e5e5` | transparent | neutral-400 |

### Search Bar

**Structure**:
```tsx
interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  suggestions?: string[];
  size?: 'md' | 'lg';
}
```

**Specifications**:
| Property | Value |
|----------|-------|
| Background | `#ffffff` |
| Shadow | lg |
| Border radius | full |
| Padding | 8px |
| Input padding-left | 24px |
| Button padding | 16px 32px |

**Layout**:
```
┌─────────────────────────────────────────┐
│  🔍  Search vehicles...    [ Search ]   │
└─────────────────────────────────────────┘
```

### Select / Dropdown

**Structure**:
```tsx
interface SelectProps {
  options: { value: string; label: string }[];
  placeholder?: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}
```

**Specifications**:
- Same sizing as Text Input
- Dropdown max-height: 300px
- Dropdown shadow: xl
- Option padding: 12px 16px
- Option hover bg: neutral-100

---

## Social Media Components

### Social CTA Section

**Purpose**: Encourage users to follow on TikTok/Instagram.

**Structure**:
```tsx
interface SocialCTAProps {
  headline: string;
  description: string;
  tiktokUrl: string;
  instagramUrl: string;
  showFollowerCount?: boolean;
}
```

**Specifications**:
| Property | Value |
|----------|-------|
| Background | primary-900 |
| Text color | white |
| Padding | 80px 0 |
| Border radius (buttons) | full |

### Social Button

**Variants**:
- `tiktok` - Black bg with TikTok icon
- `instagram` - Gradient bg with Instagram icon

**TikTok Button**:
| Property | Value |
|----------|-------|
| Background | `#000000` |
| Hover background | `#1f1f1f` |
| Icon | TikTok logo |
| Padding | 16px 24px |

**Instagram Button**:
| Property | Value |
|----------|-------|
| Background | `linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)` |
| Hover | opacity 0.9 |
| Icon | Instagram logo |
| Padding | 16px 24px |

---

## Stats Display

### Stats Row

**Purpose**: Show key metrics (sales, brands, locations).

**Structure**:
```tsx
interface StatsRowProps {
  stats: {
    value: string;
    label: string;
    suffix?: string; // e.g., "+"
  }[];
}
```

**Specifications**:
| Property | Value |
|----------|-------|
| Layout | Horizontal flex, space-between |
| Divider | 1px `#e5e5e5` between items |
| Padding (item) | 0 32px |

**Typography**:
| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Value | Bebas Neue | 48px | 700 | primary-900 |
| Suffix | Bebas Neue | 48px | 700 | accent-500 |
| Label | Plus Jakarta Sans | 14px | 500 | neutral-500 |

**Animation**:
- Count-up animation on scroll into view
- Duration: 2000ms
- Easing: ease-out

---

## Footer

### Footer Component

**Structure**:
```tsx
interface FooterProps {
  logo: React.ReactNode;
  description: string;
  links: {
    title: string;
    items: { label: string; href: string }[];
  }[];
  socialLinks: {
    platform: 'tiktok' | 'instagram' | 'facebook' | 'twitter';
    href: string;
  }[];
  copyright: string;
}
```

**Specifications**:
| Property | Value |
|----------|-------|
| Background | primary-900 |
| Text color | white |
| Padding | 80px 0 40px |
| Max-width | 1280px |

**Layout**:
```
┌─────────────────────────────────────────────────────┐
│ LOGO            Links       Links       Links       │
│ Description     • Item      • Item      • Item      │
│                 • Item      • Item      • Item      │
│                 • Item      • Item      • Item      │
├─────────────────────────────────────────────────────┤
│ © 2024 HITMIT          [TT] [IG] [FB] [TW]         │
└─────────────────────────────────────────────────────┘
```

**Typography**:
| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Logo | Bebas Neue | 32px | 700 | white |
| Description | Plus Jakarta Sans | 14px | 400 | neutral-400 |
| Link title | Plus Jakarta Sans | 14px | 600 | white |
| Link item | Plus Jakarta Sans | 14px | 400 | neutral-400 |
| Copyright | Plus Jakarta Sans | 14px | 400 | neutral-500 |

**Link Hover**:
- Color transition to accent-500
- Duration: 200ms

---

## Utility Components

### Container

**Purpose**: Consistent max-width wrapper.

```tsx
interface ContainerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: React.ReactNode;
}

// Sizes
const sizes = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  full: '100%',
};
```

### Section

**Purpose**: Consistent section spacing.

```tsx
interface SectionProps {
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  background?: 'white' | 'light' | 'dark' | 'accent';
  children: React.ReactNode;
}

// Padding
const padding = {
  sm: '48px 0',
  md: '64px 0',
  lg: '96px 0',
  xl: '128px 0',
};
```

### Badge

**Purpose**: Labels for vehicle status.

**Variants**:
- `new` - Green bg
- `featured` - Accent bg
- `sold` - Red bg
- `pending` - Yellow bg

```tsx
interface BadgeProps {
  variant: 'new' | 'featured' | 'sold' | 'pending';
  children: string;
}
```

| Variant | Background | Text |
|---------|------------|------|
| new | `#d1fae5` | `#065f46` |
| featured | `#fdd8d0` | `#b72b0b` |
| sold | `#fee2e2` | `#991b1b` |
| pending | `#fef3c7` | `#92400e` |

---

## Animation Specifications

### Page Load Sequence

1. **Header** (0ms): Fade in from top
2. **Hero headline** (100ms): Fade up
3. **Hero accent** (200ms): Fade up
4. **Hero subheadline** (300ms): Fade up
5. **Hero CTAs** (400ms): Fade up
6. **Hero image** (500ms): Fade in + scale
7. **Stats** (700ms): Count up animation

### Scroll Animations

- **Trigger**: Element 20% in viewport
- **Duration**: 600ms
- **Easing**: cubic-bezier(0.25, 0.1, 0.25, 1)
- **Transform**: translateY(30px) → translateY(0)
- **Opacity**: 0 → 1

### Micro-interactions

| Element | Trigger | Animation |
|---------|---------|-----------|
| Button | Hover | Scale 1.02, shadow |
| Card | Hover | translateY(-4px), shadow |
| Link | Hover | Color, underline slide |
| Input | Focus | Border color, subtle scale |
| Image | Hover | Scale 1.05 within container |

---

## Accessibility Checklist

- [ ] All interactive elements have focus styles
- [ ] Color contrast ratios meet WCAG 2.1 AA
- [ ] Form inputs have associated labels
- [ ] Images have descriptive alt text
- [ ] Touch targets minimum 44x44px
- [ ] Reduced motion support via `prefers-reduced-motion`
- [ ] Keyboard navigation support
- [ ] Screen reader announcements for dynamic content
