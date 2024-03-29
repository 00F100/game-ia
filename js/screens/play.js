var PlayScreen = me.Stage.extend( {

    init: function() {
        this._super(me.Stage, 'init');
    },

    onResetEvent: function() {
        
        this.color = new me.ColorLayer("background", "#ffe2b7", 0);
        this.scoreBoard = new ScoreBoard();
        this.sidewalk = new Sidewalk(0, 10);
        this.cacti = new Cacti(0, 100, 1000, 10);
        this.plant = new Plant(0, 500, 1000, 10);
        this.cloud = new Cloud(0, 80, 1000, 10);
        this.humanPlayer = new HumanPlayer(30, 300, function(context) {
            context.alive = false;
            context.body.vel.x = 0;
            context.body.vel.y = 0;
            game.alive = false;
            game.vel.x = 1;
            me.state.change(me.state.GAMEOVER);
        });
        this.enemyFactory = new EnemyFactory(75, 60);

        me.game.world.addChild(this.color, 0);
        me.game.world.addChild(this.scoreBoard, 100);
        me.game.world.addChild(this.sidewalk, 10);
        me.game.world.addChild(this.cacti, 10);
        me.game.world.addChild(this.plant, 10);
        me.game.world.addChild(this.cloud, 10);
        me.game.world.addChild(this.humanPlayer, 50);
        me.game.world.addChild(this.enemyFactory, 60);
    },
    
    
    onDestroyEvent: function() {
        me.game.world.removeChild(this.color);
        me.game.world.removeChild(this.scoreBoard);
        me.game.world.removeChild(this.humanPlayer);
        me.game.world.removeChild(this.enemyFactory);
    }
});