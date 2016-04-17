/// <reference path="Boot.ts" />
/// <reference path="Preloader.ts" />
/// <reference path="MainMenu.ts" />
/// <reference path="Level1.ts" />

module Shapeshifter {
 
  export class Game extends Phaser.Game {
  
    // Game-wide Constants
    public static get DEBUG_MODE():boolean { return true; }
    
    public static get GAME_WIDTH():number { return 600; }
    public static get GAME_HEIGHT():number { return 800; }
    public static get WORLD_WIDTH():number { return 700; }
    public static get WORLD_HEIGHT():number { return 800; }
    
    public static get RABBIT_WALK_SPEED():number { return 250; }
 
    constructor() {
 
      // super(800, 600, Phaser.AUTO, 'content', null);
      super(Shapeshifter.Game.GAME_WIDTH, Shapeshifter.Game.GAME_HEIGHT, Phaser.AUTO, 'content', null);
 
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
  game = new Shapeshifter.Game();
  // var game;
	// game = new Shapeshifter.Game();
}
