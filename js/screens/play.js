var PlayScreen = me.Stage.extend( {
    onResetEvent: function() {
        me.game.world.addChild(new me.ColorLayer("background", "#ffe2b7", 0), 0);
        me.game.world.addChild(new Cacti(0, 100, 1000, 1), 1);
        me.game.world.addChild(new Plant(0, 100, 1000, 1), 1);
        me.game.world.addChild(new Cloud(0, 100, 1000, 1), 1);
        me.game.world.addChild(new HumanPlayer(), 20);
        me.game.world.addChild(new Sidewalk(), 60);
        // me.game.world.addChild(new EnemyCacti(), 30);
    },
    
    
    onDestroyEvent: function() {
        me.game.world.removeChild(this.sidewalk);
        me.game.world.removeChild(this.colorContent);
    }
});