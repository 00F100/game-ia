var Start = me.Renderable.extend({

    init: function(x, zi, ze, z) {
        this._super(me.Renderable, "init", [0, 0, 600, 10]);

        this.font = new me.BitmapFont(me.loader.getBinary('PressStart2P'), me.loader.getImage('PressStart2P'));
        this.font.textAlign = "center";
        this.font.textBaseline = "bottom";

        this.font2 = new me.BitmapFont(me.loader.getBinary('PressStart2P'), me.loader.getImage('PressStart2P'));
        this.font2.textAlign = "left";
        this.font2.textBaseline = "bottom";

        
    },

    update: function(dt) {
        if (me.input.isKeyPressed('jump')) {
            me.state.change(me.state.PLAY);
        }
    },

    draw: function(renderer) {
        this.font.draw(renderer, 'ET BILU', 600, 130);
        this.font2.draw(renderer, '[X] play alone', 400, 230);
        this.font2.draw(renderer, '[ ] vs IA', 400, 260);
        this.font2.draw(renderer, '[ ] see IA', 400, 290);
        this.font.draw(renderer, 'PRESS SPACE TO START', 600, 380);
    }
});