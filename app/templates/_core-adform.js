/* global window, jQuery */
(function ($, window) {
    'use strict';

    var _clickHandler = $.noop,
        $body = $('body')<% if(close || isResponsive) { %>,
        $content = $('#content')<% } %>;

    var clickTAGvalue = dhtml.getVar('clickTAG', 'http://www.example.com');//banner will receive clickTAG value - if not defined, banner will land to example.com
    var landingpagetarget = dhtml.getVar('landingPageTarget', '_blank');//landingPageTarget variable enables to change target from Adform system.

    _clickHandler = function(e) {
        e.preventDefault();

        window.open(clickTAGvalue, landingpagetarget); //when banner is clicked it will open new window directing to clickTAG value
    };

    $body<% if(close) { %>
        .on('click', '.close', function(e) {
            e.stopPropagation();

            // Trigger an event to notify subscribers that the ad was closed
            $content.addClass('hidden').trigger('html5Banner:close');
        })<% } %>
        .on('click', '#content', _clickHandler)
    ;
<% if(isResponsive) { %>
    // enable adform "responsivness"
    if (dhtml.external && dhtml.external.resize) {
        dhtml.external.resize ('100%', '100%');
    }

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
