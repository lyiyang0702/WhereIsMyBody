class Tutorial extends Phaser.Scene {
    constructor () {
        super ("tutorialScene");
    }

    preload() {
        this.load.path ='./assets/';
        this.load.image ('tutorial','tutorial.png');
        this.load.audio('select', 'selectSound.wav');
    }

    create(){
        // define keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        // show menu text
        this.tutorial = this.add.tileSprite (0,0,game.config.width,game.config.height,'tutorial').setOrigin(0,0);
    }
    update(){
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            let music = this.sound.add('select');
            music.play();
            menuMusic.stop();
            this.scene.start('playScene');    
        }
    }

}