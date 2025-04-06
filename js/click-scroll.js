//jquery-click-scroll
//by syamsul'isul' Arifin

var sectionArray = [1, 2, 3, 4, 5, 6];

$.each(sectionArray, function(index, value){
    // Track section visibility for nav highlighting
    $(document).scroll(function(){
        var targetElement = $('#section_' + value);
        if (targetElement.length) {
            var offsetSection = targetElement.offset().top - $('.navbar').outerHeight();
            var docScroll = $(document).scrollTop();
            var docScroll1 = docScroll + 1;

            if (docScroll1 >= offsetSection && docScroll1 < offsetSection + targetElement.outerHeight()) {
                $('.navbar-nav .nav-item .nav-link').removeClass('active');
                $('.navbar-nav .nav-item .nav-link').eq(index).addClass('active');
            }
        }
    });

    // Handle click events for smooth scrolling
    $('.click-scroll').eq(index).click(function(e){
        var href = $(this).attr('href');
        
        // Only handle internal section links
        if (href && href.startsWith('#')) {
            var targetElement = $(href);
            if (targetElement.length) {
                e.preventDefault();
                var offsetClick = targetElement.offset().top - $('.navbar').outerHeight();
                $('html, body').animate({
                    scrollTop: offsetClick
                }, 200);
            }
        }
        // External links (like ticket.html) behave normally
    });
});

// Initialize active state on page load
$(document).ready(function(){
    $('.navbar-nav .nav-item .nav-link').removeClass('active');
    $('.navbar-nav .nav-item .nav-link').eq(0).addClass('active');
});
