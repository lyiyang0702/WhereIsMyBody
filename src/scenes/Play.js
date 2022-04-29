class Play extends Phaser.Scene {
    constructor () {
        super ("playScene");
    }

    preload(){
        //load images
        this.load.path ='./assets/';
        //this.load.image ('hell','Hell.png');
        this.load.spritesheet('gOver','GameOver.png',{frameWidth:game.config.width/2,framHeight:game.config.height/2,startFrame:0,endFrame:2});
        this.load.image ('hell','BackgroundNoMove.png');
        this.load.image ('hell2','BackgroundMountain.png');
        this.load.spritesheet('gOver','GameOver.png',{frameWidth:game.config.width,framHeight:game.config.height,startFrame:0,endFrame:2});
        this.load.image('squareKirby', 'squareKirby.png');
        this.load.image('ground', 'BackgroundPlatform.png');
        // change platform image here
        this.load.image('platform', 'stairs.png');
        this.load.image('saltRing', 'saltRing.png');
        this.load.spritesheet('pressEnter', 'EnterSpritesheet.png',{frameWidth:game.config.width/2,framHeight:game.config.height/2,startFrame:0,endFrame:3});
        //bgm
        //this.load.audio('bgm', 'backgroundMusic.mp3');
    }

    create(){ 
        // //bgm
        // let music = this.sound.add('bgm');
        // music.setLoop(true);
        // music.play();

        // place tile
        this.hell = this.add.tileSprite (0,0,game.config.width,game.config.height,'hell').setOrigin(0,0);
        this.ring = this.physics.add.sprite(game.config.width*2, game.config.height/2-120, 'saltRing', 'side').setScale(SCALE);
        this.hell2 = this.add.tileSprite (0,0,game.config.width,game.config.height,'hell2').setOrigin(0,0);
        this.mainGround = this.add.tileSprite (0,0,game.config.width,game.config.height,'ground').setOrigin(0,0);
        //this.ring = this.physics.add.sprite(500, game.config.height/2-120, 'saltRing', 'side').setScale(SCALE);
        
        // define keys
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        //Jump Action
        this.JUMP_VELOCITY = -500;
        this.SCROLL_SPEED = 2;
        this.MAX_JUMPS = 2;
        this.physics.world.gravity.y = 1500;
        this.PLATFORM_SPEED = -200;
        // random paltform distances
        randomSpawn = [100,200];
        randomDistance = [100,200];
        // make ground tiles group
        this.ground = this.add.group();
        for(let i = 0; i < game.config.width; i += tileSize) {
            let groundTile = this.physics.add.sprite(i, game.config.height - tileSize*1.5, 'groundScroll', 'block').setScale(tileSize).setOrigin(0);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            groundTile.visible = false;
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
        this.addPlatform(game.config.width, game.config.width / 2);
        
        // set up player
        this.player = this.physics.add.sprite(game.config.width / 4, game.config.height/2-tileSize, 'squareKirby', 'side').setScale(4);
        this.player.setCollideWorldBounds(true);
        this.player.setBounce(0.2);
        // add physics collider
        //this.physics.add.collider(this.player, this.ground); 
        this.physics.add.collider(this.ring, this.ground);
        this.physics.add.collider(this.player, this.platformGroup);
        // Display time
        let timeTextStyle = {font: "35px Roboto", fill: '#E43AA4', stroke: '#000', strokeThickness: 4}; 
        text = this.add.text(tileSize,tileSize,"",timeTextStyle);
    }

    addPlatform(platformWidth, posX){
        if(this.platformPool.getLength()){
            platform = this.platformPool.getFirst();
            platform.x = posX;
            platform.visible = true;
            this.platformPool.remove(platform);
        }
        else{
            platform = this.physics.add.sprite(posX, game.config.height * 0.8, "platform").setScale(4);
            platform.setImmovable(true);
            platform.setVelocityX(this.PLATFORM_SPEED);
            platform.body.allowGravity = false;
            this.platformGroup.add(platform);
        }
        platform.displayWidth = platformWidth;
        this.nextPlatformDistance = Phaser.Math.Between(randomSpawn[0], randomSpawn[1]);
        // change gap size
        if (randomSpawn[0]<=300){
            randomSpawn[0] += 10;
        }
        if (randomSpawn[1]>=500){
            randomSpawn[1] += 10;
        }
    }

    checkGameoverFlag(){
        this.gameOverFlag == true;
    }
    //load gameOverScene
    gameOverFun(){
        if (this.gameOverFlag){
            this.scene.start("gameOverScene");
            this.gameOverFlag = false;
        }
    }


    update(){
        timer = this.time.now * 0.001;
        console.log(timer);
        //make background scroll
        this.hell.tilePositionX += (this.SCROLL_SPEED);
        this.ring.x -= this.SCROLL_SPEED;
        this.hell2.tilePositionX += (this.SCROLL_SPEED) + 1;
        this.mainGround.tilePositionX += (this.SCROLL_SPEED) + 2;
        this.gameOverFlag = true;
        //game Over restarting choice
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)){
            this.scene.restart();
        }
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keySPACE)){
            this.scene.start("menuScene");
        }
        // check if alien is grounded
	    this.player.isGrounded = this.player.body.touching.down;
        // if so, we have jumps to spare
	    if(this.player.isGrounded) {
            //this.player.anims.play('walk', true);
	    	this.jumps = this.MAX_JUMPS;
	    	this.jumping = false;
            this.player.body.setVelocityX(200);
	    } else {
	    	//this.player.anims.play('jump');
            this.player.body.setVelocityX(0);
	    }
        // allow steady velocity change up to a certain key down duration
        // see: https://photonstorm.github.io/phaser3-docs/Phaser.Input.Keyboard.html#.DownDuration__anchor
	    if(this.jumps > 0 && Phaser.Input.Keyboard.DownDuration(keySPACE, 150)) {
	        this.player.body.velocity.y = this.JUMP_VELOCITY;
	        this.jumping = true;
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
            var nextPlatformWidth = Phaser.Math.Between(randomDistance[0],randomDistance[1]);
            // change platform width
            if (randomDistance[0]>=30){
                randomDistance[0] -= 10;
            }
            if (randomDistance[1]>=50){
                randomDistance[1] -= 10;
            }
            this.addPlatform(nextPlatformWidth, game.config.width + nextPlatformWidth / 2);
        }
        //collide, and change to gameOverScene
        this.physics.add.overlap(this.player, this.ring, this.gameOverFun, this.checkGameoverFlag() , this);
        this.physics.add.overlap(this.player, this.ground, this.gameOverFun, this.checkGameoverFlag(), this);
        // Display time
        text.setText("Time Survived: " + Math.round(timer) + " seconds");
    }
}
