import {Component, Input, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {Subscription} from 'rxjs';
import {ShapesService} from '../../../services/shapes.service';
import {Shape} from '../../../models/Shape';
import * as _ from 'lodash';

@Component({
  selector: 'app-shape-layers',
  templateUrl: './shape-layers.component.html',
  styleUrls: ['./shape-layers.component.scss']
})
export class ShapeLayersComponent implements OnInit, OnChanges, OnDestroy {

  shapes: Shape[];
  shapeSubscription: Subscription;
  // cdkshapes: Shape[];
  finalShapes: Shape[];

  constructor(private shapeService: ShapesService) {
  }

  ngOnInit() {

    this.shapeSubscription = this.shapeService.shapes$.subscribe(shape => this.shapes = _.cloneDeep(shape.reverse()) );
    // this.cdkshapes = this.shapes.reverse();
    // this.cdkshapes = this.cdkshapes.reverse();
  }

  ngOnChanges() {
  }

  ngOnDestroy() {
    this.shapeSubscription.unsubscribe();
  }

  drop(event: CdkDragDrop<string[]>) {


    const previusElement = document.getElementById(this.shapes[event.currentIndex].shapeID).parentNode;
    moveItemInArray(this.shapes, event.previousIndex, event.currentIndex);
    const currentElement = document.getElementById(this.shapes[event.currentIndex].shapeID).parentNode;
    if (event.currentIndex < event.previousIndex) {
      this.insertAfter(currentElement, previusElement);
    } else {
      this.insertBefore(currentElement, previusElement);
    }
    this.shapeService.updateShapes(this.shapes.reverse());
  }

  insertBefore(el, referenceNode) {
    referenceNode.parentNode.insertBefore(el, referenceNode);
  }

  insertAfter(el, referenceNode) {
    referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
  }
  switchVisibility(id) {
    const shapeIndex = this.shapes.findIndex(x => x.shapeID === id);
    this.shapes[shapeIndex].visibility = !this.shapes[shapeIndex].visibility;
    if (this.shapes[shapeIndex].visibility) {
      document.getElementById(this.shapes[shapeIndex].shapeID).parentElement .style.display = 'block';
    } else {
      document.getElementById(this.shapes[shapeIndex].shapeID).parentElement.style.display = 'none';
    }
    this.shapeService.updateShape(this.shapes[shapeIndex]);
  }

}
