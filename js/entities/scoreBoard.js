var ScoreBoard = me.Container.extend({
    init: function() {
        this._super(me.Container, 'init');
        this.addChild(new ScoreItem());
        this.addChild(new Velocity());
    }
});

var ScoreItem = me.Renderable.extend({
    init: function() {
        this._super(me.Renderable, 'init', [10, 10, 0, 0]);
        this.font = new me.BitmapFont(me.loader.getBinary('PressStart2P'), me.loader.getImage('PressStart2P'));
        this.font.textAlign = "right";
        this.font.textBaseline = "bottom";
        this.distance = 0;
        this.interval = 0;
    },

    update: function() {
        if(game.alive) {
            this.interval++;
            var A = 3 * game.vel.x;
            var T = this.interval / 100;
            this.distance += ((A * T) - this.distance);
            this.velocity  = 0;
        }
    },
    draw: function(renderer) {
        this.font.draw(renderer, 'Distance: ' + parseInt(this.distance), 600, 100);
    }
});

var Velocity = me.Renderable.extend({
    init: function() {
        this._super(me.Renderable, 'init', [10, 10, 0, 0]);
        this.font = new me.BitmapFont(me.loader.getBinary('PressStart2P'), me.loader.getImage('PressStart2P'));
        this.font.textAlign = "right";
        this.font.textBaseline = "bottom";
    },
    update: function() {
        if(game.alive) {
            if(game.vel.x <= 3.5) {
                game.vel.x += 0.001;
            } else {
                game.vel.x = 3.5;
            }
        }
    },
    draw: function(renderer) {
        this.font.draw(renderer, 'Velocity: ' + parseInt(3 * game.vel.x), 600, 150);
    }
});