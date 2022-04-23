class Play extends Phaser.Scene {
    constructor () {
        super ("playScene");
    }

    preload(){
        //load images
        this.load.path ='./assets/';
        this.load.image ('hell','Hell.png');
        this.load.spritesheet('gOver','GameOver.png',{frameWidth:640,framHeight:320,startFrame:0,endFrame:2});
    }

    create(){
        // place tile
        this.hell = this.add.tileSprite (0,0,640,320,'hell').setOrigin(0,0);
        // define keys
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        //game Over trigger
        this.gameOver = false;
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
        //statement set to count down time of 15 second
        //statement will be change after collision feature add in
        this.clock = this.time.delayedCall(15000,() =>{
          this.gg = this.add.sprite(game.config.width/2,game.config.height/2-5,'gOver')
          this.gg.anims.play('gOverAnimation');
          this.add.text (game.config.width/2, game.config.height/2 + borderPadding *7, 'Press R to Restart', gOverConfig).setOrigin(0.5);
          this.add.text (game.config.width/2, game.config.height/2 + borderPadding *10, 'Press SPACE for Menu', gOverConfig).setOrigin(0.5);
          this.gameOver = true;
        },null,this);
    }

    update(){
        this.hell.tilePositionX -=4;
        //game Over restarting choice
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)){
            this.scene.restart();
        }
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keySPACE)){
            this.scene.start("menuScene");
        }
    }
}