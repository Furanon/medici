(function ($) {
  "use strict";

  $(document).ready(function() {
    // MENU
    $('.navbar-collapse a').on('click', function() {
      $('.navbar-collapse').removeClass('show');
    });

    // CUSTOM LINK
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

    // Ensure the map tab is working correctly
    $('#nav-ContactMap-tab').on('shown.bs.tab', function() {
      $(window).trigger('resize');
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

        aboutImage.css('transform', `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
      });

      aboutTextWrap.on('mouseleave', function() {
        aboutImage.css('transform', 'rotateX(0) rotateY(0)');
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

    $('#ticketForm').on('submit', function(event) {
      event.preventDefault();
      // Add your form submission logic here
      alert('Form submitted!');
    });

    /*/ Add hover effect to navbar logo when "Home" section is active
    $(document).scroll(function() {
      var homeSection = $('#section_1');
      if (homeSection.length) {
        var offsetSection = homeSection.offset().top - 83;
        var docScroll = $(document).scrollTop();
        var docScroll1 = docScroll + 1;

        if (docScroll1 >= offsetSection && docScroll1 < offsetSection + homeSection.outerHeight()) {
          $('.navbar-nav .nav-link img').css('filter', 'brightness(1.2) sepia(1) hue-rotate(90deg) saturate(5)');
        } else {
          $('.navbar-nav .nav-link img').css('filter', 'none');
        }
      }
    }); */

    // Initialize all Bootstrap components
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize gallery modal only
        var galleryModal = document.getElementById('imageModal');
        if (galleryModal) {
            new bootstrap.Modal(galleryModal);
        }

        // Initialize carousel with proper settings using native Bootstrap 5
        var galleryCarousel = new bootstrap.Carousel(document.getElementById('carouselGallery'), {
            interval: false,
            keyboard: true
        });

        // Handle image and video click to show in modal with vanilla JS
        document.querySelectorAll('.artists-image, .video-item').forEach(function(item) {
            item.addEventListener('click', function() {
                var slideTo = this.getAttribute('data-bs-slide-to');
                var modal = new bootstrap.Modal(document.getElementById('imageModal'));
                modal.show();
                galleryCarousel.to(parseInt(slideTo));
            });
        });

        // Handle modal opening for videos with vanilla JS
        document.getElementById('imageModal').addEventListener('shown.bs.modal', function() {
            var activeItem = this.querySelector('.carousel-item.active');
            if (activeItem.getAttribute('data-media-type') === 'video') {
                var video = activeItem.querySelector('video');
                if (video) {
                    video.play();
                }
            }
        });

        // Pause videos when modal is closed with vanilla JS
        document.getElementById('imageModal').addEventListener('hide.bs.modal', function() {
            var videos = this.querySelectorAll('video');
            videos.forEach(function(video) {
                video.pause();
                video.currentTime = 0;
            });
        });

        // Handle transitions between slides
        document.getElementById('carouselGallery').addEventListener('slide.bs.carousel', function(e) {
            // Pause all videos and reset them to beginning
            var videos = this.querySelectorAll('video');
            videos.forEach(function(video) {
                video.pause();
                video.currentTime = 0;
            });
        });

        // After slide transition completes
        document.getElementById('carouselGallery').addEventListener('slid.bs.carousel', function() {
            var activeItem = this.querySelector('.carousel-item.active');
            if (activeItem.getAttribute('data-media-type') === 'video') {
                var video = activeItem.querySelector('video');
                if (video) {
                    video.play();
                }
            }
        });

        // Video control buttons
        document.querySelectorAll('.video-control-btn').forEach(function(button) {
            button.addEventListener('click', function() {
                var action = this.getAttribute('data-action');
                var carouselItem = this.closest('.carousel-item');
                var video = carouselItem.querySelector('video');
                
                if (!video) return;
                
                switch(action) {
                    case 'play':
                        video.play();
                        break;
                    case 'pause':
                        video.pause();
                        break;
                    case 'mute':
                        video.muted = !video.muted;
                        var icon = this.querySelector('i');
                        if (video.muted) {
                            icon.classList.remove('bi-volume-up-fill');
                            icon.classList.add('bi-volume-mute-fill');
                        } else {
                            icon.classList.remove('bi-volume-mute-fill');
                            icon.classList.add('bi-volume-up-fill');
                        }
                        break;
                }
            });
        });

        // Handle keyboard controls for videos
        document.addEventListener('keydown', function(e) {
            var modal = document.getElementById('imageModal');
            if (!modal.classList.contains('show')) return;
            
            var activeSlide = document.querySelector('#carouselGallery .carousel-item.active');
            if (activeSlide.getAttribute('data-media-type') !== 'video') return;
            
            var video = activeSlide.querySelector('video');
            if (!video) return;
            
            switch(e.key.toLowerCase()) {
                case ' ':  // Space bar
                    e.preventDefault();
                    video.paused ? video.play() : video.pause();
                    break;
                case 'm':  // Mute toggle
                    video.muted = !video.muted;
                    var muteButton = activeSlide.querySelector('[data-action="mute"] i');
                    muteButton.classList.toggle('bi-volume-up-fill');
                    muteButton.classList.toggle('bi-volume-mute-fill');
                    break;
            }
        });
    });

    // All event handlers have been moved into the DOMContentLoaded event listener above

    // Add hover-to-preview functionality for video items in the artists grid
    document.querySelectorAll('.video-item').forEach(function(item) {
        // Create overlay elements for play/pause indicators
        var overlayEl = document.createElement('div');
        overlayEl.className = 'video-preview-overlay';
        
        var iconEl = document.createElement('i');
        iconEl.className = 'bi bi-play-circle-fill preview-icon';
        overlayEl.appendChild(iconEl);
        
        item.appendChild(overlayEl);
        
        // Get the video element within the item
        var videoEl = item.querySelector('video');
        if (!videoEl) return; // Skip if no video element found
        
        // Set initial attributes
        videoEl.muted = true;
        videoEl.preload = 'metadata';
        videoEl.loop = true;
        
        // Mouse enter - start preview
        item.addEventListener('mouseenter', function() {
            videoEl.play();
            iconEl.classList.remove('bi-play-circle-fill');
            iconEl.classList.add('bi-pause-circle-fill');
            overlayEl.classList.add('playing');
        });
        
        // Mouse leave - stop preview
        item.addEventListener('mouseleave', function() {
            videoEl.pause();
            videoEl.currentTime = 0;
            iconEl.classList.remove('bi-pause-circle-fill');
            iconEl.classList.add('bi-play-circle-fill');
            overlayEl.classList.remove('playing');
        });
        
        // Toggle play/pause on overlay click
        overlayEl.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent triggering the modal
            
            if (videoEl.paused) {
                videoEl.play();
                iconEl.classList.remove('bi-play-circle-fill');
                iconEl.classList.add('bi-pause-circle-fill');
                overlayEl.classList.add('playing');
            } else {
                videoEl.pause();
                iconEl.classList.remove('bi-pause-circle-fill');
                iconEl.classList.add('bi-play-circle-fill');
                overlayEl.classList.remove('playing');
            }
        });
    });

    // News slider functionality
    var bg = document.querySelector('.item-bg');
    var items = document.querySelectorAll('.news__item');
    var item = document.querySelector('.news__item');

    function cLog(content) {
        console.log(content)
    }

    if($(window).width() > 800) {
        $(document).on("mouseover", ".news__item", function (_event, _element) {

            var newsItem = document.querySelectorAll('.news__item');
            newsItem.forEach(function (element, index) {
                element.addEventListener('mouseover', function () {
                    var x = this.getBoundingClientRect().left;
                    var y = this.getBoundingClientRect().top;
                    var width = this.getBoundingClientRect().width;
                    var height = this.getBoundingClientRect().height;

                    $('.item-bg').addClass('active');
                    $('.news__item').removeClass('active');

                    bg.style.width = width + 'px';
                    bg.style.height = height + 'px';
                    bg.style.transform = 'translateX(' + x + 'px ) translateY(' + y + 'px)';
                });

                element.addEventListener('mouseleave', function () {
                    $('.item-bg').removeClass('active');
                    $('.news__item').removeClass('active');
                });

            });

        });
    }

    var swiper = new Swiper('.news-slider', {
        effect: 'coverflow',
        grabCursor: true,
        loop: true,
        centeredSlides: true,
        keyboard: true,
        spaceBetween: 0,
        slidesPerView: 'auto',
        speed: 300,
        coverflowEffect: {
            rotate: 0,
            stretch: 0,
            depth: 0,
            modifier: 3,
            slideShadows: false
        },
        breakpoints: {
            480: {
                spaceBetween: 0,
                centeredSlides: true
            }
        },
        simulateTouch: true,
        navigation: {
            nextEl: '.news-slider-next',
            prevEl: '.news-slider-prev'
        },
        pagination: {
            el: '.news-slider__pagination',
            clickable: true
        },
        on: {
            init: function () {
                var activeItem = document.querySelector('.swiper-slide-active');

                var sliderItem = activeItem.querySelector('.news__item');

                $('.swiper-slide-active .news__item').addClass('active');

                var x = sliderItem.getBoundingClientRect().left;
                var y = sliderItem.getBoundingClientRect().top;
                var width = sliderItem.getBoundingClientRect().width;
                var height = sliderItem.getBoundingClientRect().height;

                $('.item-bg').addClass('active');

                bg.style.width = width + 'px';
                bg.style.height = height + 'px';
                bg.style.transform = 'translateX(' + x + 'px ) translateY(' + y + 'px)';
            }
        }
    });

    swiper.on('touchEnd', function () {
        $('.news__item').removeClass('active');
        $('.swiper-slide-active .news__item').addClass('active');
    });

    swiper.on('slideChange', function () {
        $('.news__item').removeClass('active');
    });

    swiper.on('slideChangeTransitionEnd', function () {
        $('.news__item').removeClass('active');
        var activeItem = document.querySelector('.swiper-slide-active');

        var sliderItem = activeItem.querySelector('.news__item');

        $('.swiper-slide-active .news__item').addClass('active');

        var x = sliderItem.getBoundingClientRect().left;
        var y = sliderItem.getBoundingClientRect().top;
        var width = sliderItem.getBoundingClientRect().width;
        var height = sliderItem.getBoundingClientRect().height;

        $('.item-bg').addClass('active');

        bg.style.width = width + 'px';
        bg.style.height = height + 'px';
        bg.style.height = height + 'px';
        bg.style.transform = 'translateX(' + x + 'px ) translateY(' + y + 'px)';
    });

    // Initialize Masonry
    var $grid = $('.artists-grid').masonry({
      itemSelector: '.video-item',
      columnWidth: '.grid-sizer',
      fitWidth: true,
      percentPosition: true,
      gutter: 16
    });

    // Re-layout Masonry when images are loaded
    $grid.imagesLoaded().progress(function() {
      $grid.masonry('layout');
    });

    // Re-layout Masonry on window resize (with debounce)
    var resizeTimer;
    $(window).on('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        $grid.masonry('layout');
      }, 250);
    });
  });
})(jQuery);





