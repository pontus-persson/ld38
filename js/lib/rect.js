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
        var line = this.lines[0];
        for (var i = 0; i < this.lines.length; i++) {
            line = this.lines[i];
            line.draw(ctx);
        }

		ctx.beginPath();
        ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
        ctx.fillStyle = '#FDFABA';
        ctx.moveTo(this.verticies[0].position.x, this.verticies[0].position.y);
        for (var i = 1; i < this.verticies.length; i++) {
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
    this.updatePoints = function(novel) {
        var tx = 0, ty = 0;
		for (var i = 0; i < this.verticies.length; i++) {
            var p = this.verticies[i],
                v = new Vec2((p.position.x - p.oldPosition.x) * game.world.airFriction,
                             (p.position.y - p.oldPosition.y) * game.world.airFriction);

            p.oldPosition.x = p.position.x;
            p.oldPosition.y = p.position.y;

            if(!novel) {
                p.position.addVec(parent.velocity);
                p.position.addVec(v);
                p.position.y += game.world.gravity;
            }

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

        var tilex = Math.floor(this.center.x / game.world.tileSize.x),
            tiley = Math.floor(this.center.y / game.world.tileSize.y);


        if(game.debug) {
            game.renderer.debugctx.restore();
            if(Math.random() < 0.005) game.renderer.debugctx.clearRect(0, 0, game.renderer.debugcanvas.width, game.renderer.debugcanvas.height);
            game.renderer.debugctx.save();
            game.renderer.debugctx.translate(Math.round(-game.player.collision.center.x + game.renderer.debugcanvas.width / 2),
                                             Math.round(-game.player.collision.center.y + game.renderer.debugcanvas.height / 2));
        }


        // Check all adjacent tiles for collision
        for (var x = -1; x <= 1 ; x++) {
            for (var y = -1; y <= 1; y++) {
                var checkx = tilex+x, checky = tiley+y;
                var t = game.world.getTile(checkx, checky);
                if(t > 0 && t !== 5 && t !== 6 && t !== 9) { // Dont collide with items
                    var colliderect = new Rect(checkx * game.world.tileSize.x,
                                               checky * game.world.tileSize.y,
                                               game.world.tileSize.x,
                                               game.world.tileSize.y,
                                               game.world);
                    // if(game.debug) colliderect.draw(game.renderer.debugctx, 'rgba(255, 0, 255, 1)');
                    colliderect.updatePoints(true);
                    var info = this.collide(colliderect);

                }
            }
        }

    }

    //__COLLISION EDGES__
    this.collide = function(that) {
        // Initialize the length of the collision vector to a relatively large value
        var mindist = 99999, collisionInfo = {};
        for (var i = 0; i < this.edgeCount + that.edgeCount; i++) {
            var line = (i < this.edgeCount) ? this.lines[i] : that.lines[i - this.edgeCount];
            var axis = new Vec2(line.v1.position.y - line.v2.position.y, line.v2.position.x - line.v1.position.x);
            axis.normalize();
            var minmaxA = this.projectToAxis(axis);
            var minmaxB = that.projectToAxis(axis);
            var distance = (minmaxA.min < minmaxB.min) ? minmaxB.min - minmaxA.max : minmaxA.min - minmaxB.max;
            //If the intervals don't overlap, return, since there is no collision
            if(distance > 0) {
                return false;
            } else if(Math.abs(distance) < mindist) {
                mindist = Math.abs(distance);
                collisionInfo.axis = axis;
                collisionInfo.line = line;
            }
        }
        collisionInfo.depth = mindist;
        collisionInfo.vec = new Vec2();

        if(game.debug)
            collisionInfo.line.draw(game.renderer.debugctx, 'rgba(255, 0, 255, 1)');

        var b1, b2;
        if (collisionInfo.line.parent === that) {
           b1 = this;
           b2 = that;
        } else {
           b1 = that;
           b2 = this;
        }

        var c = new Vec2(b1.center.x, b1.center.y);

        var sign = c.setSub(b1.center, b2.center).dot(collisionInfo.axis);

        if (sign < 0) {
            collisionInfo.axis.invert();
            if(game.debug)
                collisionInfo.axis.draw(game.renderer.debugctx, 'rgba(0, 0, 255, 1)');
        } else if(game.debug) {
            collisionInfo.axis.draw(game.renderer.debugctx, 'rgba(0, 255, 0, 1)');
        }

        var smallestDist = 99999, v, dist;
        for (var i = 0; i < b1.verticies.length; i++) {
            // Measure the distance of the vertex from the line using the line equation
            v = b1.verticies[i];
            collisionInfo.vec.setSub(v.position, b2.center);
            dist = collisionInfo.axis.dot(collisionInfo.vec);

            // Set the smallest distance and the collision vertex
            if (dist < smallestDist) {
                smallestDist = dist;
                collisionInfo.vertex = v;
            }
        }

        if(game.debug)
            collisionInfo.vertex.draw(game.renderer.debugctx, 'rgba(255, 0, 255, 1)');

        this.doCollision(collisionInfo);

        return collisionInfo;
    }

    this.doCollision = function(collisionInfo) {
        var collisionvec = new Vec2(collisionInfo.axis.x * collisionInfo.depth,
                                    collisionInfo.axis.y * collisionInfo.depth);
        var v1 = collisionInfo.line.v1.position,
            v2 = collisionInfo.line.v2.position,
            l1 = collisionInfo.line.v1.oldPosition,
            l2 = collisionInfo.line.v2.oldPosition,
            vp = collisionInfo.vertex.position,
            vo = collisionInfo.vertex.oldPosition;

        var t;
        if(Math.abs(v1.x - v2.x) > Math.abs(v1.y - v2.y)) {
            t = (collisionInfo.vertex.position.x - collisionvec.x - v1.x) / (v2.x - v1.x);
        } else {
            t = (collisionInfo.vertex.position.y - collisionvec.y - v1.y) / (v2.y - v1.y);
        }
        var lambda = 1.0 / (t*t + (1 - t)*(1 - t));

        v1.x -= collisionvec.x*(1 - t)*0.5*lambda;
        v1.y -= collisionvec.y*(1 - t)*0.5*lambda;
        v2.x -= collisionvec.x*     t *0.5*lambda;
        v2.y -= collisionvec.y*     t *0.5*lambda;
        vp.x += collisionvec.x*0.5;
        vp.y += collisionvec.y*0.5;

        //
        // collision friction
        //
        var m1 = 0.5, m2 = 0.5; // relative masses

        // compute relative velocity
        var relVel = new Vec2(
            vp.x - vo.x - (v1.x + v2.x - l1.x - l2.x) * 0.5,
            vp.y - vo.y - (v1.y + v2.y - l1.y - l2.y) * 0.5
        );

        // axis perpendicular
        var tangent = new Vec2();
        tangent.perp(collisionInfo.axis)

        // project the relative velocity onto tangent
        var relTv = relVel.dot(tangent);
        var rt = new Vec2(
            tangent.x * relTv,
            tangent.y * relTv
        );

        // apply tangent friction
        vo.x += rt.x * 1.1 * m2;
        vo.y += rt.y * 1.1 * m2;

        l1.x -= rt.x*(1-t)*1.1*lambda*m1;
        l1.y -= rt.y*(1-t)*1.1*lambda*m1;
        l2.x -= rt.x*   t *1.1*lambda*m1;
        l2.y -= rt.y*   t *1.1*lambda*m1;
    }

    this.projectToAxis = function(axis) {
        var dp = axis.dot(this.verticies[0].position);
        var ret = {
            min: dp,
            max: dp,
        };
        for (var i = 1; i < this.verticies.length; i++) {
            dp = axis.x * this.verticies[i].position.x + axis.y * this.verticies[i].position.y;
            ret.min = Math.min(dp, ret.min);
            ret.max = Math.max(dp, ret.max);
        }
        return ret;
    }


}