;
(function($) {
    // plugin
    $.fn.gaEvents = function(options) {
        /**
         * Functionality for tracking to google analytics.
         *
         * @param  {string} category
         * @param  {string} action
         * @param  {string} label
         * @param  {string} value
         * @return {boolean}
         */
        var trackEvent = function(category, action, label, value) {
                if (typeof ga != 'undefined') {
                    if (typeof value != 'undefined') {
                        return ga('send', 'event', category, action, label, value);
                    }
                    return ga('send', 'event', category, action, label);
                }
                return false;
            },
            trackPageview = function(url) {
                if (typeof ga != 'undefined') {
                    return ga('send', 'pageview', url);
                }
                return false;
            },
            getLinkLabel = function(link) {
                var href = $(link).attr('href').replace(/^mailto\:/i, ''),
                    title = $(link).attr('title') || $(link).text();
                href = stripDomain(href);
                if (href == '' || href == '/') {
                    return title;
                }
                return title == '' ? href : href + ' (' + title + ')';
            },
            getDomain = function(uri, strip_www) {
                domain = uri.match(/:\/\/(.[^/]+)/)[1];
                if (strip_www) {
                    domain = domain.replace('www.', '');
                }
                return domain;
            },
            stripDomain = function(uri) {
                if (uri.indexOf('http://www.' + document.domain) > -1 || uri.indexOf('http://' + document.domain) > -1) {
                    uri = uri.replace('http://www.' + document.domain, '').replace('http://' + document.domain, '');
                } else {
                    uri = uri.replace(/^https?\:\/\/(www.)?/i, '');
                }
                uri = uri.replace(/#track(.*)/i, '');
                return uri;
            },
            // default
            settings = $.extend({}, {
                uaId: false,
                uid: false,
                enableScrollTrack: false,
                enableClickTrack: false,
                enableMailTrack: true,
                enableDownloadTrack: true,
                enableLinkTrack: true,
                enableButtonTrack: true,
                enableSubmitTrack: true,
                downloadTrackExtension: ['zip', 'pdf', 'doc', 'docx'],
                enableAnchorTrack: true,
                enablePrintTrack: true,
                printTrackBefore: false,
                printTrackAfter: true,
                enableIdlePageTrack: false,
                idlePageInterval: 60 * 1000
            }, options);

        // Load Google Analytics
        if (settings.uaId && typeof ga == 'undefined') {
            (function(i, s, o, g, r, a, m) {
                i['GoogleAnalyticsObject'] = r;
                i[r] = i[r] || function() {
                    (i[r].q = i[r].q || []).push(arguments)
                }, i[r].l = 1 * new Date();
                a = s.createElement(o), m = s.getElementsByTagName(o)[0];
                a.async = 1;
                a.src = g;
                m.parentNode.insertBefore(a, m)
            })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
            ga('create', settings.uaId, 'auto');
            ga('require', 'displayfeatures');
            ga('send', 'pageview');
        }

        // Send User-ID
        if (settings.uid) {
            ga('set', '&uid', settings.uid);
        }

        // Scroll Tracking
        if (settings.enableScrollTrack) {
            $(window).scroll(function(e) {
                var x = $(this).scrollTop(),
                    y = $(this).scrollLeft();
                trackEvent('Scroll', 'scroll', 'interaction', '{x:' + x + ', y: ' + y + '}');
            });
        }

        // Click Tracking
        if (settings.enableClickTrack) {
            $(document.body).click(function(e) {
                var offset = $(this).offset(),
                    x = e.pageX - offset.left,
                    y = e.pageY - offset.top;
                trackEvent('Click', 'click', 'interaction', '{x:' + x + ', y: ' + y + '}');
            });
        }

        // Idle Page Tracking
        if (settings.enableIdlePageTrack) {
            var time = 0;
            window.setInterval(function() {
                time = time + 60;
                var mins = ~~ (time / 60),
                    secs = time % 60,
                    hrs = ~~ (time / 3600),
                    mins = ~~ ((time % 3600) / 60),
                    secs = time % 60,
                    finalTime = '';
                if (hrs > 0) {
                    finalTime += '' + hrs + ':' + (mins < 10 ? '0' : '');
                }
                finalTime += '' + mins + ':' + (secs < 10 ? '0' : '');
                finalTime += '' + secs;
                trackEvent('Idle', 'idle', 'time', finalTime);
            }, settings.idlePageInterval);
        }

        // Print Tracking
        if (settings.enablePrintTrack) {
            // before printing
            var beforePrint = function() {
                    if (settings.printTrackBefore) {
                        trackEvent('Print', 'print', 'before', document.location.pathname);
                    }
                },
                // after printing
                afterPrint = function() {
                    if (settings.printTrackAfter) {
                        trackEvent('Print', 'print', 'after', document.location.pathname);
                    }
                };
            if (window.matchMedia) {
                var mediaQueryList = window.matchMedia('print');
                mediaQueryList.addListener(function(mql) {
                    if (mql.matches) {
                        beforePrint();
                    } else {
                        afterPrint();
                    }
                });
            }
            window.onbeforeprint = beforePrint;
            window.onafterprint = afterPrint;
        }

        // Download, Mail, Link Tracking
        var filetypes = new RegExp('\.(' + settings.downloadTrackExtension.join('|') + ')$', 'i');
        $('a').click(function(e) {
            var href = $(this).attr('href');
            // Download Tracking
            if (href.match(filetypes) && settings.enableDownloadTrack) {
                var extension = (/[.]/.exec(href)) ? /[^.]+$/.exec(href) : 'undefined';
                trackEvent('Download', 'click - ' + extension, getLinkLabel(this));
                // Mail Tracking
            } else if (href.match(/^mailto\:/i) && settings.enableMailTrack) {
                trackEvent('Mailto', 'click', getLinkLabel(this));
                // Link Tracking (External)
            } else if ((href.match(/^https?\:/i)) && (!href.match(document.domain)) && settings.enableLinkTrack) {
                trackEvent('External', 'click', getLinkLabel(this));
                // Link Tracking (Internal)
            } else if (settings.enableLinkTrack) {
                trackEvent('Internal', 'click', getLinkLabel(this));
            }
        });

        // Button Tracking
        if (settings.enableButtonTrack) {
            $(':button[type!=submit]').click(function() {
                name = $(this).attr('name') || $(this).text();
                trackEvent('Button', 'click', name);
            });
        }

        // Submit Tracking
        if (settings.enableSubmitTrack) {
            // button
            $(':button[type=submit]').click(function(e) {
                label = $(this).attr('name') || $(this).text();
                trackEvent('Submit', 'click', name);
            });
            // input
            $(':input[type=submit]').click(function(e) {
                label = $(this).attr('name') || $(this).val();
                trackEvent('Submit', 'click', label);
            });
        }

        // Anchor Tracking
        if (settings.enableAnchorTrack) {
            result = document.location.hash.match(/\#track\/(.*)/i);
            if (result) {
                var parts = result[1].split('/'),
                    category = parts[0],
                    action = parts[1],
                    href = stripDomain($(document.location).attr('href')),
                    label = typeof parts[2] == 'undefined' || !parts[2].length ? href : parts[2] + ' (' + href + ')';
                trackEvent(category, action, label);
            }
        }

        return this;
    };
})(jQuery);