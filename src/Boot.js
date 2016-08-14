/// <reference path="../tsDefinitions/phaser.comments.d.ts" />
var Shapeshifter;
(function (Shapeshifter) {
    class Boot extends Phaser.State {
        preload() {
            this.load.image('preloadBar', 'assets/loader.png');
        }
        create() {
            // Enable Arcade Physics
            this.game.physics.enable(this, Phaser.Physics.ARCADE);
            //  Unless you specifically need to support multitouch I would recommend setting this to 1
            this.input.maxPointers = 1;
            //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
            this.stage.disableVisibilityChange = true;
            if (this.game.device.desktop) {
            }
            else {
            }
            this.game.state.start('Preloader', true, false);
        }
    }
    Shapeshifter.Boot = Boot;
})(Shapeshifter || (Shapeshifter = {}));
