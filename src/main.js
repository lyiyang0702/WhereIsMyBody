const SCALE = 1;
const tileSize = 35;

let config = {
    type: Phaser.WEBGL,
    width: 1280,
    height: 720,
    ringPercent: 25,
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
    scene: [Menu,Play,Tutorial,GameOver]

};

let soundConfig = {
        mute: false,
        volume: 0.8,
        rate: 1,
        loop: true,
}

let cursors;
let game = new Phaser.Game(config);
// set UI sizes
let borderPadding = game.config.height/ 25;
//define keys
let keySPACE, keyENTER, keyR, keyM;
let music, gOverConfig, platform,randomSpawn,randomDistance, timeInSeconds,text, addedPlatforms;
