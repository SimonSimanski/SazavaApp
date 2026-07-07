---
name: Camp Prdomet
colors:
  surface: '#fff9ed'
  surface-dim: '#e2dabf'
  surface-bright: '#fff9ed'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fcf3d8'
  surface-container: '#f7eed2'
  surface-container-high: '#f1e8cd'
  surface-container-highest: '#ebe2c8'
  on-surface: '#1f1c0b'
  on-surface-variant: '#434840'
  inverse-surface: '#35301e'
  inverse-on-surface: '#faf0d5'
  outline: '#73796f'
  outline-variant: '#c3c8bd'
  surface-tint: '#466640'
  primary: '#173514'
  on-primary: '#ffffff'
  primary-container: '#2d4c28'
  on-primary-container: '#98bc8e'
  inverse-primary: '#acd0a1'
  secondary: '#934b19'
  on-secondary: '#ffffff'
  secondary-container: '#ffa26a'
  on-secondary-container: '#783603'
  tertiary: '#705d00'
  on-tertiary: '#ffffff'
  tertiary-container: '#c9a900'
  on-tertiary-container: '#4c3f00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c7edbc'
  primary-fixed-dim: '#acd0a1'
  on-primary-fixed: '#032104'
  on-primary-fixed-variant: '#2f4e2a'
  secondary-fixed: '#ffdbc9'
  secondary-fixed-dim: '#ffb68c'
  on-secondary-fixed: '#321200'
  on-secondary-fixed-variant: '#753401'
  tertiary-fixed: '#ffe16d'
  tertiary-fixed-dim: '#e9c400'
  on-tertiary-fixed: '#221b00'
  on-tertiary-fixed-variant: '#544600'
  background: '#fff9ed'
  on-background: '#1f1c0b'
  surface-variant: '#ebe2c8'
typography:
  display-lg:
    fontFamily: Bricolage Grotesque
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 52px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Bricolage Grotesque
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 36px
  headline-sm:
    fontFamily: Bricolage Grotesque
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 28px
  body-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 26px
  body-md:
    fontFamily: Be Vietnam Pro
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-mono:
    fontFamily: Space Mono
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  edge-margin: 20px
  stack-gap: 16px
  section-padding: 24px
---

## Brand & Style
The design system is built on a "Camp-Style Tactile" aesthetic, blending the nostalgia of summer camp with the irreverent humor of the product. The personality is adventurous, rustic, and unpretentiously funny. It evokes the feeling of a scout handbook found at the bottom of a backpack—well-loved, slightly messy, and full of character.

The visual style leans heavily into **Skeuomorphism and Tactile elements**. UI components are rendered as embroidered patches, carved wooden planks, and weathered stickers. The interface avoids digital perfection in favor of "hand-crafted" imperfections: slightly irregular borders, organic textures, and physical layering that suggests objects pinned to a corkboard or sewn onto a vest.

## Colors
The palette is rooted in the "Great Outdoors" with a toxic, humorous twist. 

- **Forest Green (Primary):** Used for structural elements, headers, and "Safe" zones. It represents the base camp.
- **Earthy Brown (Secondary):** Used for borders, shadows, and "Wooden" surfaces to provide a grounded, rustic feel.
- **Gas Yellow (Tertiary):** A vibrant, slightly acidic yellow used for warnings, highlights, and the "fart" meter intensity.
- **Parchment (Neutral):** A warm, off-white background color that mimics aged paper or canvas tents, reducing the harshness of pure white.
- **Methane Orange:** An accent color for extreme alerts or high-intensity readings.

## Typography
Typography follows a "Signage and Manual" hierarchy. 

**Headlines** use a quirky, bold grotesque to mimic hand-carved wood signs or heavy ink stamping. These should always be high-contrast against their background. 

**Body text** is kept clean and highly readable to balance the visual chaos of the UI ornaments. 

**Labels and Metadata** utilize a monospaced font to evoke the feel of a vintage scout typewriter or a technical "gas analyzer" readout. All caps should be used for labels to enhance the "badge" aesthetic.

## Layout & Spacing
The layout ignores rigid, clinical grids in favor of a **stacked-object approach**. Elements are treated as physical items placed on a surface. 

- **Margins:** A wide 20px safe area ensures the "canvas" feel is preserved.
- **Staggering:** Elements may be slightly rotated (1-2 degrees) to reinforce the sticker/patch look.
- **Grouping:** Use "wooden" containers or "canvas" cards to group related metrics and controls. 
- **Mobile First:** Since this is a mobile-specific app, touch targets are oversized (minimum 48px) to accommodate "rugged" interaction.

## Elevation & Depth
Depth is achieved through **Physical Layering and Hard Shadows** rather than soft blurs.

1.  **Level 0 (The Ground):** The Parchment/Canvas background.
2.  **Level 1 (The Table):** Wooden planks and paper sheets. These use a 4px solid brown offset shadow to look "bolted down."
3.  **Level 2 (The Gear):** Buttons and Patches. These feature "stitched" borders (dashed lines) and a 6px shadow to appear raised.
4.  **Level 3 (The Overlays):** Modal "stickers" that pop up over the UI with maximum rotation and heavy drop shadows.

Avoid gradients for depth; use solid color blocks or subtle inner glows to simulate "embossing."

## Shapes
Shapes are organic and "imperfect." While the base roundedness is set to `2` (0.5rem), this should be applied inconsistently to simulate hand-cut materials. 

- **Buttons:** Use a "pill" or "badge" shape with heavy 3px borders.
- **Containers:** Use "rough-cut" corners where possible.
- **Iconography:** Icons should look like linocut prints—thick lines, slightly rounded ends, and solid fills.

## Components
- **Buttons (The "Patch"):** Designed to look like embroidered merit badges. They feature a thick, dark brown border and a subtle "twill" texture. Primary actions use the Gas Yellow background.
- **The "Log" Card:** Data entries (the fart log) appear on horizontal wooden planks. The text looks "burned" into the wood using a dark brown color with a slight inner shadow.
- **Gauges (The "Meter"):** A semi-circular gauge that looks like a vintage analog pressure valve. The needle should be a bright red "scout compass" style pointer.
- **Checkboxes (The "X"):** Large "X" marks that look like they were drawn with a thick marker or charcoal.
- **Input Fields:** Styled as "fill-in-the-blank" lines on a clipboard, using the label-mono font for the user's input.
- **Navigation (The "Compass"):** A bottom navigation bar that uses forest icons (Tent, Compass, Log, Badge) in a hand-drawn style.