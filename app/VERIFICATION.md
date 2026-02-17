# Verification Checklist

## ✅ Routes Test

Test each route manually:
- `/` → Should show **Daily Digest** (custom home page) ✅
- `/dashboard` → Shows Job List with filters ✅
- `/saved` → Shows Saved Jobs ✅
- `/digest` → Shows "Digest" UI ✅
- `/settings` → Shows "Settings" form ✅
- `/proof` → Shows "Proof" placeholder ✅

## ✅ Daily Digest Engine

- **Generation**: Click "Generate Today's 9AM Digest" -> Displays top 10 matches.
- **Persistence**: Refresh page -> Digest remains visible.
- **Actions**:
    - "Copy to Clipboard" -> Copies formatted text.
    - "Create Email Draft" -> Opens mail client.

## ✅ Job Status Tracking

- **Status Badges**:
    - Default: "Not Applied" (Grey)
    - Change to "Applied" (Blue) / "Rejected" (Red) / "Selected" (Green).
- **Persistence**: Refresh page -> Status remains.
- **Filtering**:
    - Filter by "Applied" -> Shows only applied jobs.
    - Filter by "Rejected" -> Shows only rejected jobs.
- **Notifications**:
    - Check `/digest` bottom section -> Shows recent status updates.

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
- `router.v2.js` - Client-side routing, state management (Digest, Status), and logic.
- `styles.v2.css` - Navigation, page, and component styles.
- Links to `../design-system/design-system.css` ✅
