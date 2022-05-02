//let menuMusic1;
class GameOver extends Phaser.Scene {
    constructor(){
        super ("gameOverScene");
    }

    preload() {
        this.load.audio('select', './assets/selectSound.wav');
        this.load.audio('bgm', './assets/menuSong.wav');
        this.load.spritesheet('gameOverWords','./assets/gameOverWords.png',{frameWidth:1280,framHeight:720,startFrame:0,endFrame:3});
        this.load.spritesheet('gameOverTitle','./assets/gameOverWord.png',{frameWidth:1280,framHeight:720,startFrame:0,endFrame:3});
        this.load.image('bg', './assets/fullBackground.png');
    }
    create(){
        //define keys
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);

        // gameOver animation
        this.anims.create({
            key:'gOverAnimation',
            frames:this.anims.generateFrameNumbers('gOver',{start:0, end: 2, first: 0}),
            frameRate:10,
            repeat:-1
        });

        this.anims.create({
            key:'gameOverWordsAnimation',
            frames:this.anims.generateFrameNumbers('gameOverWords',{start:0, end: 3, first: 0}),
            frameRate:10,
            repeat:-1
        });

        this.anims.create({
            key:'gameOverTitleAnimation',
            frames:this.anims.generateFrameNumbers('gameOverTitle',{start:0, end: 3, first: 0}),
            frameRate:10,
            repeat:-1
        });
        let gOverConfig = {
            fontFamily: 'Courier',
            fontSize: '24px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top:5,
                bottom: 5,
            },
            fixedWidth: 0
        }

        //this.over = this.add.sprite(game.config.width/2,game.config.height/2-5,'gOver');
        //this.over.anims.play('gOverAnimation');
        //this.add.text (game.config.width/2, game.config.height/2 + borderPadding *7, 'Press R to Restart', gOverConfig).setOrigin(0.5);
        //this.add.text (game.config.width/2, game.config.height/2 + borderPadding *10, 'Press M for Menu', gOverConfig).setOrigin(0.5);
        this.bgrd1 = this.add.tileSprite (0,0,game.config.width,game.config.height,'bg').setOrigin(0,0);
        this.gameWords = this.add.sprite(game.config.width/2,game.config.height/2-5,'gameOverWords');
        this.gameWords.anims.play('gameOverWordsAnimation');
        this.gameTitle = this.add.sprite(game.config.width/2,game.config.height/2-5,'gameOverTitle');
        this.gameTitle.anims.play('gameOverTitleAnimation');
        let timeTextStyle = {font: "35px Roboto", fill: '#E43AA4', stroke: '#000', strokeThickness: 4}; 
        // Display score
        text = this.add.text(game.config.width/2, game.config.height/2+ borderPadding *5,"",timeTextStyle).setOrigin(0.5);
        text.setText("Score: " + timeInSeconds + " s");
        menuMusic = this.sound.add('bgm',soundConfig);
        menuMusic.play();
    }
    update(){
        this.bgrd1.tilePositionX += 2;
        if (Phaser.Input.Keyboard.JustDown(keyR)) {
            let music = this.sound.add('select');
            music.play();
            menuMusic.stop();
            this.scene.start('playScene');    
        }
        if (Phaser.Input.Keyboard.JustDown(keyM)){
            let music = this.sound.add('select');
            music.play();
            menuMusic.stop();
            this.scene.start('menuScene');
        }
    }
} 