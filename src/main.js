let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 320,
    scene: [Menu,Play,Tutorial]
}

let game = new Phaser.Game(config);

// set UI sizes
let borderPadding = game.config.height/ 25;
//define keys
let keySPACE, keyENTER;
let keyR; //restart directly key