import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-seat-delete-confirmation-model',
  templateUrl: './seat-delete-confirmation-model.component.html',
  styleUrls: ['./seat-delete-confirmation-model.component.scss']
})
export class SeatDeleteConfirmationModelComponent implements OnInit {
  private isKeepSpace = false;
  private   isKeepSeatOrder = false;
  constructor(
    public dialogRef: MatDialogRef<SeatDeleteConfirmationModelComponent>
  ) {
  }
  ngOnInit() {
  }

  conform() {
    this.dialogRef.close({canKeepSpace: this.isKeepSpace, canKeepSeatLabelOrder: this.isKeepSeatOrder});
  }
}
