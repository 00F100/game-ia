
game.HUD = game.HUD || {};

game.HUD.Container = me.Container.extend({

    init: function() {
        // call the constructor
        this._super(me.Container, 'init');

        // persistent across level change
        this.isPersistent = true;

        // make sure we use screen coordinates
        this.floating = true;

        // give a name
        this.name = "HUD";

        // add our child score object at the top left corner
        this.addChild(new game.HUD.enemyCreator());
    }
});

game.HUD.enemyCreator = me.Renderable.extend({
    init: function() {
        this.interval = 0;
    },
    update: function() {
        this.interval++;
        if(this.interval >= 150) {
            this.interval = 0;
            var enemy = me.pool.pull("enemy", 619, 250, {width:64, height: 64});
            me.game.world.addChild(enemy);
        }
                // var enemy = me.pool.pull("enemy", 619, 250, {width:64, height: 64});
                // me.game.world.addChild(enemy);
        return true;
    }
});
