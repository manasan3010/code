import { Directive, ElementRef, HostListener, Input, OnInit, EventEmitter, Output } from '@angular/core';
import {
  MousePosition
}
  from '../models/Venue';
import * as _ from 'lodash';
import {
  CommonService
}
  from '../services/common.service';

import {
  SettingsService
}
  from '../services/settings.service';
import {
  SvgPoints, Style, Facility, PathPoint, Shape, AllocatedTable, Config, TableType, PriceBand
}
  from '../models/Shape';
import {
  ShapeType, TableModelType
}
  from '../models/utils';
import {
  Guid
}
  from 'guid-typescript';
import {
  Setting
}
  from '../models/SettingModel';

import {
  MatDialog
}
  from '@angular/material';
import { style } from '@angular/animations';
import { ToastrService } from 'ngx-toastr';
import { ChangeDetectorRef } from '@angular/core';
import { TableService } from '../../table-plan/services/table.service';
import { CreateAndEditTableModalComponent } from '../../table-plan/components/modals/create-and-edit-table-modal/create-and-edit-table-modal.component';

@Directive({
  selector: '[appTableArrangement]'
})

export class TableArrangementDirective implements OnInit {
  @Input() facility: Facility;
  @Input() config: Config;
  @Output() isloading = new EventEmitter<boolean>();

  @Output() selectedTabledetails = new EventEmitter<AllocatedTable[]>();
  // @Output() updatedTableDetails = new EventEmitter<AllocatedTable[]>();
  @Output() angle = new EventEmitter<number>();
  private mainSvg: any;
  private mainGroup: any;
  private settings: Setting;
  private tempTable: HTMLElement;
  private tempTableDetails: AllocatedTable = new AllocatedTable();
  private testTableDetails: AllocatedTable = new AllocatedTable();
  private selectedTables = [];
  // Boolean
  isDeleteTempTable = false;
  isMultipleSelection: boolean;
  isMouseDown = false;
  isClickedOnOuterspace = false;
  isRotate = false;
  isMinimumFound = false;
  mouseMove = false;
  // MousePositions
  private currentPosition = new MousePosition();
  private startPosition = new MousePosition();
  allocatedDistance: MousePosition = new MousePosition();
  rotateStartPoint: MousePosition;
  // SVGElement
  editIcon: SVGImageElement;
  tempgroup: SVGGElement;
  rotationIconGroup: SVGGElement;
  path1: SVGPathElement;
  path2: SVGPathElement;
  testTable: SVGGElement;

  tableGroup: any;
  selectedTableInfo: any;
  availableCount = 0;
  allocateTableCount = 0;
  minimumHeight = 100000;
  rotateAngle: number;
  path3: any;
  shapeArray = [];

  constructor(public elementRef: ElementRef, private settingService: SettingsService,
              private dialog: MatDialog, private tableService: TableService, public toastR: ToastrService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.mainSvg = this.elementRef.nativeElement;
    this.mainGroup = this.mainSvg.getElementById('shapeGroup');
    this.settingService.setting$.subscribe((setting) => {
      this.settings = setting;
      setTimeout(() => {
        this.drawFacilityInnerBoundry();
      }, 0);
      this.setTableSpace();
    });
    setTimeout(() => {
      if (this.getLocalStoreData()) {
        const config = JSON.parse(localStorage.getItem('configTables'));
        if (config.facilityId === this.facility.id) {
          this.createAllocatedTable(config.tables);
        }
      }
    }, 0);
    this.tableService.getAllocatedTable$.subscribe((editedTable: AllocatedTable) => {
      setTimeout(() => {

        if (editedTable) {
          const tableGroups = Array.from(this.mainGroup.querySelectorAll('.tableGroup'));
          this.tableGroup = tableGroups.find((t) => (t as any).getAttribute('id') === editedTable.id);

          const selectedTable = this.config.tables.find((t) => t.id === editedTable.id);
          if (this.tableGroup) {
            const tableshape = (this.tableGroup as any).querySelector('.tables');
            const seat = (this.tableGroup as any).querySelector('.seats');
            // const tableShape=( this.tableGroup  as any).querySelector('.tables');
            const seats = (this.tableGroup as any).querySelectorAll('.seats');
            const label = (this.tableGroup as any).querySelector('.label');
            tableshape.setAttribute('fill', editedTable.priceBand.color);
            if (this.lightOrDark(editedTable.priceBand.color) === 'light') {
              label.setAttribute('fill', 'black');
            } else {
              label.setAttribute('fill', 'white');
            }
            label.setAttribute('textContent', editedTable.name);
            if (editedTable.rotatedAngle !== selectedTable.rotatedAngle) {
              this.rotateAngle = editedTable.rotatedAngle - selectedTable.rotatedAngle;

              const index = this.config.tables.indexOf(selectedTable);
              if (index > -1) {
                const drag = new MousePosition();
                drag.x = 0;
                drag.y = 0;
                if (this.checkRotationAllCorrect(this.selectedTables)) {
                  const centerPoint = CommonService.getCenterPosition(this.tableGroup as any);
                  editedTable.tableShape.pathArray = CommonService.rotatePathPoint(editedTable.tableShape.pathArray,
                    this.rotateAngle, centerPoint);
                  // this.rotateTableShape(editedTable, centerPoint, tableshape, seats);
                  // console.log('rotatd angle changes in directive',editedTable.rotatedAngle,selectedTable.rotatedAngle, this.rotateAngle);
                  editedTable.seats = CommonService.rotateTableSeats(editedTable.seats, centerPoint, this.rotateAngle);
                  this.editTableElement(editedTable, this.tableGroup, seat.parentElement, index, seats);
                  this.config.tables[index] = editedTable;
                  this.config.tables[index].rotatedAngle = this.rotateAngle + selectedTable.rotatedAngle;
                  this.refreshSelectedInformation(this.config);
                  this.tableService.updateLocalStore(this.config);
                } else {
                  this.toastR.clear();
                  this.toastR.error('Table is Overlapping with other Table for this angle');
                }


              }
            }


          }
        }
      }, 0);
    });
  }

  @HostListener('click', ['$event'])
  onClick($event) {

    if (this.isOuterspace($event)) {
      this.selectSingleTable($event);
      this.refreshSelectedInformation(this.config);
    }

  }

  @HostListener('dragenter', ['$event'])
  onDragEnter($event) {
    $event.preventDefault();
    if (this.selectedTableInfo && this.selectedTableInfo.draggable) {
      this.createTempTable();
      this.selectedTableInfo.draggable = false;
      this.isDeleteTempTable = true;
      this.selectedTables = [];
    }
  }

  @HostListener('dragover', ['$event'])
  onDragOver($event) {
    $event.preventDefault();
    this.cd.detach();
    this.showBoundary(true);
    if (this.selectedTableInfo) {
      this.dragAndMoveTable($event, this.tempTable, 'drag', this.tempTableDetails);
    }
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave($event) {
    this.showBoundary(false);
  }

  @HostListener('drop', ['$event'])
  onDrop($event) {
    event.preventDefault();
    this.cd.reattach();
    this.showBoundary(false);
    const tableGroups = Array.from(this.mainGroup.querySelectorAll('.tableGroup'));
    tableGroups.forEach(tableGroup => {
      this.showIcons(tableGroup, false);
    });

    if (this.selectedTableInfo) {
      this.removeInnerTableBoundry(this.tempTable);
      this.isDeleteTempTable = false;
      const drag = new MousePosition();
      const startPoint = (this.tempTable as any).getBBox();
      drag.x = this.currentPosition.x - (startPoint.x + startPoint.width / 2);
      drag.y = this.currentPosition.y - (startPoint.y + startPoint.height / 2);
      if (this.checkAreaAvailable((this.tempTable as any), drag, this.tempTableDetails, 'drop')) {
        this.storeTableDetails([this.tempTableDetails]);
        this.setPosition($event, this.tempTable, this.tempTableDetails, 'drag');
        this.tempTable.setAttribute('id', this.tempTableDetails.id);
      } else {
        this.tempTable.remove();
        this.toastR.error('this Area is unaivailable');
      }
      this.deSelectAll();
    }
    this.selectedTableInfo = null;
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown($event) {
    this.isMouseDown = true;
    this.isMultipleSelection = $event.ctrlKey;
    this.startPosition = CommonService.getMousePosition(this.mainGroup, $event);
    this.isClickedOnOuterspace = this.isOuterspace($event);
    this.isRotate = this.isClickedRotate($event);
    if (this.isRotate) {
      this.rotateStartPoint = this.getRotationPoint();
    }
    const tableGroups = this.mainGroup.querySelectorAll('.tableGroup');
    if (this.isClickedOnOuterspace) {
      if (!this.isClickedOnSelectedTable($event)) {
        this.selectSingleTable($event);

        this.refreshSelectedInformation(this.config);
      }
    } else if (this.isRotate) {
      this.showBoundary(true);
      tableGroups.forEach(tableGroup => {
        this.showIcons(tableGroup, false);
      });
    } else {
      this.drawMultipleSelectionBox();
    }
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove($event) {
    this.mouseMove = true;
    if (this.isMouseDown && !$event.altKey) {
      this.currentPosition = CommonService.getMousePosition(this.mainGroup, $event);
      if (this.isClickedOnOuterspace && !this.isRotate) {
        this.showBoundary(true);
        this.selectedTables.forEach(table => {
          const allocatedTable = this.config.tables.find((elem) => elem.id === table.getAttribute('id'));
          this.dragAndMoveTable($event, table, 'move', allocatedTable);
          this.showIcons(table, false);
        });
        this.mainSvg.setAttribute('cursor', 'all-scroll');
      } else if (this.isRotate && this.isMouseDown && (this.startPosition.x !== this.currentPosition.x)
        && (this.startPosition.y !== this.currentPosition.y)) {
        this.showBoundary(true);
        this.rotateAngle = CommonService.getRotationAngle(this.startPosition, this.currentPosition, this.rotateStartPoint);
        if (this.rotateAngle >= 360) {
          this.rotateAngle = this.rotateAngle - 360;
        }
        this.angle.emit(this.rotateAngle);
        this.selectedTables.forEach(tableGroup => {
          this.startRotate(tableGroup);
        });
        this.mainSvg.setAttribute('cursor', 'alias');

      } else if ((this.startPosition.x !== this.currentPosition.x) && (this.startPosition.y !== this.currentPosition.y) && !this.isRotate) {
        const selectionRect = this.mainSvg.querySelector('.selectionArea');
        this.currentPosition = CommonService.getMousePosition(this.mainGroup, $event);
        this.drawSelectionBox(this.startPosition, this.currentPosition, selectionRect);
        this.mainSvg.setAttribute('cursor', 'crosshair');
      }
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp($event) {
    this.mainSvg.setAttribute('cursor', 'auto');
    this.currentPosition = CommonService.getMousePosition(this.mainGroup, $event);
    const tableArray = this.mainSvg.querySelectorAll('.outerspace');
    if (this.isClickedtoDelete($event)) {
      this.deleteTables();
    } else if (this.isMouseDown && !this.isClickedOnOuterspace && !this.isRotate) {
      const selectionRect = this.mainSvg.querySelector('.selectionArea');
      this.selectMultipleTable(tableArray, selectionRect);
      const groupBBox = this.tempgroup.getBBox();
      const startPoint = CommonService.createSVGPoint({
        x: groupBBox.x,
        y: groupBBox.y
      });
      const endPoint = CommonService.createSVGPoint({
        x: (groupBBox.x + groupBBox.width),
        y: (groupBBox.y + groupBBox.height)
      });
      this.drawSelectionBox(startPoint, endPoint, selectionRect);
      if (selectionRect) {
        (selectionRect as any).remove();
      }
    } else if (this.isMouseDown && this.isRotate) {
      this.selectedTables.forEach(table => {
        this.showIcons(table, true);
        table.removeAttribute('transform');
        table.setAttribute('opacity', '1');
        if ((this.currentPosition.x !== this.startPosition.x) && (this.currentPosition.y !== this.startPosition.y) && this.mouseMove) {
          this.endRotate(table);

        }

      });

    } else {
      if (this.checkAllCorrect(this.selectedTables, $event) && this.mouseMove && !this.isRotate) {
        this.selectedTables.forEach(tableGroup => {
          const id = (tableGroup as any).getAttribute('id');
          const allocatedTable = this.config.tables.find((elem) => elem.id === id);
          this.setPositionForMove(tableGroup, $event, allocatedTable);
          this.refreshSelectedInformation(this.config);
          this.showIcons(tableGroup, true);
        });
      } else {
        this.selectedTables.forEach(table => {
          table.removeAttribute('transform');
          this.appendBackTables(table);
          this.showIcons(table, true);
        });
      }
    }

    this.isMouseDown = false;
    // this.hideValidation();
    this.showBoundary(false);
    this.mouseMove = false;
    this.isRotate = false;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Delete') {
      this.deleteTables();
    }
  }

  @Input('deleteTable')
  set deleteTable(table) {
    if (this.isDeleteTempTable) {
      this.tempTable.remove();
    }
  }

  @Input('updateTableInfo')
  set updateTableInfo(table) {
    if (table) {
      const tableGroups = this.mainGroup.querySelectorAll('.tableGroup');
      const newArray = Array.from(tableGroups);
      const tableGroup = newArray.find((tables) => (tables as any).getAttribute('id') === table.tableID);
      const tableshape = (tableGroup as any).querySelector('.tables');
      const label = (tableGroup as any).querySelector('.label');
      tableshape.setAttribute('fill', table.priceband.color);
      const tableelem = this.config.tables.find((elem) => elem.id === table.tableID);
      const index = this.config.tables.indexOf(tableelem);
      if (index > -1) {
        this.config.tables[index].priceBand = table.priceband;
      }
      const id = this.config.tables.find((elem) => elem.name === table.name);
      if (id === undefined) {
        this.config.tables[index].name = table.name;
        label.textContent = table.name;
      }
      this.tableService.updateLocalStore(this.config);
    }
  }

  @Input('tablesType')
  set tablesType(types: TableType[]) {
    if (types) {
      const outerspaces = this.mainSvg.querySelectorAll('.outerspace');
      const tables = Array.from(outerspaces);
      this.deSelectAll();
      tables.forEach(outerspace => {
        (outerspace as any).setAttribute('stroke', 'none');
      });
      const tableArray = Array.from(types);
      this.selectedTables = [];
      tableArray.forEach(table => {
        const tableGroup = document.getElementById(table.id);
        const outerspace = tableGroup.querySelector('.outerspace');
        outerspace.setAttribute('stroke', 'black');
        this.addFromSelection((outerspace as any));

        this.showIcons(tableGroup, true);
      });
      this.refreshSelectedInformation(this.config);
    }

  }

  @Input('selectedTableInfo')
  set allocateTable(inputValue) {

    setTimeout(() => {
      this.isloading.emit(true);
      this.selectedTableInfo = _.cloneDeep(inputValue);
      if (this.selectedTableInfo && !this.selectedTableInfo.draggable) {
        const existingBoundryBoxs = this.mainGroup.querySelectorAll('.wallBoundry');
        this.allocateTableCount = 0;
        existingBoundryBoxs.forEach(boundary => {
          this.testTable = this.createTestTable();
          this.availableCount = this.selectedTableInfo.cover - this.allocateTableCount;
          this.autoArrangeTable(this.availableCount, boundary);
          this.testTable.remove();
        });
      }

      this.isloading.emit(false);

    }, 0);

  }

  drawFacilityInnerBoundry() {
    const existingBoundryBoxGroup = document.getElementById('facilityInnerBoundryGroup');
    if (!!existingBoundryBoxGroup) {
      this.facility.shapes.forEach(shape => {
        const facility = document.getElementById(shape.shapeID);
        const element = facility.parentElement.querySelector('.wallBoundry');
        if (!!element) {
          element.setAttribute('d', CommonService.buildPathString(shape.pathArray));
          this.scaleBoundryBox(element as any, _.cloneDeep(shape));
        }
      });
    } else {

      this.facility.shapes.forEach(shape => {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('id', `facilityInnerBoundryGroup`);
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('id', `facilityInnerBoundry${shape.shapeID}`);
        path.setAttribute('class', 'wallBoundry');
        path.setAttribute('stroke', 'none');
        path.setAttribute('stroke-dasharray', '5,5');
        path.setAttribute('fill', 'transparent');
        path.setAttribute('d', CommonService.buildPathString(shape.pathArray));
        group.appendChild(path);
        this.mainSvg.getElementById(shape.shapeID).parentElement.appendChild(group);
        this.scaleBoundryBox(path as any, _.cloneDeep(shape));
      });
    }
  }

  scaleBoundryBox(path: SVGGeometryElement, shape: Shape) {
    const boundryBoxBBox = path.getBBox();
    const boundryBoxCenterPoint = CommonService.getCenterPosition(path);
    const boxRadiusX = (boundryBoxBBox.x - boundryBoxCenterPoint.x);
    const boxRadiusY = (boundryBoxBBox.y - boundryBoxCenterPoint.y);
    const scalePointX = (Math.abs(boxRadiusX) - this.settings.wallTableSpace) / Math.abs(boxRadiusX);
    const scalePointY = (Math.abs(boxRadiusY) - this.settings.wallTableSpace) / Math.abs(boxRadiusY);
    const pathPoint = this.getWallPath(shape, boundryBoxCenterPoint, scalePointX, scalePointY);
    path.setAttribute('d', CommonService.buildPathString(pathPoint));
  }

  setTableSpace() {
    const tableGroups = this.mainSvg.querySelectorAll('.tableGroup');
    tableGroups.forEach(tableGroup => {
      const table = tableGroup.querySelector('.tables');
      const tableSpace = tableGroup.querySelector('.tableSpace');
      const tableCenterPoint = CommonService.getCenterPosition(tableGroup);
      const scalePointX = 1 + (this.settings.tableTableSpace / 20);
      const allocatedTable = this.config.tables.find((elem) => elem.id === tableGroup.getAttribute('id'));
      let pathArray = _.cloneDeep(allocatedTable.tableShape.pathArray);
      const points = pathArray.find((point) => point.command === 'A');
      const spoints = pathArray.find((point) => point.command === 'M');
      if (allocatedTable.tableType.shape.type === 'Circle' || allocatedTable.tableType.shape.type === 'Oval') {
        const startPoint = tableCenterPoint;
        const currentPosition = new MousePosition();
        currentPosition.x = spoints.x + this.settings.tableTableSpace + points.arcRadiusX;
        currentPosition.y = spoints.y + this.settings.tableTableSpace + points.arcRadiusY;
        pathArray = this.drawCircleBoundary(startPoint, currentPosition, currentPosition);
      } else {
        pathArray.forEach((point) => {
          if (point.command !== 'z') {
            point.x -= tableCenterPoint.x;
            point.y -= tableCenterPoint.y;
            point.x *= scalePointX;
            point.y *= scalePointX;
            point.x += tableCenterPoint.x;
            point.y += tableCenterPoint.y;
          }
        });
      }

      (tableSpace as any).setAttribute('d', CommonService.buildPathString(pathArray));
    });
  }


  editTable() {
    const selectedTableInfo = [];
    this.selectedTables.forEach(table => {
      const config = this.config.tables.find((elem) => elem.id === table.getAttribute('id'));
      selectedTableInfo.push(config);
    });
    if (selectedTableInfo) {
      this.onEditTable(selectedTableInfo);
    }

  }


  drawMultipleSelectionBox() {
    const groupOuter = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const rectangle = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rectangle.setAttribute('fill', 'transparent');
    rectangle.setAttribute('class', `selectionArea`);
    rectangle.setAttribute('stroke', `#4bb3fa`);
    groupOuter.appendChild(rectangle);
    const wallBoundary = document.getElementById('shapeGroup');
    wallBoundary.append(groupOuter);
  }

  drawSelectionBox(startPoint, endPoint, rectangle) {
    const startx = Math.min(startPoint.x, endPoint.x);
    const starty = Math.min(startPoint.y, endPoint.y);
    const width = Math.abs(endPoint.x - startPoint.x);
    const height = Math.abs(endPoint.y - startPoint.y);
    rectangle.setAttribute('x', (startx).toString());
    rectangle.setAttribute('y', (starty).toString());
    rectangle.setAttribute('width', (width).toString());
    rectangle.setAttribute('height', (height).toString());
  }

  selectMultipleTable(tableArray, rect) {
    this.tempgroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const newArray = Array.from(tableArray);
    const tableBBox1 = (rect as any).getBBox();
    const tableTopLeft1 = (this.mainSvg as any).createSVGPoint();
    tableTopLeft1.x = tableBBox1.x;
    tableTopLeft1.y = tableBBox1.y;
    const tableBottomRight1 = (this.mainSvg as any).createSVGPoint();
    tableBottomRight1.x = tableBBox1.x + tableBBox1.width;
    tableBottomRight1.y = tableBBox1.y + tableBBox1.height;
    newArray.forEach(table => {
      const tableBBox2 = (table as any).getBBox();
      const tableTopLeft2 = (this.mainSvg as any).createSVGPoint();
      tableTopLeft2.x = tableBBox2.x + 10;
      tableTopLeft2.y = tableBBox2.y + 10;
      const tableBottomRight2 = (this.mainSvg as any).createSVGPoint();
      tableBottomRight2.x = tableBBox2.x + tableBBox2.width - 20;
      tableBottomRight2.y = tableBBox2.y + tableBBox2.height - 20;
      if ((this.doOverlap(tableTopLeft1, tableTopLeft2, tableBottomRight1, tableBottomRight2))) {
        (table as any).setAttribute('stroke', 'black');
        if (!(this.selectedTables.find((t) => t.getAttribute('id') === ((table as any).parentElement).getAttribute('id')))) {
          this.addFromSelection((table as any));
          this.showIcons((table as any).parentElement, true);
        }
      } else if (!this.isMultipleSelection) {
        (table as any).setAttribute('stroke', 'none');
        this.removeFromSelection((table as any).parentElement);
        this.showIcons((table as any).parentElement, false);
      }
    });
    this.refreshSelectedInformation(this.config);

  }

  doOverlap(tableTopLeft1, tableTopLeft2, tableBottomRight1, tableBottomRight2) {
    let check = false;
    if ((tableTopLeft1.x < tableBottomRight2.x) && (tableBottomRight1.x > tableTopLeft2.x) &&
      (tableTopLeft1.y < tableBottomRight2.y) &&
      (tableBottomRight1.y > tableTopLeft2.y)) {
      check = true;
    }
    return check;
  }


  getWallPath(shapeDetails, boundryBoxCenterPoint, scalePointX, scalePointY) {
    let pathPoint = _.cloneDeep(shapeDetails.pathArray);
    if (shapeDetails.type === 'Circle' || shapeDetails.type === 'Oval') {
      const radius = pathPoint.find((point) => point.command === 'A');
      const scaleX = (Math.abs(radius.arcRadiusX) - (this.settings.wallTableSpace + 70)) / Math.abs(radius.arcRadiusX);
      const scaleY = (Math.abs(radius.arcRadiusY) - (this.settings.wallTableSpace + 70)) / Math.abs(radius.arcRadiusY);
      const startPoint = boundryBoxCenterPoint;
      const currentPositionX = new MousePosition();
      currentPositionX.x = boundryBoxCenterPoint.x + (radius.arcRadiusX * scaleX);
      currentPositionX.y = boundryBoxCenterPoint.y + (radius.arcRadiusX * scaleX);
      const currentPositionY = new MousePosition();
      currentPositionY.x = boundryBoxCenterPoint.x + (radius.arcRadiusY * scaleY);
      currentPositionY.y = boundryBoxCenterPoint.y + (radius.arcRadiusY * scaleY);
      pathPoint = this.drawCircleBoundary(startPoint, currentPositionX, currentPositionY);
    } else {
      pathPoint.forEach((point) => {
        if (point.command !== 'z') {
          if (scalePointX > 0 && scalePointY > 0) {
            point.x -= boundryBoxCenterPoint.x;
            point.y -= boundryBoxCenterPoint.y;
            point.x *= scalePointX;
            point.y *= scalePointY;
            point.x += boundryBoxCenterPoint.x;
            point.y += boundryBoxCenterPoint.y;
          }
        }
      });
    }
    return pathPoint;
  }

  showBoundary(displayBoundry: boolean) {
    const existingBoundryBoxGroup = document.getElementById('facilityInnerBoundryGroup');
    if (!!existingBoundryBoxGroup) {
      this.facility.shapes.forEach(shape => {
        const facility = this.mainSvg.getElementById(shape.shapeID);
        const element = facility.parentElement.querySelector('.wallBoundry');
        if (!!element) {
          if (!!displayBoundry) {
            element.setAttribute('stroke', 'grey');
          } else {
            element.setAttribute('stroke', 'none');
          }
        }
      });
    }

    const tableSpace = this.mainGroup.querySelectorAll('.tableSpace');
    tableSpace.forEach(element => {
      if (displayBoundry) {
        element.setAttribute('stroke', 'lightgrey');
      } else {
        element.setAttribute('stroke', 'none');
      }
    });
  }

  createTempTable() {
    const translate = new MousePosition();
    const tableGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    tableGroup.setAttribute('class', 'tableGroup');
    this.mainSvg.appendChild(tableGroup);
    const tableInfo = _.cloneDeep(this.selectedTableInfo);
    this.createTable(tableGroup as any, tableInfo.tableType.shape, 'TemTableId', tableInfo.priceband);
    const seatsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    seatsGroup.setAttribute('id', 'seatsGroup');
    tableGroup.appendChild(seatsGroup);
    const bBox = (tableGroup as any).getBBox();
    const tablePath = tableGroup.querySelector('.tables');
    this.resizeTable(tableInfo.tableType.shape, bBox, 0.2, tablePath);
    translate.x = this.startPosition.x - bBox.x;
    translate.y = this.startPosition.y - bBox.y;
    const pathTableShape = this.translateTable(tableInfo.tableType.shape, translate);
    const resizedTablePath = tableGroup.querySelector('.tables');
    this.appendSeats(tableInfo.tableType, resizedTablePath, seatsGroup, 0.2, translate);
    (resizedTablePath as any).setAttribute('d', CommonService.buildPathString(tableInfo.tableType.shape.pathArray));
    this.tempTable = tableGroup as any;
    this.tempTableDetails.tableShape = tableInfo.tableType.shape;
    this.tempTableDetails.seats = tableInfo.tableType.seats;
    this.createSelectionRect(tableGroup, this.tempTableDetails.tableShape, resizedTablePath);
    this.createTableBoundary(tableGroup, this.tempTableDetails.tableShape, resizedTablePath);
    const outerbox = tableGroup.querySelector('.outerspace');
    (outerbox as any).setAttribute('stroke', 'black');
    const tableSpace = tableGroup.querySelector('.tableSpace');
    tableSpace.setAttribute('stroke', 'white');
    tableGroup.setAttribute('visibility', 'hidden');

  }

  createTable(tableGroup: SVGGraphicsElement, shape: Shape, id: string, priceBand: PriceBand) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('id', `${id}`);
    const tableShape = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    tableShape.setAttribute('id', `${shape.type}_table`);
    tableShape.setAttribute('class', `tables`);
    tableShape.setAttribute('stroke', 'none');
    tableShape.setAttribute('stroke-width', String(shape.style.strokeWidth));
    tableShape.setAttribute('fill', priceBand.color);
    tableShape.setAttribute('fill-opacity', String(shape.style.opacity));
    tableShape.setAttribute('d', CommonService.buildPathString(shape.pathArray));
    tableShape.getBoundingClientRect();
    tableGroup.appendChild(group);
    group.appendChild(tableShape);
  }

  removeInnerTableBoundry(tableGroup: HTMLElement) {
    const outerbox = tableGroup.querySelectorAll('.outerspace');
    outerbox.forEach(element => {
      (element as any).setAttribute('stroke', 'none');
    });
  }


  storeTableDetails(tables: AllocatedTable[]) {
    tables.forEach(table => {
      table.id = Guid.create().toString();
      table.name = this.createName();
      table.tableType = this.selectedTableInfo.tableType;
      table.priceBand = this.selectedTableInfo.priceband;
      table.tableShape = this.tempTableDetails.tableShape;
      table.tableShape.style.fill = this.selectedTableInfo.priceband.color;
      table.seats = this.tempTableDetails.seats;
      table.rotatedAngle = this.selectedTableInfo.tableType.rotatedAngle;
      this.config.tables.push(_.cloneDeep(table));
      this.createLabel(this.tempTable, table.name, table.priceBand);
    });
  }

  resizeTable(table, startPoint, scalefactor, path) {
    if (table.type === 'Circle' || table.type === 'Oval') {
      const shapeStartPoint = CommonService.getCenterPosition(path);
      const circleBBox = path.getBBox();
      const radius = new MousePosition();
      radius.x = radius.y = (circleBBox.width * scalefactor) / 2;
      const startpoint = CommonService.circle(shapeStartPoint.x, shapeStartPoint.y, radius, 359);
      const endpoint = CommonService.circle(shapeStartPoint.x, shapeStartPoint.y, radius, 0);
      table.pathArray = [{
        command: 'M',
        x: startpoint.x,
        y: startpoint.y
      }, {
        command: 'A',
        arcRadiusX: radius.x,
        arcRadiusY: radius.y,
        xAxisRotation: 0,
        largeArcFlag: 1,
        sweepFlag: 0,
        x: endpoint.x,
        y: endpoint.y
      },

        {
          command: 'z'
        }
      ];

    } else {
      table.pathArray.forEach((point) => {
        if (point.command === 'z') {
        } else {
          point.x -= startPoint.x;
          point.y -= startPoint.y;
          point.x *= scalefactor;
          point.y *= scalefactor;
          point.x += startPoint.x;
          point.y += startPoint.y;
        }
      });
    }
  }

  translateTable(table, translate) {
    table.pathArray.forEach(
      (ele) => {
        if (ele.command !== 'z') {
          ele.x += translate.x;
          ele.y += translate.y;
        }
      }
    );
    return table.pathArray;
  }

  translateSeats(seatsArray, drag, seats) {
    const seatArray = Array.from(seats);
    seatsArray.forEach((seat, i) => {
      seat.centerPoint.x = seat.centerPoint.x + drag.x;
      seat.centerPoint.y = seat.centerPoint.y + drag.y;
      (seatArray[i] as any).setAttribute('cx', seat.centerPoint.x);
      (seatArray[i] as any).setAttribute('cy', seat.centerPoint.y);
    });
  }

  translateText(text, drag) {
    const point = (this.mainSvg as any).createSVGPoint();
    point.x = (text as any).getAttribute('x');
    point.y = (text as any).getAttribute('y');
    point.x = point.x + drag.x;
    point.y = point.y + drag.y;
    (text as any).setAttribute('x', Math.round(point.x));
    (text as any).setAttribute('y', point.y);

  }

  appendSeats(table, path, seatsGroup, scalefactor, translate) {
    table.seats.forEach((seat, i) => {
      const point = (path as any).getBBox();
      let startPoint = new MousePosition();
      if (table.shape.type === 'Circle' || table.shape.type === 'Oval') {
        startPoint = CommonService.getCenterPosition(path);
      } else {
        startPoint = path.getBBox();
      }
      point.x = seat.centerPoint.x;
      point.y = seat.centerPoint.y;
      point.x -= startPoint.x;
      point.y -= startPoint.y;
      point.x *= scalefactor;
      point.y *= scalefactor;
      point.x += startPoint.x;
      point.y += startPoint.y;
      seat.centerPoint.x = point.x;
      seat.centerPoint.y = point.y;
      seat.radius = (this.selectedTableInfo.tableType.seats[0].radius) * scalefactor;
      const cir = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      cir.setAttribute('cx', String(point.x));
      cir.setAttribute('cy', String(point.y));
      cir.setAttribute('r', seat.radius.toString());
      cir.setAttribute('class', 'seats');
      cir.setAttribute('fill', seat.style.fill);
      seatsGroup.appendChild(cir);
    });
    const seatArray = seatsGroup.querySelectorAll('.seats');
    this.translateSeats(table.seats, translate, seatArray);
  }

  scalePath(pathPoint, scalePoint, boundaryBoxCenterPoint) {
    pathPoint.forEach((point) => {
      if (point.command !== 'z') {
        if (scalePoint > 0) {
          point.x -= boundaryBoxCenterPoint.x;
          point.y -= boundaryBoxCenterPoint.y;
          point.x *= scalePoint;
          point.y *= scalePoint;
          point.x += boundaryBoxCenterPoint.x;
          point.y += boundaryBoxCenterPoint.y;
        }
      }
    });
  }

  TranslatePath(pathArray, translate) {
    pathArray.forEach(
      (ele) => {
        if (ele.command !== 'z') {
          ele.x += translate.x;
          ele.y += translate.y;
        }
      }
    );

  }

  editTableElement(table, tableGroup, seatsGroup, index, seats) {
    const seatArray = table.seats;
    const outerspace = tableGroup.querySelector('.outerspace');
    const tableSpace = tableGroup.querySelector('.tableSpace');
    const tableshape = tableGroup.querySelector('.tables');
    const label = tableGroup.querySelector('.label');
    label.textContent = table.name;
    tableshape.setAttribute('d', CommonService.buildPathString(table.tableShape.pathArray));
    if (table.tableShape.type !== 'Circle') {
      this.fitBoundary(tableGroup, tableSpace, table);
      this.fitSelectionBox(tableGroup, outerspace, table);
    }

    seatArray.forEach((seat, i) => {
      const point = (tableshape as any).getBBox();
      point.x = seat.centerPoint.x;
      point.y = seat.centerPoint.y;
      const cir = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      cir.setAttribute('cx', String(point.x));
      cir.setAttribute('cy', String(point.y));
      cir.setAttribute('r', seat.radius.toString());
      cir.setAttribute('class', 'seats');
      cir.setAttribute('fill', seat.style.fill);
      (seatsGroup as any).appendChild(cir);
    });

    this.config.tables[index].seats = seatArray;
    seats.forEach(seat => {
      (seat as any).remove();
    });
  }

  createTableBoundary(tableGroup, shape, table) {
    const tableCenterPoint = CommonService.getCenterPosition(table);
    const scale = 1 + (this.settings.tableTableSpace / 20);
    let pathArray = _.cloneDeep(shape.pathArray);
    const points = pathArray.find((point) => point.command === 'A');
    const spoints = pathArray.find((point) => point.command === 'M');
    if (shape.type === 'Circle' || shape.type === 'Oval') {
      const startPoint = tableCenterPoint;
      const currentPosition = new MousePosition();
      currentPosition.x = spoints.x + this.settings.tableTableSpace + points.arcRadiusX;
      currentPosition.y = spoints.y + this.settings.tableTableSpace + points.arcRadiusY;
      pathArray = this.drawCircleBoundary(startPoint, currentPosition, currentPosition);
    } else {
      pathArray.forEach((point) => {
        if (point.command !== 'z') {
          point.x -= tableCenterPoint.x;
          point.y -= tableCenterPoint.y;
          point.x *= scale;
          point.y *= scale;
          point.x += tableCenterPoint.x;
          point.y += tableCenterPoint.y;
        }
      });
    }

    const path = CommonService.createPathEle((table as any).parentElement, null, 'tableSpace');
    path.setAttribute('d', CommonService.buildPathString(pathArray));
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'none');
    path.setAttribute('stroke-dasharray', '5,5');
    tableGroup.appendChild(path);

  }

  createSelectionRect(tableGroup, shape, table) {
    const tableCenterPoint = CommonService.getCenterPosition(table);
    const scale = 1.5;
    let pathArray = _.cloneDeep(shape.pathArray);
    if (shape.type === 'Circle' || shape.type === 'Oval') {
      // const tableBBox = table.getBBox();
      const startPoint = tableCenterPoint;
      const currentPosition = tableCenterPoint;
      const points = pathArray.find((point) => point.command === 'A');
      const spoints = pathArray.find((point) => point.command === 'M');
      currentPosition.x = spoints.x + 10 + points.arcRadiusX;
      currentPosition.y = spoints.y + 10 + points.arcRadiusY;
      pathArray = this.drawCircleBoundary(startPoint, currentPosition, currentPosition);
    } else {
      pathArray.forEach((point) => {
        if (point.command !== 'z') {
          point.x -= tableCenterPoint.x;
          point.y -= tableCenterPoint.y;
          point.x *= scale;
          point.y *= scale;
          point.x += tableCenterPoint.x;
          point.y += tableCenterPoint.y;
        }
      });
    }
    const path = CommonService.createPathEle((table as any), null, 'outerspace');
    path.setAttribute('d', CommonService.buildPathString(pathArray));
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'none');
    tableGroup.appendChild(path);
    if (shape.type !== 'Circle' && shape.type !== 'Oval') {
      const points = pathArray.find((point) => point.command === 'M');
      const pointsOpposite = pathArray.find((point) => point.command === 'L');
      this.createRotationicon(tableGroup, points);
      // this.createEditicon(tableGroup, pointsOpposite);
      this.createDelete(tableGroup, pointsOpposite);
    } else {
      const radius = pathArray.find((point) => point.command === 'A').arcRadiusX;
      const pointRotate = (path as any).getPointAtLength((radius * 4));
      const pointsDelete = (path as any).getPointAtLength(radius * 2);
      this.createRotationicon(tableGroup, pointRotate);
      // this.createEditicon(tableGroup, pointsEdit);
      this.createDelete(tableGroup, pointsDelete);
    }

  }

  dragAndMoveTable(event, dragTable, type, tableDetails) {
    this.mainGroup.append(dragTable);
    dragTable.setAttribute('visibility', 'visible');
    const startPoint = dragTable.getBBox();
    this.currentPosition = CommonService.getMousePosition(this.mainGroup, event);
    const drag = new MousePosition();
    if (type === 'drag') {
      drag.x = this.currentPosition.x - (startPoint.x + startPoint.width / 2);
      drag.y = this.currentPosition.y - (startPoint.y + startPoint.height / 2);
    } else {
      drag.x = this.currentPosition.x - this.startPosition.x;
      drag.y = this.currentPosition.y - this.startPosition.y;
    }
    // if (this.checkAreaAvailable(dragTable, drag, tableDetails, 'drag')) {
    //     this.showCrossIcon(dragTable, false);
    // } else {
    //     this.showCrossIcon(dragTable, true);
    // }
    (dragTable as any).setAttribute('transform', `translate(${drag.x}, ${drag.y})`);
  }

  createName() {
    let isNotDuplicate = false;
    let name = this.selectedTableInfo.prefix.concat(this.selectedTableInfo.startingNumber.toString());
    if (this.config.tables) {
      while (isNotDuplicate === false) {
        const foundName = this.config.tables.find((table) => table.name === name);

        if (foundName) {
          name = this.selectedTableInfo.prefix + ++this.selectedTableInfo.startingNumber;
        } else {
          isNotDuplicate = true;
        }
      }
    } else {
      this.config.tables = [];
    }

    return name;
  }

  createLabel(tablesGroup, name, priceBand) {
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.textContent = name;
    let tableCenterPoints = (this.mainSvg as any).createSVGPoint();
    const tableShape = tablesGroup.querySelector('.tables');
    tableCenterPoints = CommonService.getCenterPosition(tableShape);
    const tableBB = tablesGroup.getBBox();
    tableCenterPoints.y = tableCenterPoints.y + 2;
    if (tableBB.height <= 45 || tableBB.width <= 45) {
      text.setAttribute('font-size', '7');
    } else {
      text.setAttribute('font-size', '10');
    }

    text.setAttribute('x', tableCenterPoints.x);
    text.setAttribute('y', tableCenterPoints.y);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-weight', 'bold');
    if (this.lightOrDark(priceBand.color) === 'light') {
      text.setAttribute('fill', 'black');
    } else {
      text.setAttribute('fill', 'white');
    }

    text.setAttribute('class', 'label');
    const scaleValue = this.mainGroup.getAttribute('transform');
    if (scaleValue && scaleValue !== null) {
      text.setAttribute('display', 'block');
    } else {
      text.setAttribute('display', 'none');
    }
    tablesGroup.appendChild(text);
  }

  setPosition(event, tableGroup: HTMLElement, allocatedTable: AllocatedTable, type) {
    tableGroup.removeAttribute('transform');
    const startPoint = (tableGroup as any).getBBox();
    this.currentPosition = CommonService.getMousePosition(this.mainGroup, event);
    const drag = new MousePosition();
    if (type === 'drag') {
      drag.x = this.currentPosition.x - (startPoint.x + startPoint.width / 2);
      drag.y = this.currentPosition.y - (startPoint.y + startPoint.height / 2);
    } else {
      drag.x = this.currentPosition.x - this.startPosition.x;
      drag.y = this.currentPosition.y - this.startPosition.y;
    }
    if ((this.checkAreaAvailable(tableGroup as any, drag, allocatedTable, 'set'))) {
      this.setTablePosition(allocatedTable, drag, tableGroup);
    }
  }

  setPositionForMove(tableGroup, event, allocatedTable) {
    tableGroup.removeAttribute('transform');
    this.currentPosition = CommonService.getMousePosition(this.mainGroup, event);
    const drag = new MousePosition();
    drag.x = this.currentPosition.x - this.startPosition.x;
    drag.y = this.currentPosition.y - this.startPosition.y;
    this.setTablePosition(allocatedTable, drag, tableGroup);
  }

  setTablePosition(allocatedTable, drag, tableGroup) {
    const tableType = _.cloneDeep(allocatedTable);
    this.translateTable(tableType.tableShape, drag);
    const table = tableGroup.querySelector('.tables');
    (table as any).setAttribute('d', CommonService.buildPathString(tableType.tableShape.pathArray));
    tableGroup.setAttribute('visibility', 'visible');
    const seats = (tableGroup as any).querySelectorAll('.seats');
    const text = (tableGroup as any).querySelector('.label');
    this.translateSeats(tableType.seats, drag, seats);
    const outerbox = tableGroup.querySelector('.outerspace');
    const tableSpace = tableGroup.querySelector('.tableSpace');
    this.fitSelectionBox(tableGroup, outerbox, tableType);
    this.fitBoundary(tableGroup, tableSpace, tableType);
    this.translateText(text, drag);
    const tableelem = this.config.tables.find((elem) => elem.id === tableType.id);
    this.mainGroup.appendChild(tableGroup);
    const index = this.config.tables.indexOf(tableelem);
    if (index > -1) {
      this.config.tables[index] = tableType;
      this.config.facilityId = this.facility.id;

    }
    this.tableService.updateLocalStore(this.config);
    const points = (tableGroup as any).getBBox();
    const tableTopleft = (this.mainSvg as any).createSVGPoint();
    const tableTopRight = (this.mainSvg as any).createSVGPoint();
    const tableBottomleft = (this.mainSvg as any).createSVGPoint();
    const tableBottomRight = (this.mainSvg as any).createSVGPoint();
    tableTopleft.x = points.x;
    tableTopleft.y = points.y;
    tableTopRight.x = points.x + points.width;
    tableTopRight.y = points.y;
    tableBottomleft.x = points.x;
    tableBottomleft.y = points.y + points.height;
    tableBottomRight.x = points.x + points.width;
    tableBottomRight.y = points.y + points.height;
    const shape = this.findBoundary(tableTopleft, tableTopRight, tableBottomleft, tableBottomRight);
    shape.parentElement.append(tableGroup);
  }

  appendBackTables(tableGroup) {
    const points = (tableGroup as any).getBBox();
    const tableTopleft = (this.mainSvg as any).createSVGPoint();
    const tableTopRight = (this.mainSvg as any).createSVGPoint();
    const tableBottomleft = (this.mainSvg as any).createSVGPoint();
    const tableBottomRight = (this.mainSvg as any).createSVGPoint();
    tableTopleft.x = points.x;
    tableTopleft.y = points.y;
    tableTopRight.x = points.x + points.width;
    tableTopRight.y = points.y;
    tableBottomleft.x = points.x;
    tableBottomleft.y = points.y + points.height;
    tableBottomRight.x = points.x + points.width;
    tableBottomRight.y = points.y + points.height;
    const shape = this.findBoundary(tableTopleft, tableTopRight, tableBottomleft, tableBottomRight);
    shape.parentElement.append(tableGroup);
  }

  // SELECTION
  selectSingleTable(event) {
    const clickedPoint = CommonService.getMousePosition(this.mainGroup, event);
    const SVGPoints = (this.mainSvg as any).createSVGPoint();
    SVGPoints.x = clickedPoint.x;
    SVGPoints.y = clickedPoint.y;
    const outerspace = this.mainGroup.querySelectorAll('.outerspace');
    const newArray = Array.from(outerspace);
    newArray.forEach(table => {
      if ((table as any).isPointInFill(SVGPoints)) {
        (table as any).setAttribute('stroke', 'black');
        this.addFromSelection((table as any));
        this.showIcons((table as any).parentElement, true);
      } else if (!event.ctrlKey) {
        (table as any).setAttribute('stroke', 'none');
        this.removeFromSelection((table as any).parentElement);
        this.showIcons((table as any).parentElement, false);
      }
    });

  }

  deSelectAll() {
    const tableGroups = this.mainGroup.querySelectorAll('.tableGroup');
    const newArray = Array.from(tableGroups);
    newArray.forEach(tableGroup => {
      const table = (tableGroup as any).querySelector('.outerspace');
      (table as any).setAttribute('stroke', 'none');
      this.selectedTables = [];
      this.showIcons(tableGroup, false);
    });
  }

  addFromSelection(table) {
    const id = (table as any).parentElement.getAttribute('id');
    const index = this.selectedTables.findIndex((elem) => (elem as any).getAttribute('id') === id);
    const indexSelected = this.selectedTables.findIndex((elem) => (elem as any).getAttribute('id') === id);
    if (!(index > -1) && !(indexSelected >= 0)) {
      this.selectedTables.push(table.parentElement);
    }
  }

  removeFromSelection(table) {
    const id = (table as any).getAttribute('id');
    const index = this.selectedTables.findIndex((elem) => (elem as any).getAttribute('id') === id);
    if (index > -1) {
      this.selectedTables.splice(index, 1);
    }
  }

  deleteTables() {
    if (this.selectedTables.length > 0) {
      this.selectedTables.forEach(tableGroup => {
        const index = this.config.tables.findIndex((elem) => elem.id === (tableGroup as any).getAttribute('id'));
        if (index > -1) {
          this.config.tables.splice(index, 1);
          this.config.facilityId = this.facility.id;
          tableGroup.remove();
        }
      });
      this.selectedTables = [];
    }
    this.tableService.updateLocalStore(this.config);
    this.refreshSelectedInformation(this.config);
  }

  isOuterspace(event) {
    let isOuterspace = false;
    const outerspaceArray = this.mainGroup.querySelectorAll('.outerspace');
    const position = CommonService.getMousePosition(this.mainGroup, event);
    const point = (this.mainSvg as any).createSVGPoint();
    point.x = position.x;
    point.y = position.y;
    outerspaceArray.forEach(space => {
      if ((space as any).isPointInFill(point)) {
        isOuterspace = true;
      }
    });
    return isOuterspace;
  }

  isClickedRotate(event) {
    let isRotate = false;
    const space = event.target.getAttribute('class');
    if (space === 'rotationIcon') {
      isRotate = true;
    }
    return isRotate;
  }

  isClickedtoDelete(event) {
    let isDelete = false;
    const space = event.target.getAttribute('class');
    if (space === 'deleteIcon') {
      isDelete = true;
    }
    return isDelete;
  }

  isClickedOnSelectedTable(event) {
    let isselectedOuterspace = false;
    const position = CommonService.getMousePosition(this.mainGroup, event);
    const point = (this.mainSvg as any).createSVGPoint();
    point.x = position.x;
    point.y = position.y;
    this.selectedTables.forEach(tableGroup => {
      const space = tableGroup.querySelector('.outerspace');
      if ((space as any).isPointInFill(point)) {
        isselectedOuterspace = true;
      }
    });
    return isselectedOuterspace;
  }

  // ============================ VALIDATION ====================================

  checkAreaAvailable(tableGroup: SVGGraphicsElement, drag: MousePosition, tableDetails, type) {
    const existingNonseatingAreas = Array.from(this.mainGroup.querySelectorAll('.nonSeatingArea'));
    const nonWallArray = this.mainGroup.querySelectorAll('.non_wall');
    const outerSpace = tableGroup.querySelector('.outerspace');
    const outerBB = (outerSpace as any).getBBox();
    const outerBBTopleft = (this.mainSvg as any).createSVGPoint();
    outerBBTopleft.x = outerBB.x + drag.x;
    outerBBTopleft.y = outerBB.y + drag.y;
    const outerBBTopRight = (this.mainSvg as any).createSVGPoint();
    outerBBTopRight.x = outerBB.x + outerBB.width + drag.x;
    outerBBTopRight.y = outerBB.y + drag.y;
    const outerBBBottomleft = (this.mainSvg as any).createSVGPoint();
    outerBBBottomleft.x = outerBB.x + drag.x;
    outerBBBottomleft.y = outerBB.y + outerBB.height + drag.y;
    const outerBBBottomRight = (this.mainSvg as any).createSVGPoint();
    outerBBBottomRight.x = outerBB.x + drag.x + outerBB.width;
    outerBBBottomRight.y = outerBB.y + outerBB.height + drag.y;
    let isNonSeatingArea = false;
    const pathPoints = (tableGroup as any).getBBox();
    const tableTopleft = (this.mainSvg as any).createSVGPoint();
    const tableCenter = CommonService.getCenterPosition(tableGroup);
    const tableBottomRight = (this.mainSvg as any).createSVGPoint();
    const centerPoint = (this.mainSvg as any).createSVGPoint();
    tableTopleft.x = pathPoints.x + drag.x;
    tableTopleft.y = pathPoints.y + drag.y;
    tableBottomRight.x = pathPoints.x + pathPoints.width + drag.x;
    tableBottomRight.y = pathPoints.y + pathPoints.height + drag.y;
    centerPoint.x = tableCenter.x + drag.x;
    centerPoint.y = tableCenter.y + drag.y;
    existingNonseatingAreas.forEach(area => {
      if ((area as any).isPointInFill(centerPoint) || (area as any).isPointInFill(outerBBBottomRight) ||
        (area as any).isPointInFill(outerBBBottomleft) || (area as any).isPointInFill(outerBBTopleft) ||
        (area as any).isPointInFill(outerBBTopRight)) {
        isNonSeatingArea = true;
      }
    });
    const isNonWallArea = this.isNonseatingArea(nonWallArray, tableTopleft, tableBottomRight);
    const isAreaAvailable = this.isOverlapPathMove(tableGroup, drag, tableDetails, type);

    return (!isAreaAvailable && !isNonWallArea && !isNonSeatingArea);
  }

  findBoundary(tableTopleft, tableTopRight, tableBottomleft, tableBottomRight) {
    const ShapeArray = this.mainSvg.querySelectorAll('.shapes');
    let facility: any;
    ShapeArray.forEach((shape) => {
      const isFill = ((shape as any).isPointInFill(tableTopleft) ||
        (shape as any).isPointInFill(tableTopRight) ||
        (shape as any).isPointInFill(tableBottomleft) || (shape as any).isPointInFill(tableBottomRight));
      if (isFill) {
        facility = shape;
      }
    });
    return facility;
  }

  isNonseatingArea(nonWallArray, tableTopLeft2, tableBottomRight2) {
    const newArray = Array.from(nonWallArray);
    let insNonWallArea = false;
    newArray.forEach(nonwall => {
      const nonwallBoundary = (nonwall as any).getBBox();
      const nonWallTopLeft2 = (this.mainSvg as any).createSVGPoint();
      nonWallTopLeft2.x = nonwallBoundary.x;
      nonWallTopLeft2.y = nonwallBoundary.y;
      const nonBottomRight = (this.mainSvg as any).createSVGPoint();
      nonBottomRight.x = nonwallBoundary.x + nonwallBoundary.width;
      nonBottomRight.y = nonwallBoundary.y + nonwallBoundary.height;
      if (this.doOverlap(nonWallTopLeft2, tableTopLeft2, nonBottomRight, tableBottomRight2)) {
        insNonWallArea = true;
        if (this.minimumHeight > nonBottomRight.height) {
        }
      }
    });
    return insNonWallArea;
  }


  createTestTable() {
    const translate = new MousePosition();
    const tableGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    tableGroup.setAttribute('class', 'tableGroup');
    this.mainSvg.appendChild(tableGroup);
    const tableInfo = _.cloneDeep(this.selectedTableInfo);
    this.createTable(tableGroup as any, tableInfo.tableType.shape, 'TemTableId', tableInfo.priceband);
    const bBox = (tableGroup as any).getBBox();
    const tablePath = tableGroup.querySelector('.tables');
    this.resizeTable(tableInfo.tableType.shape, bBox, 0.2, tablePath);
    translate.x = this.startPosition.x - bBox.x;
    translate.y = this.startPosition.y - bBox.y;
    this.translateTable(tableInfo.tableType.shape, translate);
    const resizedTablePath = tableGroup.querySelector('.tables');
    (resizedTablePath as any).setAttribute('d', CommonService.buildPathString(tableInfo.tableType.shape.pathArray));
    this.createSelectionRect(tableGroup, tableInfo.tableType.shape, resizedTablePath);
    this.createTableBoundary(tableGroup, tableInfo.tableType.shape, resizedTablePath);
    this.testTableDetails.tableShape = tableInfo.tableType.shape;
    return tableGroup;
  }

  ///////////// Auto Allocation /////////////////////////

  autoArrangeTable(availableCount: number, boundary: any) {
    const translateDistance = new MousePosition();
    const boundaryBBox = boundary.getBBox();
    let isNextRow = false;
    let isBoundary = false;
    this.allocatedDistance.x = boundaryBBox.x;
    this.allocatedDistance.y = boundaryBBox.y;
    this.selectedTables = [];
    const tempTableBBox = (this.testTable as any).getBBox();
    for (let i = 0; i < availableCount; i++) {
      if (i > 1000000) {
        return;
      }
      const ShapeArray = this.mainSvg.querySelectorAll('.wallBoundry');
      let isInFill = false;
      ShapeArray.forEach(shape => {
        const point = (this.mainSvg as any).createSVGPoint();
        point.x = this.allocatedDistance.x;
        point.y = this.allocatedDistance.y;
        if ((shape as any).isPointInFill(point)) {
          isInFill = true;
        }

      });
      if (isInFill) {
        translateDistance.x = this.allocatedDistance.x - tempTableBBox.x;
        translateDistance.y = this.allocatedDistance.y - tempTableBBox.y;
        const tableTopleft = (this.mainSvg as any).createSVGPoint();
        const tableTopRight = (this.mainSvg as any).createSVGPoint();
        const tableBottomleft = (this.mainSvg as any).createSVGPoint();
        const tableBottomRight = (this.mainSvg as any).createSVGPoint();
        const pathPoints = (this.testTable as any).getBBox();
        tableTopleft.x = pathPoints.x + translateDistance.x;
        tableTopleft.y = pathPoints.y + translateDistance.y;
        tableTopRight.x = pathPoints.x + pathPoints.width + translateDistance.x;
        tableTopRight.y = pathPoints.y + translateDistance.y;
        tableBottomleft.x = pathPoints.x + translateDistance.x;
        tableBottomleft.y = pathPoints.y + pathPoints.height + translateDistance.y;
        tableBottomRight.x = pathPoints.x + pathPoints.width + translateDistance.x;
        tableBottomRight.y = pathPoints.y + pathPoints.height + translateDistance.y;
        const shape = this.findBoundary(tableTopleft, tableTopRight, tableBottomleft, tableBottomRight);
        if (shape !== undefined) {
          const boundaryfound = shape.parentElement.querySelector('.wallBoundry');
          if (boundaryfound !== null) {
            isBoundary = boundaryfound.getAttribute('id') === boundary.getAttribute('id');
          }
        }
        if (this.checkAreaAvailable((this.testTable as any), translateDistance, this.testTableDetails, 'arrangement') && isBoundary) {
          this.createTempTable();
          this.storeTableDetails([this.tempTableDetails]);
          this.setTablePosition(this.tempTableDetails, translateDistance, this.tempTable);
          this.tempTable.setAttribute('id', this.tempTableDetails.id);
          shape.parentElement.appendChild(this.tempTable);
          this.allocatedDistance.x += tempTableBBox.width + 1;
          isNextRow = true;
          this.allocateTableCount++;
        } else {
          this.allocatedDistance.x = this.allocatedDistance.x + 1;
          availableCount++;
          if (this.allocatedDistance.x + tempTableBBox.width > (boundaryBBox.x + boundaryBBox.width)) {
            this.allocatedDistance.x = this.allocatedDistance.x + tempTableBBox.width;
          }
        }
        if (this.allocatedDistance.x >= (boundaryBBox.x + boundaryBBox.width)) {
          if (isNextRow) {
            this.allocatedDistance.y = this.allocatedDistance.y + (tempTableBBox.height - this.allocatedDistance.y) + 1;
            isNextRow = false;
          } else {
            if (this.isMinimumFound) {
              this.allocatedDistance.y++;
              this.allocatedDistance.y = this.allocatedDistance.y + Math.abs(this.minimumHeight);
              this.minimumHeight = 1000000;
            } else {
              this.allocatedDistance.y = this.allocatedDistance.y + 1;
            }

          }
          this.allocatedDistance.x = boundaryBBox.x;
        }
        if (this.allocatedDistance.y >= (boundaryBBox.y + boundaryBBox.height)) {
          availableCount = 0;
          return;
        }
      } else {
        availableCount++;
        this.allocatedDistance.x++;
        if (this.allocatedDistance.x >= (boundaryBBox.x + boundaryBBox.width)) {
          this.allocatedDistance.y++;
          this.allocatedDistance.x = boundaryBBox.x;
        }
        if (this.allocatedDistance.y >= (boundaryBBox.y + boundaryBBox.height)) {
          return;
        }
        const nextPoint = CommonService.createSVGPoint(this.mainGroup);
        nextPoint.x = this.allocatedDistance.x + tempTableBBox.width;
        nextPoint.y = this.allocatedDistance.y;
        ShapeArray.forEach(shape => {
          if ((shape as any).isPointInFill(nextPoint)) {
            isInFill = true;
          }

        });
        if (!isInFill) {
          this.allocatedDistance.x = this.allocatedDistance.x + tempTableBBox.width;
        }
      }
    }
  }

  //////////////////////////////// REFRESH THE CONFIG TABLES//////////////////////////////////////////////////

  createAllocatedTable(tables: AllocatedTable[]) {
    this.config.tables = [];
    tables.forEach(table => {
      const tableGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      tableGroup.setAttribute('class', 'tableGroup');
      const tableInfo = _.cloneDeep(table);
      this.createTable(tableGroup as any, tableInfo.tableShape, 'TemTableId', tableInfo.priceBand);
      const seatsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      seatsGroup.setAttribute('id', 'seatsGroup');
      tableGroup.appendChild(seatsGroup);
      this.mainGroup.append(tableGroup);
      const resizedTablePath = tableGroup.querySelector('.tables');
      this.createSeats(tableInfo.seats, seatsGroup);
      (resizedTablePath as any).setAttribute('d', CommonService.buildPathString(tableInfo.tableShape.pathArray));
      this.createTableBoundary(tableGroup, tableInfo.tableShape, resizedTablePath);
      this.createSelectionRect(tableGroup, tableInfo.tableShape, resizedTablePath);
      const tableSpace = tableGroup.querySelector('.tableSpace');
      tableSpace.setAttribute('stroke', 'white');
      const drag = new MousePosition();
      this.updateTableDetails([table], tableGroup);
      this.setTablePosition(table, drag, tableGroup);
      tableGroup.setAttribute('id', table.id);
      this.showBoundary(false);

    });
  }

  updateTableDetails(tables: AllocatedTable[], tableGroup) {
    tables.forEach(table => {
      this.config.tables.push(_.cloneDeep(table));
      this.createLabel(tableGroup, table.name, table.priceBand);
    });
  }

  createSeats(seats, seatsGroup) {
    seats.forEach(seat => {
      const cir = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      cir.setAttribute('cx', String(seat.centerPoint.x));
      cir.setAttribute('cy', String(seat.centerPoint.y));
      cir.setAttribute('r', seat.radius.toString());
      cir.setAttribute('class', 'seats');
      cir.setAttribute('fill', seat.style.fill);
      seatsGroup.appendChild(cir);
    });
  }

  getLocalStoreData() {
    const config = JSON.parse(localStorage.getItem('configTables'));
    return !!config;

  }

  checkAllCorrect(selectedTables, event) {
    let available = true;
    const drag = new MousePosition();
    drag.x = this.currentPosition.x - this.startPosition.x;
    drag.y = this.currentPosition.y - this.startPosition.y;
    selectedTables.forEach(tableGroup => {
      this.currentPosition = CommonService.getMousePosition(this.mainGroup, event);

      const allocatedTable = this.config.tables.find((elem) => elem.id === tableGroup.getAttribute('id'));
      if (!(this.checkAreaAvailable(tableGroup as any, drag, allocatedTable, 'drop'))) {
        available = false;
      }
    });
    return available;
  }

  checkRotationAllCorrect(selectedTables) {
    let available = true;
    selectedTables.forEach(tableGroup => {
      const allocatedTable = this.config.tables.find((elem) => elem.id === tableGroup.getAttribute('id'));
      const centerPoint = CommonService.getCenterPosition(tableGroup);
      if (!(this.checkRotationAAreaAvailable(tableGroup, centerPoint, allocatedTable))) {
        available = false;
      }
    });
    return available;
  }

  showIcons(tableGroup, show) {
    const icon = tableGroup.querySelector('.rotationIcon');
    const deleteIcon = tableGroup.querySelector('.deleteIcon');
    if (show) {
      icon.setAttribute('visibility', 'visible');
      deleteIcon.setAttribute('visibility', 'visible');
    } else {
      icon.setAttribute('visibility', 'hidden');
      deleteIcon.setAttribute('visibility', 'hidden');
    }
  }

  startRotate(tableGroup: HTMLElement) {
    const centerPoint = CommonService.getCenterPosition(tableGroup as any);
    tableGroup.setAttribute('transform', `rotate(${this.rotateAngle}, ${centerPoint.x} , ${centerPoint.y}) `);
  }

  endRotate(tableGroup: HTMLElement) {
    const id = (tableGroup as any).getAttribute('id');
    const allocatedTable = this.config.tables.find((elem) => elem.id === id);
    const centerPoint = CommonService.getCenterPosition(tableGroup as any);
    if (this.checkRotationAllCorrect(this.selectedTables)) {
      const tableShape = tableGroup.querySelector('.tables');
      const seats = tableGroup.querySelectorAll('.seats');
      this.rotateTableShape(allocatedTable, centerPoint, tableShape, seats);
      const outerspace = tableGroup.querySelector('.outerspace');
      const tableSpace = tableGroup.querySelector('.tableSpace');
      if (allocatedTable.tableShape.type !== 'Circle') {
        this.fitBoundary(tableGroup, tableSpace, allocatedTable);
        this.fitSelectionBox(tableGroup, outerspace, allocatedTable);
      }
    }

  }

  rotateTableShape(allocatedTable, centerPoint, tableShape, seats) {
    const index = this.config.tables.indexOf(allocatedTable);
    allocatedTable.tableShape.pathArray.forEach(point => {
      if (point.command === 'z') {
      } else {
        const x = point.x;
        const y = point.y;
        // translate point to origin
        const {
          rotatedX, rotatedY
        } = this.getRotatedPoints(x, centerPoint, y);
        // translate back
        point.x = rotatedX + centerPoint.x;
        point.y = rotatedY + centerPoint.y;
      }
      tableShape.setAttribute('d', CommonService.buildPathString(allocatedTable.tableShape.pathArray));
    });
    this.rotateSeats(allocatedTable, centerPoint, index, seats);
    let angle = allocatedTable.rotatedAngle + this.rotateAngle;
    if (angle >= 360) {
      angle = angle - 360;
    }
    allocatedTable.rotatedAngle = Math.abs(angle);
    this.config.tables[index] = allocatedTable;
    console.log('rotate table really', this.rotateAngle);

    this.tableService.updateLocalStore(this.config);
    this.refreshSelectedInformation(this.config);
  }

  refreshSelectedInformation(config: Config) {
    const selectedTableInfo = [];
    setTimeout(() => {
      this.selectedTables.forEach(table => {
        const configTable = config.tables.find((elem) => elem.id === table.getAttribute('id'));
        configTable.isColapsed = false;
        selectedTableInfo.push(configTable);
      });

      this.selectedTabledetails.emit(selectedTableInfo);
    });
  }

  // refreshAllocatedTableInformation(config: Config) {
  //     const selectedTableInfo = [];
  //     setTimeout(() => {
  //         this.selectedTables.forEach(table => {
  //             const configTables = config.tables.find((elem) => elem.id === table.getAttribute('id'));
  //             selectedTableInfo.push(configTables);
  //         });
  //         this.selectedTabledetails.emit(selectedTableInfo);
  //     });
  // }

  private getRotatedPoints(x: any, centerPoint: any, y: any) {
    const tempX = x - centerPoint.x;
    const tempY = y - centerPoint.y;
    const rotatedX = tempX * Math.cos(this.rotateAngle * Math.PI / 180) - tempY * Math.sin(this.rotateAngle * Math.PI / 180);
    const rotatedY = tempX * Math.sin(this.rotateAngle * Math.PI / 180) + tempY * Math.cos(this.rotateAngle * Math.PI / 180);
    return {
      rotatedX, rotatedY
    };
  }

  rotateSeats(allocatedTable, centerPoint, index, seats) {
    allocatedTable.seats.forEach((seat, i) => {
      const point = new MousePosition();
      point.x = seat.centerPoint.x;
      point.y = seat.centerPoint.y;
      const x = point.x;
      const y = point.y;
      // translate point to origin
      const {
        rotatedX, rotatedY
      } = this.getRotatedPoints(x, centerPoint, y);
      // translate back
      point.x = rotatedX + centerPoint.x;
      point.y = rotatedY + centerPoint.y;
      seat.centerPoint.x = point.x;
      seat.centerPoint.y = point.y;

    });
    this.config.tables[index] = allocatedTable;
    this.tableService.updateLocalStore(this.config);
    this.updateSeats(allocatedTable, seats);
  }

  fitBoundary(tableGroup, path, allocatedTable) {
    const table = tableGroup.querySelector('.tables');
    const tableCenterPoint = CommonService.getCenterPosition(table);
    const scale = 1 + (this.settings.tableTableSpace / 20);
    let pathArray = _.cloneDeep(allocatedTable.tableShape.pathArray);
    const points = pathArray.find((point) => point.command === 'A');
    const spoints = pathArray.find((point) => point.command === 'M');
    if (allocatedTable.tableType.shape.type === 'Circle' || allocatedTable.tableType.shape.type === 'Oval') {
      const startPoint = tableCenterPoint;
      const currentPosition = new MousePosition();
      currentPosition.x = spoints.x + this.settings.tableTableSpace + points.arcRadiusX;
      currentPosition.y = spoints.y + this.settings.tableTableSpace + (points.arcRadiusY);
      pathArray = this.drawCircleBoundary(startPoint, currentPosition, currentPosition);
    } else {
      pathArray.forEach((point) => {
        if (point.command !== 'z') {
          point.x -= tableCenterPoint.x;
          point.y -= tableCenterPoint.y;
          point.x *= scale;
          point.y *= scale;
          point.x += tableCenterPoint.x;
          point.y += tableCenterPoint.y;
        }
      });
    }

    path.setAttribute('d', CommonService.buildPathString(pathArray));
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', 'none');
    path.setAttribute('stroke-dasharray', '5,5');
  }

  fitSelectionBox(tableGroup, path, allocatedTable) {
    const table = tableGroup.querySelector('.tables');
    const tableCenterPoint = CommonService.getCenterPosition(table);
    const scale = 1.5;
    let pathArray = _.cloneDeep(allocatedTable.tableShape.pathArray);
    if (allocatedTable.tableType.shape.type === 'Circle' || allocatedTable.tableType.shape.type === 'Oval') {
      const startPoint = tableCenterPoint;
      const points = pathArray.find((point) => point.command === 'A');
      const spoints = pathArray.find((point) => point.command === 'M');
      const currentPosition = new MousePosition();
      currentPosition.x = spoints.x + points.arcRadiusX + 10;
      currentPosition.y = spoints.y + points.arcRadiusY + 10;
      pathArray = this.drawCircleBoundary(startPoint, currentPosition, currentPosition);
    } else {
      pathArray.forEach((point) => {
        if (point.command !== 'z') {
          point.x -= tableCenterPoint.x;
          point.y -= tableCenterPoint.y;
          point.x *= scale;
          point.y *= scale;
          point.x += tableCenterPoint.x;
          point.y += tableCenterPoint.y;
        }
      });
    }

    path.setAttribute('d', CommonService.buildPathString(pathArray));
    path.setAttribute('fill', 'none');
    if (allocatedTable.tableType.shape.type !== 'Circle' && allocatedTable.tableType.shape.type !== 'Oval') {
      const points = pathArray.find((point) => point.command === 'M');
      const pointsOpposite = pathArray.find((point) => point.command === 'L');
      this.fitRotationIcon(tableGroup, points);
      this.fitDeleteIcon(tableGroup, pointsOpposite);
    } else {
      const points = pathArray.find((point) => point.command === 'M');
      const radius = pathArray.find((point) => point.command === 'A').arcRadiusX;
      const pointRotate = (path as any).getPointAtLength(radius * 4);
      const pointsEdit = (path as any).getPointAtLength(radius * 2);
      this.fitRotationIcon(tableGroup, pointRotate);
      this.fitDeleteIcon(tableGroup, pointsEdit);
    }

  }

  updateSeats(allocatedTable, seats) {
    seats.forEach((seat, i) => {
      const centerPoint = allocatedTable.seats[i].centerPoint;
      seat.setAttribute('cx', centerPoint.x);
      seat.setAttribute('cy', centerPoint.y);
    });
  }

  //////////// VALIDATION FOR ROTATION///////////////////////////////////
  checkRotationAAreaAvailable(tableGroup: SVGGraphicsElement, centerPoint, allocatedTable: AllocatedTable) {
    const nonWallArray = this.mainGroup.querySelectorAll('.non_wall');
    const pathPoints = (tableGroup as any).getBBox();
    const tableTopleft = (this.mainSvg as any).createSVGPoint();
    const tableTopRight = (this.mainSvg as any).createSVGPoint();
    const tableBottomleft = (this.mainSvg as any).createSVGPoint();
    const tableBottomRight = (this.mainSvg as any).createSVGPoint();
    tableTopleft.x = pathPoints.x;
    tableTopleft.y = pathPoints.y;
    tableTopRight.x = pathPoints.x + pathPoints.width;
    tableTopRight.y = pathPoints.y;
    tableBottomleft.x = pathPoints.x;
    tableBottomleft.y = pathPoints.y + pathPoints.height;
    tableBottomRight.x = pathPoints.x + pathPoints.width;
    tableBottomRight.y = pathPoints.y + pathPoints.height;
    const isAreanotAvailable = this.isOverlapPathRotate(tableGroup);
    const isNonWallArea = this.isNonseatingArea(nonWallArray, tableTopleft, tableBottomRight);
    return (!isNonWallArea && !isAreanotAvailable);
  }

  onEditTable(tableinfo: AllocatedTable[]) {
    const dialogRef = this.dialog.open(CreateAndEditTableModalComponent, {
      panelClass: 'custom-dialog-container',
      width: '600px',
      data: {
        type: TableModelType.EDIT_ALLOCATED_TABLE,
        allocatedTable: tableinfo
      }
    });
  }

  IsTableOverlap(tableGroup, boundaryBoxPathArray, boundaryBox, allocatedTables: AllocatedTable[]) {
    let isOverlap = false;
    const centerPoint = CommonService.getCenterPosition(boundaryBox);
    const path = _.cloneDeep(boundaryBoxPathArray);
    path.forEach(point => {
      if (point.command !== 'z') {
        if (point.command === 'z') {
        } else {
          const x = point.x;
          const y = point.y;
          // translate point to origin
          const tempX = x - centerPoint.x;
          const tempY = y - centerPoint.y;
          const rotatedX = tempX * Math.cos(this.rotateAngle * Math.PI / 180) - tempY * Math.sin(this.rotateAngle * Math.PI / 180);
          const rotatedY = tempX * Math.sin(this.rotateAngle * Math.PI / 180) + tempY * Math.cos(this.rotateAngle * Math.PI / 180);
          // translate back
          point.x = rotatedX + centerPoint.x;
          point.y = rotatedY + centerPoint.y;
        }
      }
    });
    allocatedTables.forEach(table => {
      if (tableGroup.getAttribute('id') !== table.id) {
        const tableElemArray = Array.from(this.mainGroup.querySelectorAll('.tableGroup'));
        const tableElem = tableElemArray.find((elem) => (elem as any).getAttribute('id') === table.id);
        const boundaryBBoxsdfghjk = (tableElem as any).querySelector('.tableSpace');
        const fillPoints = [];
        fillPoints.push(...CommonService.checkPointsInFill(path, boundaryBBoxsdfghjk));
        if (fillPoints.length > 0) {
          isOverlap = true;
        }
      }
    });
    return isOverlap;
  }

  fitRotationIcon(tableGroup, points) {
    const rotationIconGroup = tableGroup.querySelector('.rotationIcon');
    const translate = new SvgPoints();
    translate.x = points.x - 8;
    translate.y = points.y - 8;
    (rotationIconGroup as any).setAttribute('transform', `translate(${translate.x}, ${translate.y})`);
  }

  // fitEditIcon(tableGroup, points) {
  //     const rotationIconGroup = tableGroup.querySelector('.editIcon');
  //     const translate = new SvgPoints();
  //     translate.x = points.x - 8;
  //     translate.y = points.y - 8;
  //     (rotationIconGroup as any).setAttribute('transform', `translate(${translate.x}, ${translate.y})`);
  // }
  fitDeleteIcon(tableGroup, points) {
    const rotationIconGroup = tableGroup.querySelector('.deleteIcon');
    const translate = new SvgPoints();
    translate.x = points.x - 8;
    translate.y = points.y - 8;
    (rotationIconGroup as any).setAttribute('transform', `translate(${translate.x}, ${translate.y})`);
  }

  createRotationicon(tableGroup, points) {
    const rotationIconGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    rotationIconGroup.setAttribute('class', 'rotationIcon');
    rotationIconGroup.setAttribute('visibility', 'hidden');
    rotationIconGroup.setAttribute('cursor', 'alias');
    const cir = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    cir.setAttribute('cx', '8');
    cir.setAttribute('cy', '8');
    cir.setAttribute('r', '8');
    cir.setAttribute('fill', 'blue');
    cir.setAttribute('class', 'rotationIcon');
    const icongroup1 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path1.setAttribute('d',
      'M12.5,8.3h-1c0,2-1.6,3.7-3.7,3.7s-3.7-1.6-3.7-3.7s1.6-3.7,3.7-3.7v-1c-2.6,0-4.7,2.1-4.7,4.7S5.3,13,7.9,13   S12.5,10.9,12.5,8.3z');
    path1.setAttribute('fill', '#ffffff');
    icongroup1.appendChild(path1);
    const icongroup2 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', '7.6,2.5 10.7,4.3 7.6,6.1');
    polygon.setAttribute('fill', '#ffffff');
    icongroup2.appendChild(polygon);
    rotationIconGroup.appendChild(cir);
    rotationIconGroup.appendChild(icongroup1);
    rotationIconGroup.appendChild(icongroup2);
    const translate = new SvgPoints();
    translate.x = points.x - 8;
    translate.y = points.y - 8;
    (rotationIconGroup as any).setAttribute('transform', `translate(${translate.x}, ${translate.y})`);
    (tableGroup as any).append(rotationIconGroup);
  }


  createDelete(tableGroup, points) {
    const outerBox = tableGroup.querySelector('.outerspace');
    const point = (outerBox as any).getBBox();
    const midpoint = (this.mainSvg as any).createSVGPoint();
    midpoint.x = point.x + point.width - 20;
    midpoint.y = point.y + point.height - 20;
    const editIconGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    editIconGroup.setAttribute('class', 'deleteIcon');
    editIconGroup.setAttribute('visibility', 'hidden');
    const cir = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    cir.setAttribute('cx', '8');
    cir.setAttribute('cy', '8');
    cir.setAttribute('r', '8');
    cir.setAttribute('fill', 'red');
    cir.setAttribute('class', 'deleteIcon');
    const icongroup1 = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const crossIcon = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    crossIcon.setAttributeNS(null, 'd', 'M16 16 36 36 M36 16 16 36');
    crossIcon.setAttributeNS(null, 'fill', 'none');
    crossIcon.setAttributeNS(null, 'stroke-linecap', 'round');
    crossIcon.setAttributeNS(null, 'style', 'stroke:white;stroke-width:6');
    const scale = 0.3;
    crossIcon.setAttribute('transform', `scale(${scale}, ${scale})`);
    icongroup1.appendChild(crossIcon);
    editIconGroup.appendChild(cir);
    editIconGroup.appendChild(icongroup1);
    const translate = new SvgPoints();

    translate.x = points.x - 8;
    translate.y = points.y - 8;
    (editIconGroup as any).setAttribute('transform', `translate(${translate.x}, ${translate.y})`);
    tableGroup.appendChild(editIconGroup);
  }

  isOverlapPathRotate(tableGroup: SVGElement) {
    const allocatedTable = this.config.tables.find((elem) => elem.id === tableGroup.getAttribute('id'));
    const pathArray = this.rotateTablePath(tableGroup, allocatedTable);
    this.path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.mainSvg.appendChild(this.path2);
    this.mainSvg.appendChild(this.path1);
    this.path1.setAttribute('d', CommonService.buildPathString(pathArray));
    this.path1.setAttribute('fill', 'transparent');
    this.path1.setAttribute('stroke', 'blue');
    let isnotAvailable = false;
    const drag = new MousePosition();
    drag.x = 0;
    drag.y = 0;

    if (!this.checkIsOutsideBoundary(pathArray, allocatedTable, tableGroup, drag).value) {
      isnotAvailable = true;
      this.path1.remove();
      this.path2.remove();
      return isnotAvailable;
    } else if (this.checkIsOverlappingNonSeatingArea(pathArray, allocatedTable, tableGroup, drag)) {
      isnotAvailable = true;
      this.path1.remove();
      this.path2.remove();
      return isnotAvailable;
    } else {
      const shape = this.checkIsOutsideBoundary(pathArray, allocatedTable, tableGroup, drag).shape;
      const tablesGroups = shape.parentElement.querySelectorAll('.tableGroup');
      const tableGroupArray = [] = Array.from(tablesGroups);
      this.selectedTables.forEach(tablegroup => {
        const table = tableGroupArray.find((elem) => elem.getAttribute('id') === tablegroup.getAttribute('id'));
        const index = tableGroupArray.indexOf(table);
        if (index > -1) {
          tableGroupArray.splice(index, 1);
          tableGroupArray.splice(index, 0);
        }
      });

      isnotAvailable = (this.checkInitialOverlapPosible(tableGroupArray, drag, pathArray, allocatedTable, tableGroup));
      this.path1.remove();
      this.path2.remove();
      return isnotAvailable;
    }
  }

  isOverlapPathMove(tableGroup: SVGElement, drag, allocatedTable, type) {
    let isnotAvailable = false;
    const pathArray = this.moveTablePath(tableGroup, allocatedTable, drag);
    const pathTable = this.getTranslatedTablePath(allocatedTable, drag);
    this.path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    this.mainSvg.appendChild(this.path2);
    this.mainSvg.appendChild(this.path1);
    this.path3 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    this.mainSvg.appendChild(this.path3);
    this.path1.setAttribute('d', CommonService.buildPathString(pathArray));
    this.path1.setAttribute('fill', 'transparent');
    this.path1.setAttribute('stroke', 'none');
    if ((!this.checkIsOutsideBoundary(pathArray, allocatedTable, tableGroup, drag).value)
      || !(this.checkIsOutsideBoundary(pathTable, allocatedTable, tableGroup, drag).value)) {
      isnotAvailable = true;
      this.path1.remove();
      this.path2.remove();
      this.path3.remove();
      return isnotAvailable;
    } else if (this.checkIsOverlappingNonSeatingArea(pathArray, allocatedTable, tableGroup, drag)) {
      isnotAvailable = true;
      this.path1.remove();
      this.path2.remove();
      return isnotAvailable;
    } else {
      const shape = this.checkIsOutsideBoundary(pathArray, allocatedTable, tableGroup, drag).shape;
      if (shape) {
        const tablesGroups = shape.parentElement.querySelectorAll('.tableGroup');
        const tableGroupArray = [] = Array.from(tablesGroups);
        this.selectedTables.forEach(tablegroup => {
          const table = tableGroupArray.find((elem) => elem.getAttribute('id') === tablegroup.getAttribute('id'));
          const index = tableGroupArray.indexOf(table);
          if (index > -1) {
            tableGroupArray.splice(index, 1);
            tableGroupArray.splice(index, 0);
          }
        });
        if (type === 'arrangement') {
          isnotAvailable = (this.checkInitialOverlapPosible(tableGroupArray, drag, pathArray, allocatedTable, tableGroup));
        } else {
          isnotAvailable = (this.checkInitialOverlapPosible(tablesGroups, drag, pathArray, allocatedTable, tableGroup));
        }
      }
      this.path1.remove();
      this.path2.remove();
      return isnotAvailable;
    }
  }

  checkInitialOverlapPosible(tablesGroups, drag, pathArray, allocatedTable, tablegroup) {
    const tableGroupArray = [] = Array.from(tablesGroups);
    let isOverlap = false;

    let distance = 0;
    const table1BBox = tablegroup.getBBox();
    const tableTopLeft1 = new MousePosition();
    const tableBottomRight1 = new MousePosition();
    tableTopLeft1.x = table1BBox.x + drag.x;
    tableTopLeft1.y = table1BBox.y + drag.y;
    tableBottomRight1.x = table1BBox.x + table1BBox.width + drag.x;
    tableBottomRight1.y = table1BBox.y + table1BBox.height + drag.y;
    tableGroupArray.forEach(group => {
      let isDistancefound = false;
      if (group.getAttribute('id') !== tablegroup.getAttribute('id')) {
        const table2BBox = group.getBBox();
        const tableTopLeft2 = new MousePosition();
        const tableBottomRight2 = new MousePosition();
        tableTopLeft2.x = table2BBox.x;
        tableTopLeft2.y = table2BBox.y;
        tableBottomRight2.x = table2BBox.x + table2BBox.width;
        tableBottomRight2.y = table2BBox.y + table2BBox.height;
        if (this.doOverlap(tableTopLeft1, tableTopLeft2, tableBottomRight1, tableBottomRight2)) {
          if (this.checkIsOverlappingTable(pathArray, allocatedTable, group, tablegroup)) {
            isOverlap = true;
            isDistancefound = true;
          }
        }
      }
      if (isDistancefound) {
        if (distance <= (table1BBox.width - (this.allocatedDistance.x - table1BBox.x))) {
          distance = (table1BBox.width - (this.allocatedDistance.x - table1BBox.x));
        }
        if (Math.abs(this.minimumHeight) >= Math.abs((table1BBox.height - (this.allocatedDistance.y - table1BBox.y)))) {
          this.minimumHeight = (table1BBox.height - (this.allocatedDistance.y - table1BBox.y));
          this.isMinimumFound = true;
        }
        this.allocatedDistance.x = this.allocatedDistance.x + distance;
      }
      isDistancefound = false;
    });
    return isOverlap;
  }

  moveTablePath(tableGroup, allocatedTable, drag) {
    const table = tableGroup.querySelector('.tables');
    const tableCenterPoint = CommonService.getCenterPosition(table as any);
    let pathArray = _.cloneDeep(allocatedTable.tableShape.pathArray);
    const scale = 1 + (this.settings.tableTableSpace / 20);
    // resize the table
    if (allocatedTable.tableShape.type === 'Circle' || allocatedTable.tableShape.type === 'Oval') {
      const startPoint = tableCenterPoint;
      const points = pathArray.find((point) => point.command === 'A');
      const spoints = pathArray.find((point) => point.command === 'M');
      const currentPosition = new MousePosition();
      currentPosition.x = spoints.x + this.settings.tableTableSpace + points.arcRadiusX;
      currentPosition.y = spoints.y + this.settings.tableTableSpace + points.arcRadiusY;
      pathArray = this.drawCircleBoundary(startPoint, currentPosition, currentPosition);
    } else {
      pathArray.forEach((point) => {
        if (point.command !== 'z') {
          point.x -= tableCenterPoint.x;
          point.y -= tableCenterPoint.y;
          point.x *= scale;
          point.y *= scale;
          point.x += tableCenterPoint.x;
          point.y += tableCenterPoint.y;
        }
      });
    }
    pathArray.forEach(point => {
      if (point.command === 'z') {
      } else {
        point.x = point.x + drag.x;
        point.y = point.y + drag.y;
      }
    });
    return pathArray;
  }

  getTranslatedTablePath(allocatedTable, drag) {
    const pathArray = _.cloneDeep(allocatedTable.tableShape.pathArray);
    pathArray.forEach(point => {
      if (point.command === 'z') {
      } else {
        point.x = point.x + drag.x;
        point.y = point.y + drag.y;
      }
    });
    return pathArray;
  }

  rotateTablePath(tableGroup, allocatedTable) {
    const tableCenterPoint = CommonService.getCenterPosition(tableGroup as any);
    const pathArray = _.cloneDeep(allocatedTable.tableShape.pathArray);
    const scale = 1 + (this.settings.tableTableSpace / 20);
    // resize the table
    pathArray.forEach((point) => {
      if (point.command !== 'z') {
        point.x -= tableCenterPoint.x;
        point.y -= tableCenterPoint.y;
        point.x *= scale;
        point.y *= scale;
        point.x += tableCenterPoint.x;
        point.y += tableCenterPoint.y;
      }
    });
    // rotate the table
    pathArray.forEach(point => {
      if (point.command === 'z') {
      } else {
        const x = point.x;
        const y = point.y;
        // translate point to origin
        const {
          rotatedX, rotatedY
        } = this.getRotatedPoints(x, tableCenterPoint, y);
        // translate back
        point.x = rotatedX + tableCenterPoint.x;
        point.y = rotatedY + tableCenterPoint.y;
      }
    });
    return pathArray;
  }

  checkIsOverlappingNonSeatingArea(pathArray, allocatedTable, tableGroup, drag) {
    let aboveNonSeatingArea = false;
    const getCenterPosition = CommonService.getCenterPosition(tableGroup as any);
    getCenterPosition.x = getCenterPosition.x + drag.x;
    getCenterPosition.y = getCenterPosition.y + drag.y;
    const nonSeatingAreas = Array.from(this.mainGroup.querySelectorAll('.nonSeatingArea'));
    this.facility.shapes.forEach(shapes => {
      if (shapes.nonSeatingArea) {
        shapes.nonSeatingArea.forEach(shape => {
          const shapePathArray = shape.pathArray;
          const nonSeatingArea =
            nonSeatingAreas.find((area) => ((area as any).id).substring(0, ((area as any).id).indexOf('_')) === shape.id);
          const nonSeatingAreaBBox = (nonSeatingArea as any).getBBox();
          const tableBBox = tableGroup.getBBox();
          const nonSeatingTopLeft = (this.mainSvg as any).createSVGPoint();
          nonSeatingTopLeft.x = nonSeatingAreaBBox.x;
          nonSeatingTopLeft.y = nonSeatingAreaBBox.y;
          const nonSeatingBottomRight = (this.mainSvg as any).createSVGPoint();
          nonSeatingBottomRight.x = nonSeatingAreaBBox.x + nonSeatingAreaBBox.width;
          nonSeatingBottomRight.y = nonSeatingAreaBBox.y + nonSeatingAreaBBox.height;
          const tableTopLeft = (this.mainSvg as any).createSVGPoint();
          tableTopLeft.x = tableBBox.x + drag.x;
          tableTopLeft.y = tableBBox.y + drag.y;
          const tableBottomRight = (this.mainSvg as any).createSVGPoint();
          tableBottomRight.x = tableBBox.x + tableBBox.width + drag.x;
          tableBottomRight.y = tableBBox.y + tableBBox.height + drag.y;
          if (this.doOverlap(nonSeatingTopLeft, tableTopLeft, nonSeatingBottomRight, tableBottomRight)) {
            const nonSeatingCenterPosition = CommonService.getCenterPosition(nonSeatingArea as any);
            if (!!nonSeatingArea) {
              if ((shape.shapeType !== 'Circle') && (allocatedTable.tableShape.type === 'Circle')) {

                const point = pathArray.find((p1) => p1.command === 'A');
                const radius = point.arcRadiusX;

                if (this.checkPolygonCircleOverlapping(radius, shapePathArray, getCenterPosition)) {
                  aboveNonSeatingArea = true;
                }

              } else if ((shape.shapeType === 'Circle') && (allocatedTable.tableShape.type === 'Circle')) {
                if (this.isoverlappingBothCircles(pathArray, shapePathArray, getCenterPosition, nonSeatingCenterPosition)) {
                  aboveNonSeatingArea = true;
                }
              } else if ((shape.shapeType === 'Circle') && (allocatedTable.tableShape.type !== 'Circle')) {
                const point = shapePathArray.find((p1) => p1.command === 'A');
                const radius = point.arcRadiusX;

                if (this.checkPolygonCircleOverlapping(radius, pathArray, nonSeatingCenterPosition)) {
                  aboveNonSeatingArea = true;
                }
              } else {
                pathArray.forEach((pathPoint: {
                  x: any; y: any;
                }) => {
                  const point2 = this.mainSvg.createSVGPoint();
                  point2.x = pathPoint.x;
                  point2.y = pathPoint.y;
                  if ((nonSeatingArea as any).isPointInFill(point2)) {
                    aboveNonSeatingArea = true;
                    return aboveNonSeatingArea;
                  }
                });
                shapePathArray.forEach(shapePoint => {
                  const point1 = this.mainSvg.createSVGPoint();
                  point1.x = shapePoint.x;
                  point1.y = shapePoint.y;
                  if ((this.path1 as any).isPointInFill(point1)) {
                    aboveNonSeatingArea = true;
                    return aboveNonSeatingArea;
                  }
                });
              }

            }
          }


        });
      }
    });
    return aboveNonSeatingArea;
  }

  checkIsOutsideBoundary(pathArray, allocatedTable, tableGroup, drag) {
    let isNotOutsideBoundary = true;
    const ShapeArray = Array.from((this.mainSvg.querySelectorAll('.shapes')));
    let shapeFound = null;
    const centerPoint1 = CommonService.getCenterPosition(tableGroup);
    centerPoint1.x = centerPoint1.x + drag.x;
    centerPoint1.y = centerPoint1.y + drag.y;
    ShapeArray.forEach((shape) => {
      let isFill = false;
      if (allocatedTable.tableShape.type !== 'Circle') {
        pathArray.forEach(p => {
          if (p.command !== 'z') {
            const point = (this.mainSvg as any).createSVGPoint();
            point.x = p.x;
            point.y = p.y;
            if (((shape as any).isPointInFill(point))) {
              isFill = true;
            }
          }

        });
      } else {
        const start1 = pathArray.find((point) => point.command === 'M');
        const end1 = pathArray.find((point) => point.command === 'A');
        const center1 = (this.mainSvg as any).createSVGPoint();
        center1.x = (start1.x + end1.x) / 2;
        center1.y = (start1.y + end1.y) / 2;
        if (((shape as any).isPointInFill(center1))) {
          isFill = true;
        }
      }

      if (isFill) {
        shapeFound = shape;
      }

    });
    if (shapeFound) {
      const wallPath = shapeFound.parentElement.querySelector('.wallBoundry');
      const wallCenterPoint = CommonService.getCenterPosition(wallPath);
      const shapeDetails = this.facility.shapes.find((shape) => shape.shapeID === shapeFound.getAttribute('id'));
      const boundryBoxBBox = shapeFound.getBBox();
      const boundryBoxCenterPoint = CommonService.getCenterPosition(shapeFound);
      const boxRadiusX = (boundryBoxBBox.x - boundryBoxCenterPoint.x);
      const boxRadiusY = (boundryBoxBBox.y - boundryBoxCenterPoint.y);
      const scalePointX = (Math.abs(boxRadiusX) - this.settings.wallTableSpace) / Math.abs(boxRadiusX);
      const scalePointY = (Math.abs(boxRadiusY) - this.settings.wallTableSpace) / Math.abs(boxRadiusY);
      const pathPoint = this.getWallPath(shapeDetails, boundryBoxCenterPoint, scalePointX, scalePointY);

      if ((shapeDetails.type !== 'Circle' && allocatedTable.tableShape.type !== 'Circle')
        || (shapeDetails.type === 'Circle' && allocatedTable.tableShape.type !== 'Circle')) {
        pathArray.forEach(p => {
          if (p.command !== 'z') {
            const point = (this.mainSvg as any).createSVGPoint();
            point.x = p.x;
            point.y = p.y;
            if (!(wallPath as any).isPointInFill(point)) {
              isNotOutsideBoundary = false;
            }
          }
        });

      } else if (shapeDetails.type !== 'Circle' && allocatedTable.tableShape.type === 'Circle') {
        const point = pathArray.find((p1) => p1.command === 'A');
        const radius = point.arcRadiusY;
        if (this.checkPolygonCircleOverlapping(radius, pathPoint, centerPoint1)) {
          isNotOutsideBoundary = false;
        }
      } else if (shapeDetails.type === 'Circle' && allocatedTable.tableShape.type === 'Circle') {
        const point = pathArray.find((p1) => p1.command === 'A');
        if (!this.isInsideWallTypeCircle(pathPoint, pathArray, wallCenterPoint, centerPoint1)) {
          isNotOutsideBoundary = false;
        }
      }
    } else {
      isNotOutsideBoundary = false;
    }

    return {
      value: isNotOutsideBoundary,
      shape: shapeFound
    };
  }

  drawCircleBoundary(startPosition: MousePosition, currentPositionX: MousePosition, currentPositionY: MousePosition) {
    const radius = new SvgPoints();
    radius.x = CommonService.getLengthOfTwoPoints(startPosition, currentPositionX);
    radius.y = CommonService.getLengthOfTwoPoints(startPosition, currentPositionY);
    const start = CommonService.circle(startPosition.x, startPosition.y, radius, 359);
    const end = CommonService.circle(startPosition.x, startPosition.y, radius, 0);
    const pathArray = [{
      command: 'M',
      x: start.x,
      y: start.y
    }, {
      command: 'A',
      arcRadiusX: radius.x,
      arcRadiusY: radius.y,
      xAxisRotation: 0,
      largeArcFlag: 1,
      sweepFlag: 0,
      x: end.x,
      y: end.y
    }, {
      command: 'z'
    }];
    return pathArray;
  }

  isoverlappingBothCircles(circle1, circle2, center1, center2) {
    let IsTableOverlap = true;
    const radius1 = circle1.find((point) => point.command === 'A').arcRadiusX;
    const radius2 = circle2.find((point) => point.command === 'A').arcRadiusX;
    const d = CommonService.getLengthOfTwoPoints(center1, center2);
    if (d > (radius1 + radius2)) {
      IsTableOverlap = false;


    }
    return IsTableOverlap;
  }

  isInsideWallTypeCircle(wallPathArray, tablePathArray, wallCenter, tableCenter) {
    let IsTableInside = false;
    const wallRadius = wallPathArray.find((point) => point.command === 'A').arcRadiusX;
    const tableRadius = tablePathArray.find((point) => point.command === 'A').arcRadiusX;
    const d = CommonService.getLengthOfTwoPoints(wallCenter, tableCenter);
    if ((d + tableRadius) < (wallRadius)) {
      IsTableInside = true;
    }
    return IsTableInside;
  }

  checkIsOverlappingTable(pathArray, allocatedTable, tableGroup1, tableGroup2) {
    let isInsideOtherTable = false;
    let distance = 0;
    const shapeArray = _.cloneDeep(this.config.tables);
    let isDistancefound = false;
    const tableInfo = shapeArray.find((shape) => shape.id === (tableGroup1.getAttribute('id')));
    const scaleX = 1 + (this.settings.tableTableSpace / 20);
    let shapePathArray = _.cloneDeep(tableInfo.tableShape.pathArray);
    const centerPoint1 = CommonService.getCenterPosition(tableGroup1 as any);
    shapePathArray.forEach(shapePoint => {
      const point1 = this.mainSvg.createSVGPoint();
      point1.x = shapePoint.x;
      point1.y = shapePoint.y;
      if ((this.path1 as any).isPointInFill(point1)) {
        isInsideOtherTable = true;
        isDistancefound = true;

      }
    });
    if (tableInfo.tableType.shape.type === 'Circle' || tableInfo.tableType.shape.type === 'Oval') {
      const table = tableGroup1.querySelector('.tables');
      const tableCenterPoint = CommonService.getCenterPosition(table);
      const tableBBox = table.getBBox();
      const startPoint = tableCenterPoint;
      const currentPosition = new MousePosition();
      const points = shapePathArray.find((point) => point.command === 'A');
      const spoints = shapePathArray.find((point) => point.command === 'M');
      currentPosition.x = spoints.x + this.settings.tableTableSpace + points.arcRadiusX;
      currentPosition.y = spoints.y + this.settings.tableTableSpace + points.arcRadiusY;

      shapePathArray = this.drawCircleBoundary(tableCenterPoint as any, currentPosition, currentPosition);
    } else {
      shapePathArray.forEach((p) => {
        if (p.command !== 'z') {
          p.x -= centerPoint1.x;
          p.y -= centerPoint1.y;
          p.x *= scaleX;
          p.y *= scaleX;
          p.x += centerPoint1.x;
          p.y += centerPoint1.y;
        }
      });
    }
    this.path2.setAttribute('d', CommonService.buildPathString(shapePathArray));
    this.path2.setAttribute('fill', 'transparent');
    this.path2.setAttribute('stroke', 'red');
    const centerPoint = CommonService.getCenterPosition(this.path1 as any);
    const centerPoint2 = CommonService.getCenterPosition(this.path2 as any);
    const tableBBox2 = (tableGroup1 as any).getBBox();
    if (tableInfo.tableType.shape.type === 'Circle' && allocatedTable.tableShape.type === 'Circle') {
      if (this.isoverlappingBothCircles(pathArray, shapePathArray, centerPoint, centerPoint2)) {
        isInsideOtherTable = true;
        isDistancefound = true;
      }
    } else if ((tableInfo.tableType.shape.type === 'Circle' && allocatedTable.tableShape.type !== 'Circle')) {
      const point = shapePathArray.find((p1) => p1.command === 'A');
      const radius = point.arcRadiusX;
      if (this.checkPolygonCircleOverlapping(radius, pathArray, centerPoint2)) {
        isInsideOtherTable = true;
        isDistancefound = true;
      }
    } else if ((tableInfo.tableType.shape.type !== 'Circle' && allocatedTable.tableShape.type === 'Circle')) {
      const point = pathArray.find((p1) => p1.command === 'A');
      const radius = point.arcRadiusX;

      if (this.checkPolygonCircleOverlapping(radius, shapePathArray, centerPoint)) {
        isInsideOtherTable = true;
        isDistancefound = true;
      }
    } else {
      pathArray.forEach(pathPoint => {
        const point2 = this.mainSvg.createSVGPoint();
        point2.x = pathPoint.x;
        point2.y = pathPoint.y;
        if ((this.path2 as any).isPointInFill(point2)) {
          isInsideOtherTable = true;
          isDistancefound = true;
        }
      });
      shapePathArray.forEach(shapePoint => {
        const point1 = this.mainSvg.createSVGPoint();
        point1.x = shapePoint.x;
        point1.y = shapePoint.y;
        if ((this.path1 as any).isPointInFill(point1)) {
          isInsideOtherTable = true;
          isDistancefound = true;

        }
      });
    }
    if (isDistancefound) {
      if (distance <= (tableBBox2.width - (this.allocatedDistance.x - tableBBox2.x))) {
        distance = (tableBBox2.width - (this.allocatedDistance.x - tableBBox2.x));
      }
      if (Math.abs(this.minimumHeight) >= Math.abs((tableBBox2.height - (this.allocatedDistance.y - tableBBox2.y)))) {
        this.minimumHeight = (tableBBox2.height - (this.allocatedDistance.y - tableBBox2.y));
        this.isMinimumFound = true;
      }
      this.allocatedDistance.x = this.allocatedDistance.x + distance;

    }
    isDistancefound = false;

    return isInsideOtherTable;
  }

  checkPolygonCircleOverlapping(radius, shapePathArray, centerPoints) {
    let next = 0;
    let previous = 0;
    let isOverlap = false;
    for (let index = 1; index < shapePathArray.length; index++) {
      if (index < shapePathArray.length - 1) {
        previous = index - 1;
        next = index;

      } else {
        next = 0;
        previous = index - 1;
      }
      const projectionLength = this.calculateProjectionDistance(centerPoints.x, centerPoints.y,
        shapePathArray[previous].x, shapePathArray[previous].y, shapePathArray[next].x, shapePathArray[next].y);
      if (Math.abs(projectionLength) < radius) {
        isOverlap = true;
      }
    }
    return isOverlap;
  }

  calculateProjectionDistance(x, y, x1, y1, x2, y2) {
    const A = x - x1;
    const B = y - y1;
    const C = x2 - x1;
    const D = y2 - y1;
    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    let param = -1;
    if (len_sq != 0) { // in case of 0 length line
      param = dot / len_sq;
    }

    let xx, yy;

    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    const dx = x - xx;
    const dy = y - yy;
    return Math.sqrt(dx * dx + dy * dy);
  }

  getRotationPoint() {
    let centerPoint;
    this.selectedTables.forEach(table => {
      const point = this.mainSvg.createSVGPoint();
      point.x = this.startPosition.x;
      point.y = this.startPosition.y;
      const tableSpace = table.querySelector('.tableSpace');
      if ((tableSpace as any).isPointInFill(point)) {
        centerPoint = CommonService.getCenterPosition(table);
      }

    });
    return centerPoint;
  }

  lightOrDark(color) {
    let red;
    let green;
    let blue;
    let hsp;
    if (color.match(/^rgb/)) {
      color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);
      red = color[1];
      green = color[2];
      blue = color[3];
    } else {
      color = +('0x' + color.slice(1).replace(
        color.length < 5 && /./g, '$&$&'));

      red = color >> 16;
      green = color >> 8 & 255;
      blue = color & 255;
    }
    hsp = Math.sqrt(
      0.299 * (red * red) +
      0.587 * (green * green) +
      0.114 * (blue * blue)
    );
    if (hsp > 200) {
      return 'light';
    } else {

      return 'dark';
    }
  }
}
