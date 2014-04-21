/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, strict:true, undef:true, unused:true, curly:true, browser:true, jquery:true, indent:4, maxerr:50 */
/*global _gaq*/
var Funda = Funda || {};

Funda.TrackSocial = (function () {
    'use strict';

    var currentUrl = window.location.url,
        windowSizeArray = [
            'width=450,height=450,left=' + (screen.availWidth / 2 - 225) + ',top=' + (screen.availHeight / 2 - 225),
            'width=560,height=410,left=' + (screen.availWidth / 2 - 280) + ',top=' + (screen.availHeight / 2 - 205),
            'width=755,height=320,left=' + (screen.availWidth / 2 - 378) + ',top=' + (screen.availHeight / 2 - 160)
        ];

    // Utilities
    function getPopupSize($el) {
        return windowSizeArray[$el.attr('rev')];
    }
    function openPopup(targetUrl, windowSize) {
        window.open(targetUrl, '', windowSize);
    }

    // Tracking
    function trackFacebook() {
        _gaq.push(['_trackSocial', 'facebook', 'send', currentUrl]);
    }
    function trackTwitter() {
        _gaq.push(['_trackSocial', 'twitter', 'tweet', currentUrl]);
    }
    function trackGPlus() {
        _gaq.push(['_trackSocial', 'plusone', '+1', currentUrl]);
    }
    function trackLinkedIn() {
        _gaq.push(['_trackSocial', 'LinkedIn', 'Share']);
    }
    function trackPinterest() {
        _gaq.push(['_trackSocial', 'Pinterest', 'Pin it']);
    }
    function trackSend(objectSoort, objectBron) {
        _gaq.push(['_trackEvent', 'Link naar object', 'Klik', objectSoort + '/' + objectBron + '/object-overzicht']);
    }

    // Event Binding
    function initialize() {

        // This binds up the triggering a popup window and event tracking for
        // share links in the sidebar and the socialcount links

        $(document)
                // Open target in a popup
                .on('click.opensocialpopup', '.socialcount li a, .share-icon:not(.share-email) a', function (event) {
                    var $el = $(this),
                        targetUrl = $el.attr('rel');
                    openPopup(targetUrl, getPopupSize($el));
                    event.preventDefault();
                })
                .one('click.social', '.socialcount .facebook', trackFacebook)
                .one('click.social', '.socialcount .twitter', trackTwitter)
                .one('click.social', '.socialcount .googleplus', trackGPlus)

                // Sidebar: doorsturen / delen
                .one('click.social', '.share-facebook', trackFacebook)
                .one('click.social', '.share-linkedin', trackLinkedIn)
                .one('click.social', '.share-twitter', trackTwitter)
                .one('click.social', '.share-google', trackGPlus)
                .one('click.social', '.share-pinterest', trackPinterest)

                // Email link
                .one('click.social', '.share-link input', function () {
                    var input = $(this);
                    var objectSoort = input.attr('data-objectSoort');
                    var objectBron = input.attr('data-objectBron');
                    input.select();
                    trackSend(objectSoort, objectBron);
                });

    }
    return {
        init: initialize
    };
}());

$(document).ready(function () {
    'use strict';
    Funda.TrackSocial.init();
});