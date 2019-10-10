var NeuralNetworkScreen = me.Stage.extend( {

    init: function(send) {
        this.send = send;
        this._super(me.Stage, 'init');
    },

    onResetEvent: function() {
        this.color = new me.ColorLayer("background", "#ffe2b7", 0);
        this.scoreBoard = new ScoreBoard();
        this.sidewalk = new Sidewalk(0, 10);
        this.enemyFactory = new EnemyFactory(me.Math.random(75, 150), 60);
        this.neuralFactory = new NeuralFactory(50, 10, 100, 10, 4, 5, 3, this.send);

        me.game.world.addChild(this.color, 0);
        me.game.world.addChild(this.scoreBoard, 100);
        me.game.world.addChild(this.sidewalk, 10);
        me.game.world.addChild(this.enemyFactory, 60);
        me.game.world.addChild(this.neuralFactory, 60);
    },
    
    
    onDestroyEvent: function() {
        me.game.world.removeChild(this.color);
        me.game.world.removeChild(this.scoreBoard);
        me.game.world.removeChild(this.enemyFactory);
    }
});