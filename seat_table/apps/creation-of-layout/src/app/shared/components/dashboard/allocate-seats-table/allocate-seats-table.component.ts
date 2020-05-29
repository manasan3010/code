import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatMenuTrigger } from '@angular/material';
import { SettingsService } from '../../../services/settings.service';
import { SHAPE_TOOL_DATA, ShapeTool } from '../../../data/shape.data';
import { Component, OnDestroy, OnInit, HostListener, AfterViewInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { FacilityService } from '../../../services/facility.service';
import {
  AllocatedTable,
  Block,
  Config,
  Facility,
  FormSeatsProperties, FormTableTypeProperties,
  PriceBand,
  SelectedTableInfo,
  SvgPoints,
  TableType
} from '../../../models/Shape';
import { CommonService } from '../../../services/common.service';
// tslint:disable-next-line:import-spacing
import { CreateAndEditTableModalComponent }
  from '../../../../table-plan/components/modals/create-and-edit-table-modal/create-and-edit-table-modal.component';
import { Setting } from '../../../models/SettingModel';
import { TableService } from '../../../../table-plan/services/table.service';
import * as _ from 'lodash';
import { SeatService } from '../../../../seat-plan/shared/services/seat.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Guid } from 'guid-typescript';
import { ToastrService } from 'ngx-toastr';
import { PRICE_BAND } from '../../../data/priceband.data';
import { CONFIGTYPE, RULERTYPE, SeatAllocationSelectionType, SeatingRowType, ShapeType, TableModelType  } from '../../../models/utils';

enum ButtonClickType {
  TableCountChange,
  tableStartCountChange,
  seatRadiusChange,
  seatRowCurveChange,
  seatSpacingChange,
  RotationAngleChange,
  allocatedTableSeatCountChange
}

enum ToolBarConfigType {
  DrawSeat,
  DrawBlocks,
  canSelect
}

@Component({
  selector: 'app-allocate-seats-table',
  templateUrl: './allocate-seats-table.component.html',
  styleUrls: ['./allocate-seats-table.component.scss']
})
export class AllocateSeatsTableComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatMenuTrigger, { static: false }) trigger: MatMenuTrigger;

  priceBands: PriceBand[] = PRICE_BAND;
  configs: Config[] = [
    {
      id: 'C001',
      facilityId: '001',
      type: CONFIGTYPE.TABLE,
      name: 'Table Config 1',
    },
    {
      id: 'C002',
      facilityId: '002',
      type: CONFIGTYPE.TABLE,
      name: 'Table Config 2',
    },
    {
      id: 'C003',
      facilityId: '003',
      type: CONFIGTYPE.SEAT,
      name: 'Seat Config 1',
    },
    {
      id: 'C004',
      facilityId: '004',
      type: CONFIGTYPE.SEAT,
      name: 'Seat Config 2'
    }
  ];
  private blockShapes: ShapeTool[];
  private selectedConfig: Config;
  private mainSvg: SVGGraphicsElement;
  private selectedTable: TableType;
  private tables: TableType[] = [];
  private tableDetailForm: FormGroup;
  private draggableToolbar = {
    top: 0,
    left: 0
  };
  private componentHeight: number;
  private propertyPanelHeight = 0;
  private zoomScale = 1;
  private setting: Setting;
  private facility: Facility;
  private selectedTableInfo: SelectedTableInfo;
  private selectedBlockShape = ShapeType.RECTANGLE;
  isSidebarOpen = false;
  canAddTable = false;
  deleteTable = false;
  private routerSubscription: Subscription;
  private facilitySubscription: Subscription;
  private settingSubscription: Subscription;
  private tableSubscription: Subscription;
  seatsPropertiesFG: FormGroup;
  seatsProperties: FormSeatsProperties;
  private seatingSelectionType = SeatAllocationSelectionType.CAN_SELECT_SEATS;
  contextMenuPosition = { x: '0px', y: '0px' };
  private selectedSeatRowType = SeatingRowType.MULTI_ROW_SEATS;
  tablesTypeTables: any;
  selectedId: string;
  private isMultiRowsSelected = false;
  private isMultiSeatsSelected = false;
  private isSingleRowSelected = false;
  private updatedSelectionData: any;
  private selectedSeatCount = 0;
  private seatCount = 0;
  private blocks: Block[];
  private blockSubscription: Subscription;
  AllocatedTablesSunbscription: Subscription;
  tablesCount = 0;
  selectedTables: any;
  selectedTableCount = 0;
  priceband: PriceBand;
  rotatedAngle = 0;
  private svgRootContainer: HTMLElement;
  private canDragToolbar = false;
  private selectedToolBarConfigType = ToolBarConfigType.canSelect;
  pricebandValue: any;
  direction = '';
  color = 'accent';
  tableName: any;
  editTableId: number;
  confiqTables: AllocatedTable[];
  private selectedAllocatedTableForEdit: AllocatedTable;
  private selectedAllocatedTableType4Edit: TableType;
  allocatedTableEditProperties: FormTableTypeProperties;
  allocatedTableEditedSeatCount: any;
  private selectedAllocatedTableMaxSeatCount: number;

  constructor(
    private dialog: MatDialog,
    private activeRoute: ActivatedRoute,
    private facilityService: FacilityService,
    private settingService: SettingsService,
    private router: Router,
    private route: ActivatedRoute,
    private tableService: TableService,
    private seatService: SeatService,
    private ngxService: NgxUiLoaderService,
    private fb: FormBuilder,
    public toastR: ToastrService
  ) {
    this.tableDetailForm = this.fb.group({
      tableCount: [1, [Validators.required, Validators.min(1)]],
      prefix: ['', Validators.maxLength(3)],
      startNumber: [1, [Validators.required, Validators.min(1)]],
      priceBand: [this.priceBands[0].id, Validators.required],
      isDrag: false,
      table: ''
    });
    this.blockShapes = SHAPE_TOOL_DATA.filter(shape => shape.type !== ShapeType.LINE);
  }

  ngOnInit() {
    this.componentHeight = window.innerHeight - 45;
    this.seatService.seatingSelectionType$.next(this.seatingSelectionType);
    this.settingSubscription = this.settingService.setting$.subscribe((setting) => {
      this.setting = setting;
    });
    this.routerSubscription = this.activeRoute.params.subscribe(params => {
      if (params.id) {
        this.facilityService.getFacility(params.id);
      }
    });
    this.facilitySubscription = this.facilityService.selectedFacility$.subscribe(data => {
      if (!!data) {
        this.facility = data;
      }
    });
    if (this.getLocalStoreData()) {
      this.selectedConfig = JSON.parse(localStorage.getItem('configTables'));
    }
    this.initSeatPropertiesForm();
    this.blockSubscription = this.seatService.getBlocks.subscribe(blocks => {
      this.blocks = blocks;
      this.seatCount = 0;
      this.blocks.forEach((block) => {
        block.seatsRow.forEach((row) => {
          this.seatCount += row.seats.length;
        });
        if (block.seatsRow.length !== 0) {
          this.seatsPropertiesFG.patchValue({
            rowStart: CommonService.getSeatRowId(block.seatsRow[block.seatsRow.length - 1], blocks)
          });
        }
      });
    });
    this.selectConfig(this.configs[2]);
    this.tableSubscription = this.tableService.getAllTables$.subscribe(data => {
      this.tables = _.cloneDeep(data);
      if (this.selectedConfig.type === CONFIGTYPE.TABLE) {
        setTimeout(() => {
          this.createShapesForTableList();
        }, 0);
      }
    });
    this.AllocatedTablesSunbscription = this.tableService.getAllAllocatedTables$.subscribe(data => {
      if (data) {
        this.tablesCount = data.tables.length;
        this.confiqTables = data.tables;
      }
    });
    this.onChanges();
  }

  ngOnDestroy(): void {
    this.tableSubscription.unsubscribe();
    this.facilitySubscription.unsubscribe();
    this.settingSubscription.unsubscribe();
    this.blockSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.propertyPanelHeight = 0;
      const totalHeight = document.getElementById('rightPanel').offsetHeight;
      const configHeight = document.getElementById('config-panel').offsetHeight;
      this.propertyPanelHeight = totalHeight - (configHeight + 40);
      this.toolBarPositionChange(this);
    }, 0);
  }

  toolBarPositionChange($event) {
    this.svgRootContainer = document.getElementById('svg-root-container');
    if (!!this.svgRootContainer) {
      const dragElement: any = this.svgRootContainer.querySelector('#draggable-toolBar');
      const dragPoint: any = this.svgRootContainer.querySelector('#dagger-Point');
      if (!!dragPoint && !!dragElement) {
        this.draggableToolbar.left = this.svgRootContainer.offsetWidth - dragPoint.offsetWidth - 10;
        this.draggableToolbar.top = this.svgRootContainer.offsetHeight / 2 - dragElement.offsetHeight / 2;
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.componentHeight = window.innerHeight - 45;
    const totalHeight = document.getElementById('rightPanel').offsetHeight;
    const configHeight = document.getElementById('config-panel').offsetHeight;
    this.propertyPanelHeight = totalHeight - (configHeight + 40);
    this.toolBarPositionChange(this);
  }

  get CONFIG_TYPE() {
    return CONFIGTYPE;
  }

  get TOOLBAR_CONFIG_TYPE() {
    return ToolBarConfigType;
  }

  get BUTTON_CLICK_TYPE() {
    return ButtonClickType;
  }

  get RULER_TYPE() {
    return RULERTYPE;
  }

  get SELECTION_TYPE() {
    return SeatAllocationSelectionType;
  }

  get SHAPE_TYPE() {
    return ShapeType;
  }

  get IS_EDIT_MODE() {
    return this.isMultiRowsSelected || this.isMultiSeatsSelected || this.isSingleRowSelected;
  }

  get SEATING_ROW_TYPE() {
    return SeatingRowType;
  }

  get tf() {
    return this.tableDetailForm.controls;
  }

  initSeatPropertiesForm() {
    this.seatsPropertiesFG = this.fb.group({
      priceBand: [this.priceBands[0].id, Validators.required],
      radius: [5, [Validators.required]],
      curve: [0, [Validators.min(-20), Validators.max(20)]],
      seatSpacing: [3, [Validators.required, Validators.min(1)]],
      rowStart: ['A', [Validators.required]],
      isSeatLabelAsc: [true, [Validators.required]]
    });

    this.seatsProperties = new FormSeatsProperties(
      this.priceBands.find(data => data.id === this.seatsPropertiesFG.value.priceBand),
      this.seatsPropertiesFG.value.radius,
      this.seatsPropertiesFG.value.curve,
      this.seatsPropertiesFG.value.seatSpacing,
      this.seatsPropertiesFG.value.isSeatLabelAsc,
      this.seatsPropertiesFG.value.rowStart,
    );
  }

  onChanges(): void {
    this.seatsPropertiesFG.valueChanges.subscribe(value => {
      this.seatsProperties = new FormSeatsProperties(
        this.priceBands.find(data => data.id === value.priceBand),
        value.radius,
        value.curve,
        value.seatSpacing,
        value.isSeatLabelAsc,
        value.rowStart,
      );
    });
  }

  updateSeatProperties(data: FormSeatsProperties) {
    this.seatsPropertiesFG.patchValue({
      priceBand: !data.priceBand ? '0' : data.priceBand.id,
      radius: data.radius,
      curve: data.curve,
      seatSpacing: data.seatSpacing,
      rowStart: data.rowStart
    });
  }

  switchDirectives() {
    if (this.selectedConfig.type === CONFIGTYPE.TABLE) {
      setTimeout(() => {
        this.createShapesForTableList();
      }, 0);
    }
    if (this.selectedConfig.type === CONFIGTYPE.SEAT) {
      setTimeout(() => {
        this.toolBarPositionChange(this);
      }, 0);
    }
    if (!!this.facility && this.facility.shapes.length > 0) {
      setTimeout(() => {
        this.mainSvg = document.getElementById('mainSvg') as any;
        const group = (this.mainSvg as any).getElementById('shapeGroup');
        if (!!group.querySelector('.facility')) {
          group.querySelector('.facility').remove();
        }
        const shapeGroup = CommonService.createGroupElement(group, null, 'facility');
        this.facility.shapes.forEach(shape => {
          CommonService.createShapeExistingShape(shapeGroup as any, shape, true, true);
        });
      }, 0);
    }
  }

  selectConfig(configuration: Config) {
    this.selectedConfig = configuration;
    this.isSidebarOpen = true;
    this.switchDirectives();
  }


  onLongPress(e, id) {
    const menu = document.getElementById(id);
    menu.click();
  }

  onCreateTable(id = null) {
    this.dialog.open(CreateAndEditTableModalComponent, {
      panelClass: 'create-table-dialog-container',
      data: {
        tableType: !!id ? _.cloneDeep(this.tableService.editTables(id)) : new TableType(Guid.create().toString()),
        type: !!id ? TableModelType.EDIT_TABLE_TYPE : TableModelType.CREATE_TABLE_TYPE
      }
    });
  }

  onDuplicateTable(id) {
    this.dialog.open(CreateAndEditTableModalComponent, {
      panelClass: 'create-table-dialog-container',
      data: {
        tableType: _.cloneDeep(this.tableService.editTables(id)),
        type: TableModelType.DUPLICATE_TABLE_TYPE
      }
    });
  }

  scaleChange(scale) {
    this.zoomScale = Math.round(scale);
    if (this.zoomScale > 1) {
      const labels = this.mainSvg.querySelectorAll('.label');
      labels.forEach(label => {
        label.setAttribute('display', 'block');
      });
      const seatIdElements = Array.from(document.querySelectorAll('.seatID'));
      seatIdElements.forEach((element: any) => {
        element.style.display = 'block';
      });
    } else {
      const labels = this.mainSvg.querySelectorAll('.label');
      labels.forEach(label => {
        label.setAttribute('display', 'none');
      });
      const seatIdElements = Array.from(document.querySelectorAll('.seatID'));
      seatIdElements.forEach((element: any) => {
        element.style.display = 'none';
      });
    }
  }

  loadingStatus(isloading: boolean) {
    if (!isloading) {
      this.ngxService.stop();
    }
  }

  shapeDragStart(event, data) {
    const ele = document.getElementById(data.id);
    ele.style.opacity = '0';
    data.rotatedAngle = 0;
    this.selectedTableInfo = Object.assign({}, {
      tableType: data,
      cover: this.tableDetailForm.value.tableCount,
      startingNumber: this.tableDetailForm.value.startNumber,
      priceband: this.priceBands.find((priceBand) => priceBand.id === this.tableDetailForm.value.priceBand),
      prefix: this.tableDetailForm.value.prefix,
      draggable: true
    });
  }

  shapeDragEnd(event, data) {
    const ele = document.getElementById(data.id);
    const crt: any = ele.cloneNode(true);
    ele.style.opacity = '100';
    this.deleteTable = Object.assign({}, true);
  }

  autoArrangeTableForFacility() {
    this.trigger.closeMenu();
    this.ngxService.start();
    this.selectedTableInfo = Object.assign({}, {
      tableType: this.selectedTable,
      cover: this.tableDetailForm.value.tableCount,
      startingNumber: this.tableDetailForm.value.startNumber,
      priceband: this.priceBands.find((priceBand) => priceBand.id === this.tableDetailForm.value.priceBand),
      prefix: this.tableDetailForm.value.prefix,
      draggable: false
    });
  }

  saveConfiguration() {
    this.router.navigate(['../../venuemaplayout'], { relativeTo: this.route });
  }

  closeConfiguration() {
    this.router.navigate(['../../venuemaplayout'], { relativeTo: this.route });
  }

  createShapesForTableList() {
    this.tables.forEach((table, index) => {
      if (!!table.shape) {
        const svgElement = document.getElementById(`table${table.id}_${index}`);
        const group = CommonService.createGroupElement(svgElement as any, null, 'minShapes');
        CommonService.createShapeExistingShape(group as any, table.shape, false);
        const seatsGroup = CommonService.createGroupElement(group, 'seatsGroup');
        table.seats.forEach(seat => {
          CommonService.createCircleElement(seatsGroup, seat.centerPoint.x, seat.centerPoint.y, seat.radius, 'seats', seat.style.fill);
        });
        const bBox = (group as any).getBBox();
        svgElement.setAttribute('viewBox', `${bBox.x - 10} ${bBox.y - 10} ${bBox.width + 10}, ${bBox.height + 10}`);
      }
    });
  }

  createTableShapeForAllocateTAbleMenu() {
    const svgElement = document.getElementById('allocateMenuSVG');
    CommonService.removeChildElementFromParent(svgElement);
    const group = CommonService.createGroupElement(svgElement as any, 'minShapes', 'minShapes');
    CommonService.createShapeExistingShape(group as any, this.selectedTable.shape, false);
    const seatsGroup = CommonService.createGroupElement(group, 'seatsGroup');
    this.selectedTable.seats.forEach(seat => {
      CommonService.createCircleElement(seatsGroup, seat.centerPoint.x, seat.centerPoint.y, seat.radius, 'seats', seat.style.fill);
    });
    const bBox = (group as any).getBBox();
    svgElement.setAttribute('viewBox', `${bBox.x - 20} ${bBox.y - 20} ${bBox.width + 40}, ${bBox.height + 40}`);
  }

  selectTableType(id) {
    if (this.getLocalStoreData()) {
      let count = 0;
      const configTables = JSON.parse(localStorage.getItem('configTables'));
      if (configTables.facilityId === this.facility.id) {
        const tablesTypeTables = configTables.tables.filter((allocatedTable) => allocatedTable.tableType.id === id);
        count = tablesTypeTables.length;
      }
      return count;

    }
  }

  showTables(id: string) {
    const configTables = JSON.parse(localStorage.getItem('configTables'));
    if (configTables.facilityId === this.facility.id) {
      this.tablesTypeTables = configTables.tables.filter((allocatedTable: { tableType: { id: string; }; }) => allocatedTable.tableType.id === id);
      this.selectedId = id;
    }
  }

  ShowDetails(table: AllocatedTable, isShow) {
    if (isShow) {
      table.isColapsed = false;

    } else {
      table.isColapsed = true;
    }

  }

  getLocalStoreData() {
    const configB = JSON.parse(localStorage.getItem('configTables'));
    return !!configB;

  }


  onAllocateClick(event: MouseEvent, table: TableType) {
    this.selectedTable = _.cloneDeep(table);
    this.canAddTable = true;
    const menu = document.getElementById('tableAllocateModel');
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    menu.click();
    if (!!this.selectedTable) {
      this.createTableShapeForAllocateTAbleMenu();
    }
  }

  onEditAllocatedTable(event: MouseEvent, table: AllocatedTable) {
    this.selectedAllocatedTableForEdit = _.cloneDeep(table);
    this.selectedAllocatedTableType4Edit = new TableType(CommonService.generateUniqId);
    this.selectedAllocatedTableType4Edit.seats = this.selectedAllocatedTableForEdit.seats;
    this.selectedAllocatedTableType4Edit.shape = this.selectedAllocatedTableForEdit.tableShape;
    this.allocatedTableEditedSeatCount = this.selectedAllocatedTableForEdit.seats.length;
    this.selectedAllocatedTableMaxSeatCount = this.allocatedTableEditedSeatCount + 1;
    this.allocatedTableSeatCountChange(this.allocatedTableEditedSeatCount);
    const menu = document.getElementById('allocatedTableEditBtn');
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    menu.click();
  }

  maxSeatCountChangeATable(event: number) {
    if (this.allocatedTableEditedSeatCount > event) {
      this.allocatedTableEditedSeatCount = event;
      this.allocatedTableSeatCountChange(this.allocatedTableEditedSeatCount);
    }
    this.selectedAllocatedTableMaxSeatCount = event;
  }
  onAllocatedTableDataChanges(event: TableType) {
    this.selectedAllocatedTableForEdit.seats = event.seats;
    // this.selectedAllocatedTableForEdit. = event.seats;
  }
  saveAllocatedTableEdit() {
    //    todo add save code here
  }
  menuClosed() {
    this.selectedAllocatedTableForEdit = undefined;
    this.selectedAllocatedTableType4Edit = undefined;
    this.allocatedTableEditProperties = undefined;
    this.allocatedTableEditedSeatCount = undefined;
  }

  allocatedTableSeatCountChange($event: any) {
    if (this.allocatedTableEditedSeatCount !== 0 && this.allocatedTableEditedSeatCount <= this.selectedAllocatedTableMaxSeatCount) {
      this.allocatedTableEditProperties = new FormTableTypeProperties(
        undefined,
        this.allocatedTableEditedSeatCount,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
      );
    }
  }
  onInputDown(id, type: any) {
    document.querySelector(id).stepDown();
    if (type === ButtonClickType.TableCountChange) {
      this.tableDetailForm.patchValue({
        tableCount: parseInt(document.querySelector(id).value, 10)
      });
    } else if (type === ButtonClickType.tableStartCountChange) {
      this.tableDetailForm.patchValue({
        startNumber: parseInt(document.querySelector(id).value, 10)
      });
    } else if (type === ButtonClickType.seatSpacingChange) {
      this.seatsPropertiesFG.patchValue({
        seatSpacing: parseInt(document.querySelector(id).value, 10)
      });
    } else if (type === ButtonClickType.seatRowCurveChange) {
      this.seatsPropertiesFG.patchValue({
        curve: parseInt(document.querySelector(id).value, 10)
      });
    } else if (type === ButtonClickType.seatRadiusChange) {
      this.seatsPropertiesFG.patchValue({
        radius: parseInt(document.querySelector(id).value, 10)
      });
    } else if (type === ButtonClickType.RotationAngleChange) {
      if (this.selectedTables.length >= 1) {
        this.selectedTables.forEach(table => {
          const tables = Array.from(this.mainSvg.querySelectorAll('.tableGroup'));
          const selectedTable = tables.find(t => t.getAttribute('id') === table.id);
          const centerPoint = CommonService.getCenterPosition(selectedTable as any);
          table.rotatedAngle = table.rotatedAngle - 1;
          if (table.rotatedAngle < 0) {
            table.rotatedAngle = 360 + table.rotatedAngle;
          }
          // table.tableShape.pathArray = CommonService.rotatePathPoint(table.tableShape.pathArray, -1, centerPoint);
          // table.seats = CommonService.rotateTableSeats(table.seats, centerPoint, -1);
          // const rotatedAngle = -1;
          const editedTable: AllocatedTable = _.cloneDeep(table);
          editedTable.rotatedAngle = -1;
          this.tableService.editAllocatedTable(editedTable);
        });
      }
      // setTimeout(() => {
      //   this.createShapesForSelectedTables();
      // }, 0);

    } else if (type === ButtonClickType.allocatedTableSeatCountChange && (this.allocatedTableEditedSeatCount - 1) !== 0) {
      this.allocatedTableEditedSeatCount--;
      this.allocatedTableSeatCountChange(this.allocatedTableEditedSeatCount);
    }
  }

  onInputUp(id, type: any) {
    document.querySelector(id).stepUp();
    if (type === ButtonClickType.TableCountChange) {
      this.tableDetailForm.patchValue({
        tableCount: parseInt(document.querySelector(id).value, 10)
      });
    } else if (type === ButtonClickType.tableStartCountChange) {
      this.tableDetailForm.patchValue({
        startNumber: parseInt(document.querySelector(id).value, 10)
      });
    } else if (type === ButtonClickType.seatSpacingChange) {
      this.seatsPropertiesFG.patchValue({
        seatSpacing: parseInt(document.querySelector(id).value, 10)
      });
    } else if (type === ButtonClickType.seatRowCurveChange) {
      this.seatsPropertiesFG.patchValue({
        curve: parseInt(document.querySelector(id).value, 10)
      });
    } else if (type === ButtonClickType.seatRadiusChange) {
      this.seatsPropertiesFG.patchValue({
        radius: parseInt(document.querySelector(id).value, 10)
      });
    } else if (type === ButtonClickType.RotationAngleChange) {
      if (this.selectedTables.length >= 1) {
        this.selectedTables.forEach(table => {
          const tables = Array.from(this.mainSvg.querySelectorAll('.tableGroup'));
          const selectedTable = tables.find(t => t.getAttribute('id') === table.id);
          const centerPoint = CommonService.getCenterPosition(selectedTable as any);
          table.rotatedAngle = table.rotatedAngle + 1;
          if (table.rotatedAngle > 360) {
            table.rotatedAngle = table.rotatedAngle - 360;
          }
          // table.tableShape.pathArray = CommonService.rotatePathPoint(table.tableShape.pathArray, 1, centerPoint);
          // table.seats = CommonService.rotateTableSeats(table.seats, centerPoint, 1);
          // const rotatedAngle = 1;
          const editedTable: AllocatedTable = _.cloneDeep(table);
          editedTable.rotatedAngle = 1;
          this.tableService.editAllocatedTable(editedTable);
        });
      }
      // setTimeout(() => {
      //   this.createShapesForSelectedTables();
      // }, 0);

    } else if (type === ButtonClickType.allocatedTableSeatCountChange &&
      (this.allocatedTableEditedSeatCount + 1) <= this.selectedAllocatedTableMaxSeatCount) {
      this.allocatedTableEditedSeatCount++;
      this.allocatedTableSeatCountChange(this.allocatedTableEditedSeatCount);
    }
  }

  rotateSelectedTable(degree: number) {
    const svgElement = document.getElementById('allocateMenuSVG');
    const mainShape = (svgElement as any).getElementById('minShapes');
    const shapeEle = (mainShape as SVGElement).querySelector(`#${this.selectedTable.shape.shapeID}`);
    const centerPoint = CommonService.getCenterPosition(mainShape as any);
    this.selectedTable.shape.pathArray = CommonService.rotatePathPoint(this.selectedTable.shape.pathArray, degree, centerPoint);
    shapeEle.setAttribute('d', CommonService.buildPathString(this.selectedTable.shape.pathArray));
    const seatsGroup = (mainShape as SVGElement).querySelector(`#seatsGroup`);
    CommonService.removeChildElementFromParent(seatsGroup as any);
    this.selectedTable.seats.forEach(seat => {
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
      const cir = CommonService.createCircleElement(seatsGroup as any, seat.centerPoint.x, seat.centerPoint.y, seat.radius, 'seats', seat.style.fill);
    });
    const bBox = (mainShape as any).getBBox();
    svgElement.setAttribute('viewBox', `${bBox.x - 20} ${bBox.y - 20} ${bBox.width + 40}, ${bBox.height + 40}`);
  }



  createShapesForSelectedTables() {
    this.selectedTables.forEach((table, index) => {
      if (!!table.tableShape) {
        const svgElement = document.getElementById(`table${table.id}_${index}`);
        CommonService.removeChildElementFromParent(svgElement);
        const group = CommonService.createGroupElement(svgElement as any, null, 'minShapes');
        CommonService.createShapeExistingShape(group as any, table.tableShape, false);
        const seatsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        seatsGroup.setAttribute('id', 'seatsGroup');
        group.appendChild(seatsGroup);
        table.seats.forEach(seat => {
          const cir = CommonService.createCircleElement(seatsGroup, seat.centerPoint.x, seat.centerPoint.y, seat.radius, 'seats', seat.style.fill);
        });
        const bBox = (group as any).getBBox();
        svgElement.setAttribute('viewBox', `${bBox.x} ${bBox.y} ${bBox.width}, ${bBox.height}`);
      }
    });
  }

  priceBandChange() {
    if (this.selectedTables.length >= 1) {
      this.selectedTables.forEach(table => {
        table.priceBand = this.priceband;
        table.tableShape.style.fill = this.priceband.color;
        this.tableService.editAllocatedTable(table);
      });
    }
    // setTimeout(() => {
    //   this.createShapesForSelectedTables();
    // }, 0);
  }

  getRotatedAngle(e) {
    if (this.selectedTables.length === 1) {
      this.rotatedAngle = e + this.selectedTables[0].rotatedAngle;
    } else if (this.selectedTables.length > 1) {
      this.rotatedAngle = e;
    }
    if (this.rotatedAngle < 0) {
      this.rotatedAngle = 360 + this.rotatedAngle;
    } else if (this.rotatedAngle >= 360) {
      this.rotatedAngle = this.rotatedAngle - 360;
    }
  }

  onDirectiveUpdate(event) {
    if (!!event.selectedBlock) {
      this.updatedSelectionData = event;
      this.isMultiRowsSelected = (event.selectedRows.length > 0);
      this.isSingleRowSelected = !!event.selectedRow;
      this.isMultiSeatsSelected = event.selectedSeats.length > 0;
      if (this.isMultiRowsSelected) {
        this.selectedSeatCount = 0;
        this.updatedSelectionData.selectedRows.forEach(row => {
          const rowData = this.updatedSelectionData.selectedBlock.seatsRow.find(x => x.id === row.id);
          if (!!rowData) {
            this.selectedSeatCount += rowData.seats.length;
          }
        });
      } else if (this.isSingleRowSelected) {
        this.selectedSeatCount = 0;
        const rowData = this.updatedSelectionData.selectedBlock.seatsRow.find(x => x.id === this.updatedSelectionData.selectedRow.id);
        if (!!rowData) {
          this.selectedSeatCount += rowData.seats.length;
        }
      } else if (this.isMultiSeatsSelected) {
        this.selectedSeatCount = 0;
        this.updatedSelectionData.selectedSeats.forEach(seat => {
          this.selectedSeatCount++;
        });
      } else {
        this.selectedSeatCount = 0;
      }
    }
  }

  decreaseAngle() {
    console.log('longpress');

  }

  onEditAllcatedTable(tableinfo: AllocatedTable) {
    const dialogRef = this.dialog.open(CreateAndEditTableModalComponent, {
      panelClass: 'custom-dialog-container',
      width: '600px',
      data: {
        type: TableModelType.EDIT_ALLOCATED_TABLE,
        allocatedTable: tableinfo
      }
    });
  }


  startDragToolBar() {
    this.canDragToolbar = true;
  }

  toolBarDrag(evt) {
    if (this.canDragToolbar) {
      this.svgRootContainer = document.getElementById('svg-root-container');
      const dragElement: any = this.svgRootContainer.querySelector('#draggable-toolBar');
      const dragPoint: any = this.svgRootContainer.querySelector('#dagger-Point');
      const currentPosition = new SvgPoints();
      currentPosition.x = evt.pageX - this.svgRootContainer.offsetLeft;
      currentPosition.y = evt.pageY - this.svgRootContainer.offsetTop;
      currentPosition.x -= dragPoint.offsetWidth / 2;
      currentPosition.y -= dragPoint.offsetHeight / 2;
      if (currentPosition.x + dragPoint.offsetWidth < this.svgRootContainer.offsetWidth - 10 &&
        currentPosition.y + dragElement.offsetHeight < this.svgRootContainer.offsetHeight - 10) {
        if (currentPosition.x > 10 && currentPosition.y > 10) {
          this.draggableToolbar.left = currentPosition.x;
          this.draggableToolbar.top = currentPosition.y;
        }
      }

    }
  }

  endDragToolBar() {
    this.canDragToolbar = false;
  }

  blockShapeTypeChange(type: ShapeType) {
    this.selectedToolBarConfigType = ToolBarConfigType.DrawBlocks;
    this.selectedBlockShape = type;
    this.seatService.selectedBlockShape$.next(this.selectedBlockShape);
    this.seatService.selectedSeatingRowType$.next(undefined);
    this.seatService.seatingSelectionType$.next(undefined);

  }

  seatingRowTypeChange(type: SeatingRowType) {
    this.selectedToolBarConfigType = ToolBarConfigType.DrawSeat;
    this.selectedSeatRowType = type;
    this.seatService.selectedSeatingRowType$.next(this.selectedSeatRowType);
    this.seatService.selectedBlockShape$.next(undefined);
    this.seatService.seatingSelectionType$.next(undefined);

  }

  seatSelectionTypeChange(type) {
    this.selectedToolBarConfigType = ToolBarConfigType.canSelect;
    this.seatingSelectionType = type;
    this.seatService.seatingSelectionType$.next(this.seatingSelectionType);
    this.seatService.selectedSeatingRowType$.next(undefined);
    this.seatService.selectedBlockShape$.next(undefined);
  }

  changeToolbarConfig(type: ToolBarConfigType) {
    this.selectedToolBarConfigType = type;
    if (type === ToolBarConfigType.canSelect) {
      this.seatService.selectedSeatingRowType$.next(undefined);
      this.seatService.selectedBlockShape$.next(undefined);
      this.seatService.seatingSelectionType$.next(this.seatingSelectionType);
    } else if (type === ToolBarConfigType.DrawSeat) {
      this.seatService.selectedSeatingRowType$.next(this.selectedSeatRowType);
      this.seatService.selectedBlockShape$.next(undefined);
      this.seatService.seatingSelectionType$.next(undefined);
    } else if (type === ToolBarConfigType.DrawBlocks) {
      this.seatService.selectedSeatingRowType$.next(undefined);
      this.seatService.seatingSelectionType$.next(undefined);
      this.seatService.selectedBlockShape$.next(this.selectedBlockShape);
    }
  }

  changePriceBand(e, table) {
    const priceBand = this.priceBands.find(data => data.name === e);
    table.priceBand = priceBand;
    table.tableShape.style.fill = priceBand.color;

    this.tableService.editAllocatedTable(table);
  }

  saveName(table) {
    console.log('editing Table name');
    const found = this.confiqTables.find(t => t.name == table.name);
    this.editTableId = null;
    console.log('searching Table name', found, table.name);

    if (found) {
      this.toastR.error('Table name already exist');
      table.name = this.tableName;
    } else {
      this.tableService.editAllocatedTable(table);
      this.toastR.success('Table name successfully edited');
    }
  }

  cancelEdit(table) {
    this.editTableId = 0;
    table.name = this.tableName;
  }

  atStart(table) {
    this.editTableId = table.id;
    this.tableName = table.name;
  }

  inputKeyPress(e: KeyboardEvent, table) {
    if (!this.tableName.length) {
      return;
    }
    switch (e.key) {
      case 'Escape': {
        this.editTableId = null;
        break;
      }
      case 'Enter': {
        this.editTableId = null;
        break;
      }
      default: {
        break;
      }
    }
  }

  calculateRotateAngle(angle: number): number {
    // console.log('angl2', angle);
    // console.log('Aiyoooo', angle);
    if (angle <= 0) {
      return 360 + angle;
    } else if (angle >= 360) {
      return angle - 360;
    } else {
      return angle;
    }
    // return angle;
  }

  singleTableEdit(angle: number, editedTable: AllocatedTable) {
    // console.log('single table edit is triggering', angle);
    const edTable = _.cloneDeep(editedTable);
    edTable.rotatedAngle = angle
      this.tableService.editAllocatedTable(edTable);

  }
  mulitipleTablesEdit(angle: number) {
    // console.log('multiple table edit is triggering', angle);
    this.selectedTables.forEach(editedTable => {
      const edTable = _.cloneDeep(editedTable);
      edTable.rotatedAngle = this.calculateRotateAngle(angle);
      this.tableService.editAllocatedTable(edTable);
    });
  }

  // changesFromInput(data) {
  //   if (data <= 0) {ngle = 360 + data;
  //   } else if (data >= 360) {
  //     this.rotated
  //     this.rotatedAAngle = data - 360;
  //   } else {
  //     this.rotatedAngle = data;
  //   }
  //   this.rotateTable();

  // }
  // changesFromSingleInput(data: number, table: any) {
  //   if (data <= 0) {
  //     table.rotatedAngle = 360 + data;
  //   } else if (data >= 360) {
  //     table.rotatedAngle = data - 360;
  //   } else {
  //     table.rotatedAngle = data;
  //   }
  //   this.rotateSingleTable(table);

  // }

  // rotateSingleTable(table) {

  //   const tables = Array.from(this.mainSvg.querySelectorAll('.tableGroup'));
  //   const selectedTable = tables.find(t => t.getAttribute('id') === table.id);
  //   const centerPoint = CommonService.getCenterPosition(selectedTable as any);
  //   const rotatedAngle = this.rotatedAngle - table.rotatedAngle;
  //   table.tableShape.pathArray = CommonService.rotatePathPoint(table.tableShape.pathArray, rotatedAngle, centerPoint);
  //   table.seats = CommonService.rotateTableSeats(table.seats, centerPoint, rotatedAngle);

  //   this.tableService.editAllocatedTable(table, rotatedAngle);
  // }

  // rotateTable() {
  //   if (this.selectedTables.length >= 1) {
  //     this.selectedTables.forEach(table => {
  //       if (table.rotatedAngle !== this.rotatedAngle) {
  //         const tables = Array.from(this.mainSvg.querySelectorAll('.tableGroup'));
  //         const selectedTable = tables.find(t => t.getAttribute('id') === table.id);
  //         const centerPoint = CommonService.getCenterPosition(selectedTable as any);
  //         const rotatedAngle = this.rotatedAngle - table.rotatedAngle;
  //         table.tableShape.pathArray = CommonService.rotatePathPoint(table.tableShape.pathArray, rotatedAngle, centerPoint);
  //         table.seats = CommonService.rotateTableSeats(table.seats, centerPoint, rotatedAngle);
  //         this.tableService.editAllocatedTable({ tableOBJ: table, angle: rotatedAngle });
  //       }
  //     });
  //   }
  // }

  selectedTabledetails(selectedTable: AllocatedTable) {
    this.selectedTables = selectedTable;
    this.selectedTableCount = this.selectedTables.length;
    if (this.selectedTables.length === 1) {
      this.priceband = this.selectedTables[0].priceBand;
      this.rotatedAngle = this.selectedTables[0].rotatedAngle;
      this.selectedTables[0].isColapsed = true;
    } else if (this.selectedTables.length > 1) {
      this.priceband = null;
      const angle = this.selectedTables.find(t => t.rotatedAngle !== this.selectedTables[0].rotatedAngle);
      if (!angle) {
        // this.rotatedAngle = this.selectedTables[0].rotatedAngle;
      } else {
        // this.rotatedAngle = 0;
      }
    } else {
      this.rotatedAngle = undefined;
    }
    if (this.selectedTableCount === 0) {
      setTimeout(() => {
        this.createShapesForTableList();
      }, 0);
    } else {
      setTimeout(() => {
        this.createShapesForSelectedTables();
      }, 0);
    }
    this.selectedId = undefined;
  }

}

