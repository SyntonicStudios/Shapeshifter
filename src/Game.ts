/// <reference path="Boot.ts" />
/// <reference path="Preloader.ts" />
/// <reference path="MainMenu.ts" />
/// <reference path="Level1.ts" />

module Shapeshifter {
 
    export class Game extends Phaser.Game {
    
        // Game-wide Constants
        public static get DEBUG_MODE():boolean { return false; }
 
        constructor() {
 
            // super(800, 600, Phaser.AUTO, 'content', null);
            super(600, 800, Phaser.AUTO, 'content', null);
 
            this.state.add('Boot', Boot, false);
            this.state.add('Preloader', Preloader, false);
            this.state.add('MainMenu', MainMenu, false);
            this.state.add('Level1', Level1, false);
 
            this.state.start('Boot');
 
        }
 
    }
 
}

// When the page has finished loading, create our game
window.onload = () => {
    var game;
	game = new Shapeshifter.Game();
}
