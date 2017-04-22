"use strict";
var Input = function() {
    console.log('input constructing');
    var self = this;

    // Holds pressed keys as keycodes
    this.keysPressed = {};
    this.keys = {
        'enter':  13,
        'space':  32,
        'escape': 27,
        'plus':   107,
        'minus':  109,
        // function keys
        'f1': 112,
        'f2': 113,
        'f3': 114,
        'f4': 115,
        // numbers
        '1': 49,
        '2': 50,
        '3': 51,
        '4': 52,
        '5': 53,
        '6': 54,
        '7': 55,
        '8': 56,
        '9': 57,
        '0': 58,
        // letters
        'q': 81,
        'w': 87,
        'e': 69,
        'r': 82,
        'a': 65,
        's': 83,
        'd': 68,
        // arrowkeys
        'up':    38,
        'left':  37,
        'down':  40,
        'right': 39,
    };
    // Holds mouse buttons pressed
    this.buttonsPressed = {};
    this.buttons = {
        'left': 0,
        'middle': 1,
        'right': 2,
    };

    // relative mouse position
    this.mouse = new Vec2();
    this.lastmouse = new Vec2();
    this.pressed = false;
    this.selected = 0;

    /**
     * Keyboard functions
     */ // handle keyboard press down of key
    this.handleKeydown = function(e) {
        // e.preventDefault();
        var event = window.event || e;
        this.keysPressed[event.keyCode] = true;
        // this.eventBuffer.push({ type: 'keyPressed', data: event.keyCode });
        // console.log(event.keyCode);
    }

    // handles keyboard release of key
    this.handleKeyup = function(e) {
        // e.preventDefault();
        var event = window.event || e;
        this.keysPressed[event.keyCode] = false;
        // this.eventBuffer.push({ type: 'keyReleased', data: event.keyCode });
    }

    // return if specific key is pressed
    this.isKeyPressed = function(key) {
        if (self.keys[key]) {
            return self.keysPressed[self.keys[key]];
        }
        return false;
    }

    /**
     * Mouse functions
     */
    this.mouseMove = function(e) {
        this.lastmouse.setVec(this.mouse);
        this.mouse.set(
            (event.pageX || event.clientX) - game.renderer.canvas.offset.left,
            (event.pageY || event.clientY) - game.renderer.canvas.offset.top
        );
    }

    this.mouseDown = function(e) {
        e.preventDefault();
        this.buttonsPressed[e.button] = true;
    }

    this.mouseUp = function(e) {
        e.preventDefault();
        this.buttonsPressed[e.button] = false;
    }

    this.isButtonPressed = function(button) {
        return self.buttonsPressed[self.buttons[button]];
    }
}