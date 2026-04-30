---
name: massive-brand
description: Apply Massive Computing's brand guidelines when creating any visual or document output. Use this skill whenever creating presentations, documents, landing pages, emails, social media assets, or any design work for Massive. Also trigger when the user mentions Massive branding, brand colors, Massive logo, brand assets, brand guidelines, or asks to make something "on brand" or "in Massive style". Use this even if the user just says "use our brand" or "make it look like Massive" or "add the Massive logo".
---

# Massive Brand Assets & Guidelines

This skill provides Massive Computing's official brand assets, colors, typography, and logo URLs so Claude can produce on-brand outputs (decks, docs, HTML, emails, images, etc.).

## Brand Colors

### Core palette

| Name         | Hex       | Usage                                    |
|--------------|-----------|------------------------------------------|
| Dark Orange  | `#d74939` | Primary accent, CTAs, emphasis           |
| Light Orange | `#ff8163` | Secondary accent, gradients, highlights  |
| Light        | `#FFFFFF` | Pure white, used sparingly               |
| Dark         | `#121117` | Primary text on light, dark backgrounds  |

### Extended palette

| Name             | Hex       | Usage                          |
|------------------|-----------|--------------------------------|
| Muted blue-gray  | `#607691` | Secondary text, subtle icons   |

## Light Mode (Landing Page Style)

The Massive landing page uses a warm cream aesthetic, NOT plain white. Anything described as "light mode," "on-brand light," or "match the website" should use this palette — never default to `#FFFFFF` backgrounds.

### Light mode palette

| Token              | Hex       | Usage                                                 |
|--------------------|-----------|-------------------------------------------------------|
| `--bg-cream`       | `#F5EFE6` | Primary page background                               |
| `--bg-cream-soft`  | `#FAF5EC` | Card backgrounds, panels, raised surfaces             |
| `--bg-cream-warm`  | `#F2EADA` | Alternate sections, subtle bands                      |
| `--border-warm`    | `#E5D9C5` | Card borders, dividers                                |
| `--border-warm-strong` | `#D9CAB0` | Emphasized borders, focused inputs                |
| `--text-primary`   | `#1F1611` | Headlines, primary text (deep brown-black)            |
| `--text-secondary` | `#5C4A3D` | Body text, supporting copy                            |
| `--text-muted`     | `#8A7560` | Labels, captions, metadata                            |
| `--accent-orange`  | `#d74939` | Primary CTAs, links, active states                    |
| `--accent-orange-soft` | `#ff8163` | Hover states, gradients                           |
| `--panel-dark`     | `#1F1611` | Dark feature panels embedded in light pages           |
| `--panel-dark-text`| `#F5EFE6` | Text on dark panels (cream, not white)                |
| `--success-green`  | `#5BA873` | Success indicators, "100%" badges                     |

### Light mode rules

- **Background is cream, not white.** Use `--bg-cream` (`#F5EFE6`) as the page background. Pure `#FFFFFF` looks off-brand and clinical.
- **Cards sit on cream with a slight contrast.** Use `--bg-cream-soft` (`#FAF5EC`) for cards, with a thin `--border-warm` border. This gives subtle layering without harsh shadows.
- **Text is deep brown, not pure black.** `#1F1611` reads warmer than `#000000` and matches the cream context.
- **Dark panels embedded in light layouts use the cream as text color.** When a section flips to dark (like the "Consent in. Traffic out." panel on the landing page), text on it should be cream (`#F5EFE6`) — never pure white. White looks too cold.
- **Orange remains the only chromatic accent.** Don't introduce blues, greens, or purples for variety. The single accent across light and dark is what makes the brand feel cohesive. Green is allowed only for success/status indicators.
- **Subtle grid background.** The landing page has a faint cream-on-cream grid pattern. For full pages mimicking the landing page, add a subtle 1px grid overlay at ~5% opacity.
- **Borders over shadows.** Light mode emphasizes thin warm borders; avoid heavy drop shadows. If shadow is needed, keep it warm-tinted and very low opacity (e.g., `rgba(31, 22, 17, 0.04)`).

### Light mode CSS variables (drop-in)

```css
:root[data-theme="light"],
.theme-light {
  --bg-cream: #F5EFE6;
  --bg-cream-soft: #FAF5EC;
  --bg-cream-warm: #F2EADA;
  --border-warm: #E5D9C5;
  --border-warm-strong: #D9CAB0;
  --text-primary: #1F1611;
  --text-secondary: #5C4A3D;
  --text-muted: #8A7560;
  --accent-orange: #d74939;
  --accent-orange-soft: #ff8163;
  --panel-dark: #1F1611;
  --panel-dark-text: #F5EFE6;
  --success-green: #5BA873;
}
```

### Tailwind extension

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#F5EFE6',
          soft: '#FAF5EC',
          warm: '#F2EADA',
        },
        warmborder: {
          DEFAULT: '#E5D9C5',
          strong: '#D9CAB0',
        },
        ink: {
          DEFAULT: '#1F1611',
          secondary: '#5C4A3D',
          muted: '#8A7560',
        },
        massiveorange: {
          DEFAULT: '#d74939',
          soft: '#ff8163',
        },
      },
    },
  },
}
```

## Dark Mode

Dark mode uses near-black backgrounds with the same orange accent.

| Token              | Hex       | Usage                                          |
|--------------------|-----------|------------------------------------------------|
| `--bg-dark`        | `#121117` | Primary page background                        |
| `--bg-dark-soft`   | `#1A1922` | Card backgrounds                               |
| `--border-dark`    | `#2A2933` | Card borders, dividers                         |
| `--text-primary-dark` | `#F5EFE6` | Headlines, primary text (cream, not white)  |
| `--text-secondary-dark` | `#A8A0B0` | Body text on dark                         |

The orange accent stays the same in dark mode (`#d74939` / `#ff8163`).

## Typography

- **Primary font**: Inter (by Rasmus Andersson)
- **Source**: Google Fonts — https://fonts.google.com/specimen/Inter
- Use Inter for all headings and body text in Massive materials, in both light and dark mode.
- Weight range: 400 (regular), 500 (medium), 600 (semibold), 700 (bold), 800 (extrabold)
- Mono stack for code blocks: `'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, Menlo, monospace`

## Logos

All logos are hosted on Massive's CDN. Use the appropriate variant based on background color.

### Full Logo (wordmark + icon)

#### Positive (colored logo, for light/cream backgrounds)
- SVG: `https://cdn.prod.website-files.com/5e4e54db58d02b857909aa5e/677c104f2035b24d5685c8f2_logo-positive.svg`
- JPG: `https://cdn.prod.website-files.com/5e4e54db58d02b857909aa5e/677c33b411345f3897220a04_logo-positive.jpg`
- PNG: `https://cdn.prod.website-files.com/5e4e54db58d02b857909aa5e/677c104fe53e3d7505fc2ffb_logo-positive%402x.png`
- PDF: `https://cdn.prod.website-files.com/5e4e54db58d02b857909aa5e/677c104f43f77912a62bec30_logo-positive%403x.pdf`

#### Negative (colored logo, for dark backgrounds)
- SVG: `https://cdn.prod.website-files.com/5e4e54db58d02b857909aa5e/677c104fbd47289039811bd8_logo-negative.svg`
- PNG: `https://cdn.prod.website-files.com/5e4e54db58d02b857909aa5e/69934c01849f60a981bda9ae_677c104f2035b24d5685c8f2_logo-positive%201.png`

#### White (for dark backgrounds)
- SVG: `https://cdn.prod.website-files.com/5e4e54db58d02b857909aa5e/677c10559f51353fed1c27b0_logo-white.svg`
- PNG: `https://cdn.prod.website-files.com/5e4e54db58d02b857909aa5e/677c104f99bf29025f865709_logo-white%402x.png`
- PDF: `https://cdn.prod.website-files.com/5e4e54db58d02b857909aa5e/677c104fbd47289039811bf8_logo-white%403x.pdf`

#### Black (for light backgrounds, monochrome)
- SVG: `https://cdn.prod.website-files.com/5e4e54db58d02b857909aa5e/677c104e7eb66d51d0d1b535_logo-black.svg`
- JPG: `https://cdn.prod.website-files.com/5e4e54db58d02b857909aa5e/677c33b3eab410617aa0bbdf_logo-black.jpg`
- PNG: `https://cdn.prod.website-files.com/5e4e54db58d02b857909aa5e/677c104fe53e3d7505fc2ff8_logo-black%402x.png`
- PDF: `https://cdn.prod.website-files.com/5e4e54db58d02b857909aa5e/677c104f5be48081ded2fd27_logo-black%403x.pdf`

### Icon Only (no wordmark)

#### Full Color Icon (for light/cream backgrounds)
- SVG: `https://cdn.prod.website-files.com/5e4e54db58d02b857909aa5e/677c104ee53e3d7505fc2fcc_icon-full-color.svg`
- JPG: `https://cdn.prod.website-files.com/5e4e54db58d02b857909aa5e/677c33b3500d943e5028b939_icon-full-color.jpg`
- PNG: `https://cdn.prod.website-files.com/5e4e54db58d02b857909aa5e/677c104f1788cecfbb8e4f51_icon-full-color%402x.png`
- PDF: `https://cdn.prod.website-files.com/5e4e54db58d02b857909aa5e/677c104e1788cecfbb8e4eed_icon-full-color%403x.pdf`

#### White Icon (for dark backgrounds)
- SVG: `https://cdn.prod.website-files.com/5e4e54db58d02b857909aa5e/6758aac9367026e892329a22_icon-light.svg`
- PNG: `https://cdn.prod.website-files.com/5e4e54db58d02b857909aa5e/677c104f263a05c051a54bf3_Icon-white%402x.png`
- PDF: `https://cdn.prod.website-files.com/5e4e54db58d02b857909aa5e/677c104eefacac65b850397c_Icon-white%403x.pdf`

#### Black Icon (for light backgrounds, monochrome)
- SVG: `https://cdn.prod.website-files.com/5e4e54db58d02b857909aa5e/677c104e5789c1fa3bb9a449_Icon-black.svg`
- JPG: `https://cdn.prod.website-files.com/5e4e54db58d02b857909aa5e/677c33b42e0bea5650984ada_Icon-black.jpg`
- PNG: `https://cdn.prod.website-files.com/5e4e54db58d02b857909aa5e/677c104f5e61dce50e704181_Icon-black%402x.png`
- PDF: `https://cdn.prod.website-files.com/5e4e54db58d02b857909aa5e/677c104ef7960b3562bde1bc_Icon-black%403x.pdf`

### Display SVGs (used on website directly)
- Positive display: `https://cdn.prod.website-files.com/5e4e54db58d02b857909aa5e/6758aac9eedf441626eb27d6_logo-positive.svg`
- Light (white wordmark): `https://cdn.prod.website-files.com/5e4e54db58d02b857909aa5e/6758aac94a8c0e6584a8ec60_logo-light.svg`
- Dark (black wordmark): `https://cdn.prod.website-files.com/5e4e54db58d02b857909aa5e/6758aac92ea3edbb88100587_logo-dark.svg`
- Navbar logo (white): `https://cdn.prod.website-files.com/5e4e54db58d02b857909aa5e/64d65638b2155c72fcc21aac_logo-light.svg`
- Full color icon: `https://cdn.prod.website-files.com/5e4e54db58d02b857909aa5e/6758aac9b7e5706416a4f574_icon-full-color.svg`
- Light icon: `https://cdn.prod.website-files.com/5e4e54db58d02b857909aa5e/6758aac9367026e892329a22_icon-light.svg`
- Dark icon: `https://cdn.prod.website-files.com/5e4e54db58d02b857909aa5e/6758aac91a93a5f8c9287e6d_icon-dark.svg`
- Positive white logo: `https://cdn.prod.website-files.com/5e4e54db58d02b857909aa5e/69934b9e27fb807a9fc66652_logo-positive-white.svg`

## Logo Selection Guide

| Background     | Full Logo Variant | Icon Variant     |
|----------------|-------------------|------------------|
| Cream (light mode) | Positive          | Full Color       |
| Pure White     | Positive or Black | Full Color or Black |
| Dark/#121117   | Negative or White | White            |
| Colored/Photo  | White or Black    | White or Black   |

## How to Use Logos in Outputs

### In HTML/React artifacts
```html
<img src="[SVG URL]" alt="Massive" height="20" />
```
Use SVG URLs for web. They scale cleanly.

### In PPTX/DOCX
Download the PNG (@2x) version and embed it. The @2x PNGs are high-res enough for print.

To download a logo for embedding in a document:
```python
import urllib.request
urllib.request.urlretrieve(
    "https://cdn.prod.website-files.com/5e4e54db58d02b857909aa5e/677c104fe53e3d7505fc2ffb_logo-positive%402x.png",
    "massive-logo.png"
)
```

### In PDFs
Use the PNG version. Download it first, then embed via the PDF creation library.

## Brand Voice (brief)

- Massive is a real-time web access API for AI agents (formerly positioned as a residential proxy network)
- Tagline emphasis: "Real-time web access for your AI" and "100% ethically-sourced"
- Tone: professional, technical, confident, not salesy
- Company: Massive Computing, Inc. (trademark: "Massive")
- Founded: 2018
- Founders: Jason Grad, Brian Kennish
- Website: https://www.joinmassive.com

## OG/Social Image
- `https://cdn.prod.website-files.com/5e4e54db58d02b857909aa5e/66ba601af441ba54e6f4d2e3_Og-graph.jpg`
