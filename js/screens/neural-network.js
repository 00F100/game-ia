var NeuralNetworkScreen = me.Stage.extend( {

    init: function(send) {
        this.send = send;
        this._super(me.Stage, 'init');
    },

    onResetEvent: function() {
        game.alive = false;
        game.ia.alive = true;
        game.ia.reset = false;
        game.vel.x = 1;
        game.enemies = [];
        game.human.distance = 0;

        this.color = new me.ColorLayer("background", "#ffe2b7", 0);
        this.scoreBoard = new ScoreBoard();
        this.sidewalk = new Sidewalk(0, 10);
        this.enemyFactory = new EnemyFactory(75, 85, 60);
        this.neuralFactory = new NeuralFactory(50, this.send);

        me.game.world.addChild(this.color, 0);
        me.game.world.addChild(this.scoreBoard, 100);
        me.game.world.addChild(this.sidewalk, 10);
        me.game.world.addChild(this.enemyFactory, 60);
        me.game.world.addChild(this.neuralFactory, 60);
        if (typeof NeuralViz !== 'undefined') {
            NeuralViz.show();
        }
    },
    
    
    onDestroyEvent: function() {
        var world = me.game.world;
        var children = [
            this.color,
            this.scoreBoard,
            this.enemyFactory,
            this.neuralFactory,
            this.sidewalk
        ];
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (child && world.hasChild(child)) {
                world.removeChild(child);
            }
        }
        game.enemies = [];
    }
});
