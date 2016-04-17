/// <reference path="../tsDefinitions/phaser.comments.d.ts" />

module Shapeshifter {
 
  export class Bat extends Phaser.Sprite {
    
    isDamaged: boolean;
 
    constructor(game: Phaser.Game, x: number, y: number) {
      super(game, x, y, 'bat', 0);
      // Enable Player's Physics Body
      this.game.physics.arcade.enableBody(this);
      this.body.collideWorldBounds = false;
      this.anchor.setTo(0.5, 0);
      this.animations.add('fly', [0, 1], 5, true);
      game.add.existing(this);
      
      this.alive = false;
      this.exists = false;
      this.visible = false;
    }
    
    update() {
      // Kill mob if below the screen
      // TODO: Add to a more generic Mob class
      if (this.y > Shapeshifter.Game.GAME_HEIGHT + 200) {
        this.kill();
        return; // Nothing left to do
      }
      
      // TODO: Implement tinting on damage
      // this.updateTint();
    }
    
    reviveAsBrownBat() {
      this.revive(20);
      // Redundant?
      /*
      this.alive = true;
      this.exists = true;
      this.visible = true;
      this.health = 20;
      */
      this.maxHealth = this.health;
      this.isDamaged = false;
      // this.damageBlinkLast = 0;
      this.tint = 0x2B1D10;
      
      this.x = this.game.rnd.between(40, Shapeshifter.Game.WORLD_WIDTH - 40);
      this.y = -200;
      this.animations.play('fly');
      this.body.velocity.y = 200;
    }
  
    // TODO: Implement this cool damage effect in a more generic mob class  
/*    Mob.prototype.updateTint = function () {

      // Mob hit
      if (this.isDamaged) {
        this.damageBlinkLast -= 2;

        if (this.damageBlinkLast < 0) {

          this.isDamaged = false;
        }
      }

      if (this.isDamaged) {
        this.tint = 0xff0000;
      } else {
        this.tint = 0xffffff;
      }
    };*/
    
  }
}
