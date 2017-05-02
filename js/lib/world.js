"use strict";
var World = function() {
    console.log('world constructing');
    var self = this;

    this.airFriction = 0.999;
    this.friction = 0.85;
    this.energyloss = 0.9;
    this.gravity = 0.11;

    this.tileSize = new Vec2(48, 48);

    this.currentMap = 1;
    this.map = [[]];
    this.mapSize = new Vec2();

    this.animationstep = 0;

    this.draw = function(ctx) {
        var p = game.player.collision.position;
        var c = game.player.collision.center;
        var startx = Math.floor((c.x - game.renderer.canvas.width / 2) / this.tileSize.x) - 1;
        var starty = Math.floor((c.y - game.renderer.canvas.height / 2) / this.tileSize.y) - 1;
        var stopx = Math.floor((c.x + game.renderer.canvas.width / 2) / this.tileSize.x) + 2;
        var stopy = Math.floor((c.y + game.renderer.canvas.height / 2) / this.tileSize.y) + 2;

        var w = 0;
        if((this.growing && this.animationstep > 0)) {
            this.animationstep -= 1;
            w = this.tileSize.x - this.animationstep;
            if(this.animationstep <= 0) {
                this.growing = false;
                // this.mapSize.x++;
            }
        }
        if((this.shrinking && this.animationstep > 0)) {
            this.animationstep -= 1;
            w = this.animationstep;
            if(this.animationstep <= 0) {
                this.shrinking = false;
                this.mapSize.x--;
            }
        }

        // bounds on the screen
        var numbounds = Math.ceil((stopx - startx) / this.mapSize.x);
        // var px = Math.round(c.x / this.tileSize.x);

        var boundToLeft = 0;
        for (var x = startx; x < stopx; x++) {
            var getx = (x < 0 || (x > this.mapSize.x - 1)) ? x % this.mapSize.x : x;
            if(getx < 0) {
                getx = this.mapSize.x + getx;
            }
            if(getx == this.mapSize.x - 1) {
                boundToLeft += (x < Math.floor(c.x / this.tileSize.x) ? 1 : 0);
            }
        }

        var sourcex, sourcey,
            sourcew = this.tileSize.x, sourceh = this.tileSize.y,
            destx, desty,
            destw = this.tileSize.x, desth = this.tileSize.y;
        for (var y = starty; y < stopy; y++) {
            desty = Math.round(this.tileSize.y * y);
            destx = Math.round(this.tileSize.x * (startx - 1)) + ((boundToLeft && (this.shrinking || this.growing)) ? (this.tileSize.x - w) * boundToLeft : 0);
            for (var x = startx; x < stopx; x++) {
                var getx = (x < 0 || (x > this.mapSize.x - 1)) ? x % this.mapSize.x : x;
                if(getx < 0) {
                    getx = this.mapSize.x + getx;
                }
                if((this.shrinking || this.growing) && (getx == this.mapSize.x - 1)) {
                    destx += this.tileSize.x;
                    destw = w;
                    sourcew = w;
                } else if((this.shrinking || this.growing) && (getx == 0)) {
                    destx += w;
                    destw = this.tileSize.x;
                    sourcew = this.tileSize.x;
                } else {
                    destx += this.tileSize.x;
                    destw = this.tileSize.x;
                    sourcew = this.tileSize.x;
                }
                var tile = this.getTile(x, y);
                if(tile > 0) {
                    // logsec(tile);
                    switch (tile) {
                        case 0:
                            sourcey = this.tileSize.x * 1;
                            sourcex = this.tileSize.x * 0;
                            break;
                        default:
                            sourcey = this.tileSize.x * Math.floor(tile / 5);
                            sourcex = this.tileSize.x * (tile % 5);
                            break;
                    }
                    ctx.drawImage(game.renderer.tiles, sourcex, sourcey, sourcew, sourceh,
                                                       destx,   desty,   destw,   desth);
                    // // logsec(sourcex, sourcey, sourcew, sourceh, destx, desty, destw, desth);
                    // if(game.debug) {
                    //     ctx.strokeStyle = '#FF00FF';
                    //     ctx.rect(destx,   desty,   destw,   desth);
                    //     ctx.stroke();
                    // }
                }
            }
        }

        // draw line for bounds
        // var bounds = this.getBounds();
        // ctx.beginPath();
        // ctx.moveTo(bounds.x - w / 2, -bounds.y);
        // ctx.lineTo(bounds.x - w / 2, bounds.y*2);
        // ctx.moveTo(0 - w / 2, -bounds.y);
        // ctx.lineTo(0 - w / 2, bounds.y*2);
        // ctx.closePath();
        // ctx.strokeStyle = 'rgba(253, 131, 217, 0.25)';
        // ctx.lineWidth = w;
        // ctx.stroke();
        // ctx.lineWidth = 1;
    }

    this.getTile = function(x, y) {
        var getx = (x < 0 || (x > this.mapSize.x - 1)) ? x % this.mapSize.x : x;
        var gety = (y < 0 || (y > this.mapSize.y - 1)) ? y % this.mapSize.y : y;
        if(getx < 0) {
            getx = this.mapSize.x + getx;
        }
        if(gety < 0) {
            gety = this.mapSize.y + gety;
        }
        return this.map[gety][getx];
    }

    this.setTile = function(x, y, t) {
        var getx = (x < 0 || (x > this.mapSize.x - 1)) ? x % this.mapSize.x : x;
        var gety = (y < 0 || (y > this.mapSize.y - 1)) ? y % this.mapSize.y : y;
        if(getx < 0) {
            getx = this.mapSize.x + getx;
        }
        if(gety < 0) {
            gety = this.mapSize.y + gety;
        }
        this.map[gety][getx] = t;
    }

    this.getBounds = function() {
        return new Vec2(this.mapSize.x * this.tileSize.x, this.mapSize.y * this.tileSize.y);
    }

    this.growMap = function() {
        if(!this.growing && this.mapSize.x < this.map[0].length) {
            game.assets.playSound('grow');
            this.growing = true;
            this.animationstep = this.tileSize.x;
            this.mapSize.x++;
        }
    }

    this.shrinkMap = function() {
        if(!this.shrinking && this.mapSize.x > this.map[0].length / 2) {
            game.assets.playSound('shrink');
            this.shrinking = true;
            this.animationstep = this.tileSize.x;
            // this.mapSize.x--;
        }
    }

    this.loadMap = function(url) {
        // game.state =  game.GAMESTATE.loading;
        $.getJSON(url, function(json) {
            if(!json) return;
            self.map = json.map;
            self.mapSize.x = json.size.x;
            self.mapSize.y = json.size.y;
            game.player.setPos(json.start.x * self.tileSize.x, json.start.y * self.tileSize.y);
            game.player.velocity.set(0, 0);
        });
    }

    this.reloadMap = function() {
        this.loadMap('maps/map'+this.currentMap+'.json');
    }

    this.nextMap = function() {
        this.currentMap++;
        game.track('world', 'progressing', 'Loading level '+this.currentMap);
        if(this.currentMap > 9) {
            game.track('game', 'finished', 'Finished game!');
            game.showVictory();
            return false;
        }
        this.loadMap('maps/map'+this.currentMap+'.json');
    }

};