const SCALE = 0.5;
const tileSize = 35;

let config = {
    type: Phaser.WEBGL,
    width: 640,
    height: 320,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    scene: [Menu,Play,Tutorial]

};

let cursors;
let game = new Phaser.Game(config);
// set UI sizes
let borderPadding = game.config.height/ 25;
//define keys
let keySPACE, keyENTER, keyR;
