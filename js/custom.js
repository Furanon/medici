/**
 * Paradise - Custom JavaScript
 * Core functionality for Paradise website
 */
(function ($) {
  "use strict";

  /**
   * Initialize tsParticles for background star effect
   */
  document.addEventListener("DOMContentLoaded", function() {
    tsParticles.load("tsparticles", {
      fullScreen: {
        enable: true,
        zIndex: -1 // Match CSS z-index
      },
      motion: {
        enable: true,
        reduce: {
          factor: 2, // Reduced for better visibility
          value: true
        }
      },
      transform: {
        enable: true,
        duration: 0.3,
        timing: "ease-out"
      },
      fpsLimit: 120, // Increased for smoother animation
      particles: {
        number: {
          value: 160,
          density: {
            enable: true,
            value_area: 800
          }
        },
        color: {
          value: "#ffffff"
        },
        shape: {
          type: "circle"
        },
        opacity: {
          value: 0.5,
          random: true,
          anim: {
            enable: true,
            speed: 1,
            opacity_min: 0.1,
            sync: false
          }
        },
        size: {
          value: 3,
          random: true,
          anim: {
            enable: true,
            speed: 2,
            size_min: 0.3,
            sync: false
          }
        },
        line_linked: {
          enable: false
        },
        move: {
          enable: true,
          speed: 0.7, // Increased speed for better visibility
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out",
          bounce: false,
          parallax: true, // Enable parallax effect
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200
          }
        }
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: true,
            mode: "bubble"
          },
          onclick: {
            enable: true,
            mode: "push"
          },
          resize: true
        },
        modes: {
          bubble: {
            distance: 100,
            size: 4,
            duration: 2,
            opacity: 0.8,
            speed: 3
          },
          push: {
            particles_nb: 4
          }
        }
      },
      retina_detect: true,
      background: {
        color: "transparent",
        image: "",
        position: "50% 50%",
        repeat: "no-repeat",
        size: "cover"
      }
    });

    // Remove the duplicate scroll handlers and combine them into one optimized handler
    let ticking = false;
    let scrollTimeout;
    let lastKnownScrollPosition = 0;

    // Define DEBUG_PARTICLES flag for conditional logging
    window.DEBUG_PARTICLES = false;

    function updateParticleTransform(scrollPos) {
        const container = document.getElementById('tsparticles');
        if (container) {
            // Calculate transform with easing and less aggressive parallax
            const transformValue = scrollPos * 0.3; // Reduced from 0.5 to 0.3 for smoother effect
            
            // Use matrix3d for better performance
            const transform = `matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,${transformValue},0,1)`;
            
            // Apply optimized transform
            container.style.transform = transform;
            container.style.webkitTransform = transform;
            container.style.mozTransform = transform;
            container.style.msTransform = transform;
            
            // Apply transform with CSS containment for better performance
            container.style.contain = 'paint layout';
            
            // Log only when debugging is needed
            if (window.DEBUG_PARTICLES) {
                console.log('Transform test results:', {
                    scrolled: scrollPos,
                    transform: transform,
                    containerVisible: !!container.offsetParent,
                    zIndex: getComputedStyle(container).zIndex,
                    transformComputed: getComputedStyle(container).transform
                });

                console.log('Container visibility check:', {
                    offsetParent: container.offsetParent,
                    getBoundingClientRect: container.getBoundingClientRect(),
                    computedDisplay: getComputedStyle(container).display
                });
            }
        }
    }

    // Single optimized scroll handler
    window.addEventListener('scroll', function() {
        lastKnownScrollPosition = window.pageYOffset;
        
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const container = document.getElementById('tsparticles');
                if (container) {
                    // Set will-change before transform
                    container.style.willChange = 'transform';
                    
                    // Update transform
                    updateParticleTransform(lastKnownScrollPosition);
                    
                    // Reset ticking flag
                    ticking = false;
                }
            });
            ticking = true;
        }
        
        // Debounce will-change cleanup with shorter timeout
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const container = document.getElementById('tsparticles');
            if (container) {
                container.style.willChange = 'auto';
                container.style.contain = 'none';
            }
        }, 100); // Reduced from 150ms to 100ms
    });
    });

    // Initial transform check on load with a slight delay
    window.addEventListener('load', function() {
        // Small delay to ensure tsParticles is fully initialized
        setTimeout(() => {
            updateParticleTransform(window.pageYOffset);
            
            // Enable debug if needed (uncomment for debugging)
            // window.DEBUG_PARTICLES = true;
            
            // Verify particles container is properly configured
            if (window.DEBUG_PARTICLES) {
                const container = document.getElementById('tsparticles');
                if (container) {
                    console.log('Particles container initialized:', {
                        size: container.getBoundingClientRect(),
                        styles: {
                            zIndex: getComputedStyle(container).zIndex,
                            position: getComputedStyle(container).position,
                            display: getComputedStyle(container).display,
                            visibility: getComputedStyle(container).visibility,
                            opacity: getComputedStyle(container).opacity
                        }
                    });
                } else {
                    console.error('Particles container not found!');
                }
            }
        }, 100);
    });

  /**
   * Initialize video playback and fullscreen functionality
   * Handles video hover-to-play and fullscreen state preservation
   */
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables for video state tracking
    let currentPlayingVideo = null;
    let isFullscreenActive = false;
    let videoStates = {};

    // Helper function to get video source path (used as ID)
    function getVideoPath(video) {
      return video.querySelector('source')?.getAttribute('src');
    }

    // Save video state
    function saveVideoState(video) {
      if (!video) return;
      
      const videoPath = getVideoPath(video);
      if (!videoPath) return;
      
      if (!videoStates[videoPath]) {
        videoStates[videoPath] = {};
      }
      
      videoStates[videoPath] = {
        currentTime: video.currentTime || 0,
        paused: video.paused,
        muted: video.muted,
        wasPlaying: !video.paused,
        lastTimeUpdate: Date.now()
      };
      
      console.log(`Saved state for ${videoPath.split('/').pop()}: time=${video.currentTime.toFixed(2)}, playing=${!video.paused}`);
    }

    // Handle fullscreen change events
    function handleFullscreenChange() {
      if (!document.fullscreenElement && 
          !document.webkitFullscreenElement && 
          !document.mozFullScreenElement &&
          !document.msFullscreenElement) {
          
          console.log('Exited fullscreen mode');
          isFullscreenActive = false;
          
          // If we have a current fullscreen video, save its state
          if (currentPlayingVideo) {
              saveVideoState(currentPlayingVideo);
              // Don't pause the video when exiting fullscreen
              // This allows the video to continue playing in the grid
              currentPlayingVideo = null;
          }
      } else {
          // We entered fullscreen
          console.log('Entered fullscreen mode');
          isFullscreenActive = true;
      }
    }

    // Initialize Masonry layout for the video grid
    const grid = document.querySelector('.artists-grid');
    if (grid) {
      // Use imagesLoaded to handle videos and images properly
      imagesLoaded(grid, function() {
        // Create Masonry instance with simplified settings
        const masonry = new Masonry(grid, {
          itemSelector: '.video-item',
          columnWidth: '.grid-sizer',
          percentPosition: true,
          gutter: 12,
          fitWidth: true,
          transitionDuration: '0.4s'
        });
        
        // Force layout immediately
        masonry.layout();
        
        // Handle window resize
        window.addEventListener('resize', () => {
          masonry.layout();
        });
        
        // Recheck layout when videos load
        grid.querySelectorAll('video').forEach(video => {
          video.addEventListener('loadedmetadata', () => {
            masonry.layout();
          });
        });
      });
    }

    // Set up video hover and click functionality for all videos
    document.querySelectorAll('.video-item').forEach(function(item) {
      // Create fullscreen icon
      const fullscreenIcon = document.createElement('div');
      fullscreenIcon.className = 'video-fullscreen-icon';
      item.appendChild(fullscreenIcon);
      
      // Get the video element
      const videoEl = item.querySelector('video');
      if (!videoEl) return;
      
      // Set initial attributes
      videoEl.muted = true;
      videoEl.preload = 'metadata';
      videoEl.loop = true;
      
      // Mouse enter - start preview
      item.addEventListener('mouseenter', function() {
        videoEl.play().catch(e => console.log('Play on hover failed:', e));
      });
      
      // Mouse leave - stop preview if not in fullscreen
      item.addEventListener('mouseleave', function() {
        if (!document.fullscreenElement && 
            !document.webkitFullscreenElement && 
            !document.mozFullScreenElement &&
            !document.msFullscreenElement) {
            videoEl.pause();
            videoEl.currentTime = 0;
        }
      });
      
      // Click to fullscreen
      item.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Save current state
        saveVideoState(videoEl);
        currentPlayingVideo = videoEl;
        
        try {
          // First try to play video (to avoid autoplay issues in fullscreen)
          videoEl.play().then(() => {
            // Now request fullscreen
            isFullscreenActive = true;
            if (videoEl.requestFullscreen) {
              videoEl.requestFullscreen();
            } else if (videoEl.webkitRequestFullscreen) {
              videoEl.webkitRequestFullscreen();
            } else if (videoEl.msRequestFullscreen) {
              videoEl.msRequestFullscreen();
            } else if (videoEl.mozRequestFullScreen) {
              videoEl.mozRequestFullScreen();
            } else {
              console.warn('Fullscreen API not supported');
              isFullscreenActive = false;
            }
          }).catch(err => {
            console.error('Autoplay prevented, trying fullscreen anyway:', err);
            // Try fullscreen even if autoplay fails
            if (videoEl.requestFullscreen) {
              videoEl.requestFullscreen();
            } else if (videoEl.webkitRequestFullscreen) {
              videoEl.webkitRequestFullscreen();
            } else if (videoEl.mozRequestFullScreen) {
              videoEl.mozRequestFullScreen();
            } else if (videoEl.msRequestFullscreen) {
              videoEl.msRequestFullscreen();
            }
          });
        } catch (error) {
          console.error('Error entering fullscreen:', error);
        }
      });
      
      // Track time updates to maintain position state
      videoEl.addEventListener('timeupdate', () => {
        const videoPath = getVideoPath(videoEl);
        if (videoPath && (!videoStates[videoPath]?.lastTimeUpdate || 
            Date.now() - videoStates[videoPath].lastTimeUpdate > 1000)) {
            if (!videoStates[videoPath]) {
                videoStates[videoPath] = {};
            }
            
            videoStates[videoPath].currentTime = videoEl.currentTime;
            videoStates[videoPath].lastTimeUpdate = Date.now();
        }
      });
    });
    
    // Add fullscreen change event listeners for different browsers
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
    // Add fullscreen error handling
    document.addEventListener('fullscreenerror', (e) => {
      console.error('Fullscreen error:', e);
      isFullscreenActive = false;
    });
  });

  /**
   * Document ready event handlers
   * Initialize various UI interactions
   */
  $(document).ready(function() {
    // MENU - Close mobile menu when clicking nav items
    $('.navbar-collapse a').on('click', function() {
      $('.navbar-collapse').removeClass('show');
    });

    // CUSTOM LINK - Smooth scrolling for navigation
    $('.smoothscroll').on('click', function(event) {
      event.preventDefault();
      var targetId = $(this).attr('href');
      var targetElement = $(targetId);
      var headerHeight = $('.navbar').outerHeight();

      if (targetElement.length) {
        var targetPosition = targetElement.offset().top - headerHeight;
        $('html, body').animate({
          scrollTop: targetPosition
        }, 800);
      }
    });

    // Add tilting effect to the about image
    var aboutImage = $('.about-image');
    var aboutTextWrap = $('.about-text-wrap');

    if (aboutTextWrap.length && aboutImage.length) {
      aboutTextWrap.on('mousemove', function(e) {
        var rect = aboutTextWrap[0].getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        var deltaX = (x - centerX) / centerX;
        var deltaY = (y - centerY) / centerY;
        var rotateX = deltaY * 10; // Adjust the tilt intensity
        var rotateY = -deltaX * 10; // Adjust the tilt intensity
        aboutImage.css('transform', `perspective(1000px) translate3d(0,0,0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
      });

      aboutTextWrap.on('mouseleave', function() {
      aboutTextWrap.on('mouseleave', function() {
        aboutImage.css('transform', 'perspective(1000px) translate3d(0,0,0) rotateX(0) rotateY(0)');
      });
    }
    // Add scroll handler for navbar visibility
    $(window).on('scroll', function() {
      if ($(window).scrollTop() > 50) {
        $('.navbar').addClass('is-sticky').css('background-color', 'var(--dark-color)').css('opacity', '1');
        $('.navbar, .navbar-nav .nav-link, .navbar-brand, .social-icon-link, .wonderland-text').addClass('is-visible');
      } else {
        $('.navbar').removeClass('is-sticky').css('background-color', 'transparent').css('opacity', '0');
        $('.navbar, .navbar-nav .nav-link, .navbar-brand, .social-icon-link, .wonderland-text').removeClass('is-visible');
      }
    });

    // Form submission handling
    $('#ticketForm').on('submit', function(event) {
      event.preventDefault();
      // Add your form submission logic here
      alert('Form submitted!');
    });
  });
})(jQuery);
