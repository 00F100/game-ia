var NeuralFactory = me.Container.extend({

    init: function() {
        this.runner = false;
        game.ia.generation = 1;
        this.limit = 10;
        game.alive = false;
        game.ia.alive = true;
        this._super(me.Container, 'init');
    },

    update: function(dt) {
        var self = this;
        if(!this.runner) {
            this.down = [];
            this.runner = true;
            game.ia.alive = true;
            for(var i = 0; i < this.limit; i++) {
                var human = new HumanPlayer(me.Math.random(5, 150), 300, function(context) {
                    if(context.alive) {
                        context.alive = false;
                        context.body.vel.x = 0;
                        context.body.vel.y = 0;
                        context.distance = game.human.distance;
                        self.popDown(context);
                    }
                });
                me.game.world.addChild(human, 50);
            }
        }
    },

    popDown: function(context) {
        this.down.push(context);
        if(this.down.length == this.limit) {
            game.ia.generation++;
            // game.vel.x = 1;
            // game.ia.reset = true;
            this.runner = false;
        }
    }
});