let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 320,
    scene: [Menu,Play]
}

let game = new Phaser.Game(config);