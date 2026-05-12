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
    type: Phaser.CANVAS,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    width: 224,
    height: 384,
    scene: [gameplay]
}

// A convenience object that contains all sprites
// To use: my.sprite.sprite_name
// Where sprite_name is the name of a specific sprite.
let my = {sprite: {}};

const game = new Phaser.Game(config);