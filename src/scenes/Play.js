let bgmMusic;
class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        //load images
        this.load.path = './assets/';
        this.load.spritesheet('gOver', 'GameOver.png', { frameWidth: game.config.width / 2, framHeight: game.config.height / 2, startFrame: 0, endFrame: 2 });
        this.load.image('hell', 'BackgroundNoMove.png');
        this.load.image('hell2', 'BackgroundMountain.png');
        this.load.spritesheet('gOver', 'GameOver.png', { frameWidth: game.config.width, framHeight: game.config.height, startFrame: 0, endFrame: 2 });
        this.load.atlas('ghost_atlas', 'TrueRunningGhost.png', 'ghostmap.json');
        this.load.image('ground', 'BackgroundPlatform.png');
        this.load.spritesheet('fire', 'fireAnimation.png', { frameWidth: 1280, framHeight: 720, startFrame: 0, endFrame: 4 });

        // change platform image here
        this.load.image('platform', 'ground.png');
        this.load.image('saltRing', 'SaltySalt.png');
        this.load.spritesheet('pressEnter', 'EnterSpritesheet.png', { frameWidth: game.config.width / 2, framHeight: game.config.height / 2, startFrame: 0, endFrame: 3 });
        this.load.audio('jump', 'jump.wav');
        this.load.audio('select', 'selectSound.wav');
        this.load.audio('backMusic', 'backgroundMusic.mp3');
    }

    create() {
        // place tile
        this.hell = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'hell').setOrigin(0, 0);
        this.ring = this.physics.add.sprite(game.config.width, game.config.height / 2, 'saltRing', 'side').setScale(SCALE);
        this.ring.body.gravity = false;
        this.hell2 = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'hell2').setOrigin(0, 0);
        this.mainGround = this.add.tileSprite(0, 0, game.config.width, game.config.height, 'ground').setOrigin(0, 0);

        // ghost animation
        this.anims.create({
            key: 'ghostAnimation',
            frames: this.anims.generateFrameNames('ghost_atlas', {
                prefix: 'run_ghost_',
                start: 1,
                end: 3,
                suffix: '',
                zeroPad: 4
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: 'fireAnimation',
            frames: this.anims.generateFrameNumbers('fire', { start: 0, end: 4, first: 0 }),
            frameRate: 10,
            repeat: -1
        });

        // set up player
        this.player = this.physics.add.sprite(game.config.width / 4, game.config.height / 2 - tileSize, 'ghostAnimation', 'run_ghost_0001').setScale(0.05);
        this.player.anims.play('ghostAnimation');
        this.player.setCollideWorldBounds(true);
        this.player.setBounce(0.2);
        //fire animation
        this.fire = this.add.sprite(game.config.width / 2, game.config.height / 2 - 5, 'fire');
        this.fire.anims.play('fireAnimation');
        // set size of bounding box
        this.player.body.setSize(this.player.width, this.player.height);
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
        randomSpawn = [50, 100];
        randomDistance = [100, 200];
        // make ground tiles group
        this.ground = this.add.group();
        for (let i = 0; i < game.config.width; i += tileSize) {
            let groundTile = this.physics.add.sprite(i, game.config.height - tileSize * 1.5, 'groundScroll', 'block').setScale(tileSize).setOrigin(0);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            groundTile.visible = false;
            this.ground.add(groundTile);
        }

        // group with all active platforms.
        this.platformGroup = this.add.group({
            // once a platform is removed, it's added to the pool
            removeCallback: function (platform) {
                platform.scene.platformPool.add(platform)
            }
        });
        // pool
        this.platformPool = this.add.group({

            // once a platform is removed from the pool, it's added to the active platforms group
            removeCallback: function (platform) {
                platform.scene.platformGroup.add(platform)
            }
        });
        this.addPlatform(game.config.width, game.config.width / 2);


        //random generate challenge
        // group with all active rings.
        this.ringGroup = this.add.group({

            // once a ring is removed, it's added to the pool
            removeCallback: function (ring) {
                ring.scene.ringGroup.add(ring)
            }
        });
        // ring pool
        this.ringPool = this.add.group({
            // once a ring is removed from the pool, it's added to the active rings group
            removeCallback: function (ring) {
                ring.scene.ringPool.add(ring)
            }
        });

        // setting collisions between the player and the ring group
        this.physics.add.overlap(this.player, this.ringGroup, function (player, ring) {
            this.gameOverFun();
        }, null, this);


        // add physics collider
        this.physics.add.collider(this.ring, this.platformGroup);
        this.physics.add.collider(this.player, this.platformGroup);
        this.physics.add.collider(this.platformGroup, this.ring);
        this.physics.add.collider(this.ringGroup, this.platformGroup);

        // Time
        timeInSeconds = 0;
        let timeTextStyle = { font: "35px Copperplate Gothic", fill: '#E43AA4', stroke: '#000', strokeThickness: 4 };
        text = this.add.text(tileSize, tileSize, "", timeTextStyle);
        // display 0 seconds
        text.setText("Time Survived: " + timeInSeconds + " s");
        this.timer = this.time.addEvent({
            delay: 1000,
            callback: this.tick,
            loop: true,
        });

        bgmMusic = this.sound.add('backMusic', soundConfig);
        bgmMusic.play();
    }
    tick() {
        timeInSeconds++;
        // Display time
        text.setText("Time Survived: " + timeInSeconds + " s");

    }
    addPlatform(platformWidth, posX, posY) {
        addedPlatforms++;

        if (this.platformPool.getLength()) {
            platform = this.platformPool.getFirst();
            platform.x = posX;
            platform.y = posY;
            platform.visible = true;
            this.platformPool.remove(platform);
        }
        else {
            platform = this.physics.add.sprite(posX, game.config.height * 0.8, "platform").setScale(0.5);
            platform.setImmovable(true);
            platform.setVelocityX(this.PLATFORM_SPEED);
            // Change platform speed
            this.platformSpeed = this.time.delayedCall(1000, () => {
                this.PLATFORM_SPEED -= 1;
            }, null, this);
            platform.body.allowGravity = false;
            this.platformGroup.add(platform);
        }
        platform.displayWidth = platformWidth;
        this.nextPlatformDistance = Phaser.Math.Between(randomSpawn[0], randomSpawn[1]);
        // change gap size
        this.randomGap = this.time.delayedCall(10000, () => {
            if (randomSpawn[0] <= 200) {
                randomSpawn[0] += 10;
            }
            if (randomSpawn[1] <= 400) {
                randomSpawn[1] += 10;
            }
        }, null, this);
        // if this is not the starting platform...
        if (addedPlatforms > 1 && platformWidth >= 100) {
            // is there a ring over the platform?
            if (Phaser.Math.Between(1, 100) <= config.ringPercent) {
                if (this.ringPool.getLength()) {
                    let ring = this.ringPool.getFirst();
                    ring.x = posX;
                    ring.y = posY;
                    ring.alpha = 1;
                    ring.active = true;
                    ring.visible = true;
                    this.ringPool.remove(ring);
                }
                else {
                    let s = 0.05;
                    let ring = this.physics.add.sprite(posX, posY - 30, "saltRing").setScale(s);
                    ring.setImmovable(true);
                    ring.setVelocityX(platform.body.velocity.x);
                    ring.body.setSize(ring.width / 2, ring.height / 2);
                    // Change ring size
                    this.ringSize = this.time.delayedCall(10000, () => {
                        s += 0.01
                    }, null, this);
                    ring.body.allowGravity = false;
                    this.ringGroup.add(ring);
                }
            }
        }
    }

    checkGameoverFlag() {
        this.gameOverFlag == true;
    }

    //load gameOverScene
    gameOverFun() {
        if (this.gameOverFlag) {
            this.scene.start("gameOverScene");
            bgmMusic.stop();
            this.gameOverFlag = false;

        }
    }

    update() {
        //make background scroll
        this.hell.tilePositionX += (this.SCROLL_SPEED);
        this.ring.x -= this.SCROLL_SPEED;
        this.hell2.tilePositionX += (this.SCROLL_SPEED) + 1;
        this.mainGround.tilePositionX += (this.SCROLL_SPEED) + 2;
        this.gameOverFlag = true;
        //game Over restarting choice
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.start("menuScene");
        }
        // check if player is grounded
        this.player.isGrounded = this.player.body.touching.down;
        // if so, we have jumps to spare
        if (this.player.isGrounded) {
            this.jumps = this.MAX_JUMPS;
            this.jumping = false;
            this.player.body.setVelocityX(200);
        } else {
            this.player.body.setVelocityX(0);
        }
        // allow steady velocity change up to a certain key down duration
        // see: https://photonstorm.github.io/phaser3-docs/Phaser.Input.Keyboard.html#.DownDuration__anchor
        if (this.jumps > 0 && Phaser.Input.Keyboard.DownDuration(keySPACE, 150)) {
            this.player.body.velocity.y = this.JUMP_VELOCITY;
            this.jumping = true;
        }
        if (this.jumps > 0 && Phaser.Input.Keyboard.JustDown(keySPACE)) {
            let music = this.sound.add('jump');
            music.play();
        }
        // finally, letting go of the Space key subtracts a jump
        // see: https://photonstorm.github.io/phaser3-docs/Phaser.Input.Keyboard.html#.UpDuration__anchor
        if (this.jumping && Phaser.Input.Keyboard.UpDuration(keySPACE)) {
            this.jumps--;
            this.jumping = false;
        }
        // recycling platforms
        let minDistance = game.config.width;
        this.platformGroup.getChildren().forEach(function (platform) {
            let platformDistance = game.config.width - platform.x - platform.displayWidth / 2;
            minDistance = Math.min(minDistance, platformDistance);
            if (platform.x < - platform.displayWidth / 2) {
                this.platformGroup.killAndHide(platform);
                this.platformGroup.remove(platform);
            }
        }, this);

        // recycling rings
        this.ringGroup.getChildren().forEach(function (ring) {
            if (ring.x < - ring.displayWidth / 2) {
                this.ringGroup.killAndHide(ring);
                this.ringGroup.remove(ring);
            }
        }, this);

        // adding new platforms
        if (minDistance > this.nextPlatformDistance) {
            var nextPlatformWidth = Phaser.Math.Between(randomDistance[0], randomDistance[1]);
            // change platform width every 5s
            this.randomDis = this.time.delayedCall(10000, () => {
                if (randomDistance[0] >= 70) {
                    randomDistance[0] -= 10;
                }
                if (randomDistance[1] >= 100) {
                    randomDistance[1] -= 10;
                }
            }, null, this);
            this.addPlatform(nextPlatformWidth, game.config.width + nextPlatformWidth / 2, game.config.height / 5 * 4);
        }
        //collide, and change to gameOverScene
        //this.physics.add.overlap(this.player, this.ring, this.gameOverFun, this.checkGameoverFlag() , this);
        this.physics.add.overlap(this.player, this.ground, this.gameOverFun, this.checkGameoverFlag(), this);

    }
}