"use strict";
var Entity = function(x, y) {
    var self = this;
    this.center = new Vec2(x  * Math.random(), y  * Math.random());

    this.verticies = [];
    this.lines = [];

    this.color = "#000000";

    /**
     * Draw entity
     */
    this.draw = function(ctx) {
        for (var j = 0; j < self.lines.length; j++) {
            var line = self.lines[j];
            line.draw(ctx);
        }

        for (var j = 0; j < self.verticies.length; j++) {
            var point = self.verticies[j];
            point.draw(ctx);
        }   
    }

    this.update = function(canvas) {

    }

    /**
     * Update points
     */
    this.updatePoints = function() {
        var tx = 0, ty = 0;
        var yForce = (game.input.isKeyPressed('space') ? -1 : 0);
		for (var i = 0; i < this.verticies.length; i++) {
            var p = this.verticies[i],
                v = new Vec2((p.position.x - p.oldPosition.x) * game.collision.friction,
                             (p.position.y - p.oldPosition.y) * game.collision.friction);
            
            p.oldPosition.x = p.position.x;
            p.oldPosition.y = p.position.y;

            p.position.addVec(v);
            p.position.y += game.collision.gravity + yForce;

            tx += p.position.x;
            ty += p.position.y;
		}

        // center is average of verticies
        this.center.x = tx / this.verticies.length;
        this.center.y = ty / this.verticies.length;
    }

    // readjust ponts according to lines
    this.updateLines = function() {
        for (var i = 0; i < this.lines.length; i++) {
            this.lines[i].update();
        }
    }

    this.constrainPoints = function() {
		for (var i = 0; i < this.verticies.length; i++) {
            var p = this.verticies[i],
                v = new Vec2((p.position.x - p.oldPosition.x),
                             (p.position.y - p.oldPosition.y));

            if(p.position.x < 0) {
                p.position.x = 0;
                p.oldPosition.x = p.position.x + v.x * game.collision.energyloss;
            } else if(p.position.x > game.renderer.canvas.width) {
                p.position.x = game.renderer.canvas.width;
                p.oldPosition.x = p.position.x + v.x * game.collision.energyloss;
            }
            if(p.position.y < 0) {
                p.position.y = 0;
                p.oldPosition.y = p.position.y + v.y * game.collision.energyloss;
            } else if(p.position.y > game.renderer.canvas.height) {
                p.position.y = game.renderer.canvas.height;
                p.oldPosition.y = p.position.y + v.y * game.collision.energyloss;
            }
		}
    }

    this.generateLines = function() {
        console.log('generate');
        for (var i = 0; i < this.verticies.length; i++) {
            var p1 = this.verticies[i];
            for (var j = i + 1; j < this.verticies.length; j++) {
                var p2 = this.verticies[j];
                this.lines.push(new Line(p1, p2, this));
            }
        }
    }

};