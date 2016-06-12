/// <reference path="../tsDefinitions/phaser.comments.d.ts" />

module Shapeshifter {
 
  export enum BatType { Brown, Blue, Orange };

  export const BatTypes = [
    { name: "brownBat", health: 20, bodyTint: 0x2B1D10 }, 
    { name: "blueBat", health: 40, bodyTint: 0x2BCFF4 }, 
    { name: "orangeBat", health: 50, bodyTint: 0xF6AB26 }
  ];

  export class Bat extends Phaser.Sprite {
    
    isDamaged: boolean;
    enemyBulletPool: Phaser.Group;
    player: Shapeshifter.Player;
 
    constructor(game: Phaser.Game, x: number, y: number, enemyBulletPool: Phaser.Group, player: Shapeshifter.Player) {
      super(game, x, y, 'bat', 0);
      this.enemyBulletPool = enemyBulletPool;
      this.player = player;
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
    
    reviveBat(batType:BatType):void {
      let currentBatType = BatTypes[batType];
      super.revive(currentBatType.health);
      this.maxHealth = currentBatType.health;
      this.isDamaged = false;
      this.tint = currentBatType.bodyTint;
      // Send out bat
      this.x = this.game.rnd.between(40, Shapeshifter.Game.WORLD_WIDTH - 40);
      this.y = -50;
      this.animations.play('fly');
      switch (batType) {
        case BatType.Brown:
          this.body.velocity.y = 200;
          break;
        default:
          let tweenDown = this.game.add.tween(this).to( { y: 150 }, 1500, Phaser.Easing.Quadratic.Out);
          if (batType == BatType.Blue)
            tweenDown.onComplete.addOnce(this.shootStraightDown, this);
          else
            tweenDown.onComplete.addOnce(this.shootAtPlayer, this);
          let tweenUp = this.game.add.tween(this).to( { y: -100 }, 1500, Phaser.Easing.Quadratic.In);
          tweenUp.onComplete.addOnce(() => this.kill(), this);
          tweenDown.chain(tweenUp);
          tweenDown.start();
          break;
      }
    }

    shootStraightDown() {
      // console.log('blue shot');
      // var bullet = this.game.enemyBulletPool.getFirstExists(false);
      let bullet = this.enemyBulletPool.getFirstExists(false);
      bullet.tint = this.tint;
      bullet.reset(this.x, this.y - 20);

      bullet.body.velocity.y = 300;
    }

    shootAtPlayer() {
      // console.log('orange shot');
      let bullet = this.enemyBulletPool.getFirstExists(false);
      bullet.tint = this.tint;
      bullet.reset(this.x, this.y - 20);
      // bullet.body.velocity.y = 300;
      // let shotAngle = this.getAngleTo(this.player);
      let shotAngle = this.game.physics.arcade.angleBetween(this, this.player);
      this.game.physics.arcade.velocityFromAngle(Phaser.Math.radToDeg(shotAngle) , 300, bullet.body.velocity);
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
