var NeuralFactory = me.Container.extend({

    init: function() {
        this.runner = false;
        game.ia.generation = 1;
        this.limit = 50;
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
                }, function(context) {
                    if(context.alive) {
                        var width = 0;
                        var height = 0;
                        var distance = 0;
                        var ID = context.body.ancestor.GUID;
                        var posHuman = context.body.ancestor.pos._x;
                        for(var i in game.enemies) {
                            distance = game.enemies[i].ancestor.pos._x - posHuman;
                            if(distance > 0) {
                                width = game.enemies[i].width;
                                height = game.enemies[i].height;
                                break;
                            }
                        }

                        var neural = NeuralNetwork.exec(context, [], [
                            distance,
                            width,
                            height,
                            (4 * game.vel.x), 
                            context.body.gravity.y
                        ], 2, 8, 3, function(output) {
                            if(output[0] == 1) {
                                if (!context.body.jumping && !context.body.falling) {
                                    context.runJump();
                                }
                            } else if(output[2] == 1) {
                                context.runDuck();
                            }
                        });
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