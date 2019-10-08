var NeuralFactory = me.Container.extend({

    init: function(send = true) {
        var self = this;
        this.send = send;
        this.limit = 30;
        game.alive = false;
        game.ia.alive = true;
        this._super(me.Container, 'init');
        this.humans = [];
        this.down = [];
        game.ia.alive = true;
        var localMatrix = [];
        for(var i = 0; i < this.limit; i++) {
            // console.log(this.fixMatrix());
            var matrix = this.fixMatrix();
            console.log(matrix);
            localMatrix.push(matrix);
        }
        console.log(localMatrix);
        for(var i = 0; i < this.limit; i++) {
            var lmatrix = localMatrix[i];
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
                    var altitude = 0;
                    var ID = context.body.ancestor.GUID;
                    var posHuman = context.body.ancestor.pos._x;
                    for(var i in game.enemies) {
                        if(game.enemies[i].ancestor != undefined) {
                            distance = game.enemies[i].ancestor.pos._x - posHuman;
                            if(distance > 0) {
                                width = game.enemies[i].width;
                                height = game.enemies[i].height;
                                altitude = game.res.height - game.enemies[i].ancestor.pos._y;
                            }
                        }
                    }

                    var neural = NeuralNetwork.exec(context, lmatrix, [
                        distance,
                        width,
                        height,
                        altitude,
                        (4 * game.vel.x), 
                        context.body.gravity.y
                    ], 3, 5, 3, function(output) {
                        if(output[0] == 1 && output[1] == 0 && output[2] == 0) {
                            if (!context.body.jumping && !context.body.falling) {
                                context.runJump();
                            }
                        } else if(output[0] == 0 && output[1] == 1 && output[2] == 0) {
                            context.runDuck();
                        }
                    });
                }
            });
            this.humans.push(human);
            me.game.world.addChild(human, 50);
        }
    },

    fixMatrix: function() {
        if(game.ia.weightSeq != undefined) {
            var matrix = Object.assign({}, game.ia.weightSeq);
            var count = 0;
            var limit = 50;
            for(var i in matrix) {
                if(me.Math.random(1, 3)%2 == 0 && count < limit) {
                    matrix[i] = (matrix[i] + me.Math.random(10, 200)) * (me.Math.random(1, 3)%2 == 0 ? -1 : 1);
                    count++;
                }
            }
            return matrix;
        } else {
            return [];
        }
    },

    update: function(dt) {
        var total = [];
        for(var i in this.humans) {
            var human = this.humans[i];
            total[i] = human.distance + '.' + i;
        }
        total.sort(function(a, b){return b-a});
        var current = total[0].split('.');
        this.winner = current[1];
    },

    popDown: function(context) {
        this.down.push(context);
        if(this.down.length == this.limit) {
        // console.log(this.humans[this.winner].weightSeq);
            game.ia.weightSeq = this.humans[this.winner].weightSeq;
            game.ia.generation++;
            game.enemies = [];
            game.vel.x = 1;
            if(this.send) {
                me.state.change(me.state.NEURALNETWORK2);
            } else {
                me.state.change(me.state.NEURALNETWORK);
            }
        }
    }
});