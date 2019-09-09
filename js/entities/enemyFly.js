var EnemyFly = me.Entity.extend({

    init: function() {
        var self = this;
        this._super(
            me.Entity,
            "init",
            [
                630, 
                340,
                {
                    width : 75,
                    height : 33.5,
                    shapes : [
                        new me.Rect(-28, 0, 15, 18),
                        new me.Rect(-12, 0, 40, 33.5),
                        new me.Rect(28, 0, 15, 18)
                    ],
                    framewidth: 75,
                    frameheight: 33.5
                }
            ]
        );
        
        this.body.setVelocity(4 * game.vel.x,0);

        this.alwaysUpdate = true;

        this.renderable = new me.Sprite(0, 0, {
            image: me.loader.getImage('enemyFly'),
            framewidth: 75,
            frameheight: 33.5
        });

        this.body.collisionType = me.collision.types.ENEMY_OBJECT

        this.removed = false;
        this.isKinematic = false;
    },

    update: function(dt) {
        if(game.alive) {
            this.body.vel.x += -this.body.accel.x * me.timer.tick;

            var limit = this.body.ancestor.pos._x + this.body.width;
            if(limit <= 10) {
                this.removed = true;
                me.game.world.removeChild(this);
            }
        } else {
            this.body.setVelocity(0, 0);
        }

        this.body.update(dt);

        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    }
});