import http.server
import socketserver
import os
import mimetypes
import sys

# Default port 3783, can be overridden by arg
PORT = 3783
if len(sys.argv) > 1:
    try:
        PORT = int(sys.argv[1])
    except ValueError:
        pass

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))

class UltimateSPAHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        # 1. Handle root
        if self.path == '/':
            self.serve_file(os.path.join(ROOT_DIR, 'index.html'))
            return

        # 2. Clean path
        path = self.path.split('?', 1)[0]
        rel_path = path.lstrip('/')
        full_path = os.path.join(ROOT_DIR, rel_path)
        
        # 3. Check if it is an existing file
        if os.path.isfile(full_path):
            self.serve_file(full_path)
        else:
            # 4. Fallback to index.html for SPA routes
            # Heuristic: If it looks like a file (extension) and isn't index.html, 404 it.
            # This prevents 404ing assets from returning the full HTML app (which causes syntax errors in browser)
            filename = os.path.basename(path)
            if '.' in filename and filename != 'index.html':
                 # Missing static asset -> 404
                 self.send_error(404, "File not found")
                 return
            
            # SPA Route -> Serve index.html
            index_path = os.path.join(ROOT_DIR, 'index.html')
            if os.path.isfile(index_path):
                self.serve_file(index_path)
            else:
                self.send_error(404, "CRITICAL: index.html missing")

    def serve_file(self, file_path):
        try:
            with open(file_path, 'rb') as f:
                content = f.read()
            
            mime_type, _ = mimetypes.guess_type(file_path)
            if not mime_type:
                if file_path.endswith('.css'): mime_type = 'text/css'
                elif file_path.endswith('.js'): mime_type = 'application/javascript'
                elif file_path.endswith('.html'): mime_type = 'text/html'
                else: mime_type = 'application/octet-stream'
            
            # Simple cache control for development
            self.send_response(200)
            self.send_header('Content-Type', mime_type)
            self.send_header('Content-Length', str(len(content)))
            self.send_header('Cache-Control', 'no-cache')
            self.end_headers()
            self.wfile.write(content)
        except Exception as e:
            self.send_error(500, f"Internal Server Error: {e}")

    def log_message(self, format, *args):
        # Verify less noisy logs or custom logging if needed
        sys.stderr.write("%s - - [%s] %s\n" %
                         (self.client_address[0],
                          self.log_date_time_string(),
                          format%args))

print(f"Starting Job Notification Tracker Server on http://localhost:{PORT}")
print(f"Serving from: {ROOT_DIR}")

socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("", PORT), UltimateSPAHandler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping.")
