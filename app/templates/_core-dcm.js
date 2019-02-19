/* global window, jQuery, Enabler */
(function ($, window) {
    'use strict';

    var $body = $('body')<% if(isResponsive) { %>,
        $content = $('#content')<% } %>;

    $body.on('click', '#content', function(e) {
        e.preventDefault();

        Enabler.exit('Background Exit');
    })
    ;
<% if(isResponsive) { %>
    (function() {
        // Force a redraw so that the elements height/width get recalculated properly
        var resizeTimer;

        $(window).on('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                $content.hide().show(0);
            }, 250);
        });
    })();
<% } %>
})(jQuery, window);
