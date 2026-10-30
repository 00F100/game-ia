var HumanPlayer = me.Entity.extend({
    init : function (x, y, callbackColision, callbackUpdate, net, bindKeys) {

        this.fitness = 0;
        this.ducking = false;
        this.net = net || null;
        this.bindKeys = bindKeys !== false;

        this.callback = [];
        this.callback['colision'] = callbackColision;
        this.callback['update'] = callbackUpdate;

        this.startPoint = {
            x: x,
            y: y
        };

        this.entityWidth = 74;
        this.entityHeight = 89;
        this.hitWidth = this.entityWidth - 20;
        // Duck frame feet are at y=71; walk feet at y=88. Shift the sprite
        // down by that gap so the pose sits on the sidewalk. melonJS SAT
        // ignores body.pos, so this does not push the entity into the ground.
        this.duckOffset = 17;

        this._super(
            me.Entity,
            "init",
            [
                this.startPoint.x, this.startPoint.y,
                {
                    width : this.entityWidth,
                    height : this.entityHeight,
                    shapes : [ new me.Rect(0, 0, this.hitWidth, this.entityHeight) ],
                    framewidth: this.entityWidth,
                    frameheight: this.entityHeight
                }
            ]
        );

        this.body.gravity.y = 0.17;
        this.body.setVelocity(0, 6);
        this.alwaysUpdate = true;
        this.renderable = new me.Sprite(0, 0, {
            image: me.loader.getImage('player'),
            framewidth: this.entityWidth,
            frameheight: this.entityHeight
        });

        this.renderable.addAnimation("walk",  [0, 1, 2, 3]);
        this.renderable.addAnimation("jump",  [5]);
        this.renderable.addAnimation("duck",  [4]);
        
        this.runWalk();

        this.body.collisionType = me.collision.types.PLAYER_OBJECT;

        this.isKinematic = false;

        if (this.bindKeys) {
            me.input.bindKey(me.input.KEY.DOWN, "duck");
            me.input.bindKey(me.input.KEY.UP, "jump");
            me.input.bindKey(me.input.KEY.SPACE, "jump");
        }
    },

    update : function (dt) {
        var limit = this.body.ancestor.pos._x + this.body.width;
        if(limit <= 15) {
            me.game.world.removeChild(this);
        }
        if(this.alive) {
            this.fitness++;

            this.body.gravity.y = game.gravityY();

            if (this.bindKeys) {
                if (me.input.isKeyPressed('jump')) {
                    if (!this.body.jumping && !this.body.falling) {
                        this.runJump();
                    }
                } else if (me.input.isKeyPressed('duck')) {
                    this.runDuck();
                } else if (!this.body.jumping && !this.body.falling && this.ducking) {
                    this.runWalk();
                } else if (!this.renderable.isCurrentAnimation('walk') && !this.body.jumping && !this.body.falling) {
                    this.runWalk();
                }
            }
            if(typeof this.callback['update'] == 'function') {
                this.callback['update'](this);
            }
        }

        this.body.update(dt);
        me.collision.check(this);
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },

    onCollision : function (response) {
        switch (response.b.body.collisionType) {
            case me.collision.types.WORLD_SHAPE:
                return true;
            case me.collision.types.PLAYER_OBJECT:
                return false;
            case me.collision.types.ENEMY_OBJECT:
                if (this.alive && typeof this.callback['colision'] == 'function') {
                    this.callback['colision'](this);
                }
                break;
        }
        return true;
    },

    _setDuckHitbox: function(ducking) {
        var shape = this.body.shapes[0];
        if (!shape || !shape.points || shape.points.length < 4) {
            return;
        }
        var top = ducking ? this.duckOffset : 0;
        shape.points[0].y = top;
        shape.points[1].y = top;
        if (typeof shape.recalc === 'function') {
            shape.recalc();
        }
        this.body.pos.x = 0;
        this.body.pos.y = ducking ? this.duckOffset : 0;
    },

    runJump: function() {
        if (this.ducking) {
            this._setDuckHitbox(false);
            this.ducking = false;
        }
        this.renderable.setCurrentAnimation("jump");
        this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
        this.body.jumping = true;
    },

    runDuck: function() {
        if (!this.ducking) {
            this._setDuckHitbox(true);
            this.ducking = true;
        }
        this.renderable.setCurrentAnimation("duck");
    },

    runWalk: function() {
        if (this.ducking) {
            this._setDuckHitbox(false);
        }
        this.ducking = false;
        this.renderable.setCurrentAnimation("walk");
    }
});
