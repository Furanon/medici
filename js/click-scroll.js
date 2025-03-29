//jquery-click-scroll
//by syamsul'isul' Arifin

var sectionArray = [1, 2, 3, 4, 5, 6];

$.each(sectionArray, function(index, value){
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

    $('.click-scroll').eq(index).click(function(e){
        var targetElement = $('#section_' + value);
        if (targetElement.length) {
            var offsetClick = targetElement.offset().top - $('.navbar').outerHeight();
            e.preventDefault();
            $('html, body').animate({
                scrollTop: offsetClick
            }, 200); // Increase scroll speed by reducing duration to 200ms
        }
    });
});

$(document).ready(function(){
    $('.navbar-nav .nav-item .nav-link').removeClass('active');
    $('.navbar-nav .nav-item .nav-link').eq(0).addClass('active');

    document.querySelectorAll('.click-scroll').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    $(window).on('scroll', function() {
        var scrollPos = $(document).scrollTop();
        $('.click-scroll').each(function() {
            var currLink = $(this);
            var refElement = $(currLink.attr("href"));
            if (refElement.position().top - $('.navbar').outerHeight() <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
                $('.navbar-nav .nav-item .nav-link').removeClass("active");
                currLink.addClass("active");
            }
            else{
                currLink.removeClass("active");
            }
        });
    });
});