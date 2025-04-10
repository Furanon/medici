# Paradise Website

## Project Structure
```bash
paradise/
├── css/
│   ├── bootstrap.min.css
│   ├── bootstrap-icons.css
│   └── templatemo-festava-live.css     # Custom styles, important for theming
├── js/
│   ├── bootstrap.bundle.min.js
│   ├── bootstrap.min.js
│   ├── click-scroll.js                 # Important: Handles smooth scrolling and navigation
│   ├── custom.js                       # Site-specific functionality
│   └── jquery.min.js
├── images/
│   ├── firelotus.webp                 # Main logo
│   ├── summit.webp
│   ├── firevillage.webp
│   ├── gallery/                       # Gallery section images
│   │   └── image1.webp - image6.webp
│   └── firepics/                      # Video thumbnails
│       └── image1.webp - image14.webp
├── video/
│   ├── firesplash.mp4                # Hero section video
│   └── firevids/                     # Main video content
│       └── video1.mp4 - video21.mp4
├── index.html                        # Main entry point
└── ticket.html                       # Course registration page
```

## Key Features
- Responsive design using Bootstrap 5
- Video gallery with lazy loading
- Smooth scrolling navigation
- Interactive course booking system
- Google Maps integration
- Contact form functionality

## Current Technical Challenges

1. Resource Loading Issues
   - Buffer space errors when loading multiple videos
   - High initial page load time due to video assets
   - Missing sparkles.png resource

2. Navigation Concerns
   - Section scrolling conflicts with ticket.html navigation
   - Mobile navigation needs optimization

3. Performance Bottlenecks
   - Direct video playback without controls
   - Fullscreen video functionality

## Immediate TODOs

1. Server Optimization
   - Implement chunked file transfers
   - Add proper error handling for large file transfers
   - Configure appropriate buffer sizes

2. Asset Management
   - Implement video compression pipeline
   - Add proper favicon
   - Create/add missing sparkles.png or remove references

3. Navigation Fixes
   - Clean up click-scroll.js logic
   - Improve mobile navigation UX
   - Fix ticket.html routing issues

## Setup Instructions

1. Local Development Server
   ```bash
   python3 -m http.server 8000
   ```
   Access the site at http://localhost:8000

2. Dependencies
   - Bootstrap 5
   - jQuery
   - Masonry Layout
   - ImagesLoaded

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contact
For questions and support:
- Phone: 080-8075700
- Email: arretrio@gmail.com
- Location: Pai, Thailand

## License
Proprietary - All rights reserved

Note: This is a development version. Ensure all optimizations are implemented before production deployment.

## Development Guidelines

### Video Asset Management
1. Video Compression Standards
   - Max file size: 10MB per video
   - Format: .mp4
   - Resolution: 720p max

2. Video Implementation Requirements
   - Auto-play on hover in artists section
   - Fullscreen playback on click
   - No video controls visible
   - Maintain playback position when entering/exiting fullscreen
   ```javascript
   <video preload="none">
     <source src="video.mp4" type="video/mp4">
   </video>
   ```

### Server Configuration
1. Recommended Production Setup
   ```python
   # Example server.py with chunked transfer
   CHUNK_SIZE = 64 * 1024  # 64KB chunks
   RETRY_DELAY = 0.1      # 100ms delay on buffer issues
   ```

2. Cache Configuration
   - Enable browser caching for static assets
   - Use versioning for cache busting
   - Configure CDN for video delivery

### Debugging Common Issues

1. Buffer Space Errors
   - Check system ulimit settings
   - Monitor memory usage with `top` or Activity Monitor
   - Use Chrome DevTools Network tab to analyze requests

2. Navigation Issues
   ```javascript
   // Debug logging in click-scroll.js
   const DEBUG = true;
   function logNavigation(event) {
     if (DEBUG) console.log('Navigation:', event);
   }
   ```

3. Memory Leaks
   - Use Chrome Memory Profiler
   - Monitor video element cleanup
   - Check for detached DOM elements

### Deployment Checklist

- [ ] Optimize video playback
- [ ] Test fullscreen functionality
- [ ] Fix Masonry grid layout
- [ ] Test all navigation paths
- [ ] Verify mobile responsiveness
- [ ] Check video hover-to-play functionality
- [ ] Enable error logging
- [ ] Test cross-browser compatibility

### Contributing Guidelines

1. Code Style
   - Use ES6+ features
   - Follow Bootstrap conventions
   - Document all video-related changes

2. Testing
   - Test on all supported browsers
   - Verify mobile navigation
   - Check video playback
   - Monitor memory usage

3. Pull Request Process
   - Update documentation
   - Test all changes locally
   - Include performance metrics
   - Update README if needed

