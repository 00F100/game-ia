var EnemyPlayer = me.Entity.extend({
    init: function(hud) {
        this.hud = hud;
        this._super(
            me.Entity,
            "init",
            [
                640, 350,
                {
                    width : 64,
                    height : 64,
                    shapes : [ new me.Rect(0, 0, 40, 40) ]
                }
            ]
        );

        this.alwaysUpdate = true;

        this.body.setVelocity(5, 15);

        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH, 0.4);

        this.renderable = new me.Sprite(0, 0, {
            image: me.loader.getImage(game.assets[1].name),
            framewidth: 64,
            frameheight: 64
        });

        this.renderable.addAnimation("stop",  [0]);
        this.renderable.flipX(true);

        this.body.collisionType = me.collision.types.ENEMY_OBJECT;
    },
    
    update: function(dt) {
        this.body.update(dt);

        if(this.hud.continue) {
            this.body.vel.x += -this.body.accel.x * me.timer.tick;
        } else {
            this.body.vel.x = 0;
        }

        if(this.left < -(this.body.width)) {
            me.game.world.removeChild(this);
        }

        me.collision.check(this);

        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },

    onCollision: function(response) {
        switch (response.b.body.collisionType) {
            case me.collision.types.WORLD_SHAPE:
                return true;
                break;

            case me.collision.types.PLAYER_OBJECT:
                this.hud.continue = false;
                this.renderable.setCurrentAnimation("stop");
                this.body.vel.x = 0;
                this.body.vel.y = 0;
                return true;
                break;
        }
        return true;
    }
});