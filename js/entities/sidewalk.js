var Sidewalk = me.Entity.extend({

    init: function(x, z) {
        var self = this;
        this.z = z;
        this.nextFrame = false;
        this._super(
            me.Entity,
            "init",
            [
                x, 
                450,
                {
                    width : 72,
                    height : 92,
                    shapes : [ new me.Rect(0, 0, 192, 32) ],
                    framewidth: 72,
                    frameheight: 92
                }
            ]
        );
        
        this.body.setVelocity(3 * game.vel.x,0);

        // this.alwaysUpdate = true;

        this.renderable = new me.Sprite(0, 0, {
            image: me.loader.getImage('sidewalk'),
            framewidth: 192,
            frameheight: 32
        });

        this.body.collisionType = me.collision.types.WORLD_SHAPE;

        this.removed = false;
        this.isKinematic = false;
    },

    update: function(dt) {
        this.body.setVelocity(3 * game.vel.x,0);
        if(game.alive || game.ia.alive) {
            this.body.vel.x += -this.body.accel.x * me.timer.tick;
            var limit = this.body.ancestor.pos._x + this.body.width;
            var limitX = game.res.width - (this.body.ancestor.pos._x + this.body.width);

            if(limitX > 0 && !this.nextFrame) {
                this.nextFrame = true;
                me.game.world.addChild(new Sidewalk(limit-this.body.accel.x), this.z);
            }
            if(limit <= 15) {
                this.removed = true;
                me.game.world.removeChild(this);
            }
        } else {
            this.body.setVelocity(0, 0);
        }
        
        this.body.update(dt);

        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },
    onCollision: function() {
        return false;
    }
});