"""
Job Notification Tracker — SPA dev server (History API fallback)

Fixes direct navigation to routes like /dashboard by always serving index.html
for non-file paths.

Run:
  python server.py

Then open:
  http://localhost:3783/dashboard
"""

from __future__ import annotations

from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


APP_DIR = Path(__file__).resolve().parent
INDEX = APP_DIR / "index.html"


class SpaHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path: str) -> str:  # type: ignore[override]
        # Serve files normally when they exist
        translated = super().translate_path(path)
        if Path(translated).exists():
            return translated

        # If the request looks like a "route" (no extension), serve index.html
        req_path = Path(path.split("?", 1)[0])
        if req_path.suffix == "":
            return str(INDEX)

        # Otherwise keep default behavior (404)
        return translated

    def log_message(self, format: str, *args) -> None:  # noqa: A003
        # Keep logs calm and minimal
        return


def main() -> None:
    server = ThreadingHTTPServer(("localhost", 3783), SpaHandler)
    print("Serving SPA with History API fallback on http://localhost:3783")
    server.serve_forever()


if __name__ == "__main__":
    main()

