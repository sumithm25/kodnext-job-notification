# Verification Checklist

## ✅ Routes Test

Test each route manually:
- `/` → Should redirect to `/dashboard` ✅
- `/dashboard` → Shows "Dashboard" placeholder ✅
- `/saved` → Shows "Saved" placeholder ✅
- `/digest` → Shows "Digest" placeholder ✅
- `/settings` → Shows "Settings" placeholder ✅
- `/proof` → Shows "Proof" placeholder ✅

## ✅ Navigation Highlighting

- Click each nav link
- Active link should have:
  - Dark text color (not muted)
  - Deep red underline (`#8B0000`) that animates in
- Only one link should be active at a time

## ✅ Mobile Hamburger Menu

1. Resize browser to < 768px width
2. Hamburger icon (3 lines) should appear on the right
3. Click hamburger → menu slides down
4. Hamburger transforms to X icon
5. Click outside or on a link → menu closes
6. Active link still shows red underline in mobile menu

## ✅ Design System Compliance

- **Background:** Off-white `#F7F6F3` ✅
- **Headings:** Serif font (Georgia) ✅
- **Accent:** Deep red `#8B0000` for active links ✅
- **Spacing:** Uses 8/16/24/40/64px scale ✅
- **No gradients, glassmorphism, or neon** ✅

## Code Structure

- `index.html` - Entry point with nav structure
- `router.js` - Client-side routing with History API
- `styles.css` - Navigation and page styles
- Links to `../design-system/design-system.css` ✅
