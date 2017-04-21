"use strict";
console.log('engine loading');
var Engine = function(canvasID) {
    console.log('engine constructing');
    var self = this;
    this.assets = new Assets();
    this.renderer = new Renderer(canvasID);
    this.input = new Input();
    this.collision = new Collision();

    // Time how long between updates
    this.updateTime = 0;
    this.lastUpdate = new Date();

    this.gameState = 0;
    this.entities = [];

    /**
     * Initiate everything
     */
    this.start = function() {
        // resize once to set correct size on load
        self.renderer.resize();
        self.renderer.tiles = self.assets.loadImage('assets/images/tiles.png', 'tiles');

        // remove context menu
        $('body').on('contextmenu', function(e){ return false; });

        // bind all the things
        $(window).resize(function(e) { self.renderer.resize(e); });
        $(document).keydown(function (e) { self.input.handleKeydown(e); });
        $(document).keyup(function (e) { self.input.handleKeyup(e); });
        $(document).mousemove(function (e) { self.input.mouseMove(e); });
        $(document).mousedown(function (e) { self.input.mouseDown(e); });
        $(document).mouseup(function (e) { self.input.mouseUp(e); });

        // initiate entities
        for (var i = 0; i < 11; i++) {
            self.entities.push(new Entity(self.renderer.canvas.width, self.renderer.canvas.height));
        }

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

        self.handleInputGame();
        self.updateGame();
    }

    /**
     * Update game
     */
     this.updateGame = function() {
        for (var i = 0; i < self.entities.length; i++) {
            var entity = self.entities[i];
            entity.updatePoints();
            for (var j = 0; j < 2; j++) {
                entity.updateLines();
                entity.constrainPoints();
            }
            // logsec(entity);
        }
     }

    /**
     * Handles input
     */
    this.handleInputGame = function() {
        if (self.input.isKeyPressed('f2')) {
            self.gameState = 0;
        } else if (self.input.isKeyPressed('f3')) {
            self.gameState = 1;
        }
        if (self.input.isKeyPressed('1')) {
            self.input.selected = 0;
        } else if (self.input.isKeyPressed('2')) {
            self.input.selected = 1;
        }

        if (self.input.isButtonPressed('left') && !self.input.pressed) {
            self.input.pressed = true;
            self.entities[self.input.selected].verticies.push(new Point(self.input.mouse.x, self.input.mouse.y));
            console.log(self.entities[self.input.selected].verticies);
        } else if (!self.input.isButtonPressed('left') && !self.input.isButtonPressed('right')) {
            self.input.pressed = false;
        }
        
        if(self.input.isButtonPressed('right') && !self.input.pressed) {
            self.input.pressed = true;
            self.entities[self.input.selected].generateLines();
            console.log(self.entities[self.input.selected]);
        }
    }

    /**
     * Update editor
     */
    this.updateEdit = function() {
        // for (var i = 0; i < self.editorInfo.entities.length; i++) {
        //     // logsec(i);
        //     self.editorInfo.entities[i].updatePoints(self.input);
        //     // todo: limit time this takes? or scale it depending on delta time on main loop?
        //     for (var step = 0; step < 3; step++) {
        //         self.editorInfo.entities[i].updateEdges();
        //         self.editorInfo.entities[i].constrainPoints(self.renderer.canvas);
        //     }
        // }
        // for (var i = 0; i < self.editorInfo.entities.length; i++) {
        //     for (var j = i + 1; j < self.editorInfo.entities.length; j++) {
        //         self.editorInfo.entities[i].doCollision(self.editorInfo.entities[j]);
        //     }
        // }
    }

};
