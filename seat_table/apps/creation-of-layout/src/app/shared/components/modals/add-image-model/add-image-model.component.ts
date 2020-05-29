import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import * as _ from 'lodash';
import { ImageSrc } from '../../../models/Venue';
import { ImageService } from '../../../services/image.service';

@Component({
  selector: 'app-add-image-model',
  templateUrl: './add-image-model.component.html',
  styleUrls: ['./add-image-model.component.scss']
})
export class AddImageModelComponent implements OnInit {
  isImageSelected = false;
  selectedImage: ImageSrc[] = [];
  dropzoneActive = false;
  selectedImageCount = 0;
  constructor(
    private backgroundDialogRef: MatDialogRef<AddImageModelComponent>,
    private imageService: ImageService
  ) { }
  dropzoneState($event: boolean) {
    this.dropzoneActive = $event;
  }
  handleDrop(fileList: FileList) {

    const filesIndex = _.range(fileList.length);

    _.each(filesIndex, (idx) => {
      const reader = new FileReader();
      reader.readAsDataURL(fileList[idx]);
      // tslint:disable-next-line: no-shadowed-variable
      reader.onload = (event) => {
        this.selectedImageCount++;
        const target = event.target as FileReader;
        const newImage = new ImageSrc(this.selectedImageCount.toString(), target, target.result);
        this.selectedImage.push(newImage);
        this.isImageSelected = true;
      };
    });

  }
  ngOnInit() {
  }
  onSave() {
    console.log('go to  saving the image');
    
    if (this.selectedImage) {
      this.imageService.addImage(this.selectedImage);
    }
  }
  onSelectFile(event) {
    if (event.target.files) {
      const filesIndex = _.range(event.target.files.length);

      _.each(filesIndex, (idx) => {
        const reader = new FileReader();
        reader.readAsDataURL(event.target.files[idx]);
        // tslint:disable-next-line: no-shadowed-variable
        reader.onload = (event) => {
          this.selectedImageCount++;
          const target = event.target as FileReader;
          const newImage = new ImageSrc(this.selectedImageCount.toString(), target, target.result);
          this.selectedImage.push(newImage);
          this.isImageSelected = true;
        };
      });
  }
}
  removeImage(id) {
    const index = this.selectedImage.findIndex(x => x.id === id);
    this.selectedImage.splice(index, 1);
    if (this.selectedImage.length === 0) {
      this.isImageSelected = false;
    }
  }
}
