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
        let tempConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top:5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        // define keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        // show menu text
        this.tutorial = this.add.tileSprite (0,0,game.config.width,game.config.height,'tutorial').setOrigin(0,0);
        /* this.add.text (game.config.width/2, borderPadding, 'Ghost 101',tempConfig);
        tempConfig.fontSize = '18px';
        this.add.text (borderPadding, borderPadding*5, '1. Press SPACE to JUMP',tempConfig).setOrigin(0,0);
        this.add.text (borderPadding, borderPadding * 10, '2. Ghost is fragile. Keep away from SALT CIRCLE and FIRE.', tempConfig).setOrigin(0,0);
        this.add.text (borderPadding, borderPadding * 15, '3. If you can\'t protect yourself. YOU HAVE TO START OVER.', tempConfig).setOrigin(0,0);
        this.add.text (borderPadding, borderPadding * 20, 'GOOD LUCK :) (Press SPACE to START)', tempConfig).setOrigin(0,0); */
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