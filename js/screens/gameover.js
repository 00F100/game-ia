var Gameover = me.ScreenObject.extend( {

    init: function() {
        this._super(me.ScreenObject, 'init');
    },

    onResetEvent: function() {
        this.color = new me.ColorLayer("background", "#ffe2b7", 0);
        this.fade = new me.ColorLayer("background", "#000000", 0);
        this.fade.setOpacity(0.4);
        this.sidewalk = new Sidewalk(0, 10);
        this.cacti = new Cacti(0, 100, 1000, 10);
        this.plant = new Plant(0, 500, 1000, 10);
        this.cloud = new Cloud(0, 80, 1000, 10);
        this.end = new End();
        game.alive = true;

        me.game.world.addChild(this.color, 0);
        me.game.world.addChild(this.sidewalk, 10);
        me.game.world.addChild(this.cacti, 10);
        me.game.world.addChild(this.plant, 10);
        me.game.world.addChild(this.cloud, 10);
        me.game.world.addChild(this.fade, 20);
        me.game.world.addChild(this.end, 30);
        
    },
    
    onDestroyEvent: function() {
        me.game.world.removeChild(this.color);
        me.game.world.removeChild(this.fade);
    }
});