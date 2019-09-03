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

        me.timer.setTimeout(function() {
            if(!self.removed) {
                me.game.world.removeChild(self);
            }
        // }, 8000);
        }, 24000 / game.vel.x);
    },

    update: function(dt) {
        this.body.vel.x += -this.body.accel.x * me.timer.tick;

        var limit = this.body.ancestor.pos._x + this.body.width;
        if(limit <= 1) {
            this.removed = true;
            me.game.world.removeChild(this);
        }
        this.body.update(dt);

        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    }
});