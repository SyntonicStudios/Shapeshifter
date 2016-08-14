/// <reference path="../tsDefinitions/phaser.comments.d.ts" />
var Shapeshifter;
(function (Shapeshifter) {
    (function (PowerUpType) {
        PowerUpType[PowerUpType["Wizard"] = 0] = "Wizard";
        PowerUpType[PowerUpType["Crow"] = 1] = "Crow";
    })(Shapeshifter.PowerUpType || (Shapeshifter.PowerUpType = {}));
    var PowerUpType = Shapeshifter.PowerUpType;
    ;
    class PowerUp extends Phaser.Sprite {
        constructor(game, type) {
            // Figure out key
            let keyToUse = 'wizardBubble';
            if (type == PowerUpType.Crow)
                keyToUse = 'crowBubble';
            super(game, Shapeshifter.Game.WORLD_WIDTH / 2, -100, keyToUse, 0);
            this.powerUpType = type;
            // Enable Player's Physics Body
            this.game.physics.arcade.enableBody(this);
            this.anchor.setTo(0.5, 0);
            game.add.existing(this);
            this.body.velocity.y = Shapeshifter.Game.VELOCITY_TO_MATCH_SCROLL_SPEED;
        }
    }
    Shapeshifter.PowerUp = PowerUp;
})(Shapeshifter || (Shapeshifter = {}));
