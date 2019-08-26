var Cacti = me.Entity.extend({

    init: function(x, zi, ze, z) {
        this.z = z;
        this.zi = zi;
        this.ze = ze;
        if(x == undefined) {
            x = 0;
        }
        this.nextFrame = false;
        this._super(
            me.Entity,
            "init",
            [
                x, 
                360,
                {
                    width : me.Math.random(zi, ze),
                    height : 91,
                    framewidth: 30,
                    frameheight: 91
                }
            ]
        );
        
        this.body.setVelocity(2 * game.vel.x,0);

        this.renderable = new me.Sprite(0, 0, {
            image: me.loader.getImage('cacti'),
            framewidth: 30,
            frameheight: 91
        });

        this.body.collisionType = me.collision.types.NO_OBJECT

        this.isKinematic = true;
    },

    update: function(dt) {
        this.body.vel.x += -this.body.accel.x * me.timer.tick;

        var limit = this.body.ancestor.pos._x + this.body.width;
        var limitX = game.res.width - (this.body.ancestor.pos._x + this.body.width);

        if(limitX > 0 && !this.nextFrame) {
            this.nextFrame = true;
            me.game.world.addChild(new Cacti(limit-this.body.accel.x, this.zi, this.ze), this.z);
        }
        if(limit <= 1) {
            me.game.world.removeChild(this);
        }

        this.body.update(dt);

        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    }
});