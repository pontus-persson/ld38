"use strict";
console.log('collision loading');
var Collision = function() {
    console.log('collision constructing');
    var self = this;

    this.friction = 0.99;
    this.energyloss = 0.9;
    // this.gravity = 0.0;
    this.gravity = 0.01;

    this.polygonIntersects = function() {

    }

};