var EnemyCacti = me.Entity.extend({

    init: function() {
        this._super(
            me.Entity,
            "init",
            [
                639, 
                410,
                {
                    width : me.Math.random(200, 800),
                    height : 51,
                    shapes : [ new me.Rect(0, 0, 30, 51) ],
                    framewidth: 30,
                    frameheight: 51
                }
            ]
        );
        
        this.body.setVelocity(4,0);

        this.renderable = new me.Sprite(0, 0, {
            image: me.loader.getImage('enemyCacti'),
            framewidth: 30,
            frameheight: 51
        });

        this.body.collisionType = me.collision.types.NO_OBJECT
    },

    update: function(dt) {
        this.body.vel.x += -this.body.accel.x * me.timer.tick;

        var limit = this.body.ancestor.pos._x + this.body.width;
        if(limit <= 1) {
            me.game.world.removeChild(this);
        }
        this.body.update(dt);

        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    }
});