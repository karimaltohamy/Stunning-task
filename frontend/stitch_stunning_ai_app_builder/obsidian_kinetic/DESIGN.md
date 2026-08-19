---
name: Obsidian Kinetic
colors:
  surface: '#141414'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#e2bfb0'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#a98a7d'
  outline-variant: '#5a4136'
  surface-tint: '#ffb693'
  primary: '#ffb693'
  on-primary: '#561f00'
  primary-container: '#ff6b00'
  on-primary-container: '#572000'
  inverse-primary: '#a04100'
  secondary: '#ffbc7c'
  on-secondary: '#4b2800'
  secondary-container: '#fe9400'
  on-secondary-container: '#633700'
  tertiary: '#9ccaff'
  on-tertiary: '#003257'
  tertiary-container: '#059eff'
  on-tertiary-container: '#003357'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdbcc'
  primary-fixed-dim: '#ffb693'
  on-primary-fixed: '#351000'
  on-primary-fixed-variant: '#7a3000'
  secondary-fixed: '#ffdcbf'
  secondary-fixed-dim: '#ffb874'
  on-secondary-fixed: '#2d1600'
  on-secondary-fixed-variant: '#6a3b00'
  tertiary-fixed: '#d0e4ff'
  tertiary-fixed-dim: '#9ccaff'
  on-tertiary-fixed: '#001d35'
  on-tertiary-fixed-variant: '#00497b'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
  border-subtle: '#262626'
  text-primary: '#ffffff'
  text-muted: '#a3a3a3'
  glow-orange: rgba(255, 107, 0, 0.15)
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: -0.01em
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.08em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  gutter: 20px
  margin-mobile: 16px
  container-max: 1440px
---

## Brand & Style

The design system embodies the high-performance environment of a cutting-edge AI developer platform. The brand personality is **Elite, Technical, and Kinetic**. It is designed to evoke a sense of focused power—the "God Mode" of engineering. The audience consists of developers who value precision, speed, and a sophisticated aesthetic that mirrors their high-end hardware.

The design style is a hybrid of **Premium Minimalism** and **Glassmorphism**, specifically optimized for a dark-mode-first experience. It utilizes deep layering, fine-line borders, and intentional "light-leaks" using vibrant orange and amber to simulate energy and processing power. The interface feels like a high-fidelity instrument: tactile, responsive, and unmistakably premium. White space is treated as "void space," used strategically to keep complex technical data legible and focused.

## Colors

This design system is built on a "True Dark" foundation. 

- **Primary & Secondary:** The orange-to-amber spectrum is the exclusive source of chromatic energy. Primary Orange (#ff6b00) is reserved for high-intent actions and critical status, while Warm Amber (#ff9500) is used for secondary accents, warning states, and interactive highlights.
- **Surface Strategy:** The background is near-black (#0a0a0a) to maximize contrast with neon accents. UI surfaces (#141414) use subtle elevation to separate modular panels.
- **Typography:** Pure white is used sparingly for headers to prevent eye fatigue. Soft gray (#a3a3a3) is the workhorse for body text and metadata.
- **Borders:** A strict #262626 border palette is used to define structure without adding visual noise.

## Typography

The typography system relies on **Geist** for its mathematical precision and technical elegance. 

- **Hierarchy:** High contrast is maintained by using varying font weights rather than just color. Headlines use tighter tracking (-0.02em to -0.04em) to create a "locked-in" editorial look.
- **Technical Layers:** JetBrains Mono is used for all code-related content, labels, and terminal outputs. It should always be set with increased tracking for labels to ensure clarity against dark backgrounds.
- **Scalability:** On mobile, display sizes are aggressively stepped down to ensure that long technical strings do not break the layout.

## Layout & Spacing

The system uses a **12-column Fluid Grid** with a hard 4px baseline rhythm. 

- **Density:** The layout is high-density. Information is packed tightly but separated by clearly defined borders and void space.
- **Desktop:** 1440px max width. Sidebars are fixed at 260px or 320px depending on context. Gutters are kept at 20px to maintain a compact, "cockpit" feel.
- **Mobile:** Elements stack into a single column. Horizontal margins are reduced to 16px to maximize the narrow viewport for code snippets.
- **Rhythm:** All margins and paddings must be multiples of the 4px unit to ensure vertical rhythm remains consistent across the platform.

## Elevation & Depth

Elevation in this dark environment is conveyed through **Luminance and Glassmorphism** rather than traditional shadows.

- **Tonal Tiers:** Surfaces move closer to the user by becoming lighter in value (#141414 to #1c1c1c).
- **Glassmorphism:** Overlays, modals, and floating menus use a backdrop blur (20px) with a semi-transparent #0a0a0a fill (60% opacity). They are finished with a 1px top-oriented "rim light" border (#ffffff15).
- **Glows:** Primary interactive elements (like the active AI node) use a subtle, diffused orange outer glow (15% opacity, 20px blur) to indicate "power" or "focus."
- **Outlines:** Low-contrast outlines (#262626) are the primary separator for static content. Shadows are only used for the highest-level floating elements (Modals), using a pure black, high-spread, low-opacity shadow.

## Shapes

The shape language follows a "Modified Industrial" approach. 

- **Standard Radius:** Elements like buttons, inputs, and small cards use a 0.5rem (8px) radius. This balances the technical sharpness of the design with a modern, approachable touch.
- **Nested Corners:** When elements are nested (e.g., a button inside a card), the inner radius should be 4px smaller than the outer radius to maintain visual harmony.
- **Pills:** Used exclusively for status indicators (Online, Deploying) and tags to provide a clear silhouette distinction from functional buttons.

## Components

### Buttons
- **Primary:** Vibrant Orange (#ff6b00) background with black text for maximum contrast. On hover, a subtle amber glow appears.
- **Secondary:** Subtle dark gray (#141414) with a 1px border (#262626). Text is white.
- **Action Ghost:** No background. Text is Primary Orange. Used for tertiary actions within code editors.

### Input Fields & Controls
- **Inputs:** Background is #0a0a0a with a #262626 border. On focus, the border becomes Primary Orange with a 2px orange glow ring at 10% opacity.
- **Monospace Inputs:** Specifically for code snippets, using JetBrains Mono and a slightly darker background to differentiate from standard UI text fields.

### Cards & Containers
- Containers feature #141414 backgrounds and 1px #262626 borders. 
- For "AI Features," use a gradient border (Orange to Amber) at 0.5px thickness to signal premium functionality.

### AI Status & Feedback
- **Processing State:** A 2px linear progress bar using an orange-to-amber gradient that animates from left to right.
- **Terminal Components:** Pure black (#000000) background, 1px #262626 border, and `label-mono` typography.

### Chips & Badges
- **Status Badges:** Small, pill-shaped with a 4px dot indicator. 
- **Active Tags:** Orange text on a 10% opacity orange background, no border.