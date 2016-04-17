/// <reference path="../tsDefinitions/phaser.comments.d.ts" />

module Shapeshifter {
 
  export class Bat extends Phaser.Sprite {
 
    constructor(game: Phaser.Game, x: number, y: number) {
      super(game, x, y, 'bat', 0);
      // Enable Player's Physics Body
      this.game.physics.arcade.enableBody(this);
      this.body.collideWorldBounds = false;
      this.anchor.setTo(0.5, 0);
      this.animations.add('fly', [0, 1], 5, true);
      game.add.existing(this);
      this.animations.play('fly');
    }
  }
}
