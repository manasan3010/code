import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Shape, SvgPoints} from '../models/Shape';
import {PropertyNode} from '../data/properties.data';
import {Controls, PropertyType, ShapeType} from '../models/utils';
import {CommonService} from './common.service';
import * as _ from 'lodash';
import {ModelMapper} from '../helpers/modelMapper';


@Injectable({
  providedIn: 'root'
})
export class ShapesService {
  private shapes: Shape[] = [];
  private tempShapes: Shape[] = [];
  shapes$ = new BehaviorSubject<Shape[]>(this.shapes);
  tempShapes$ = new BehaviorSubject<Shape[]>(this.tempShapes);
  selectedShape$ = new BehaviorSubject<string>(Controls.SELECT);
  selectedProperty$ = new BehaviorSubject<PropertyNode>(undefined);
  selectedControl$ = new BehaviorSubject<string>(undefined);
  selectedNonSeatAreaShape$ = new BehaviorSubject<string>(undefined);

  constructor() {
    if (this.localStoreShape()) {
      this.shapes = JSON.parse(localStorage.getItem('editingShape'));
      this.shapes$.next(this.shapes);
    }
    if (this.localStoreTempShape()) {
      this.tempShapes = JSON.parse(localStorage.getItem('editingTempShape'));
      this.tempShapes$.next(this.tempShapes);
    }
  }

  createNewShape(shape: Shape) {
    if (shape !== undefined) {
      this.shapes.push(shape);
      this.shapes$.next(this.shapes.slice());
    }
  }

  addTempShape(shapes: Shape[]) {
    this.tempShapes.push(...shapes);
    this.tempShapes$.next(this.tempShapes.slice());
  }

  storeShape() {
    localStorage.setItem('editingShape', JSON.stringify(this.shapes));
  }

  storeTempShape() {
    localStorage.setItem('editingTempShape', JSON.stringify(this.tempShapes));
  }

  localStoreShape() {
    return !!JSON.parse(localStorage.getItem('editingShape'));
  }

  localStoreTempShape() {
    return !!JSON.parse(localStorage.getItem('editingTempShape'));
  }

  addShapes(shapes: Shape[]) {
    if (shapes !== undefined) {
      this.shapes.push(...shapes);
      this.shapes$.next(this.shapes.slice());
    }
  }

  updateShape(shape: Shape) {
    if (shape !== undefined) {
      const shapeIndex = this.shapes.findIndex(x => x.shapeID === shape.shapeID);
      this.shapes[shapeIndex] = shape;
      this.shapes$.next(this.shapes.slice());
      this.storeShape();
    }
  }

  updateShapes(shapes: Shape[]) {
    this.shapes = shapes;
    this.shapes$.next(this.shapes.slice());
  }

  deleteShape(shapeId: string) {
    const shapeIndex = this.shapes.findIndex(x => x.shapeID === shapeId);
    if (!!this.shapes[shapeIndex].isShapeGrouped) {
      this.tempShapes.map((x, i) => {
        if (x.groupId === shapeId) {
          this.tempShapes.splice(i, 1);
        }
      });
    }
    this.shapes.splice(shapeIndex, 1);
    this.shapes$.next(this.shapes.slice());
    this.tempShapes$.next(this.tempShapes.slice());
    this.storeTempShape();

    this.storeShape();
  }

  deleteSeatingArea(shapeId: string, nonSeatingId: string) {
    const shapeIndex = this.shapes.findIndex(x => x.shapeID === shapeId);
    const nonSeatingIndex = this.shapes[shapeIndex].nonSeatingArea.findIndex(x => nonSeatingId.indexOf(x.id) >= 0);
    this.shapes[shapeIndex].nonSeatingArea.splice(nonSeatingIndex, 1);
    this.shapes$.next(this.shapes.slice());
    this.storeShape();
  }

  deleteTempShape(shapeId: string) {
    const shapeIndex = this.tempShapes.findIndex(x => x.shapeID === shapeId);
    this.tempShapes.splice(shapeIndex, 1);
    this.tempShapes$.next(this.tempShapes.slice());
    this.storeTempShape();
  }

  resetShapes() {
    this.shapes = [];
    this.tempShapes = [];
    this.shapes$.next(this.shapes);
    this.tempShapes$.next(this.tempShapes);
    this.selectedNonSeatAreaShape$.next(undefined);
    this.selectedControl$.next(undefined);
    this.selectedShape$.next(undefined);
    this.selectedProperty$.next(undefined);
    localStorage.removeItem('editingTempShape');
    localStorage.removeItem('editingShape');
  }

  deleteProperty(shapeId, propertyId) {
    const shapeIndex = this.shapes.findIndex(x => x.shapeID === shapeId);
    const propIndex = this.shapes[shapeIndex].properties.findIndex(x => x.propertyId === propertyId);
    this.shapes[shapeIndex].properties.splice(propIndex, 1);
    this.shapes$.next(this.shapes.slice());
  }

  onFlipProperty(shape, property, x = false, y = false) {
    const shapeIndex = this.shapes.findIndex(sp => sp.shapeID === shape.id);
    const propIndex = this.shapes[shapeIndex].properties.findIndex(sp => sp.propertyId === property.id);
    const centerPoint = CommonService.getCenterPosition(property);
    const getBbox = (property as SVGGraphicsElement).getBBox();

    this.shapes[shapeIndex].properties[propIndex].pathArray.forEach(point => {
      if (!!point.x && !!point.y) {
        point.x -= getBbox.x;
        point.y -= getBbox.y;
        if (x) {
          point.x *= -1;
        } else if (y) {
          point.y *= -1;
        }
        point.x += getBbox.x;
        point.y += getBbox.y;
      }
    });
    CommonService.removeChildElementFromParent(property);
    CommonService.drawLine(property, this.shapes[shapeIndex].properties[propIndex]);
  }

  onFlipShape(shape, x = false, y = false) {
    const shapeIndex = this.shapes.findIndex(sp => sp.shapeID === shape.id);
    const centerPoint = CommonService.getCenterPosition(shape);
    this.shapes[shapeIndex].pathArray.forEach(point => {
      if (!!point.x && !!point.y) {
        point.x -= centerPoint.x;
        point.y -= centerPoint.y;
        if (x) {
          point.x *= -1;
        } else if (y) {
          point.y *= -1;
        }
        point.x += centerPoint.x;
        point.y += centerPoint.y;
      }
    });
    const shapeGrope: HTMLElement = shape.parentElement;
    const wallsGroup = shapeGrope.querySelector(`#wallGroup_${this.shapes[shapeIndex].shapeID}`);
    if (!!this.shapes[shapeIndex].walls) {
      this.shapes[shapeIndex].walls.forEach(wall => {
        const wallElement = wallsGroup.querySelector(`#${wall.id}`);
        wall.pathArray.forEach(point => {
          if (!!point.x && !!point.y) {
            point.x -= centerPoint.x;
            point.y -= centerPoint.y;
            if (x) {
              point.x *= -1;
            } else if (y) {
              point.y *= -1;
            }
            point.x += centerPoint.x;
            point.y += centerPoint.y;
            if (point.command === 'M') {
              wall.startPoint.x = point.x;
              wall.startPoint.y = point.y;

            } else {
              wall.endPoint.x = point.x;
              wall.endPoint.y = point.y;

            }
            wallElement.setAttribute('d', CommonService.buildPathString(wall.pathArray));
          }
        });
      });
    }
    if (!!this.shapes[shapeIndex].nonSeatingArea) {
      this.shapes[shapeIndex].nonSeatingArea.forEach(area => {
        const element = document.getElementById(`${area.id}`);
        console.log(element);

        area.pathArray.forEach(point => {
          if (point.command === 'z') {
          } else {
            point.x -= centerPoint.x;
            point.y -= centerPoint.y;
            if (x) {
              point.x *= -1;
            } else if (y) {
              point.y *= -1;
            }
            point.x += centerPoint.x;
            point.y += centerPoint.y;
          }
        });
        element.children[0].setAttribute('d', CommonService.buildPathString(area.pathArray));
      });

    }

    shape.setAttribute('d', CommonService.buildPathString(this.shapes[shapeIndex].pathArray));
  }
}
