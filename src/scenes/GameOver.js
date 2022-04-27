class GameOver extends Phaser.Scene{
    constructor(){
        super ("gameOverScene");
    }

    preload(){
        //load images
        this.load.path ='./assets/';
        this.load.image ('hell','Hell.png');
        this.load.spritesheet('gOver','GameOver.png',{frameWidth:640,framHeight:320,startFrame:0,endFrame:2});
        this.load.image('squareKirby', 'squareKirby.png');
        this.load.image('groundScroll', 'ground.png');
        this.load.image('saltRing', 'saltRing.png');
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

        this.over = this.add.sprite(game.config.width/2,game.config.height/2-5,'gOver')
        this.over.anims.play('gOverAnimation');
        this.add.text (game.config.width/2, game.config.height/2 + borderPadding *7, 'Press R to Restart', gOverConfig).setOrigin(0.5);
        this.add.text (game.config.width/2, game.config.height/2 + borderPadding *10, 'Press M for Menu', gOverConfig).setOrigin(0.5);
    }

    update(){
        if (Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.start('playScene');    
        }
        if (Phaser.Input.Keyboard.JustDown(keyM)){
            this.scene.start('menuScene');
        }
  }
} 