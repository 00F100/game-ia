var PlayScreen = me.ScreenObject.extend( {

    init: function() {
        this._super(me.ScreenObject, 'init');
    },

    onResetEvent: function() {
        me.game.world.addChild(new me.ColorLayer("background", "#ffe2b7", 0), 0);
        me.game.world.addChild(new Sidewalk(0, 10), 10);
        me.game.world.addChild(new Cacti(0, 100, 1000, 10), 10);
        me.game.world.addChild(new Plant(0, 500, 1000, 10), 10);
        me.game.world.addChild(new Cloud(0, 80, 1000, 10), 10);
        me.game.world.addChild(new HumanPlayer(), 50);
        me.game.world.addChild(new EnemyGenerate(90, 60), 60);
        me.game.world.addChild(new ScoreBoard(), 100);
    },
    
    
    onDestroyEvent: function() {
        me.game.world.removeChild(this.sidewalk);
        me.game.world.removeChild(this.colorContent);
    }
});