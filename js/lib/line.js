"use strict";
/**
 * Line between two points
 * @param {*} v1 
 * @param {*} v2 
 * @param {*} parent 
 */
var Line = function(v1, v2, parent) {
    var self = this;
    this.parent = parent || null;
    this.v1 = v1;
    this.v2 = v2;

    // save for later, this Line's normalized delta vector
    this.delta = new Vec2(v2.position.x - v1.position.x, v2.position.y - v1.position.y);

    // The wanted Line length
    this.len = this.delta.len();
    
    // this.delta.normalize();

    this.draw = function(ctx) {
		ctx.beginPath();
		ctx.moveTo(this.v1.position.x, this.v1.position.y);
        ctx.lineTo(this.v2.position.x, this.v2.position.y);
		ctx.closePath();
        ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
        // ctx.strokeStyle = '#000000';
		ctx.stroke();
    }

    this.update = function() {
        var current = new Vec2(this.v2.position.x - this.v1.position.x, this.v2.position.y - this.v1.position.y);
        var len = current.len();
        var diff = len - this.len;
        current.div(len); // normalize using calculated length

        // push vertecies half the difference each
        this.v1.position.x += current.x*diff*0.5;
        this.v1.position.y += current.y*diff*0.5;
        this.v2.position.x -= current.x*diff*0.5;
        this.v2.position.y -= current.y*diff*0.5;
    }
}