let config = {
    type: Phaser.CANVAS,
    width: 480,
    height: 640,
    scene: [Menu,Play]
}

let game = new Phaser.Game(config);