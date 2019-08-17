var PlayScreen = me.Stage.extend( {
    onResetEvent: function() {
         // clear the background
        me.game.world.addChild(new me.ColorLayer("background", "#909090", 0), 0);

        me.levelDirector.loadLevel("area01");

        this.HUD = new HUD.Container();
        me.game.world.addChild(this.HUD);

        me.game.world.addChild(new HumanPlayer(this.HUD));

        // me.game.world.addChild(new EnemyPlayer());
        // Add some objects
        // setInterval(function() {
            // for (var i = 0; i < 50; i++) {
                // me.game.world.addChild(new HumanPlayer(this.HUD));
            // }
        // }, 1000);
    }
});