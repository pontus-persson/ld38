"use strict";
var Engine = function(canvasID) {
    console.log('engine constructing');
    var self = this;
    this.assets = new Assets();
    this.world = new World();
    this.input = new Input();
    this.renderer = new Renderer(canvasID);

    // Time how long between updates
    this.updateTime = 0;
    this.lastUpdate = new Date();

    this.GAMESTATE = {
        normal: 0,
        pause: 1,
        splash: 2,
        loadscreen: 3,
        victory: 4,
    };
    this.state = this.GAMESTATE.splash;
    // this.entities = [];
    this.player = new Entity(20, this.world.getBounds().y - 48 - 38);
    this.debug = false;

    /**
     * Initiate everything
     */
    this.start = function() {
        // resize once to set correct size on load
        self.renderer.resize();
        self.renderer.tiles = self.assets.loadImage('assets/images/tiles.png', 'tiles');
        self.renderer.splash = self.assets.loadImage('assets/images/splash.png', 'splash');
        self.assets.loadSound('assets/sounds/plong.wav', 'plong');
        self.assets.loadSound('assets/sounds/grow3.wav', 'grow');
        self.assets.loadSound('assets/sounds/shrink2.wav', 'shrink');
        self.assets.loadSound('assets/sounds/win.wav', 'win');

        self.world.reloadMap();

        // remove context menu
        $('body').on('contextmenu', function(e){ return false; });

        // bind all the things
        $(window).resize(function(e)       { self.renderer.resize(e); });
        $(document).keydown(function (e)   { self.input.handleKeydown(e); });
        $(document).keyup(function (e)     { self.input.handleKeyup(e); });
        $(document).mousemove(function (e) { self.input.mouseMove(e); });
        $(document).mousedown(function (e) { self.input.mouseDown(e); });
        $(document).mouseup(function (e)   { self.input.mouseUp(e); });

        // initiate entities
        // for (var i = 0; i < 11; i++) {
        //     self.entities.push(new Entity(self.renderer.canvas.width, self.renderer.canvas.height));
        // }

        self.track();

        // start drawing
        window.requestAnimFrame(self.renderer.draw);

        // set update interval 1000ms / 60;
        self.updateInterval = window.setInterval(self.update, 1000 / 60);
    }

    /**
     * Update
     */
    this.update = function() {
        var now = new Date();
        self.updateTime = now.getTime() - self.lastUpdate.getTime();
        self.lastUpdate = now;

        switch (self.state) {
            case self.GAMESTATE.normal:
                self.handleInput();
                self.updateGame();
                break;

            case self.GAMESTATE.pause:
                // todo: some kind of pause menu?
                self.handleInput();
                break;

            case self.GAMESTATE.loadscreen:
                // ignore input while loading
                break;

            case self.GAMESTATE.victory:
                // ignore input while loading
                break;
        
            default:
                self.handleInput();
                break;
        }
    }

    /**
     * Update game
     */
     this.updateGame = function() {
        if(!self.world.shrinking && !self.world.growing)
            self.player.collision.updatePoints();
        for (var j = 0; j < 3; j++) {
            self.player.collision.updateLines();
            self.player.collision.constrainPoints();
        }

        // for (var i = 0; i < self.entities.length; i++) {
        //     var entity = self.entities[i];
        //     entity.update();
        // }
        // for (var i = 0; i < self.entities.length; i++) {
        //     var entity1 = self.entities[i];
        //     for (var j = i + 1; j < self.entities.length; j++) {
        //         var entity2 = self.entities[j];
        //         // entity1.collide(entity2);
        //     }
        // }
     }

    /**
     * Handles input
     */
    this.handleInput = function() {
        if (self.input.isKeyPressed('escape')) {
            self.state = game.GAMESTATE.pause;
            $('canvas').fadeOut('fast');
            $('.splash').fadeIn('fast');
        } else if (self.input.isKeyPressed('enter')) {
            if(self.state !== game.GAMESTATE.normal) {
                self.assets.playSound('plong');
                $('canvas').fadeIn('fast');
                $('.splash').fadeOut('fast');
            }
            self.state = game.GAMESTATE.normal;
        }
        if (self.input.isButtonPressed('left') && !self.input.pressed) {
            self.input.pressed = true;
            // console.log(self.entities);
        } else if (!self.input.isButtonPressed('left')) {
            self.input.pressed = false;
        }

        if (self.input.isKeyPressed('a') || self.input.isKeyPressed('left')) {
            if (self.player.canSpin) {
                self.player.velocity.x = -1.4;
                self.player.canSpin = false;
            } else {
                self.player.velocity.x = -0.1;
                self.player.canSpin = false;
            }
        } else if (self.input.isKeyPressed('d') || self.input.isKeyPressed('right')) {
            if (self.player.canSpin) {
                self.player.velocity.x = 1.4;
                self.player.canSpin = false;
            } else {
                self.player.velocity.x = 0.1;
                self.player.canSpin = false;
            }
        } else {
            self.player.velocity.x = 0;
        }

        if ((self.input.isKeyPressed('w') || self.input.isKeyPressed('space') || self.input.isKeyPressed('up')) && self.player.canJump) {
            self.player.velocity.y = -5.8;
            self.player.canJump = false;
            self.player.canSpin = false;
        } else {
            self.player.velocity.y = 0;
        }
        
        if (self.input.isKeyPressed('insert')) {
            this.debug = true;
        } else if (self.input.isKeyPressed('delete')) {
            this.debug = false;
        }

        if (self.input.isKeyPressed('plus')) {
            self.world.growMap();
        } else if (self.input.isKeyPressed('minus')) {
            self.world.shrinkMap();
        }

    }

    this.showVictory = function() {
        self.state = self.GAMESTATE.victory;
        // $('canvas').fadeOut('fast');
        $('.thanks').fadeIn('fast');
    }

    this.track = function(category, action, label) {
        if(ga) {
            ga('send', {
                hitType: 'event',
                eventCategory: category,
                eventAction: action,
                eventLabel: label
            });
        }
    }

};
