/// <reference path="../tsDefinitions/phaser.comments.d.ts" />
var Shapeshifter;
(function (Shapeshifter) {
    (function (PlayerState) {
        PlayerState[PlayerState["Grounded"] = 0] = "Grounded";
        PlayerState[PlayerState["Airborne"] = 1] = "Airborne";
        PlayerState[PlayerState["Dead"] = 2] = "Dead";
        PlayerState[PlayerState["Transforming"] = 3] = "Transforming";
    })(Shapeshifter.PlayerState || (Shapeshifter.PlayerState = {}));
    var PlayerState = Shapeshifter.PlayerState;
    ;
    class PlayerForm {
        constructor(playerFormID, name, movementSpeed, walkSidewaysAnimationKeyName, walkDownAnimationKeyName, walkUpAnimationKeyName, abilityOne, abilityTwo, abilityThree) {
            this.playerFormID = playerFormID;
            this.name = name;
            this.movementSpeed = movementSpeed;
            this.walkSidewaysAnimationKeyName = walkSidewaysAnimationKeyName;
            this.walkDownAnimationKeyName = walkDownAnimationKeyName;
            this.walkUpAnimationKeyName = walkUpAnimationKeyName;
            this.abilityOne = abilityOne;
            this.abilityTwo = abilityTwo;
            this.abilityThree = abilityThree;
        }
    }
    Shapeshifter.PlayerForm = PlayerForm;
    Shapeshifter.PlayerForms = [
        new PlayerForm(0, "Rabbit", 250, "rabbitWalkSideways", "rabbitWalkDown", "rabbitWalkUp", null, null, null),
        new PlayerForm(1, "Wizard", 150, "wizardWalk", "wizardWalk", "wizardWalk", null, null, null),
        new PlayerForm(2, "Crow", 200, "wizardWalk", "wizardWalk", "wizardWalk", null, null, null)
    ];
    class Player extends Phaser.Sprite {
        // key1:Phaser.Key;
        // playerBulletPool: Phaser.Group;
        constructor(game, x, y) {
            super(game, x, y, 'rabbit', 0);
            // Enable Player's Physics Body
            this.game.physics.arcade.enableBody(this);
            this.body.collideWorldBounds = true;
            this.anchor.setTo(.5, .5);
            // Animations - Rabbit
            this.animations.add('rabbitWalkSideways', [0, 1], 5, true);
            this.animations.add('rabbitWalkDown', [2, 3], 5, true);
            this.animations.add('rabbitWalkUp', [4, 5], 5, true);
            // Wizard
            this.animations.add('wizardWalk', [0, 1, 2], 5, true);
            this.animations.add('wizardWalkAndShoot', [3, 4], 5, true);
            game.add.existing(this);
            this.maxHealth = 100;
            this.health = this.maxHealth;
            this.playerState = PlayerState.Grounded;
            this.healthBar = this.game.add.sprite(20, 20, 'healthBar');
            this.healthBar.anchor.setTo(0, 1);
            this.healthBar.scale.setTo(1, 0.5);
            this.healthBar.fixedToCamera = true;
            // Shapeshifter!
            this.hasWizardForm = false;
            this.hasCrowForm = false;
            // this.playerForm = PlayerForm.Rabbit;
            // Player starts off as a Rabbit
            this.playerForm = Shapeshifter.PlayerForms.find((pf) => pf.name == "Rabbit");
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
            // this.createPlayerBulletPool();
            // Handle Weapon
            this.playerWeapon = game.add.weapon(100, "wizardBullet");
            this.playerWeapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
            this.playerWeapon.bulletAngleOffset = 90;
            this.playerWeapon.bulletSpeed = 500;
            this.playerWeapon.fireRate = 200;
            this.playerWeapon.trackSprite(this, 14, 0);
            this.playerWeapon.onFire.add(() => this.wizardShootingSound.play());
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
        handleKeys() {
            switch (this.playerState) {
                case PlayerState.Grounded:
                    if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                        this.body.velocity.x = -this.playerForm.movementSpeed;
                        this.animations.play(this.playerForm.walkSidewaysAnimationKeyName);
                        if (this.scale.x == 1) {
                            this.scale.x = -1;
                        }
                    }
                    else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
                        this.body.velocity.x = this.playerForm.movementSpeed;
                        this.animations.play(this.playerForm.walkSidewaysAnimationKeyName);
                        if (this.scale.x == -1) {
                            this.scale.x = 1;
                        }
                    }
                    if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
                        this.body.velocity.y = this.playerForm.movementSpeed;
                        if (this.body.velocity.x == 0) {
                            this.animations.play(this.playerForm.walkDownAnimationKeyName);
                        }
                    }
                    else if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
                        this.body.velocity.y = -this.playerForm.movementSpeed;
                        if (this.body.velocity.x == 0) {
                            this.animations.play(this.playerForm.walkUpAnimationKeyName);
                        }
                    }
                    // Action Button
                    if (this.game.input.keyboard.isDown(Phaser.Keyboard.Q)) {
                        if (this.playerForm.name == "Wizard") {
                            this.animations.play('wizardWalkAndShoot');
                            if (this.transformationCooldown < 1) {
                                /*
                                this.wizardShootingSound.play();
                                this.transformationCooldown = 10;
                                var bullet = this.playerBulletPool.getFirstExists(false);
                                bullet.reset(this.x, this.y - 20);
                
                                bullet.body.velocity.y = -500;
                                */
                                // let shotAttempt = this.playerWeapon.fire();
                                this.playerWeapon.fire();
                            }
                        }
                    }
                    // Transform into Wizard
                    if (this.game.input.keyboard.isDown(Phaser.Keyboard.TWO)) {
                        if (this.hasWizardForm && this.playerForm.name != "Wizard" && (this.transformationCooldown < 1)) {
                            this.transformationSound.play();
                            this.playerState = PlayerState.Transforming;
                            this.transformationCooldown = 60;
                            this.body.velocity.x = 0;
                            this.body.velocity.y = Shapeshifter.Game.VELOCITY_TO_MATCH_SCROLL_SPEED;
                            this.loadTexture("wizardSpriteSheet", 0, true);
                            this.playerForm = Shapeshifter.PlayerForms.find((pf) => pf.name == "Wizard");
                            this.playerState = PlayerState.Grounded;
                            this.animations.play('wizardWalk');
                        }
                    }
                    // Transform into Rabbit
                    if (this.game.input.keyboard.isDown(Phaser.Keyboard.ONE)) {
                        if (this.playerForm.name != "Rabbit" && this.transformationCooldown < 1) {
                            this.transformationSound.play();
                            this.playerState = PlayerState.Transforming;
                            this.transformationCooldown = 60;
                            this.body.velocity.x = 0;
                            this.body.velocity.y = Shapeshifter.Game.VELOCITY_TO_MATCH_SCROLL_SPEED;
                            this.loadTexture("rabbit", 0, true);
                            this.playerForm = Shapeshifter.PlayerForms.find((pf) => pf.name == "Rabbit");
                            this.playerState = PlayerState.Grounded;
                            this.animations.play("rabbitWalkUp");
                        }
                    }
                    if (this.body.velocity.x == 0 && this.body.velocity.y == 0) {
                        // this.animations.frame = 4;
                        this.animations.play(this.playerForm.walkUpAnimationKeyName);
                    }
                    break;
                case PlayerState.Dead:
                    this.keyEnter.onDown.add(() => {
                        this.game.sound.stopAll();
                        this.game.state.start('Level1', true, false);
                    });
                    break;
            }
        }
        takeDamage(damageAmount) {
            // bullet.kill();
            this.takeDamageCooldown = 60;
            this.health -= damageAmount;
            this.healthBar.scale.setTo(this.health / 100, 0.5);
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
    }
    Shapeshifter.Player = Player;
})(Shapeshifter || (Shapeshifter = {}));
