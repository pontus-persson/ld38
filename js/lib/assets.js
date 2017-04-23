"use strict";
var Assets = function(parent) {
    console.log('assets constructing');
    var self = this;

    this.images = {};
    this.sounds = {};
    
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


    /**
     * Load image and return object
     */
    this.loadSound = function(url, id) {
        this.sounds[id] = new Audio(url);;
        this.sounds[id].src = url;
        return this.sounds[id];
    }

    /**
     * Return already loaded Sound
     */
    this.getSound = function(id) {
         return this.sounds[id];
    }

    /**
     * Return already loaded Sound
     */
    this.playSound = function(id) {
         this.sounds[id].play();
    }
}