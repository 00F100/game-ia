var game = {
    // game assets
    assets : [
        { name: "player",   type:"image", src:"data/img/sprite/gripe_run_right.png" },
        { name: "enemy",   type:"image", src:"data/img/sprite/wheelie_right.png" },
        { name: "alien",   type:"image", src:"data/gfx/alien.png" },
        { name: "flushed", type:"image", src:"data/gfx/flushed.png" },
        { name: "scream",  type:"image", src:"data/gfx/scream.png" },
        { name: "smile",   type:"image", src:"data/gfx/smile.png" },
        { name: "smirk",   type:"image", src:"data/gfx/smirk.png" },
        { name: "brick",   type:"image", src:"data/gfx/brick.png" },
        { name: "area01map",   type:"image", src:"data/img/map/area01_level_tiles.png" },
        { name: "area01",   type:"tmx", src:"data/map/area01.tmx" }
    ],

    onload: function()
    {
        if (!me.video.init(640, 480, {wrapper : "screen", scale : "auto"})) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        me.loader.preload(game.assets, this.loaded.bind(this));
    },

    loaded: function () {
        me.state.set(me.state.PLAY, new PlayScreen());

        me.input.bindKey(me.input.KEY.UP, "jump", true);
        me.input.bindKey(me.input.KEY.SPACE, "jump", true);

        me.state.change(me.state.PLAY);
    }
};
