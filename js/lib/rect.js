"use strict";
/**
 * Rect "class"
 **/
var Rect = function(x, y, w, h, parent) {

    this.verticies = [
        new Point(x  , y  , this),
        new Point(x  , y+h, this),
        new Point(x+w, y+h, this),
        new Point(x+w, y  , this),
    ];

    this.lines = [
        new Line(this.verticies[0], this.verticies[1], this),
        new Line(this.verticies[1], this.verticies[2], this),
        new Line(this.verticies[2], this.verticies[3], this),
        new Line(this.verticies[3], this.verticies[0], this),
        new Line(this.verticies[0], this.verticies[2], this),
        new Line(this.verticies[1], this.verticies[3], this),
    ];

    this.edgeCount = 4; // only 4 lines used for collision

    this.w = w || 0;
    this.h = h || 0;
    this.parent = parent || null;
    this.center = new Vec2();
    this.color = "#FFFFFF";
    this.colliding = false;

    this.draw = function(ctx) {
        // logsec(line);
        var line = this.lines[0];
        for (var i = 0; i < this.lines.length; i++) {
            line = this.lines[i];
            line.draw(ctx);
        }

		ctx.beginPath();
        ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
        ctx.fillStyle = '#FDFABA';
        ctx.moveTo(this.verticies[0].position.x, this.verticies[0].position.y);
        for (var i = 0; i < this.verticies.length; i++) {
            var point = this.verticies[i];
            ctx.lineTo(point.position.x, point.position.y);
            // point.draw(ctx);
        }
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
    }

    /**
     * Update points
     */
    this.updatePoints = function() {
        var tx = 0, ty = 0;
		for (var i = 0; i < this.verticies.length; i++) {
            var p = this.verticies[i],
                v = new Vec2((p.position.x - p.oldPosition.x) * game.world.airFriction,
                             (p.position.y - p.oldPosition.y) * game.world.airFriction);
            
            p.oldPosition.x = p.position.x;
            p.oldPosition.y = p.position.y;

            p.position.addVec(parent.velocity);
            p.position.addVec(v);
            p.position.y += game.world.gravity;

            tx += p.position.x;
            ty += p.position.y;
		}

        // center is average of verticies
        this.center.x = tx / this.verticies.length;
        this.center.y = ty / this.verticies.length;

        var bounds = game.world.getBounds();
        if(this.center.x < 0) {
    		for (var i = 0; i < this.verticies.length; i++) {
                var p = this.verticies[i];
                p.position.x += bounds.x;
                p.oldPosition.x += bounds.x;
            }
        } else if(this.center.x > bounds.x) {
    		for (var i = 0; i < this.verticies.length; i++) {
                var p = this.verticies[i];
                p.position.x -= bounds.x;
                p.oldPosition.x -= bounds.x;
            }
        }

        if(this.center.y < 0) {
    		for (var i = 0; i < this.verticies.length; i++) {
                var p = this.verticies[i];
                p.position.y += bounds.y;
                p.oldPosition.y += bounds.y;
            }
        } else if(this.center.y > bounds.y) {
    		for (var i = 0; i < this.verticies.length; i++) {
                var p = this.verticies[i];
                p.position.y -= bounds.y;
                p.oldPosition.y -= bounds.y;
            }
        }


    }

    // readjust ponts according to lines
    this.updateLines = function() {
        for (var i = 0; i < this.lines.length; i++) {
            this.lines[i].update();
        }
    }

    // constrain points
    this.constrainPoints = function() {

		for (var i = 0; i < this.verticies.length; i++) {
            var p = this.verticies[i],
                v = new Vec2((p.position.x - p.oldPosition.x),
                             (p.position.y - p.oldPosition.y));


            var tilex = Math.floor(p.position.x / game.world.tileSize.x),
                tiley = Math.floor(p.position.y / game.world.tileSize.y);
            
            v.mul(0.2);

            while(game.world.getTile(tilex, tiley) > 0) {
                if(game.world.getTile(tilex, tiley) == 5) {
                    game.world.setTile(tilex, tiley, 0);
                    game.world.growMap();
                } else if(game.world.getTile(tilex, tiley) == 6) {
                    game.world.setTile(tilex, tiley, 0);
                    game.world.shrinkMap();
                } else if(game.world.getTile(tilex, tiley) == 7 || game.world.getTile(tilex, tiley) == 8) {
                    game.assets.playSound('hurt');
                    game.track('game', 'died', 'Died at world '+game.world.currentMap);
                    game.world.setTile(tilex, tiley, 0);
                    game.world.reloadMap();
                    break;
                } else if(game.world.getTile(tilex, tiley) == 9) {
                    game.world.setTile(tilex, tiley, 0);
                    game.assets.playSound('win')
                    game.world.nextMap();
                    break;
                } else {
                    p.position.subVec(v);
                    tilex = Math.floor(p.position.x / game.world.tileSize.x),
                    tiley = Math.floor(p.position.y / game.world.tileSize.y);
                }
            }

            // tilex = Math.floor(p.position.x / game.world.tileSize.x),
            tiley = Math.floor((p.position.y+game.world.gravity) / game.world.tileSize.x);
            if(game.world.getTile(tilex, tiley) > 0) {
                // logsec(game.world.getTile(tilex, tiley));
                this.parent.canJump = true;
                this.parent.canSpin = true;
            }
		}


    }


}