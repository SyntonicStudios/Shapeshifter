/// <reference path="../tsDefinitions/phaser.comments.d.ts" />

module Shapeshifter {

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
    new BatType (2, "OrangeBat", 50, 0xF6AB26, 0xF6AB26, 1, function(bat:Bat) { 
      bat.body.velocity.y = 120;
      bat.game.time.events.repeat(800, 4, 
        () => { 
          bat.shootAtPlayer();
         });
     } ), 
    new BatType (3, "RedBat", 150, 0xED1C31, 0xED1C31, 3, function(bat:Bat) {
      function redShooting() {
        bat.game.time.events.repeat(500, bat.game.rnd.integerInRange(3, 6), 
          () => bat.shootSpreadAtPlayer() );
      } 
      let tweenDown = bat.game.add.tween(bat).to( { y: 150 }, 1500, Phaser.Easing.Quadratic.Out);
      tweenDown.onComplete.addOnce(() => redShooting());
      let tweenUp = bat.game.add.tween(bat).to( { y: -100 }, 1500, Phaser.Easing.Quadratic.In);
      tweenUp.onComplete.addOnce(() => bat.kill(), bat);
      tweenDown.start();
      bat.game.time.events.add(4500, () => tweenUp.start(), this);
      // let tweenStay = bat.game.add.tween(bat).to( { y: bat.y }, 1500, Phaser.Easing.Linear.None);
      // tweenDown.chain(tweenUp);
      // tweenStay.chain(tweenUp);()
    } )
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
    
    reviveBat(batTypeName:string):void {
      // let currentBatType = BatTypes[batType];
      let currentBatType:BatType = Shapeshifter.BatTypes.find((bt:BatType) => bt.name == batTypeName);
      if (!currentBatType) console.log("Could not find BatType with batTypeName == " + batTypeName);
      super.revive(currentBatType.health);
      this.scale.x = currentBatType.scale;
      this.scale.y = currentBatType.scale;
      this.maxHealth = currentBatType.health;
      this.isDamaged = false;
      this.tint = currentBatType.bodyTint;
      // Send out bat
      this.x = this.game.rnd.between(40, Shapeshifter.Game.WORLD_WIDTH - 40);
      this.y = -50;
      this.animations.play('fly');
      // Bat behavior
      currentBatType.behaviorOnSpawn(this);
    }

    public shootStraightDown() {
      // console.log('blue shot');
      // var bullet = this.game.enemyBulletPool.getFirstExists(false);
      let bullet = this.enemyBulletPool.getFirstExists(false);
      bullet.tint = this.tint;
      bullet.reset(this.x, this.y - 20);

      bullet.body.velocity.y = 500;
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

    public shootSpreadAtPlayer() {
      // console.log('orange shot');
      let bullet = this.enemyBulletPool.getFirstExists(false);
      bullet.tint = this.tint;
      bullet.reset(this.x, this.y - 20);
      // bullet.body.velocity.y = 300;
      // let shotAngle = this.getAngleTo(this.player);
      let shotAngle = this.game.physics.arcade.angleBetween(this, this.player);
      this.game.physics.arcade.velocityFromAngle(Phaser.Math.radToDeg(shotAngle) , 200, bullet.body.velocity);
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
