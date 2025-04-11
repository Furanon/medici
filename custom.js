// Parallax effect variables
let lastScrollY = window.scrollY;
let ticking = false;
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

// Enhanced parallax animation
function updateParallax() {
    const tsParticles = document.getElementById('tsparticles');
    if (tsParticles) {
        const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
        const offset = Math.min(window.scrollY * 0.4, window.innerHeight * 0.4);
        const scale = 1.1 + (scrollPercent * 0.08);
        const opacity = Math.max(0.85, 1 - (scrollPercent * 0.25));
        
        requestAnimationFrame(() => {
            tsParticles.style.transform = `translate3d(0, ${offset}px, -100px) scale(${scale})`;
            tsParticles.style.opacity = opacity;
        });
    }
    ticking = false;
}

// Optimized scroll handler
const optimizedScroll = () => {
    if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
            scrollTimeout = null;
            requestAnimationFrame(() => {
                updateParallax();
                handleScrollAnimation();
            });
        }, Math.max(1000 / 60, 16));
    }
};

// Initialize everything when DOM is ready
document.addEventListener("DOMContentLoaded", function() {
    // Initialize tsParticles
    tsParticles.load("tsparticles", {
        fullScreen: {
            enable: false
        },
        style: {
            position: "fixed"
        },
        fps_limit: 60,
        background: {
            color: "transparent"
        },
        particles: {
            number: {
                value: 80,
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
                    speed: 0.2,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 2.5,
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    size_min: 0.5,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#ffffff",
                opacity: 0.2,
                width: 1
            },
            move: {
                enable: true,
                speed: 0.3,
                direction: "none",
                random: true,
                straight: false,
                out_mode: "out",
                bounce: false,
                attract: {
                    enable: true,
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
                    mode: "grab"
                },
                onclick: {
                    enable: true,
                    mode: "push"
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 0.4
                    }
                },
                push: {
                    particles_nb: 3
                }
            }
        },
        retina_detect: true
    }).then(() => {
        // Initialize parallax after particles are loaded
        updateParallax();
        
        // Set up initial styles
        const tsParticles = document.getElementById('tsparticles');
        if (tsParticles) {
            tsParticles.style.transition = 'transform 0.01s linear';
        }
        
        // Staged updates for reliability
        [100, 500, 1000].forEach(time => {
            setTimeout(updateParallax, time);
        });
    });

    // Set up event listeners
    window.addEventListener('scroll', optimizedScroll, { passive: true });
    window.addEventListener('resize', () => {
        if (resizeTimeout) clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateParallax, 50);
    }, { passive: true });

    // Initial animation check
    handleScrollAnimation();
});
