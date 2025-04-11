// Firefly effect variables
let rafId;
let scrollTimeout;
let resizeTimeout;

// Function to check if an element is in the viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Fade in elements as they enter the viewport
function handleScrollAnimation() {
    document.querySelectorAll(".navbar, .navbar-nav .nav-link, .navbar-brand, .social-icon-link, .wonderland-text").forEach(element => {
        if (isInViewport(element)) {
            element.classList.add("is-visible");
        }
    });
}

// Function to check if an element is actually visible (not just in viewport)
function isElementVisible(element) {
    if (!element) return false;
    
    const style = window.getComputedStyle(element);
    
    // Check basic visibility properties
    if (style.display === 'none') return false;
    if (style.visibility === 'hidden') return false;
    if (style.opacity === '0') return false;
    
    // Check dimensions
    const rect = element.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return false;
    
    // Check if element is in viewport
    const isInView = rect.top <= window.innerHeight && rect.bottom >= 0;
    
    // Check z-index stacking relative to other elements
    const zIndex = parseInt(style.zIndex, 10);
    
    return isInView;
}

// Variables for parallax effect
let lastScrollPosition = 0;
const parallaxFactor = 0.5; // Value between 0 and 1 (0 = fixed like background, 1 = full scroll like foreground)
let particlesElement = null; // Cached reference to particles element
let ticking = false; // For requestAnimationFrame
let scrollDebounceTimer = null; // For debouncing scroll events
let eventListenersInitialized = false; // Track if event listeners are initialized
let parallaxInitialized = false; // Track if parallax effect is successfully initialized
let parallaxInitError = null; // Track initialization errors

// Update the parallax position
function updateParallax() {
    const scrolled = window.pageYOffset || document.documentElement.scrollTop;
    
    if (particlesElement) {
        // Apply parallax effect - particles move at a fraction of the scroll speed
        // Negative value for translateY to move particles up when scrolling down (and vice versa)
        const parallaxOffset = scrolled * parallaxFactor;
        
        // Store previous transform for comparison
        const previousTransform = particlesElement.style.transform;
        
        // Pure vertical parallax without horizontal movement
        particlesElement.style.transform = `translateY(-${parallaxOffset}px)`;
        
        // Update data attribute for debugging
        particlesElement.setAttribute('data-parallax-offset', parallaxOffset);
        particlesElement.setAttribute('data-scroll-position', scrolled);
        
        // Verify transform was actually applied by comparing with previous value
        const currentTransform = particlesElement.style.transform;
        const transformChanged = previousTransform !== currentTransform;
        
        // Debug logging (less frequent)
        if (scrolled % 50 === 0 || transformChanged) {
            console.log(`Parallax: scroll=${scrolled}, offset=${parallaxOffset}, transform=${currentTransform}, changed=${transformChanged}`);
            
            // Check container bounds after transform
            const rect = particlesElement.getBoundingClientRect();
            console.log('Container position after transform:', {
                top: rect.top,
                left: rect.left,
                transform: currentTransform,
                visible: rect.top <= window.innerHeight && rect.bottom >= 0
            });
            
            // Check computed transform
            const computedStyle = window.getComputedStyle(particlesElement);
            console.log('Computed transform:', computedStyle.transform);
        }
    } else {
        console.warn('Particles element not found during parallax update.');
    }
    
    ticking = false;
    lastScrollPosition = scrolled;
}

// Cleanup function to prevent memory leaks
function cleanupParallaxEffect() {
    // Clear all timers and animation frames
    if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
    }
    
    if (scrollDebounceTimer) {
        clearTimeout(scrollDebounceTimer);
        scrollDebounceTimer = null;
    }
    
    if (resizeTimeout) {
        clearTimeout(resizeTimeout);
        resizeTimeout = null;
    }
    
    // Remove event listeners if they were initialized
    if (eventListenersInitialized) {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
        eventListenersInitialized = false;
    }
    
    // Reset variables
    lastScrollPosition = 0;
    ticking = false;
    
    // Remove transitions and transformations from particle element
    if (particlesElement) {
        particlesElement.style.transition = '';
        particlesElement.style.transform = '';
        particlesElement.style.willChange = '';
    }
    
    console.log('Parallax effect cleaned up.');
}

// Combined optimized scroll handler with debouncing
function handleScroll() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    
    // Clear any existing debounce timer
    if (scrollDebounceTimer) {
        clearTimeout(scrollDebounceTimer);
    }
    
    // Handle scroll animations immediately 
    handleScrollAnimation();
    
    // Log scroll position for debugging (but not too frequently)
    if (currentScroll % 20 === 0) {
        console.log(`Scroll position: ${currentScroll}, lastPosition: ${lastScrollPosition}, delta: ${currentScroll - lastScrollPosition}`);
    }
    
    // Only update parallax if we've scrolled and not currently processing a frame
    if (!ticking && Math.abs(currentScroll - lastScrollPosition) > 0) {
        ticking = true;
        
        // Handle particle parallax with requestAnimationFrame for smooth performance
        requestAnimationFrame(updateParallax);
    }
    
    // Debounce final update to ensure everything is in the right place after scrolling stops
    scrollDebounceTimer = setTimeout(() => {
        requestAnimationFrame(updateParallax);
    }, 50);
}

// Resize handler function
function handleResize() {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        handleScrollAnimation();
        
        // Recalculate parallax positioning on resize
        const scrolled = window.pageYOffset || document.documentElement.scrollTop;
        lastScrollPosition = scrolled;
        
        if (particlesElement) {
            const parallaxOffset = scrolled * parallaxFactor;
            particlesElement.style.transform = `translateY(-${parallaxOffset}px)`;
        }
    }, 50);
}

document.addEventListener("DOMContentLoaded", function() {
    // Initialize tsParticles with firefly effect
    tsParticles.load("tsparticles", {
        fullScreen: {
            enable: false
        },
        fpsLimit: 60,
        // Container settings will be applied after initialization
        responsive: [
            {
                maxWidth: 4000,
                options: {
                    particles: {
                        number: {
                            value: 25
                        }
                    }
                }
            }
        ],
        // Canvas positioning
        canvas: {
            resize: true,
            position: "fixed"
        },
        // Allow particles' own movement animation while container moves with parallax
        particles: {
            move: {
                enable: true, // Allow subtle internal movement
                speed: 0.1, // Very low speed for subtle movement
                direction: "none",
                random: true,
                straight: false,
                outMode: "out"
            },
            number: {
                value: 25, // Slightly fewer particles
                density: {
                    enable: true,
                    value_area: 1200 // Increased area for better distribution
                }
            },
            color: {
                value: ["#ffeb3b", "#ffd700", "#fff4b5", "#ffe082", "#ffecb3"] // Added more warm variations
            },
            shape: {
                type: "circle"
            },
            opacity: {
                value: 0.7,
                random: true,
                anim: {
                    enable: true,
                    speed: 0.15, // Slower opacity animation
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 4,
                random: true,
                anim: {
                    enable: true,
                    speed: 0.3, // Slower size animation
                    size_min: 1,
                    sync: false
                }
            },
            line_linked: {
                enable: false
            },
            life: {
                duration: {
                    sync: false,
                    value: 5 // Longer life duration
                },
                count: 1,
                delay: {
                    random: {
                        enable: true,
                        minimumValue: 0.5
                    },
                    value: 1
                }
            }
        },
        interactivity: {
            detect_on: "window", // Use window instead of canvas for better interaction
            events: {
                onhover: {
                    enable: true,
                    mode: "bubble",
                    parallax: {
                        enable: false // Disable built-in parallax
                    }
                },
                onclick: {
                    enable: true,
                    mode: "push"
                },
                resize: true
            },
            modes: {
                bubble: {
                    distance: 250,
                    size: 6,
                    duration: 0.5,
                    opacity: 0.9,
                    speed: 2
                },
                push: {
                    particles_nb: 1 // Fewer particles added on click
                }
            }
        },
        retina_detect: true,
        background: {
            color: "transparent"
        },
        // Setup for smooth parallax movement
        pauseOnBlur: false,
        detectRetina: true,
        smooth: true
    }).then(container => {
        // Get the container element right after initialization
        particlesElement = document.getElementById('tsparticles');
        
        if (!particlesElement) {
            console.error('Particles container not found after initialization');
            return;
        }
        
        // Apply all critical styles directly to the container
        particlesElement.style.position = 'fixed';
        particlesElement.style.top = '0';
        particlesElement.style.left = '0';
        particlesElement.style.width = '100%'; 
        particlesElement.style.height = '100%';
        particlesElement.style.zIndex = '2';
        particlesElement.style.pointerEvents = 'none';
        particlesElement.style.transformStyle = 'preserve-3d';
        particlesElement.style.backfaceVisibility = 'hidden';
        particlesElement.style.willChange = 'transform';
        particlesElement.style.transition = 'transform 0.05s linear';
        particlesElement.style.transformOrigin = 'top left';
        
        // Log the styles to verify they're applied correctly
        console.log('Verifying container styles:', {
            position: window.getComputedStyle(particlesElement).position,
            top: window.getComputedStyle(particlesElement).top,
            left: window.getComputedStyle(particlesElement).left,
            width: window.getComputedStyle(particlesElement).width,
            height: window.getComputedStyle(particlesElement).height,
            zIndex: window.getComputedStyle(particlesElement).zIndex
        });
        
        // Add custom class for CSS targeting
        particlesElement.classList.add("parallax-particles");
        
        // Get the canvas element directly
        const canvasElement = container.canvas.element;
        if (canvasElement) {
            canvasElement.classList.add("parallax-canvas");
            
            // Critical canvas styles
            canvasElement.style.position = "absolute";
            canvasElement.style.top = "0";
            canvasElement.style.left = "0";
            canvasElement.style.width = "100%";
            canvasElement.style.height = "100%";
            canvasElement.style.transform = "none"; // Remove any transforms on the canvas
            canvasElement.style.willChange = "inherit"; // Inherit willChange from container
            
            // Ensure the canvas matches the viewport size
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            canvasElement.width = windowWidth;
            canvasElement.height = windowHeight;
            
            console.log("Canvas element configured:", {
                width: canvasElement.width,
                height: canvasElement.height,
                style: {
                    position: canvasElement.style.position,
                    top: canvasElement.style.top,
                    left: canvasElement.style.left,
                    width: canvasElement.style.width,
                    height: canvasElement.style.height
                }
            });
        }
        
        // Apply initial parallax based on current scroll position
        const scrolled = window.pageYOffset || document.documentElement.scrollTop;
        const parallaxOffset = scrolled * parallaxFactor;
        particlesElement.style.transform = `translateY(-${parallaxOffset}px)`;
        
        // Set data attributes for debugging
        particlesElement.setAttribute('data-parallax-offset', parallaxOffset);
        particlesElement.setAttribute('data-scroll-position', scrolled);
        
        // Force immediate scroll handler to update position
        handleScroll();
        
        // Explicitly run updateParallax to ensure transform is applied
        updateParallax();
        
        // Add simple transform test to verify the element responds to transforms
        console.log('Running transform verification test...');
        
        // Store current transform for restoration
        const currentTransform = particlesElement.style.transform;
        
        // Test applying a direct transform and checking if it works
        setTimeout(() => {
            console.log('Applying test transform...');
            particlesElement.style.transform = 'translateY(-200px)';
            
            // Verify the transform was applied
            setTimeout(() => {
                const appliedTransform = particlesElement.style.transform;
                const computedTransform = window.getComputedStyle(particlesElement).transform;
                
                console.log('Transform test results:', {
                    appliedTransform: appliedTransform,
                    computedTransform: computedTransform,
                    success: appliedTransform === 'translateY(-200px)',
                    computedSuccess: computedTransform !== 'none'
                });
                
                // Reset to original transform
                setTimeout(() => {
                    particlesElement.style.transform = currentTransform;
                    console.log('Restored original transform:', currentTransform);
                    
                    // Immediately verify scroll response
                    window.scrollBy(0, 10);
                    setTimeout(() => {
                        window.scrollBy(0, -10);
                        console.log('Scroll test completed - check console for scroll updates');
                    }, 300);
                }, 300);
            }, 100);
        }, 1000);
        
        // Mark parallax as successfully initialized
        parallaxInitialized = true;
        
        console.log('Parallax effect initialized in tsParticles promise resolution');
        
        // Add a more visible message to the console
        console.log('%c ✨ PARALLAX INITIALIZED SUCCESSFULLY ✨ ', 
                     'background: linear-gradient(45deg, #FF5722, #FF9800); color: white; font-size: 16px; padding: 10px; border-radius: 4px;');
        console.log('%c Scroll down to see particles move at 50% of scroll speed ', 
                     'background: #ffd700; color: black; font-size: 14px; padding: 5px;');
        const isVisible = isElementVisible(particlesElement);
        const rect = particlesElement.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(particlesElement);
        
        console.log('Container visibility check:', {
            isVisible: isVisible,
            inViewport: rect.top <= window.innerHeight && rect.bottom >= 0,
            dimensions: {
                width: rect.width,
                height: rect.height,
                top: rect.top,
                left: rect.left
            },
            styles: {
                display: computedStyle.display,
                visibility: computedStyle.visibility,
                opacity: computedStyle.opacity,
                position: computedStyle.position,
                zIndex: computedStyle.zIndex,
                transform: computedStyle.transform
            }
        });
    });
    
    // Add event listeners and mark as initialized
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    eventListenersInitialized = true;
    
    // Set up cleanup on page unload
    window.addEventListener('beforeunload', cleanupParallaxEffect);

    // Initial animation check
    handleScrollAnimation();
    
    // Add debug log to track initialization
    console.log('Starting parallax initialization...');
    
    // Initialize parallax effect with error handling
    // The initialization has moved to the tsParticles.load() promise resolution,
    // so we just need to handle errors if they occur
    try {
        // If particlesElement is not initialized, check if initialization was successful
        if (!parallaxInitialized) {
            setTimeout(() => {
                if (!particlesElement) {
                    // Final check to see if particles element exists
                    particlesElement = document.getElementById('tsparticles');
                    
                    if (particlesElement) {
                        console.log('Particles element found in final check');
                        
                        // Force immediate scroll handler execution
                        handleScroll();
                        
                        // Mark as initialized
                        parallaxInitialized = true;
                    } else {
                        console.warn('Particles element not found after all checks. Parallax effect will not be applied.');
                        parallaxInitError = new Error('Particles element not found');
                    }
                }
            }, 500); // Give more time for initialization
        }
    } catch (error) {
        console.error('Error initializing parallax effect:', error);
        console.error('Error stack:', error.stack);
        console.error('Error type:', error.name);
        console.error('Error message:', error.message);
        
        // Log specific error types
        if (error instanceof TypeError) {
            console.error('Type error detected - likely an issue with DOM element access');
        } else if (error instanceof ReferenceError) {
            console.error('Reference error detected - likely an undefined variable');
        }
        
        // Attempt cleanup if initialization fails
        cleanupParallaxEffect();
    }

    // Add an error handler for tsParticles container
    setTimeout(() => {
        // Check both initialization state and particles element
        if (!parallaxInitialized) {
            console.error('Parallax initialization failed:', parallaxInitError || 'Unknown error');
            return;
        }
        
        if (particlesElement) {
            particlesElement.addEventListener('error', () => {
                console.error('Error in tsParticles container');
                cleanupParallaxEffect();
            });
            
            // Add a debug message to console
            console.log('Parallax container ready and monitoring for errors');
            
            // Final verification of transform behavior
            const currentTransform = particlesElement.style.transform;
            const scrolled = window.pageYOffset || document.documentElement.scrollTop;
            const expectedOffset = scrolled * parallaxFactor;
            const expectedTransform = `translateY(-${expectedOffset}px)`;
            
            console.log('Final transform verification:', {
                currentTransform: currentTransform,
                expectedTransform: expectedTransform,
                match: currentTransform === expectedTransform,
                scrollPosition: scrolled,
                calculatedOffset: expectedOffset,
                parallaxFactor: parallaxFactor
            });
            // Force a scroll check to ensure transform is applied and log the outcome
            handleScroll();
            updateParallax(); // Directly call for immediate effect
            
            // Create a visible debug message to confirm parallax is running
            console.log('%c ✅ PARALLAX IS ACTIVE: TRY SCROLLING NOW ✅ ', 
                         'background: linear-gradient(45deg, #4CAF50, #8BC34A); color: white; font-size: 16px; padding: 10px; border-radius: 4px; font-weight: bold;');
            
            // Add scroll hint
            console.log('%c Tip: The particles layer should move up at 50% of normal scroll speed ', 
                         'font-style: italic; color: #666; padding: 5px;');
            
            // Uncomment to add a debug indicator overlay
            /*
            const debugIndicator = document.createElement('div');
            debugIndicator.style.position = 'fixed';
            debugIndicator.style.bottom = '10px';
            debugIndicator.style.right = '10px';
            debugIndicator.style.background = 'rgba(255,215,0,0.7)';
            debugIndicator.style.color = 'black';
            debugIndicator.style.padding = '5px';
            debugIndicator.style.borderRadius = '3px';
            debugIndicator.style.fontSize = '12px';
            debugIndicator.style.zIndex = '9999';
            debugIndicator.textContent = 'Parallax Active: ' + parallaxFactor;
            document.body.appendChild(debugIndicator);
            */
        } else {
            console.error('Unable to test transform - particles element not found');
        }
    }, 300);
});
