class Menu extends Phaser.Scene {
    constructor () {
        super ("menuScene");
    }

    create (){
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top:5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        // show menu text
        this.add.text (game.config.width/2, game.config.height/2 - borderPadding *5, 'WHERE IS MY BODY',menuConfig).setOrigin(0.5);
        this.add.text (game.config.width/2, game.config.height/2 , 'Press SPACE to START', menuConfig).setOrigin(0.5);
        this.add.text (game.config.width/2, game.config.height/2 + borderPadding *5, 'Press ENTER for Ghost 101', menuConfig).setOrigin(0.5);
        //define keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyENTER = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    }

    update(){
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.scene.start('playScene');    
        }

        // open tutorial
        if (Phaser.Input.Keyboard.JustDown(keyENTER)){
            this.scene.start('tutorialScene');
        }
    }

}