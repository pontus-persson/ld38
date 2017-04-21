"use strict";
(function() {
    // shim layer with setTimeout fallback
    window.requestAnimFrame = (function () {
        return window.requestAnimationFrame    ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();
    window.logsec = function(...what) {
        if (typeof window.logtime === 'undefined') {
            window.logtime = new Date();
        }
        var now = new Date();
        if(now.getTime() - window.logtime.getTime() > 1000) {
            console.log(...what);
            window.logtime = now;
        }
    }
    require.config({
        urlArgs: "bust=" + (new Date()).getTime()
    });    
    requirejs([
        'jquery.min',
        'lib/vec2',
        'lib/point',
        'lib/line',
        'lib/entity',
        'lib/assets',
        'lib/collision',
        'lib/renderer',
        'lib/input',
        'lib/engine',
    ], function($) {
        // create global namespace
        window.game = new Engine('mainCanvas');
        game.start();
    });
}());