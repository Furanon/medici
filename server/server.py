#!/usr/bin/env python3
import http.server
import socketserver
import os

class ChunkedHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, directory=None, **kwargs):
        super().__init__(*args, directory=os.getcwd(), **kwargs)
        
    def end_headers(self):
        # Add no-cache headers
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()
        
    def copyfile(self, source, outputfile):
        """Copy data from source to outputfile in chunks to prevent buffer issues"""
        CHUNK_SIZE = 64 * 1024  # 64KB chunks
        while True:
            buf = source.read(CHUNK_SIZE)
            if not buf:
                break
            try:
                outputfile.write(buf)
            except (ConnectionAbortedError, BrokenPipeError):
                # Handle client disconnection gracefully
                break
            except OSError as e:
                if e.errno == 55:  # No buffer space available
                    # Wait briefly and retry
                    import time
                    time.sleep(0.1)
                    try:
                        outputfile.write(buf)
                    except:
                        break
                else:
                    raise

def run(server_class=socketserver.TCPServer):
    # Increase the request queue size
    server_class.request_queue_size = 50
    
    # Allow address reuse
    server_class.allow_reuse_address = True
    
    port = 8000
    handler = ChunkedHTTPRequestHandler
    
    with server_class(("", port), handler) as httpd:
        print(f"Serving at http://localhost:{port}")
        print("No-cache headers enabled - browser will always load fresh content")
        print("Press Ctrl+C to stop the server")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")

if __name__ == "__main__":
    run()
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
    mimetypes.add_type('video/mp4', '.mp4')
    mimetypes.add_type('video/webm', '.webm')
    mimetypes.add_type('video/ogg', '.ogv')
    
    Handler = NoCacheHTTPRequestHandler
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Serving at http://localhost:{PORT}")
        print("No-cache headers enabled - browser will always load fresh content")
        print("Press Ctrl+C to stop the server")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")

