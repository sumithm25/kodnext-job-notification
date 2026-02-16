# KodNest Premium Build System

Design system for a serious B2C product. Calm, intentional, coherent, confident.

---

## Design philosophy

- **Calm, intentional, coherent, confident**
- Not flashy, not loud, not playful, not hackathon-style
- No gradients, no glassmorphism, no neon colors, no animation noise
- One mind designed it; no visual drift

---

## Color system (max 4)

| Token | Value | Use |
|-------|--------|-----|
| `--kn-background` | `#F7F6F3` | Page and surface |
| `--kn-text` | `#111111` | Primary text |
| `--kn-accent` | `#8B0000` | CTAs, links, focus |
| `--kn-success` | `#5a6b5a` | Success / shipped (muted green) |
| `--kn-warning` | `#8b7355` | In progress (muted amber) |

Success and warning are the only two semantic colors; no other hues. Aliases: `--kn-text-muted`, `--kn-border`, `--kn-border-focus` (derived from the above).

---

## Typography

- **Headings:** Serif (`Georgia`), large, confident, generous spacing
- **Body:** Sans-serif (`Inter`), 16–18px, line-height 1.6–1.8
- **Text blocks:** Max width `720px` (`--kn-text-max-width`)
- No decorative fonts, no random sizes

---

## Spacing (strict scale)

Use only: **8px, 16px, 24px, 40px, 64px**

| Token | Value |
|-------|--------|
| `--kn-space-xs` | 8px |
| `--kn-space-sm` | 16px |
| `--kn-space-md` | 24px |
| `--kn-space-lg` | 40px |
| `--kn-space-xl` | 64px |

Never use values like 13px, 27px. Whitespace is part of the design.

---

## Global layout

Every page follows this order:

1. **Top Bar** — Left: project name · Center: Step X / Y · Right: status badge (Not Started / In Progress / Shipped)
2. **Context Header** — Large serif headline, one-line subtext, clear purpose
3. **Primary Workspace (70%)** — Main product interaction; clean cards, predictable components
4. **Secondary Panel (30%)** — Step explanation, copyable prompt box, actions (Copy, Build in Lovable, It Worked, Error, Add Screenshot)
5. **Proof Footer** — Checklist: □ UI Built □ Logic Working □ Test Passed □ Deployed (each requires user proof)

---

## Components

- **Primary button:** Solid deep red (`--kn-accent`). Secondary: outlined, same radius.
- **Same hover and border radius everywhere:** `--kn-radius: 6px`, `--kn-duration: 175ms`, `--kn-ease: ease-in-out`
- **Inputs:** Clean borders, no heavy shadows, clear focus state
- **Cards:** Subtle border, no drop shadows, balanced padding

---

## Interaction

- Transitions: **150–200ms**, **ease-in-out**. No bounce, no parallax.

---

## Error and empty states

- **Errors:** Explain what went wrong and how to fix it. Never blame the user.
- **Empty states:** Provide the next action. Never feel dead.

---

## Files

| File | Purpose |
|------|--------|
| `tokens.css` | Colors, typography, spacing, transitions |
| `base.css` | Reset, body, headings, links, focus |
| `layout.css` | Top bar, context header, workspace row, proof footer |
| `components.css` | Buttons, badges, inputs, cards, error, empty |
| `design-system.css` | Single import for the full system |
| `index.html` | Reference page showing layout and components |

---

## Usage

Link the design system in your app:

```html
<link rel="stylesheet" href="design-system/design-system.css" />
```

Use the class names and structure from `index.html` so every page feels like one product.
