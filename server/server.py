#!/usr/bin/env python3
import http.server
import socketserver
import os
import mimetypes

# Extend the SimpleHTTPRequestHandler to add no-cache headers
class NoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.getcwd(), **kwargs)
    
    def end_headers(self):
        # Add headers to prevent caching
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()
    
    def guess_type(self, path):
        # Enhanced MIME type handling
        mimetype = mimetypes.guess_type(path)[0]
        
        if mimetype is None:
            # Default to binary if MIME type is unknown
            mimetype = 'application/octet-stream'
        
        # Common web file types
        if path.endswith('.js'):
            return 'application/javascript'
        elif path.endswith('.css'):
            return 'text/css'
        elif path.endswith('.html') or path.endswith('.htm'):
            return 'text/html'
        elif path.endswith('.json'):
            return 'application/json'
        elif path.endswith('.png'):
            return 'image/png'
        elif path.endswith('.jpg') or path.endswith('.jpeg'):
            return 'image/jpeg'
        elif path.endswith('.gif'):
            return 'image/gif'
        elif path.endswith('.svg'):
            return 'image/svg+xml'
        elif path.endswith('.ico'):
            return 'image/x-icon'
        elif path.endswith('.woff'):
            return 'font/woff'
        elif path.endswith('.woff2'):
            return 'font/woff2'
        elif path.endswith('.ttf'):
            return 'font/ttf'
        elif path.endswith('.otf'):
            return 'font/otf'
        elif path.endswith('.eot'):
            return 'application/vnd.ms-fontobject'
        
        return mimetype

if __name__ == "__main__":
    PORT = 8000
    
    # Register additional MIME types
    mimetypes.add_type('text/css', '.css')
    mimetypes.add_type('application/javascript', '.js')
    mimetypes.add_type('image/svg+xml', '.svg')
    
    Handler = NoCacheHTTPRequestHandler
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Serving at http://localhost:{PORT}")
        print("No-cache headers enabled - browser will always load fresh content")
        print("Press Ctrl+C to stop the server")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")

