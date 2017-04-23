"use strict";
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

        switch (game.state) {
            case game.GAMESTATE.normal:
                self.drawGame();
                break;

            case game.GAMESTATE.pause:
                // self.drawSplash();
                break;

            case game.GAMESTATE.splash:
                // self.drawSplash();
                // self.drawGame();
                break;

            case game.GAMESTATE.victory:
                // self.drawSplash();
                self.drawGame();
                break;
        
            default:
                break;
        }

        if(game.debug == true) {
            // debug text
            self.ctx.font = "20pt Calibri";
            self.ctx.fillStyle = "#FFFFFF";
            self.ctx.fillText(self.renderTime+'ms', self.canvas.width - 50, 20);
            self.ctx.fillText(game.updateTime+'ms', 4, 20);
        }

        // request next draw
        window.requestAnimFrame(self.draw);
    }

    this.drawGame = function() {
        // clear
        // self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
        self.ctx.fillStyle = '#67B5DF';
        self.ctx.fillRect(0, 0, self.canvas.width, self.canvas.height);

        self.ctx.save();
        self.ctx.translate(-game.player.collision.center.x + self.canvas.width / 2,
                           -game.player.collision.center.y + self.canvas.height / 2);

        game.world.draw(self.ctx);
        // for (var i = 0; i < game.entities.length; i++) {
        //     var entity = game.entities[i];
        //     entity.draw(self.ctx);
        // }
        game.player.draw(self.ctx);

        self.ctx.restore();
    }

    /**
     * Draw splash screen
     */
    this.drawSplash = function() {
        // clear
        // self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
        self.ctx.fillStyle = '#9ecdc7';
        self.ctx.fillRect(0, 0, self.canvas.width, self.canvas.height);
        // 480 x 360
        var r = 360 / 480;
        var w = self.canvas.width * 0.75;
        var h = w * r;
        self.ctx.drawImage(self.splash, self.canvas.width/2-w/2, 0, w, h);

        self.ctx.font = "20pt Arial";
        self.ctx.fillStyle = "#000000";
        var text = "Press enter to start"
        var tsize = self.ctx.measureText(text);
        self.ctx.fillText(text, self.canvas.width / 2 - tsize.width / 2, self.canvas.height - 50);
        // self.ctx.fillText(text, 22, 22);
        // console.log(self.canvas.width / 2 - tsize.width / 2, self.canvas.height - tsize.height-50);
    }

};