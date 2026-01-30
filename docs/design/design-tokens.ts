/**
 * HITMIT Design Tokens
 *
 * A comprehensive design token system for the HITMIT car marketplace.
 * These tokens define the visual language across all components.
 *
 * Tech Stack: Next.js 16 + React 19 + Tailwind CSS 4 + TypeScript
 */

// ============================================================================
// COLOR PALETTE
// ============================================================================

export const colors = {
  // Primary - Deep black for authority and premium feel
  primary: {
    900: '#0a0a0a',
    800: '#141414',
    700: '#1f1f1f',
    600: '#2a2a2a',
    500: '#3d3d3d',
    400: '#525252',
    300: '#737373',
    200: '#a3a3a3',
    100: '#d4d4d4',
    50: '#f5f5f5',
  },

  // Accent - Coral/Red-Orange for energy and automotive passion
  accent: {
    900: '#7c1d05',
    800: '#9a2308',
    700: '#b72b0b',
    600: '#d4330e',
    500: '#f14011', // Primary accent
    400: '#f45d3a',
    300: '#f77a63',
    200: '#fab19f',
    100: '#fdd8d0',
    50: '#fef2ef',
  },

  // Neutral - Warm grays for sophisticated balance
  neutral: {
    900: '#171717',
    800: '#262626',
    700: '#404040',
    600: '#525252',
    500: '#737373',
    400: '#a3a3a3',
    300: '#d4d4d4',
    200: '#e5e5e5',
    100: '#f5f5f5',
    50: '#fafafa',
    white: '#ffffff',
  },

  // Semantic colors
  success: {
    500: '#10b981',
    100: '#d1fae5',
  },
  warning: {
    500: '#f59e0b',
    100: '#fef3c7',
  },
  error: {
    500: '#ef4444',
    100: '#fee2e2',
  },

  // Social Media brand colors
  social: {
    tiktok: '#000000',
    tiktokAccent: '#ee1d52',
    instagram: '#e4405f',
    instagramGradientStart: '#f09433',
    instagramGradientEnd: '#bc1888',
  },
} as const;

// ============================================================================
// TYPOGRAPHY
// ============================================================================

export const typography = {
  // Font families - Distinctive pairing
  fontFamily: {
    // Display: Bold, modern, automotive character
    display: '"Bebas Neue", "Impact", sans-serif',
    // Heading: Strong geometric sans
    heading: '"Clash Display", "Oswald", sans-serif',
    // Body: Clean, highly legible
    body: '"Plus Jakarta Sans", "Inter", system-ui, sans-serif',
    // Mono: For specs and technical details
    mono: '"JetBrains Mono", "Fira Code", monospace',
  },

  // Font sizes (in rem)
  fontSize: {
    '2xs': '0.625rem',    // 10px
    xs: '0.75rem',        // 12px
    sm: '0.875rem',       // 14px
    base: '1rem',         // 16px
    lg: '1.125rem',       // 18px
    xl: '1.25rem',        // 20px
    '2xl': '1.5rem',      // 24px
    '3xl': '1.875rem',    // 30px
    '4xl': '2.25rem',     // 36px
    '5xl': '3rem',        // 48px
    '6xl': '3.75rem',     // 60px
    '7xl': '4.5rem',      // 72px
    '8xl': '6rem',        // 96px
    '9xl': '8rem',        // 128px
  },

  // Font weights
  fontWeight: {
    thin: '100',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },

  // Line heights
  lineHeight: {
    none: '1',
    tight: '1.1',
    snug: '1.25',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
    mega: '0.2em',
  },
} as const;

// ============================================================================
// SPACING SCALE
// ============================================================================

export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',    // 2px
  1: '0.25rem',       // 4px
  1.5: '0.375rem',    // 6px
  2: '0.5rem',        // 8px
  2.5: '0.625rem',    // 10px
  3: '0.75rem',       // 12px
  3.5: '0.875rem',    // 14px
  4: '1rem',          // 16px
  5: '1.25rem',       // 20px
  6: '1.5rem',        // 24px
  7: '1.75rem',       // 28px
  8: '2rem',          // 32px
  9: '2.25rem',       // 36px
  10: '2.5rem',       // 40px
  11: '2.75rem',      // 44px
  12: '3rem',         // 48px
  14: '3.5rem',       // 56px
  16: '4rem',         // 64px
  20: '5rem',         // 80px
  24: '6rem',         // 96px
  28: '7rem',         // 112px
  32: '8rem',         // 128px
  36: '9rem',         // 144px
  40: '10rem',        // 160px
  44: '11rem',        // 176px
  48: '12rem',        // 192px
  52: '13rem',        // 208px
  56: '14rem',        // 224px
  60: '15rem',        // 240px
  64: '16rem',        // 256px
  72: '18rem',        // 288px
  80: '20rem',        // 320px
  96: '24rem',        // 384px
} as const;

// ============================================================================
// BORDERS & RADIUS
// ============================================================================

export const borders = {
  width: {
    none: '0',
    thin: '1px',
    medium: '2px',
    thick: '4px',
    heavy: '8px',
  },
  radius: {
    none: '0',
    sm: '0.25rem',     // 4px
    md: '0.5rem',      // 8px
    lg: '0.75rem',     // 12px
    xl: '1rem',        // 16px
    '2xl': '1.5rem',   // 24px
    '3xl': '2rem',     // 32px
    full: '9999px',
  },
} as const;

// ============================================================================
// SHADOWS
// ============================================================================

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  // Custom dramatic shadows for cards
  card: '0 8px 32px -4px rgb(0 0 0 / 0.12), 0 4px 8px -2px rgb(0 0 0 / 0.08)',
  cardHover: '0 16px 48px -8px rgb(0 0 0 / 0.2), 0 8px 16px -4px rgb(0 0 0 / 0.12)',
  // Accent glow effects
  accentGlow: '0 0 40px -10px rgba(241, 64, 17, 0.5)',
  accentGlowStrong: '0 0 60px -10px rgba(241, 64, 17, 0.7)',
} as const;

// ============================================================================
// ANIMATION & TRANSITIONS
// ============================================================================

export const animation = {
  // Durations
  duration: {
    instant: '0ms',
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '700ms',
    slowest: '1000ms',
  },

  // Easing curves
  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    // Custom curves for automotive feel
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
  },

  // Keyframes definitions (for CSS)
  keyframes: {
    fadeIn: {
      from: { opacity: 0 },
      to: { opacity: 1 },
    },
    slideUp: {
      from: { transform: 'translateY(20px)', opacity: 0 },
      to: { transform: 'translateY(0)', opacity: 1 },
    },
    slideDown: {
      from: { transform: 'translateY(-20px)', opacity: 0 },
      to: { transform: 'translateY(0)', opacity: 1 },
    },
    scaleIn: {
      from: { transform: 'scale(0.95)', opacity: 0 },
      to: { transform: 'scale(1)', opacity: 1 },
    },
    spin: {
      from: { transform: 'rotate(0deg)' },
      to: { transform: 'rotate(360deg)' },
    },
    pulse: {
      '0%, 100%': { opacity: 1 },
      '50%': { opacity: 0.5 },
    },
    shimmer: {
      from: { backgroundPosition: '-200% 0' },
      to: { backgroundPosition: '200% 0' },
    },
    revealRight: {
      from: { transform: 'translateX(-100%)', opacity: 0 },
      to: { transform: 'translateX(0)', opacity: 1 },
    },
    float: {
      '0%, 100%': { transform: 'translateY(0)' },
      '50%': { transform: 'translateY(-10px)' },
    },
  },
} as const;

// ============================================================================
// BREAKPOINTS
// ============================================================================

export const breakpoints = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  '3xl': '1920px',
} as const;

// ============================================================================
// Z-INDEX SCALE
// ============================================================================

export const zIndex = {
  behind: -1,
  base: 0,
  raised: 10,
  dropdown: 100,
  sticky: 200,
  overlay: 300,
  modal: 400,
  popover: 500,
  toast: 600,
  tooltip: 700,
  max: 9999,
} as const;

// ============================================================================
// COMPONENT-SPECIFIC TOKENS
// ============================================================================

export const components = {
  // Button variants
  button: {
    height: {
      sm: '2rem',      // 32px
      md: '2.5rem',    // 40px
      lg: '3rem',      // 48px
      xl: '3.5rem',    // 56px
    },
    padding: {
      sm: '0.75rem 1rem',
      md: '0.875rem 1.5rem',
      lg: '1rem 2rem',
      xl: '1.25rem 2.5rem',
    },
  },

  // Input fields
  input: {
    height: {
      sm: '2rem',
      md: '2.5rem',
      lg: '3rem',
    },
    padding: {
      sm: '0.5rem 0.75rem',
      md: '0.625rem 1rem',
      lg: '0.75rem 1.25rem',
    },
  },

  // Cards
  card: {
    padding: {
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
    },
    borderRadius: '1rem',
  },

  // Navigation
  nav: {
    height: '4.5rem',      // 72px
    heightMobile: '4rem',  // 64px
  },

  // Footer
  footer: {
    paddingY: '4rem',
  },

  // Hero section
  hero: {
    minHeight: '100vh',
    paddingY: '8rem',
  },
} as const;

// ============================================================================
// EXPORT ALL TOKENS
// ============================================================================

export const designTokens = {
  colors,
  typography,
  spacing,
  borders,
  shadows,
  animation,
  breakpoints,
  zIndex,
  components,
} as const;

export type DesignTokens = typeof designTokens;

export default designTokens;
