document.addEventListener("DOMContentLoaded", function() {
    // Initialize tsParticles for star background
    tsParticles.load("tsparticles", {
        fps_limit: 60,
        background: {
            color: "transparent" // Transparent background to let gradient show through
        },
        particles: {
            number: {
                value: 80, // Moderate number of particles
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: "#ffffff" // White stars
            },
            shape: {
                type: "circle"
            },
            opacity: {
                value: 0.5, // Semi-transparent
                random: true,
                anim: {
                    enable: true,
                    speed: 0.2,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 2.5, // Small particles
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
                distance: 150, // Distance for connecting stars
                color: "#ffffff",
                opacity: 0.2, // Very subtle connections
                width: 1
            },
            move: {
                enable: true,
                speed: 0.3, // Slow, gentle movement
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
                    mode: "grab" // Connect nearby particles on hover
                },
                onclick: {
                    enable: true,
                    mode: "push" // Add particles on click
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 0.4 // Slightly more visible connections on hover
                    }
                },
                push: {
                    particles_nb: 3 // Add 3 particles on click
                }
            }
        },
        retina_detect: true
    });

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

    // Initial check on page load
    handleScrollAnimation();

    // Check on scroll
    window.addEventListener("scroll", handleScrollAnimation);
});
