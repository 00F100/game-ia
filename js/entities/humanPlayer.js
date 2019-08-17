var HumanPlayer = me.Entity.extend({
    init : function (hud) {
        this.hud = hud;
        this._super(
            me.Entity,
            "init",
            [
                30, 
                0,
                {
                    width : 32,
                    height : 64,
                    shapes : [ new me.Rect(0, 0, 32, 45) ],
                    framewidth: 32,
                    frameheight: 64
                }
            ]
        );

        this.body.setVelocity(0,17);

        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH, 0.4);

        this.alwaysUpdate = true;

        this.renderable = new me.Sprite(0, 0, {
            image: me.loader.getImage(game.assets[0].name),
            framewidth: 64,
            frameheight: 64
        });

        this.renderable.addAnimation("stop",  [0]);
        this.renderable.addAnimation("walk",  [0, 1, 2, 3, 4, 7]);

        this.body.collisionType = me.collision.types.PLAYER_OBJECT
    },

    update : function (dt) {

        if(this.alive) {
            if (me.input.isKeyPressed('jump'))
            {
                if (!this.body.jumping && !this.body.falling)
                {
                    this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
                    this.body.jumping = true;
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

            case me.collision.types.ENEMY_OBJECT:
                this.alive = false;
                this.hud.continue = false;
                this.body.vel.x = 0;
                this.body.vel.y = 0;
                this.renderable.setCurrentAnimation("stop");
                me.audio.play("errou");
                break;
        }
        return false;
    }
});