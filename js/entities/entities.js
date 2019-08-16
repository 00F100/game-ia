/**
 * Player Entity
 */
game.PlayerEntity = me.Entity.extend({

    /**
     * constructor
     */
    init:function (x, y, settings) {

        settings.image = "gripe_run_right";

        // save the area size defined in Tiled
        var width = settings.width;
        var height = settings.height;

        // adjust the size setting information to match the sprite size
        // so that the entity object is created with the right size
        settings.framewidth = settings.width = 64;
        settings.frameheight = settings.height = 64;

        // call the constructor
        this._super(me.Entity, 'init', [x, y , settings]);

        // set the default horizontal & vertical speed (accel vector)
        this.body.setVelocity(0, 16);

        // set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;

        // define a basic walking animation (using all frames)
        this.renderable.addAnimation("walk",  [0, 1, 2, 3, 4, 5, 6, 7]);

        // define a standing animation (using the first frame)
        // this.renderable.addAnimation("stand",  [0]);

        // set the standing animation as default
        this.renderable.setCurrentAnimation("walk");
    },

    /**
     * update the entity
     */
    update : function (dt) {

        if (me.input.isKeyPressed('jump')) {
          if (!this.body.jumping && !this.body.falling) {
            this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
            this.body.jumping = true;
          }
        }
        this.body.update(dt);
        me.collision.check(this);
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },

   /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (response, other) {
        // Make all other objects solid
        switch (response.b.body.collisionType) {
            case me.collision.types.WORLD_SHAPE:
              return true;
              break;

            case me.collision.types.ENEMY_OBJECT:
              return false;
          }

          // Make the object solid
          return true;
    }
});


game.EnemyEntity = me.Entity.extend({
  init: function (x, y, settings) {
    // define this here instead of tiled
    settings.image = "wheelie_right";

    // save the area size defined in Tiled
    var width = settings.width;
    var height = settings.height;

    // adjust the size setting information to match the sprite size
    // so that the entity object is created with the right size
    settings.framewidth = settings.width = 64;
    settings.frameheight = settings.height = 64;

    // redefine the default shape (used to define path) with a shape matching the renderable
    // settings.shapes[0] = new me.Rect(0, 0, settings.framewidth, settings.frameheight);

    // call the parent constructor
    this._super(me.Entity, 'init', [x, y , settings]);

    // set start/end position based on the initial area size
    // x = this.pos.x;
    // this.startX = x;
    // this.endX   = x + width - settings.framewidth
    // this.pos.x  = x + width - settings.framewidth;

    // to remember which side we were walking
    // this.walkLeft = true;

    // walking & jumping speed
    this.body.setVelocity(6, 6);

  },

  /**
   * update the enemy pos
   */
  update : function (dt) {


    this.body.vel.x += (this.walkLeft) ? -this.body.accel.x * me.timer.tick : this.body.accel.x * me.timer.tick;
    this.pos.add(this.body.vel);

    // world limit check
    if (this.pos.x >= 1024) {
        this.pos.x = -15;
    }
    if (this.pos.x < -15) {
        this.pos.x = 1024 - 1;
    }
    if (this.pos.y >= 768) {
        this.pos.y = -15;
    }
    if (this.pos.y < -15) {
        this.pos.y = 768 - 1;
    }

      // if (this.walkLeft && this.pos.x <= this.startX) {
      //   this.walkLeft = false;
      // }
      // else if (!this.walkLeft && this.pos.x >= this.endX) {
        this.walkLeft = true;
      // }

      // make it walk
      // this.renderable.flipX(this.walkLeft);
    // }
    // else {
    //   this.body.vel.x = 0;
    // }

    // update the body movement
    this.body.update(dt);

    // handle collisions against other shapes
    me.collision.check(this);

    // return true if we moved or if the renderable was updated
    return true;
  },

  /**
   * colision handler
   * (called when colliding with other objects)
   */
  onCollision : function (response, other) {

    switch (response.b.body.collisionType) {
      case me.collision.types.WORLD_SHAPE:
        return true;
        break;

      case me.collision.types.ENEMY_OBJECT:
        if (this.alive) {
          this.renderable.flicker(750);
        }
        return false;
    }

  return true;
  // if (response.b.body.collisionType !== me.collision.types.WORLD_SHAPE) {
    //   // res.y >0 means touched by something on the bottom
    //   // which mean at top position for this one
    //   return false;
    // }
    // // Make all other objects solid
    // return true;
  }
});

var Smilie = me.Entity.extend({
    init : function (i) {
        this._super(
            me.Entity,
            "init",
            [
                me.Math.random(-15, 1024),
                me.Math.random(-15, 768),
                {
                    width : 16,
                    height : 16,
                    shapes : [ new me.Ellipse(4, 4, 8, 8) ]
                }
            ]
        );

        // disable gravity and add a random velocity
        this.body.gravity = 0;
        this.body.vel.set(me.Math.randomFloat(-4, 4), me.Math.randomFloat(-4, 4));

        this.alwaysUpdate = true;

        // add the coin sprite as renderable
        this.renderable = new me.Sprite(0, 0, {image: me.loader.getImage('data/sfx/sprite/wheelie_right.png')});
    },

    update : function () {
        this.pos.add(this.body.vel);

        // world limit check
        if (this.pos.x >= 1024) {
            this.pos.x = -15;
        }
        if (this.pos.x < -15) {
            this.pos.x = 1024 - 1;
        }
        if (this.pos.y >= 768) {
            this.pos.y = -15;
        }
        if (this.pos.y < -15) {
            this.pos.y = 768 - 1;
        }

        if (me.collision.check(this)) {
            // me.collision.check returns true in case of collision
            this.renderable.setOpacity(1.0);
        }
        else {
            this.renderable.setOpacity(0.5);
        }
        return true;
    },

    // collision handler
    onCollision : function (response) {

        this.pos.sub(response.overlapN);
        if (response.overlapN.x !== 0) {
            this.body.vel.x = me.Math.randomFloat(-4, 4) * -Math.sign(this.body.vel.x);
        }
        if (response.overlapN.y !== 0) {
            this.body.vel.y = me.Math.randomFloat(-4, 4) * -Math.sign(this.body.vel.y);
        }

        return false;
    }
});