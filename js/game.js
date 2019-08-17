var game = {
    // game assets
    assets : [
        { name: "player", type:"image", src:"data/img/sprite/gripe_run_right.png" },
        { name: "enemy", type:"image", src:"data/img/sprite/wheelie_right.png" },
        { name: "area01map", type:"image", src:"data/img/map/area01_level_tiles.png" },
        { name: "area01map", type:"image", src:"data/img/map/area01_level_tiles.png" },
        { name: "area01map", type:"image", src:"data/img/map/area01_level_tiles.png" },
        { name: "PressStart2P", type:"image", src: "data/fnt/PressStart2P.png" },
        { name: "PressStart2P", type:"binary", src: "data/fnt/PressStart2P.fnt"},
        { name: "area01", type:"tmx", src:"data/map/area01.tmx" },
        { name: "errou", type: "audio", src: "data/bgm/"},
        { name: "olokinho-meu", type: "audio", src: "data/bgm/"},
        { name: "porra-meu-ala", type: "audio", src: "data/bgm/"},
        { name: "frango", type: "audio", src: "data/bgm/"},
        { name: "vai-morre", type: "audio", src: "data/bgm/"},
        { name: "eita", type: "audio", src: "data/bgm/"},
        { name: "vilma", type: "audio", src: "data/bgm/"},
    ],

    onload: function()
    {
        if (!me.video.init(640, 480, {wrapper : "screen", scale : "auto"})) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        me.loader.onload = this.loaded.bind(this);

        me.audio.init("mp3,ogg");

        // me.loader.preload(game.assets, this.loaded.bind(this));
        me.loader.preload(game.assets);
    },

    loaded: function () {
        me.state.set(me.state.PLAY, new PlayScreen());
        me.state.set(me.state.PLAY, new PlayScreen());
        me.state.set(me.state.PLAY, new PlayScreen());

        me.input.bindKey(me.input.KEY.UP, "jump", true);
        me.input.bindKey(me.input.KEY.SPACE, "jump", true);

        me.state.change(me.state.PLAY);
    }
};
