let menuMusic;
class Menu extends Phaser.Scene {
    constructor () {
        super ("menuScene");
    }

    preload(){
        this.load.audio('bgm', './assets/menuSong.wav');
        this.load.audio('select', './assets/selectSound.wav');
    }

    create (){
        let menuConfig = {
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

        // show menu text
        this.add.text (game.config.width/2, game.config.height/2 - borderPadding *5, 'WHERE IS MY BODY',menuConfig).setOrigin(0.5);
        this.add.text (game.config.width/2, game.config.height/2 , 'Press SPACE to START', menuConfig).setOrigin(0.5);
        this.add.text (game.config.width/2, game.config.height/2 + borderPadding *5, 'Press ENTER for Ghost 101', menuConfig).setOrigin(0.5);
        
        //define keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        //bgm
        menuMusic = this.sound.add('bgm');
        menuMusic.setLoop(true);
        menuMusic.play();
    }

    update(){
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.scene.start('playScene');   
            let music = this.sound.add('select');
            music.play();
            menuMusic.stop();
        }

        // open tutorial
        if (Phaser.Input.Keyboard.JustDown(keyENTER)){
            this.scene.start('tutorialScene');
            let music = this.sound.add('select');
            music.play();
        }
    }
}