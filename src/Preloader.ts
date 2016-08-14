/// <reference path="../tsDefinitions/phaser.comments.d.ts" />

module Shapeshifter {
 
  export class Preloader extends Phaser.State {
 
    preloadBar: Phaser.Sprite;
 
    preload() {
      let fileLocation = 'shapeshifter/';
      //  Set-up our preloader sprite
      this.preloadBar = this.add.sprite(200, 250, 'preloadBar');
      this.load.setPreloadSprite(this.preloadBar, 0);
 
      //  Load our actual games assets
      this.load.image('titlepage', fileLocation + 'assets/titlepage.jpg');
      this.load.image('logo', fileLocation + 'assets/logo.png');
      this.load.audio('music', fileLocation + 'assets/title.mp3', true);
      // this.load.spritesheet('simon', 'assets/simon.png', 58, 96, 5);
      this.load.spritesheet('rabbit', fileLocation + 'assets/rabbitSpriteSheet.png', 40, 40, 6);
      this.load.spritesheet('bat', fileLocation + 'assets/batSpriteSheet2.png', 60, 40, 2);
      this.load.spritesheet('wizardSpriteSheet', fileLocation + 'assets/wizardSpriteSheet.png', 28, 60, 5);
      // this.load.image('level1', 'assets/level1.png');
      this.load.image('level1ground', fileLocation + 'assets/caveFloorTile.png');
      this.load.image('healthBar', fileLocation + 'assets/healthBar.png');
      this.load.image('wizardBubble', fileLocation + 'assets/wizardBubble.png');
      this.load.image('crowBubble', fileLocation + 'assets/wizardBubble.png');
      this.load.image('wizardBullet', fileLocation + 'assets/wizardBullet.png');
      this.load.image('batBullet', fileLocation + 'assets/batBullet.png');
      // Sounds
      this.load.audio('mobDying', fileLocation + 'assets/SFX/mobDying.ogg', true);
      this.load.audio('playerDying', fileLocation + 'assets/SFX/playerDying.ogg', true);
      this.load.audio('playerHurt', fileLocation + 'assets/SFX/playerHurt.ogg', true);
      this.load.audio('rabbitJump', fileLocation + 'assets/SFX/rabbitJump.ogg', true);
      this.load.audio('transform', fileLocation + 'assets/SFX/transform.ogg', true);
      this.load.audio('wizardShooting', fileLocation + 'assets/SFX/wizardShooting.ogg', true);
      this.load.audio('wizardShootingSubdued', fileLocation + 'assets/SFX/wizardShootingSubdued.ogg', true);
      // Music
      this.load.audio('ssLevel1Theme', fileLocation + 'assets/ssLevel1Theme.ogg', true);
      // Stages
      this.load.tilemap("caveStageOneMap", fileLocation + "assets/stages/firstCave2.json", null, Phaser.Tilemap.TILED_JSON);
      this.load.image("caveTiles", fileLocation + "assets/caveTileSet1.png");
    }
 
    create() {
      if (Shapeshifter.Game.DEBUG_MODE)
        this.game.state.start('Level1', true, false);
      else {
        // var tween = this.add.tween(this.preloadBar).to({ alpha: 0 }, 1000, Phaser.Easing.Linear.None, true);
        // tween.onComplete.add(this.startMainMenu, this);
        this.startMainMenu();
      }
    }
 
    startMainMenu() {
 
      this.game.state.start('MainMenu', true, false);
 
    }
 
  }
 
}