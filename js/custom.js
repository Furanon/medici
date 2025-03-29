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

    // Open gallery modal on click
    $('#open-gallery').on('click', function() {
      var galleryModal = new bootstrap.Modal($('#photoGalleryModal')[0]);
      galleryModal.show();
    });

    // Open ticket form modal on click
    $('#open-ticket-form').on('click', function() {
      var ticketFormModal = new bootstrap.Modal($('#ticketFormModal')[0]);
      ticketFormModal.show();
    });

    // Open ticket form modal on fundraiser button click
    $('#fundraiser-button').on('click', function() {
      var ticketFormModal = new bootstrap.Modal($('#ticketFormModal')[0]);
      ticketFormModal.show();
    });

    // Sticky navbar functionality
    $(window).on('scroll', function() {
      if ($(window).scrollTop() > 50) {
        $('.navbar').addClass('is-sticky').css('background-color', 'rgba(248, 203, 46, 0.4)').css('opacity', '1');
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

    // Handle image click to show in modal
    $('.artists-image').on('click', function() {
      var slideTo = $(this).data('bs-slide-to');
      $('#carouselExampleControls').carousel(slideTo);
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
        bg.style.transform = 'translateX(' + x + 'px ) translateY(' + y + 'px)';
    });
  });
})(jQuery);





