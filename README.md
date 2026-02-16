# Job Notification Tracker

A premium, calm, and efficient job tracking dashboard designed for serious job seekers. Built with a custom design system and a robust local SPA server.

## 🚀 How to Run

1.  **Ensure Python is installed.**
2.  Navigate to the `app` directory:
    ```bash
    cd app
    ```
3.  Start the local server:
    ```bash
    python server.py
    ```
4.  Open the application in your browser:
    **[http://localhost:4000/dashboard](http://localhost:4000/dashboard)**

## 📂 Project Structure

-   `app/` - Core application logic, router, and data.
    -   `server.py` - Custom Python HTTP server with SPA routing fix (Handling 404s).
    -   `router.js` - Client-side history API router.
    -   `jobs-data.js` - Local dataset of 60+ realistic job postings.
    -   `index.html` - Entry point.
-   `design-system/` - "Calm & Serious" design system tokens and CSS.
    -   `tokens.css`, `base.css`, `components.css`.

## ✅ Verification

For a detailed checklist of implemented features and verification steps, see [VERIFICATION.md](app/VERIFICATION.md).
