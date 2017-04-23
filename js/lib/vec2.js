"use strict";
/**
 * Vec2 "class"
 **/
var Vec2 = function(x, y) {
    this.x = x || 0;
    this.y = y || 0;
    this.len = function() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },
    this.set = function(x, y) {
        this.x = x;
        this.y = y;
        return this;
    },
    this.setVec = function(vec) {
        this.x = vec.x;
        this.y = vec.y;
        return this;
    },
    this.setSub = function (v0, v1) {
        this.x = v0.x - v1.x;
        this.y = v0.y - v1.y;
        return this;
    },
    this.add = function(a) {
        this.x += a;
        this.y += a;
        return this;
    },
    this.addVec = function(vec) {
        this.x += vec.x;
        this.y += vec.y;
        return this;
    },
    this.sub = function(s) {
        this.x -= s;
        this.y -= s;
        return this;
    },
    this.subVec = function(vec) {
        this.x -= vec.x;
        this.y -= vec.y;
        return this;
    },
    this.mul = function(m) {
        this.x *= m;
        this.y *= m;
        return this;
    },
    this.mulVec = function(vec) {
        this.x *= vec.x;
        this.y *= vec.y;
        return this;
    },
    this.div = function(d) {
        this.x /= d;
        this.y /= d;
        return this;
    },
    this.divVec = function(vec) {
        this.x /= vec.x;
        this.y /= vec.y;
        return this;
    },
    this.dot = function(vec) {
        return this.x * vec.x + this.y * vec.y;
    },
    this.normalize = function() {
        var l = this.len();
        if(l != 0) this.div(l);
        return this;
    },
    this.invert = function() {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    },
    this.perp = function(v) {
        this.x = -v.y;
        this.y =  v.x;
        return this;
    },
    this.angleTo = function(vec) {
        return Math.acos(
            (this.x * vec.x + this.y * vec.y) /
            Math.sqrt(this.x * this.x + this.y * this.y) /
            Math.sqrt(vec.x * vec.x + vec.y * vec.y)
        );
    },
    this.limit = function(limit) {
        var l = this.len();
        if(l > limit) {
            this.normalize();
            this.mul(limit);
        }
        return this;
    }
}