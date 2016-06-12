/// <reference path="../tsDefinitions/phaser.comments.d.ts" />

module Shapeshifter {
 
  export class Preloader extends Phaser.State {
 
    preloadBar: Phaser.Sprite;
 
    preload() {
      //  Set-up our preloader sprite
      this.preloadBar = this.add.sprite(200, 250, 'preloadBar');
      this.load.setPreloadSprite(this.preloadBar, 0);
 
      //  Load our actual games assets
      this.load.image('titlepage', 'assets/titlepage.jpg');
      this.load.image('logo', 'assets/logo.png');
      this.load.audio('music', 'assets/title.mp3', true);
      // this.load.spritesheet('simon', 'assets/simon.png', 58, 96, 5);
      this.load.spritesheet('rabbit', 'assets/rabbitSpriteSheet.png', 40, 40, 6);
      this.load.spritesheet('bat', 'assets/batSpriteSheet2.png', 60, 40, 2);
      this.load.spritesheet('wizardSpriteSheet', 'assets/wizardSpriteSheet.png', 28, 60, 5);
      // this.load.image('level1', 'assets/level1.png');
      this.load.image('level1ground', 'assets/caveFloorTile.png');
      this.load.image('healthBar', 'assets/healthBar.png');
      this.load.image('wizardBubble', 'assets/wizardBubble.png');
      this.load.image('crowBubble', 'assets/wizardBubble.png');
      this.load.image('wizardBullet', 'assets/wizardBullet.png');
      this.load.image('batBullet', 'assets/batBullet.png');
      // Sounds
      this.load.audio('mobDying', 'assets/SFX/mobDying.ogg', true);
      this.load.audio('playerDying', 'assets/SFX/playerDying.ogg', true);
      this.load.audio('playerHurt', 'assets/SFX/playerHurt.ogg', true);
      this.load.audio('rabbitJump', 'assets/SFX/rabbitJump.ogg', true);
      this.load.audio('transform', 'assets/SFX/transform.ogg', true);
      this.load.audio('wizardShooting', 'assets/SFX/wizardShooting.ogg', true);
      this.load.audio('wizardShootingSubdued', 'assets/SFX/wizardShootingSubdued.ogg', true);
      // Music
      this.load.audio('ssLevel1Theme', 'assets/ssLevel1Theme.ogg', true);
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