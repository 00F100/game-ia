var EnemyCacti = me.Entity.extend({

    init: function() {
        this._super(
            me.Entity,
            "init",
            [
                639,
                410,
                {
                    width : 30,
                    height : 51,
                    shapes : [ new me.Rect(0, 0, 30, 51) ],
                    framewidth: 30,
                    frameheight: 51
                }
            ]
        );
        
        this.body.setVelocity(4 * game.vel.x, 0);

        this.renderable = new me.Sprite(0, 0, {
            image: me.loader.getImage('enemyCacti'),
            framewidth: 30,
            frameheight: 51
        });

        this.body.collisionType = me.collision.types.ENEMY_OBJECT;

        this.removed = false;
        this.isKinematic = false;
        
        game.enemies.push(this);
    },

    update: function(dt) {
        if(game.alive || game.ia.alive) {
            this.body.vel.x += -this.body.accel.x * me.timer.tick;

            var limit = this.body.ancestor.pos._x + this.body.width;
            if(limit <= 15) {
                this.removed = true;
                me.game.world.removeChild(this);
                var idx = game.enemies.indexOf(this);
                if (idx !== -1) {
                    game.enemies.splice(idx, 1);
                }
            }
        } else {
            this.body.setVelocity(0, 0);
        }
        this.body.update(dt);

        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    }
});
