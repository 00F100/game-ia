var Smilie = me.Entity.extend({
    init : function (i) {
        this._super(
            me.Entity,
            "init",
            [
                me.Math.random(-15, 1024),
                me.Math.random(-15, 768),
                {
                    width : 16,
                    height : 16,
                    shapes : [ new me.Ellipse(4, 4, 8, 8) ]
                }
            ]
        );

        // disable gravity and add a random velocity
        this.body.gravity = 0;
        this.body.vel.set(me.Math.randomFloat(-4, 4), me.Math.randomFloat(-4, 4));

        this.alwaysUpdate = true;

        // add the coin sprite as renderable
        this.renderable = new me.Sprite(0, 0, {image: me.loader.getImage(game.assets[i % 5].name)});
    },

    update : function () {
        this.pos.add(this.body.vel);

        // world limit check
        if (this.pos.x >= 1024) {
            this.pos.x = -15;
        }
        if (this.pos.x < -15) {
            this.pos.x = 1024 - 1;
        }
        if (this.pos.y >= 768) {
            this.pos.y = -15;
        }
        if (this.pos.y < -15) {
            this.pos.y = 768 - 1;
        }

        if (me.collision.check(this)) {
            // me.collision.check returns true in case of collision
            this.renderable.setOpacity(1.0);
        }
        else {
            this.renderable.setOpacity(0.5);
        }
        return true;
    },

    // collision handler
    onCollision : function (response) {

        this.pos.sub(response.overlapN);
        if (response.overlapN.x !== 0) {
            this.body.vel.x = me.Math.randomFloat(-4, 4) * -Math.sign(this.body.vel.x);
        }
        if (response.overlapN.y !== 0) {
            this.body.vel.y = me.Math.randomFloat(-4, 4) * -Math.sign(this.body.vel.y);
        }

        return false;
    }
});

var Player = me.Entity.extend({
    init : function () {
        this._super(
            me.Entity,
            "init",
            [
                50,
                0,
                {
                    width : 32,
                    height : 64,
                    shapes : [ new me.Rect(0, 0, 32, 64) ],
                    framewidth: 32,
                    frameheight: 64
                }
            ]
        );

        // this.body.setVelocity(3, 15);

        // set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH, 0.4);

        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;

        // add the coin sprite as renderable
        this.renderable = new me.Sprite(0, 0, {
            image: me.loader.getImage(game.assets[0].name),
            framewidth: 64,
            frameheight: 64
        });

        this.renderable.addAnimation("walk",  [0, 1, 2, 3, 4, 5, 6, 7]);

        this.renderable.setCurrentAnimation("walk");
    },

    update : function (dt) {

        this.body.vel.x = 0;

        if (me.input.isKeyPressed('jump'))
        {
            if (!this.body.jumping && !this.body.falling)
            {
                // set current vel to the maximum defined value
                // gravity will then do the rest
                this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
                // set the jumping flag
                this.body.jumping = true;
            }
        }

        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // return true if we moved or if the renderable was updated
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },

    // collision handler
    onCollision : function (response) {
        switch (response.b.body.collisionType) {
            case me.collision.types.WORLD_SHAPE:
                response.overlapV.x = 0;
                return true;
                break;

            // case me.collision.types.ENEMY_OBJECT:
            //     if ((response.overlapV.y>0) && !this.body.jumping) {
            //         // bounce (force jump)
            //         this.body.falling = false;
            //         this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
            //         // set the jumping flag
            //         this.body.jumping = true;
            //         // play some audio
            //         me.audio.play("stomp");
            //     }
            //     else {
            //         // let's flicker in case we touched an enemy
            //         this.renderable.flicker(750);
            //     }
            //     return false;
            //     break;

            default:
                // Do not respond to other objects (e.g. coins)
                return false;
        }

        // Make the object solid
        return true;
    }
});