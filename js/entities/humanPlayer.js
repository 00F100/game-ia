var HumanPlayer = me.Entity.extend({
    init : function () {

        this.startPoint = {
            x: 30,
            y: 300
        };

        this.entityWidth = 74;
        this.entityHeight = 89;

        // Vf(2) = Vi(2) + 2 * a * D

        this._super(
            me.Entity,
            "init",
            [
                this.startPoint.x, this.startPoint.y,
                {
                    width : this.entityWidth,
                    height : this.entityHeight,
                    shapes : [ new me.Rect(0, 0, this.entityWidth-10, this.entityHeight) ],
                    framewidth: this.entityWidth,
                    frameheight: this.entityHeight
                }
            ]
        );

        this.body.gravity.y = 0.17;
        this.body.setVelocity(0, 6);
        this.alwaysUpdate = true;
        this.renderable = new me.Sprite(0, 0, {
            image: me.loader.getImage('player'),
            framewidth: this.entityWidth,
            frameheight: this.entityHeight
        });

        this.renderable.addAnimation("walk",  [0, 1, 2, 3]);
        this.renderable.addAnimation("jump",  [5]);
        this.renderable.addAnimation("duck",  [4]);
        // this.renderable.addAnimation("die",  [5]);
        this.renderable.setCurrentAnimation("walk");

        this.body.collisionType = me.collision.types.PLAYER_OBJECT;

        this.isKinematic = false;
    },

    update : function (dt) {
        if(this.alive) {
            var self = this;
            if (me.input.isKeyPressed('jump')) {
                if (!this.body.jumping && !this.body.falling) {
                    this.renderable.setCurrentAnimation("jump");
                    this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
                    this.body.jumping = true;
                }
            } else if (me.input.isKeyPressed('duck')) {
                this.body.removeShapeAt(0);
                // this.body.gravity.y = 1;
                this.body.addShape(new me.Rect(0, 0, this.entityWidth-10, 70));
                // this.body.gravity.y = 0.17;
                // this.body.shapes = [];
                // this.body.addShape(new me.Rect(0, 0, this.entityWidth-10, 85));
                // this.body.shapes[0].points[2].y = 70;
                // this.body.shapes[0].points[3].y = 70;
                this.renderable.setCurrentAnimation("duck");
            } else {
                if(!this.renderable.isCurrentAnimation("walk") && !this.body.jumping && !this.body.falling) {
                    this.body.removeShapeAt(0);
                    // this.body.gravity.y = 1;
                    this.body.addShape(new me.Rect(0, 0, this.entityWidth-10, this.entityHeight));
                    // me.timer.setTimeout(function() {
                        // self.body.gravity.y = 0.17;
                    // }, 500);
                    // this.body.gravity.y = 0.17;
                    // this.body.shapes = [];
                    // this.body.addShape(new me.Rect(0, 0, this.entityWidth-10, this.entityHeight));
                    // self.body.shapes[0].points[2].y = 89;
                    // self.body.shapes[0].points[3].y = 89;
                    this.renderable.setCurrentAnimation("walk");
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
            case me.collision.types.PLAYER_OBJECT:
                return false;
                break;
            case me.collision.types.ENEMY_OBJECT:
                this.alive = false;
                // this.hud.continue = false;
                this.body.vel.x = 0;
                this.body.vel.y = 0;
                // this.renderable.setCurrentAnimation("die");
                // me.audio.play("errou");
                break;
        }
        return true;
    }
});