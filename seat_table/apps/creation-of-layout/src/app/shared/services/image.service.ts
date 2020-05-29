import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ImageSrc } from '../models/Venue';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  imageURL$ = new BehaviorSubject<ImageSrc[]>(null);
  imageSrc: ImageSrc[] = [];

  constructor() {
  }

  addImage(image: ImageSrc[]) {
    this.imageSrc.push(...image);
    this.imageURL$.next(this.imageSrc.slice());
  }
  removeImage(id) {
    const index = this.imageSrc.findIndex(x => x.id === id);
    this.imageSrc.splice(index, 1);
    this.imageURL$.next(this.imageSrc.slice());
  }
}
