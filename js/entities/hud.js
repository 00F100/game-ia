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
        this.addChild(new HUD.EnemySpawn());
        this.addChild(new HUD.FaustoComment());
    }
});

HUD.EnemySpawn = me.Renderable.extend( {
    init: function() {
        this.interval = 0;
        this.continue = true;
        this.pos = {};
    },

    update : function () {
        this.interval++;
        if(this.interval >= me.Math.random(100, 100) && this.continue) {
            this.interval = 0;
            me.game.world.addChild(new EnemyPlayer(this));
        }
    }

});

HUD.FaustoComment = me.Renderable.extend({
    init: function() {
        this.interval = 0;
        this.audio = [
            {name: 'olokinho-meu'},
            {name: 'porra-meu-ala'},
            {name: 'frango'},
            {name: 'vai-morre'},
            {name: 'eita'},
            {name: 'vilma'}
        ];
    },

    update: function() {
        this.interval++;
        if(this.interval > 400) {
            me.audio.play(this.audio[me.Math.random(0,5)].name);
            this.interval = 0;
        }
    }
});