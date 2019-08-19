// var HUD = {};

// HUD.Container = me.Container.extend({

//     init: function() {
//         // call the constructor
//         this._super(me.Container, 'init');

//         // persistent across level change
//         this.isPersistent = true;

//         // make sure we use screen coordinates
//         this.floating = true;

//         // give a name
//         this.name = "HUD";

//         // add our child score object
//         // this.addChild(new HUD.EnemySpawn());
//         // this.addChild(new HUD.FaustoComment());
//         // this.addChild(new HUD.LevelChange());
//     }
// });

// // HUD.EnemySpawn = me.Renderable.extend( {
// //     init: function() {
// //         this.interval = 0;
// //         this.continue = true;
// //         this.pos = {};
// //     },

// //     update : function () {
// //         this.interval++;
// //         if(this.interval >= me.Math.random((game.now.x > 10 ? 20 : 80), (game.now.x > 10 ? 400 : 200)) && this.continue) {
// //             this.interval = 0;
// //             me.game.world.addChild(new EnemyPlayer(this));
// //         }
// //     }

// // });

// // HUD.LevelChange = me.Renderable.extend({
// //     init: function() {
// //         this.interval = 0;
// //     },

// //     update: function() {
// //         this.interval++;
// //         if(this.interval >= 100 && game.now.x <= 12) {
// //             game.vel.x = game.vel.x + 0.0005;
// //         }
// //     }
// // });

// // HUD.FaustoComment = me.Renderable.extend({
// //     init: function(hud) {
// //         this.hud = hud;
// //         this.interval = 0;
// //         this.audio = [
// //             {name: 'olokinho-meu'},
// //             {name: 'porra-meu-ala'},
// //             {name: 'frango'},
// //             {name: 'vai-morre'},
// //             {name: 'eita'},
// //             {name: 'vilma'}
// //         ];
// //     },

// //     update: function() {
// //         this.interval++;
// //         if(this.interval > 400) {
// //             me.audio.play(this.audio[me.Math.random(0,5)].name);
// //             this.interval = 0;
// //         }
// //     }
// // });