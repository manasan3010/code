import { ActivatedRoute, Router } from '@angular/router';
import { OtherStructureService } from '../../../services/other-structure.service';
import { Component, OnDestroy, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Controls, FacilityType, RULERTYPE, ShapeType } from '../../../models/utils';
import { CommonService } from '../../../services/common.service';
import { ShapesService } from '../../../services/shapes.service';
import { Attributes, Facility, Shape } from '../../../models/Shape';
import { Subscription } from 'rxjs';
import { SHAPE_TOOL_DATA, ShapeTool } from '../../../data/shape.data';
import { Setting } from '../../../models/SettingModel';
import { SettingsService } from '../../../services/settings.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MousePosition } from '../../../models/Venue';

@Component({
  selector: 'app-create-other-structure',
  templateUrl: './create-other-structure.component.html',
  styleUrls: ['./create-other-structure.component.scss']
})
export class CreateOtherStructureComponent implements OnInit, OnDestroy {
  @ViewChild('hiddenText', { static: false }) textEl: ElementRef;

  facilityName: string;
  editName = false;
  shapeWidthandHeight = {
    width: '0',
    height: '0'
  };
  length = 0;
  propertyAttributes = new Attributes();
  shapeData;
  shapeStyle = {
    fillColor: '#ff7400',
    borderColor: '#000000',
  };

  setting: Setting;
  ShapeTools: ShapeTool[];
  selectedControls: string;
  selectedShape: string;
  shapes: Shape[];
  otheStructure: any;
  private editMode = false;

  shapeSubscription: Subscription;
  otherStructureSubscription: Subscription;
  routerSubscription: Subscription;
  settingSubscription: Subscription;
  width: number;
  private componentHeight: number;
  private ShapeDimension: FormGroup;
  public isShapeSelected = false;
  private shapeDimensionDetailsForm = new FormGroup({
    width: new FormControl(this.width, Validators.minLength(10))
  });

  maxWidth = 350;
  otherStructureTextWidth = 0;
  private temname;



  shapesize: any;
  constructor(
    private otherStructureService: OtherStructureService,
    private shapeService: ShapesService,
    private settingService: SettingsService,
    private activeRoute: ActivatedRoute,
    private router: Router,
    private route: ActivatedRoute,
    private shapesService: ShapesService,
    private fb: FormBuilder
  ) {
    this.shapeDimensionDetailsForm = this.fb.group({
      width: [1, [Validators.required, Validators.min(1)]],
    });
    this.ShapeTools = SHAPE_TOOL_DATA.filter(shape => shape.type !== ShapeType.LINE);


  }

  get CONTROLS() {
    return Controls;
  }

  get FACILITY_TYPE() {
    return FacilityType;
  }

  ngOnInit() {
    this.componentHeight = window.innerHeight - 45;
    this.facilityName = 'structure_1';
    this.routerSubscription = this.activeRoute.params.subscribe(params => {
      if (params.id) {
        this.editMode = true;
        this.otherStructureService.getOtherStructure(params.id);
      } else {
        this.editMode = false;
      }
    });
    if (this.editMode) {
      this.otherStructureSubscription = this.otherStructureService.otheStructure$.subscribe(data => {
        if (data !== undefined) {
          this.otheStructure = data;
          if (this.otheStructure.shapes.length > 0) {
            this.shapeService.addShapes(this.otheStructure.shapes);
          }
        } else {
          this.router.navigate(['../venuemaplayout'], { relativeTo: this.route });
        }
      });
    }
    this.shapeSubscription = this.shapeService.shapes$.subscribe(shapes => {
      if (shapes !== undefined) {
        this.shapes = shapes;
      }
    });
    this.settingSubscription = this.settingService.setting$.subscribe(data => {
      this.setting = data;
    });

    const textWidth = this.facilityName.length * 6.6;

    if (textWidth < this.maxWidth) {
      this.otherStructureTextWidth = textWidth;
    } else {
      this.otherStructureTextWidth = this.maxWidth;
    }
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
    if (this.otherStructureSubscription !== undefined) {
      this.otherStructureSubscription.unsubscribe();
    }
    this.shapeSubscription.unsubscribe();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.componentHeight = window.innerHeight - 45;
  }
  get RULERTYPE() {
    return RULERTYPE;
  }

  shapeSelect(shapeType: string) {
    this.selectedControls = undefined;
    this.selectedShape = shapeType;
    this.shapesService.selectedShape$.next(this.selectedShape);
  }

  colorChange() {
    if (this.shapeData !== undefined && !!this.shapeData.selectedShape) {
      this.shapeData.selectedShape.style.fill = this.shapeStyle.fillColor;
      const wallGroup = (this.shapeData.selectedShape.parentElement as any).querySelectorAll('.pointLine');
      wallGroup.forEach((ele: HTMLElement) => {
        ele.style.stroke = this.shapeStyle.borderColor;
      });
      this.shapes.forEach(shape => {
        if (shape.shapeID === this.shapeData.selectedShape.id) {
          shape.style.fill = this.shapeStyle.fillColor;
          shape.style.stroke = this.shapeStyle.borderColor;
          this.shapeService.updateShape(shape);
        }
      });
    }
  }

  controlSelect(type) {
    if (type === this.selectedControls) {
      this.selectedControls = undefined;
      console.log('control is selected');

    } else {
      this.selectedControls = type;
      this.shapesService.selectedControl$.next(this.selectedControls);
      this.selectedShape = undefined;
      console.log('control is not selected');

    }
  }

  onEditName() {
    this.editName = true;
    this.temname = this.facilityName;
  }

  onSaveName() {
    if (this.facilityName.length === 0) {
      this.facilityName = this.temname;
    } else {
      this.editName = false;
      this.temname = this.facilityName;
    }

  }

  shapeChange(e) {
    this.shapeData = e;

    if (this.shapeData.selectedShape !== undefined) {
      this.isShapeSelected = true;
    } else {
      this.isShapeSelected = false;
    }
    const value = CommonService.getShapeWidthHeight(e.selectedShape);
    const attributes = CommonService.getShapeAttributes(e.selectedShape);
    this.propertyAttributes.length = attributes.length;
    this.propertyAttributes.height = attributes.height;
    this.shapeWidthandHeight.height = value.height as string;
    this.shapeWidthandHeight.width = value.width as string;
  }

  onSave() {
    if (this.editMode) {
      this.otheStructure.name = this.facilityName;
      this.otheStructure.shapes = this.shapes;
      this.otherStructureService.updateOtherStructure(this.otheStructure);
      this.shapesService.resetShapes();
      this.router.navigate(['../../venuemaplayout'], { relativeTo: this.route });
    } else {
      const facility = new Facility(Math.random().toString(36).slice(-5), this.facilityName, this.shapes);
      this.otherStructureService.createOtherStructure(facility);
      this.shapesService.resetShapes();
      this.router.navigate(['../venuemaplayout'], { relativeTo: this.route });
    }
    this.shapeService.selectedShape$.next(undefined);
  }

  onClose() {
    this.shapeService.resetShapes();
    if (this.editMode) {
      this.router.navigate(['../../venuemaplayout'], { relativeTo: this.route });
    } else {
      this.router.navigate(['../venuemaplayout'], { relativeTo: this.route });
    }
  }

  deleteSelectedShape() {
    if (this.shapeData !== undefined) {
      if (this.shapeData.selectedShape) {
        this.shapeData.selectedShape.parentElement.remove();
        this.shapesService.deleteShape(this.shapeData.selectedShape.id);
      }
    }
  }

  onFlipX() {
    const selectedShape = !!this.shapeData ? this.shapeData.selectedShape : undefined;
    if (!!selectedShape) {
      this.shapeService.onFlipShape(selectedShape, true);
    }
  }

  onFlipY() {
    const selectedShape = !!this.shapeData ? this.shapeData.selectedShape : undefined;
    if (!!selectedShape) {
      this.shapeService.onFlipShape(selectedShape, false, true);
    }
  }

  changeWidth(type: string) {
    const movedPoints = new MousePosition();
    if (type === 'decrease') {
      this.propertyAttributes.length -= 1;
    } else {
      this.propertyAttributes.length += 1;
    }
    this.shapesize = Object.assign({}, {
      width: this.propertyAttributes.length, height: this.propertyAttributes.height
    });

  }
  changeHeight(type) {
    if (type === 'decrease') {
      this.propertyAttributes.height -= 1;
    } else {
      this.propertyAttributes.height += 1;
    }
    this.shapesize = Object.assign({}, {
      width: this.propertyAttributes.length, height: this.propertyAttributes.height
    });


  }
  resizeTables(type) {
    this.shapesize = Object.assign({}, {
      width: this.propertyAttributes.length, height: this.propertyAttributes.height
    });
  }

  checkLength() {
    const textWidth = this.facilityName.length * 6.6;
    if (textWidth > this.maxWidth) {
      this.otherStructureTextWidth = this.maxWidth;
    } else {
      this.otherStructureTextWidth = textWidth;
    }
  }

  atStart() {
    this.editName = true;
    this.temname = this.facilityName;
  }

  cancelEdit() {
    if (this.editName) {
      this.editName = false;
      this.facilityName = this.temname;
      this.checkLength();
    }
  }

  resizeText() {
    const textWidth = this.facilityName.length * 6.6;
    setTimeout(() => {
      if (textWidth < this.maxWidth) {
        this.otherStructureTextWidth = this.textEl.nativeElement.offsetWidth + 2;
      } else {
        this.otherStructureTextWidth = this.maxWidth;
      }
    }, 0);
  }

}
