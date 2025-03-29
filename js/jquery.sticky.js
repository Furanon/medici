// Sticky Plugin v1.0.3 for jQuery
// =============
// Author: Anthony Garand
// Improvements by German M. Bravo (Kronuz) and Ruud Kamphuis (ruudk)
// Improvements by Leonardo C. Daronco (daronco)
// Created: 02/14/2011
// Date: 07/20/2015
// Website: http://stickyjs.com/
// Description: Makes an element on the page stick on the screen as you scroll
//              It will only set the 'top' and 'position' of your element, you
//              might need to adjust the width in some cases.

(function($) {
    $.fn.sticky = function(options) {
        var settings = $.extend({
            topSpacing: 0,
            zIndex: '',
            stopper: null
        }, options);

        return this.each(function() {
            var $this = $(this);
            var $window = $(window);
            var $stopper = $(settings.stopper);
            var stickyTop = $this.offset().top;
            var stickyHeight = $this.outerHeight();
            var stopperTop = $stopper.length ? $stopper.offset().top : 0;

            $window.on('scroll', function() {
                var windowTop = $window.scrollTop();

                if (windowTop > stickyTop - settings.topSpacing) {
                    $this.css({
                        position: 'fixed',
                        top: settings.topSpacing,
                        zIndex: settings.zIndex
                    });

                    if ($stopper.length && windowTop + stickyHeight > stopperTop) {
                        $this.css({
                            top: stopperTop - windowTop - stickyHeight + settings.topSpacing
                        });
                    }
                } else {
                    $this.css({
                        position: 'static',
                        top: 'auto',
                        zIndex: ''
                    });
                }
            });
        });
    };
})(jQuery);

$(document).ready(function() {
    if ($.fn.sticky) {
      $('.navbar').sticky({
        topSpacing: 0,
        zIndex: 9999
      });
    } else {
      console.error("Sticky plugin is not loaded.");
    }
});