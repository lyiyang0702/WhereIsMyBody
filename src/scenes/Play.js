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
        this.load.image('platform', 'ground.png');
        this.load.image('saltRing', 'saltRing.png');
        this.load.spritesheet('pressEnter', 'EnterSpritesheet.png',{frameWidth:game.config.width/2,framHeight:game.config.height/2,startFrame:0,endFrame:3});
    }

    create(){ 
        // place tile
        this.hell = this.add.tileSprite (0,0,game.config.width,game.config.height,'hell').setOrigin(0,0);
        this.ring = this.physics.add.sprite(game.config.width, game.config.height/2, 'saltRing', 'side').setScale(SCALE);
        this.ring.body.gravity = false;
        this.hell2 = this.add.tileSprite (0,0,game.config.width,game.config.height,'hell2').setOrigin(0,0);
        this.mainGround = this.add.tileSprite (0,0,game.config.width,game.config.height,'ground').setOrigin(0,0);
       
        // set up player
        this.player = this.physics.add.sprite(game.config.width / 4, game.config.height/2-tileSize, 'squareKirby', 'side').setScale(4);
        this.player.setCollideWorldBounds(true);
        this.player.setBounce(0.2);
        
        // define keys
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        //Jump Action
        this.JUMP_VELOCITY = -500;
        this.SCROLL_SPEED = 2;
        this.MAX_JUMPS = 2;
        this.RING_SPEED = -200;
        this.physics.world.gravity.y = 1500;
        this.PLATFORM_SPEED = -200;
        addedPlatforms = 0;

        // random paltform properties
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

        
        //random generate challenge
        // group with all active rings.
        this.ringGroup = this.add.group({
 
            // once a ring is removed, it's added to the pool
            removeCallback: function(ring){
                ring.scene.ringGroup.add(ring)
            }
        });
        // ring pool
        this.ringPool = this.add.group({
            // once a ring is removed from the pool, it's added to the active rings group
            removeCallback: function(ring){
                ring.scene.ringPool.add(ring)
            }
        });

        // setting collisions between the player and the ring group
        this.physics.add.overlap(this.player, this.ringGroup, function(player, ring){
            this.gameOverFun();
        }, null, this);
        
        
        // add physics collider
        this.physics.add.collider(this.ring, this.platformGroup);
        this.physics.add.collider(this.player, this.platformGroup);
        this.physics.add.collider(this.platformGroup, this.ring);
        this.physics.add.collider(this.player, this.ringGroup);
        this.physics.add.collider(this.ringGroup, this.platformGroup);

        // Time
        timeInSeconds = 0;
        let timeTextStyle = {font: "35px Roboto", fill: '#E43AA4', stroke: '#000', strokeThickness: 4}; 
        text = this.add.text(tileSize,tileSize,"",timeTextStyle);
        // display 0 seconds
        text.setText("Time Survived: " + timeInSeconds + " s");
        this.timer = this.time.addEvent({
            delay:1000,
            callback: this.tick,
            loop: true,
        });
    }
    tick(){
        timeInSeconds++;
        // Display time
        text.setText("Time Survived: " + timeInSeconds + " s");

    }
    addPlatform(platformWidth, posX, posY){
        addedPlatforms++;

        if(this.platformPool.getLength()){
            platform = this.platformPool.getFirst();
            platform.x = posX;
            platform.y = posY;
            platform.visible = true;
            this.platformPool.remove(platform);
        }
        else{
            platform = this.physics.add.sprite(posX, game.config.height * 0.8, "platform").setScale(0.5);
            platform.setImmovable(true);
            platform.setVelocityX(this.PLATFORM_SPEED);
            // Change platform speed
            this.platformSpeed= this.time.delayedCall(1000,() =>{
                this.PLATFORM_SPEED -= 1;
            },null,this);
            platform.body.allowGravity = false;
            this.platformGroup.add(platform);
        }
        platform.displayWidth = platformWidth;
        this.nextPlatformDistance = Phaser.Math.Between(randomSpawn[0], randomSpawn[1]);
        // change gap size
        this.randomGap= this.time.delayedCall(5000,() =>{
            if (randomSpawn[0]<=300){
                randomSpawn[0] += 10;
            }
            if (randomSpawn[1]>=500){
                randomSpawn[1] += 10;
            }
        },null,this);
        // if this is not the starting platform...
        if(addedPlatforms > 1){
            // is there a coin over the platform?
            if(Phaser.Math.Between(1, 100) <= config.ringPercent){
                if(this.ringPool.getLength()){
                    let ring = this.ringPool.getFirst();
                    ring.x = posX;
                    ring.y = posY;
                    ring.alpha = 1;
                    ring.active = true;
                    ring.visible = true;
                    this.ringPool.remove(ring);
                }
                else{
                    
                    let ring = this.physics.add.sprite(posX, posY - 30 , "saltRing");
                    ring.setImmovable(true);
                    ring.setVelocityX(this.RING_SPEED);
                    // Change ring speed
                    this.ringSpeed= this.time.delayedCall(5000,() =>{
                        this.RING_SPEED -= 20;
                      },null,this);
                    ring.body.allowGravity = false;
                    this.ringGroup.add(ring);
                }
            }
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

        // recycling rings
        this.ringGroup.getChildren().forEach(function(ring){
            if(ring.x < - ring.displayWidth / 2){
                this.ringGroup.killAndHide(ring);
                this.ringGroup.remove(ring);
            }
        }, this);
 
        // adding new platforms
        if(minDistance > this.nextPlatformDistance){
            var nextPlatformWidth = Phaser.Math.Between(randomDistance[0],randomDistance[1]);
            // change platform width
            this.randomDis= this.time.delayedCall(5000,() =>{
                if (randomDistance[0]>=30){
                    randomDistance[0] -= 10;
                }
                if (randomDistance[1]>=50){
                    randomDistance[1] -= 10;
                }
            },null,this);
            this.addPlatform(nextPlatformWidth, game.config.width + nextPlatformWidth / 2, game.config.height / 5 * 4);
        }
        //collide, and change to gameOverScene
        this.physics.add.overlap(this.player, this.ring, this.gameOverFun, this.checkGameoverFlag() , this);
        this.physics.add.overlap(this.player, this.ground, this.gameOverFun, this.checkGameoverFlag(), this);

    }
}
