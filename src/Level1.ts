/// <reference path="../tsDefinitions/phaser.comments.d.ts" />
/// <reference path="Player.ts" />
/// <reference path="Bat.ts" />

module Shapeshifter {
  export class Level1 extends Phaser.State {
 
    background: Phaser.TileSprite;
    music: Phaser.Sound;
    player: Shapeshifter.Player;
    enemies: Phaser.Group;
    // bat: Shapeshifter.Bat;
 
    create() {
      // Setup World
			this.game.world.setBounds(0, 0, 700, 800);
      
      // Set up TileSet background
      this.background = this.add.tileSprite(0, 0, 700, 800, 'level1ground');
      
      this.player = new Player(this.game, 130, 284);
      
      // BATS!
      // Add a bat to the middle of the screen for now
      this.enemies = this.game.add.group();
      // this.enemies.create(300, 400, "bat1");
      var bat = new Bat(this.game, 300, 400);
      this.enemies.add(bat);
            
      // Setup Camera
      this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER);
      this.game.camera.x = 50;
      // this.game.camera.x = 0;
      this.game.camera.y = 0;
      
      // this.background = this.add.sprite(0, 0, 'level1');
 
      // this.music = this.add.audio('music', 1, false);
      // this.music.play();
    }
    
    update() {
      // Constantly scroll the tileSprite background
      this.background.tilePosition.y++;
    }
    
  }
} 