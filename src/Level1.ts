/// <reference path="../tsDefinitions/phaser.comments.d.ts" />
/// <reference path="Player.ts" />

module Shapeshifter {
  export class Level1 extends Phaser.State {
 
    background: Phaser.TileSprite;
    music: Phaser.Sound;
    player: Shapeshifter.Player;
 
    create() {
      // this.background = this.add.sprite(0, 0, 'level1');
      
      // Set up TileSet background
      this.background = this.add.tileSprite(0, 0, 600, 800, 'level1ground');
 
      // this.music = this.add.audio('music', 1, false);
      // this.music.play();
 
      this.player = new Player(this.game, 130, 284);
    }
  }
} 