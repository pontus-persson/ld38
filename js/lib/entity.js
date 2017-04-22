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

};