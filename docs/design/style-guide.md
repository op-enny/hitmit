# HITMIT Design System Style Guide

A comprehensive design system for the HITMIT car marketplace platform.

---

## Brand Identity

### Vision
HITMIT is a modern car marketplace connecting private sellers and businesses with buyers through social media channels (TikTok, Instagram). The brand embodies **speed**, **trust**, and **social connectivity**.

### Personality
- **Bold** - Confident, attention-grabbing presence
- **Dynamic** - Energetic, fast-paced, movement-inspired
- **Trustworthy** - Professional, reliable, transparent
- **Social** - Connected, community-driven, approachable

---

## Color System

### Primary Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `primary-900` | `#0a0a0a` | Primary backgrounds, text |
| `primary-800` | `#141414` | Secondary backgrounds |
| `primary-700` | `#1f1f1f` | Elevated surfaces |
| `primary-500` | `#3d3d3d` | Borders, dividers |

### Accent Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `accent-500` | `#f14011` | CTAs, highlights, brand accent |
| `accent-400` | `#f45d3a` | Hover states |
| `accent-300` | `#f77a63` | Active states |
| `accent-100` | `#fdd8d0` | Light accent backgrounds |

### Neutrals

| Token | Hex | Usage |
|-------|-----|-------|
| `neutral-white` | `#ffffff` | Backgrounds, text on dark |
| `neutral-50` | `#fafafa` | Light backgrounds |
| `neutral-100` | `#f5f5f5` | Cards, sections |
| `neutral-400` | `#a3a3a3` | Secondary text |
| `neutral-900` | `#171717` | Primary text |

### Social Media Brand Colors

```css
--tiktok: #000000;
--tiktok-accent: #ee1d52;
--instagram: #e4405f;
--instagram-gradient: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
```

---

## Typography

### Font Stack

```css
/* Display - Headlines, hero text */
--font-display: 'Bebas Neue', 'Impact', sans-serif;

/* Heading - Section titles, card headers */
--font-heading: 'Clash Display', 'Oswald', sans-serif;

/* Body - Paragraphs, UI text */
--font-body: 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif;

/* Mono - Specs, technical data, prices */
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Type Scale

| Name | Size | Weight | Line Height | Use Case |
|------|------|--------|-------------|----------|
| `display-2xl` | 8rem (128px) | 900 | 1 | Hero headlines |
| `display-xl` | 6rem (96px) | 900 | 1 | Large headlines |
| `display-lg` | 4.5rem (72px) | 700 | 1.1 | Page titles |
| `heading-xl` | 3rem (48px) | 700 | 1.2 | Section headers |
| `heading-lg` | 2.25rem (36px) | 600 | 1.25 | Subsections |
| `heading-md` | 1.5rem (24px) | 600 | 1.3 | Card titles |
| `body-lg` | 1.125rem (18px) | 400 | 1.6 | Lead paragraphs |
| `body-md` | 1rem (16px) | 400 | 1.5 | Body text |
| `body-sm` | 0.875rem (14px) | 400 | 1.5 | Secondary text |
| `caption` | 0.75rem (12px) | 500 | 1.4 | Labels, captions |

### Typography Examples

```jsx
// Hero headline
<h1 className="font-display text-[8rem] font-black leading-none tracking-tight">
  SELL YOUR CAR
</h1>

// Accent word styling (italic + accent color)
<span className="italic text-accent-500">Fast</span>

// Section heading
<h2 className="font-heading text-5xl font-bold">
  How It Works
</h2>

// Body text
<p className="font-body text-lg text-neutral-600 leading-relaxed">
  Submit your vehicle and reach thousands of potential buyers.
</p>
```

---

## Spacing System

Based on 4px grid:

| Token | Value | Pixels |
|-------|-------|--------|
| `space-1` | 0.25rem | 4px |
| `space-2` | 0.5rem | 8px |
| `space-3` | 0.75rem | 12px |
| `space-4` | 1rem | 16px |
| `space-6` | 1.5rem | 24px |
| `space-8` | 2rem | 32px |
| `space-12` | 3rem | 48px |
| `space-16` | 4rem | 64px |
| `space-20` | 5rem | 80px |
| `space-24` | 6rem | 96px |

### Section Spacing

- **Hero sections**: `py-24` to `py-32` (96-128px vertical padding)
- **Content sections**: `py-16` to `py-20` (64-80px)
- **Component padding**: `p-6` to `p-8` (24-32px)
- **Element spacing**: `gap-4` to `gap-6` (16-24px)

---

## Components

### Buttons

#### Primary Button
```jsx
<button className="
  bg-accent-500 text-white
  px-8 py-4 rounded-full
  font-semibold text-lg
  hover:bg-accent-400
  transition-all duration-300
  hover:shadow-accentGlow
">
  Submit Your Car
</button>
```

#### Secondary Button
```jsx
<button className="
  bg-primary-900 text-white
  px-8 py-4 rounded-full
  font-semibold text-lg
  hover:bg-primary-700
  transition-all duration-300
">
  Learn More
</button>
```

#### Ghost Button
```jsx
<button className="
  border-2 border-primary-900
  text-primary-900
  px-8 py-4 rounded-full
  font-semibold text-lg
  hover:bg-primary-900 hover:text-white
  transition-all duration-300
">
  View Details
</button>
```

### Cards

#### Vehicle Card
```jsx
<div className="
  bg-white rounded-2xl
  shadow-card hover:shadow-cardHover
  transition-all duration-300
  overflow-hidden group
">
  <div className="aspect-[4/3] overflow-hidden">
    <img className="
      w-full h-full object-cover
      group-hover:scale-105
      transition-transform duration-500
    " />
  </div>
  <div className="p-6">
    <h3 className="font-heading text-xl font-bold">2024 BMW M4</h3>
    <p className="text-neutral-500 text-sm mt-1">15,000 km • Automatic</p>
    <p className="font-mono text-2xl font-bold text-accent-500 mt-4">$85,000</p>
  </div>
</div>
```

#### Feature Card
```jsx
<div className="
  p-8 rounded-2xl
  bg-neutral-50
  border border-neutral-200
  hover:border-accent-500
  transition-all duration-300
">
  <div className="w-14 h-14 rounded-xl bg-accent-500/10 flex items-center justify-center mb-6">
    <Icon className="w-7 h-7 text-accent-500" />
  </div>
  <h3 className="font-heading text-xl font-bold mb-3">Feature Title</h3>
  <p className="text-neutral-600 leading-relaxed">Feature description goes here.</p>
</div>
```

### Form Elements

#### Text Input
```jsx
<input
  type="text"
  placeholder="Search vehicles..."
  className="
    w-full px-6 py-4
    bg-neutral-100
    border-2 border-transparent
    rounded-full
    text-primary-900
    placeholder:text-neutral-400
    focus:border-accent-500
    focus:outline-none
    transition-all duration-300
  "
/>
```

#### Search Bar with Button
```jsx
<div className="flex bg-white rounded-full shadow-lg p-2">
  <input className="flex-1 px-6 py-3 bg-transparent focus:outline-none" />
  <button className="bg-accent-500 text-white px-8 py-3 rounded-full font-semibold">
    Search
  </button>
</div>
```

---

## Layout Patterns

### Hero Section
```jsx
<section className="min-h-screen relative overflow-hidden">
  {/* Background gradient/pattern */}
  <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 to-white" />

  {/* Content container */}
  <div className="relative max-w-7xl mx-auto px-6 py-32">
    <div className="grid lg:grid-cols-2 gap-16 items-center">
      {/* Text content */}
      <div>
        <h1 className="font-display text-7xl md:text-8xl leading-none">
          BEST <span className="italic text-accent-500">DEALER</span><br />
          FOR YOUR CAR
        </h1>
      </div>

      {/* Visual content */}
      <div className="relative">
        <img src="/car.png" className="w-full" />
      </div>
    </div>
  </div>
</section>
```

### Grid Layouts
```jsx
// 3-column feature grid
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
  {features.map(feature => <FeatureCard key={feature.id} {...feature} />)}
</div>

// 4-column vehicle grid
<div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {vehicles.map(vehicle => <VehicleCard key={vehicle.id} {...vehicle} />)}
</div>
```

---

## Animation Guidelines

### Transition Defaults
```css
/* Standard transition */
transition-all duration-300 ease-out

/* Hover/interaction */
transition-all duration-200 ease-out

/* Page elements */
transition-all duration-500 ease-out
```

### Entrance Animations
```css
/* Fade in up */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Stagger delay pattern */
.stagger-1 { animation-delay: 100ms; }
.stagger-2 { animation-delay: 200ms; }
.stagger-3 { animation-delay: 300ms; }
```

### Hover Effects
- **Buttons**: Scale up slightly, add glow shadow
- **Cards**: Lift with increased shadow, subtle scale
- **Images**: Zoom within container
- **Links**: Color transition, underline animation

---

## Iconography

### Icon Sizes
| Size | Pixels | Use Case |
|------|--------|----------|
| `xs` | 16px | Inline, badges |
| `sm` | 20px | Buttons, inputs |
| `md` | 24px | Navigation, cards |
| `lg` | 32px | Features |
| `xl` | 48px | Hero sections |

### Recommended Icon Sets
- **Lucide React** - Primary icon set
- **Heroicons** - Alternative
- **Simple Icons** - Brand/social icons

---

## Social Media Integration

### TikTok Button
```jsx
<button className="
  bg-black text-white
  px-6 py-3 rounded-full
  flex items-center gap-3
  hover:bg-neutral-800
  transition-all duration-300
">
  <TikTokIcon className="w-5 h-5" />
  Follow on TikTok
</button>
```

### Instagram Button
```jsx
<button className="
  bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888]
  text-white
  px-6 py-3 rounded-full
  flex items-center gap-3
  hover:opacity-90
  transition-all duration-300
">
  <InstagramIcon className="w-5 h-5" />
  Follow on Instagram
</button>
```

---

## Responsive Breakpoints

| Name | Width | Target |
|------|-------|--------|
| `sm` | 640px | Large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |

### Mobile-First Approach
```jsx
// Typography scaling
<h1 className="text-4xl md:text-6xl lg:text-8xl">

// Layout changes
<div className="flex flex-col lg:flex-row">

// Spacing adjustments
<section className="py-16 md:py-24 lg:py-32">
```

---

## Accessibility

### Color Contrast
- All text meets WCAG 2.1 AA standards
- Accent color (#f14011) passes on both light and dark backgrounds
- Never rely solely on color to convey information

### Focus States
```jsx
focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2
```

### Interactive Elements
- Minimum touch target: 44x44px
- Clear hover/focus/active states
- Descriptive labels and aria attributes

---

## File Structure

```
docs/design/
├── design-tokens.ts      # All design tokens as TypeScript
├── style-guide.md        # This document
├── component-specs.md    # Detailed component specifications
└── references/
    └── 1.png             # Reference designs

hitmit/
├── app/
│   ├── globals.css       # Global styles + Tailwind config
│   ├── layout.tsx        # Root layout with fonts
│   └── page.tsx          # Landing page
├── components/
│   ├── ui/               # Base UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── ...
│   ├── layout/           # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Container.tsx
│   └── sections/         # Page sections
│       ├── Hero.tsx
│       ├── Features.tsx
│       └── ...
└── lib/
    └── design-tokens.ts  # Re-exported tokens for use in app
```

---

## Implementation Notes

### Tailwind CSS v4 Integration
The design tokens are integrated into Tailwind via CSS custom properties in `globals.css`:

```css
@theme {
  --color-accent-500: #f14011;
  --color-primary-900: #0a0a0a;
  /* ... all tokens */
}
```

### Font Loading
Fonts are loaded via Google Fonts in the Next.js layout for optimal performance:

```tsx
import { Plus_Jakarta_Sans, Bebas_Neue } from 'next/font/google';
```

### Performance Considerations
- Use `next/image` for all images
- Lazy load below-fold sections
- Minimize JavaScript bundle with dynamic imports
- Use CSS animations over JS where possible
