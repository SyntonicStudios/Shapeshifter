/// <reference path="../tsDefinitions/phaser.comments.d.ts" />

module Shapeshifter {

  export enum PlayerState { Grounded, Airborne, Dead, Transforming };
  export enum PlayerForm { Rabbit, Wizard, Crow };
 
  export class Player extends Phaser.Sprite {

    playerState: PlayerState;
    playerForm: PlayerForm;
    healthBar: Phaser.Sprite;
    hasWizardForm: boolean;
    hasCrowForm: boolean;
    // Keyboard Keys
    keyQ:Phaser.Key; keyW:Phaser.Key; keyEnter:Phaser.Key;
 
    constructor(game: Phaser.Game, x: number, y: number) {
      super(game, x, y, 'rabbit', 0);
      // Enable Player's Physics Body
      this.game.physics.arcade.enableBody(this);
      this.body.collideWorldBounds = true;
      this.anchor.setTo(0.5, 0);
      this.animations.add('walkSideways', [0, 1], 5, true);
      this.animations.add('walkDown', [2, 3], 5, true);
      this.animations.add('walkUp', [4, 5], 5, true);
      game.add.existing(this);
      this.maxHealth = 100;
      this.health = this.maxHealth;
      this.playerState = PlayerState.Grounded;
      
      this.healthBar = this.game.add.sprite(20, 20, 'healthBar');        
      this.healthBar.anchor.setTo(0,1);        
      this.healthBar.scale.setTo(1, 0.5);        
      this.healthBar.fixedToCamera = true;
      
      this.hasWizardForm = false;
      this.hasCrowForm = false;
      
      // Define Keyboard Keys we will need
      this.keyQ = this.game.input.keyboard.addKey(Phaser.Keyboard.C);
      this.keyW = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
      this.keyEnter = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    }
 
    update() {
      this.body.velocity.x = 0;
      this.body.velocity.y = 0;
 
      this.handleKeys();
    }
    
    private handleKeys() {
      
      switch (this.playerState) {
        case PlayerState.Grounded:
          if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            this.body.velocity.x = -Shapeshifter.Game.RABBIT_WALK_SPEED;
            this.animations.play('walkSideways');
            if (this.scale.x == 1) {
              this.scale.x = -1;
            }
          }
          else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            this.body.velocity.x = Shapeshifter.Game.RABBIT_WALK_SPEED;
            this.animations.play('walkSideways');
            if (this.scale.x == -1) {
              this.scale.x = 1;
            }
          }
          
          if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            this.body.velocity.y = Shapeshifter.Game.RABBIT_WALK_SPEED;
            if (this.body.velocity.x == 0) {this.animations.play('walkDown');}
          }
          else if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            this.body.velocity.y = -Shapeshifter.Game.RABBIT_WALK_SPEED;
            if (this.body.velocity.x == 0) {this.animations.play('walkUp');}
          }
                
          if (this.body.velocity.x == 0 && this.body.velocity.y == 0) {    // No Keys Pressed 
            // this.animations.frame = 4;
            this.animations.play('walkUp');
          }
          break;
        case PlayerState.Dead:
            this.keyEnter.onDown.add(() => this.game.state.start('Level1', true, false));
      }
      
    }
    
    takeDamage(damageAmount) {
      // bullet.kill();
      this.health -= damageAmount;
      this.healthBar.scale.setTo(this.health/100, 0.5);
      if (this.health <= 0) {
        this.die();
      }
    }
    
    die() {
      this.playerState = PlayerState.Dead;
      this.kill();
      let textStyle = { font: "32px Arial", fill: "#ff0000", align: "center" };
      let gameOverText = `GAME OVER
      PRESS ENTER TO RESTART`;
      let text = this.game.add.text(this.game.camera.x + 30, this.game.world.centerY - 40, gameOverText, textStyle);
    }
    
  }
}