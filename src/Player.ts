/// <reference path="../tsDefinitions/phaser.comments.d.ts" />

module Shapeshifter {
 
  export class Player extends Phaser.Sprite {
 
    constructor(game: Phaser.Game, x: number, y: number) {
      super(game, x, y, 'rabbit', 0);
      // Enable Player's Physics Body
      this.game.physics.arcade.enableBody(this);
      this.anchor.setTo(0.5, 0);
      this.animations.add('walkSideways', [0, 1], 5, true);
      this.animations.add('walkDown', [2, 3], 5, true);
      this.animations.add('walkUp', [4, 5], 5, true);
      game.add.existing(this);
    }
 
    update() {
      this.body.velocity.x = 0;
      this.body.velocity.y = 0;
 
      if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
 
        this.body.velocity.x = -250;
        this.animations.play('walkSideways');
 
        if (this.scale.x == 1) {
          this.scale.x = -1;
        }
      }
      else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
 
        this.body.velocity.x = 250;
        this.animations.play('walkSideways');
 
        if (this.scale.x == -1) {
          this.scale.x = 1;
        }
      }
      
      if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
 
        this.body.velocity.y = 250;
        if (this.body.velocity.x == 0) {this.animations.play('walkDown');}
      }
      else if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
 
        this.body.velocity.y = -250;
        if (this.body.velocity.x == 0) {this.animations.play('walkUp');}
      }
            
      if (this.body.velocity.x == 0 && this.body.velocity.y == 0) {    // No Keys Pressed 
        this.animations.frame = 4;
      }
    }
  }
}