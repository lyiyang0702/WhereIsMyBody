class Play extends Phaser.Scene {
    constructor () {
        super ("playScene");
    }

    preload(){
        //load images
        this.load.path ='./assets/';
        this.load.image ('hell','Hell.png');
    }

    create(){
        // place tile
        this.hell = this.add.tileSprite (0,0,640,320,'hell').setOrigin(0,0);
    }

    update(){
        this.hell.tilePositionX -=4;
    }
}