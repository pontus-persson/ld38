"use strict";
console.log('assets loading');
var Assets = function(parent) {
    console.log('assets constructing');
    var self = this;

    this.images = {};
    
    /**
     * Load image and return object
     */
    this.loadImage = function(url, id) {
        this.images[id] = document.createElement("img");
        this.images[id].src = url;
        return this.images[id];
    }

    /**
     * Return already loaded image
     */
    this.getImage = function(id) {
         return this.images[id];
    }
}