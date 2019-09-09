var game = {

    res: {
        width: 640,
        height: 480
    },

    alive: true,

    vel: {
        x: 1,
        y: 0
    },

    // now: {
    //     x: 0,
    //     y: 0
    // },

    // game assets
    assets : [
        // { name: "player", type:"image", src:"data/img/sprite/player.png" },
        // { name: "enemy", type:"image", src:"data/img/sprite/wheelie_right.png" },
        // { name: "area01map", type:"image", src:"data/img/map/area01_level_tiles.png" },
        // { name: "testmap", type:"image", src:"data/img/map/test.png" },
        // { name: "PressStart2P", type:"image", src: "data/fnt/PressStart2P.png" },
        // { name: "PressStart2P", type:"binary", src: "data/fnt/PressStart2P.fnt"},
        // { name: "area01", type:"tmx", src:"data/map/area01.tmx" },
        // { name: "errou", type: "audio", src: "data/bgm/"},
        // { name: "olokinho-meu", type: "audio", src: "data/bgm/"},
        // { name: "porra-meu-ala", type: "audio", src: "data/bgm/"},
        // { name: "frango", type: "audio", src: "data/bgm/"},
        // { name: "vai-morre", type: "audio", src: "data/bgm/"},
        // { name: "eita", type: "audio", src: "data/bgm/"},
        // { name: "vilma", type: "audio", src: "data/bgm/"},
        { name: "sidewalk", type:"image", src:"data/img/sidewalk.png" },
        { name: "cacti", type:"image", src:"data/img/cacti.png" },
        { name: "plant1", type:"image", src:"data/img/plant1.png" },
        { name: "cloud1", type:"image", src:"data/img/cloud1.png" },
        { name: "cloud2", type:"image", src:"data/img/cloud2.png" },
        { name: "cloud3", type:"image", src:"data/img/cloud3.png" },
        { name: "player", type:"image", src:"data/img/player.png" },
        { name: "enemyCacti", type:"image", src:"data/img/enemyCacti.png" },
        { name: "enemyFly", type:"image", src:"data/img/enemyFly.png" },
        { name: "PressStart2P", type:"image", src: "data/fnt/PressStart2P.png" },
        { name: "PressStart2P", type:"binary", src: "data/fnt/PressStart2P.fnt"}
    ],

    onload: function()
    {
        // if (!me.video.init(game.res.width, game.res.height, {wrapper : "screen", scale : "auto"})) {
        if (!me.video.init(game.res.width, game.res.height, {wrapper : "screen"})) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }
        me.audio.init("mp3,ogg");
        me.loader.onload = this.loaded.bind(this);
        me.loader.preload(game.assets);
    },

    loaded: function () {
        me.state.set(me.state.PLAY, new PlayScreen());
        me.input.bindKey(me.input.KEY.DOWN, "duck");
        me.input.bindKey(me.input.KEY.UP, "jump");
        me.input.bindKey(me.input.KEY.SPACE, "jump");
        me.state.change(me.state.PLAY);
    }
};
