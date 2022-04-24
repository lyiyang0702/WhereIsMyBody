class Play extends Phaser.Scene {
    constructor () {
        super ("playScene");
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
        // place tile
        this.hell = this.add.tileSprite (0,0,640,320,'hell').setOrigin(0,0);
        this.ring = this.physics.add.sprite(500, game.config.height/2-120, 'saltRing', 'side').setScale(SCALE);
        //this.player = new Player(this, game.config.width/2, game.config.height/2, 'squareKirby').setOrigin(0.5, 0);
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

        //Jump Action
        this.JUMP_VELOCITY = -500;
        this.SCROLL_SPEED = 4;
        this.MAX_JUMPS = 2;
        this.physics.world.gravity.y = 2600;

        // make ground tiles group
        this.ground = this.add.group();
        for(let i = 0; i < game.config.width; i += tileSize) {
            let groundTile = this.physics.add.sprite(i, game.config.height - tileSize, 'groundScroll', 'block').setScale(tileSize).setOrigin(0);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            this.ground.add(groundTile);
        }
        
        // put another tile sprite above the ground tiles
        this.groundScroll = this.add.tileSprite(0, game.config.height-tileSize, game.config.width, tileSize, 'groundScroll').setOrigin(0);

        // set up player
        this.kirby = this.physics.add.sprite(180, game.config.height/2-tileSize, 'squareKirby', 'side').setScale(SCALE);

        // add physics collider
        this.physics.add.collider(this.kirby, this.ground); 
        this.physics.add.collider(this.ring, this.ground);

        // set up Phaser-provided cursor key input
        //cursors = this.input.keyboard.createCursorKeys();
    }
    

    update(){
        //make background scroll
        this.hell.tilePositionX += this.SCROLL_SPEED;
        this.ring.x -= 1;
        //game Over restarting choice
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)){
            this.scene.restart();
        }
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keySPACE)){
            this.scene.start("menuScene");
        }
        if(this.ring.x == this.kirby.x) {
            this.scene.start("menuScene");
        }
        //make ground scroll
        this.groundScroll.tilePositionX += this.SCROLL_SPEED;
        // check if alien is grounded
	    this.kirby.isGrounded = this.kirby.body.touching.down;
        // if so, we have jumps to spare
	    if(this.kirby.isGrounded) {
            //this.kirby.anims.play('walk', true);
	    	this.jumps = this.MAX_JUMPS;
	    	this.jumping = false;
	    } else {
	    	//this.kirby.anims.play('jump');
	    }
        // allow steady velocity change up to a certain key down duration
        // see: https://photonstorm.github.io/phaser3-docs/Phaser.Input.Keyboard.html#.DownDuration__anchor
	    if(this.jumps > 0 && Phaser.Input.Keyboard.DownDuration(keySPACE, 150)) {
	        this.kirby.body.velocity.y = this.JUMP_VELOCITY;
	        this.jumping = true;
	        //this.upKey.tint = 0xFACADE;
	    } else {
	    	//this.upKey.tint = 0xFFFFFF;
	    }
        // finally, letting go of the Space key subtracts a jump
        // see: https://photonstorm.github.io/phaser3-docs/Phaser.Input.Keyboard.html#.UpDuration__anchor
	    if(this.jumping && Phaser.Input.Keyboard.UpDuration(keySPACE)) {
	    	this.jumps--;
	    	this.jumping = false;
	    }
    }
}