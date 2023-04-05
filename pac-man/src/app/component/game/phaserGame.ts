import 'phaser';
import { Pacman } from './elements/player.component';
import { Map } from './elements/map.component';
import { directionEnum } from 'src/app/shared/models/direction.model';
import { GameMode } from 'src/app/shared/models/modes.model';
import { Position } from 'src/app/shared/models/position.model';
import { RedGhost } from './elements/ghosts/redGhost.component';
import { BlueGhost } from './elements/ghosts/blueGhost.component';
import { PinkGhost } from './elements/ghosts/pinkGhost.component';
import { OrangeGhost } from './elements/ghosts/orangeGhost.component';
import { Enemy } from './elements/enemy.componet';
import {
  pacmanAnimInit,
  ghostsAnimInit,
  tweenMovement,
} from 'src/app/shared/utils/animation';
import { Utils } from 'src/app/shared/utils/utils';
import { Tile, fruit } from './elements/tile.component';

export let scene: any;
export let map: Map;
let cursors: any;
let player;
export let pacman: Pacman;
export let redGhost: Enemy;
let pinkGhost: Enemy;
let blueGhost: Enemy;
let orangeGhost: Enemy;

export let level = 1;
export const SPEED = 2;
export let points = 0;
export const FRIGHTENED_TIME = 7000;
let frigthenedTimer: any = null;
export let SCATTER_TIMER = 12000;
export let SCATTER_DURATION = 6000;

let btnRetry: any;
let backgroundMenu: any;

export const ENEMY_SPAWN_TIME = 4000;
export const ENEMY_SETFREE_TIME = 5000;

const FRUIT_SPAWN_TIMER = 3000; //20000
const FRUIT_TIME = 10000;
let isFruit = false;
let shouldFruitSpawn = true;
let fruitTile: Tile;
let previousTileValue: number;

export const CENTER_MAP_POSITION = { x: 475, y: 475 };
let pointGUI: any;
let levelGUI: any;

export class GameScene extends Phaser.Scene {
  imageGroup!: Phaser.GameObjects.Group;
  menuGameOver!: Phaser.GameObjects.Group;
  pointsGroup!: Phaser.Physics.Arcade.StaticGroup;
  powerUpGroup!: Phaser.Physics.Arcade.StaticGroup;
  fruitGroup!: Phaser.Physics.Arcade.StaticGroup;
  enemyGroup: any;
  maxDots = 0;
  dots = 0;

  logoImage: any;
  images: any;

  constructor() {
    super({});
    this.enemyCollide = this.enemyCollide.bind(this);
    this.fruitSpawner = this.fruitSpawner.bind(this);
    this.collectPowerUp = this.collectPowerUp.bind(this);
    this.collectPoint = this.collectPoint.bind(this);
  }

  //****************** PRELOAD  ******************/
  preload() {
    this.load.atlas(
      'atlas',
      '/assets/sprite-sheet.png',
      '/assets/sprite-sheet.json'
    );

    //PHASER built in
    this.load.spritesheet('fruits', '/assets/fruits.png', {
      frameWidth: 50,
      frameHeight: 50,
    });
    this.load.image('tileImage1', '/assets/firstTile.png');
    this.load.image('tileImage2', '/assets/secondTile.png');
    this.load.image('tileImage3', '/assets/thirdTile.png');
    this.load.image('tileImage4', '/assets/forthTile.png');
    this.load.image('pointImage', '/assets/point.png');
    this.load.image('power-up', '/assets/power-up.png');
    this.load.image('logo', '/assets/Pac-Man_title.png');
    this.load.image('door', '/assets/doorTile.png');
    this.load.image('blueDot', '/assets/blueDot.png');

    this.menuGameOver = this.add.group();
    this.imageGroup = this.add.group();
    this.pointsGroup = this.physics.add.staticGroup();
    this.powerUpGroup = this.physics.add.staticGroup();
    this.fruitGroup = this.physics.add.staticGroup();
    this.enemyGroup = this.add.group();

    scene = this;
  }

  //************************************ CREATE  ************************************/
  create() {
    pointGUI = this.add.text(80, 1200, 'Points: 0', {
      font: '30px',
      color: '#FFFFFF',
    });
    levelGUI = this.add.text(80, 1160, 'Level: 1', {
      font: '30px',
      color: '#FFFFFF',
    });

    this.textures.addSpriteSheetFromAtlas('pac-man', {
      atlas: 'atlas',
      frame: 'pacman',
      frameWidth: 16,
      frameHeight: 16,
      startFrame: 0,
    });

    this.textures.addSpriteSheetFromAtlas('ghost_test', {
      atlas: 'atlas',
      frame: 'ghosts',
      frameWidth: 16,
      frameHeight: 16,
      startFrame: 0,
    });

    this.textures.addSpriteSheetFromAtlas('scared_ghost', {
      atlas: 'atlas',
      frame: 'scared-ghost',
      frameWidth: 16,
      frameHeight: 16,
      startFrame: 0,
    });

    this.textures.addSpriteSheetFromAtlas('eaten_ghost', {
      atlas: 'atlas',
      frame: 'eaten-ghost',
      frameWidth: 16,
      frameHeight: 16,
      startFrame: 0,
    });

    this.textures.addSpriteSheetFromAtlas('fruit', {
      atlas: 'atlas',
      frame: 'fruits',
      frameWidth: 16,
      frameHeight: 16,
      startFrame: 0,
    });

    this.textures.addSpriteSheetFromAtlas('point', {
      atlas: 'atlas',
      frame: 'point',
      frameWidth: 16,
      frameHeight: 16,
      startFrame: 0,
    });

    player = this.physics.add.sprite(325, 575, 'pac-man');
    cursors = this.input.keyboard.createCursorKeys();

    pacmanAnimInit();
    ghostsAnimInit();

    map = new Map();
    pacman = new Pacman(player);
    redGhost = new RedGhost();
    pinkGhost = new PinkGhost();
    blueGhost = new BlueGhost();
    orangeGhost = new OrangeGhost();
    this.enemyGroup.enableBody = true;

    this.physics.add.overlap(player, this.pointsGroup, this.collectPoint);
    this.physics.add.collider(player, this.enemyGroup, this.enemyCollide);
    this.physics.add.overlap(
      player,
      this.fruitGroup,
      this.fruitCollide,
      undefined,
      this
    );
    this.physics.add.overlap(
      player,
      this.powerUpGroup,
      this.collectPowerUp,
      undefined,
      this
    );

    this.fruitSpawner();

    this.events.on('gameOver', this.gameFinished);
  }

  gameFinished() {
    window.location.replace('/' + points);
  }

  //************************************ UPDATE & BOUNDARIES  ************************************/
  override update() {
    this.keys();

    pacman.update();
    this.boundaries();

    this.events.emit('updateEnemy');

    this.drawGui();
  }

  boundaries() {
    let nextTile = pacman.getNextTile();
    if (nextTile.type == 'WALL' || nextTile.type === 'DOOR') {
      if (pacman.direction() == 'EAST' || pacman.direction() == 'WEST')
        pacman.setRequestedDirection(
          Utils.findAlternativeWay('long', pacman.getCurrentTile())
        );
      if (pacman.direction() == 'NORTH' || pacman.direction() == 'SOUTH')
        pacman.setRequestedDirection(
          Utils.findAlternativeWay('lat', pacman.getCurrentTile())
        );
    }
  }

  //************************************ FRUIT SPAWNER  ************************************/
  fruitSpawner() {
    let self = this;

    if (!isFruit) {
      setTimeout(() => {
        if (shouldFruitSpawn) {
          fruitTile = map.getRandomAvailableTile('ANYWHERE');
          previousTileValue = fruitTile.getTileValue();

          fruitTile.setTileValue(5);
          isFruit = true;
        }
        self.fruitSpawner();
      }, FRUIT_SPAWN_TIMER);
    } else {
      setTimeout(() => {
        if (shouldFruitSpawn) {
          fruitTile.setTileValue(2);
          isFruit = false;
          if (fruitTile.fruit) fruitTile.fruit.destroy();
        }
        self.fruitSpawner();
      }, FRUIT_TIME);
    }
  }

  //************************************ COLLISIONS  ************************************/
  collectPoint(player: any, point: any) {
    points += 10;
    let pointOb = point.getData('TileObject');
    pointOb.setTileValue(2);
    this.dots++;
    point.disableBody(true, true);

    if (this.dots >= this.maxDots) {
      this.nextLevel();
    }
  }

  collectPowerUp(player: any, powerUp: any) {
    points += 20;
    this.events.emit('setGameMode', GameMode.FRIGHTENED);
    powerUp.disableBody(true, true);

    if (frigthenedTimer) clearTimeout(frigthenedTimer);
    frigthenedTimer = setTimeout(() => {
      this.events.emit('setGameMode', GameMode.CHASE);
    }, FRIGHTENED_TIME);
  }

  fruitCollide(player: any, fruit: any) {
    points += fruit.getPoints();
    fruit.destroy();
  }

  enemyCollide(player: any, enemy: any) {
    let enemyObj = enemy.getData('GhostObject');
    if (enemyObj.mode == GameMode.FRIGHTENED) {
      enemyObj.sentToCage(enemy);
    } else {
      if (pacman.isFree) this.GameOver();
    }
  }

  //************************************ KEYS  ************************************/
  keys() {
    if (cursors.left.isDown) pacman.setRequestedDirection(directionEnum.WEST);
    else if (cursors.right.isDown)
      pacman.setRequestedDirection(directionEnum.EAST);
    else if (cursors.up.isDown)
      pacman.setRequestedDirection(directionEnum.NORTH);
    else if (cursors.down.isDown)
      pacman.setRequestedDirection(directionEnum.SOUTH);
  }

  //************************************ GAME STATES ************************************/
  nextLevel() {
    level++;
    this.stopGame();
    this.restart();
  }

  GameOver() {
    level = 1;
    this.stopGame();
    this.drawGameOverScreen();
  }

  stopGame() {
    redGhost.freeze();
    pinkGhost.freeze();
    blueGhost.freeze();
    orangeGhost.freeze();
    pacman.isFree = false;
    shouldFruitSpawn = false;
    if (fruit != null) fruit.destroy();
  }

  restart() {
    //POINTS & MAP
    points = 0;
    this.maxDots = 0;
    this.dots = 0;
    map.destroy();
    map = new Map();
    //PLAYER RESET
    pacman.prepareForNextLevel();
    //ENEMIES REST
    redGhost.prepareNextLevel();
    pinkGhost.prepareNextLevel();
    blueGhost.prepareNextLevel();
    orangeGhost.prepareNextLevel();

    //FRUITS
    isFruit = false;
    shouldFruitSpawn = true;

    this.scene.resume();
  }

  //************************************ DRAWERS  ************************************/
  drawGui() {
    let pointsText = `Points: ${points}`;
    pointGUI.setText(pointsText);
    let levelText = `Level: ${level}`;
    levelGUI.setText(levelText);
  }

  drawGameOverScreen() {
    this.events.emit('gameOver');
  }
}
//************************************ CONFIG ************************************/
var config = {
  type: Phaser.AUTO,
  width: '150%',
  height: '180%',
  parent: null,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
  scene: GameScene,
};
export let configTest = config;
