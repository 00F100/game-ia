(function () {
    'use strict';

    function NNet() {
        var self = this;
        var instances = 5;
        this.initInstances(instances);
        // setInterval(function() {
        //     self.winnerTest(self);
        // }, 2000);
        // this.interval = setInterval(this.init, 100);
        this.init(instances);
    };
    
    window['NNet'] = NNet;

    NNet.prototype = {

        count: 0,
        winner: 0,
        interval: [],
        details: [],

        // Init Runner instances to many tRex
        initInstances: function(c) {
            // this.details.push({
            //     p1: -346,
            //     p2: 367,
            //     p3: -606,
            //     p4: 852,
            //     p5: -820,
            //     p6: -328,
            //     p7: 536,
            //     p8: -542,
            //     p9: 965,
            //     p10: 142
            // });
            for(var i = 0; i < c; i++) {
                new Runner('.interstitial-wrapper');
            }
        },

        // Test/show winner
        winnerTest: function(self) {
            for(var i in runnerInstances) {
                var t = parseInt(runnerInstances[i].distanceMeter.digits.join(""));
                console.log("now: %s distance: %s", i, t);
                if(self.count < t) {
                    self.count = t;
                    self.winner = i;
                }
            }

            console.log("winner: %s (distance: %s) of %s \np1(%s) p2(%s) p3(%s) p4(%s) p5(%s) p6(%s) p7(%s) p8(%s) p9(%s) p10(%s)", self.winner, self.count, runnerInstances.length,
                self.details[self.winner].p1,
                self.details[self.winner].p2,
                self.details[self.winner].p3,
                self.details[self.winner].p4,
                self.details[self.winner].p5,
                self.details[self.winner].p6,
                self.details[self.winner].p7,
                self.details[self.winner].p8,
                self.details[self.winner].p9,
                self.details[self.winner].p10,
                );
        },

        calcCount: function(count) {
            console.log(count);
        },

        init: function(instances) {
            var self = this;
            // var count = 0;
            if(this.details.length == 0) {
                this.details = this.gen(instances);
            }

            for(var i in runnerInstances) {
                // count++;
                self.interval[i] = setInterval(function() {
                    new NNHead(runnerInstances[i], self.details[i])
                    if(runnerInstances[i].crashed == true) {
                        // count--;
                        clearInterval(self.interval[i]);
                        self.calcCount(i);
                    }

                    // distancia percorrida
                    // parseInt(runnerInstances[i].distanceMeter.digits.join(""))

                    // distancia restante
                    // runnerInstances[i].horizon.obstacles[0].xPos

                    // velocidade
                    // runnerInstances[i].currentSpeed

                    // distancia da altura
                    // runnerInstances[i].horizon.obstacles[0].yPos
                }, 200); 
            }

            


        },

        ligacao: {
            p1: null,
            p2: null,
            p3: null,
            p4: null,
            p5: null,
            p6: null,
            p7: null,
            p8: null,
            p9: null,
            p10: null
        },

        gen: function(instances) {
            var ligs = [];
            for(var i = 0; i < instances; i++) {
                var temp = JSON.parse(JSON.stringify(this.ligacao));
                for(var z in this.ligacao) {
                    temp[z] = Math.floor(Math.random() * 1001) * (Math.floor(Math.random() * 1001) <= 500 ? -1 : 1);
                }
                ligs.push(temp);
            }
            return ligs;
        }
    };

    function NNHead(instance, details) {

        if(typeof instance.horizon.obstacles[0] == 'object') {
            
            var neuroA = (instance.horizon.obstacles[0].xPos * details.p1) +
                          (instance.horizon.obstacles[0].yPos * details.p2) +
                          (instance.currentSpeed * details.p3);
            if (neuroA < 0) {
                neuroA = 0;
            }
            
            var neuroB = (instance.horizon.obstacles[0].xPos * details.p4) +
                          (instance.horizon.obstacles[0].yPos * details.p5) +
                          (instance.currentSpeed * details.p6);
            if (neuroB < 0) {
                neuroB = 0;
            }

            // Pular
            var neuroC = (neuroA * details.p7) +
                         (neuroB * details.p8);

            // Abaixar
            var neuroD = (neuroA * details.p9) +
                         (neuroB * details.p10);

            // console.log("A %s, B %s, C %s, D %s", neuroA, neuroB, neuroC, neuroD);

            if(neuroC > 0) {
                instance.tRex.startJump(instance.currentSpeed)
            }

            if(neuroD > 0) {
                // instance.tRex.setDuck(true)
            }
        }
        

// {
//         p1: -1000, // distancia (neuroA)
//         p2: -500, // altura (neuroA)
//         p3: 1000, // velocidade (neuroA)
//         p4: -345, // distancia (neuroB)
//         p5: -953, // altura (neuroB)
//         p6: 198, // velocidade (neuroB)
//         p7: 935, // neuroA > neuroC
//         p8: 500, // neuroB > neuroC
//         p9: -128, // neuroA > neuroD
//         p10: 340 // neuroB > neuroD
//     }

                // distancia restante
                // instance.horizon.obstacles[0].xPos

                // distancia da altura
                // instance.horizon.obstacles[0].yPos

                // velocidade
                // instance.currentSpeed
    }
    window['NNHead'] = NNHead;

    NNHead.prototype = {

    };

})();

function onDocumentLoad() {
    new NNet();
}

document.addEventListener('DOMContentLoaded', onDocumentLoad);