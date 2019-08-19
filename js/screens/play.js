var PlayScreen = me.Stage.extend( {
    onResetEvent: function() {

        me.game.world.addChild(new me.ColorLayer("background", "#909090", 0), 0);
        me.game.world.addChild(new Sidewalk());
        me.game.world.addChild(new Cacti());
        me.game.world.addChild(new HumanPlayer());
        me.game.world.addChild(new EnemyCacti());
    }
});