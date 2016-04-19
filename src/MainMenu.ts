/// <reference path="../tsDefinitions/phaser.comments.d.ts" />

module Shapeshifter {
 
  export class MainMenu extends Phaser.State {
 
    background: Phaser.Sprite;
    logo: Phaser.Sprite;
 
    create() {
 
      // this.background = this.add.sprite(0, 0, 'titlepage');
      // this.background.alpha = 0;
 
      let textStyle = { font: "20px Arial", fill: "#ff0000", align: "center" };
      let gameOverText = `Shapeshifter
      Move with arrow keys
      1 and 2 are used for shapeshifting (if you have gotten the ability)
      Wizard: Press Q to shoot
      Click anywhere to start the game`;
      let text = this.game.add.text(0, 0, gameOverText, textStyle);
 
      // this.logo = this.add.sprite(this.world.centerX, -300, 'logo');
      // this.logo.anchor.setTo(0.5, 0.5);
 
      // this.add.tween(this.background).to({ alpha: 1}, 2000, Phaser.Easing.Bounce.InOut, true);
      // this.add.tween(this.logo).to({ y: 220 }, 2000, Phaser.Easing.Elastic.Out, true, 2000);
 
      // this.input.onDown.addOnce(this.fadeOut, this);
      this.input.onDown.addOnce(() => this.game.state.start('Level1', true, false), this);
 
    }
 
/*    fadeOut() {
 
      this.add.tween(this.background).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
      var tween = this.add.tween(this.logo).to({ y: 800 }, 2000, Phaser.Easing.Linear.None, true);
 
      tween.onComplete.add(this.startGame, this);
 
    }*/
 
    startGame() {
 
      this.game.state.start('Level1', true, false);
 
    }
 
  }
 
}