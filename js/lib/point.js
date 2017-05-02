"use strict";
var Point = function(x, y, parent) {
    var self = this;
    this.parent = parent || null;
    this.position = new Vec2(x, y);
    // this.oldPosition = new Vec2(x, y);
    this.oldPosition = new Vec2(x + Math.random() * 2 - 1, y + Math.random() * 2 - 1);

    this.draw = function(ctx, col) {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, 2, 0, 2 * Math.PI);
		ctx.closePath();
        ctx.fillStyle = col || "#FFFFFF";
        ctx.fill();
    }
}