# DESIGN MANIFEST: Minimalist Designer Portfolio CMS

This document serves as the machine-readable design system manifest for the Portfolio CMS. It outlines the core visual identity, design tokens, and interaction guidelines.

## 1. Visual Identity
* **Theme:** Minimalist, bold, high-contrast.
* **Style:** Sharp grids, strong typography, zero clutter.
* **Core Philosophy:** The UI should recede into the background, letting the designer's work (mockups/liveries/logos) stand out.

## 2. Design Tokens (Colors)
* **Light Mode:**
  * Background: `Pure White (#FFFFFF)`
  * Text/Foreground: `Deep Charcoal (#0D0D0D)`
* **Dark Mode:**
  * Background: `Deep Charcoal (#0D0D0D)`
  * Text/Foreground: `Pure White (#FFFFFF)`
* **Accent/Brand:**
  * Primary Accent: `Neon Lime (#CCFF00)` — Used sparingly for active states, badges, hover interactions, or primary CTA buttons.
  * Subdued Border: `#E5E5E5` (Light Mode) / `#2A2A2A` (Dark Mode)

## 3. Typography
* **Primary Font:** `Inter` or `Geist` (Sans-serif, clean, modern).
* **Headings:** Bold, tight tracking (letter-spacing), large sizes for visual impact.
* **Body:** Readable, moderate line-height.

## 4. Layout & Grid
* **Portfolio Archive (Screen 1):**
  * Masonry or strict grid layout for thumbnails.
  * Categories filter (All, Livery Mobil, Desain Kaos, Desain Logo) using pill-shaped toggles. Active state uses the Neon Lime accent.
* **Project Detail (Screen 3 - Mockup Showcase):**
  * Edge-to-edge or large container width.
  * Sticky project metadata (title, client, year, description) on the side, while scrolling through large, high-res mockup images on the other side.
* **Admin Dashboard (Screen 2):**
  * Utilitarian, dense data view.
  * Sidebar navigation.
  * Clear forms with focus states.

## 5. Interactions & Animations (@aerem.std style)
* **Framework:** Framer Motion.
* **Transitions:** 
  * Layout transitions using `layoutId` for seamless filtering in the portfolio archive.
  * Smooth page transitions between Archive and Detail views.
  * Spring-based animations for hover states (e.g., scale up thumbnails slightly, reveal project title on hover).
* **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` or similar snappy, yet smooth curves.

## 6. Components
* **Buttons:** Sharp corners or very subtle rounding (e.g., `rounded-sm`). Solid or bordered.
* **Inputs/Forms (Admin):** Minimal borders, changes border color to Neon Lime on focus.

## 7. Page Sections — Company Profile

### ManifestoSection
- **Typography:** Fluid `clamp(3rem, 9vw, 7.5rem)` heading, weight `900`, `tracking-tighter`.
- **Animation:** Per-line staggered reveal using `y: 105% → 0` with spring easing `[0.16, 1, 0.3, 1]`.
- **Accent highlight:** Last word of manifesto in `#CCFF00`.
- **Stats:** 3 KPIs displayed in accent color, micro-label in all-caps tiny tracking.
- **Eyebrow:** 8px decorative Neon Lime horizontal rule `+` label.

### MarqueeSection
- **Animation:** Framer Motion `x: 0% → -33.333%`, `ease: linear`, `repeat: Infinity`, 22s duration.
- **Text:** `10–11px` uppercase, `tracking-[0.25em]`, `text-foreground/50`.
- **Separator:** `•` dot in `text-accent`.
- **Border:** `border-y border-border/10` top and bottom.

### ServicesSection
- **Layout:** Full-width rows with `border-b` separator; hover sweep via `scaleX: 0→1` `bg-accent/5` overlay.
- **Floating image:** Cursor-tracked `220×160px` preview appears on row hover via `AnimatePresence`.
- **Title animation:** Color transitions to Neon Lime on hover (`transition-colors duration-200`).
- **Tags:** `8px` badge bordered pills that shift color to `accent/60` on parent hover.

### CapabilitiesSection
- **Layout:** 3-column grid with `divide-x divide-border/10` separators.
- **Animation:** Scroll-triggered stagger `opacity 0→1, y 32→0`, each column delayed by `i * 0.12s`.
- **Accent bar:** Per-column animated `h-px bg-accent/40` line that `scaleX: 0→1` on scroll.
- **Phase badge:** Filled Neon Lime `8px` uppercase label above heading.
- **CTA:** Outlined button with pulsing `→` arrow animation, hover turns accent border + text.

