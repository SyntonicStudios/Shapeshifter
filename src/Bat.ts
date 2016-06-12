/// <reference path="../tsDefinitions/phaser.comments.d.ts" />

module Shapeshifter {
 
  // export enum BatType { Brown, Blue, Orange, Red };

/*
  export const BatTypes = [
    { name: "brownBat", health: 20, bodyTint: 0x2B1D10, scale: 1 }, 
    { name: "blueBat", health: 40, bodyTint: 0x2BCFF4, scale: 1 }, 
    { name: "orangeBat", health: 50, bodyTint: 0xF6AB26, scale: 1 },
    { name: "redBat", health: 150, bodyTint: 0xED1C31, scale: 3 }
  ];
*/

  export class BatType {
    batTypeID: number;
    name: string;
    health: number;
    bodyTint: number;
    bulletTint: number;
    scale: number;
    behaviorOnSpawn: Function;

    constructor(batTypeID: number, name: string, health: number, bodyTint: number, bulletTint: number, scale: number, behaviorOnSpawn: Function) {
      this.batTypeID = batTypeID;
      this.name = name;
      this.health = health;
      this.bodyTint = bodyTint;
      this.bulletTint = bulletTint;
      this.scale = scale;
      this.behaviorOnSpawn = behaviorOnSpawn;
    }
  }

/*
  var tempBatTypes = [];

  tempBatTypes.push(new BatType (0, "BrownBat", 20, 0x2B1D10, 0x2B1D10, 1, function(bat:Bat) { bat.body.velocity.y = 200; } ));
  tempBatTypes.push(new BatType (1, "BlueBat", 40, 0x2BCFF4, 0x2BCFF4, 1, function(bat:Bat) { 
    let tweenDown = bat.game.add.tween(bat).to( { y: 150 }, 1500, Phaser.Easing.Quadratic.Out);
    tweenDown.onComplete.addOnce(bat.shootStraightDown, bat);
    let tweenUp = bat.game.add.tween(bat).to( { y: -100 }, 1500, Phaser.Easing.Quadratic.In);
    tweenUp.onComplete.addOnce(() => bat.kill(), bat);
    tweenDown.chain(tweenUp);
    tweenDown.start();
  } ));
  tempBatTypes.push(new BatType (2, "OrangeBat", 50, 0xF6AB26, 0xF6AB26, 1, function(bat:Bat) { bat.body.velocity.y = 200; } ));
  tempBatTypes.push(new BatType (3, "RedBat", 150, 0xED1C31, 0xED1C31, 3, function(bat:Bat) { bat.body.velocity.y = 200; } ));

  export const BatTypes = tempBatTypes;
*/

  export var BatTypes = [
    new BatType (0, "BrownBat", 20, 0x2B1D10, 0x2B1D10, 1, function(bat:Bat) { bat.body.velocity.y = 200; } ), 
    new BatType (1, "BlueBat", 40, 0x2BCFF4, 0x2BCFF4, 1, function(bat:Bat) { 
      let tweenDown = bat.game.add.tween(bat).to( { y: 150 }, 1500, Phaser.Easing.Quadratic.Out);
      tweenDown.onComplete.addOnce(bat.shootStraightDown, bat);
      let tweenUp = bat.game.add.tween(bat).to( { y: -100 }, 1500, Phaser.Easing.Quadratic.In);
      tweenUp.onComplete.addOnce(() => bat.kill(), bat);
      tweenDown.chain(tweenUp);
      tweenDown.start();
    } ), 
    new BatType (2, "OrangeBat", 50, 0xF6AB26, 0xF6AB26, 1, function(bat:Bat) { bat.body.velocity.y = 200; } ), 
    new BatType (3, "RedBat", 150, 0xED1C31, 0xED1C31, 3, function(bat:Bat) { bat.body.velocity.y = 200; } ), 
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
    
/*
    batTypes = [
        { name: "brownBat", health: 20, bodyTint: 0x2B1D10, scale: 1 }, 
        { name: "blueBat", health: 40, bodyTint: 0x2BCFF4, scale: 1 }, 
        { name: "orangeBat", health: 50, bodyTint: 0xF6AB26, scale: 1 },
        { name: "redBat", health: 150, bodyTint: 0xED1C31, scale: 3 }
      ];
*/

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
    
    reviveBat(batTypeName:string):void {
      // let currentBatType = BatTypes[batType];
      let currentBatType:BatType = Shapeshifter.BatTypes.find((bt:BatType) => bt.name == batTypeName);
      if (!currentBatType) console.log("Could not find BatType with batTypeName == " + batTypeName);
      super.revive(currentBatType.health);
      this.maxHealth = currentBatType.health;
      this.isDamaged = false;
      this.tint = currentBatType.bodyTint;
      // Send out bat
      this.x = this.game.rnd.between(40, Shapeshifter.Game.WORLD_WIDTH - 40);
      this.y = -50;
      this.animations.play('fly');
      // Bat behavior
      currentBatType.behaviorOnSpawn(this);

/*
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
*/

    }

    public shootStraightDown() {
      // console.log('blue shot');
      // var bullet = this.game.enemyBulletPool.getFirstExists(false);
      let bullet = this.enemyBulletPool.getFirstExists(false);
      bullet.tint = this.tint;
      bullet.reset(this.x, this.y - 20);

      bullet.body.velocity.y = 300;
    }

    public shootAtPlayer() {
      // console.log('orange shot');
      let bullet = this.enemyBulletPool.getFirstExists(false);
      bullet.tint = this.tint;
      bullet.reset(this.x, this.y - 20);
      // bullet.body.velocity.y = 300;
      // let shotAngle = this.getAngleTo(this.player);
      let shotAngle = this.game.physics.arcade.angleBetween(this, this.player);
      this.game.physics.arcade.velocityFromAngle(Phaser.Math.radToDeg(shotAngle) , 300, bullet.body.velocity);
    }

    /*
    public brownBatBehavior() {
      this.body.velocity.y = 200;
    }
    */
  
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
