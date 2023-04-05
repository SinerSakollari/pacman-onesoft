import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-save-score',
  templateUrl: './save-score.component.html',
  styleUrls: ['./save-score.component.css'],
})
export class SaveScoreComponent {
  finalScore: number = 0;
  userName: string = '';

  constructor(
    public dialogRef: MatDialogRef<SaveScoreComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.finalScore = data.score;
  }

  saveUser() {
    let newUser = {
      userName: this.userName,
      score: this.finalScore
    }
    this.dialogRef.close(newUser)
  }
}
