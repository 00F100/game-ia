var Cloud = me.Entity.extend({

    init: function(x, zi, ze, z) {

        var self = this;
        
        if(x == undefined) {
            x = 0;
        }
        
        this.z = z;
        this.zi = zi;
        this.ze = ze;

        this._super(
            me.Entity,
            "init",
            [
                x, 
                me.Math.random(50, 300),
                {
                    width : me.Math.random(zi, ze),
                    height : 71,
                    framewidth: 128,
                    frameheight: 71
                }
            ]
        );
        this.nextFrame = false;
        this.alwaysUpdate = true;
        
        this.body.setVelocity(1 * game.vel.x,0);


        this.renderable = new me.Sprite(0, 0, {
            image: me.loader.getImage('cloud' + me.Math.random(1, 3)),
            framewidth: 128,
            frameheight: 71
        });

        this.body.collisionType = me.collision.types.NO_OBJECT

        this.removed = false;
        this.isKinematic = true;
    },

    update: function(dt) {
        if(game.alive) {
            this.body.vel.x += -this.body.accel.x * me.timer.tick;

            var limit = this.body.ancestor.pos._x + this.body.width;
            var limitX = game.res.width - (this.body.ancestor.pos._x + this.body.width);

            if(limitX > 0 && !this.nextFrame) {
                this.nextFrame = true;
                me.game.world.addChild(new Cloud(limit-this.body.accel.x, this.zi, this.ze), this.z);
            }
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