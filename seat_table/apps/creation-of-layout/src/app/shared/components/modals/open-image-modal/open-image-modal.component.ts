import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-open-image-modal',
  templateUrl: './open-image-modal.component.html',
  styleUrls: ['./open-image-modal.component.scss']
})
export class OpenImageModalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<OpenImageModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}

export interface DialogData {
  Image: string;
}
