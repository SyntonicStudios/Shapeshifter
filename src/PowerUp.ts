/// <reference path="../tsDefinitions/phaser.comments.d.ts" />

module Shapeshifter {

  export enum PowerUpType { Wizard, Crow };
 
  export class PowerUp extends Phaser.Sprite {

    powerUpType: PowerUpType;
 
    constructor(game: Phaser.Game, type:PowerUpType) {
      // Figure out key
      let keyToUse = 'wizardBubble';
      if (type == PowerUpType.Crow) keyToUse = 'crowBubble';

      super(game, Shapeshifter.Game.WORLD_WIDTH / 2, -100, keyToUse, 0);
      // Enable Player's Physics Body
      this.game.physics.arcade.enableBody(this);
      this.anchor.setTo(0.5, 0);
      game.add.existing(this);
      this.body.velocity.y = 60;
    }
 
  }
}
