var NeuralFactory = me.Container.extend({

    init: function(limit, send) {
        var self = this;
        game.alive = false;
        game.ia.alive = true;
        game.ia.reset = false;
        this._super(me.Container, 'init');
        this.limit = limit;
        this.humans = [];
        this.down = [];
        this.layers = [6, 8, 8, 3];
        this.sigma = 0.06;
        this.mutateRate = 0.3;
        this.eliteCount = 3;
        this.hallSize = 5;
        this.spawnX = 80;
        this.send = send !== false;

        for (var i = 0; i < this.limit; i++) {
            var net = this.createNet(i);
            var human = new HumanPlayer(this.spawnX, 300, function(context) {
                if (context.alive) {
                    context.alive = false;
                    context.body.vel.x = 0;
                    context.body.vel.y = 0;
                    self.popDown(context);
                }
            }, function(context) {
                self.control(context);
            }, net, false);
            this.humans.push(human);
            me.game.world.addChild(human, 50);
        }
    },

    sameWeights: function(a, b) {
        if (!a || !b || a.length !== b.length) {
            return false;
        }
        for (var i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) {
                return false;
            }
        }
        return true;
    },

    createNet: function(index) {
        var net = NeuralNetwork.create({
            layers: this.layers,
            activation: 'leakyRelu',
            outputActivation: 'linear'
        });
        var expected = net.parameterCount();
        var hall = game.ia.hall || [];
        if (game.ia.bestWeights && game.ia.bestWeights.length !== expected) {
            game.ia.bestWeights = null;
            game.ia.hall = [];
            game.ia.bestDistance = 0;
            return net;
        }
        if (hall.length === 0) {
            return net;
        }
        if (index === 0 && game.ia.bestWeights) {
            net.setWeights(game.ia.bestWeights);
            return net;
        }
        if (index < this.eliteCount) {
            net.setWeights(hall[Math.min(index, hall.length - 1)].weights);
            return net;
        }
        var parent = hall[me.Math.random(0, hall.length)];
        net.setWeights(parent.weights);
        var sigma = this.sigma;
        if (index % 5 === 0) {
            sigma *= 2;
        }
        net.mutate(sigma, this.mutateRate);
        return net;
    },

    nearestEnemy: function(posHuman) {
        var nearest = null;
        var nearestDist = Infinity;
        for (var i = 0; i < game.enemies.length; i++) {
            var enemy = game.enemies[i];
            if (!enemy || !enemy.pos) {
                continue;
            }
            var dist = enemy.pos.x - posHuman;
            var stillCrossing = dist + (enemy.width || 0) > 0;
            if (stillCrossing && dist < nearestDist) {
                nearestDist = dist;
                nearest = enemy;
            }
        }
        return nearest;
    },

    enemySpeed: function() {
        return Math.max(4 * game.vel.x, 0.001);
    },

    timeToHit: function(context, enemy) {
        if (!enemy) {
            return Infinity;
        }
        var speed = enemy.body && enemy.body.vel ? Math.abs(enemy.body.vel.x) : 0;
        if (speed < 0.1) {
            speed = this.enemySpeed();
        }
        var playerRight = context.pos.x + (context.hitWidth || 54);
        return (enemy.pos.x - playerRight) / speed;
    },

    reactWindow: function(context) {
        var jumpVel = 6;
        if (context && context.body && context.body.maxVel) {
            jumpVel = context.body.maxVel.y;
        }
        var g = Math.max(game.gravityY(), 0.05);
        return (jumpVel / g) * 1.15;
    },

    features: function(context) {
        var enemy = this.nearestEnemy(context.pos.x);
        var distance = game.res.width;
        var width = 0;
        var height = 0;
        var enemyGroundDist = 0;
        if (enemy) {
            distance = enemy.pos.x - context.pos.x;
            width = enemy.width;
            height = enemy.height;
            enemyGroundDist = Math.max(0, game.groundY - (enemy.pos.y + enemy.height));
        }
        return [
            Math.min(1, Math.max(0, distance / game.res.width)),
            width / 80,
            height / 90,
            Math.min(1, enemyGroundDist / 120),
            game.vel.x / 3.5,
            game.gravityY() / 0.28
        ];
    },

    trackedAgent: function() {
        if (this.humans[0] && this.humans[0].alive) {
            return this.humans[0];
        }
        var best = null;
        var i;
        for (i = 0; i < this.humans.length; i++) {
            var human = this.humans[i];
            if (!human || !human.alive) {
                continue;
            }
            if (!best || (human.fitness || 0) > (best.fitness || 0)) {
                best = human;
            }
        }
        return best;
    },

    argmax: function(values) {
        var best = 0;
        for (var i = 1; i < values.length; i++) {
            if (values[i] > values[best]) {
                best = i;
            }
        }
        return best;
    },

    control: function(context) {
        if (!context.alive || !context.net) {
            return;
        }
        var enemy = this.nearestEnemy(context.pos.x);
        var tth = this.timeToHit(context, enemy);
        var window = this.reactWindow(context);
        var input = this.features(context);
        var tracked = this.trackedAgent();
        var inspect = null;
        var output;
        if (context === tracked && context.net && typeof context.net.inspect === 'function') {
            inspect = context.net.inspect(input);
            output = inspect.activations[inspect.activations.length - 1];
        } else {
            output = context.net.predict(input);
        }
        var action = this.argmax(output);
        var high = enemy && enemy.pos.y < 380;
        if (!enemy || tth > window) {
            action = 0;
        }
        if (context.ducking && high && tth <= window) {
            action = 2;
        }
        if (inspect && typeof NeuralViz !== 'undefined') {
            NeuralViz.push({
                layers: inspect.layers,
                activations: inspect.activations,
                weights: context.net.weights,
                biases: context.net.biases,
                action: action,
                fitness: context.fitness || 0,
                generation: game.ia.generation
            });
        }
        var onGround = !context.body.jumping && !context.body.falling;
        if (action === 1) {
            if (onGround) {
                context.runJump();
            }
        } else if (action === 2) {
            if (onGround) {
                context.runDuck();
            }
        } else if (onGround) {
            if (context.ducking || !context.renderable.isCurrentAnimation('walk')) {
                context.runWalk();
            }
        }
    },

    popDown: function(context) {
        this.down.push(context);
        if (this.down.length !== this.limit) {
            return;
        }
        var ranked = this.humans.slice().sort(function(a, b) {
            return (b.fitness || 0) - (a.fitness || 0);
        });
        var bestThis = ranked[0];
        var bestWeights = bestThis.net.getWeights().slice();
        if ((bestThis.fitness || 0) > game.ia.bestDistance) {
            game.ia.bestDistance = bestThis.fitness;
            game.ia.bestWeights = bestWeights.slice();
        }
        var hall = [];
        var i;
        var thisBestFit = bestThis.fitness || 0;
        if (game.ia.bestWeights) {
            hall.push({
                weights: game.ia.bestWeights.slice(),
                fitness: game.ia.bestDistance
            });
        }
        var minKeep = Math.max(thisBestFit * 0.8, (game.ia.bestDistance || 0) * 0.4);
        for (i = 0; i < ranked.length && hall.length < this.hallSize; i++) {
            var fit = ranked[i].fitness || 0;
            if (hall.length >= 2 && fit < minKeep) {
                continue;
            }
            var weights = ranked[i].net.getWeights().slice();
            var duplicate = false;
            for (var h = 0; h < hall.length; h++) {
                if (this.sameWeights(hall[h].weights, weights)) {
                    duplicate = true;
                    break;
                }
            }
            if (!duplicate) {
                hall.push({
                    weights: weights,
                    fitness: fit
                });
            }
        }
        game.ia.hall = hall;
        game.ia.generation++;
        game.ia.reset = true;
        game.enemies = [];
        game.vel.x = 1;
        if (this.send) {
            me.state.change(me.state.NEURALNETWORK2);
        } else {
            me.state.change(me.state.NEURALNETWORK);
        }
    }
});
