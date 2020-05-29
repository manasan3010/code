import {Injectable} from '@angular/core';
import {MousePosition} from '../models/Venue';
import {CommonService} from './common.service';
import {Properties, PropertyType} from '../models/utils';
import {PropertyNode} from '../data/properties.data';
import {PathPoint, Property, Style, SvgPoints, Image} from '../models/Shape';

@Injectable({
  providedIn: 'root'
})
export class CreatePropertyService {

  constructor() {
  }

  private propertyCount = 0;

  private static findPointAtSlop(source: SvgPoints, length: number, slope: number) {
    const a = new SvgPoints();
    const b = new SvgPoints();
    const dx = (length / Math.sqrt(1 + (slope * slope)));
    const dy = slope * dx;
    a.x = source.x + dx;
    a.y = source.y + dy;

    b.x = source.x - dx;
    b.y = source.y - dy;
    return a;
  }

  static addSingleDoor(currentPosition: MousePosition, property: Property, propWidthAndHeight, wallElement: SVGGeometryElement) {
    const startPoint = CommonService.getStartPointInPathLine(wallElement);
    const endPoint = CommonService.getEndPointInPathLine(wallElement);
    if (startPoint.x === endPoint.x) {
      const x = startPoint.x;
      const y = currentPosition.y;
      let point2 = new SvgPoints();
      const getFirstLength = CommonService.getLengthOfTwoPoints(startPoint, {x, y});
      if (CommonService.isPointsInClockWise(startPoint, endPoint)) {
        point2 = wallElement.getPointAtLength(getFirstLength + propWidthAndHeight.width);
      } else {
        point2 = wallElement.getPointAtLength(getFirstLength - propWidthAndHeight.width);
      }
      const y2 = currentPosition.y + propWidthAndHeight.width;
      const x2 = x;
      property.pathArray = [
        new PathPoint('Line', x, y, undefined, undefined, undefined, undefined, new Style(undefined, 'white', 5)),
        new PathPoint(undefined, x2, y2),
        new PathPoint('Line', x, y, undefined, undefined, undefined, undefined, new Style(undefined, 'black', 3)),
        new PathPoint(undefined, (x + propWidthAndHeight.width), y),
      ];
    } else if (startPoint.y === endPoint.y) {
      const x = currentPosition.x;
      const y = startPoint.y;
      let point2 = new SvgPoints();
      const getFirstLength = CommonService.getLengthOfTwoPoints(startPoint, {x, y});
      if (CommonService.isPointsInClockWise(startPoint, endPoint)) {
        point2 = wallElement.getPointAtLength(getFirstLength + propWidthAndHeight.width);
      } else {
        point2 = wallElement.getPointAtLength(getFirstLength - propWidthAndHeight.width);
      }
      const y2 = startPoint.y;
      const x2 = x + propWidthAndHeight.width;
      property.pathArray = [
        new PathPoint('Line', x, y, undefined, undefined, undefined, undefined, new Style(undefined, 'white', 5)),
        new PathPoint(undefined, x2, y2),
        new PathPoint('Line', x, y, undefined, undefined, undefined, undefined, new Style(undefined, 'black', 2)),
        new PathPoint(undefined, (x), (y + propWidthAndHeight.width)),
      ];
    } else {
      const x = (currentPosition.x);
      const tan = (startPoint.y - endPoint.y) / (startPoint.x - endPoint.x);
      const y = startPoint.y - tan * (startPoint.x - currentPosition.x);
      let point2 = new SvgPoints();
      const getFirstLength = CommonService.getLengthOfTwoPoints(startPoint, {x, y});
      if (CommonService.isPointsInClockWise(startPoint, endPoint)) {
        point2 = wallElement.getPointAtLength(getFirstLength + propWidthAndHeight.width);
      } else {
        point2 = wallElement.getPointAtLength(getFirstLength - propWidthAndHeight.width);
      }
      property.pathArray = [
        new PathPoint('Line', x, y, undefined, undefined, undefined, undefined, new Style(undefined, 'white', 5)),
        new PathPoint(undefined, point2.x, point2.y),
        new PathPoint('Line', x, y, undefined, undefined, undefined, undefined, new Style(undefined, 'black', 2)),
        new PathPoint(undefined, (x + propWidthAndHeight.width), (y)),
      ];
    }
    return property;
  }

  static addDoubleDoor(currentPosition: MousePosition, property: Property, propWidthAndHeight, wallElement: SVGGeometryElement) {
    const startPoint = CommonService.getStartPointInPathLine(wallElement);
    const endPoint = CommonService.getEndPointInPathLine(wallElement);
    if (startPoint.x === endPoint.x) {
      const x = startPoint.x;
      const y = currentPosition.y;
      let point2 = new SvgPoints();
      const getFirstLength = CommonService.getLengthOfTwoPoints(startPoint, {x, y});
      if (CommonService.isPointsInClockWise(startPoint, endPoint)) {
        point2 = wallElement.getPointAtLength(getFirstLength + propWidthAndHeight.width);
      } else {
        point2 = wallElement.getPointAtLength(getFirstLength - propWidthAndHeight.width);
      }
      const y2 = currentPosition.y + (propWidthAndHeight.width);
      const x2 = x;
      property.pathArray = [
        new PathPoint('Line', x, y, undefined, undefined, undefined, undefined, new Style(undefined, 'white', 5)),
        new PathPoint(undefined, point2.x, point2.y),
        new PathPoint('Line', x, y, undefined, undefined, undefined, undefined, new Style(undefined, 'black', 2)),
        new PathPoint(undefined, (x + propWidthAndHeight.width), y),
        new PathPoint('Line', x2, y2, undefined, undefined, undefined, undefined, new Style(undefined, 'black', 2)),
        new PathPoint(undefined, (x2 + propWidthAndHeight.width), y2),
      ];
    } else if (startPoint.y === endPoint.y) {
      const x = currentPosition.x;
      const y = startPoint.y;
      let point2 = new SvgPoints();
      const getFirstLength = CommonService.getLengthOfTwoPoints(startPoint, {x, y});
      if (CommonService.isPointsInClockWise(startPoint, endPoint)) {
        point2 = wallElement.getPointAtLength(getFirstLength + propWidthAndHeight.width);
      } else {
        point2 = wallElement.getPointAtLength(getFirstLength - propWidthAndHeight.width);
      }
      const y2 = startPoint.y;
      const x2 = x + propWidthAndHeight.width;
      property.pathArray = [
        new PathPoint('Line', x, y, undefined, undefined, undefined, undefined, new Style(undefined, 'white', 5)),
        new PathPoint(undefined, point2.x, point2.y),
        new PathPoint('Line', x, y, undefined, undefined, undefined, undefined, new Style(undefined, 'black', 2)),
        new PathPoint(undefined, (x), (y + propWidthAndHeight.width)),
        new PathPoint('Line', x2, y2, undefined, undefined, undefined, undefined, new Style(undefined, 'black', 2)),
        new PathPoint(undefined, (x2), (y2 + propWidthAndHeight.width)),
      ];
    } else {
      const x = (currentPosition.x);
      const tan = (startPoint.y - endPoint.y) / (startPoint.x - endPoint.x);
      const y = startPoint.y - tan * (startPoint.x - currentPosition.x);
      let point2 = new SvgPoints();
      const getFirstLength = CommonService.getLengthOfTwoPoints(startPoint, {x, y});
      if (CommonService.isPointsInClockWise(startPoint, endPoint)) {
        point2 = wallElement.getPointAtLength(getFirstLength + propWidthAndHeight.width);
      } else {
        point2 = wallElement.getPointAtLength(getFirstLength - propWidthAndHeight.width);
      }
      property.pathArray = [
        new PathPoint('Line', x, y, undefined, undefined, undefined, undefined, new Style(undefined, 'white', 5)),
        new PathPoint(undefined, point2.x, point2.y),
        new PathPoint('Line', x, y, undefined, undefined, undefined, undefined, new Style(undefined, 'black', 2)),
        new PathPoint(undefined, undefined, undefined, undefined, undefined, (x + propWidthAndHeight.width), (y)),
        new PathPoint('Line', point2.x, point2.y, undefined, undefined, undefined, undefined, new Style(undefined, 'black', 2)),
        new PathPoint(undefined, (point2.x + propWidthAndHeight.width), (point2.y)),
      ];
    }
    return property;
  }


  private static switchDoor(propertyGroup, currentPosition, propWidthAndHeight, propertyData, wallElement) {
    if (propertyGroup.id.indexOf(Properties.SINGLE_DOOR) >= 0) {
      propertyData = CreatePropertyService.addSingleDoor(currentPosition, propertyData, propWidthAndHeight, wallElement);
    } else if (propertyGroup.id.indexOf(Properties.DOUBLE_DOOR) >= 0) {
      propertyData = CreatePropertyService.addDoubleDoor(currentPosition, propertyData, propWidthAndHeight, wallElement);
    }
    CommonService.drawLine(propertyGroup, propertyData);

    return propertyData;
  }

  createWallProperty(element: SVGGraphicsElement, line: SVGGraphicsElement, currentPosition: MousePosition,
                     propWidthAndHeight: { width: number, height: number }, property: PropertyNode) {
    if (property.id.indexOf('door') >= 0) {
      return this.createDoorShape(element, line, currentPosition, propWidthAndHeight, property);
    }
  }

  createNonWallProperty(element: SVGGraphicsElement, property: PropertyNode, propWidthAndHeight: { width: number; height: number },
                        currentPosition: MousePosition) {
    this.propertyCount++;
    const propertyGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    propertyGroup.setAttribute('id', `prop_${property.type}_${this.propertyCount}`);
    propertyGroup.setAttribute('class', `non_wall`);
    propertyGroup.style.cursor = 'pointer';
    element.appendChild(propertyGroup);
    const newProperty: Property = {
      propertyId: propertyGroup.id,
      type: PropertyType.NON_WALL_PROPERTY,
      image: new Image()
    };
    newProperty.image.initialPoint = {x: currentPosition.x, y: currentPosition.y};
    newProperty.image.width = propWidthAndHeight.width;
    newProperty.image.height = propWidthAndHeight.height;
    const prop = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    prop.setAttribute('height', newProperty.image.height.toString());
    prop.setAttribute('width', newProperty.image.width.toString());
    prop.setAttribute('id', `prop_${newProperty.type}`);
    prop.setAttribute('class', 'property non_wall');
    prop.setAttribute('x', newProperty.image.initialPoint.x.toString());
    prop.setAttribute('y', newProperty.image.initialPoint.y.toString());
    prop.style.cursor = 'pointer';
    if (property.name === Properties.CAFETERIA) {
      newProperty.image.location = 'assets/properties/cafe.svg';
    } else if (property.name === Properties.WASHROOM) {
      newProperty.image.location = 'assets/properties/washroom.svg';
    }
    prop.setAttributeNS('http://www.w3.org/1999/xlink', 'href', newProperty.image.location);
    propertyGroup.appendChild(prop);
    return newProperty;
  }

  createDoorShape(element: SVGGraphicsElement, line: SVGGraphicsElement, currentPosition: MousePosition,
                  propWidthAndHeight: { width: number; height: number }, propertyOB: PropertyNode) {
    this.propertyCount++;
    const startPoint = CommonService.getStartPointInPathLine(line);
    const endPoint = CommonService.getEndPointInPathLine(line);
    const propertyGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    propertyGroup.setAttribute('class', `wall`);
    propertyGroup.style.cursor = 'pointer';
    element.appendChild(propertyGroup);
    let property: Property = {
      propertyId: propertyGroup.id,
      type: PropertyType.WALL_PROPERTY,
      lineStart: startPoint,
      lineEnd: endPoint,
      pathArray: []
    };
    if (propertyOB.name === Properties.SINGLE_DOOR) {
      propertyGroup.setAttribute('id', `${Properties.SINGLE_DOOR}_${this.propertyCount}`);
      property.propertyId = propertyGroup.id;
      property = CreatePropertyService.addSingleDoor(currentPosition, property, propWidthAndHeight, line as any);
    } else if (propertyOB.name === Properties.DOUBLE_DOOR) {
      propertyGroup.setAttribute('id', `${Properties.DOUBLE_DOOR}_${this.propertyCount}`);
      property.propertyId = propertyGroup.id;
      property = CreatePropertyService.addDoubleDoor(currentPosition, property, propWidthAndHeight, line as any);
    }
    CommonService.drawLine(propertyGroup, property);
    return property;
  }

  switchPropertyToWall(PreviousWall: SVGGeometryElement, line: SVGGraphicsElement,
                       propertyGroup: SVGGraphicsElement, currentPosition: MousePosition, propertyData: Property) {
    const startPoint = CommonService.getStartPointInPathLine(line);
    const endPoint = CommonService.getEndPointInPathLine(line);
    propertyData.lineStart = startPoint;
    propertyData.lineEnd = endPoint;
    const newPropWidthAndHeight = {
      width: 0,
      height: 0
    };
    const propertyLineElements = Array.from(propertyGroup.querySelectorAll('.property'));
    propertyLineElements.forEach((singLine: any) => {
      const pointStart = CommonService.createSVGPoint(CommonService.getStartPointInLine(singLine as any));
      const pointEnd = CommonService.createSVGPoint(CommonService.getEndPointInPathLine(singLine as any));
      if (PreviousWall.isPointInStroke(pointStart) && PreviousWall.isPointInStroke(pointEnd)) {
        newPropWidthAndHeight.width = singLine.getTotalLength();
        newPropWidthAndHeight.height = singLine.getTotalLength() / 2;
      }
    });
    CommonService.removeChildElementFromParent(propertyGroup as any);
    return CreatePropertyService.switchDoor(propertyGroup, currentPosition, newPropWidthAndHeight, propertyData, line);
  }
}
