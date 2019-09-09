var HumanPlayer = me.Entity.extend({
    init : function () {

        this.startPoint = {
            x: 30,
            y: 300
        };

        this.entityWidth = 74;
        this.entityHeight = 89;

        this._super(
            me.Entity,
            "init",
            [
                this.startPoint.x, this.startPoint.y,
                {
                    width : this.entityWidth,
                    height : this.entityHeight,
                    shapes : [ new me.Rect(0, 0, this.entityWidth-20, this.entityHeight) ],
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
    },

    runJump: function() {
        this.renderable.setCurrentAnimation("jump");
        this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
        this.body.jumping = true;
    },

    runDuck: function() {
        this.body.shapes[0].points[0].y = 20;
        this.body.shapes[0].points[1].y = 20;
        this.body.pos.y = 20;
        this.renderable.setCurrentAnimation("duck");
    },

    runWalk: function() {
        this.body.pos.y = 0;
        this.body.shapes[0].points[0].y = 0;
        this.body.shapes[0].points[1].y = 0;
        this.renderable.setCurrentAnimation("walk");
    },

    update : function (dt) {
        if(this.alive) {
            var self = this;

            if (game.vel.x < 2) {
                this.body.gravity.y = 0.17;
            } else if(game.vel.x < 3) {
                this.body.gravity.y = 0.22;
            } else if (game.vel.x < 4) {
                this.body.gravity.y = 0.28;
            }

            if (me.input.isKeyPressed('jump')) {
                if (!this.body.jumping && !this.body.falling) {
                    this.runJump();
                }
            } else if (me.input.isKeyPressed('duck')) {
                this.runDuck();
            } else {
                if(!this.renderable.isCurrentAnimation("walk") && !this.body.jumping && !this.body.falling) {
                    this.runWalk();
                }
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
                break;
            case me.collision.types.PLAYER_OBJECT:
                return false;
                break;
            case me.collision.types.ENEMY_OBJECT:
                this.alive = false;
                // this.hud.continue = false;
                this.body.vel.x = 0;
                this.body.vel.y = 0;
                game.alive = false;
                // game.vel.x = 0;
                // this.renderable.setCurrentAnimation("die");
                // me.audio.play("errou");
                break;
        }
        return true;
    }
});