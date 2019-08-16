var PlayScreen = me.Stage.extend( {
    onResetEvent: function() {
         // clear the background
        me.game.world.addChild(new me.ColorLayer("background", "#909090", 0), 0);

        me.levelDirector.loadLevel("area01");

        // Add some objects
        // for (var i = 0; i < 100; i++) {
            me.game.world.addChild(new Player());
        // }
    }
});