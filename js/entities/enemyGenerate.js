var EnemyGenerate = me.Container.extend({

    init: function(limit) {
        this._super(me.Container, 'init');
        this.isPersistent = true;
        this.floating = true;
        this.name = "EnemyGenerate";
        this.interval = 0;
        this.limit = limit;
        this.hasEnemy = false;
    },
    update: function() {
        if(this.interval >= this.limit) {
            if(me.Math.random(1, 3)%2 == 0) {
                this.interval = 0;
                this.genEnemy();
            }
        }
        this.interval++;
    },

    genEnemy: function() {
        if(me.Math.random(1, 3)%2 == 0) {
            me.game.world.addChild(new EnemyFly(), 2);
        } else {
            me.game.world.addChild(new EnemyCacti(), 2);
            // if(me.Math.random(1, 3)%2 == 0) {

            // } else {

            // }
        }
    }
});