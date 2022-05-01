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
        volume: 1,
        rate: 1,
        detune: 0,
        seek: 0,
        loop: true,
        delay: 0
}

let cursors;
let game = new Phaser.Game(config);
// set UI sizes
let borderPadding = game.config.height/ 25;
//define keys
let keySPACE, keyENTER, keyR, keyM;
let music, gOverConfig, platform,randomSpawn,randomDistance, timeInSeconds,text, addedPlatforms;
