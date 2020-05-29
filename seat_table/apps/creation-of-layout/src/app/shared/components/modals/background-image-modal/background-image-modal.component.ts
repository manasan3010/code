import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSliderChange } from '@angular/material';
import {ImageCroppedEvent} from '../../../models/Shape';

@Component({
  selector: 'app-background-image-modal',
  templateUrl: './background-image-modal.component.html',
  styleUrls: ['./background-image-modal.component.scss']
})

export class BackgroundImageModalComponent implements OnInit {
  disable: boolean;
  imageChangedEvent: string;
  croppedImage: ImageCroppedEvent;
  private dropzoneActive: boolean;
  imageOpacity = 100;
  constructor(
    private backgroundDialogRef: MatDialogRef<BackgroundImageModalComponent>,
  ) {
  }

  ngOnInit() {
    this.disable = true;
    this.imageChangedEvent = this.croppedImage = undefined;
  }

  close() {
    this.backgroundDialogRef.close();
  }

  confirm() {
    if (this.croppedImage) {
      this.backgroundDialogRef.close({
        image: this.croppedImage
      });
    }
  }

  onSelectFile(event) {
    if (event.target.files) {
      this.imageChangedEvent = event;
    }
  }

  dropzoneState($event) {
    this.dropzoneActive = $event;
  }

  // handleDrop(fileList) {
  //
  //   const reader = new FileReader();
  //   reader.readAsDataURL(fileList[0]);
  //   // tslint:disable-next-line: no-shadowed-variable
  //   reader.onload = (event) => {
  //     this.imageChangedEvent = event;
  //   }
  //
  // }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event;
  }
  changeOpacity(event: MatSliderChange) {
    this.croppedImage.opacity = event.value;
    const bgImage: any = document.getElementsByClassName('source-image')[0];
    bgImage.style.opacity = (event.value) / 100;
  }
}

