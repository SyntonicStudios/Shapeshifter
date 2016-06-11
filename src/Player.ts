/// <reference path="../tsDefinitions/phaser.comments.d.ts" />

module Shapeshifter {

  export enum PlayerState { Grounded, Airborne, Dead, Transforming };
  export enum PlayerForm { Rabbit, Wizard, Crow };
  // export const Forms = { thing1: 'hey' }; 
  export const Forms = [ 
    { name: 'Rabbit', movementSpeed: 250, walkSidewaysName: 'walkSideways', walkDownName: 'walkDown', walkUpName: 'walkUp' }, 
    { name: 'Wizard', movementSpeed: 150, walkSidewaysName: 'wizardWalk', walkDownName: 'wizardWalk', walkUpName: 'wizardWalk' }, 
    { name: 'Crow', movementSpeed: 200, walkSidewaysName: 'walkSideways', walkDownName: 'walkSideways', walkUpName: 'walkSideways' } 
  ]; 
 
  export class Player extends Phaser.Sprite {
    playerState: PlayerState;
    // playerForm: PlayerForm;
    playerFormIndex: number;
    healthBar: Phaser.Sprite;
    hasWizardForm: boolean;
    hasCrowForm: boolean;
    // Sounds
    playerDyingSound: Phaser.Sound;
    transformationSound: Phaser.Sound;
    wizardShootingSound: Phaser.Sound;
    // Timers
    takeDamageCooldown: number;
    transformationCooldown: number;
    wizardShootingCooldown: number;
    // Keyboard Keys
    keyQ:Phaser.Key; keyW:Phaser.Key; keyEnter:Phaser.Key;
    // key1:Phaser.Key;
    playerBulletPool: Phaser.Group;
 
    constructor(game: Phaser.Game, x: number, y: number) {
      super(game, x, y, 'rabbit', 0);
      // Enable Player's Physics Body
      this.game.physics.arcade.enableBody(this);
      this.body.collideWorldBounds = true;
      this.anchor.setTo(.5, .5);
      
      // Animations - Rabbit
      this.animations.add('walkSideways', [0, 1], 5, true);
      this.animations.add('walkDown', [2, 3], 5, true);
      this.animations.add('walkUp', [4, 5], 5, true);
      // Wizard
      this.animations.add('wizardWalk', [0, 1, 2], 5, true);
      this.animations.add('wizardWalkAndShoot', [3, 4], 5, true);
      
      game.add.existing(this);
      this.maxHealth = 100;
      this.health = this.maxHealth;
      this.playerState = PlayerState.Grounded;
      
      this.healthBar = this.game.add.sprite(20, 20, 'healthBar');        
      this.healthBar.anchor.setTo(0,1);        
      this.healthBar.scale.setTo(1, 0.5);        
      this.healthBar.fixedToCamera = true;
      
      // Shapeshifter!
      this.hasWizardForm = false;
      this.hasCrowForm = false;
      // this.playerForm = PlayerForm.Rabbit;
      this.playerFormIndex = PlayerForm.Rabbit;
      
      // Sound
      this.playerDyingSound = this.game.add.audio('playerDying');
      this.transformationSound = this.game.add.audio('transform');
      this.wizardShootingSound = this.game.add.audio('wizardShootingSubdued');
      
      // Timers
      this.takeDamageCooldown = 0;
      this.transformationCooldown = 0;
      this.wizardShootingCooldown = 0;
      
      // Define Keyboard Keys we will need
      this.keyQ = this.game.input.keyboard.addKey(Phaser.Keyboard.C);
      this.keyW = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
      this.keyEnter = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
      // this.key1 = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
      
      // Create Player Bullet Pool
      this.createPlayerBulletPool();
    }
 
    update() {
      // this.body.velocity.x = 0;
      // this.body.velocity.y = 0;

      if (this.playerState != PlayerState.Transforming) {
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;        
      }
      
      // Timers
      if (this.takeDamageCooldown >= 1) 
        this.takeDamageCooldown--;
      if (this.transformationCooldown >= 1) 
        this.transformationCooldown--;
      if (this.wizardShootingCooldown >= 1) 
        this.wizardShootingCooldown--;
 
      this.handleKeys();

      // Need to explicitly set the left game-world barrier
      // DELETE ME: Actually this is tied to a physics body bug
      // if (this.x < 15) this.x = 18;
    }
    
    private handleKeys() {
      
      switch (this.playerState) {
        case PlayerState.Grounded:
          if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            this.body.velocity.x = -Forms[this.playerFormIndex].movementSpeed;
            this.animations.play(Forms[this.playerFormIndex].walkSidewaysName);
            if (this.scale.x == 1) {
              this.scale.x = -1;
            }
          }
          else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            this.body.velocity.x = Forms[this.playerFormIndex].movementSpeed;
            this.animations.play(Forms[this.playerFormIndex].walkSidewaysName);
            if (this.scale.x == -1) {
              this.scale.x = 1;
            }
          }
          
          if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            this.body.velocity.y = Forms[this.playerFormIndex].movementSpeed;
            if (this.body.velocity.x == 0) {this.animations.play(Forms[this.playerFormIndex].walkDownName);}
          }
          else if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            this.body.velocity.y = -Forms[this.playerFormIndex].movementSpeed;
            if (this.body.velocity.x == 0) {this.animations.play(Forms[this.playerFormIndex].walkUpName);}
          }
          
          // Action Button
          if (this.game.input.keyboard.isDown(Phaser.Keyboard.Q)) {
            if (this.playerFormIndex == PlayerForm.Wizard) {
              this.animations.play('wizardWalkAndShoot');
              if (this.transformationCooldown < 1) {
                this.wizardShootingSound.play();
                this.transformationCooldown = 10;
                var bullet = this.playerBulletPool.getFirstExists(false);
                bullet.reset(this.x, this.y - 20);

                bullet.body.velocity.y = -500;
              }
            }
          }
          
          // Transform into Wizard
          if (this.game.input.keyboard.isDown(Phaser.Keyboard.TWO)) {
            if (this.hasWizardForm && this.playerFormIndex != PlayerForm.Wizard && (this.transformationCooldown < 1)) {
              this.transformationSound.play();
              this.playerState = PlayerState.Transforming;
              this.transformationCooldown = 60;
              this.body.velocity.x = 0; 
              this.body.velocity.y = Shapeshifter.Game.VELOCITY_TO_MATCH_SCROLL_SPEED;
              // Transform to Wizard
              this.loadTexture("wizardSpriteSheet", 0, true);
              this.playerFormIndex = PlayerForm.Wizard;
              this.playerState = PlayerState.Grounded;
              this.animations.play('wizardWalk');
            }
          }
          
          // Transform into Rabbit
          if (this.game.input.keyboard.isDown(Phaser.Keyboard.ONE)) {
            if (this.playerFormIndex != PlayerForm.Rabbit && this.transformationCooldown < 1) {
              this.transformationSound.play();
              this.playerState = PlayerState.Transforming;
              this.transformationCooldown = 60;
              this.body.velocity.x = 0; 
              this.body.velocity.y = Shapeshifter.Game.VELOCITY_TO_MATCH_SCROLL_SPEED;
              // Transform to Wizard
              this.loadTexture("rabbit", 0, true);
              this.playerFormIndex = PlayerForm.Rabbit;
              this.playerState = PlayerState.Grounded;
              this.animations.play('walkUp');
            }
          }
             
          if (this.body.velocity.x == 0 && this.body.velocity.y == 0) {    // No Keys Pressed 
            // this.animations.frame = 4;
            this.animations.play(Forms[this.playerFormIndex].walkUpName);
          }
          break;
        case PlayerState.Dead:
          this.keyEnter.onDown.add(() => {
            this.game.sound.stopAll(); 
            this.game.state.start('Level1', true, false) 
          });
          break;
      }
      
    }
    
    takeDamage(damageAmount) {
      // bullet.kill();
      this.takeDamageCooldown = 60;
      this.health -= damageAmount;
      this.healthBar.scale.setTo(this.health/100, 0.5);
      if (this.health <= 0) {
        this.die();
      }
    }
    
    die() {
      this.healthBar.visible = false;
      this.playerDyingSound.play();
      this.playerState = PlayerState.Dead;
      this.kill();
      let textStyle = { font: "32px Arial", fill: "#ff0000", align: "center" };
      let gameOverText = `GAME OVER
      PRESS ENTER TO RESTART`;
      let text = this.game.add.text(this.game.camera.x + 30, this.game.world.centerY - 40, gameOverText, textStyle);
    }
    
    createPlayerBulletPool() {
      this.playerBulletPool = this.game.add.group();
      this.playerBulletPool.enableBody = true;
      this.playerBulletPool.physicsBodyType = Phaser.Physics.ARCADE;
      this.playerBulletPool.createMultiple(100, 'wizardBullet');
      this.playerBulletPool.setAll('anchor.x', 0.5);
      this.playerBulletPool.setAll('anchor.y', 0.5);
      this.playerBulletPool.setAll('outOfBoundsKill', true);
      this.playerBulletPool.setAll('checkWorldBounds', true);
    }
    
  }
}