import {Directive, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {MousePosition} from '../../shared/models/Venue';
import {PathPoint, PriceBand, Seat, Shape, Style, SvgPoints, TableType} from '../../shared/models/Shape';
import {ShapesService} from '../../shared/services/shapes.service';
import {Subscription} from 'rxjs';
import {CommonService} from '../../shared/services/common.service';
import {ShapeType} from '../../shared/models/utils';
import * as _ from 'lodash';
import {Guid} from 'guid-typescript';

@Directive({
  selector: '[appCreateTable]'
})
export class CreateTableDirective implements OnInit, OnDestroy {
  @Input() shapeStyle = new Style('red', 'black', 1, 1);
  @Input() priceband: PriceBand;

  @Input('seatsCount')
  set seatCountChange(count) {
    this.seatsCount = count;
    setTimeout(() => {
      if (!!this.table.shape && this.tableShapeElement && this.svgElement) {
        if (!!this.table && !!this.table.seats && this.table.seats.length !== this.seatsCount) {
          const seatGroup = this.svgElement.getElementById('seatsGroup');
          seatGroup.remove();
          this.createSeats(this.tableShapeElement);
        }
      }
    }, 0);
  }

  @Input('priceband')
  set priceBandChange(priceBand) {
    if (!!priceBand) {
      setTimeout(() => {
        if (!!this.table.shape && this.tableShapeElement && this.svgElement) {
          this.tableShapeElement.setAttribute('fill', priceBand.color);
        }
      }, 0);
    }
  }

  @Input() table: TableType;
  private seatDiameter;
  private seatTableSpace = this.seatDiameter / 2 + 2;

  @Input('seatDiameter')
  set setSeatDiameter(diameter: number) {
    this.seatDiameter = !!diameter ? diameter : 20;
    this.seatTableSpace = this.seatDiameter / 2 + 2;
  }

  @Output() maxSeatCount = new EventEmitter<number>();
  @Output() tableData = new EventEmitter<TableType>();

  private seatsCount: number;
  private seatSpace = 5;
  private svgElement;
  private currentPosition = new MousePosition();
  private shape: string;
  private selectedShapeSubscription: Subscription;
  private isDrawShape = false;
  private initialCoordination: MousePosition;
  private mainShapeGrope: SVGGraphicsElement;
  private tableShapeElement: SVGGraphicsElement;
  private isSetPoint = false;
  private startDraw = false;
  private selectionGroup: SVGGraphicsElement;
  private tableShapeWalls: SVGElement[] = [];
  private dragSeatElement: SVGElement;
  private isSeatDrag = false;
  private tableBoundaryBoxGroupElement;
  private tableBoundaryBoxPathArray: PathPoint[];


  constructor(
    private elementRef: ElementRef,
    private shapesService: ShapesService,
  ) {
  }

  ngOnInit() {
    this.svgElement = this.elementRef.nativeElement;
    this.mainShapeGrope = this.svgElement.querySelector('#shapeGroup');
    this.selectedShapeSubscription = this.shapesService.selectedShape$.subscribe((shape) => {
      if (shape !== undefined) {
        this.shape = shape;
        this.isDrawShape = true;
      } else {
        this.isDrawShape = false;
      }
    });
    if (!!this.table.shape) {
      this.createShapesForTableList();
    }
  }

  ngOnDestroy() {
    this.shapesService.selectedShape$.next(undefined);
    this.selectedShapeSubscription.unsubscribe();
  }

  drawFacilityInnerBoundary() {
    this.tableBoundaryBoxGroupElement = document.getElementById('tableOuterBoundaryGroup');
    this.tableBoundaryBoxPathArray = _.cloneDeep(this.table.shape.pathArray);
    if (!!this.tableBoundaryBoxGroupElement) {
      const element = this.tableBoundaryBoxGroupElement.children[0];
      element.setAttribute('d', CommonService.buildPathString(this.table.shape.pathArray));
      this.scaleBoundaryBox(element as any, this.tableBoundaryBoxPathArray);
    } else {
      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      group.setAttribute('id', `tableOuterBoundaryGroup`);
      this.mainShapeGrope.appendChild(group);
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('id', `tableOuterBoundary${this.table.shape.shapeID}`);
      path.setAttribute('class', `tablesBoundary`);
      path.setAttribute('stroke', 'transparent');
      path.setAttribute('stroke-dasharray', '5,5');
      path.setAttribute('fill', 'none');
      path.setAttribute('d', CommonService.buildPathString(this.tableBoundaryBoxPathArray));
      group.appendChild(path);
      this.tableBoundaryBoxPathArray = this.scaleBoundaryBox(path as any, _.cloneDeep(this.tableBoundaryBoxPathArray));
    }
  }

  scaleBoundaryBox(path: SVGGeometryElement, pathPoint: PathPoint[]) {
    const boundaryBoxBBox = path.getBBox();
    const boundaryBoxCenterPoint = CommonService.getCenterPosition(path);

    const boxRadiusX = (boundaryBoxBBox.x - boundaryBoxCenterPoint.x);
    const boxRadiusY = (boundaryBoxBBox.y - boundaryBoxCenterPoint.y);
    const scalePointX = (Math.abs(boxRadiusX) + this.seatTableSpace) / Math.abs(boxRadiusX);
    const scalePointY = (Math.abs(boxRadiusY) + this.seatTableSpace) / Math.abs(boxRadiusY);
    pathPoint.forEach((point) => {
      if (point.command !== 'z') {
        if (scalePointX > 0 && scalePointY > 0) {
          point.x -= boundaryBoxCenterPoint.x;
          point.y -= boundaryBoxCenterPoint.y;
          point.x *= scalePointX;
          point.y *= scalePointY;
          point.x += boundaryBoxCenterPoint.x;
          point.y += boundaryBoxCenterPoint.y;
        }
      }
    });
    path.setAttribute('d', CommonService.buildPathString(pathPoint));
    return pathPoint;
  }

  createShapesForTableList() {
    CommonService.createShapeExistingShape(this.mainShapeGrope as any, this.table.shape);
    this.tableShapeElement = this.mainShapeGrope.querySelector('.shapes');
    this.drawFacilityInnerBoundary();
    if (!this.isSetPoint) {
      const mainGroup = this.tableShapeElement.parentElement;
      const seatsGroup = CommonService.createGroupElement(mainGroup as any, 'seatsGroup');
      CommonService.createSeatsForTable(seatsGroup, this.table.seats);
    }
    this.createTempTableWall();
    const bBox = (this.mainShapeGrope as any).getBBox();
    this.svgElement.setAttribute('viewBox', `${bBox.x - 10} ${bBox.y - 10} ${bBox.width + 10}, ${bBox.height + 10}`);
  }

  @HostListener('mousedown', ['$event'])
  mouseDown($event) {
    $event.preventDefault();
    this.currentPosition = CommonService.getMousePosition(this.svgElement, $event);
    if (this.isSetPoint) {
      this.initialCoordination = this.currentPosition;
      if ($event.target.classList.contains('PathStarter')) {
        this.customShapeDrawEnd(this.tableShapeElement);
      } else {
        const pathPoint = new PathPoint('L', this.currentPosition.x, this.currentPosition.y);
        this.drawCustomShape(this.tableShapeElement, pathPoint);
      }
    } else if (this.shape && this.isDrawShape) {
      this.initialCoordination = this.currentPosition;
      CommonService.removeChildElementFromParent(this.mainShapeGrope as any);
      const createdShape = CommonService.createPathElement(this.mainShapeGrope, this.shape);
      this.tableShapeElement = createdShape.querySelector('.shapes');
      this.startDraw = true;
      if (this.shape === ShapeType.PATH) {
        this.isSetPoint = true;
        this.table.shape = undefined;

        const pathPoint = new PathPoint('M', this.currentPosition.x, this.currentPosition.y);
        this.drawCustomShape(this.tableShapeElement, pathPoint);
      }
    }
    if ($event.target.classList.contains('canDrag') && !this.isDrawShape) {
      this.dragSeatElement = $event.target;
      this.isSeatDrag = true;
      this.tempWallVisible(this.isSeatDrag);
    }
  }

  @HostListener('mousemove', ['$event'])
  mouseMove($event) {
    $event.preventDefault();
    this.currentPosition = CommonService.getMousePosition(this.svgElement, $event);
    if (this.startDraw) {
      this.drawShape();
    }
    if (this.isSeatDrag && !!this.dragSeatElement) {
      this.startDragSeats(this.dragSeatElement, this.currentPosition);
      this.tempWallVisible(this.isSeatDrag);
    }
  }

  @HostListener('mouseup', ['$event'])
  mouseUp($event) {
    $event.preventDefault();
    this.currentPosition = CommonService.getMousePosition(this.svgElement, $event);
    if (this.isDrawShape && this.startDraw) {
      this.isDrawShape = false;
      this.startDraw = false;
      this.shape = undefined;
      this.tableShapeElement.setAttribute('fill', this.shapeStyle.fill);
      this.tableShapeElement.setAttribute('stroke', this.shapeStyle.stroke);
      const tableAttributes = (this.tableShapeElement as any).getBBox();
      if (this.table.shape.type === ShapeType.RECTANGLE) {
        this.table.attributes.length = Math.round(tableAttributes.width);
        this.table.attributes.height = Math.round(tableAttributes.height);
      } else if (this.table.shape.type === ShapeType.SQUARE) {
        this.table.attributes.length = Math.round(tableAttributes.width);
      } else if (this.table.shape.type === ShapeType.CIRCLE) {
        this.table.attributes.radius = Math.round(tableAttributes.width / 2);
      }

      if (!this.isSetPoint && !!this.tableShapeElement) {
        this.createSeats(this.tableShapeElement);
      }
      if (this.table.shape.type !== ShapeType.PATH) {
        const bBox = (this.mainShapeGrope as any).getBBox();
        this.svgElement.setAttribute('viewBox', `${bBox.x - 10} ${bBox.y - 10} ${bBox.width + 10}, ${bBox.height + 10}`);
      }
    }
    if (this.isSeatDrag) {
      if ($event.target.classList.contains('tableWall')) {
        const currentSeat = this.table.seats.find(seats => seats.id === this.dragSeatElement.id);
        const previousLine = this.tableShapeWalls.find(wall => {
          const startPoint = CommonService.getStartPointInLine(wall.children[0] as any);
          const endPoint = CommonService.getEndPointInLine(wall.children[0] as any);
          return (currentSeat.sideStartPoint.x === startPoint.x && currentSeat.sideStartPoint.y === startPoint.y)
            && (currentSeat.sideEndPoint.x === endPoint.x && currentSeat.sideEndPoint.y === endPoint.y);
        });
        if (!!previousLine && !(previousLine.children[0] === $event.target)) {
          this.removeSingleSeatFromSide(previousLine.children[0] as any);
          this.switchSeatsThrowTableWall(this.dragSeatElement, $event.target);
        } else {
          this.endSeatDragging();
        }
      } else {
        this.endSeatDragging();
      }
    }
    this.tableData.emit(this.table);
  }

  private drawShape() {
    // this.facilityShapeElement.removeAttribute('transform');
    return this.shape === ShapeType.RECTANGLE ?
      this.drawRectangle(this.tableShapeElement, this.initialCoordination, this.currentPosition) :
      this.shape === ShapeType.SQUARE ? this.drawSquare(this.tableShapeElement, this.initialCoordination, this.currentPosition) :
        this.shape === ShapeType.CIRCLE ? this.drawCircle(this.tableShapeElement, this.initialCoordination, this.currentPosition) :
          null;
  }

  private drawCustomShape(element: any, pathPoint: PathPoint) {
    this.removeSelection();
    const shape: Shape = {
      shapeID: element.id,
      pathArray: [pathPoint],
      type: ShapeType.PATH,
      style: this.shapeStyle,
      walls: [],
      isShapeGrouped: false,
      properties: undefined,
      visibility: true
    };
    if (!this.table.shape) {
      this.table.shape = shape;
    } else {
      this.table.shape.pathArray.push(pathPoint);
    }
    element.setAttribute('d', CommonService.buildPathString(this.table.shape.pathArray));
    element.setAttribute('fill', 'none');
    this.selectionGroup = CommonService.setPathPoints(this.svgElement, this.table.shape.pathArray);
  }

  private drawRectangle(tableShapeElement: Element, initialCoordination: MousePosition, currentPosition: MousePosition) {
    this.table.shape = {
      shapeID: tableShapeElement.id,
      pathArray: [
        new PathPoint('M', initialCoordination.x, initialCoordination.y),
        new PathPoint('L', currentPosition.x, initialCoordination.y),
        new PathPoint('L', currentPosition.x, currentPosition.y),
        new PathPoint('L', initialCoordination.x, currentPosition.y),
        new PathPoint('z')
      ],
      walls: [],
      isShapeGrouped: false,

      type: ShapeType.RECTANGLE,
      properties: undefined,
      style: this.shapeStyle,
      visibility: true
    };
    tableShapeElement.setAttribute('d', CommonService.buildPathString(this.table.shape.pathArray));
    tableShapeElement.setAttribute('stroke', 'black');
  }

  private drawSquare(element: Element, startPosition: MousePosition, currentPosition: MousePosition) {
    const lengthSquare = Math.sqrt(Math.pow((startPosition.x - currentPosition.x), 2)
      + Math.pow((startPosition.y - currentPosition.y), 2)) * Math.cos(45);
    if (startPosition.x < currentPosition.x && startPosition.y < currentPosition.y) {
      this.table.shape = {
        shapeID: element.id,
        pathArray: [
          {command: 'M', x: startPosition.x, y: startPosition.y},
          {command: 'L', x: (startPosition.x + lengthSquare), y: startPosition.y},
          {command: 'L', x: (startPosition.x + lengthSquare), y: (startPosition.y + lengthSquare)},
          {command: 'L', x: startPosition.x, y: (startPosition.y + lengthSquare)},
          {command: 'z'}
        ],
        walls: [],
        isShapeGrouped: false,

        type: ShapeType.SQUARE,
        style: this.shapeStyle,
        properties: undefined,
        visibility: true

      };
    } else if (startPosition.x > currentPosition.x && startPosition.y < currentPosition.y) {
      this.table.shape = {
        shapeID: element.id,
        pathArray: [
          {command: 'M', x: startPosition.x, y: startPosition.y},
          {command: 'L', x: (startPosition.x - lengthSquare), y: startPosition.y},
          {command: 'L', x: (startPosition.x - lengthSquare), y: (startPosition.y + lengthSquare)},
          {command: 'L', x: startPosition.x, y: (startPosition.y + lengthSquare)},
          {command: 'z'}
        ],
        isShapeGrouped: false,

        walls: [],
        type: ShapeType.SQUARE,
        style: this.shapeStyle,

        properties: undefined,
        visibility: true


      };
    } else if (startPosition.x > currentPosition.x && startPosition.y > currentPosition.y) {
      this.table.shape = {
        shapeID: element.id,
        pathArray: [
          {command: 'M', x: startPosition.x, y: startPosition.y},
          {command: 'L', x: (startPosition.x - lengthSquare), y: startPosition.y},
          {command: 'L', x: (startPosition.x - lengthSquare), y: (startPosition.y - lengthSquare)},
          {command: 'L', x: startPosition.x, y: (startPosition.y - lengthSquare)},
          {command: 'z'}
        ],
        isShapeGrouped: false,

        walls: [],

        type: ShapeType.SQUARE,
        style: this.shapeStyle,

        properties: undefined,
        visibility: true


      };
    } else if (startPosition.x < currentPosition.x && startPosition.y > currentPosition.y) {
      this.table.shape = {
        shapeID: element.id,
        pathArray: [
          {command: 'M', x: startPosition.x, y: startPosition.y},
          {command: 'L', x: (startPosition.x + lengthSquare), y: startPosition.y},
          {command: 'L', x: (startPosition.x + lengthSquare), y: (startPosition.y - lengthSquare)},
          {command: 'L', x: startPosition.x, y: (startPosition.y - lengthSquare)},
          {command: 'z'}
        ],
        isShapeGrouped: false,

        walls: [],

        type: ShapeType.SQUARE,
        style: this.shapeStyle,

        properties: undefined,
        visibility: true

      };
    }
    if (!!this.table.shape) {
      element.setAttribute('d', CommonService.buildPathString(this.table.shape.pathArray));
      element.setAttribute('stroke', 'black');
    }

  }

  private drawCircle(element: Element, startPosition: MousePosition, currentPosition: MousePosition) {
    const radius = new SvgPoints();
    radius.x = radius.y = CommonService.getLengthOfTwoPoints(startPosition, currentPosition);
    const start = CommonService.circle(startPosition.x, startPosition.y, radius, 359);
    const end = CommonService.circle(startPosition.x, startPosition.y, radius, 0);
    this.table.shape = {
      shapeID: element.id,
      properties: undefined,
      type: ShapeType.CIRCLE,
      style: this.shapeStyle,
      walls: [],
      isShapeGrouped: false,

      pathArray: [
        {command: 'M', x: start.x, y: start.y},
        {command: 'A', arcRadiusX: radius.x, arcRadiusY: radius.y, xAxisRotation: 0, largeArcFlag: 1, sweepFlag: 0, x: end.x, y: end.y},
        {command: 'z'}
      ],
      visibility: true
    };
    element.setAttribute('d', CommonService.buildPathString(this.table.shape.pathArray));
    element.setAttribute('stroke', 'black');
  }

  private customShapeDrawEnd(element: any) {
    this.isSetPoint = false;
    this.shape = undefined;
    this.table.shape.pathArray.push({command: 'z'});
    element.setAttribute('d', CommonService.buildPathString(this.table.shape.pathArray));
    element.setAttribute('fill', this.shapeStyle.fill);
    element.setAttribute('stroke', this.shapeStyle.stroke);
    this.isDrawShape = false;
    this.removeSelection();
    this.createSeats(element);
    const bBox = (this.mainShapeGrope as any).getBBox();
    this.svgElement.setAttribute('viewBox', `${bBox.x - 10} ${bBox.y - 10} ${bBox.width + 10}, ${bBox.height + 10}`);
  }

  private removeSelection() {
    if (this.selectionGroup) {
      this.selectionGroup.remove();
    }
  }

  private createSeats(tableShapeElement: Element) {
    let longAreaOfTable = 0;
    this.drawFacilityInnerBoundary();
    const totalTableLength = (tableShapeElement as any).getTotalLength();
    const mainGrope = tableShapeElement.parentElement;
    const seatsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    seatsGroup.setAttribute('id', 'seatsGroup');
    mainGrope.appendChild(seatsGroup);
    this.createTempTableWall();
    let maxSeat = 0;
    this.table.seats = [];
    this.tableShapeWalls.forEach(line => {
      const startPoint = CommonService.getStartPointInLine(line.children[0] as any);
      const endPoint = CommonService.getEndPointInLine(line.children[0] as any);
      const length = Math.round(CommonService.getLengthOfTwoPoints(startPoint, endPoint) - this.seatTableSpace * 2);
      longAreaOfTable = longAreaOfTable <= length ? length : longAreaOfTable;
      maxSeat += Math.trunc(length / (this.seatDiameter + this.seatSpace));
    });
    if (!(this.table.shape.type === ShapeType.CIRCLE)) {
      this.maxSeatCount.emit(maxSeat);
    } else {
      maxSeat = Math.floor((totalTableLength) / (this.seatDiameter * 2));
      this.maxSeatCount.emit(maxSeat);
    }
    let lineCount = 0;
    let loopCount = _.cloneDeep(this.seatsCount);
    for (let i = 0; i < loopCount; i++) {
      let point = new SvgPoints();
      const startPoint = CommonService.getStartPointInLine(this.tableShapeWalls[lineCount].children[0] as any);
      const endPoint = CommonService.getEndPointInLine(this.tableShapeWalls[lineCount].children[0] as any);
      if (!(this.table.shape.type === ShapeType.CIRCLE)) {
        const length = Math.round(CommonService.getLengthOfTwoPoints(startPoint, endPoint) - this.seatTableSpace * 2);
        const existingSeats = this.table.seats.filter(x =>
          _.isEqual(x.sideStartPoint, startPoint) && _.isEqual(x.sideEndPoint, endPoint)
        );
        if (existingSeats.length === 0) {
          if (length >= longAreaOfTable) {
            point = (this.tableShapeWalls[lineCount].children[0] as any).getPointAtLength(this.seatTableSpace + (length / 2));
            const seat = new Seat(
              Guid.create().toString(),
              {x: point.x, y: point.y},
              startPoint,
              endPoint,
              this.seatDiameter / 2,
              undefined,

              _.cloneDeep(this.shapeStyle),
            );
            seat.style.fill = '#fffff';
            this.table.seats.push(seat);
          } else {
            loopCount++;
          }
        } else {
          const totalSeatCountInSide = existingSeats.length + 1;
          const maxSeatOnALine = Math.trunc(length / (this.seatDiameter + this.seatSpace));
          if (length >= longAreaOfTable) {
            if (maxSeatOnALine === existingSeats.length) {
              longAreaOfTable = 0;
              loopCount++;
            } else {
              existingSeats.forEach(seat => {
                const seatIndex = this.table.seats.findIndex(x => x.id === seat.id);
                this.table.seats.splice(seatIndex, 1);
              });
              this.createSeatOnSide(this.tableShapeWalls[lineCount].children[0], totalSeatCountInSide, startPoint, endPoint);
            }
          } else {
            loopCount++;
          }

        }
        lineCount++;
      } else {
        const distanceForCircleTable = Math.trunc(i / this.seatsCount * totalTableLength);
        point = (tableShapeElement as any).getPointAtLength(distanceForCircleTable);
        const seat = new Seat(
          Guid.create().toString(),
          {x: point.x, y: point.y},
          startPoint,
          endPoint,
          this.seatDiameter / 2,
          undefined,
          _.cloneDeep(this.shapeStyle),
        );
        seat.style.fill = '#fffff';
        this.table.seats.push(seat);
      }
      if (lineCount === this.tableShapeWalls.length) {
        lineCount = 0;
      }
    }
    CommonService.createSeatsForTable(seatsGroup, this.table.seats);
  }

  private createTempTableWall() {
    let wallGroup = this.svgElement.getElementById('wallGroup');
    if (!!wallGroup) {
      this.tableShapeWalls.forEach(ele => {
        ele.remove();
      });
    } else {
      wallGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      wallGroup.setAttribute('id', 'wallGroup');
    }
    this.tableShapeElement.parentElement.appendChild(wallGroup);
    this.tableShapeWalls = CommonService.createLinesForPath(this.tableBoundaryBoxPathArray, wallGroup as any);
    this.tempWallVisible();
  }

  private tempWallVisible(visible = false) {
    const wallGroup = this.svgElement.getElementById('wallGroup');
    if (!!wallGroup) {
      if (visible) {
        wallGroup.style.display = 'block';
      } else {
        wallGroup.style.display = 'none';
      }
    }
  }

  private startDragSeats(dragSeatElement: SVGElement, currentPosition: MousePosition) {
    const initialPoint = CommonService.getCirclePoint(this.dragSeatElement as any);
    if (dragSeatElement) {
      const x = (currentPosition.x - initialPoint.x);
      const y = (currentPosition.y - initialPoint.y);
      dragSeatElement.setAttribute('transform', `translate(${x}, ${y})`);
    }
  }

  private switchSeatsThrowTableWall(dragSeatElement: SVGElement, target: SVGElement) {
    const targetStartPoint = CommonService.getStartPointInLine(target as any);
    const targetEndPoint = CommonService.getEndPointInLine(target as any);
    const existingSeats = this.table.seats.filter(x =>
      (x.sideStartPoint.x === targetStartPoint.x && x.sideStartPoint.y === targetStartPoint.y)
      && (x.sideEndPoint.x === targetEndPoint.x && x.sideEndPoint.y === targetEndPoint.y)
    );
    const length = CommonService.getLengthOfTwoPoints(targetStartPoint, targetEndPoint) - this.seatTableSpace * 2;
    const maxSeatOnALine = Math.trunc(length / (this.seatDiameter + this.seatSpace));
    const totalSeatCount = existingSeats.length + 1;

    if (totalSeatCount > maxSeatOnALine) {
      this.endSeatDragging();
    } else {
      const seatGroup = this.svgElement.getElementById('seatsGroup');
      CommonService.removeChildElementFromParent(seatGroup);
      existingSeats.forEach(seat => {
        const seatIndex = this.table.seats.findIndex(x => x.id === seat.id);
        this.table.seats.splice(seatIndex, 1);
      });
      this.createSeatOnSide(target, totalSeatCount, targetStartPoint, targetEndPoint);
      CommonService.createSeatsForTable(seatGroup, this.table.seats);
      this.endSeatDragging();
    }
  }

  private removeSingleSeatFromSide(target: SVGElement) {
    const targetStartPoint = CommonService.getStartPointInLine(target as any);
    const targetEndPoint = CommonService.getEndPointInLine(target as any);
    const existingSeats = this.table.seats.filter(x =>
      (x.sideStartPoint.x === targetStartPoint.x && x.sideStartPoint.y === targetStartPoint.y)
      && (x.sideEndPoint.x === targetEndPoint.x && x.sideEndPoint.y === targetEndPoint.y)
    );
    console.log(existingSeats);
    const length = CommonService.getLengthOfTwoPoints(targetStartPoint, targetEndPoint) - this.seatTableSpace * 2;
    const totalSeatCount = existingSeats.length - 1;
    existingSeats.forEach(seat => {
      const seatIndex = this.table.seats.findIndex(x => x.id === seat.id);
      console.log(seatIndex);
      this.table.seats.splice(seatIndex, 1);
    });
    this.createSeatOnSide(target, totalSeatCount, targetStartPoint, targetEndPoint);
  }

  private endSeatDragging() {
    this.dragSeatElement.removeAttribute('transform');
    this.isSeatDrag = false;
    this.dragSeatElement = undefined;
    this.tempWallVisible(this.isSeatDrag);
  }

  private createSeatOnSide(target, totalSeatCount, startPoint, endPoint) {
    const length = CommonService.getLengthOfTwoPoints(startPoint, endPoint) - this.seatTableSpace * 2;
    let distanceStart = this.seatTableSpace;
    const equalDis = length / totalSeatCount;
    let point;
    for (let j = 0; j < totalSeatCount; j++) {
      if (j === 0) {
        distanceStart += equalDis / 2;
      } else {
        distanceStart += equalDis;
      }
      point = (target as any).getPointAtLength(distanceStart);
      const seat = new Seat(
        Guid.create().toString(),
        {x: point.x, y: point.y},
        startPoint,
        endPoint,
        this.seatDiameter / 2,
        undefined,
        _.cloneDeep(this.shapeStyle),
      );
      seat.style.fill = '#fffff';
      this.table.seats.push(seat);
    }
  }
}
