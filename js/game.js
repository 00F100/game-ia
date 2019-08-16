
/* Game namespace */
var game = {

    assets : [
        { name: "enemyBox",   type:"image", src:"data/sfx/sprite/wheelie_right.png" }
    ],

    // an object where to store game information
    data : {
        // score
        score : 0
    },


    // Run on page load.
    "onload" : function () {
        // Initialize the video.
        if (!me.video.init(640, 480, {wrapper : "screen", scale : "auto"})) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        // Initialize the audio.
        me.audio.init("mp3,ogg");

        // set and load all resources.
        // (this will also automatically switch to the loading screen)
        me.loader.preload(game.resources, this.loaded.bind(this));
    },

    // Run on game resources loaded.
    "loaded" : function () {
        me.state.set(me.state.MENU, new game.TitleScreen());
        me.state.set(me.state.PLAY, new game.PlayScreen());

        // add our player entity in the entity pool
        me.pool.register("player", game.PlayerEntity);
        me.pool.register("enemy", game.EnemyEntity);

        // enable the keyboard
        // me.input.bindKey(me.input.KEY.LEFT, "left");
        // me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.UP, "jump");
        me.input.bindKey(me.input.KEY.SPACE, "jump");

        // Start the game.
        me.state.change(me.state.PLAY);
    }
};
