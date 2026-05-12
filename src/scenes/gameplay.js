const playerTypes = {
  tank: {
    texture: '',
    health: 50,
    speed: 5,
    damage: 1
  },
  fort: {
    texture: '',
    health: 50,
    type: ''
  }
};

const enemyTypes = {
  green: {
    type: "basic",
    texture: '',
    health: 1,
    level: 1,
  },
  red: {
    type: "move",
    texture: '',
    health: 1,
    level: 1,
    start: [0,0],
    end: [0,0]
  },
  blue: {
    type: "dive",
    texture: '',
    health: 1,
    level: 1,
    start: [0,0],
    middle: [0,0],
    end: [0,0]
  },
  yellow: {
    type: "fighter",
    texture: '',
    health: 1,
    level: 1,
    start: [0,0],
    end: [0,0]
  }
};


class Gameplay extends Phaser.Scene {
  constructor() {
    super("gameplayScene");
    this.my = {sprite: {}};

    //player stuff
    this.bodyX = 48;
    this.bodyY = 96;
    this.attacking = false;
    this.attackX = 48;
    this.attackY = 96;

    // waves
    this.counter = 0;
    this.rowX = 0;
    this.rowY = 0;
    this.totalRows = 0;
    this.enemyLevel = 0;
    this.enemyRow = 0;
  }

  preload() {
    this.load.setPath("./assets/");

    // Load Tiles
    this.load.image("tileSprites", "tiles_packed.png");
    this.load.tilemapTiledJSON("map", "tiles_packed.json");

    // Load enemies
    this.load.atlasXML("planeSprites", "ships_packed.png", "ships_packed.xml");
    document.getElementById('description').innerHTML= '<h2>gameplayScene.js</h2>'

    // Load excess sprites
    this.load.image("tank", "tank.png");
    this.load.image("playerShot", "playerShot.png");
    this.load.image("enemyShot", "enemyShot.png");
    this.load.image("barrier", "building.png");

  }

  create() {
    let my = this.my;

    // map
    this.map = this.add.tilemap("map");
    this.tileset = this.map.addTilesetImage("ShooterMap", "tileSprites");
    this.backgroundMap = this.map.createLayer("Tile Layer 1", this.tileset, 0, 0);
    this.backgroundMap.setScale(2.0);

    // player inputs
    this.spaceKey =
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    my.sprite.body = this.add.sprite(this.bodyX, this.bodyY, "tank");
    my.sprite.attack = this.add.sprite(this.bodyX, this.bodyY, "playerShot");
    my.sprite.attack.visible = false;

    this.spaceKey.on('down', () => {
      if (this.attacking === false) {
        this.attackX = this.bodyX;
        this.attackY = this.bodyY;
        my.sprite.attack.x = this.attackX;
        my.sprite.attack.y = this.attackY;
        this.attacking = true;
        my.sprite.attack.visible = true;
      }
    })

    // waves
    this.totalRows = Math.ceil(Math.random() * 5);
    for (let i = 0; i < this.totalRows; i++){
      this.enemyLevel = Math.ceil(Math.random() * 3);
      this.enemyRow = Math.ceil(Math.random() * 4);
      switch(this.enemyRow) {
        case 1:
          for (let j = 0; j < 7; j++){
            // Add Green
          }
          break;
          case 2:
          for (let j = 0; j < 4; j++){
            // Add red
          }
          break;
          case 3:
          for (let j = 0; j < 7; j++){
            // Add blue
          }
          break;
          case 4:
          for (let j = 0; j < 3; j++){
            // Add yellow
          }
          break;
      }
    }

    // enemy shenanigans
  }

  update() {

    // tank controls
    let my = this.my;
    if (this.aKey.isDown && (my.sprite.body.x > 0)) {
    this.bodyX -=1;
    }
    if (this.dKey.isDown && (my.sprite.body.x < 96)) {
      this.bodyX +=1;
    }
    my.sprite.body.x = this.bodyX;
    if (this.attacking === true) {
      this.attackY -= 8;
    }
    my.sprite.attack.y = this.attackY;
    if (my.sprite.attack.y <= 0) {
      my.sprite.attack.visible = false;
      this.attackY = this.bodyY;
      this.attacking = false;
    }

    // counter
    this.counter++;

  }
}
