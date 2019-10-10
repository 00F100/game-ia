var game = {

    res: {
        width: 640,
        height: 480
    },

    alive: true,

    ia: {
        alive: false,
        weightSeq: []
    },

    enemies: [],

    human: {
        distance: 0,
        velocity: 0
    },

    ia: {
        generation: 1
    },

    vel: {
        x: 1,
        y: 0
    },

    // game assets
    assets : [
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
        if (!me.video.init(game.res.width, game.res.height, {wrapper : "screen", scale : "auto"})) {
        // if (!me.video.init(game.res.width, game.res.height, {wrapper : "screen"})) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }
        me.audio.init("mp3,ogg");
        me.loader.onload = this.loaded.bind(this);
        me.loader.preload(game.assets);
    },

    loaded: function () {

        me.state.NEURALNETWORK = me.state.USER + 1;

        me.state.set(me.state.READY, new WelcomeScreen());
        me.state.set(me.state.PLAY, new PlayScreen());
        me.state.set(me.state.GAMEOVER, new Gameover());
        me.state.set(me.state.NEURALNETWORK, new NeuralNetworkScreen(true));
        me.state.set(me.state.NEURALNETWORK2, new NeuralNetworkScreen(false));
        me.state.change(me.state.READY);
    }
};
