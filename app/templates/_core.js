/* global window */
(function($, window) {
    'use strict';

    var urlParams,
        $body = $('body')<% if(close || isResponsive) { %>,
        $content = $('#content')<% } %>;

    if( $body.data('tracking') ) {
        $body.append('<img src="' + $body.data('tracking') + (+new Date()) + '" border="0">');
    }

    // IAB clicktag standard
    // see: http://www.iab-austria.at/wp-content/uploads/2014/06/IAB_Austria_HTML5_Guideline_Juni2014.pdf
    (window.onpopstate = function () {
        var match,
            pl = /\+/g,  // Regex for replacing addition symbol with a space
            search = /([^&=]+)=?([^&]*)/g,
            decode = function (s) { return decodeURIComponent(s.replace(pl, ' ')); },
            query = window.location.search.substring(1);

        urlParams = {};
        while (match = search.exec(query)) {
            urlParams[decode(match[1])] = decode(match[2]);
        }
    })();

    if(urlParams.clicktag) {
        window.clickTag = urlParams.clicktag;
    }

    $body <% if(close) { %>
        .on('click', '.close', function(e) {
            e.stopPropagation();

            // Trigger an event to notify subscribers that the ad was closed
            $content.addClass('hidden').trigger('dmb:close');
        })<% } %>
        .on('click', '#content', function(e) {
            e.preventDefault();

            if(window.clickTag) {
                window.open(window.clickTag, '_blank');
            }
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
