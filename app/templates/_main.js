<% if(hasVideo) { %>/* global videojs, window */
(function ($, videojs, window) {
    'use strict';

    var $content = $('#content'),
        player = null,
        userMuted = false,
        videoDefer = new $.Deferred(),
        loadDefer = new $.Deferred()<% if(useTA) { %>,
        animations = {
            fadeIn: new TA.VelocityAnimation(
                {opacity: 1}, {duration: 750}
            ),
            fadeOut: new TA.VelocityAnimation(
                {opacity: 0}, {duration: 750}
            ),
            pulsate: new TA.VelocityAnimation(
                {scale: [1.05, 1]}, {duration: 400, loop: 2}
            )
        },
        tl1 = new TA.Timeline('timeline'),
        d = tl1.getDescriber()<% } %>;

    $(window).on('load', function() {
        loadDefer.resolve();
    });

    videojs('video', {}, function() {
        player = this;
        player.muted(true);

        videoDefer.resolve();
    });

    /* Use $content for all clickhandler.
     * Don't forget e.stopPropagation(); inside each clickhandler.
     */
    $content
        .on('click', '#video', function(e) {
            e.stopPropagation();
        })
        .on('click', '#video .vjs-mute-control', function() {
            userMuted = !userMuted;
        })
        .on('mousemove', function() {
            player.userActive(true);
        })
        .on('mouseenter', function() {
            player.muted(userMuted);
        })
        .on('mouseleave', function() {
            player.muted(true);
        })<% if(close) { %>
        .on('html5Banner:close', function() {
            player.pause();
            player.muted(true);
            <% if(useTA) { %>tl1.pause();<% } %>
        })<% } %>
        .on('click', function() {
            player.pause();
        })
        .on('click', function() {
            player.muted(true);
        });

    <% if(useTA) { %>
    tl1.add([
        d.label('start')
    ]);
    <% } %>

    $.when(videoDefer, loadDefer).done(function() {
        player.play();

        // start the main logic here!
        <% if(useTA) { %>tl1.jumpToLabel('start');<% } %>
    });
})(jQuery, videojs, window);
<% } else { %>/* global window */
(function ($, window) {
    'use strict';

    var <% if(close) { %>$content = $('#content'),
        <% } %><% if(useTA) { %>animations = {
            fadeIn: new TA.VelocityAnimation(
                {opacity: 1}, {duration: 750}
            ),
            fadeOut: new TA.VelocityAnimation(
                {opacity: 0}, {duration: 750}
            ),
            pulsate: new TA.VelocityAnimation(
                {scale: [1.05, 1]}, {duration: 400, loop: 2}
            )
        },
        tl1 = new TA.Timeline('timeline'),
        d = tl1.getDescriber()<% } %>;

    /* Use $content for all clickhandler.
     * Don't forget e.stopPropagation(); inside each clickhandler.
     */<% if(useTA) { %><% if(close) { %>
    $content
        .on('html5Banner:close', function() {
            tl1.pause();
        });
    <% } %>

    tl1.add([
        d.label('start')
    ]);

    tl1.jumpToLabel('start');<% } %>

})(jQuery, window);
<% } %>
