import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { SaveScoreComponent } from '../save-score/save-score.component';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
})
export class MainMenuComponent {
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private activatedRouter: ActivatedRoute
  ) {
    let params = this.activatedRouter.snapshot.params;
    if (params['points']) {
      this.openDialog(params['points']);
    }
  }

  ngOnInit(): void {}

  startGame() {
    this.router.navigate(['game']);
  }

  openDialog(points: number) {
    const dialogRef = this.dialog.open(SaveScoreComponent, {
      data: { score: points },
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.router.navigate(['/']);
    });
  }
}
