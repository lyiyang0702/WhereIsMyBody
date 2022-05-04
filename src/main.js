//Game Title: Where Is My Body
//Made by: Thrisha Kopula, Yiyang Lu, Diana Yee, Siyi Zhang
//Date Completed: 5/3/22
//Creative Tilt: Our game has a dark, neon visual style with music that adds a more sci-fi/spooky theme.
//               For the technical aspects, we have platforms that are randomly shaped and vary in size. 
//               The game also increases in speed as the time increases, making it more challenging as you progress.
//               Our group is proud of the visual design, as none of us have any artistic background, and we are proud 
//               of the technicality of the code as well since it is also the first time any of us coded in a game context.
const SCALE = 1;
const tileSize = 35;

let config = {
    type: Phaser.WEBGL,
    width: 1280,
    height: 720,
    ringPercent: 30,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    scene: [Menu,Play,Tutorial,GameOver, Backstory]

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
