"use strict";
var Entity = function(x, y) {
    var self = this;

    this.collision = new Rect(x, y, 28, 28, this);
    this.color = "#000000";

    this.center = new Vec2();
    this.velocity = new Vec2();
    this.canJump = true;
    this.canSpin = true;

    /**
     * Draw entity
     */
    this.draw = function(ctx) {
        self.collision.draw(ctx);
    }

    /**
     * Move all verticies at once
     */
    this.setPos = function(x, y) {
        this.collision.verticies[0].position.set(x, y);
        this.collision.verticies[0].oldPosition.set(x, y);

        this.collision.verticies[1].position.set(x, y+this.collision.h);
        this.collision.verticies[1].oldPosition.set(x, y+this.collision.h);

        this.collision.verticies[2].position.set(x+this.collision.w, y+this.collision.h);
        this.collision.verticies[2].oldPosition.set(x+this.collision.w, y+this.collision.h);

        this.collision.verticies[3].position.set(x+this.collision.w, y);
        this.collision.verticies[3].oldPosition.set(x+this.collision.w, y);
    }

};