class Play extends Phaser.Scene {
    constructor () {
        super ("playScene");
    }

    preload(){
        //load images
        this.load.path ='./assets/';
        this.load.image ('hell','Hell.png');
        this.load.spritesheet('gOver','GameOver.png',{frameWidth:game.config.width,framHeight:game.config.height,startFrame:0,endFrame:2});
        this.load.image('squareKirby', 'squareKirby.png');
        this.load.image('groundScroll', 'ground.png');
        // change platform image here
        this.load.image('platform', 'stairs.png');
        this.load.image('saltRing', 'saltRing.png');
    }

    create(){ 
        // place tile
        this.hell = this.add.tileSprite (0,0,game.config.width,game.config.height,'hell').setOrigin(0,0);
        this.ring = this.physics.add.sprite(500, game.config.height/2-120, 'saltRing', 'side').setScale(SCALE);

        //this.player = new Player(this, game.config.width/2, game.config.height/2, 'squareKirby').setOrigin(0.5, 0);
        
        // define keys
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        //Jump Action
        this.JUMP_VELOCITY = -400;
        this.SCROLL_SPEED = 2;
        this.MAX_JUMPS = 2;
        this.physics.world.gravity.y = 1500;

        // make ground tiles group
        this.ground = this.add.group();
        for(let i = 0; i < game.config.width; i += tileSize) {
            let groundTile = this.physics.add.sprite(i, game.config.height - tileSize, 'groundScroll', 'block').setScale(tileSize).setOrigin(0);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            this.ground.add(groundTile);
        }
        Platform01 = this.physics.add.sprite(tileSize * 3, game.config.height - tileSize*3, 'platform','stair').setScale(SCALE).setOrigin(0);
        Platform01.body.immovable = true;
        Platform01.body.allowGravity = false;
        Platform01.body.setVelocityX(-this.SCROLL_SPEED);
        this.ground.add (Platform01);
        // make platform tiles group
        movePlatform = this.physics.add.sprite(tileSize * 4, game.config.height - tileSize*5, 'platform','stair').setScale(SCALE).setOrigin(0);
        movePlatform.body.immovable = true;
        movePlatform.body.allowGravity = false;
        movePlatform.body.setVelocityX(50);
        this.ground.add (movePlatform);

        // put another tile sprite above the ground tiles
        this.groundScroll = this.add.tileSprite(0, game.config.height-tileSize, game.config.width, tileSize, 'groundScroll').setOrigin(0);
        
        // set up player
        this.kirby = this.physics.add.sprite(180, game.config.height/2-tileSize, 'squareKirby', 'side').setScale(SCALE);

        // add physics collider
        this.physics.add.collider(this.kirby, this.ground); 
        this.physics.add.collider(this.ring, this.ground);
    }
    

    update(){
        //make background scroll
        this.hell.tilePositionX += (this.SCROLL_SPEED);
        this.ring.x -= this.SCROLL_SPEED;

        //game Over restarting choice
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)){
            this.scene.restart();
        }
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keySPACE)){
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

        //collide, and change to gameOverScene
        this.physics.add.overlap(this.kirby, this.ring, this.gameOverFun, null, this);
    }

    //load gameOverScene
    gameOverFun(){
        this.scene.start("gameOverScene");
        console.log("gameOver");
    }
}
