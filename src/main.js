// Jack Farris
// Created: 5/1/2025
// Phaser: 3.70.0
//
// Gallery Shooter
//
// I copy and pasted this pain
// 
// Art assets from Kenny Assets "Pixel Shmup" set:
// https://kenney.nl/assets/pixel-shmup

// debug with extreme prejudice
"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.AUTO,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    width: 224,
    height: 384,
    scene: [Gameplay]
}

const game = new Phaser.Game(config);