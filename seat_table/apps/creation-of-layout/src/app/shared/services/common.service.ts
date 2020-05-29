import {Injectable} from '@angular/core';
import {Block, Facility, Image, PathPoint, PriceBand, Property, Seat, SeatsRow, Shape, SvgPoints, Wall} from '../models/Shape';
import {MousePosition} from '../models/Venue';
import {PropertyType, RectanglePoints, ShapeType} from '../models/utils';
import {ViewBox} from '../models/CommonModels';
import {IntersectionPoint} from '../models/sampleModels';
import * as _ from 'lodash';
import {Guid} from 'guid-typescript';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private static shapeCount = 0;
  private static pathLineCount = 0;
  private static tableCount = 0;

  static get generateUniqId() {
    let id = 'STC';
    id += Guid.create().toString();
    return id;
  }

  static getMousePosition(svg: SVGGraphicsElement, event: MouseEvent) {
    const currentPosition = new MousePosition();
    const CTM = (svg).getScreenCTM();
    currentPosition.x = (event.clientX - CTM.e) / CTM.a;
    currentPosition.y = (event.clientY - CTM.f) / CTM.d;
    return currentPosition;
  }

  static getPreviousSibling(elem: SVGGraphicsElement, selector: string) {
    let sibling = elem.previousElementSibling;
    if (!selector) {
      return sibling;
    }
    while (sibling) {
      if (sibling.matches(selector)) {
        return sibling;
      }
      sibling = sibling.previousElementSibling;
    }
  }

  static getAngle(point1: SvgPoints, point2: SvgPoints) {
    const dy = (point1.y - point2.y);
    const dx = (point1.x - point2.x);
    const theta = Math.atan2(dy, dx);
    return Math.round((theta * (180 / Math.PI)) - 90);
  }

  static getRotationAngle(startPoint: SvgPoints, endPoint: SvgPoints, centerPoint) {
    const angle1 = Math.atan2(startPoint.y - centerPoint.y, startPoint.x - centerPoint.x);
    const angle2 = Math.atan2(endPoint.y - centerPoint.y, endPoint.x - centerPoint.x);
    let angle = (angle2 - angle1) * (180 / Math.PI);
    if (angle < 0) {
      angle += 360;
    }
    return angle;
  }

  static getStartPointInLine(lineElement: SVGGraphicsElement) {
    const startPoint = new SvgPoints();
    startPoint.x = parseFloat(lineElement.getAttribute('x1'));
    startPoint.y = parseFloat(lineElement.getAttribute('y1'));
    return startPoint;
  }

  static getStartPointInPathLine(lineElement: any) {
    const startPoint = new SvgPoints();
    startPoint.x = lineElement.getPointAtLength(0).x;
    startPoint.y = lineElement.getPointAtLength(0).y;
    return startPoint;
  }

  static getEndPointInPathLine(lineElement: any) {
    const startPoint = new SvgPoints();
    const lineTotalLength = lineElement.getTotalLength();
    startPoint.x = lineElement.getPointAtLength(lineTotalLength).x;
    startPoint.y = lineElement.getPointAtLength(lineTotalLength).y;
    return startPoint;
  }

  static getEndPointInLine(lineElement: SVGGraphicsElement) {
    const endPoint = new SvgPoints();
    endPoint.x = parseFloat(lineElement.getAttribute('x2'));
    endPoint.y = parseFloat(lineElement.getAttribute('y2'));
    return endPoint;
  }

  static createLinesForPath(pointsArray: PathPoint[], element: HTMLElement) {
    const linesElement: SVGElement[] = [];
    pointsArray.forEach((points, l) => {
      const elementNS = CommonService.createGroupElement(element as any, `line_${l}`);
      const aLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      aLine.setAttribute('class', `tableWall`);
      aLine.setAttribute('x1', points.x.toString());
      aLine.setAttribute('y1', points.y.toString());
      if (pointsArray[l + 1] !== undefined) {
        aLine.setAttribute('x2', pointsArray[l + 1].x.toString());
        aLine.setAttribute('y2', pointsArray[l + 1].y.toString());
        aLine.setAttribute('stroke', 'transparent');
        aLine.setAttribute('stroke-width', '20px');
        aLine.style.cursor = 'pointer';
        elementNS.appendChild(aLine);
        linesElement.push(elementNS);
      } else {
        return;
      }
    });

    return linesElement;
  }

  static creatBlockShape(parentElement: SVGElement, id) {
    const groupElement = CommonService.createGroupElement(parentElement, `group_${id}`);
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('id', `${id}`);
    path.setAttribute('class', `block`);
    path.setAttribute('stroke', `#555758`);
    path.setAttribute('fill', `transparent`);
    groupElement.appendChild(path);
    return groupElement;
  }

  static creatExistingBlockShape(parentElement: SVGElement, block: Block) {
    const groupElement = CommonService.createGroupElement(parentElement, `group_${block.id}`);
    const path = CommonService.createPathEle(groupElement, `${block.id}`, 'block');
    path.style.stroke = '#555758';
    path.style.fill = 'transparent';
    path.setAttribute('d', CommonService.buildPathString(block.pathPoint));
    groupElement.appendChild(path);
    if (!!block.seatsRow && block.seatsRow.length > 0) {
      block.seatsRow.forEach(seatRow => {
        const seatsRowGroupElement = CommonService.createGroupElement(groupElement as any, seatRow.id, 'seatsRow');
        const rowPath = CommonService.createPathEle(seatsRowGroupElement, this.generateUniqId, 'rowLinePath');
        rowPath.style.fill = 'none';
        rowPath.setAttribute('d', CommonService.buildPathString(seatRow.linePathPoint));
        const seatsGroup = this.createGroupElement(seatsRowGroupElement, `seats-group-${seatRow.id}`, 'seats-group');
        CommonService.createSeatsForSeating(seatsGroup, seatRow.seats);
        this.createLabelForRowAndSeats(seatsGroup, seatRow);

      });
    }
    return groupElement;
  }

  static createSelectionSeatsRow(parentElement: SVGElement) {
    const rowLinePath = parentElement.querySelector('.rowLinePath');
    const rowStartPoint = CommonService.getStartPointInPathLine(rowLinePath);
    const rowEndPoint = CommonService.getEndPointInPathLine(rowLinePath);
    const seatsGroup = this.createGroupElement((parentElement as any).parentElement, null, 'selection-group');
    const rowBBox = (parentElement as any).getBBox();
    const centerPosition = CommonService.getCenterPosition(parentElement as any);
    centerPosition.y -= rowBBox.height / 2 + 10;

    const selectionRect = this.createRectElement(seatsGroup, rowBBox.x, rowBBox.y, rowBBox.width, rowBBox.height, 'selection-rect', 'transparent');
    const rotationPoint = this.createCircleElement(seatsGroup, centerPosition.x, centerPosition.y, 5, 'canRotateRow');
    const leftCenter = this.createCircleElement(seatsGroup, rowStartPoint.x, rowStartPoint.y, 5,
      'can-seat-count-change', 'blue', 'none', RectanglePoints.LEFT_CENTER);
    const rightCenter = this.createCircleElement(seatsGroup, rowEndPoint.x, rowEndPoint.y, 5,
      'can-seat-count-change', 'blue', 'none', RectanglePoints.RIGHT_CENTER);
    rotationPoint.style.cursor = 'alias';
    leftCenter.style.cursor = 'col-resize';
    rightCenter.style.cursor = 'col-resize';
    return seatsGroup;

  }

  static createPathElement(groupElement: SVGGraphicsElement, id): SVGGraphicsElement {
    this.shapeCount++;
    const elementNS = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    elementNS.setAttribute('id', `${id}_ShapeGrope_${this.shapeCount}`);
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('id', `${id}_shape_${this.shapeCount}`);
    path.setAttribute('class', `shapes`);
    path.setAttribute('stroke', `black`);
    path.setAttribute('fill', `none`);
    groupElement.appendChild(elementNS);
    elementNS.appendChild(path);
    const clip = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
    clip.setAttribute('id', `${id}_shape_${this.shapeCount}clip`);
    groupElement.appendChild(clip);
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `#${id}_shape_${this.shapeCount}`);
    clip.appendChild(use);
    return elementNS as SVGGraphicsElement;


  }

  static createNonSeatingPathElement(groupElement: SVGGraphicsElement, shapeId, id): SVGGraphicsElement {
    this.shapeCount++;
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    // group.setAttribute('clip-path',`url(#${shapeId}clip)`);
    group.setAttribute('id', `${id}`);
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('id', `${id}_nonSeatingArea`);
    path.setAttribute('class', `nonSeatingArea`);
    path.setAttribute('stroke', `black`);
    path.setAttribute('fill', `none`);
    groupElement.appendChild(group);
    group.appendChild(path);

    return group as SVGGraphicsElement;


  }

  static createTablePathElement(groupElement: SVGGraphicsElement, id): SVGGraphicsElement {
    this.tableCount++;
    // tslint:disable-next-line:no-shadowed-variable
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('id', `${id}_ShapeGrope_${this.tableCount}`);
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('id', `${id}_shape_${this.tableCount}`);
    path.setAttribute('class', `tables`);
    path.setAttribute('stroke', `black`);
    path.setAttribute('fill', `none`);
    groupElement.appendChild(group);
    group.appendChild(path);
    return group as SVGGraphicsElement;
  }

  static convertPixelToMAndKm(pixel: number) {
    const value = pixel;
    return value > 1000 ? `${(value / 1000).toFixed(2)}Km` : `${value.toFixed(2)} M`;
  }

  static getShapeWidthHeight(shape: SVGGraphicsElement) {
    if (!shape) {
      return {width: 0, height: 0};
    }
    const bBox = shape.getBBox();
    const height = CommonService.convertPixelToMAndKm(bBox.height);
    const width = CommonService.convertPixelToMAndKm(bBox.width);
    return {width, height};
  }

  static getShapeAttributes(shape: SVGGraphicsElement): { length: number, height: number } {
    if (!shape) {
      return {length: 0, height: 0};
    }
    const bBox = shape.getBBox();
    const height: number = parseFloat((bBox.height).toFixed(2));
    const length: number = parseFloat((bBox.width).toFixed(2));
    return {length, height};
  }

  static shapeSelection(element: HTMLElement, points: PathPoint[]) {
    const selectionGroup = CommonService.createGroupElement(element as any, 'selectorProp');
    points.forEach((point, i) => {
      if (point.command !== 'z') {
        if (point.command === 'Q') {
          const line = this.createPathEle(selectionGroup);
          const startPoint = {x: point.x, y: point.y};
          const endPoint = {x: point.x1, y: point.y1};
          line.setAttribute('d', this.buildPathString(this.createLinePathPoint(startPoint, endPoint)));
          line.style.fill = 'none';
          line.style.stroke = 'blue';
          line.style.strokeWidth = '3px';
          const circle = this.createCircleElement(selectionGroup, (endPoint.x), (endPoint.y), 5,
            'curvePoint', 'blue', 'white', `curve_point_${i}`);
          circle.style.cursor = 'grab';
        }
        if (point.x !== undefined && point.x) {
          const circle = this.createCircleElement(selectionGroup, (point.x), (point.y), 5,
            'reshapePoint', 'black', 'white', `resize_point_${i}`);
          circle.style.cursor = 'grab';
        }
      }
    });
    return selectionGroup;
  }

  static singleSelectPathShape(element: HTMLElement, shape: SVGGraphicsElement, isSeatGroup = false) {
    const selectionGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g') as SVGGraphicsElement;
    selectionGroup.setAttribute('id', 'singleSelectPath');
    element.appendChild(selectionGroup);
    const bBox = shape.getBBox();
    const rect = this.createRectElement(selectionGroup, bBox.x, bBox.y, bBox.width, bBox.height,
      'canMove', 'none', 'blue');
    rect.style.cursor = 'move';
    const rotatePoint = this.createCircleElement(selectionGroup, (bBox.x + bBox.width / 2), (bBox.y - 30),
      6, 'rotate', 'blue', 'white');
    if (!isSeatGroup) {
      const rt =
        this.createCircleElement(selectionGroup, (bBox.x + bBox.width), (bBox.y), 5,
          'selector', 'blue', 'none', RectanglePoints.TOP_RIGHT);
      const rb =
        this.createCircleElement(selectionGroup, (bBox.x + bBox.width), (bBox.y + bBox.height), 5,
          'selector', 'blue', 'none', RectanglePoints.BOTTOM_RIGHT);
      const lt =
        this.createCircleElement(selectionGroup, (bBox.x), (bBox.y), 5,
          'selector', 'blue', 'none', RectanglePoints.TOP_LEFT);
      const lb =
        this.createCircleElement(selectionGroup, (bBox.x), (bBox.y + bBox.height), 5,
          'selector', 'blue', 'none', RectanglePoints.BOTTOM_LEFT);
      const topCenter = this.createCircleElement(selectionGroup, (bBox.x + bBox.width / 2), (bBox.y), 5,
        'selector', 'blue', 'none', RectanglePoints.TOP_CENTER);
      const bottomCenter = this.createCircleElement(selectionGroup, (bBox.x + bBox.width / 2), (bBox.y + bBox.height), 5,
        'selector', 'blue', 'none', RectanglePoints.BOTTOM_CENTER);
      const leftCenter = this.createCircleElement(selectionGroup, (bBox.x), (bBox.y + bBox.height / 2), 5,
        'selector', 'blue', 'none', RectanglePoints.LEFT_CENTER);
      const rightCenter = this.createCircleElement(selectionGroup, (bBox.x + bBox.width), (bBox.y + bBox.height / 2), 5,
        'selector', 'blue', 'none', RectanglePoints.RIGHT_CENTER);
      topCenter.style.cursor = 's-resize';
      bottomCenter.style.cursor = 's-resize';
      leftCenter.style.cursor = 'w-resize';
      rightCenter.style.cursor = 'w-resize';
      lt.style.cursor = 'nw-resize';
      lb.style.cursor = 'nesw-resize';
      rt.style.cursor = 'nesw-resize';
      rb.style.cursor = 'nw-resize';
      rotatePoint.style.cursor = 'alias';
    }
    return selectionGroup;
  }

  static normalSelectPathShape(element: HTMLElement, shape: SVGGraphicsElement) {
    const selectionGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g') as SVGGraphicsElement;
    selectionGroup.setAttribute('id', 'normalSelectPath');
    element.appendChild(selectionGroup);
    const bBox = shape.getBBox();
    const rect = this.createRectElement(selectionGroup, bBox.x, bBox.y, bBox.width, bBox.height,
      'canMove', 'none', 'blue');
    rect.style.cursor = 'move';
    return selectionGroup;
  }

  static setPathPoints(element: SVGGraphicsElement, points) {
    const selectionGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g') as SVGGraphicsElement;
    selectionGroup.setAttribute('id', 'selectorProp');
    element.appendChild(selectionGroup);
    points.forEach((point, i) => {
      if (point.command === 'z') {
        return;
      }
      if (i === 0) {
        const starter = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        starter.setAttribute('class', 'pathPoint PathStarter');
        starter.setAttribute('cx', (point.x).toString());
        starter.setAttribute('cy', (point.y).toString());
        starter.setAttribute('r', '10');
        starter.setAttribute('fill', 'black');
        starter.setAttribute('stroke', 'none');
        starter.style.cursor = 'pointer';
        selectionGroup.appendChild(starter);
      } else {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('class', 'pathPoint');
        circle.setAttribute('id', `point_${i}`);
        circle.setAttribute('cx', (point.x).toString());
        circle.setAttribute('cy', (point.y).toString());
        circle.setAttribute('r', '5');
        circle.setAttribute('fill', 'blue');
        circle.setAttribute('stroke', 'none');
        circle.style.cursor = 'nw-resize';
        selectionGroup.appendChild(circle);
      }
    });
    return selectionGroup;
  }

  static getCenterPosition(shape: SVGGraphicsElement): MousePosition {
    const bBox = shape.getBBox();
    const cPosition = new MousePosition();
    cPosition.x = bBox.x + (bBox.width / 2);
    cPosition.y = bBox.y + (bBox.height / 2);
    return cPosition;
  }

  static getCirclePoint(element: SVGGraphicsElement): MousePosition {
    const mousePoint = new MousePosition();
    mousePoint.x = parseFloat(element.getAttribute('cx'));
    mousePoint.y = parseFloat(element.getAttribute('cy'));
    return mousePoint;
  }

  static createDrawPreview(element: SVGGraphicsElement, currentPosition: MousePosition) {
    const elementNS = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const previewElement = element.querySelector('#drawPreviewLine');
    if (previewElement) {
      previewElement.remove();
    }
    const verticalY = 15000;
    const horizontalX = 15000;
    elementNS.setAttribute('id', 'drawPreviewLine');
    element.appendChild(elementNS);
    const verticalLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    verticalLine.setAttribute('class', `verticalLine`);
    verticalLine.setAttribute('x1', (currentPosition.x + 2).toString());
    verticalLine.setAttribute('y1', '0');
    verticalLine.setAttribute('x2', (currentPosition.x + 2).toString());
    verticalLine.setAttribute('y2', verticalY.toString());
    verticalLine.setAttribute('stroke', '#ff0900');
    verticalLine.setAttribute('stroke-width', '1px');
    const horizontalLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    horizontalLine.setAttribute('class', `horizontalLine`);
    horizontalLine.setAttribute('x1', '0');
    horizontalLine.setAttribute('y1', (currentPosition.y + 2).toString());
    horizontalLine.setAttribute('x2', horizontalX.toString());
    horizontalLine.setAttribute('y2', (currentPosition.y + 2).toString());
    horizontalLine.setAttribute('stroke', '#ff0900');
    horizontalLine.setAttribute('stroke-width', '1px');
    elementNS.appendChild(horizontalLine);
    elementNS.appendChild(verticalLine);

  }

  static showLineWidth(points, mainElement: SVGElement) {
    const previewElement = mainElement.querySelector('#lineLengthPreview');
    if (previewElement) {
      previewElement.remove();
    }
    const elementNS = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    elementNS.setAttribute('id', 'lineLengthPreview');
    mainElement.appendChild(elementNS);
    points.forEach((point, i) => {
      if (point.command === 'z') {
        return;
      }
      const startPoint = point;
      const endPoint = i === points.length - 1 ? points[0] : points[i + 1];
      const length = startPoint.x === endPoint.x ?
        startPoint.y < endPoint.y ? endPoint.y - startPoint.y : startPoint.y - endPoint.y :
        startPoint.y === endPoint.y ?
          startPoint.x < endPoint.x ? endPoint.x - startPoint.x : startPoint.x - endPoint.x :
          startPoint.x < endPoint.x && startPoint.y < endPoint.y ?
            Math.sqrt(((endPoint.x - startPoint.x) ** 2 + (endPoint.y - startPoint.y) ** 2)) :
            startPoint.x > endPoint.x && startPoint.y < endPoint.y ?
              Math.sqrt(((startPoint.x - endPoint.x) ** 2 + (endPoint.y - startPoint.y) ** 2)) :
              startPoint.x > endPoint.x && startPoint.y > endPoint.y ?
                Math.sqrt(((startPoint.x - endPoint.x) ** 2 + (startPoint.y - endPoint.y) ** 2)) :
                startPoint.x < endPoint.x && startPoint.y > endPoint.y ?
                  Math.sqrt(((endPoint.x - startPoint.x) ** 2 + (startPoint.y - endPoint.y) ** 2)) : 0;


      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      if (startPoint.x === endPoint.x) {
        text.setAttribute('x', (startPoint.x - 10).toString());

        if (startPoint.y < endPoint.y) {
          text.setAttribute('y', (startPoint.y + length / 2).toString());
        } else {
          text.setAttribute('y', (startPoint.y - length / 2).toString());
        }

      } else if (startPoint.y === endPoint.y) {
        text.setAttribute('y', (startPoint.y - 10).toString());
        if (startPoint.x < endPoint.x) {
          text.setAttribute('x', (startPoint.x + length / 2).toString());
        } else {
          text.setAttribute('x', (startPoint.x - length / 2).toString());
        }
      } else {
        const x = startPoint.x + 20;
        if (startPoint.x < endPoint.x) {
          text.setAttribute('x', (startPoint.x).toString());
        } else {
          text.setAttribute('x', (startPoint.x).toString());
        }
        const tan = (startPoint.y - endPoint.y) / (startPoint.x - endPoint.x);
        const y = startPoint.y - tan * (startPoint.x - x) + 20;
        if (startPoint.y < endPoint.y) {
          text.setAttribute('y', String(y));
        } else {
          text.setAttribute('y', String(y));
        }
      }
      text.innerHTML = String(Math.round(length));
      elementNS.appendChild(text);
    });
  }


  static setPathDString(selectedShape, points) {
    if (selectedShape.id.indexOf(ShapeType.LINE) >= 0) {
      selectedShape.setAttribute('d', `${points}`);
    } else {
      selectedShape.setAttribute('d', `${points} z`);
    }
  }

  static buildPathString(pathArray: PathPoint[]) {
    let res = '';
    if (!!pathArray) {
      pathArray.forEach(point => {
        res +=
          point.command === 'A' ?
            `${point.command} ${point.arcRadiusX}, ${point.arcRadiusY}, ${point.xAxisRotation},
          ${point.largeArcFlag}, ${point.sweepFlag},  ${point.x}, ${point.y} ` :
            point.command === 'Q' ?
              `${point.command} ${point.x1}, ${point.y1} ,  ${point.x}, ${point.y} ` :
              point.x !== undefined && point.y !== undefined && point.command !== undefined ?
                `${point.command} ${point.x}, ${point.y} ` :
                point.x === undefined && point.y === undefined && point.command !== undefined ?
                  `${point.command} ` :
                  point.x !== undefined && point.y !== undefined && point.command === undefined ?
                    `${point.x}, ${point.y} ` : ' ';
      });
    }
    return res;
  }

  static previewLine(initialCoordination, currentPosition, svgElement) {
    const startPoint = initialCoordination;
    const endPoint = currentPosition;
    endPoint.x += 5;
    endPoint.y += 5;
    const previewElement = svgElement.querySelector('#previewLine');
    if (previewElement) {
      previewElement.setAttribute('x1', startPoint.x.toString());
      previewElement.setAttribute('y1', startPoint.y.toString());
      previewElement.setAttribute('x2', endPoint.x.toString());
      previewElement.setAttribute('y2', endPoint.y.toString());
    } else {
      const previewLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      previewLine.setAttribute('id', `previewLine`);
      previewLine.setAttribute('x1', startPoint.x.toString());
      previewLine.setAttribute('y1', startPoint.y.toString());
      previewLine.setAttribute('x2', endPoint.x.toString());
      previewLine.setAttribute('y2', endPoint.y.toString());
      previewLine.setAttribute('stroke', 'blue');
      previewLine.setAttribute('stroke-width', '2px');
      svgElement.appendChild(previewLine);
    }
  }

  static propertySelect(element: SVGElement, property: SVGGraphicsElement, wallElement: SVGGeometryElement, propertyData: Property) {
    const selectionGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g') as SVGGraphicsElement;
    selectionGroup.setAttribute('id', 'propertySelect');
    property.appendChild(selectionGroup);
    const bBox = property.getBBox();

    if ((property).classList.contains('non_wall')) {
      this.createRectElement(selectionGroup, bBox.x, bBox.y, bBox.width, bBox.height, 'canMove', 'transparent', 'Blue');
      const movePoint =
        CommonService.createCircleElement(selectionGroup, (bBox.x + bBox.width / 2), (bBox.y + bBox.height / 2), 5, 'propMovePoint');
      movePoint.style.cursor = 'move';
      const resizePoint =
        CommonService.createCircleElement(selectionGroup, (bBox.x + bBox.width), (bBox.y + bBox.height), 5, 'propResizePoint canResize');
      resizePoint.style.cursor = 'nw-resize';
    } else if ((property).classList.contains('wall')) {
      let start;
      let end;
      let midPoint;
      const propertyLineElements = Array.from(property.querySelectorAll('.property'));
      propertyLineElements.forEach((line: any) => {
        const pointStart = this.createSVGPoint(CommonService.getStartPointInLine(line as any));
        const pointEnd = this.createSVGPoint(CommonService.getEndPointInPathLine(line as any));
        if (wallElement.isPointInStroke(pointStart) && wallElement.isPointInStroke(pointEnd)) {
          const lineLength = line.getTotalLength();
          midPoint = line.getPointAtLength(lineLength / 2);
          start = pointStart;
          end = pointEnd;
        }
        const movePoint =
          CommonService.createCircleElement(selectionGroup, midPoint.x, midPoint.y, 5, 'propMovePoint');
        movePoint.style.cursor = 'move';
        const startCircle =
          CommonService.createCircleElement(selectionGroup, start.x, start.y, 5, 'propResizePoint canResize');
        startCircle.style.cursor = 'nw-resize';
        const endCircle =
          CommonService.createCircleElement(selectionGroup, end.x, end.y, 5, 'propResizePoint canResize');
        endCircle.style.cursor = 'nw-resize';
      });
    }

    return selectionGroup;
  }

  static createSVGPoint(data): SVGPoint {
    const svgRoot = document.querySelector('svg');
    const point = (svgRoot as any).createSVGPoint();
    return Object.assign(point, data);
  }

  static createCircleElement(parenElement: SVGElement, cx: number, cy: number, radius: number,
                             attClass: string, fill = 'blue', stroke = 'none', id = null) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('class', attClass);
    if (id !== null) {
      circle.setAttribute('id', id);
    }
    circle.setAttribute('cx', cx.toString());
    circle.setAttribute('cy', cy.toString());
    circle.setAttribute('r', radius.toString());
    circle.setAttribute('fill', fill);
    circle.setAttribute('stroke', stroke);
    parenElement.appendChild(circle);
    return circle;
  }

  static createGroupElement(parenElement: SVGElement, id = null, eleClass = null) {
    const elementNS = document.createElementNS('http://www.w3.org/2000/svg', 'g') as SVGGraphicsElement;
    if (!!id) {
      elementNS.setAttribute('id', id);
    }
    if (!!eleClass) {
      elementNS.setAttribute('class', eleClass);
    }
    parenElement.appendChild(elementNS);
    return elementNS;
  }

  static createPathEle(parentElement: SVGElement, id = null, eleClass = null) {
    const elementNS = document.createElementNS('http://www.w3.org/2000/svg', 'path') as SVGGraphicsElement;
    if (!!id) {
      elementNS.setAttribute('id', id);
    }
    if (!!eleClass) {
      elementNS.setAttribute('class', eleClass);
    }
    parentElement.appendChild(elementNS);
    return elementNS;
  }

  static createRectElement(parenElement: SVGElement, x: number, y: number, width: number,
                           height: number, attClass: string, fill = 'blue', stroke = 'blue', id = null) {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('class', attClass);
    if (id !== null) {
      rect.setAttribute('id', id);
    }
    rect.setAttribute('x', x.toString());
    rect.setAttribute('y', y.toString());
    rect.setAttribute('width', width.toString());
    rect.setAttribute('height', height.toString());
    rect.setAttribute('fill', fill);
    rect.setAttribute('stroke', stroke);
    parenElement.appendChild(rect);
    return rect;
  }

  static drawLine(propertyGroup: SVGElement, line: any) {
    let newLine: Element;
    line.pathArray.forEach(point => {
      if (point.command === 'Line') {
        newLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        newLine.setAttribute('class', 'property');
        newLine.setAttribute('x1', point.x.toString());
        newLine.setAttribute('y1', point.y.toString());
        if (!!point.style) {
          newLine.setAttribute('stroke-width', String(point.style.strokeWidth));
          newLine.setAttribute('stroke', point.style.stroke);
        }
        propertyGroup.appendChild(newLine);
      } else {
        newLine.setAttribute('x2', point.x.toString());
        newLine.setAttribute('y2', point.y.toString());
      }
    });
    return newLine;
  }

  static checkPointsInFill(points: PathPoint[], shape) {
    const pathPoints = [];
    points.forEach((point) => {
      if (point.command.toLowerCase() === 'z') {
      } else {
        const fillPoint = CommonService.createSVGPoint({x: point.x, y: point.y});
        const isPointFill = (shape as SVGGeometryElement).isPointInFill(fillPoint);
        if (isPointFill) {
          pathPoints.push(point);
        }
      }
    });
    return pathPoints;
  }

  static drawWall(wallGroup: SVGElement, wall: any) {
    let newLine: Element;
    newLine = CommonService.createPathEle(wallGroup, wall.id, `pointLine`);
    newLine.setAttribute('d', CommonService.buildPathString(wall.pathArray));
    newLine.setAttribute('fill', 'none');
    return newLine;
  }

  static createShapeExistingShape(element: SVGGraphicsElement, shape: Shape, createWalls = true, withoutColorShape = false) {
    this.shapeCount = +shape.shapeID.replace(/[^\d.]/g, '');
    const group = CommonService.createGroupElement(element, `${shape.type}_ShapeGrope_${this.shapeCount}`);
    const path = CommonService.createPathEle(group, `${shape.type}_shape_${this.shapeCount}`, `shapes`);
    if (withoutColorShape) {
      path.setAttribute('fill', '#ffffff');
    } else {
      path.setAttribute('fill', shape.style.fill);
    }
    path.setAttribute('fill-opacity', String(shape.style.opacity));
    path.setAttribute('d', CommonService.buildPathString(shape.pathArray));
    const clip = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
    clip.setAttribute('id', `${shape.type}_shape_${this.shapeCount}clip`);
    element.appendChild(clip);
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', `#${shape.type}_shape_${this.shapeCount}`);
    clip.appendChild(use);
    if (shape.visibility) {
      group.style.display = 'block';
    } else {
      group.style.display = 'none';
    }
    if (createWalls) {
      if (shape.walls.length > 0) {
        const wallsG = CommonService.createGroupElement(group, `wallGroup_${shape.shapeID}`, `wallGroup`);
        shape.walls.forEach(wall => {
          const wallG = CommonService.createGroupElement(wallsG as any, `g_${wall.id}`);
          wallG.style.cursor = 'pointer';
          const line: HTMLElement = CommonService.drawWall(wallG, wall) as any;
          line.style.stroke = this.setLightPercentage(shape.style.fill, 70);
          line.style.strokeWidth = wall.style.strokeWidth.toString();
        });
      } else {
        shape = this.createShapeWalls(shape, path, {fillColor: 'none', borderColor: 'black'});
      }
    }
    if (shape.properties !== undefined) {
      shape.properties.forEach(property => {
        if (property.type === PropertyType.WALL_PROPERTY) {
          const propertyGroup = CommonService.createGroupElement(group, property.propertyId, 'wall');
          propertyGroup.style.cursor = 'pointer';
          CommonService.drawLine(propertyGroup, property);
        } else if (property.type === PropertyType.NON_WALL_PROPERTY) {
          const propertyGroup = CommonService.createGroupElement(group, property.propertyId, 'non_wall');
          const prop = document.createElementNS('http://www.w3.org/2000/svg', 'image');
          prop.setAttribute('height', property.image.height.toString());
          prop.setAttribute('width', property.image.width.toString());
          prop.setAttribute('id', `prop_${property.type}`);
          prop.setAttribute('class', 'property non_wall');
          prop.setAttribute('x', property.image.initialPoint.x.toString());
          prop.setAttribute('y', property.image.initialPoint.y.toString());
          prop.style.cursor = 'pointer';
          prop.setAttributeNS('http://www.w3.org/1999/xlink', 'href', property.image.location);
          propertyGroup.appendChild(prop);
        }
      });
    }

    if (!!shape.nonSeatingArea) {
      shape.nonSeatingArea.map(area => {
        const nonGroup = CommonService.createGroupElement(group, area.id);
        const nonPath = CommonService.createPathEle(nonGroup, `${area.id}_shape_${this.shapeCount}`, `nonSeatingArea`);
        nonGroup.setAttribute('clip-path', `url(#${shape.shapeID}clip)`);
        nonPath.setAttribute('fill', 'url(#pattern_non_seating)');
        nonPath.setAttribute('stroke', 'black');
        nonPath.setAttribute('d', CommonService.buildPathString(area.pathArray));
        nonGroup.appendChild(nonPath);
      });
    }
    this.shapeCount++;
    return path;
  }

  static createFacilityForVenueMap(parentElement: SVGElement, facility: Facility) {
    const mainGrope = CommonService.createGroupElement(parentElement, facility.id);
    facility.shapes.forEach(shape => {
      this.shapeCount = +shape.shapeID.replace(/[^\d.]/g, '');
      const group = CommonService.createGroupElement(mainGrope, `${shape.type}_ShapeGrope_${this.shapeCount}`);
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('id', `${shape.type}_shape_${this.shapeCount}`);
      path.setAttribute('class', `shapes`);
      path.setAttribute('fill', shape.style.fill);
      path.setAttribute('fill-opacity', String(shape.style.opacity));
      path.setAttribute('d', CommonService.buildPathString(shape.pathArray));
      path.style.stroke = 'black';
      group.appendChild(path);
      if (shape.visibility) {
        group.style.display = 'block';
      } else {
        group.style.display = 'none';
      }

    });

    return mainGrope;
  }

  static createTable(element: SVGGraphicsElement, shape: Shape, id: string, priceBand: PriceBand) {
    this.shapeCount = +shape.shapeID.replace(/[^\d.]/g, '');
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('id', `${id}`);
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('id', `${shape.type}_table_${this.shapeCount}`);
    path.setAttribute('class', `tables`);
    path.setAttribute('stroke', shape.style.stroke);
    path.setAttribute('stroke-width', String(shape.style.strokeWidth));
    path.setAttribute('fill', priceBand.color);
    path.setAttribute('fill-opacity', String(shape.style.opacity));
    path.setAttribute('d', CommonService.buildPathString(shape.pathArray));
    path.getBoundingClientRect();
    element.appendChild(group);
    group.appendChild(path);
    this.shapeCount++;
  }

  static CreateOuterRectangle(bBox: { x: number; y: number; height: number; width: number }, element) {
    const groupOuter = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    element.appendChild(groupOuter);
    this.createRectElement(groupOuter, bBox.x, bBox.y, bBox.width, bBox.height, 'outerspace', 'transparent', 'none');
  }

  static removeChildElementFromParent(parent: HTMLElement) {
    let child = !!parent ? parent.lastElementChild : null;
    while (child) {
      parent.removeChild(child);
      child = !!parent.lastElementChild ? parent.lastElementChild : null;
    }
  }

  static getScaleStartPoint(element, target) {
    return target.id === RectanglePoints.TOP_RIGHT ?
      element.querySelector(`#${RectanglePoints.BOTTOM_LEFT}`) :
      target.id === RectanglePoints.BOTTOM_RIGHT ?
        element.querySelector(`#${RectanglePoints.TOP_LEFT}`) :
        target.id === RectanglePoints.BOTTOM_LEFT ?
          element.querySelector(`#${RectanglePoints.TOP_RIGHT}`) :
          target.id === RectanglePoints.TOP_LEFT ?
            element.querySelector(`#${RectanglePoints.BOTTOM_RIGHT}`) :
            target.id === RectanglePoints.TOP_CENTER ?
              element.querySelector(`#${RectanglePoints.BOTTOM_CENTER}`) :
              target.id === RectanglePoints.BOTTOM_CENTER ?
                element.querySelector(`#${RectanglePoints.TOP_CENTER}`) :
                target.id === RectanglePoints.LEFT_CENTER ?
                  element.querySelector(`#${RectanglePoints.RIGHT_CENTER}`) :
                  target.id === RectanglePoints.RIGHT_CENTER ?
                    element.querySelector(`#${RectanglePoints.LEFT_CENTER}`) : null;
  }

  static isOvalResize(target) {
    return target.id === RectanglePoints.TOP_RIGHT ||
    target.id === RectanglePoints.BOTTOM_RIGHT ||
    target.id === RectanglePoints.BOTTOM_LEFT ||
    target.id === RectanglePoints.TOP_LEFT ?
      false :
      target.id === RectanglePoints.TOP_CENTER ||
      target.id === RectanglePoints.BOTTOM_CENTER ||
      target.id === RectanglePoints.LEFT_CENTER ||
      target.id === RectanglePoints.RIGHT_CENTER ?
        true : null;
  }

  static circle(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius.x * Math.cos(angleInRadians)),
      y: centerY + (radius.y * Math.sin(angleInRadians))
    };
  }

  static createShapeWalls(shape: Shape, selectedShape, shapeStyle) {
    const shapeGroup: HTMLElement = selectedShape.parentElement;
    const existingWalls = shapeGroup.querySelector(`.wallGroup`);
    if (!!existingWalls) {
      existingWalls.remove();
    }
    shape.walls = [];
    shape.properties = [];
    if (selectedShape.id.indexOf(ShapeType.CIRCLE) >= 0 || selectedShape.id.indexOf(ShapeType.OVAL) >= 0) {
      const wall = new Wall(`wall_${this.generateUniqId}`);
      if (shape.pathArray[0].command === 'M') {
        wall.startPoint.x = shape.pathArray[0].x;
        wall.startPoint.y = shape.pathArray[0].y;
        wall.endPoint.x = shape.pathArray[1].x;
        wall.endPoint.y = shape.pathArray[1].y;
      }
      wall.pathArray = shape.pathArray;
      shape.walls.push(wall);
    } else {
      shape.pathArray.forEach((points, l) => {
        const wall = new Wall(`wall_${this.generateUniqId}`);
        if (points.command === 'z') {
          return;
        }
        wall.startPoint.x = _.cloneDeep(points.x);
        wall.startPoint.y = _.cloneDeep(points.y);
        wall.pathArray.push(new PathPoint('M', wall.startPoint.x, wall.startPoint.y));
        if (l !== shape.pathArray.length - 1 && shape.pathArray[l + 1].command === 'z') {
          wall.endPoint.x = _.cloneDeep(shape.pathArray[0].x);
          wall.endPoint.y = _.cloneDeep(shape.pathArray[0].y);
          wall.pathArray.push(new PathPoint('L', wall.endPoint.x, wall.endPoint.y));
        } else if (shape.pathArray[l + 1] !== undefined) {
          wall.endPoint.x = _.cloneDeep(shape.pathArray[l + 1].x);
          wall.endPoint.y = _.cloneDeep(shape.pathArray[l + 1].y);
          if (shape.pathArray[l + 1].command === 'A') {
            wall.pathArray.push(_.cloneDeep(shape.pathArray[l + 1]));
          } else if (shape.pathArray[l + 1].command === 'Q') {
            wall.pathArray.push(_.cloneDeep(shape.pathArray[l + 1]));
          } else {
            wall.pathArray.push(new PathPoint('L', shape.pathArray[l + 1].x, shape.pathArray[l + 1].y));
          }
        } else {
          return;
        }
        shape.walls.push(wall);
      });
    }
    const wallsG = this.createGroupElement(shapeGroup as any, `wallGroup_${shape.shapeID}`, 'wallGroup');
    shape.walls.forEach(wall => {
      const wallG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      wallG.setAttribute('id', `g_${wall.id}`);
      wallsG.appendChild(wallG);
      wallG.style.cursor = 'pointer';
      const line: HTMLElement = CommonService.drawWall(wallG, wall) as any;
      line.style.stroke = this.setLightPercentage(shape.style.fill, 70);
      line.style.strokeWidth = wall.style.strokeWidth.toString();
    });
    return shape;
  }

  static setLightPercentage(col: any, p: number) {
    // tslint:disable-next-line:one-variable-per-declaration
    let R, G, B;
    if (col[0] === '#') {
      R = parseInt(col.substring(1, 3), 16);
      G = parseInt(col.substring(3, 5), 16);
      B = parseInt(col.substring(5, 7), 16);
    } else {
      const rgb = col.substring(4, col.length - 1)
        .replace(/ /g, '')
        .split(',');
      R = parseInt(rgb[0], 10);
      G = parseInt(rgb[1], 10);
      B = parseInt(rgb[2], 10);
    }
    const currTotalDark = (255 * 3) - (R + G + B);
    // calculate how much of the current darkness comes from the different channel
    const RR = ((255 - R) / currTotalDark);
    const GR = ((255 - G) / currTotalDark);
    const BR = ((255 - B) / currTotalDark);
    // calculate how much darkness there should be in the new color
    const newTotalDark = ((255 - 255 * (p / 100)) * 3);

    // make the new channels contain the same % of available dark as the old ones did
    const NR = 255 - Math.round(RR * newTotalDark);
    const NG = 255 - Math.round(GR * newTotalDark);
    const NB = 255 - Math.round(BR * newTotalDark);

    const RO = ((NR.toString(16).length === 1) ? '0' + NR.toString(16) : NR.toString(16));
    const GO = ((NG.toString(16).length === 1) ? '0' + NG.toString(16) : NG.toString(16));
    const BO = ((NB.toString(16).length === 1) ? '0' + NB.toString(16) : NB.toString(16));

    return '#' + RO + GO + BO;
  }

  static createVenueBackgroundImage(parentElement, image: Image) {
    const isMapExist = parentElement.getElementById('venueBackgroundImage');
    if (!!isMapExist) {
      isMapExist.remove();
    }
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('id', 'venueBackgroundImage');
    parentElement.insertBefore(group, parentElement.firstChild);
    const svgimg = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    svgimg.setAttributeNS('http://www.w3.org/1999/xlink', 'href', image.location);
    svgimg.setAttribute('x', image.initialPoint.x.toString());
    svgimg.setAttribute('y', image.initialPoint.y.toString());
    svgimg.setAttribute('width', image.width.toString());
    svgimg.setAttribute('height', image.width.toString());
    svgimg.setAttribute('class', 'venueBackgroundImage');
    svgimg.style.opacity = String(image.opacity / 100);
    group.appendChild(svgimg);
    const bbox = (svgimg as SVGGraphicsElement).getBBox();
    svgimg.setAttribute('transform', `rotate(${image.rotate}, ${bbox.x + (bbox.width / 2)}, ${bbox.y + (bbox.height / 2)})`);
    return svgimg as SVGGraphicsElement;


  }

  static getViewBox(element: SVGElement) {
    const value = element.getAttribute('viewBox').split(' ');
    if (!!value) {
      return new ViewBox(+value[0], +value[1], +value[2], +value[3]);
    }
    return null;
  }

  static findClosestPoint(startPoint: MousePosition, pointOne: MousePosition, pointTwo: MousePosition) {
    const distanceBPointOne = Math.round((Math.pow((pointOne.x - startPoint.x), 2) + Math.pow((pointOne.y - startPoint.y), 2)));
    const distanceBPointTwo = Math.round((Math.pow((pointTwo.x - startPoint.x), 2) + Math.pow((pointTwo.y - startPoint.y), 2)));
    if (distanceBPointOne > distanceBPointTwo) {
      return pointTwo;
    } else {
      return pointOne;
    }
  }

  static findClosestInArray(startPoint: MousePosition, pointsArray: any[]) {
    if (pointsArray.length === 1) {
      return pointsArray[pointsArray.length - 1];
    } else {
      const distance = [];
      pointsArray.forEach((points, i) => {
        const distanceBPoint = Math.sqrt((Math.pow((points.point.x - startPoint.x), 2) + Math.pow((points.point.y - startPoint.y), 2)));
        if (distanceBPoint !== 0) {
          distance.push({distance: distanceBPoint, index: i});
        }
      });
      if (distance.length > 0) {
        const closestPoint = distance.reduce((prev, curr) => prev.distance < curr.distance ? prev : curr);
        return pointsArray[closestPoint.index];
      }
      return pointsArray[pointsArray.length - 1];
    }
  }

  // static  getIntersectionOfTwoShape(shapeOne: SVGGeometryElement, shapeTwo: SVGGeometryElement) {
  //   const shapeOneLength
  // }
  static getIntersection(shape1, shape2, walls1: Wall[], walls2: Wall[]) {
    const intersectionPoints = [];
    walls1.forEach(aWall => {
      const line1: any = document.getElementById(aWall.id);
      const path1Length = line1.getTotalLength();
      walls2.forEach(bWall => {
        const line2: any = document.getElementById(bWall.id);
        const path2Length = line2.getTotalLength();
        const path2Points = [];
        for (let j = 0; j < path2Length; j++) {
          path2Points.push(line2.getPointAtLength(j));
        }
        for (let i = 0; i < path1Length; i++) {
          const point1 = line1.getPointAtLength(i);
          path2Points.forEach((point2, j) => {
            if (CommonService.pointIntersect(point1, path2Points[j])) {
              // console.log('interact');
              if (intersectionPoints.length > 0) {

                const lastPoint = intersectionPoints[intersectionPoints.length - 1].point;
                const distanceBPointTwo = Math.sqrt((Math.pow((lastPoint.x - point1.x), 2) + Math.pow((lastPoint.y - point1.y), 2)));
                if (distanceBPointTwo > 2) {
                  const intersectionPoint = new IntersectionPoint(point1, shape1, shape2, aWall, bWall);
                  intersectionPoints.push(intersectionPoint);
                }
              } else {
                const intersectionPoint = new IntersectionPoint(point1, shape1, shape2, aWall, bWall);
                intersectionPoints.push(intersectionPoint);
              }
            }
          });
        }
      });
    });
    return intersectionPoints;
  }

  static findInterSectionBetweenTwoShape(lineOne: SVGGeometryElement, lineTwo: SVGGeometryElement) {
    const intersectionPoints = [];
    const lineOneLength = lineOne.getTotalLength();
    const lineTwoLength = lineTwo.getTotalLength();
    const lineOnePoints: MousePosition[] = [];
    for (let i = 0; i < lineOneLength; i++) {
      lineOnePoints.push(lineOne.getPointAtLength(i));
    }
    for (let i = 0; i < lineTwoLength; i++) {
      const point = lineTwo.getPointAtLength(i);
      lineOnePoints.forEach((pt, j) => {
        if (CommonService.pointIntersect(point, pt)) {
          intersectionPoints.push(point);
        }
      });
    }
    return intersectionPoints;
  }
  static isShapesIntersect(shapeOne: SVGGeometryElement, shapeTwo: SVGGeometryElement) {
    const lineOneLength = shapeOne.getTotalLength();
    const lineTwoLength = shapeTwo.getTotalLength();
    const lineOnePoints: MousePosition[] = [];
    let isIntersect = false;
    for (let i = 0; i < lineOneLength; i++) {
      lineOnePoints.push(shapeOne.getPointAtLength(i));
    }
    for (let i = 0; i < lineTwoLength; i++) {
      const point = shapeTwo.getPointAtLength(i);
      const index = lineOnePoints.findIndex(pt => CommonService.pointIntersect(point, pt));
      if (index > -1) {
        isIntersect = true;
        break;
      }
    }
    return isIntersect;
  }
  static pointIntersect(p1: MousePosition, p2: MousePosition) {
    p1.x = Math.round(p1.x);
    p1.y = Math.round(p1.y);
    p2.x = Math.round(p2.x);
    p2.y = Math.round(p2.y);
    return p1.x === p2.x && p1.y === p2.y;
  }

  static createSeatsForTable(seatsGroup, seatsData: Seat[]) {
    seatsData.forEach(seat => {
      const cir = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      cir.setAttribute('cx', String(seat.centerPoint.x));
      cir.setAttribute('cy', String(seat.centerPoint.y));
      cir.setAttribute('r', (seat.radius).toString());
      cir.setAttribute('class', 'seats canDrag');
      cir.setAttribute('id', seat.id);
      if (!!seat.priceBand) {
        cir.setAttribute('fill', seat.priceBand.color);
      } else {
        cir.setAttribute('fill', seat.style.fill);
      }
      seatsGroup.appendChild(cir);
    });
  }

  static createLabelForRowAndSeats(parentElement, rowData) {
    if (!!parentElement.querySelector(`#seatRowLabel`)) {
      parentElement.querySelector(`#seatRowLabel`).remove();
      Array.from(parentElement.querySelectorAll('.seatID')).forEach((ele: any) => ele.remove());
    }
    const label = CommonService.createGroupElement(parentElement, 'seatRowLabel', 'label');
    if (!document.getElementById('shapeGroup').getAttribute('transform')) {
      label.setAttribute('display', 'none');
    }
    const rowLinePath = parentElement.parentElement.querySelector('.rowLinePath');
    const rowStartPoint = CommonService.getStartPointInPathLine(rowLinePath);
    const rowEndPoint = CommonService.getEndPointInPathLine(rowLinePath);
    const x = rowStartPoint.x - (rowData.name.length * 10);
    const tan = (rowStartPoint.y - rowEndPoint.y) / (rowStartPoint.x - rowEndPoint.x);
    const y = rowStartPoint.y - tan * (rowStartPoint.x - x);
    this.createTextElement(
      label,
      x,
      y,
      5,
      'rowId',
      'black',
      rowData.name,
      '',
    );
    rowData.seats.forEach((seat) => {
      const seatGroup = parentElement.querySelector(`#${seat.id}`);
      const x = seat.name.length < 2 ? seat.centerPoint.x - seat.radius / 3 : seat.centerPoint.x - seat.radius / 2;
      const y = seat.name.length < 2 ? seat.centerPoint.y + seat.radius / 3 : seat.centerPoint.y + seat.radius / 3;
      if (!!seatGroup) {
        const ele = this.createTextElement(
          seatGroup.parentElement,
          x,
          y,
          seat.radius,
          'seatID',
          'black',
          seat.name,
          ''
        );
      }
    });
    const seatIdElements = Array.from(document.querySelectorAll('.seatID'));
    seatIdElements.forEach((ele: any) => {
      if (!document.getElementById('shapeGroup').getAttribute('transform')) {
        ele.style.display = 'none';
      }
    });
  }

  static createSeatsForSeating(seatsGroup, seatsData: Seat[]) {
    seatsData.forEach((seat, i) => {
      const group = this.createGroupElement(seatsGroup, `seatG_${seat.id}`, 'seatGroup');
      const cir = this.createCircleElement(
        group,
        seat.centerPoint.x,
        seat.centerPoint.y,
        seat.radius,
        'seats canDrag',
        !!seat.priceBand ? seat.priceBand.color : seat.style.fill, 'none', seat.id,
      );
      cir.style.stroke = this.setLightPercentage(seat.priceBand.color, 80);
    });
  }

  static createTextElement(parenElement: SVGElement, x: number, y: number, fontSize: number,
                           attClass: string, fill = 'blue', input = '', id = null) {
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('class', attClass);
    if (id !== null) {
      text.setAttribute('id', id);
    }
    text.setAttribute('x', x.toString());
    text.setAttribute('y', y.toString());
    text.setAttribute('font-size', fontSize.toString());
    text.setAttribute('fill', fill);
    text.innerHTML = input;
    parenElement.appendChild(text);
    return text;
  }

  static getLengthOfTwoPoints(startPoint: MousePosition, endPoint: MousePosition) {
    return Math.sqrt((Math.pow((startPoint.x - endPoint.x), 2) + Math.pow((startPoint.y - endPoint.y), 2)));
  }

  static isPointsInClockWise(startPoint: MousePosition, endPoint: MousePosition) {
    return (startPoint.x - endPoint.x) + (startPoint.y - endPoint.y) < 0;
  }

  static getCircleSweepFlag(startPoint: MousePosition, endPoint: MousePosition, centerPoint: MousePosition) {
    const startAngle = 180 / Math.PI * Math.atan2(startPoint.y - centerPoint.y, startPoint.x - centerPoint.x);
    const endAngle = 180 / Math.PI * Math.atan2(endPoint.y - centerPoint.y, endPoint.x - centerPoint.x);
    const angle = endAngle - startAngle;
    return angle <= 0 ? 1 : angle <= 180 ? 0 : 1;

  }

  static CreateOuterBOX(bbox: { x: number; y: number; height: number; width: number }, element) {
    const groupouter = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const rectangle = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rectangle.setAttribute('fill', 'transparent');
    bbox.x = bbox.x - 10;
    bbox.y = bbox.y - 10;
    bbox.width = bbox.width + 20;
    bbox.height = bbox.height + 20;
    rectangle.setAttribute('x', (bbox.x).toString());
    rectangle.setAttribute('y', (bbox.y).toString());
    rectangle.setAttribute('width', (bbox.width).toString());
    rectangle.setAttribute('height', (bbox.height).toString());
    rectangle.setAttribute('class', `outerspace`);
    element.appendChild(groupouter);
    groupouter.appendChild(rectangle);
  }

  static createRectanglePathPoint(startPosition: MousePosition, currentPosition: MousePosition) {
    return [
      new PathPoint('M', startPosition.x, startPosition.y),
      new PathPoint('L', currentPosition.x, startPosition.y),
      new PathPoint('L', currentPosition.x, currentPosition.y),
      new PathPoint('L', startPosition.x, currentPosition.y),
      new PathPoint('L', startPosition.x, startPosition.y),
    ];
  }

  static checkBlocksIsInsideShape(shapeElement: SVGGeometryElement, blocksPathPoint: PathPoint[]) {
    const pointsInShapeFill = CommonService.checkPointsInFill(blocksPathPoint, shapeElement);
    return blocksPathPoint.length === pointsInShapeFill.length;
  }

  static createLinePathPoint(startPosition: MousePosition, currentPosition: MousePosition) {
    return [
      new PathPoint('M', startPosition.x, startPosition.y),
      new PathPoint('L', currentPosition.x, currentPosition.y)
    ];
  }

  static createCurveSeatsRow(startPosition: MousePosition, currentPosition: MousePosition, curveDistance: number) {
    const scaleValue = curveDistance / 10;
    const perpendicularLine = this.getPerpendicularOfLine(_.cloneDeep(startPosition), _.cloneDeep(currentPosition), scaleValue);
    return [
      new PathPoint('M', startPosition.x, startPosition.y),
      new PathPoint('Q', currentPosition.x, currentPosition.y, perpendicularLine.pointOne.x, perpendicularLine.pointOne.y),
    ];
  }

  static getPerpendicularOfLine(pointOne: MousePosition, pointTwo: MousePosition, scaleValue) {
    const centerPoint = this.getMidPointOfTwoPoints(_.cloneDeep(pointOne), _.cloneDeep(pointTwo));
    const pointsArray = [pointOne, pointTwo];
    pointsArray.forEach(point => {
      const x = point.x;
      const y = point.y;
      const tempX = x - centerPoint.x;
      const tempY = y - centerPoint.y;
      const rotatedX = tempX * Math.cos(90 * Math.PI / 180) - tempY * Math.sin(90 * Math.PI / 180);
      const rotatedY = tempX * Math.sin(90 * Math.PI / 180) + tempY * Math.cos(90 * Math.PI / 180);
      point.x = rotatedX + centerPoint.x;
      point.y = rotatedY + centerPoint.y;
      // scaling
      point.x -= centerPoint.x;
      point.y -= centerPoint.y;
      point.x *= scaleValue;
      point.y *= scaleValue;
      point.x += centerPoint.x;
      point.y += centerPoint.y;
    });
    return {pointOne, pointTwo};
  }

  static getMidPointOfTwoPoints(pointOne: MousePosition, pointTwo: MousePosition) {
    const midPoint = new SvgPoints();
    midPoint.x = (pointOne.x + pointTwo.x) / 2;
    midPoint.y = (pointOne.y + pointTwo.y) / 2;
    return midPoint;
  }

  static createSquarePathPoint(startPosition: MousePosition, currentPosition: MousePosition, lengthSquare: number) {
    let pathPoint;
    if (startPosition.x < currentPosition.x && startPosition.y < currentPosition.y) {
      pathPoint = [
        {command: 'M', x: startPosition.x, y: startPosition.y},
        {command: 'L', x: (startPosition.x + lengthSquare), y: startPosition.y},
        {command: 'L', x: (startPosition.x + lengthSquare), y: (startPosition.y + lengthSquare)},
        {command: 'L', x: startPosition.x, y: (startPosition.y + lengthSquare)},
        {command: 'L', x: startPosition.x, y: startPosition.y},

      ];
    } else if (startPosition.x > currentPosition.x && startPosition.y < currentPosition.y) {
      pathPoint = [
        {command: 'M', x: startPosition.x, y: startPosition.y},
        {command: 'L', x: (startPosition.x - lengthSquare), y: startPosition.y},
        {command: 'L', x: (startPosition.x - lengthSquare), y: (startPosition.y + lengthSquare)},
        {command: 'L', x: startPosition.x, y: (startPosition.y + lengthSquare)},
        {command: 'L', x: startPosition.x, y: startPosition.y},
      ];
    } else if (startPosition.x > currentPosition.x && startPosition.y > currentPosition.y) {
      pathPoint = [
        {command: 'M', x: startPosition.x, y: startPosition.y},
        {command: 'L', x: (startPosition.x - lengthSquare), y: startPosition.y},
        {command: 'L', x: (startPosition.x - lengthSquare), y: (startPosition.y - lengthSquare)},
        {command: 'L', x: startPosition.x, y: (startPosition.y - lengthSquare)},
        {command: 'L', x: startPosition.x, y: startPosition.y},
      ];
    } else if (startPosition.x < currentPosition.x && startPosition.y > currentPosition.y) {
      pathPoint = [
        {command: 'M', x: startPosition.x, y: startPosition.y},
        {command: 'L', x: (startPosition.x + lengthSquare), y: startPosition.y},
        {command: 'L', x: (startPosition.x + lengthSquare), y: (startPosition.y - lengthSquare)},
        {command: 'L', x: startPosition.x, y: (startPosition.y - lengthSquare)},
        {command: 'L', x: startPosition.x, y: startPosition.y},
      ];
    }
    return pathPoint;
  }

  static getSeatRowId(previousRow: SeatsRow, blockDatas: Block[]) {
    if (!previousRow) {
      return 'A';
    }
    if (!blockDatas) {
      return CommonService.findNextAlphabet(previousRow.name);
    }
    const seatsRows = [];
    blockDatas.forEach(blockData => seatsRows.push(...blockData.seatsRow));
    let rowName = 'A';
    let rowLabelSelected = false;
    while (!rowLabelSelected) {
      const index = seatsRows.findIndex(row => row.name === rowName);
      if (index > -1) {
        rowName = CommonService.findNextAlphabet(rowName);
      } else {
        rowLabelSelected = true;
        return rowName;
      }
    }
  }

  static findNextAlphabet(original: string) {
    const MIN_DIGIT = '0';
    const MAX_DIGIT = '9';
    const MIN_LETTER = 'A';
    const MAX_LETTER = 'Z';
    let buf = _.cloneDeep(original).toString();
    let i = buf.length - 1;
    const temp = _.cloneDeep(i);
    while (i >= 0) {
      let c: string = buf.charAt(i);
      c = String.fromCharCode(c.charCodeAt(0) + 1);
      if ((c.charCodeAt(0) - 1) >= MIN_LETTER.charCodeAt(0) && (c.charCodeAt(0) - 1) <= MAX_LETTER.charCodeAt(0)) {
        if (c.charCodeAt(0) > MAX_LETTER.charCodeAt(0)) {
          buf = buf.substr(0, i) + MIN_LETTER + buf.substr(i + MIN_LETTER.length);
          i--;
          continue;
        }
      } else {
        if (c.charCodeAt(0) > MAX_DIGIT.charCodeAt(0)) {
          buf = buf.substr(0, i) + MIN_DIGIT + buf.substr(i + MIN_DIGIT.length);
          i--;
          continue;
        }
      }
      buf = buf.substr(0, i) + c + buf.substr(i + c.length);
      return buf.toString();
    }
    // buf = buf.substr(0, 0) + MIN_DIGIT + buf.substr(MIN_DIGIT.length);
    if (temp === 0) {
      buf = 'A' + buf;
    }
    return buf.toString();
  }

  static createSeatsForRow(parentElement: SVGElement, pathLineElement: SVGGeometryElement, rowData: SeatsRow, priceBand: PriceBand) {
    if (!!parentElement.querySelector(`#seats-group-${rowData.id}`)) {
      parentElement.querySelector(`#seats-group-${rowData.id}`).remove();
    }
    const seats: Seat[] = [];
    const seatsGroup = this.createGroupElement(parentElement, `seats-group-${rowData.id}`, 'seats-group');
    const totalRowLength = pathLineElement.getTotalLength();
    const totalSeatCount = Math.trunc(totalRowLength / (rowData.seatsRadius * 2) + rowData.seatSpacing);
    let seatDistance = 0;
    const loopCount = _.cloneDeep(totalSeatCount);
    for (let i = 0; i < loopCount; i++) {
      const point = (pathLineElement).getPointAtLength(seatDistance);
      const seat = new Seat(
        this.generateUniqId,
        {x: point.x, y: point.y},
        (pathLineElement).getPointAtLength(0),
        (pathLineElement).getPointAtLength(totalRowLength),
        rowData.seatsRadius,
        priceBand,
      );
      seats.push(seat);
      seatDistance += rowData.seatsRadius * 2 + rowData.seatSpacing;
      if (seatDistance >= totalRowLength) {
        break;
      }
    }
    seats.forEach((seat, i) => {
      seat.name = rowData.isSeatLabelInAsc ? (i + 1).toString() : (seats.length - i).toString();
    });
    CommonService.createSeatsForSeating(seatsGroup, seats);
    rowData.seats = seats;
    this.createLabelForRowAndSeats(seatsGroup, rowData);
    return rowData;
  }

  static ascii2unicode(str) {
    let reserved = '';

    for (let i = 0; i < str.length; i++) {
      reserved += '&#' + str.charCodeAt(i) + ';';
    }
    return reserved;
  }

  static unicode2ascii(str) {
    let reserved = '';
    const code = str.match(/&#(d+);/g);

    if (code === null) {
      return str;
    }

    for (let i = 0; i < code.length; i++) {
      reserved += String.fromCharCode(code[i].replace(/[&#;]/g, ''));
    }

    return reserved;
  }

  static reAllocateSeatsInARow(parentElement: SVGElement, pathLineElement: SVGGeometryElement,
                               rowData: SeatsRow, priceBand: PriceBand, canChangePB = false) {
    const totalRowLength = pathLineElement.getTotalLength();
    // const totalSeatCount = Math.trunc(totalRowLength / (rowData.seatsRadius * 2) + rowData.seatSpacing);
    const seatGroup = parentElement.querySelector(`#seats-group-${rowData.id}`);
    if (seatGroup) {
      let seatDistance = 0;
      for (const seat of rowData.seats) {
        const point = (pathLineElement).getPointAtLength(seatDistance);
        seat.centerPoint = {x: point.x, y: point.y};
        seatDistance += rowData.seatsRadius * 2 + rowData.seatSpacing;
        const seatEL: any = parentElement.querySelector(`#${seat.id}`);
        if (canChangePB) {
          seat.priceBand = priceBand;
          seatEL.style.fill = priceBand.color;
        }
        seatEL.setAttribute('cx', point.x.toString());
        seatEL.setAttribute('cy', point.y.toString());
        if (seatDistance > totalRowLength) {
          break;
        }
      }
      CommonService.createLabelForRowAndSeats(seatGroup, rowData);
    }
    return rowData;
  }

  static translatePathPoint(pathPoint: PathPoint[], mouseMove: MousePosition) {
    pathPoint.forEach(
      (ele) => {
        if (ele.command !== 'z') {
          if (ele.command === 'Q') {
            ele.x1 += mouseMove.x;
            ele.y1 += mouseMove.y;
          }
          ele.x += mouseMove.x;
          ele.y += mouseMove.y;
        }
      }
    );
    return pathPoint;
  }

  static rotatePathPoint(pathPoint: PathPoint[], rotateAngle: number, centerPoint: MousePosition) {
    pathPoint.forEach((point) => {
      if (point.command !== 'z') {
        if (point.command === 'Q') {
          const cX = point.x1;
          const cY = point.y1;
          // translate point to origin
          const cTempX = cX - centerPoint.x;
          const cTempY = cY - centerPoint.y;
          const cRotatedX = cTempX * Math.cos(rotateAngle * Math.PI / 180) - cTempY * Math.sin(rotateAngle * Math.PI / 180);
          const cRotatedY = cTempX * Math.sin(rotateAngle * Math.PI / 180) + cTempY * Math.cos(rotateAngle * Math.PI / 180);
          // translate back
          point.x1 = cRotatedX + centerPoint.x;
          point.y1 = cRotatedY + centerPoint.y;
        }
        const x = point.x;
        const y = point.y;
        // translate point to origin
        const tempX = x - centerPoint.x;
        const tempY = y - centerPoint.y;
        const rotatedX = tempX * Math.cos(rotateAngle * Math.PI / 180) - tempY * Math.sin(rotateAngle * Math.PI / 180);
        const rotatedY = tempX * Math.sin(rotateAngle * Math.PI / 180) + tempY * Math.cos(rotateAngle * Math.PI / 180);
        // translate back
        point.x = rotatedX + centerPoint.x;
        point.y = rotatedY + centerPoint.y;
      }
    });
    return pathPoint;
  }

  static rotateTableSeats(seats, centerPoint, degree) {
    seats.forEach(seat => {
      const cX = seat.centerPoint.x;
      const cY = seat.centerPoint.y;
      const cTempX = cX - centerPoint.x;
      const cTempY = cY - centerPoint.y;
      const cRotatedX = cTempX * Math.cos(degree * Math.PI / 180) - cTempY * Math.sin(degree * Math.PI / 180);
      const cRotatedY = cTempX * Math.sin(degree * Math.PI / 180) + cTempY * Math.cos(degree * Math.PI / 180);
      seat.centerPoint.x = cRotatedX + centerPoint.x;
      seat.centerPoint.y = cRotatedY + centerPoint.y;
      const cSX = seat.sideStartPoint.x;
      const cSY = seat.sideStartPoint.y;
      const cTempSX = cSX - centerPoint.x;
      const cTempSY = cSY - centerPoint.y;
      const cRotatedSX = cTempSX * Math.cos(degree * Math.PI / 180) - cTempSY * Math.sin(degree * Math.PI / 180);
      const cRotatedSY = cTempSX * Math.sin(degree * Math.PI / 180) + cTempSY * Math.cos(degree * Math.PI / 180);
      seat.sideStartPoint.x = cRotatedSX + centerPoint.x;
      seat.sideStartPoint.y = cRotatedSY + centerPoint.y;
      const cEX = seat.sideEndPoint.x;
      const cEY = seat.sideEndPoint.y;
      const cTempEX = cEX - centerPoint.x;
      const cTempEY = cEY - centerPoint.y;
      const cRotatedEX = cTempEX * Math.cos(degree * Math.PI / 180) - cTempEY * Math.sin(degree * Math.PI / 180);
      const cRotatedEY = cTempEX * Math.sin(degree * Math.PI / 180) + cTempEY * Math.cos(degree * Math.PI / 180);
      seat.sideEndPoint.x = cRotatedEX + centerPoint.x;
      seat.sideEndPoint.y = cRotatedEY + centerPoint.y;
    });
    return seats;
  }

  static scalePathPoint(pathPoint: PathPoint[], scaleValue: MousePosition, startPoint: MousePosition) {
    pathPoint.forEach((point) => {
      if (point.command !== 'z') {
        if (point.command === 'Q') {
          point.x1 -= startPoint.x;
          point.y1 -= startPoint.y;
          point.x1 *= scaleValue.x;
          point.y1 *= scaleValue.y;
          point.x1 += startPoint.x;
          point.y1 += startPoint.y;
        }
        point.x -= startPoint.x;
        point.y -= startPoint.y;
        point.x *= scaleValue.x;
        point.y *= scaleValue.y;
        point.x += startPoint.x;
        point.y += startPoint.y;
      }
    });
    return pathPoint;
  }
}
