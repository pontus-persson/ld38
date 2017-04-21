"use strict";
console.log('renderer loading');
var Renderer = function(canvasID) {
    console.log('renderer constructing');
    var self = this;
    this.canvas = document.getElementById(canvasID);
    this.ctx = this.canvas.getContext("2d");
    this.ctx.font = "36px Arial";
    this.maxWidth = 9999;
    this.maxHeight = 9999;
    this.renderTime = 0;
    this.lastRender = new Date();
    this.tiles = null;

    /**
     * Set canvas as biggest possible square while respecting custom maxsize and window size;
     */
    this.resize = function(e) {
        var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        self.canvas.width = Math.min(self.maxWidth, w);
        self.canvas.height = Math.min(self.maxHeight, h);
        self.canvas.offset = $(self.canvas).offset();
    }

    /**
     * Draw to canvas
     */
    this.draw = function() {
        // time since last render
        var now = new Date();
        self.renderTime = now.getTime() - self.lastRender.getTime();
        self.lastRender = now;

        // clear
        // self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
        self.ctx.fillStyle = '#ABC8C3';
        self.ctx.fillRect(0, 0, self.canvas.width, self.canvas.height);

        for (var i = 0; i < game.entities.length; i++) {
            var entity = game.entities[i];
            entity.draw(self.ctx);
        }

        // debug text
        self.ctx.font = "20pt Calibri";
        self.ctx.fillStyle = "#FFFFFF";
        self.ctx.fillText(self.renderTime+'ms', self.canvas.width - 50, 20);
        self.ctx.fillText(game.updateTime+'ms', 4, 20);

        // request next draw
        window.requestAnimFrame(self.draw);
    }


};