class Backstory extends Phaser.Scene {
    constructor(){
        super ("backstoryScene");
    }

    preload() {
        this.load.audio('select', './assets/selectSound.wav');
        this.load.audio('bgm', './assets/menuSong.wav');
        this.load.image('bgPic', './assets/gameBackstory.png');
    }
    create(){
        //define keys
        keyENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.bgrd2 = this.add.tileSprite (0,0,game.config.width,game.config.height,'bgPic').setOrigin(0,0);
        menuMusic = this.sound.add('bgm',soundConfig);
        menuMusic.play();
    }
    update(){
        if (Phaser.Input.Keyboard.JustDown(keyENTER)) {
            let music = this.sound.add('select');
            music.play();
            menuMusic.stop();
            this.scene.start('playScene');    
        }
    }
}