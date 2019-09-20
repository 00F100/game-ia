var Start = me.Renderable.extend({

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

        me.input.bindKey(me.input.KEY.ENTER, "start", true);
        me.input.bindKey(me.input.KEY.DOWN, "change-down", true);
        me.input.bindKey(me.input.KEY.UP, "change-up", true);
    },

    update: function(dt) {
        if (me.input.isKeyPressed("start")) {
            // me.state.change(me.state.PLAY);
            switch(this.selected) {
                case 0:
                    me.state.change(me.state.PLAY);
                    break;
                case 1:
                    break;

                case 2:
                    me.state.change(me.state.NEURALNETWORK);
                    break;
            }
        } else if (me.input.isKeyPressed("change-down")) {
            this.selected++;
        } else if (me.input.isKeyPressed("change-up")) {
            this.selected--;
        }
        if(this.selected > this.limit) {
            this.selected = 0;
        } else if(this.selected < 0) {
            this.selected = this.limit;
        }
    },

    draw: function(renderer) {
        this.font.draw(renderer, 'ET BILU', 600, 130);
        this.font2.draw(renderer, '[' + (this.selected == 0 ? 'X' : ' ') +'] play alone', 400, 230);
        this.font2.draw(renderer, '[' + (this.selected == 1 ? 'X' : ' ') +'] vs AI', 400, 260);
        this.font2.draw(renderer, '[' + (this.selected == 2 ? 'X' : ' ') +'] see AI', 400, 290);
        this.font.draw(renderer, 'PRESS ENTER TO START', 600, 380);
    }
});