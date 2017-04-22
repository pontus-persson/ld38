"use strict";
/**
 * Circle "class"
 **/
var Circle = function(x, y, r) {
    if(typeof x === 'undefined') x = 0;
    if(typeof y === 'undefined') y = 0;
    if(typeof r === 'undefined') r = 0;
    this.x = x;
    this.y = y;
    this.r = r;
    this.color = "#FFFFFF";
    this.colliding = false;

    /**
     * Draw circle
     */
    this.draw = function(ctx) {
        if (this.colliding) {
            // this.color = '#6E7C94';
        } else {
            this.color = '#EEECE1';
        }
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    }

    /**
     * Check collision vs other collision
     */
    this.intersects = function(that) {
        if (that instanceof Circle) {
            if (
                this.x - this.r < that.x + that.r &&
                this.x + this.r > that.x - that.r &&
                this.y - this.r < that.y + that.r &&
                this.y + this.r > that.y - that.r
            ) {
                var delta = new Vec2(this.x - that.x, this.y - that.y);
                var len = delta.len(); 
                if(len < this.r + that.r) {
                    return delta;
                }
            }
            return false;
        } else if(that instanceof Rect) {
            // todo; Some cool circle vs rectangle collision?
            return (
                this.x - this.r < that.x + that.w &&
                this.x + this.r > that.x          && 
                this.y - this.r < that.y + that.h &&
                this.y + this.r > that.y 
            );
        }
    }
}