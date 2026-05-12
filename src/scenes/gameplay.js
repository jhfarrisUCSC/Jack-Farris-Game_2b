const playerTypes = {
  tank: {
    health: 25,
    speed: 1 * delta * 0.1,
    damage: 1
  },
  fort: {
    health: 15,
  }
};

const enemyTypes = {
  green1: {
    texture: 'green1.png',
    health: 3,
    damage: 2,
  },
  red1: {
    texture: 'red1.png',
    health: 3,
    speed: 2 * delta * 0.1,
    start: [0,0],
    end: [0,0]
  },
  blue1: {
    texture: 'blue1.png',
    health: 3,
    speed: 2 * delta * 0.1,
    start: [0,0],
    middle: [0,0],
    end: [0,0]
  },
  yellow1: {
    texture: 'yellow1.png',
    health: 3,
    damage: 2,
    start: [0,0],
    end: [0,0]
  }
};


class Gameplay extends Phaser.Scene {
  constructor() {
    super("gameplayScene");
    this.my = {sprite: {}};

    //player stuff
    this.bodyX = 96;
    this.bodyY = 336;
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
    this.enemies = [];
    this.totalEnemies = 1;
    this.upgrade = false;
  }

  preload() {
    this.load.setPath("./assets/");

    // Load Tiles
    this.load.image("tileSprites", "tiles_packed.png");
    this.load.tilemapTiledJSON("map", "ShooterScreen.json");

    // Load enemies
    this.load.atlasXML("planeSprites", "ships_packed.png", "ships_packed.xml");
    document.getElementById('description').innerHTML= '<h2>gameplayScene.js</h2>'

    // Load excess sprites
    this.load.image("tank", "tank.png");
    this.load.image("playerShot", "playerShot.png");
    this.load.image("enemyShot", "enemyShot.png");
    this.load.image("barrier", "building.png");
    this.load.image("upgradesPanel", "UpgradesPanel.png");

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
    my.sprite.body.flipY = true;
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

    // Upgrades
    this.qKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    my.sprite.upgrade = this.add.sprite(112, 192, "upgradesPanel");
    my.sprite.upgrade.visible = false;

    this.qKey.on('down', () => {
      if (this.upgrade = true) {
        playerTypes.tank.damage++;
        my.sprite.upgrade.visible = false;
        this.upgrade = false;
        this.startWave()
      }
    })
    this.wKey.on('down', () => {
      if (this.upgrade = true) {
        playerTypes.tank.speed++;
        my.sprite.upgrade.visible = false;
        this.upgrade = false;
        this.startWave()
      }
    })
    this.eKey.on('down', () => {
      if (this.upgrade = true) {
        playerTypes.tank.heath = playerTypes.tank.heath + 5;
        my.sprite.upgrade.visible = false;
        this.upgrade = false;
        this.startWave()
      }
    })

    // waves
    this.startWave();

    
  }

  update(time, delta) {

    // tank controls
    let my = this.my;
    let dt = delta / 1000;
    
    if (this.aKey.isDown && (my.sprite.body.x > 16)) {
    this.bodyX -= playerTypes.tank.speed;
    }
    if (this.dKey.isDown && (my.sprite.body.x < 208)) {
      this.bodyX += playerTypes.tank.speed;
    }
    my.sprite.body.x = this.bodyX;
    if (this.attacking === true) {
      this.attackY -= 4;
    }
    my.sprite.attack.y = this.attackY;
    if (my.sprite.attack.y <= 0) {
      my.sprite.attack.visible = false;
      this.attackY = this.bodyY;
      this.attacking = false;
    }

    // attacking
    if (this.attacking) {
      for (let i = this.enemies.length - 1; i >= 0; i--) {
      let target = this.enemies[i];
      if (this.collides(my.sprite.attack, target.sprite)) {
          target.health -= playerTypes.tank.damage;
          this.attacking = false;
          my.sprite.attack.visible = false;
          this.attackY = this.bodyY;
          if (target.health <= 0) {
            target.sprite.destroy();
            this.enemies.splice(i, 1);
            this.totalEnemies--;
          }
        }
      }
    }

    // wave clear
    if (this.totalEnemies == 0) {
      this.upgrade == true;
      my.sprite.upgrade.visible = false;
    }

    // counter
    if (this.upgrade == false) {
      this.counter++;
    }

  }
startWave() {
    this.enemies = [];
    this.totalEnemies = 0;
    this.totalRows = Math.ceil(Math.random() * 5);
    for (let i = 0; i < this.totalRows; i++){
      let enemyRow = Math.ceil(Math.random() * 4);
      switch(enemyRow) {
        case 1:
          for (let j = 0; j < 7; j++){
            // Add green1
            let enemy = this.add.sprite(32 * j + 16, 32 * i + 16, "planeSprites", "green1.png");
            enemy.flipY = true;
            this.enemies.push({sprite: enemy, type: 'green1', health: enemyTypes.green1.health});
            this.totalEnemies++;
          }
          break;
          case 2:
          for (let j = 0; j < 4; j++){
            // Add red
            let enemy = this.add.sprite(32 * j + 16, 32 * i + 16, "planeSprites", 'red1.png');
            enemy.flipY = true;
            this.enemies.push({sprite: enemy, type: 'red1', health: enemyTypes.red1.health});
            this.totalEnemies++;
          }
          break;
          case 3:
          for (let j = 0; j < 7; j++){
            // Add blue
            let enemy = this.add.sprite(32 * j + 16, 32 * i + 16, "planeSprites", 'blue1.png');
            enemy.flipY = true;
            this.enemies.push({sprite: enemy, type: 'blue1', health: enemyTypes.blue1.health});
            this.totalEnemies++;
          }
          break;
          case 4:
          for (let j = 0; j < 3; j++){
            // Add yellow
            let enemy = this.add.sprite(32 * j + 16, 32 * i + 16, "planeSprites", 'yellow1.png');
            enemy.flipY = true;
            this.enemies.push({sprite: enemy, type: 'yellow1', health: enemyTypes.yellow1.health});
            this.totalEnemies++;
          }
          break;
      }
    }
  }
  collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }
}