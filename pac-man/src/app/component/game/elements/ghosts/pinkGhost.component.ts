import { Enemy } from '../enemy.componet';
import { Tile, tileType } from '../tile.component';
import { map, pacman, ENEMY_SETFREE_TIME, scene } from '../../phaserGame';
import { GameMode } from 'src/app/shared/models/modes.model';
import { Utils } from 'src/app/shared/utils/utils';

export class PinkGhost extends Enemy {
  private scatterPosition;

  constructor() {
    let position = { x: 475, y: 475 };
    let ghost = scene.physics.add.sprite(position.x, position.y, 'ghosts');
    ghost.type = 'Pink';
    ghost.timeToSetFree = ENEMY_SETFREE_TIME * 4;
    scene.enemyGroup.add(ghost);
    super(position, ghost);
    this.initialPosition = position;
    this.scatterPosition = { x: 16, y: 2 };

    let newTile = this.findDestinyTile();
    this.setDestinyTile(newTile);
  }

  public override update() {
    if (this.isFree) {
      let newTile = this.findDestinyTile();
      this.setDestinyTile(newTile);
    }
    super.update();
  }

  private findDestinyTile(): Tile {
    switch (this.mode) {
      case GameMode.CHASE:
        return this.chase();
      case GameMode.FRIGHTENED:
        return this.frightenedTile;
      case GameMode.SCATTER:
        return map.getTile(this.scatterPosition, 'index');
    }
  }

  private chase(): Tile {
    let pacmanTile = map.getTile(pacman.getCurrentPosition());
    let pacmanDirection = pacman.actualDirection;
    let nextTile = map.getNeighborTile(pacmanTile, pacmanDirection);
    let previousTile = pacmanTile;

    for (var i = 0; i < 2; i++) {
      do {
        let randDir = Utils.getRandomDir();
        nextTile = map.getNeighborTile(previousTile, randDir);
        //in case pacman enters the teleport
        if (nextTile == null) nextTile = map.getRandomAvailableTile('ANYWHERE');
      } while (
        nextTile.type != tileType.EMPTY &&
        nextTile.type != tileType.POINT
      );
      previousTile = nextTile;
    }

    return nextTile;
  }
}
