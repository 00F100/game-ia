var End = me.Renderable.extend({

    init: function(x, zi, ze, z) {
        this._super(me.Renderable, "init", [0, 0, 600, 10]);

        this.font = new me.BitmapFont(me.loader.getBinary('PressStart2P'), me.loader.getImage('PressStart2P'));
        this.font.textAlign = "center";
        this.font.textBaseline = "bottom";

        this.font2 = new me.BitmapFont(me.loader.getBinary('PressStart2P'), me.loader.getImage('PressStart2P'));
        this.font2.textAlign = "left";
        this.font2.textBaseline = "bottom";

        this.selected = 0;
        this.limit = 2;

        me.input.bindKey(me.input.KEY.ENTER, "restart", true);
        me.input.bindKey(me.input.KEY.DOWN, "change-down", true);
        me.input.bindKey(me.input.KEY.UP, "change-up", true);
    },

    update: function(dt) {
        if (me.input.isKeyPressed("restart")) {
            me.state.change(me.state.WELCOME);
        }
    },

    draw: function(renderer) {
        this.font.draw(renderer, 'ET BILU', 600, 130);
        this.font.draw(renderer, 'GAME OVER', 600, 230);
        this.font.draw(renderer, 'PRESS ENTER TO RETURN', 600, 330);
        this.font.draw(renderer, 'Distance: ' + game.human.distance, 600, 400);
        this.font.draw(renderer, 'Velocity: ' + game.human.velocity, 600, 430);
    }
});