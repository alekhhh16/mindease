# Design Brief — MindEase Premium AI Mental Wellness Platform

## Tone & Differentiation
Calm luxury minimalism. Premium AI wellness assistant with glassmorphic UI, warm soft palette, and emotionally supportive micro-interactions. Differentiation: glassmorphic cards + transparency convey psychological safety; generous spacing + warm accents create emotional warmth; smooth 60fps motion feels supportive, not aggressive.

## Color Palette

| Role       | Light (OKLCH)     | Dark (OKLCH)      | Usage                                    |
|:-----------|:------------------|:------------------|:-----------------------------------------|
| Background | 0.961 0.013 82    | 0.18 0.02 260     | Page background, main content area       |
| Foreground | 0.15 0 0          | 0.95 0.01 80      | Text, primary typography                 |
| Card       | 1 0 0 (40% opac)  | 0.24 0.025 260    | Glassmorphic cards, elevated surfaces    |
| Primary    | 0.715 0.099 34    | 0.715 0.099 34    | CTA buttons, active states, accent       |
| Secondary  | 0.888 0.071 53    | 0.7 0.08 50       | Secondary actions, highlights            |
| Accent     | 0.921 0.04 286    | 0.82 0.055 290    | Accents, interactive highlights          |
| Muted      | 0.967 0.023 102   | 0.35 0.015 260    | Disabled, low-emphasis states            |
| Destructive| 0.577 0.245 27    | 0.577 0.245 27    | Warnings, critical actions               |

## Typography
Display: **Space Grotesk** (modern, clean, personality) · Body: **DM Sans** (refined, highly legible) · Mono: **Geist Mono** (premium code/data).

## Structural Zones

| Zone   | Light Surface          | Dark Surface           | Treatment                      |
|:-------|:-----------------------|:-----------------------|:-------------------------------|
| Header | glass (40% + blur 12px)| glass-dark (35% blur)  | Sticky, elevated, borders, nav |
| Hero   | bg-background          | bg-background          | Clean, breathing room          |
| Content| alternating bg/muted30 | alternating bg/muted   | Rhythm, depth, white-space    |
| Card   | glass-elevated (50%)   | glass-dark + border    | Interactive, hover-lift, 60fps |
| Footer | bg-muted/20, border-t  | bg-muted, border-t     | Minimal, low-emphasis          |

## Component Patterns
Buttons: pill-shaped, smooth hover-lift (+2px), shadow elevation on hover. Cards: glassmorphic with backdrop blur, 1px semi-transparent border, responsive padding. Inputs: glass-bordered, focus:ring-primary. Interactive elements: transition-smooth (0.3s cubic-bezier). Dark mode: inverted luminance, softened accents, maintained contrast ratios.

## Motion & Animation
Entrance: fade-in (0.4s), slide-up (0.6s). Hover: translateY(-2px), shadow-elevation. Breathing: scale animation for mindfulness widgets (4s cycle). All animations 60fps, eased via cubic-bezier(0.4, 0, 0.2, 1).

## Constraints
No flat prototype feel — every structural zone has intentional surface treatment. Glassmorphism only on interactive/elevated surfaces; backgrounds remain clean. Dark mode: complete and polished, not inverted lightness. Typography hierarchy via Space Grotesk (display) + DM Sans (body). Contrast: AA+ in light & dark.

## Signature Detail
Glassmorphic cards with soft borders and backdrop blur evoke trust and transparency — ideal for mental wellness where psychological safety is paramount. Warm palette (peach/lavender/sage) maintains human warmth; smooth 60fps animations ensure the experience feels unhurried and supportive.

## Responsive & Dark Mode
Mobile-first design with touch-friendly targets (48px min). Dark mode: complete, intentional palette (deep indigo bg + softened accents), high contrast text. Both modes maintain visual hierarchy and emotional tone.
