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
              // Simulate a platform object
              if (other.type === "platform") {
                  return true;
              }
              break;

            case me.collision.types.ENEMY_OBJECT:
              return true;

            default:
              // Do not respond to other objects (e.g. coins)
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

      // if (this.walkLeft && this.pos.x <= this.startX) {
      //   this.walkLeft = false;
      // }
      // else if (!this.walkLeft && this.pos.x >= this.endX) {
        this.walkLeft = true;
      // }

      // make it walk
      this.renderable.flipX(this.walkLeft);
      this.body.vel.x += (this.walkLeft) ? -this.body.accel.x * me.timer.tick : this.body.accel.x * me.timer.tick;
    // }
    // else {
    //   this.body.vel.x = 0;
    // }

    // update the body movement
    this.body.update(dt);

    // handle collisions against other shapes
    me.collision.check(this);

    // return true if we moved or if the renderable was updated
    return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
  },

  /**
   * colision handler
   * (called when colliding with other objects)
   */
  onCollision : function (response, other) {
    // switch (response.b.body.collisionType) {
    //     case me.collision.types.DIE_OBJECT:
    //     console.log('dieee')
    //       me.game.world.removeChild(this);
    //       return false;
    //       break;
    //   }

      // Make the object solid
      return true;
    // if (response.b.body.collisionType !== me.collision.types.WORLD_SHAPE) {
    //   // res.y >0 means touched by something on the bottom
    //   // which mean at top position for this one
    //   if (this.alive && (response.overlapV.y > 0) && response.a.body.falling) {
    //     this.renderable.flicker(750);
    //   }
    //   return false;
    // }
    // // Make all other objects solid
    // return true;
  }
});