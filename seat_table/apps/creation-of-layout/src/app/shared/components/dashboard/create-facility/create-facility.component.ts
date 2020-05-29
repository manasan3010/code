import { MatDialog, MatMenu, MatMenuTrigger, MatTreeNestedDataSource } from '@angular/material';
import { ExistingFacilityLayoutModalComponent } from '../../modals/existing-facility-layout-modal/existing-facility-layout-modal.component';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

import { CommonService } from '../../../services/common.service';
import { Controls, ShapeType, RULERTYPE, FacilityType } from '../../../models/utils';
import { ShapesService } from '../../../services/shapes.service';
import { PROPERTIES_DATA, PropertyNode } from '../../../data/properties.data';
import { NestedTreeControl } from '@angular/cdk/tree';
import { ActivatedRoute, Router } from '@angular/router';
import { FacilityService } from '../../../services/facility.service';
import { Facility, Shape } from '../../../models/Shape';
import { Subscription } from 'rxjs';
import { SHAPE_TOOL_DATA, ShapeTool } from '../../../data/shape.data';
import { SettingsService } from '../../../services/settings.service';
import { Setting } from '../../../models/SettingModel';
import { BackgroundImageModalComponent } from '../../modals/background-image-modal/background-image-modal.component';
import { ImageSrc } from '../../../models/Venue';

@Component({
  selector: 'app-create-facility',
  templateUrl: './create-facility.component.html',
  styleUrls: ['./create-facility.component.scss'],
  animations: [
    trigger('myAnimation',
      [
        transition(
          ':enter',
          [
            style({ transform: 'translateY(-30%)', opacity: 0 }),
            animate('300ms',
              style({ transform: 'translateY(0)', opacity: 1 }))
          ]
        ), transition(
          ':leave',
          [
            style({ transform: 'translateY(0)', opacity: 1 }),
            animate('300ms',
              style({ transform: 'translateY(-30%)', opacity: 0 })),
          ]
        )
      ]
    ),
  ]
})

export class CreateFacilityComponent implements OnInit, OnDestroy {
  private temporaryShape: Shape[];
  facilitySubscription: Subscription;
  shapeSubscription: Subscription;
  settingSubscription: Subscription;
  routerSubscription: any;
  heightOfTheScreen: number;
  private controlsSubscription: Subscription;
  backgroundImage: ImageSrc;
  isBGImage = false;


  constructor(
    private dialog: MatDialog,
    private shapeService: ShapesService,
    private activeRoute: ActivatedRoute,
    private facilityService: FacilityService,
    private settingService: SettingsService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.propertyDataSource.data = PROPERTIES_DATA;
    this.shapeTools = SHAPE_TOOL_DATA;
  }

  @ViewChild('nonSeatingAreaChange', { static: false }) nonSeatingAreaChangeMenu: MatMenuTrigger;
  private shapeData = {
    shapes: [],
    selectedShape: undefined,
    shapeGrope: undefined,
    selectedProperty: undefined
  };
  shapeWidthAndHeight = {
    width: '0',
    height: '0'
  };
  private selectedControls: string;
  private selectedProperty: any;
  private facility: Facility;

  isEditableProperty = false;
  searchText = '';
  propertyText = 'Property';

  treeControl = new NestedTreeControl<PropertyNode>(node => node.children);
  propertyDataSource = new MatTreeNestedDataSource<PropertyNode>();

  isFacility = true;
  isProperties = true;

  shapeStyle = {
    fillColor: '#d22741',
    borderColor: '#000000',
  };
  controls = Controls;
  properties = {
    width: 20,
    height: 10
  };
  width: number;
  height: number;
  shapeTypes = ShapeType;
  shapeTools: ShapeTool[];
  selectedShape: string;
  setting: Setting;
  private canAddProperty = false;
  private shapes: Shape[];
  private selectedNonSeatAreaShape = ShapeType.PATH;


  private isMouseMove: boolean;
  private mouseDownPossition: any;
  private startingWidth = 70;
  private toolBarWidth = 70;

  propertyHasChild = (_: number, node: PropertyNode) => !!node.children && node.children.length > 0;



  ngOnInit() {
    this.getScreenWidthAndHeight();
    this.routerSubscription = this.activeRoute.params.subscribe(params => {
      if (params.id) {
        this.facilityService.getFacility(params.id);
      }
    });
    this.facilitySubscription = this.facilityService.selectedFacility$.subscribe(data => {
      if (data !== undefined) {
        this.facility = data;
        if (this.facility.shapes.length > 0) {
          this.shapeService.addShapes(this.facility.shapes);
        }
        if (this.facility.temporaryShape.length > 0) {
          this.shapeService.addTempShape(this.facility.temporaryShape);
        }
      } else {
        this.router.navigate(['../venuemaplayout'], { relativeTo: this.route });
      }
    });
    this.shapeSubscription = this.shapeService.shapes$.subscribe(shapes => {
      if (shapes !== undefined) {
        this.shapes = shapes;
      }
    });
    this.shapeSubscription = this.shapeService.tempShapes$.subscribe(shapes => {
      if (shapes !== undefined) {
        this.temporaryShape = shapes;
      }
    });
    this.controlsSubscription = this.shapeService.selectedControl$.subscribe(shapes => {
      if (shapes !== undefined) {
        this.selectedControls = shapes;
      }
    });
    this.settingSubscription = this.settingService.setting$.subscribe((setting) => {
      this.setting = setting;
    });
    this.shapeService.selectedNonSeatAreaShape$.next(this.selectedNonSeatAreaShape);
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
    this.facilitySubscription.unsubscribe();
    this.shapeSubscription.unsubscribe();
    this.controlsSubscription.unsubscribe();
  }

  get RULERTYPE() {
    return RULERTYPE;
  }
  get FACILITY_TYPE() {
    return FacilityType;
  }

  colorChange() {
    if (this.shapeData !== undefined && !!this.shapeData.selectedShape) {
      this.shapeData.selectedShape.style.fill = this.shapeStyle.fillColor;
      const wallGroup = (this.shapeData.selectedShape.parentElement as any).querySelectorAll('.pointLine');
      wallGroup.forEach((ele: HTMLElement) => {
        ele.style.stroke = CommonService.setLightPercentage(this.shapeStyle.fillColor, 70);
      });
      this.shapes.forEach(shape => {
        if (shape.shapeID === this.shapeData.selectedShape.id) {
          shape.style.fill = this.shapeStyle.fillColor;
          shape.style.stroke = CommonService.setLightPercentage(this.shapeStyle.fillColor, 70);
          this.shapeService.updateShape(shape);
        }
      });
    }
  }

  onPropertySelect(node) {
    if (!node.select) {
      this.selectedShape = undefined;
      this.selectedControls = undefined;
      this.selectedProperty = node;
      this.shapeService.selectedProperty$.next(this.selectedProperty);
      this.shapeService.selectedControl$.next(this.selectedControls);
      this.canAddProperty = true;
      node.select = true;
    } else {
      node.select = false;
    }
    this.propertyDataSource.data.map(x => {
      if (x.id === node.id) {
        x.select = node.select;
      } else {
        x.select = false;
      }
      if (!!x.children && x.children.length > 0) {
        x.children.map(x2 => {
          if (x2.id === node.id) {
            x2.select = node.select;
          } else {
            x2.select = false;
          }
        });
      }

    });
  }
  addExistingFacilityLayout() {
    this.facility.shapes = this.shapes !== undefined ? this.shapes : [];
    const dialogRef = this.dialog.open(ExistingFacilityLayoutModalComponent,
      {
        panelClass: 'custom-dialog-container',
        height: '400px',
        width: '800px',
        data: {
          facility: this.facility
        }
      }
    );

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
                // this.router.navigate(['../venuemaplayout'], { relativeTo: this.route });
      }
    });
  }

  deleteSelectedShapeOrProperty() {
    if (!!this.shapeData) {
      if (this.shapeData.selectedShape) {
        this.shapeData.selectedShape.parentElement.remove();
        this.shapeService.deleteShape(this.shapeData.selectedShape.id);
      } else if (this.shapeData.selectedProperty) {
        this.shapeData.selectedProperty.remove();
        this.shapeService.deleteProperty(this.shapeData.selectedProperty.parentElement.childNodes[0].id, this.shapeData.selectedProperty.id);

      }
    }
  }

  shapeChange(e) {
    this.shapeData = e;
    const value = CommonService.getShapeWidthHeight(e.selectedShape);
    this.shapeWidthAndHeight.height = value.height as string;
    this.shapeWidthAndHeight.width = value.width as string;
    if (e.selectedProperty !== undefined) {
      const propValue = e.selectedProperty.getBBox();
      this.properties.width = propValue.width;
      this.properties.height = propValue.height;
    }
    this.selectedProperty = undefined;
    this.shapeService.selectedProperty$.next(this.selectedProperty);
    this.propertyDataSource.data.map(x => {
      if (!!x.children && x.children.length > 0) {
        x.children.map(x2 => {
          x2.select = false;
        });
      } else {
        x.select = false;
      }
    });
    this.selectedShape = undefined;
  }

  selectShape(shapeType) {
    if (this.selectedShape !== shapeType) {
      this.selectedShape = shapeType;
      this.shapeService.selectedShape$.next(this.selectedShape);
    } else {
      this.selectedShape = null;
      this.shapeService.selectedShape$.next(undefined);
    }

    this.shapeService.selectedProperty$.next(undefined);
    this.shapeService.selectedControl$.next(undefined);
    this.selectedControls = undefined;
  }

  onLongPress(e) {
    const menu = document.getElementById('nonSeatingAreaShapeTrigger');
    menu.click();
  }

  nonSeatingAreaShapeChange(shape) {
    this.selectedNonSeatAreaShape = shape;
    this.shapeService.selectedNonSeatAreaShape$.next(this.selectedNonSeatAreaShape);
  }

  controlSelect(type) {
    if (this.selectedControls === type) {
      this.selectedControls = undefined;
      this.shapeService.selectedControl$.next(null);
    } else if (!this.selectedControls || this.selectedControls !== type) {
      this.selectedControls = type;
      this.shapeService.selectedControl$.next(this.selectedControls);
    }
    this.shapeService.selectedShape$.next(undefined);
    this.shapeService.selectedProperty$.next(undefined);
    this.selectedShape = undefined;
  }


  onConform() {
    this.facility.shapes = this.shapes.reverse() !== undefined ? this.shapes : [];
    this.facility.temporaryShape = this.temporaryShape !== undefined ? this.temporaryShape : [];
    this.facilityService.updateFacility(this.facility);
    this.shapeService.resetShapes();
    this.router.navigate(['../../venuemaplayout'], { relativeTo: this.route });
    this.facilityService.removeLocalStoreData();
    this.shapeService.selectedShape$.next(undefined);
  }

  onClose() {
    this.shapeService.resetShapes();
    this.router.navigate(['../../venuemaplayout'], { relativeTo: this.route });
    this.facilityService.removeLocalStoreData();
  }

  onFlipX() {
    const selectedProperty = this.shapeData.selectedProperty;
    const selectedShape = this.shapeData.selectedShape;
    if (!!selectedProperty) {
      // this.shapeServicFe.onFlipPropertyHorizontal(selectedProperty.parentElement.childNodes[0], selectedProperty);
      this.shapeService.onFlipProperty(selectedProperty.parentElement.childNodes[0], selectedProperty, true);
    } else if (!!selectedShape) {
      this.shapeService.onFlipShape(selectedShape, true);
    }
  }

  onFlipY() {
    const selectedProperty = this.shapeData.selectedProperty;
    const selectedShape = this.shapeData.selectedShape;
    if (!!selectedProperty) {
      // this.shapeService.onFlipPropertyVertical(selectedProperty.parentElement.childNodes[0], selectedProperty);
      this.shapeService.onFlipProperty(selectedProperty.parentElement.childNodes[0], selectedProperty, false, true);
    } else if (!!selectedShape) {
      this.shapeService.onFlipShape(selectedShape, false, true);
    }
  }

  toggleSearchProperty() {
    if (!this.isEditableProperty) {
      this.isEditableProperty = true;
      this.propertyText = '';
    }
  }

  searchProperty() {
    this.searchText = this.propertyText;
  }

  clearSearchField() {
    this.isEditableProperty = false;
    this.propertyText = 'Property';
    this.searchText = null;
  }


  mouseDown($event) {
    this.mouseDownPossition = $event.screenX;
    this.startingWidth = this.toolBarWidth;
    this.isMouseMove = true;
  }

  mouseMove($event) {
    if (this.isMouseMove) {
      const difference = (this.mouseDownPossition - $event.screenX);
      const widthInPixel = this.startingWidth + (difference * 1.33);
      if (widthInPixel <= 200 && widthInPixel >= 70) {
        this.toolBarWidth = widthInPixel;
      }
    }
  }

  mouseUp($event) {
    this.isMouseMove = false;
  }


  getScreenWidthAndHeight() {
    this.heightOfTheScreen = window.innerHeight - 45;
  }

  addBackgroundImage() {
    const dialogRef = this.dialog.open(BackgroundImageModalComponent,
      {
        panelClass: 'custom-dialog-container',
        minHeight: '50%',
        maxHeight: '95%',
        width: '800px'
      }
    );

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.backgroundImage = result.image.base64;
        this.isBGImage = true;
      }
    });
  }

  removeBackgroundImage() {
    this.backgroundImage = null;
  }

}

