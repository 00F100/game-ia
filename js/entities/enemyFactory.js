var EnemyFactory = me.Container.extend({

    init: function(minDelay, maxDelay, z) {
        this.z = z;
        this._super(me.Container, 'init');
        this.isPersistent = false;
        this.floating = true;
        this.alwaysUpdate = true;
        this.name = "EnemyFactory";
        this.interval = 0;
        this.minDelay = minDelay;
        this.maxDelay = maxDelay;
        this.nextDelay = this.pickDelay();
    },

    pickDelay: function() {
        var extra = this.maxDelay - this.minDelay;
        var speed = Math.max(1, game.vel.x);
        var scaledExtra = Math.round(extra / speed);
        return this.minDelay + me.Math.random(0, scaledExtra + 1);
    },

    update: function() {
        if (game.alive || game.ia.alive) {
            this.interval++;
            if (this.interval >= this.nextDelay) {
                this.interval = 0;
                this.nextDelay = this.pickDelay();
                this.genEnemy();
            }
        }
        return false;
    },

    genEnemy: function() {
        if (me.Math.random(0, 2) === 0) {
            me.game.world.addChild(new EnemyFly(), this.z);
        } else {
            me.game.world.addChild(new EnemyCacti(), this.z);
        }
    }
});
