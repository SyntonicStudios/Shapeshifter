/// <reference path="Boot.ts" />
/// <reference path="Preloader.ts" />
/// <reference path="MainMenu.ts" />
/// <reference path="Level1.ts" />
var Shapeshifter;
(function (Shapeshifter) {
    class Game extends Phaser.Game {
        constructor() {
            // super(800, 600, Phaser.AUTO, 'content', null);
            super(Shapeshifter.Game.GAME_WIDTH, Shapeshifter.Game.GAME_HEIGHT, Phaser.AUTO, 'content', null);
            this.state.add('Boot', Shapeshifter.Boot, false);
            this.state.add('Preloader', Shapeshifter.Preloader, false);
            this.state.add('MainMenu', Shapeshifter.MainMenu, false);
            this.state.add('Level1', Shapeshifter.Level1, false);
            this.state.start('Boot');
        }
        // Game-wide Constants
        static get DEBUG_MODE() { return true; }
        static get MUTE_SOUND() { return true; }
        static get EMPTY_ROOM() { return false; }
        static get GAME_WIDTH() { return 600; }
        static get GAME_HEIGHT() { return 800; }
        static get WORLD_WIDTH() { return 700; }
        static get WORLD_HEIGHT() { return 800; }
        static get GAME_SCROLL_SPEED() { return 1; }
        static get VELOCITY_TO_MATCH_SCROLL_SPEED() { return 60; }
        static get RABBIT_WALK_SPEED() { return 250; }
    }
    Shapeshifter.Game = Game;
})(Shapeshifter || (Shapeshifter = {}));
// When the page has finished loading, create our game
window.onload = () => {
    // To debug in the browser console, use this
    game = new Shapeshifter.Game();
    // To avoid errors, use this
    // var game; game = new Shapeshifter.Game();
};
