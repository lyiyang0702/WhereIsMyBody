class Jump extends Phaser.Scene{
    constructor(){
        super('playScene');
    }

    create(){
        //this.ACCELERATION = 500;
        this.JUMP_VELOCIRY = -1000;
        this.physics.world.gravity.y = 300;
        
        // draw grid lines for jump height reference
        let graphics = this.add.graphics();
        graphics.lineStyle(2, 0xFFFFFF, 0.1);
	    for(let y = game.config.height-70; y >= 35; y -= 35) {
        graphics.lineBetween(0, y, game.config.width, y);
        }
    }

}