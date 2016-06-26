/// <reference path="../tsDefinitions/phaser.comments.d.ts" />
/// <reference path="Player.ts" />
/// <reference path="PowerUp.ts" />
/// <reference path="Bat.ts" />

module Shapeshifter {
  export class Level1 extends Phaser.State {
 
    // Graphics and Sound
    background: Phaser.TileSprite;
    ssLevel1Theme: Phaser.Sound;
    getPowerUpSound: Phaser.Sound;
    playerHurtSound: Phaser.Sound;
    enemyDyingSound: Phaser.Sound;
    // Game Objects
    player: Shapeshifter.Player;
    enemies: Phaser.Group;
    enemyBulletPool: Phaser.Group;
    powerUps: Phaser.Group;
    // healthBar: Phaser.Sprite;
    // bat: Shapeshifter.Bat;
 
    create() {
      // Setup World
			this.game.world.setBounds(0, 0, Shapeshifter.Game.WORLD_WIDTH, Shapeshifter.Game.WORLD_HEIGHT);
      
      // Set up TileSet background
      // this.background = this.add.sprite(0, 0, 'level1');
      this.background = this.add.tileSprite(0, 0, Shapeshifter.Game.WORLD_WIDTH, Shapeshifter.Game.WORLD_HEIGHT, 'level1ground');
      
      // Set up Sound
      this.ssLevel1Theme = this.add.audio('ssLevel1Theme', 0.3, false);
      this.ssLevel1Theme.play();
      this.getPowerUpSound = this.game.add.audio('wizardShooting');
      this.playerHurtSound = this.game.add.audio('playerHurt');
      this.enemyDyingSound = this.game.add.audio('mobDying');
      if (Shapeshifter.Game.MUTE_SOUND) this.game.sound.mute = true;
      
      // Setup player
      this.player = new Player(this.game, Shapeshifter.Game.WORLD_WIDTH / 2, Shapeshifter.Game.WORLD_HEIGHT - 20);
      
      // Collectables
      this.powerUps = this.game.add.group();
      
      // BATS!
      this.createEnemyBulletPool();
      this.enemies = this.game.add.group();
      // this.enemies.create(300, 400, "bat1");
			for (let i = 0; i < 30; i++) {
        // Need to place them randomly
				var bat = new Bat(this.game, this.game.rnd.between(40, Shapeshifter.Game.WORLD_WIDTH - 40), -200, this.enemyBulletPool, this.player);
				this.enemies.add(bat);
				bat.exists = false; 
				bat.alive = false;
			}
            
      // Setup Camera
      this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_PLATFORMER);
      this.game.camera.x = 50;
      // this.game.camera.x = 0;
      this.game.camera.y = 0;
      
      // --Timed High Level Events--

      // Setup first wave of Brown Bats
      if (!Shapeshifter.Game.EMPTY_ROOM) {
        // Blue Bat Wave
        // var blueBatwave1Timer = this.game.time.events.add(Phaser.Timer.SECOND, () => this.startBatWave("BlueBat", 300, 20), this);

        // Orange Bat Wave
        // var orangeBatwave1Timer = this.game.time.events.add(Phaser.Timer.SECOND, () => this.startBatWave("OrangeBat", 600, 10), this);

        // Red Bat Wave
        // var redBatwave1Timer = this.game.time.events.add(Phaser.Timer.SECOND, () => this.startBatWave("RedBat", 3000, 2), this);

        
        // var wave1Timer = this.game.time.events.add(Phaser.Timer.SECOND, this.startBrownBatWave, this);
        var wave1Timer = this.game.time.events.add(Phaser.Timer.SECOND, () => this.startBatWave("BrownBat", 300, 30), this);
        var powerUp1Timer = this.game.time.events.add(Phaser.Timer.SECOND * 7, () => { 
          var powerUp1 = new PowerUp(this.game, PowerUpType.Wizard);
          this.powerUps.add(powerUp1); 
        }, this);
        // var wave2Timer = this.game.time.events.add(Phaser.Timer.SECOND * 9, this.startBrownBatWave, this);
        var wave2Timer = this.game.time.events.add(Phaser.Timer.SECOND * 9, () => this.startBatWave("BlueBat", 300, 20), this);
        // var wave3Timer = this.game.time.events.add(Phaser.Timer.SECOND * 18, this.startBrownBatWave, this);
        var wave3Timer = this.game.time.events.add(Phaser.Timer.SECOND * 18, () => this.startBatWave("OrangeBat", 600, 10), this);
        var wave4Timer = this.game.time.events.add(Phaser.Timer.SECOND * 28, () => this.startBatWave("RedBat", 800, 6), this);
        // Victory condition
        var victoryCondition = this.game.time.events.add(Phaser.Timer.SECOND * 40, this.stageDefeated, this);
        
      }
    } // create()
    
    update() {
      // Handle Collisions
      this.physics.arcade.overlap(this.player, this.enemies, this.playerVsEnemy, null, this);
      // this.physics.arcade.overlap(this.player.playerBulletPool, this.enemies, this.playerBulletVsEnemy, null, this);
      this.physics.arcade.overlap(this.player.playerWeapon.bullets, this.enemies, this.playerBulletVsEnemy, null, this);
      this.physics.arcade.overlap(this.player, this.powerUps, this.playerVsPowerUp, null, this);
      this.physics.arcade.overlap(this.player, this.enemyBulletPool, this.playerVsEnemyBullet, null, this);
      
      // Constantly scroll the tileSprite background
      this.background.tilePosition.y += Shapeshifter.Game.GAME_SCROLL_SPEED;
    }
    
    playerVsEnemy(player:Player, enemy) {
      if (!enemy.alive) return;
      enemy.kill();
      if (player.takeDamageCooldown < 1) {
        player.takeDamage(20);
        this.playerHurtSound.play();
      }
    }
    
    playerBulletVsEnemy(bullet, enemy) {
      enemy.kill();
      bullet.kill();
      this.enemyDyingSound.play();
    }
    
    playerVsPowerUp(player:Player, powerUp:PowerUp) {
      powerUp.kill();
      // Play a sound
      this.getPowerUpSound.play();
      if (powerUp.powerUpType == PowerUpType.Wizard) {
        player.hasWizardForm = true;
      } else {
        player.hasCrowForm = true;
      }
    }

    playerVsEnemyBullet(player, bullet) {
      bullet.kill();
      if (player.takeDamageCooldown < 1) {
        player.takeDamage(40);
        this.playerHurtSound.play();
      }
    }

    startBatWave(batTypeName:string, delay:number, repeatCount:number) {
      this.game.time.events.repeat(delay, repeatCount, 
        () => { 
          let bat:Bat = this.enemies.getFirstExists(false);
          if (bat)
            // brownBat.reviveAsBrownBat();
            bat.reviveBat(batTypeName);
         });
    }

    createEnemyBulletPool() {
      this.enemyBulletPool = this.game.add.group();
      // this.enemyBulletPool = this.game.add.group(this.game.world, "enemyBulletPool");
      this.enemyBulletPool.enableBody = true;
      this.enemyBulletPool.physicsBodyType = Phaser.Physics.ARCADE;
      this.enemyBulletPool.createMultiple(100, 'batBullet');
      this.enemyBulletPool.setAll('anchor.x', 0.5);
      this.enemyBulletPool.setAll('anchor.y', 0.5);
      this.enemyBulletPool.setAll('outOfBoundsKill', true);
      this.enemyBulletPool.setAll('checkWorldBounds', true);
    }

    stageDefeated() {
      if (this.player.playerState != PlayerState.Dead) {
        let textStyle = { font: "20px Arial", fill: "#ff0000", align: "center" };
        let gameOverText = `YOU ARE WINNER
        Sorry there is so little "game" here, thanks for playing anyway`;
        let text = this.game.add.text(0, 0, gameOverText, textStyle);
        text.fixedToCamera = true;
        text.cameraOffset.setTo(-20, 300);
      }
    }
    
    render() {
      if (Shapeshifter.Game.DEBUG_MODE) {
        this.game.debug.text(`takeDamageCooldown: ${this.player.takeDamageCooldown}
        hasWizardForm: ${this.player.hasWizardForm}`
          , 10, 120);
        // Player X Scale: ${this.player.scale.x}
        this.game.debug.text(`Player X Scale: ${this.player.scale.x}`
          , 10, 140);

        this.game.debug.spriteInfo(this.player, 32, 32);
        // Sprite Body Debugging
        // this.game.debug.body(this.player);
        // this.game.debug.body(this.enemies);

        // call renderGroup on each of the alive members    
        // this.enemies.forEachAlive((member) => this.game.debug.body(member),       this);

      } // end of if DEBUG MODE
    } // render()
    
  }
} 