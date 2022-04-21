class Menu extends Phaser.Scene {
    constructor () {
        super ("menuScene");
    }
    update(){
        this.scene.start('playScene');
    } 
}