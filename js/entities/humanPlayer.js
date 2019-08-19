var HumanPlayer = me.Entity.extend({
    init : function () {
        // this.hud = hud;
        this._super(
            me.Entity,
            "init",
            [
                30, 300,
                {
                    width : 70,
                    height : 90,
                    shapes : [ new me.Rect(0, 0, 70, 90) ],
                    framewidth: 70,
                    frameheight: 90
                }
            ]
        );

        this.body.setVelocity(0,18);

        this.renderable = new me.Sprite(0, 0, {
            image: me.loader.getImage('player'),
            framewidth: 70,
            frameheight: 90
        });

        this.renderable.addAnimation("walk",  [0, 1, 2, 3]);
        this.renderable.addAnimation("jump",  [4]);
        this.renderable.setCurrentAnimation("walk");

        this.body.collisionType = me.collision.types.PLAYER_OBJECT;
    },

    update : function (dt) {

        if(this.alive) {
            if (me.input.isKeyPressed('jump'))
            {
                if (!this.body.jumping && !this.body.falling)
                {
                    var self = this;
                    this.renderable.setCurrentAnimation("jump");
                    this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
                    this.body.jumping = true;
                    setTimeout(function() {

                        self.renderable.setCurrentAnimation("walk");
                    }, 500);
                }
            } else {
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

        //     case me.collision.types.ENEMY_OBJECT:
        //         this.alive = false;
        //         this.hud.continue = false;
        //         this.body.vel.x = 0;
        //         this.body.vel.y = 0;
        //         this.renderable.setCurrentAnimation("stop");
        //         me.audio.play("errou");
        //         break;
        }
        return true;
    }
});