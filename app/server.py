import os
import sys
from http.server import SimpleHTTPRequestHandler, HTTPServer

PORT = 3783
# Ensure we are serving the directory containing this script
ROOT_DIR = os.path.dirname(os.path.abspath(__file__))

class SpaHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        # Set the directory explicitly to ensure we serve from the correct place
        super().__init__(*args, directory=ROOT_DIR, **kwargs)

    def do_GET(self):
        # Get the path without query parameters
        path = self.path.split('?', 1)[0]
        
        # Check if the requested path exists as a file
        # path includes leading '/', so full_path needs handling
        if path.startswith('/'):
            rel_path = path[1:]
        else:
            rel_path = path

        full_path = os.path.join(ROOT_DIR, rel_path)

        # Debug print
        print(f"Request: {self.path} | Checking: {full_path}")

        # If it's a file that exists, serve it
        if os.path.isfile(full_path):
            print(f"  -> File exists, serving: {rel_path}")
            super().do_GET()
            return

        # If it's not a file (and not a directory we want to list), fallback to index.html
        # We assume any non-file request that isn't a specific API/asset is a route
        print(f"  -> File not found, serving index.html for SPA route")
        self.path = '/index.html'
        super().do_GET()

def main():
    # Allow port to be passed as argument
    port = PORT
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            pass
            
    print(f"Starting SPA Server on http://localhost:{port}")
    print(f"Serving directory: {ROOT_DIR}")
    
    server = HTTPServer(('0.0.0.0', port), SpaHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server...")
        server.server_close()

if __name__ == '__main__':
    main()
