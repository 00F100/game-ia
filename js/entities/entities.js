var HumanPlayer = me.Entity.extend({
    init : function (hud) {
        this.hud = hud;
        this._super(
            me.Entity,
            "init",
            [
                20, 0,
                {
                    width : 32,
                    height : 64,
                    shapes : [ new me.Rect(0, 0, 32, 64) ],
                    framewidth: 32,
                    frameheight: 64
                }
            ]
        );

        this.body.setVelocity(0,17);

        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH, 0.4);

        this.alwaysUpdate = true;

        this.renderable = new me.Sprite(0, 0, {
            image: me.loader.getImage(game.assets[0].name),
            framewidth: 64,
            frameheight: 64
        });

        this.renderable.addAnimation("walk",  [0, 1, 2, 3, 4, 5, 6, 7]);

        this.renderable.setCurrentAnimation("walk");

        this.body.collisionType = me.collision.types.PLAYER_OBJECT
    },

    update : function (dt) {

        this.body.vel.x = 0;

        if(this.alive) {
            if (me.input.isKeyPressed('jump'))
            {
                if (!this.body.jumping && !this.body.falling)
                {
                    // set current vel to the maximum defined value
                    // gravity will then do the rest
                    this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
                    // set the jumping flag
                    this.body.jumping = true;
                }
            }
        } else {
            console.log(this.body);
        }

        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // return true if we moved or if the renderable was updated
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },

    // collision handler
    onCollision : function (response) {
        switch (response.b.body.collisionType) {
            case me.collision.types.WORLD_SHAPE:
                return true;
                break;

            case me.collision.types.ENEMY_OBJECT:
                this.alive = false;
                this.hud.continue = false;
                break;
        }
        return false;
    }
});

var EnemyObject = me.Entity.extend({
    init: function(hud) {
        this.hud = hud;
        this._super(
            me.Entity,
            "init",
            [
                640, 350,
                {
                    width : 50,
                    height : 64,
                    shapes : [ new me.Rect(0, 0, 50, 64) ],
                    framewidth: 64,
                    frameheight: 64
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

        this.walkLeft = true;
        this.renderable.flipX(true);
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
                return true;
                break;
        }
        return false;
    }
});





var HUD = {};


HUD.Container = me.Container.extend({

    init: function() {
        // call the constructor
        this._super(me.Container, 'init');

        // persistent across level change
        this.isPersistent = true;

        // make sure we use screen coordinates
        this.floating = true;

        // give a name
        this.name = "HUD";

        // add our child score object
        this.addChild(new HUD.Creator());
    }
});


/**
 * a basic HUD item to display score
 */
HUD.Creator = me.Renderable.extend( {
    /**
     * constructor
     */
    init: function() {
        this.interval = 0;
        this.continue = true;
    },

    /**
     * update function
     */
    update : function () {
        this.interval++;
        if(this.interval >= me.Math.random(50, 150) && this.continue) {
            this.interval = 0;
            me.game.world.addChild(new EnemyObject(this));
        }
    }

});
