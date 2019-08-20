var PlayScreen = me.Stage.extend( {
    onResetEvent: function() {

        this.sidewalk = new Sidewalk();
        this.colorContent = new me.ColorLayer("background", "#909090", 0);

        me.game.world.addChild(this.sidewalk);
        me.game.world.addChild(this.colorContent, 0);
        me.game.world.addChild(new Cacti());
        me.game.world.addChild(new HumanPlayer());
        me.game.world.addChild(new EnemyCacti());
    },
    
    
    onDestroyEvent: function() {
        me.game.world.removeChild(this.sidewalk);
        me.game.world.removeChild(this.colorContent);
    }
});