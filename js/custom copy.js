(function () {
  "use strict";

  $(document).ready(function() {
    // MENU
    $('.navbar-collapse a').on('click', function() {
      $(".navbar-collapse").collapse('hide');
    });

    // CUSTOM LINK
    $('.smoothscroll').click(function(event) {
      event.preventDefault();
      var targetId = $(this).attr('href');
      var targetElement = $(targetId);
      var headerHeight = $('.navbar').height();

      if (targetElement.length) {
        var targetPosition = targetElement.offset().top - headerHeight;
        $('html, body').animate({
          scrollTop: targetPosition
        }, 800); // Adjusted scroll speed to 800ms
      }
    });

    // Ensure the map tab is working correctly
    $('#nav-ContactMap-tab').on('shown.bs.tab', function() {
      window.dispatchEvent(new Event('resize'));
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
      var galleryModal = new bootstrap.Modal(document.getElementById('photoGalleryModal'));
      galleryModal.show();
    });

    // Open ticket form modal on click
    $('#open-ticket-form').on('click', function() {
      var ticketFormModal = new bootstrap.Modal(document.getElementById('ticketFormModal'));
      ticketFormModal.show();
    });

    // Open ticket form modal on fundraiser button click
    $('#fundraiser-button').on('click', function() {
      var ticketFormModal = new bootstrap.Modal(document.getElementById('ticketFormModal'));
      ticketFormModal.show();
    });

    // Sticky navbar functionality
    $(window).on('scroll', function() {
      if ($(window).scrollTop() > 50) {
        $('.navbar').addClass('is-sticky');
      } else {
        $('.navbar').removeClass('is-sticky');
      }
    });

    $('#ticketForm').on('submit', function(event) {
      event.preventDefault();
      // Add your form submission logic here
      alert('Form submitted!');
    });
  });
})();





