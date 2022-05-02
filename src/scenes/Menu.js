let menuMusic;
class Menu extends Phaser.Scene {
    constructor () {
        super ("menuScene");
    }

    preload(){
        this.load.audio('bgm', './assets/menuSong.wav');
        this.load.audio('select', './assets/selectSound.wav');
        this.load.spritesheet('enterSprite','./assets/enterAnimation.png',{frameWidth:1280,framHeight:720,startFrame:0,endFrame:3});
        this.load.spritesheet('titleSprite','./assets/titleAnimation.png',{frameWidth:1280,framHeight:720,startFrame:0,endFrame:3});
        this.load.spritesheet('tutorialSprite','./assets/tutorialAnimation.png',{frameWidth:1280,framHeight:720,startFrame:0,endFrame:3});
        this.load.image('bg', './assets/fullBackground.png');
    }

    create (){
        this.anims.create({
            key:'enterAnimation',
            frames:this.anims.generateFrameNumbers('enterSprite',{start:0, end: 3, first: 0}),
            frameRate:10,
            repeat:-1
        });

        this.anims.create({
            key:'titleAnimation',
            frames:this.anims.generateFrameNumbers('titleSprite',{start:0, end: 3, first: 0}),
            frameRate:10,
            repeat:-1
        });

        this.anims.create({
            key:'tutorialAnimation',
            frames:this.anims.generateFrameNumbers('tutorialSprite',{start:0, end: 3, first: 0}),
            frameRate:10,
            repeat:-1
        });

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
        //this.add.text (game.config.width/2, game.config.height/2 - borderPadding *5, 'WHERE IS MY BODY',menuConfig).setOrigin(0.5);
        //this.add.text (game.config.width/2, game.config.height/2 , 'Press SPACE to START', menuConfig).setOrigin(0.5);
        //this.add.text (game.config.width/2, game.config.height/2 + borderPadding *5, 'Press ENTER for Ghost 101', menuConfig).setOrigin(0.5);
        this.bgrd = this.add.tileSprite (0,0,game.config.width,game.config.height,'bg').setOrigin(0,0);
        this.menuEnter = this.add.sprite(game.config.width/2,game.config.height/2+50,'enterSprite');
        this.menuEnter.anims.play('enterAnimation');
        this.menuTitle = this.add.sprite(game.config.width/2,game.config.height/2-5,'titleSprite');
        this.menuTitle.anims.play('titleAnimation');
        this.menuTutorial = this.add.sprite(game.config.width/2,game.config.height/2-5,'tutorialSprite');
        this.menuTutorial.anims.play('tutorialAnimation');
        //define keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        //bgm
        menuMusic = this.sound.add('bgm',soundConfig);
        menuMusic.setLoop(true);
        menuMusic.play();
    }

    update(){
        this.bgrd.tilePositionX += 2;
        if (Phaser.Input.Keyboard.JustDown(keyENTER)) {
            this.scene.start('playScene');   
            let music = this.sound.add('select');
            music.play();
            menuMusic.stop();
        }

        // open tutorial
        if (Phaser.Input.Keyboard.JustDown(keySPACE)){
            this.scene.start('tutorialScene');
            let music = this.sound.add('select');
            music.play();
        }
    }
}