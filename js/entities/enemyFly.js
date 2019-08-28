var EnemyFly = me.Entity.extend({

    init: function() {
        this._super(
            me.Entity,
            "init",
            [
                600, 
                330,
                {
                    width : 75,
                    height : 36,
                    shapes : [ new me.Rect(0, 0, 75, 36) ],
                    framewidth: 75,
                    frameheight: 36
                }
            ]
        );
        
        this.body.setVelocity(4,0);

        // this.alwaysUpdate = true;

        this.renderable = new me.Sprite(0, 0, {
            image: me.loader.getImage('enemyFly'),
            framewidth: 75,
            frameheight: 36
        });

        this.body.collisionType = me.collision.types.ENEMY_OBJECT

        this.isKinematic = false;
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