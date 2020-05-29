import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormControl } from '@angular/forms';
import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit } from '@angular/core';
import { SettingsService } from '../../../../shared/services/settings.service';
import { ShapesService } from '../../../../shared/services/shapes.service';
import { TableService } from '../../../services/table.service';
import * as _ from 'lodash';
import {FormTableTypeProperties, PriceBand, TableType} from '../../../../shared/models/Shape';
import {Setting} from '../../../../shared/models/SettingModel';
import {Subscription} from 'rxjs';
import {SHAPE_TOOL_DATA, ShapeTool} from '../../../../shared/data/shape.data';
import {PRICE_BAND} from '../../../../shared/data/priceband.data';
import {ToastrService} from 'ngx-toastr';
import {CommonService} from '../../../../shared/services/common.service';
import { RULERTYPE, ShapeType, TableModelType } from '../../../../shared/models/utils';

enum ButtonClickType {
  seatCountChange,
  lengthChange,
  widthChange,
  radiusChange
}

@Component({
  selector: 'app-create-and-edit-table-modal',
  templateUrl: './create-and-edit-table-modal.component.html',
  styleUrls: ['./create-and-edit-table-modal.component.scss']
})

export class CreateAndEditTableModalComponent implements OnInit, AfterViewInit, OnDestroy {
  shapeType = ShapeType;
  shapeTools: ShapeTool[];
  priceBands: PriceBand[] = PRICE_BAND;
  selectedShape: ShapeType;
  seatsCount = 6;
  table: TableType;
  maxSeatCount = 6;
  allocatedTableData: any;
  tableModelType: TableModelType;
  tableName: string;
  private readonly priceBand: PriceBand;
  private seatDiameter = 20;
  private setting: Setting;
  private settingSubscription: Subscription;
  private propertyPanelHeight: any;
  private componentHeight: number;
  private tablePropertiesFG: FormGroup;
  private tableProperties: FormTableTypeProperties;
  private tableFGSubscription: Subscription;
  private tableNameSubscription: Subscription;
  tableNameArray: any;
  nameError = false;

  constructor(
    public dialogRef: MatDialogRef<CreateAndEditTableModalComponent>,
    private settingService: SettingsService,
    private shapeService: ShapesService,
    private tableService: TableService,
    private elRef: ElementRef,
    private fb: FormBuilder,
    private toastR: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.shapeTools = SHAPE_TOOL_DATA.filter(shape => shape.type !== ShapeType.LINE);
    this.tableModelType = data.type;
    if (this.tableModelType === TableModelType.EDIT_TABLE_TYPE) {
      this.table = data.tableType;
      this.seatsCount = data.tableType.seats.length;
      this.selectedShape = undefined;
      this.maxSeatCount = this.table.seats.length;
    } else {
      this.table = data.tableType;
    }
  }

  ngOnInit() {
    this.componentHeight = (this.elRef.nativeElement as HTMLElement).parentElement.offsetHeight - 35;
    this.settingSubscription = this.settingService.setting$.subscribe((setting) => {
      this.setting = setting;
    });

    this.tableNameSubscription = this.tableService.getAllTables$.subscribe(data => {
      console.log(data);
      this.tableNameArray = data;
      console.log(this.tableNameArray);
    });

    this.initSeatPropertiesForm();
    this.onChanges();
  }

  ngOnDestroy(): void {
    this.settingSubscription.unsubscribe();
    this.tableFGSubscription.unsubscribe();
  }

  onChanges(): void {
    this.tableFGSubscription = this.tablePropertiesFG.valueChanges.subscribe(value => {
      if (this.tablePropertiesFG.valid) {
        this.tableProperties = new FormTableTypeProperties(
          value.radius,
          value.seatCount,
          this.priceBands.find(data => data.id === value.priceBand),
          value.shareType,
          value.tableWidth,
          value.tableLength,
          value.tableRadius
        );
        this.nameError = false;
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < this.tableNameArray.length; i++) {
          if (this.tableNameArray[i].name === value.name) {
            this.nameError = true;
          }
        }
      }
    });
  }

  initSeatPropertiesForm() {

    this.tablePropertiesFG = this.fb.group({
      name: [this.table.name || 'table', [Validators.required]],
      seatCount: [(!!this.table.seats && this.table.seats.length > 0) ?
        this.table.seats.length : this.seatsCount, [Validators.min(1), Validators.max(this.maxSeatCount)]],
      tableLength: [this.table.attributes.length || 0, [Validators.min(0)]],
      tableWidth: [this.table.attributes.width || 0, [Validators.min(0)]],
      tableRadius: [this.table.attributes.radius || 0, [Validators.min(0)]],
      priceBand: [this.priceBands[0].id, Validators.required],
      shareType: [this.table.shareType || 0, [Validators.required]],
    });
    this.tableProperties = new FormTableTypeProperties(
      this.tablePropertiesFG.value.radius,
      this.tablePropertiesFG.value.seatCount,
      this.priceBands.find(data => data.id === this.tablePropertiesFG.value.priceBand),
      this.tablePropertiesFG.value.shareType,
      this.tablePropertiesFG.value.tableWidth,
      this.tablePropertiesFG.value.tableLength,
      this.tablePropertiesFG.value.tableRadius,
    );
    console.log(this.tablePropertiesFG.controls.seatCount.valid);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.propertyPanelHeight = 0;
      const totalHeight = document.getElementById('rightPanel-M').offsetHeight;
      const configHeight = document.getElementById('shape-panel').offsetHeight;
      this.propertyPanelHeight = totalHeight - (configHeight + 40);
    }, 0);
  }

  get TABLE_MODEL_TYPE() {
    return TableModelType;
  }

  get BUTTON_CLICK_TYPE() {
    return ButtonClickType;
  }

  get RULER_TYPE() {
    return RULERTYPE;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave() {
    if (this.tableModelType === TableModelType.CREATE_TABLE_TYPE) {
      this.table.name = this.tablePropertiesFG.value.name;
      this.tableService.createTable(this.table);
    } else if (this.tableModelType === TableModelType.EDIT_TABLE_TYPE) {
      this.table.name = this.tablePropertiesFG.value.name;
      this.tableService.updateTable(this.table);
    } else if (this.tableModelType === TableModelType.DUPLICATE_TABLE_TYPE) {
      this.table.id = CommonService.generateUniqId;
      this.table.name = this.tablePropertiesFG.value.name;
      this.tableService.createTable(this.table);
    }
    this.dialogRef.close();
  }

  onShapeChange(value) {
    this.selectedShape = value;
    this.shapeService.selectedShape$.next(this.selectedShape);
  }

  onTableChange(table: TableType) {
    if (!!table) {
      this.table = table;
      this.tablePropertiesFG.patchValue({
        tableLength: table.attributes.length,
        tableWidth: table.attributes.width,
        tableRadius: table.attributes.radius
      });
    }
  }

  maxSeatCountChange(count) {
    this.maxSeatCount = count;
    if (this.tablePropertiesFG.value.seatsCount > this.maxSeatCount) {
      this.tablePropertiesFG.patchValue({
        seatCount: this.maxSeatCount
      });
    }
    this.tablePropertiesFG.controls.seatCount.setValidators([Validators.min(1), Validators.max(this.maxSeatCount)]);
  }

  onInputDown(id, type: any) {
    document.querySelector(id).stepDown();
    if (type === ButtonClickType.seatCountChange) {
      if (parseInt(document.querySelector(id).value, 10) < 1) {
        this.toastR.error('Should have a minimum 1 seat', 'error');
      }
      this.tablePropertiesFG.patchValue({
        seatCount: parseInt(document.querySelector(id).value, 10) > 1 ?
          parseInt(document.querySelector(id).value, 10) : 1
      });
    }
    if (type === ButtonClickType.lengthChange) {
      this.tablePropertiesFG.patchValue({
        tableLength: parseInt(document.querySelector(id).value, 10)
      });
    }
    if (type === ButtonClickType.widthChange) {
      this.tablePropertiesFG.patchValue({
        tableWidth: parseInt(document.querySelector(id).value, 10)
      });
    }
    if (type === ButtonClickType.radiusChange) {
      this.tablePropertiesFG.patchValue({
        tableRadius: parseInt(document.querySelector(id).value, 10)
      });
    }
  }

  get isFormValid() {
    return true;
  }

  onInputUp(id, type: ButtonClickType) {
    document.querySelector(id).stepUp();
    if (type === ButtonClickType.seatCountChange) {
      if (parseInt(document.querySelector(id).value, 10) > this.maxSeatCount) {
        this.toastR.error('you hit the max seat count', 'error');
      }
      this.tablePropertiesFG.patchValue({
        seatCount: parseInt(document.querySelector(id).value, 10) > this.maxSeatCount ? this.maxSeatCount :
          parseInt(document.querySelector(id).value, 10)
      });
    }
    if (type === ButtonClickType.lengthChange) {
      this.tablePropertiesFG.patchValue({
        tableLength: parseInt(document.querySelector(id).value, 10)
      });
    }
    if (type === ButtonClickType.widthChange) {
      this.tablePropertiesFG.patchValue({
        tableWidth: parseInt(document.querySelector(id).value, 10)
      });
    }
    if (type === ButtonClickType.radiusChange) {
      this.tablePropertiesFG.patchValue({
        tableRadius: parseInt(document.querySelector(id).value, 10)
      });
    }
  }
}
