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
<<<<<<< HEAD
let keyR; //restart directly key
=======
//hello this is Thrisha
>>>>>>> 5052c4ff9f6edf73c6b7f404e1883365fa228dfc
