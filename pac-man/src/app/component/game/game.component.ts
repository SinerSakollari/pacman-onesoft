import { Component, ElementRef, ViewChild } from '@angular/core';
import { GameScene, configTest, points } from './phaserGame';
import { MatDialog } from '@angular/material/dialog';
import { SaveScoreComponent } from '../save-score/save-score.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent {
  @ViewChild('gameContainer', { static: true }) gameContainer!: ElementRef;
  game: Phaser.Game = new Phaser.Game;
  test: any;

  constructor(public dialog: MatDialog, public router: Router) {}

  ngOnInit(): void {
    let newConfig = {
      type: configTest.type,
      width: configTest.width,
      height: configTest.height,
      parent: this.gameContainer.nativeElement,
      scale: {
        mode: configTest.scale.mode,
        autoCenter: configTest.scale.autoCenter,
      },
      physics: {
        default: configTest.physics.default,
        arcade: {
          debug: configTest.physics.arcade.debug,
        },
      },
      scene: configTest.scene,
    };
    this.game = new Phaser.Game(newConfig);
  }
}
