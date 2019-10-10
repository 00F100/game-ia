var NeuralFactory = me.Container.extend({

    init: function(limit, minChange, maxChange, propChanges, neuralColumns, neuralRows, neuralOutputs, send = true) {
        var self = this;
        this.firstFix = true;
        this.send = send;
        this.limit = limit;
        game.alive = false;
        game.ia.alive = true;
        this._super(me.Container, 'init');
        this.humans = [];
        this.down = [];
        game.ia.alive = true;
        this.minChange = minChange;
        this.maxChange = maxChange;
        this.totalWeight = this.getPosbKeys(6, neuralColumns, neuralRows, neuralOutputs);
        this.limitChanges = parseInt(this.totalWeight / propChanges);
        this.neuralColumns = neuralColumns;
        this.neuralRows = neuralRows;
        this.neuralOutputs = neuralOutputs;
        var localMatrix = [];
        for(var i = 0; i < this.limit; i++) {
            var matrix = this.fixMatrix();
            localMatrix.push(matrix);
        }
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
            }, function(context, zmatrix) {
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
                    var neural = NeuralNetwork.exec(context, zmatrix, [
                        distance,
                        width,
                        height,
                        altitude,
                        (4 * game.vel.x), 
                        context.body.gravity.y
                    ], self.neuralColumns, self.neuralRows, self.neuralOutputs, function(output) {
                        if(output[0] == 1 && output[1] == 0 && output[2] == 0) {
                            if (!context.body.jumping && !context.body.falling) {
                                context.runJump();
                            }
                        } else if(output[0] == 0 && output[1] == 1 && output[2] == 0) {
                            context.runDuck();
                        }
                    });
                }
            }, lmatrix);
            this.humans.push(human);
            me.game.world.addChild(human, 50);
        }
    },

    fixMatrix: function() {
        if(game.ia.weightSeq != undefined) {
            // console.log(typeof game.ia.weightSeq)
            var matrix = this.clone(game.ia.weightSeq);
            // matrix = Object.values(matrix);
            if(this.firstFix) {
                this.firstFix = false;
            } else {
                var possibilities = this.getPossibilities([]);
                if(possibilities.length > 0) {
                    for(var i in possibilities) {
                        matrix[possibilities[i]] = (matrix[possibilities[i]] + me.Math.random(this.minChange, this.maxChange)) * (me.Math.random(0,3)%2 == 0 ? -1 : 1);
                    }
                }
            }
            return matrix;
        } else {
            return [];
        }
    },

    clone: function(obj) {
        if (null == obj || "object" != typeof obj) return obj;
        var copy = obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return Object.values(copy);
    },

    getPossibilities: function(list) {
        if(this.limitChanges > 0) {
            var doContinue = true;
            do {
                var weight = me.Math.random(0, this.totalWeight);
                if(!this.inArray(weight, list) && list.length < this.limitChanges) {
                    list.push(weight);
                }
                if(list.length >= this.limitChanges) {
                    doContinue = false;
                }
            } while(doContinue);
        }
        return list;
    },

    inArray: function(needle, haystack) {
        var length = haystack.length;
        for(var i = 0; i < length; i++) {
            if(haystack[i] == needle) return true;
        }
        return false;
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
            game.ia.weightSeq = this.humans[this.winner].weightSeq;
            console.log("winner");
            console.log(game.ia.weightSeq);
            game.ia.generation++;
            game.enemies = [];
            game.vel.x = 1;
            if(this.send) {
                me.state.change(me.state.NEURALNETWORK2);
            } else {
                me.state.change(me.state.NEURALNETWORK);
            }
        }
    },

    getPosbKeys: function(inputs, columns, rows, outputs) {
        var value = 0;
        for(var i = 0; i < (columns-2); i++) {
            value = value + (rows * rows);
        }
        return (inputs * rows) + value + (rows * outputs);
    },
});