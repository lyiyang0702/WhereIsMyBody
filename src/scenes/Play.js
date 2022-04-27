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
        this.ring = this.physics.add.sprite(game.config.width*2, game.config.height/2-120, 'saltRing', 'side').setScale(SCALE);

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

        // group with all active platforms.
        this.platformGroup = this.add.group({
 
            // once a platform is removed, it's added to the pool
            removeCallback: function(platform){
                platform.scene.platformPool.add(platform)
            }
        });
 
        // pool
        this.platformPool = this.add.group({
 
            // once a platform is removed from the pool, it's added to the active platforms group
            removeCallback: function(platform){
                platform.scene.platformGroup.add(platform)
            }
        });
        this.addPlatform(game.config.width/2, game.config.width / 2);

        // put another tile sprite above the ground tiles
        this.groundScroll = this.add.tileSprite(0, game.config.height-tileSize, game.config.width, tileSize, 'groundScroll').setOrigin(0);
        
        // set up player
        this.player = this.physics.add.sprite(game.config.width / 4, game.config.height/2-tileSize, 'squareKirby', 'side').setScale(4);
        this.player.setCollideWorldBounds(true);
        this.player.body.setVelocityX(150);
        this.player.setBounce(0.2);
        // add physics collider
        this.physics.add.collider(this.player, this.ground); 
        this.physics.add.collider(this.ring, this.ground);
        this.physics.add.collider(this.player, this.platformGroup);
        this.physics.add.collider(this.ring, this.platformGroup);
    }
    
    addPlatform(platformWidth, posX){
        let platform;
        if(this.platformPool.getLength()){
            platform = this.platformPool.getFirst();
            platform.x = posX;
            //platform.active = true;
            platform.visible = true;
            this.platformPool.remove(platform);
        }
        else{
            platform = this.physics.add.sprite(posX, game.config.height * 0.8, "platform").setScale(4);
            platform.setImmovable(true);
            platform.setVelocityX(-200);
            platform.body.allowGravity = false;
            this.platformGroup.add(platform);
        }
        platform.displayWidth = platformWidth;
        this.nextPlatformDistance = Phaser.Math.Between(100, 300);
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
	    this.player.isGrounded = this.player.body.touching.down;
        // if so, we have jumps to spare
	    if(this.player.isGrounded) {
            //this.player.anims.play('walk', true);
	    	this.jumps = this.MAX_JUMPS;
	    	this.jumping = false;
	    } else {
	    	//this.player.anims.play('jump');
	    }
        // allow steady velocity change up to a certain key down duration
        // see: https://photonstorm.github.io/phaser3-docs/Phaser.Input.Keyboard.html#.DownDuration__anchor
	    if(this.jumps > 0 && Phaser.Input.Keyboard.DownDuration(keySPACE, 150)) {
	        this.player.body.velocity.y = this.JUMP_VELOCITY;
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

        // recycling platforms
        let minDistance = game.config.width;
        this.platformGroup.getChildren().forEach(function(platform){
            let platformDistance = game.config.width - platform.x - platform.displayWidth / 2;
            minDistance = Math.min(minDistance, platformDistance);
            if(platform.x < - platform.displayWidth / 2){
                this.platformGroup.killAndHide(platform);
                this.platformGroup.remove(platform);
            }
        }, this);
 
        // adding new platforms
        if(minDistance > this.nextPlatformDistance){
            var nextPlatformWidth = Phaser.Math.Between(50, 250);
            this.addPlatform(nextPlatformWidth, game.config.width + nextPlatformWidth / 2);
        }
        //collide, and change to gameOverScene
        this.physics.add.overlap(this.player, this.ring, this.gameOverFun, null, this);
    }

    //load gameOverScene
    gameOverFun(){
        this.scene.start("gameOverScene");
        console.log("gameOver");
    }
}
