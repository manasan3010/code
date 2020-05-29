import { Directive, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MousePosition } from '../models/Venue';
import { CommonService } from '../services/common.service';
import { ConfirmModalType, Controls, Properties, PropertyType, RectanglePoints, RULERTYPE, ShapeType } from '../models/utils';
import { CreatePropertyService } from '../services/create-property.service';
import { ShapesService } from '../services/shapes.service';
import { Subscription } from 'rxjs';
import { PropertyNode } from '../data/properties.data';
import { NonSeatingArea, PathPoint, Property, Shape, Style, SvgPoints, Wall } from '../models/Shape';
import { Setting } from '../models/SettingModel';
import { SettingsService } from '../services/settings.service';
import * as _ from 'lodash';
import { IntersectionPoint } from '../models/sampleModels';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material';
import { ConfirmationModalComponent } from '../components/modals/confirmation-modal/confirmation-modal.component';

@Directive({
  selector: '[appCommonFunction]'
})
export class CommonFunctionDirective implements OnInit, OnDestroy {
  @Input() shapeStyle: { fillColor: string, borderColor: string };
  @Input() canAddProperty = false;
  @Output() shapeData = new EventEmitter<any>();
  private svgElement;
  private currentPosition = new MousePosition();
  private propertyWidthAndHeight = {
    width: 20,
    height: 20
  };
  private shape: string;
  private property: PropertyNode;
  private action: string;

  private isAddProperty = false;
  private isDrawShape = false;
  private isResize = false;
  private isDragging = false;
  private isRotate = false;
  private isSetPoint = false;
  private isDrawLine = false;
  private isLineBreak = false;
  private isReshape = false;
  private isPropertyDrag = false;
  private startDraw = false;
  private canAddNewWall = false;
  private isPropertyResize = false;
  private isSetWallPoint = false;
  private isControlKey = false;
  private isMultiShapeSelected = false;
  private canRemoveWall = false;
  private drawNonSeatArea = false;
  private isSetPointForNonSeatingArea = false;
  private nonSeatAreaShape: any;
  private startDrawNonSeatArea = false;
  private canUnMerge = false;
  private isShapeDeepSelect = false;
  private selectedNonSeatingArea: any;
  private isNonSeatAreaSelected = false;
  private isNonSeatAreaResize = false;
  private isNonSeatAreaRotate = false;
  private isNonSeatAreaDrag = false;
  private setting: Setting;
  private settingSubscription: Subscription;
  private initialCoordination: MousePosition;
  private scalePoint: MousePosition = new MousePosition();
  private shapes: Shape[] = [];
  private temporaryShape: Shape[];
  private shapeSubscription: Subscription;
  private selectedShapeSubscription: Subscription;
  private selectedPropertySubscription: Subscription;
  private selectedControlSubscription: Subscription;
  private selectedNonSeatAreaShapeSubscription: Subscription;
  private selectedLineForRemoveWall: SVGElement;
  private facilityShapeElement: SVGGraphicsElement;
  private mainShapeGroup: SVGGraphicsElement;
  private selectionGroup: SVGGraphicsElement;
  private selectedShape: SVGGraphicsElement;
  private multiSelectedShape: SVGGraphicsElement[] = [];
  private multiSelectedShapeGroup: SVGGraphicsElement[] = [];
  private selectedProperty: SVGGraphicsElement;
  private resizeTarget: SVGGraphicsElement;
  private selectedTargetPointIndex: number;
  private rotateAngle: number;
  private selectedWall: any;
  private canChangeCurvePoint: boolean;
  private tempWallObj: Wall;

  @Input('shapeDimension')
  set deleteTable(dimension) {
    if (dimension) {
      this.resizeShape(this.selectedShape, dimension);
      this.shapesService.updateShape(this.getSelectedShapeData());
    }

  }

  constructor(
    private elementRef: ElementRef,
    private createProperty: CreatePropertyService,
    private settingService: SettingsService,
    private shapesService: ShapesService,
    public toastR: ToastrService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this.svgElement = this.elementRef.nativeElement;
    this.mainShapeGroup = this.svgElement.querySelector('#shapeGroup');
    this.shapeSubscription = this.shapesService.shapes$.subscribe((shapes) => {
      this.shapes = shapes;
      const existingShapes: any = Array.from(this.svgElement.querySelectorAll('.shapes'));
      this.shapes.forEach(shape => {
        const index = existingShapes.findIndex(x => x.id === shape.shapeID);
        if (index === -1) {
          CommonService.createShapeExistingShape(this.mainShapeGroup, shape);
        }
      });
    });
    this.selectedShapeSubscription = this.shapesService.selectedShape$.subscribe((shape) => {
      this.shape = !!shape ? shape : undefined;
      this.isDrawShape = !!shape;
    });
    this.selectedNonSeatAreaShapeSubscription = this.shapesService.selectedNonSeatAreaShape$.subscribe(shape => {
      this.nonSeatAreaShape = !!shape ? shape : undefined;
    });
    this.selectedPropertySubscription = this.shapesService.selectedProperty$.subscribe((property) => {
      this.property = !!property ? property : undefined;
      this.isAddProperty = !!property;
    });
    this.selectedControlSubscription = this.shapesService.selectedControl$.subscribe((control) => {
      if (control !== undefined) {
        this.action = control;
        this.canAddNewWall = this.action === Controls.ADD_WALL;
        this.canRemoveWall = this.action === Controls.REMOVE_WALL;
        this.drawNonSeatArea = this.action === Controls.DRAW_NON_SEAT_AREA;
        this.isLineBreak = false;
        if (this.action === Controls.REMOVE_WALL) {
          this.removeSelectedShape();
          this.removeSelection();
        }
        if (this.action === Controls.MERGE_SHAPES) {
          if (this.canUnMerge) {
            const selectedShape = this.shapes.find(shape => shape.shapeID === this.selectedShape.id);
            const groupedShape = this.temporaryShape.filter(shape => shape.groupId === selectedShape.shapeID);
            this.unMergeShape(selectedShape, groupedShape);
          } else {
            const selectedShape = [];
            this.multiSelectedShape.forEach(ele => {
              selectedShape.push(this.shapes.find(shape => shape.shapeID === ele.id));
            });
            if (selectedShape.length > 0) {
              this.mergeSelectedShapes(selectedShape);
            }
          }
        }
      }
    });
    this.settingSubscription = this.settingService.setting$.subscribe(data => {
      this.setting = data;
    });
    this.shapeSubscription = this.shapesService.tempShapes$.subscribe(shapes => {
      this.temporaryShape = !!shapes ? shapes : undefined;
    });
  }

  ngOnDestroy() {
    this.shapeSubscription.unsubscribe();
    this.selectedShapeSubscription.unsubscribe();
    this.selectedControlSubscription.unsubscribe();
    this.selectedPropertySubscription.unsubscribe();
    this.selectedNonSeatAreaShapeSubscription.unsubscribe();
  }

  get IS_POINT_INSIDE_SELECTED_SHAPE() {
    return !!this.selectedShape && !!(this.selectedShape as any).isPointInFill(CommonService.createSVGPoint({
      x: this.currentPosition.x,
      y: this.currentPosition.y
    }));
  }

  get IS_MOUSE_MOVED() {
    const mouseMoved = new MousePosition();
    mouseMoved.x = this.currentPosition.x - this.initialCoordination.x;
    mouseMoved.y = this.currentPosition.y - this.initialCoordination.y;
    if (mouseMoved.x === 0 && mouseMoved.y === 0) {
      return false;
    }
    return true;
  }

  @HostListener('mousedown', ['$event'])
  mouseDown($event) {
    $event.preventDefault();
    this.currentPosition = CommonService.getMousePosition(this.mainShapeGroup, $event);
    if (this.isSetPointForNonSeatingArea) { //  Draw Non Seating Area
      this.initialCoordination = this.currentPosition;
      if ($event.target.classList.contains('PathStarter')) {
        this.endDrawCustomNonSeatingArea(this.facilityShapeElement);
      } else {
        this.drawCustomNonSeatingArea(this.facilityShapeElement, new PathPoint('L', this.currentPosition.x, this.currentPosition.y));
      }
    } else if (this.drawNonSeatArea &&
      this.IS_POINT_IN_SELECTED_SHAPE &&
      !!this.nonSeatAreaShape &&
      ($event.target.classList.contains('pointLine') || $event.target.classList.contains('shapes'))
    ) {
      const guid = CommonService.generateUniqId;
      const shape: NonSeatingArea = new NonSeatingArea(guid, this.nonSeatAreaShape as any, []);
      const shapeIndex = this.shapes.findIndex(x => x.shapeID === this.selectedShape.id);
      !!this.shapes[shapeIndex].nonSeatingArea ?
        this.shapes[shapeIndex].nonSeatingArea.push(shape) : this.shapes[shapeIndex].nonSeatingArea = [shape];
      this.initialCoordination = this.currentPosition;
      const createdShape =
        CommonService.createNonSeatingPathElement(this.selectedShape.parentElement as any, this.selectedShape.id, shape.id.toString());
      createdShape.setAttribute('id', shape.id.toString());
      this.facilityShapeElement = createdShape.querySelector('.nonSeatingArea');
      this.startDrawNonSeatArea = true;
      if (this.nonSeatAreaShape === ShapeType.PATH) {
        this.startDrawNonSeatArea = false;
        this.isSetPointForNonSeatingArea = true;
        this.drawCustomNonSeatingArea(this.facilityShapeElement as any, new PathPoint('M', this.currentPosition.x, this.currentPosition.y));
      }
    } else if (this.isSetPoint) {    // set Path Points
      this.initialCoordination = this.currentPosition;
      if ($event.target.classList.contains('PathStarter')) {
        this.customShapeDrawEnd(this.facilityShapeElement);
      } else {
        this.drawCustomShape(this.facilityShapeElement, new PathPoint('L', this.currentPosition.x, this.currentPosition.y));
      }
    } else
      // Line Draw End
      if (this.isDrawLine && $event.target.classList.contains('pathPoint')) {
        this.isDrawLine = false;
        this.lineDrawEnd(this.facilityShapeElement);
        this.shape = undefined;
      } else
        // set Line points
        if (this.isDrawLine) {
          this.initialCoordination = this.currentPosition;
          const pathPoint = new PathPoint('L', this.currentPosition.x, this.currentPosition.y);
          this.drawLine(this.facilityShapeElement, pathPoint);
        } else
          //
          // Add points for new wall
          //
          if (this.isSetWallPoint && this.IS_POINT_INSIDE_SELECTED_SHAPE) {
            this.initialCoordination = this.currentPosition;
            this.addNewWallPoints(this.selectedShape);
          } else
            //
            // start Draw Shapes
            //
            if (this.shape && this.isDrawShape && this.IS_SHAPE_ON_ACTION) {
              this.initialCoordination = this.currentPosition;
              this.removeSelection();
              this.removeSelectedShape();
              const createdShape = CommonService.createPathElement(this.mainShapeGroup, this.shape);
              this.facilityShapeElement = createdShape.querySelector('.shapes');
              this.startDraw = true;
              if (this.shape === ShapeType.PATH) {
                this.isSetPoint = true;
                this.drawCustomShape(this.facilityShapeElement, new PathPoint('M', this.currentPosition.x, this.currentPosition.y));
              } else if (this.shape === ShapeType.LINE) {
                this.isDrawLine = true;
                this.drawLine(this.facilityShapeElement, new PathPoint('M', this.currentPosition.x, this.currentPosition.y));
              }
            } else
              // Add Property
              if (this.isAddProperty) {
                // add Non wall property
                if ($event.target.classList.contains('pointLine') && this.property.type === PropertyType.WALL_PROPERTY && this.selectedShape) {
                  const line = $event.target;
                  const parentElement = $event.target.parentElement.parentElement;
                  const property = this.createProperty.createWallProperty
                    (parentElement, line, this.currentPosition, this.propertyWidthAndHeight, this.property);
                  const shapeIndex = this.shapes.findIndex(x => x.shapeID === this.selectedShape.id);
                  if (property !== undefined) {
                    !!this.shapes[shapeIndex].properties ?
                      this.shapes[shapeIndex].properties.push(property) : this.shapes[shapeIndex].properties = [property];
                    this.shapesService.updateShape(this.shapes[shapeIndex]);
                  }
                } else
                  // add Non wall property
                  if (this.property.type === PropertyType.NON_WALL_PROPERTY && !!this.selectedShape) {
                    const parentElement = $event.target.parentElement;
                    const property = this.createProperty.createNonWallProperty
                      (parentElement, this.property, this.propertyWidthAndHeight, this.currentPosition);
                    const shapeIndex = this.shapes.findIndex(x => x.shapeID === this.selectedShape.id);
                    // tslint:disable-next-line:max-line-length
                    !!this.shapes[shapeIndex].properties ? this.shapes[shapeIndex].properties.push(property) : this.shapes[shapeIndex].properties = [property];
                    this.shapesService.updateShape(this.shapes[shapeIndex]);
                  }
              } else
                //  move Shape
                if (this.selectedShape && this.selectedNonSeatingArea && $event.target.classList.contains('nonSeatingArea') &&
                  !this.isSetPointForNonSeatingArea &&
                  !this.isSetWallPoint &&
                  !this.canRemoveWall &&
                  !this.drawNonSeatArea &&
                  !this.isControlKey) {
                  this.initialCoordination = this.currentPosition;
                  this.isNonSeatAreaDrag = true;
                  this.removePreviewElements();
                }
    if (this.IS_POINT_IN_SELECTED_SHAPE
      && $event.target.classList.contains('shapes') &&
      !this.isSetPointForNonSeatingArea &&
      !this.isSetWallPoint &&
      !this.canRemoveWall &&
      !this.drawNonSeatArea &&
      !this.isControlKey &&
      !this.canAddNewWall) {
      this.initialCoordination = this.currentPosition;
      this.isDragging = true;
      this.removePreviewElements();
    }
    // Remove selection Shape
    if (($event.target === this.svgElement) && this.IS_SHAPE_ON_ACTION) {
      if ((this.isShapeDeepSelect || this.isNonSeatAreaSelected)) {
        this.isShapeDeepSelect = false;
        this.isNonSeatAreaSelected = false;
        this.selectedNonSeatingArea = undefined;
      }
      this.removeSelection();
      this.removeSelectedShape();
    }
    // Select Shape
    if ($event.target.classList.contains('nonSeatingArea')
      && this.isShapeDeepSelect
      && this.selectedShape
      && this.IS_SHAPE_ON_ACTION) {
      this.selectedNonSeatingArea = $event.target;
      this.selectNonSeatingArea();
    } else if ($event.target.classList.contains('shapes') && this.IS_SHAPE_ON_ACTION && !this.isDrawShape) {
      if ((this.isShapeDeepSelect || this.isNonSeatAreaSelected)) {
        this.isShapeDeepSelect = false;
        this.isNonSeatAreaSelected = false;
        this.selectedNonSeatingArea = undefined;
      }
      if (this.isControlKey) {
        this.multiShapeSelect($event.target);
        this.canUnMerge = false;
      } else {
        this.selectedShape = $event.target;
        this.canUnMerge = this.canUnMergeSelectedShape(this.selectedShape);
        this.reselectShape();
      }
    } else
      // Resize Shape
      if (this.selectedShape && $event.target.classList.contains('selector')
        && this.shape === undefined && !this.canRemoveWall && !this.drawNonSeatArea) {
        this.initialCoordination = this.currentPosition;
        this.resizeTarget = $event.target;
        if (this.isNonSeatAreaSelected) {
          this.isNonSeatAreaResize = true;
        } else {
          this.isResize = true;
        }
      } else
        // Reshape Shape
        if (this.selectedShape && $event.target.classList.contains('reshapePoint')
          && this.shape === undefined && !this.canRemoveWall && !this.drawNonSeatArea) {
          this.initialCoordination = this.currentPosition;
          const target = $event.target;
          const targetPoint = CommonService.getCirclePoint(target);
          const shapeIndex = this.shapes.findIndex(x => x.shapeID === this.selectedShape.id);
          this.selectedTargetPointIndex = this.shapes[shapeIndex].pathArray.findIndex(x => {
            return x.x === targetPoint.x && x.y === targetPoint.y;
          });
          this.isReshape = true;
        } else
          // Rotate Shape
          if (this.selectedShape && $event.target.classList.contains('rotate')
            && !this.canRemoveWall && !this.drawNonSeatArea) {
            this.initialCoordination = this.currentPosition;
            if (this.isNonSeatAreaSelected) {
              this.isNonSeatAreaRotate = true;
            } else {
              this.isRotate = true;
            }
          } else
            // Break shape line
            if (this.action === Controls.BREAK_LINE && !this.canRemoveWall && !this.drawNonSeatArea) {
              if ($event.target.classList.contains('pointLine') && this.selectedShape) {
                this.isLineBreak = true;
                this.breakLine($event.target, this.currentPosition);
                this.deepSelectShape();
              }
            }
    // Property Select
    if ($event.target.classList.contains('property') && this.selectedShape) {
      this.selectedProperty = ($event.target.parentElement);
      this.propertySelect();
    }
    // Property drag
    if ($event.target.classList.contains('propMovePoint') && this.selectedProperty && this.selectedShape) {
      this.isPropertyDrag = true;
      this.initialCoordination = this.currentPosition;
    }
    // property Resize
    if ($event.target.classList.contains('canResize') && this.selectedProperty && this.selectedShape) {
      this.isPropertyResize = true;
      this.initialCoordination = this.currentPosition;
    }
    //  add new Wall to a Shape
    if (this.canAddNewWall && $event.target.classList.contains('shapes') && !this.isSetWallPoint) {
      this.selectedShape = $event.target;
      this.canUnMerge = this.canUnMergeSelectedShape(this.selectedShape);
      this.reselectShape();
      this.isSetWallPoint = true;
      this.initialCoordination = this.currentPosition;
      this.addNewWallPoints(this.selectedShape);
    }
    // Remove Wall
    if (this.canRemoveWall && $event.target.classList.contains('pointLine')) {
      this.removeWallStart($event.target, this.currentPosition);
    }
    if (!this.canAddNewWall && !this.canRemoveWall &&
      !this.drawNonSeatArea && this.isShapeDeepSelect && $event.target.classList.contains('pointLine')) {
      this.selectedWall = $event.target;
      this.selectSingleWall();
    }
    if (this.isShapeDeepSelect && $event.target.classList.contains('curvePoint')) {
      const target = $event.target;
      const targetPoint = CommonService.getCirclePoint(target);
      const shapeIndex = this.shapes.findIndex(x => x.shapeID === this.selectedShape.id);
      this.selectedTargetPointIndex = this.shapes[shapeIndex].pathArray.findIndex(x => {
        return x.x1 === targetPoint.x && x.y1 === targetPoint.y;
      });
      this.canChangeCurvePoint = true;
    }
  }

  @HostListener('mousemove', ['$event'])
  mouseMove($event) {
    $event.preventDefault();
    this.currentPosition = CommonService.getMousePosition(this.mainShapeGroup, $event);
    if (this.startDraw || this.isSetPoint || this.isDrawLine || this.isSetWallPoint || this.isSetPointForNonSeatingArea) {
      if (!(this.setting.rulerType === RULERTYPE.GRID)) {
        if (this.shape !== ShapeType.SQUARE) {
          CommonService.createDrawPreview(this.mainShapeGroup, this.currentPosition);
        }
        this.shapeData.emit({
          selectedShape: this.facilityShapeElement,
          shapeGroup: this.mainShapeGroup,
          selectedProperty: this.selectedProperty
        });
      }
    }
    if (this.startDrawNonSeatArea && this.selectedShape) {
      this.drawShape();
    }
    if (this.isResize && !(this.setting.rulerType === RULERTYPE.GRID) && !(this.selectedShape.id.indexOf(ShapeType.SQUARE) >= 0)) {
      CommonService.createDrawPreview(this.mainShapeGroup, this.currentPosition);
      this.selectedShape.parentElement.querySelector('.wallGroup').setAttribute('display', 'none');
    }
    if (this.isReshape && !(this.setting.rulerType === RULERTYPE.GRID)) {
      CommonService.createDrawPreview(this.mainShapeGroup, this.currentPosition);
      this.changeShapePoint(this.selectedShape, this.selectedTargetPointIndex, this.currentPosition);
    }
    if (this.isPropertyDrag && this.selectedProperty && this.selectedShape) {
      if ((this.selectedProperty).classList.contains('wall') || this.selectedProperty.id.indexOf(PropertyType.WALL_PROPERTY) >= 0) {
        const wallElement = this.getSelectedPropertyWallElement();
        this.dragWallProperty();
        if ($event.target.classList.contains('pointLine')) {
          const selectedShapeData = this.getSelectedShapeData();
          const index = selectedShapeData.walls.find(wall => wall.id === $event.target.id);
          if ($event.target !== wallElement && !!index) {
            this.switchPropertyToWall($event.target, wallElement, this.selectedProperty);
          }
        }
      } else if ((this.selectedProperty).classList.contains('non_wall') || this.selectedProperty.id.indexOf(PropertyType.NON_WALL_PROPERTY) >= 0) {
        const target = this.selectedProperty.querySelector('image');
        this.dragNonWallProperty(target, this.currentPosition);
      }
    }
    if (this.isPropertyResize && this.selectedProperty && this.selectedShape) {
      if ((this.selectedProperty).classList.contains('wall') || this.selectedProperty.id.indexOf(PropertyType.WALL_PROPERTY) >= 0) {
        this.resizeWallProperty(this.selectedProperty, this.initialCoordination, this.currentPosition);
      } else if ((this.selectedProperty).classList.contains('non_wall') || this.selectedProperty.id.indexOf(PropertyType.NON_WALL_PROPERTY) >= 0) {
        const target = this.selectedProperty.querySelector('image');
        this.scaleNonWallProperty(target, this.currentPosition);
      }
    }
    if (this.isNonSeatAreaResize && this.selectedShape) {
      this.startScaling(this.selectedNonSeatingArea, this.currentPosition);
    }
    if (this.isNonSeatAreaDrag && this.selectedShape) {
      this.startDrag(this.selectedNonSeatingArea, this.currentPosition);
    }
    if (this.isNonSeatAreaRotate && this.selectedShape) {
      this.startRotate(this.selectedNonSeatingArea, this.currentPosition);
    }
    if (this.isSetPoint || this.isDrawLine || this.isSetWallPoint || this.isSetPointForNonSeatingArea) {
      CommonService.previewLine(this.initialCoordination, this.currentPosition, this.svgElement);
    }
    if (this.canChangeCurvePoint) {
      this.moveCurvePoint();
    }
    return this.startDraw ? this.drawShape() :
      this.isResize ? this.selectedShape.id.indexOf(ShapeType.CIRCLE) >= 0 || this.selectedShape.id.indexOf(ShapeType.OVAL) >= 0 ?
        this.circleResize(this.selectedShape, this.currentPosition) :
        this.startScaling(this.selectedShape, this.currentPosition) :
        this.isDragging ? this.startDrag(this.selectedShape, this.currentPosition) :
          this.isRotate ? this.startRotate(this.selectedShape, this.currentPosition) :
            null;
  }

  @HostListener('mouseup', ['$event'])
  mouseUp($event) {
    this.removePreviewElements();
    $event.preventDefault();
    this.currentPosition = CommonService.getMousePosition(this.mainShapeGroup, $event);
    if (this.isDrawShape && !this.isSetPoint && !!this.facilityShapeElement) {
      this.isDrawShape = false;
      this.startDraw = false;
      this.shape = undefined;
      const eleDString = this.facilityShapeElement.getAttribute('d');
      if (!!eleDString && eleDString.length > 2) {
        this.facilityShapeElement.setAttribute('fill', this.shapeStyle.fillColor);
        this.facilityShapeElement.setAttribute('stroke', 'none');
        this.selectedShape = this.facilityShapeElement;
        this.updateSelectedShapeData(CommonService.createShapeWalls(this.getSelectedShapeData(), this.selectedShape, this.shapeStyle));
        this.reselectShape();
      } else {
        const shapeIndex = this.shapes.findIndex(x => x.shapeID === this.facilityShapeElement.id);
        this.shapes.splice(shapeIndex, 1);
        this.facilityShapeElement.parentElement.remove();
      }
    }
    if (this.startDrawNonSeatArea && !this.isSetPointForNonSeatingArea && this.selectedShape) {
      this.startDrawNonSeatArea = false;
      if (!!this.facilityShapeElement) {
        this.facilityShapeElement.parentElement.setAttribute('clip-path', `url(#${this.selectedShape.id}clip)`);
      }
      this.facilityShapeElement.setAttribute('fill', 'url(#pattern_non_seating)');
      this.facilityShapeElement.setAttribute('stroke', 'black');
      this.removeSelection();
    }
    if (this.isResize && this.selectedShape) {
      if (this.IS_MOUSE_MOVED) {
        if (!(this.selectedShape.id.indexOf(ShapeType.CIRCLE) >= 0 || this.selectedShape.id.indexOf(ShapeType.OVAL) >= 0)) {
          this.endScaling(this.selectedShape);
        }
      }
      this.isResize = false;
      this.selectedShape.parentElement.querySelector('.wallGroup').removeAttribute('display');
      this.shapesService.updateShape(this.getSelectedShapeData());
    }
    if (this.isNonSeatAreaResize && this.selectedShape && this.selectedNonSeatingArea) {
      if (this.IS_MOUSE_MOVED) {
        const startPointTarget = CommonService.getScaleStartPoint(this.svgElement, this.resizeTarget);
        const startPoint = CommonService.getCirclePoint(startPointTarget) || undefined;
        this.scaleSingleNonSeatingArea(startPoint, this.scalePoint);
      }
      this.isNonSeatAreaResize = false;
      this.selectedNonSeatingArea.parentElement.setAttribute('clip-path', `url(#${this.selectedShape.id}clip)`);

    }
    if (this.isNonSeatAreaRotate && this.selectedShape && this.selectedNonSeatingArea) {
      this.isNonSeatAreaRotate = false;
      const centerPoint = CommonService.getCenterPosition(this.selectedNonSeatingArea);
      this.rotateSingleNonSeatingArea(centerPoint);
      this.selectedNonSeatingArea.parentElement.setAttribute('clip-path', `url(#${this.selectedShape.id}clip)`);
    }
    if (this.isNonSeatAreaDrag && this.selectedShape && this.selectedNonSeatingArea) {
      this.isNonSeatAreaDrag = false;
      this.translateNonSeatingArea();
      this.selectedNonSeatingArea.parentElement.setAttribute('clip-path', `url(#${this.selectedShape.id}clip)`);
    }
    if (this.isReshape && this.selectedShape) {
      this.isReshape = false;
      this.updateSelectedShapeData(CommonService.createShapeWalls(this.getSelectedShapeData(), this.selectedShape, this.shapeStyle));
      this.reselectShape();
      this.shapesService.updateShape(this.getSelectedShapeData());
    }
    if (this.isDragging && this.selectedShape) {
      if (this.IS_MOUSE_MOVED) {
        this.endDrag(this.selectedShape, this.currentPosition);
        this.shapesService.updateShape(this.getSelectedShapeData());
      }
      this.isDragging = false;
    }
    if (this.isRotate && this.selectedShape) {
      this.endRotate(this.selectedShape);
      this.isRotate = false;
      this.shapesService.updateShape(this.getSelectedShapeData());
    }
    if (this.isPropertyDrag && this.selectedShape && this.selectedProperty) {
      this.isPropertyDrag = false;
      if (this.selectedProperty.classList.contains('wall')) {
        this.dragPropertyEnd();
      }
      this.shapesService.updateShape(this.getSelectedShapeData());
    }
    if (this.isPropertyResize && this.selectedShape && this.selectedProperty) {
      this.isPropertyResize = false;
    }
    if (this.canChangeCurvePoint) {
      this.canChangeCurvePoint = false;
      this.updateSelectedShapeData(CommonService.createShapeWalls(this.getSelectedShapeData(), this.selectedShape, this.shapeStyle));
      this.deepSelectShape();
    }
  }

  @HostListener('dblclick', ['$event'])
  dblClick($event) {
    if (!!this.selectedShape && this.IS_SHAPE_ON_ACTION) {
      if (this.getSelectedShapeData() && this.getSelectedShapeData().type !== ShapeType.CIRCLE) {
        this.shapesService.selectedControl$.next(Controls.SELECT);
        this.deepSelectShape();
      }
    }
    if (this.isShapeDeepSelect && $event.target.classList.contains('pointLine')) {
      const shapeData = this.getSelectedShapeData();
      const index = shapeData.walls.findIndex(wall => wall.id === $event.target.id);
      if (index > -1) {
        const dialogRef = this.dialog.open(ConfirmationModalComponent, {
          panelClass: 'custom-dialog-container',
          width: '400px',
          data: {
            title: 'Delete Confirmation',
            bodyText: 'Are sure you want to delete this shape wall',
            confirmButton: true,
            confirmButtonText: 'Delete',
            modalType: ConfirmModalType.DELETE
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            $event.target.parentElement.remove();
            shapeData.walls.splice(index, 1);
          }
        });
      }
    }
    if (this.isSetWallPoint && this.canAddNewWall && this.IS_POINT_INSIDE_SELECTED_SHAPE) {
      this.isSetWallPoint = this.canAddNewWall = false;
      this.svgElement.querySelector('#previewLine').remove();
      const shapeGroup: HTMLElement = this.selectedShape.parentElement;
      const shapeData = this.getSelectedShapeData();
      const existingWalls = shapeGroup.querySelector(`#wallGroup_${shapeData.shapeID}`);
      shapeData.walls.splice(shapeData.walls.length - 1, 1);
      existingWalls.children[existingWalls.children.length - 1].remove();
      this.updateSelectedShapeData(shapeData);
      this.tempWallObj = undefined;
      this.removePreviewElements();
      this.shapesService.selectedControl$.next(Controls.SELECT);
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardDownEvent(event: KeyboardEvent) {
    this.isControlKey = event.ctrlKey;
    if (event.key === 'Delete' && this.IS_SHAPE_ON_ACTION) {
      if (!!this.selectedShape && !!this.selectedNonSeatingArea) {
        this.selectedNonSeatingArea.parentElement.remove();
        this.shapesService.deleteSeatingArea(this.selectedShape.id, this.selectedNonSeatingArea.id);
        this.selectedNonSeatingArea = undefined;
      } else if (!!this.selectedShape) {
        this.selectedShape.parentElement.remove();
        this.shapesService.deleteShape(this.selectedShape.id);
        this.selectedShape = undefined;
      } else if (!!this.selectedProperty) {
        this.selectedProperty.remove();
        const shape: any = this.selectedProperty.parentElement.childNodes[0];
        this.shapesService.deleteProperty(shape.id, this.selectedProperty.id);
        this.selectedProperty = undefined;
      }
    }
    if (this.isControlKey && event.code === 'KeyD' && this.selectedShape) {
      event.preventDefault();
      this.duplicateShape();
    }
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardUpEvent(event: KeyboardEvent) {
    this.isControlKey = event.ctrlKey;
    this.isMultiShapeSelected = false;
  }

  private selectSingleWall() {
    if (!!this.selectedWall) {
      const shapeData = this.getSelectedShapeData();
      if (!!shapeData) {
        const wallData = shapeData.walls.find(wall => wall.id === this.selectedWall.id);
        const curvePoint = wallData.pathArray.find(point => point.command !== 'M');
        const curveRootPoint = _.cloneDeep(CommonService.getCenterPosition(this.selectedWall));
        if (!!curvePoint) {
          shapeData.pathArray.forEach(point => {
            if (point.x === curvePoint.x && point.y === curvePoint.y) {
              if (point.command === 'L') {
                point.command = 'Q';
                point.x1 = curveRootPoint.x;
                point.y1 = curveRootPoint.y;
              }
            }
          });
          this.deepSelectShape();
        }
      }
    }
  }

  private moveCurvePoint() {
    const shapeData = this.getSelectedShapeData();
    shapeData.pathArray[this.selectedTargetPointIndex].y1 = this.currentPosition.y;
    shapeData.pathArray[this.selectedTargetPointIndex].x1 = this.currentPosition.x;
    this.selectedShape.setAttribute('d', CommonService.buildPathString(shapeData.pathArray));
    const shapeIndex = this.shapes.findIndex(x => x.shapeID === this.selectedShape.id);
    this.shapes[shapeIndex] = shapeData;
    this.deepSelectShape();
  }

  private duplicateShape() {
    const shape: Shape = _.cloneDeep(this.getSelectedShapeData());
    const shapeId = shape.shapeID;
    const shapeNumber = parseInt(shapeId.match(/\d+/)[0], 10);
    shape.shapeID = `${shape.type}_shape_${shapeNumber + 50}`;
    const newShape: Shape = {
      shapeID: shape.shapeID,
      pathArray: shape.pathArray,
      isShapeGrouped: false,
      type: shape.type,
      walls: shape.walls,
      properties: undefined,
      style: new Style(this.shapeStyle.fillColor, this.shapeStyle.borderColor, 2, 1),
      visibility: true
    };
    this.shapes.push(newShape);
    this.shapesService.addShapes(this.shapes);
  }

  private drawShape() {
    if (this.startDrawNonSeatArea) {
      return this.nonSeatAreaShape === ShapeType.RECTANGLE ?
        this.drawNonSeatRectangle(this.facilityShapeElement, this.initialCoordination, this.currentPosition) :
        this.nonSeatAreaShape === ShapeType.SQUARE ?
          this.drawNonSeatSquare(this.facilityShapeElement, this.initialCoordination, this.currentPosition) :
          this.nonSeatAreaShape === ShapeType.CIRCLE ?
            this.drawNonSeatCircle(this.facilityShapeElement, this.initialCoordination, this.currentPosition) :
            null;
    }
    return this.shape === ShapeType.RECTANGLE ?
      this.drawRectangle(this.facilityShapeElement, this.initialCoordination, this.currentPosition) :
      this.shape === ShapeType.SQUARE ? this.drawSquare(this.facilityShapeElement, this.initialCoordination, this.currentPosition) :
        this.shape === ShapeType.CIRCLE ? this.drawCircle(this.facilityShapeElement, this.initialCoordination, this.currentPosition) :
          null;


  }

  private drawRectangle(element: SVGGraphicsElement, startPosition: MousePosition, currentPosition: MousePosition) {
    const shapeIndex = this.shapes.findIndex(x => x.shapeID === element.id);
    const shape: Shape = {
      shapeID: element.id,
      pathArray: CommonService.createRectanglePathPoint(startPosition, currentPosition),
      isShapeGrouped: false,
      type: ShapeType.RECTANGLE,
      walls: [],
      properties: undefined,
      style: new Style(this.shapeStyle.fillColor, this.shapeStyle.borderColor, 2, 1),
      visibility: true
    };
    shapeIndex === -1 ? this.shapesService.createNewShape(shape) : this.shapesService.updateShape(shape);
    element.setAttribute('d', CommonService.buildPathString(shape.pathArray));
  }

  private drawSquare(element: SVGGraphicsElement, startPosition: MousePosition, currentPosition: MousePosition) {
    const lengthSquare = Math.sqrt(Math.pow((startPosition.x - currentPosition.x), 2)
      + Math.pow((startPosition.y - currentPosition.y), 2)) * Math.cos(45);
    const shape: Shape = {
      shapeID: element.id,
      pathArray: [],
      walls: [],
      isShapeGrouped: false,
      type: ShapeType.SQUARE,
      style: new Style(this.shapeStyle.fillColor, this.shapeStyle.borderColor, 2, 1),
      properties: undefined,
      visibility: true

    };
    shape.pathArray = CommonService.createSquarePathPoint(startPosition, currentPosition, lengthSquare);
    const shapeIndex = this.shapes.findIndex(x => x.shapeID === element.id);
    shapeIndex === -1 ? this.shapesService.createNewShape(shape) : this.shapesService.updateShape(shape);
    if (this.shapes[shapeIndex] !== undefined && shape) {
      element.setAttribute('d', CommonService.buildPathString(this.shapes[shapeIndex].pathArray));
    }
  }

  private drawCircle(element: SVGGraphicsElement, startPosition: MousePosition, currentPosition: MousePosition) {
    const radius = new SvgPoints();
    radius.x = radius.y = CommonService.getLengthOfTwoPoints(startPosition, currentPosition);
    const start = CommonService.circle(startPosition.x, startPosition.y, radius, 359);
    const end = CommonService.circle(startPosition.x, startPosition.y, radius, 0);
    const shapeIndex = this.shapes.findIndex(x => x.shapeID === element.id);
    //  A rx ry x-axis-rotation large-arc-flag sweep-flag x y
    const shape: Shape = {
      shapeID: element.id,
      properties: undefined,
      type: ShapeType.CIRCLE,
      walls: [],
      style: new Style(this.shapeStyle.fillColor, this.shapeStyle.borderColor, 2, 1),
      pathArray: [
        { command: 'M', x: start.x, y: start.y },
        { command: 'A', arcRadiusX: radius.x, arcRadiusY: radius.y, xAxisRotation: 0, largeArcFlag: 1, sweepFlag: 0, x: end.x, y: end.y },
        { command: 'z' }
      ],
      isShapeGrouped: false,
      visibility: true
    };
    element.setAttribute('d', CommonService.buildPathString(shape.pathArray));
    shapeIndex === -1 ? this.shapesService.createNewShape(shape) : this.shapesService.updateShape(shape);
    element.setAttribute('stroke', 'black');
  }

  private drawCustomShape(element: SVGGraphicsElement, point) {
    const shapeIndex = this.shapes.findIndex(x => x.shapeID === element.id);
    const shape: Shape = {
      shapeID: element.id,
      pathArray: [point],
      type: ShapeType.PATH,
      style: new Style(this.shapeStyle.fillColor, this.shapeStyle.borderColor, 2, 1),
      walls: [],
      properties: undefined,
      isShapeGrouped: false,

      visibility: true
    };
    if (shapeIndex === -1) {
      this.shapesService.createNewShape(shape);
    } else {
      this.shapes[shapeIndex].pathArray.push(point);
      this.shapesService.updateShape(this.shapes[shapeIndex]);
    }
    if (this.shapes[shapeIndex] !== undefined) {
      element.setAttribute('d', CommonService.buildPathString(this.shapes[shapeIndex].pathArray));
      element.setAttribute('fill', 'none');
      element.setAttribute('stroke', 'black');
      this.removeSelection();
      this.selectionGroup = CommonService.setPathPoints(this.svgElement, this.shapes[shapeIndex].pathArray);
    }

  }

  private drawCustomNonSeatingArea(element: SVGGraphicsElement, point) {
    const shapeIndex = this.shapes.findIndex(x => x.shapeID === this.selectedShape.id);
    if (!!this.shapes[shapeIndex].nonSeatingArea) {
      const nonSeatingAreaIndex = this.shapes[shapeIndex].nonSeatingArea.findIndex(x => element.id.indexOf(x.id) >= 0);
      if (nonSeatingAreaIndex !== -1) {
        this.removeSelection();
        this.shapes[shapeIndex].nonSeatingArea[nonSeatingAreaIndex].pathArray.push(point);
        this.shapesService.updateShape(this.shapes[shapeIndex]);
        element.setAttribute('d',
          CommonService.buildPathString(this.shapes[shapeIndex].nonSeatingArea[nonSeatingAreaIndex].pathArray));
        element.setAttribute('fill', 'none');
        element.setAttribute('stroke', 'black');
        this.selectionGroup = CommonService.setPathPoints(this.svgElement, this.shapes[shapeIndex].nonSeatingArea[nonSeatingAreaIndex].pathArray);
      }
    }

  }

  private endDrawCustomNonSeatingArea(element: SVGGraphicsElement) {
    const shapeIndex = this.shapes.findIndex(x => x.shapeID === this.selectedShape.id);
    if (!!this.shapes[shapeIndex].nonSeatingArea) {
      const nonSeatingAreaIndex = this.shapes[shapeIndex].nonSeatingArea.findIndex(x => element.id.indexOf(x.id) >= 0);
      this.shapes[shapeIndex].nonSeatingArea[nonSeatingAreaIndex].pathArray.push({ command: 'z' });
      element.setAttribute('d', CommonService.buildPathString(this.shapes[shapeIndex].nonSeatingArea[nonSeatingAreaIndex].pathArray));
      element.parentElement.setAttribute('clip-path', `url(#${this.selectedShape.id}clip)`);
      element.setAttribute('fill', 'url(#pattern_non_seating)');
      element.setAttribute('stroke', 'black');
      const previewLine = this.svgElement.querySelector('#previewLine');
      if (!!previewLine) {
        previewLine.remove();
      }
      this.facilityShapeElement = undefined;
      this.isSetPointForNonSeatingArea = false;
      this.removeSelection();
    }
  }

  private drawLine(element: SVGGraphicsElement, point) {
    this.removeSelection();
    const shapeIndex = this.shapes.findIndex(x => x.shapeID === element.id);
    const shape: Shape = {
      shapeID: element.id,
      type: ShapeType.LINE,
      style: new Style('transparent', this.shapeStyle.borderColor, 2, 1),
      pathArray: [point],
      walls: [],
      isShapeGrouped: false,
      properties: undefined,
      visibility: true
    };
    if (shapeIndex === -1) {
      this.shapesService.createNewShape(shape);
    } else {
      this.shapes[shapeIndex].pathArray.push(point);
      this.shapesService.updateShape(this.shapes[shapeIndex]);
    }
    if (this.shapes[shapeIndex] !== undefined) {
      element.setAttribute('d', CommonService.buildPathString(this.shapes[shapeIndex].pathArray));
      element.setAttribute('fill', 'none');
      element.setAttribute('stroke-width', '2px');
      element.setAttribute('stroke', 'black');
      this.selectionGroup = CommonService.setPathPoints(this.svgElement, this.shapes[shapeIndex].pathArray);
    }
  }

  private customShapeDrawEnd(element: SVGGraphicsElement) {
    this.isSetPoint = false;
    this.startDraw = false;
    this.shape = undefined;
    this.selectedShape = this.svgElement.querySelector(`#${element.id}`);
    const shapeIndex = this.shapes.findIndex(x => x.shapeID === element.id);
    const point = _.cloneDeep(this.shapes[shapeIndex].pathArray[0]);
    point.command = 'L';
    this.shapes[shapeIndex].pathArray.push(point);
    element.setAttribute('d', CommonService.buildPathString(this.shapes[shapeIndex].pathArray));
    element.setAttribute('fill', this.shapeStyle.fillColor);
    element.setAttribute('stroke', 'none');
    this.svgElement.querySelector('#previewLine').remove();
    this.isDrawShape = false;
    this.removeSelection();
    this.selectionGroup = CommonService.shapeSelection(this.svgElement, this.shapes[shapeIndex].pathArray);
    this.updateSelectedShapeData(CommonService.createShapeWalls(this.getSelectedShapeData(), this.selectedShape, this.shapeStyle));
    this.removePreviewElements();
    this.reselectShape();
  }

  private lineDrawEnd(element: SVGGraphicsElement) {
    this.isDrawLine = false;
    this.shape = undefined;
    const shapeIndex = this.shapes.findIndex(x => x.shapeID === element.id);
    element.setAttribute('d', CommonService.buildPathString(this.shapes[shapeIndex].pathArray));
    element.setAttribute('fill', 'transparent');
    // element.setAttribute('stroke-width', '2px');
    this.svgElement.querySelector('#previewLine').remove();
    this.isDrawShape = false;
    this.removeSelection();
    this.removePreviewElements();
    this.selectedShape = this.svgElement.querySelector(`#${element.id}`);
    this.selectionGroup = CommonService.shapeSelection(this.svgElement, this.shapes[shapeIndex].pathArray);
    this.updateSelectedShapeData(CommonService.createShapeWalls(this.getSelectedShapeData(), this.selectedShape, this.shapeStyle));
    this.reselectShape();

  }

  private changeShapePoint(element: SVGGraphicsElement, targetIndex: number, currentPosition: MousePosition) {
    const shapeId = element.getAttribute('id');
    const shapeIndex = this.shapes.findIndex(x => x.shapeID === element.id);
    const shapeNumber = shapeId ? parseInt(shapeId.match(/\d+/)[0], 10) : -1;
    if (element.id.indexOf(ShapeType.LINE) >= 0) {
    } else {
      element.parentElement
        .setAttribute('id', `${ShapeType.PATH}_ShapeGroup_${shapeNumber}`);
      element.setAttribute('id', `${ShapeType.PATH}_shape_${shapeNumber}`);
      this.shapes[shapeIndex].shapeID = `${ShapeType.PATH}_shape_${shapeNumber}`;
      this.shapes[shapeIndex].type = ShapeType.PATH;
    }
    const lastIndex = this.shapes[shapeIndex].pathArray.length - 1;
    if (targetIndex !== -1 && this.shapes[shapeIndex].pathArray[targetIndex] !== undefined) {
      if (targetIndex === 0 || targetIndex === lastIndex) {
        this.shapes[shapeIndex].pathArray[0].x = currentPosition.x;
        this.shapes[shapeIndex].pathArray[0].y = currentPosition.y;
        this.shapes[shapeIndex].pathArray[lastIndex].x = currentPosition.x;
        this.shapes[shapeIndex].pathArray[lastIndex].y = currentPosition.y;
      } else {
        this.shapes[shapeIndex].pathArray[targetIndex].x = currentPosition.x;
        this.shapes[shapeIndex].pathArray[targetIndex].y = currentPosition.y;
      }

      CommonService.setPathDString(element, CommonService.buildPathString(this.shapes[shapeIndex].pathArray));
      this.removeSelection();
      this.selectionGroup = CommonService.setPathPoints(this.svgElement, this.shapes[shapeIndex].pathArray);
      this.shapesService.updateShape(this.shapes[shapeIndex]);
    }
  }

  private circleResize(element: SVGGraphicsElement, currentPosition: MousePosition) {
    this.removeSelection();
    const shapeIndex = this.shapes.findIndex(x => x.shapeID === element.id);
    const shapeStartPoint = CommonService.getCenterPosition(element);
    const radius = new SvgPoints();
    const previousRadios = new SvgPoints();
    previousRadios.x = this.shapes[shapeIndex].pathArray[1].arcRadiusX;
    previousRadios.y = this.shapes[shapeIndex].pathArray[1].arcRadiusY;
    if (CommonService.isOvalResize(this.resizeTarget)) {
      if (this.resizeTarget.id === RectanglePoints.BOTTOM_CENTER || this.resizeTarget.id === RectanglePoints.TOP_CENTER) {
        radius.x = previousRadios.x;
        radius.y = CommonService.getLengthOfTwoPoints(shapeStartPoint, currentPosition);
      } else {
        radius.x = CommonService.getLengthOfTwoPoints(shapeStartPoint, currentPosition);
        radius.y = previousRadios.y;
      }
    } else {
      // radius.x = radius.y = CommonService.getLengthOfTwoPoints(shapeStartPoint, currentPosition);
      radius.x = Math.abs(currentPosition.x - shapeStartPoint.x);
      radius.y = Math.abs(currentPosition.y - shapeStartPoint.y);
    }
    const shapeId = this.selectedShape.getAttribute('id');
    this.shapes[shapeIndex].type = radius.x !== radius.y ? ShapeType.OVAL : ShapeType.CIRCLE;
    const shapeNumber = shapeId ? parseInt(shapeId.match(/\d+/)[0], 10) : -1;
    this.selectedShape.parentElement
      .setAttribute('id', `${this.shapes[shapeIndex].type}_ShapeGroup_${shapeNumber}`);
    this.selectedShape.setAttribute('id', `${this.shapes[shapeIndex].type}_shape_${shapeNumber}`);
    this.shapes[shapeIndex].shapeID = `${this.shapes[shapeIndex].type}_shape_${shapeNumber}`;
    const start = CommonService.circle(shapeStartPoint.x, shapeStartPoint.y, radius, 359);
    const end = CommonService.circle(shapeStartPoint.x, shapeStartPoint.y, radius, 0);
    this.shapes[shapeIndex].pathArray = [
      { command: 'M', x: start.x, y: start.y },
      { command: 'A', arcRadiusX: radius.x, arcRadiusY: radius.y, xAxisRotation: 0, largeArcFlag: 1, sweepFlag: 0, x: end.x, y: end.y },
      { command: 'z' }
    ];
    element.setAttribute('d', CommonService.buildPathString(this.shapes[shapeIndex].pathArray));
    this.shapesService.updateShape(this.shapes[shapeIndex]);
    element.setAttribute('stroke', 'black');
    this.updateSelectedShapeData(CommonService.createShapeWalls(this.getSelectedShapeData(), this.selectedShape, this.shapeStyle));
  }

  private startDrag(selectedShape: SVGGraphicsElement, currentPosition: MousePosition) {

    if (selectedShape) {
      const x = (currentPosition.x - this.initialCoordination.x);
      const y = (currentPosition.y - this.initialCoordination.y);
      selectedShape.parentElement.setAttribute('transform', `translate(${x}, ${y})`);
    }
  }

  private endDrag(selectedShape: SVGGraphicsElement, currentPosition: MousePosition) {
    const shapeIndex = this.shapes.findIndex(x => x.shapeID === selectedShape.id);
    selectedShape.parentElement.removeAttribute('transform');
    const mouseMoved = new MousePosition();
    mouseMoved.x = currentPosition.x - this.initialCoordination.x;
    mouseMoved.y = currentPosition.y - this.initialCoordination.y;
    if (shapeIndex > -1) {
      this.shapes[shapeIndex].pathArray = CommonService.translatePathPoint(this.shapes[shapeIndex].pathArray, mouseMoved);
      CommonService.setPathDString(selectedShape, CommonService.buildPathString(this.shapes[shapeIndex].pathArray));
      this.reselectShape();
      // this.dragPathLine(mouseMoved);
      if (this.shapes[shapeIndex].properties !== undefined) {
        this.translateProperties(this.shapes[shapeIndex].properties, mouseMoved);
      }
      if (!!this.shapes[shapeIndex].walls) {
        if (this.shapes[shapeIndex].type === ShapeType.CIRCLE || this.shapes[shapeIndex].type === ShapeType.OVAL) {
          if (_.isEqual(this.shapes[shapeIndex].pathArray, this.shapes[shapeIndex].walls[0].pathArray)) {
            this.updateSelectedShapeData(CommonService.createShapeWalls(this.getSelectedShapeData(), this.selectedShape, this.shapeStyle));
          } else {
            this.translateWallsWithFacility(mouseMoved);
          }
        } else {
          this.translateWallsWithFacility(mouseMoved);
        }
      }
      if (!!this.shapes[shapeIndex].nonSeatingArea) {
        this.translateNonSeatingAreas(mouseMoved);
      }
    }
  }

  private translateProperties(property: any[], propertyMove: MousePosition) {
    property.forEach(prop => {
      if (prop.type === PropertyType.NON_WALL_PROPERTY) {
        const propElements = document.getElementById(prop.propertyId).querySelector('.property');
        const x = +propElements.getAttribute('x');
        const y = +propElements.getAttribute('y');
        propElements.setAttribute('x', (x + propertyMove.x).toString());
        propElements.setAttribute('y', (y + propertyMove.y).toString());
      } else if (prop.type === PropertyType.WALL_PROPERTY) {
        const propElements = document.getElementById(prop.propertyId).querySelectorAll('.property');
        const shapeIndex = this.shapes.findIndex(x => x.shapeID === this.selectedShape.id);
        const propIndex = this.shapes[shapeIndex].properties.findIndex(x => x.propertyId === prop.propertyId);
        this.shapes[shapeIndex].properties[propIndex].lineStart.x += propertyMove.x;
        this.shapes[shapeIndex].properties[propIndex].lineStart.y += propertyMove.y;
        this.shapes[shapeIndex].properties[propIndex].lineEnd.x += propertyMove.x;
        this.shapes[shapeIndex].properties[propIndex].lineEnd.y += propertyMove.y;
        this.shapes[shapeIndex].properties[propIndex].pathArray.map(ele => {
          ele.x += propertyMove.x;
          ele.y += propertyMove.y;
        });
        if (propElements.length > 0) {
          propElements.forEach(ele => {
            const x = +ele.getAttribute('x1');
            const y = +ele.getAttribute('y1');
            const x2 = +ele.getAttribute('x2');
            const y2 = +ele.getAttribute('y2');
            ele.setAttribute('x1', (x + propertyMove.x).toString());
            ele.setAttribute('y1', (y + propertyMove.y).toString());
            ele.setAttribute('x2', (x2 + propertyMove.x).toString());
            ele.setAttribute('y2', (y2 + propertyMove.y).toString());
          });
        }
      }

    });
  }

  private startRotate(selectedShape: SVGGraphicsElement, currentPosition: MousePosition) {
    const centerPoint = CommonService.getCenterPosition(selectedShape);
    this.rotateAngle = CommonService.getAngle(centerPoint, currentPosition);
    selectedShape.parentElement.setAttribute('transform', `rotate(${this.rotateAngle}, ${centerPoint.x} , ${centerPoint.y}) `);
  }

  private endRotate(selectedShape: SVGGraphicsElement) {
    const shapeIndex = this.shapes.findIndex(x => x.shapeID === selectedShape.id);
    const centerPoint = CommonService.getCenterPosition(selectedShape);
    this.selectedShape.parentElement.removeAttribute('transform');
    this.shapes[shapeIndex].pathArray = CommonService.rotatePathPoint(this.shapes[shapeIndex].pathArray, this.rotateAngle, centerPoint);
    CommonService.setPathDString(selectedShape, CommonService.buildPathString(this.shapes[shapeIndex].pathArray));
    this.reselectShape();
    if (this.shapes[shapeIndex].properties !== undefined) {
      this.rotateProperties(this.shapes[shapeIndex].properties);
    }
    if (!!this.shapes[shapeIndex].walls) {
      this.rotateWallsWithFacility(centerPoint);
    }
    if (!!this.shapes[shapeIndex].nonSeatingArea) {
      this.rotateNonSeatingAreas(centerPoint);
    }
  }

  private rotateProperties(property: any[]) {
    const centerPoint = CommonService.getCenterPosition(this.selectedShape);

    property.forEach(prop => {
      const propElements = document.getElementById(prop.propertyId).querySelectorAll('.property');
      const shapeIndex = this.shapes.findIndex(x => x.shapeID === this.selectedShape.id);
      const propIndex = this.shapes[shapeIndex].properties.findIndex(x => x.propertyId === prop.propertyId);
      if (this.shapes[shapeIndex].properties[propIndex].type === PropertyType.WALL_PROPERTY) {
        this.shapes[shapeIndex].properties[propIndex].pathArray.map(point => {
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
        });
      }
      if (propElements.length > 0) {
        propElements.forEach(ele => {
          const x = +ele.getAttribute('x1');
          const y = +ele.getAttribute('y1');
          const x2 = +ele.getAttribute('x2');
          const y2 = +ele.getAttribute('y2');

          const tempX = x - centerPoint.x;
          const tempY = y - centerPoint.y;
          const tempX2 = x2 - centerPoint.x;
          const tempY2 = y2 - centerPoint.y;

          const rotatedX = tempX * Math.cos(this.rotateAngle * Math.PI / 180) - tempY * Math.sin(this.rotateAngle * Math.PI / 180);
          const rotatedY = tempX * Math.sin(this.rotateAngle * Math.PI / 180) + tempY * Math.cos(this.rotateAngle * Math.PI / 180);
          const rotatedX2 = tempX2 * Math.cos(this.rotateAngle * Math.PI / 180) - tempY2 * Math.sin(this.rotateAngle * Math.PI / 180);
          const rotatedY2 = tempX2 * Math.sin(this.rotateAngle * Math.PI / 180) + tempY2 * Math.cos(this.rotateAngle * Math.PI / 180);
          ele.setAttribute('x1', (rotatedX + centerPoint.x).toString());
          ele.setAttribute('y1', (rotatedY + centerPoint.y).toString());
          ele.setAttribute('x2', (rotatedX2 + centerPoint.x).toString());
          ele.setAttribute('y2', (rotatedY2 + centerPoint.y).toString());
        });
      }
    });
  }

  private startScaling(element: SVGGraphicsElement, currentPosition: MousePosition) {
    this.selectionGroup.style.display = 'none';
    const startPointTarget = CommonService.getScaleStartPoint(this.svgElement, this.resizeTarget);
    if (startPointTarget !== null) {
      const startPoint = CommonService.getCirclePoint(startPointTarget) || undefined;
      const resizeTargetPoint = CommonService.getCirclePoint(this.resizeTarget) || undefined;
      if (startPoint && resizeTargetPoint) {
        const firstDistance = new SvgPoints();
        const lastDistance = new SvgPoints();
        firstDistance.x = startPoint.x - resizeTargetPoint.x;
        firstDistance.y = startPoint.y - resizeTargetPoint.y;
        lastDistance.x = startPoint.x - currentPosition.x;
        lastDistance.y = startPoint.y - currentPosition.y;
        if (this.selectedShape.id.indexOf(ShapeType.SQUARE) >= 0) {
          if (lastDistance.x / firstDistance.x > lastDistance.y / firstDistance.y) {
            this.scalePoint.x = lastDistance.x / firstDistance.x;
            this.scalePoint.y = lastDistance.x / firstDistance.x;
          } else {
            this.scalePoint.x = lastDistance.y / firstDistance.y;
            this.scalePoint.y = lastDistance.y / firstDistance.y;
          }
        } else {
          this.scalePoint.x = lastDistance.x / firstDistance.x;
          this.scalePoint.y = lastDistance.y / firstDistance.y;
        }
        this.scalePoint.x = isNaN(this.scalePoint.x) || Math.abs(this.scalePoint.x) === Infinity ? 1 : this.scalePoint.x;
        this.scalePoint.y = isNaN(this.scalePoint.y) || Math.abs(this.scalePoint.y) === Infinity ? 1 : this.scalePoint.y;
        element.parentElement.setAttribute('transform', `translate(${startPoint.x}, ${startPoint.y})
          scale(${this.scalePoint.x}, ${this.scalePoint.y})
          translate(-${startPoint.x}, -${startPoint.y})`);
      }
    }
  }

  private endScaling(selectedShape: SVGGraphicsElement) {
    const startPointTarget = CommonService.getScaleStartPoint(this.svgElement, this.resizeTarget);
    const shapeIndex = this.shapes.findIndex(x => x.shapeID === selectedShape.id);
    const startPoint = CommonService.getCirclePoint(startPointTarget) || undefined;
    this.selectedShape.parentElement.removeAttribute('transform');
    this.shapes[shapeIndex].pathArray = CommonService.scalePathPoint(this.shapes[shapeIndex].pathArray, this.scalePoint, startPoint);
    CommonService.setPathDString(selectedShape, CommonService.buildPathString(this.shapes[shapeIndex].pathArray));
    this.selectionGroup.style.display = 'block';
    if (!!this.shapes[shapeIndex].walls) {
      this.scaleWallsWithFacility(startPoint, this.scalePoint);
    }
    if (!!this.shapes[shapeIndex].nonSeatingArea) {
      this.scaleNonSeatingAreas(startPoint, this.scalePoint);
    }
    this.reselectShape();
  }


  private removeSelection() {
    // this.removePreviewElements();
    if (this.selectionGroup) {
      this.selectionGroup.remove();
    }
    this.multiSelectedShapeGroup.forEach(ele => {
      ele.remove();
    });
    this.multiSelectedShapeGroup = [];
    this.multiSelectedShape = [];
    this.shapeData.emit({
      selectedShape: undefined,
      shapeGroup: undefined,
      selectedProperty: undefined
    });
  }

  private removePropertySelection() {
    this.removePreviewElements();
    if (this.selectionGroup) {
      this.selectionGroup.remove();
    }
  }

  private removeSelectedShape() {
    this.selectedShape = undefined;
  }

  private reselectShape() {
    this.removeSelection();
    this.removePreviewElements();
    this.shape = undefined;
    const shapeIndex = this.shapes.findIndex(x => x.shapeID === this.selectedShape.id);
    const shapeGroup = this.selectedShape.parentElement;
    if (this.selectedShape && this.shapes[shapeIndex]) {
      this.selectionGroup = CommonService.singleSelectPathShape(shapeGroup, this.selectedShape);
    }
    this.isAddProperty = false;
    this.shapeData.emit({
      selectedShape: this.selectedShape,
      shapeGroup: this.mainShapeGroup,
      selectedProperty: this.selectedProperty
    });
  }

  private selectNonSeatingArea() {
    this.isNonSeatAreaSelected = true;
    this.removeSelection();
    this.removePreviewElements();
    this.shape = undefined;
    const shapeIndex = this.shapes.findIndex(x => x.shapeID === this.selectedShape.id);
    if (!!this.shapes[shapeIndex].nonSeatingArea) {
      const NonSeatingIndex = this.shapes[shapeIndex].nonSeatingArea.findIndex(x => x.id === this.selectedNonSeatingArea.id);
      const shapeGroup = this.selectedNonSeatingArea.parentElement;
      shapeGroup.removeAttribute('clip-path');
      if (this.selectedShape && this.shapes[shapeIndex]) {
        this.selectionGroup = CommonService.singleSelectPathShape(shapeGroup, this.selectedNonSeatingArea);
      }
    }
  }

  private propertySelect() {
    this.removeSelection();
    this.isAddProperty = false;
    const group = this.selectedProperty.parentElement;
    const propertyData = this.getSelectedPropertyData();
    if (propertyData.type === PropertyType.NON_WALL_PROPERTY) {
      this.selectionGroup = CommonService.propertySelect(group as any, this.selectedProperty, undefined as any, propertyData);
    } else if (propertyData.type === PropertyType.WALL_PROPERTY) {
      const wallElement = this.getSelectedPropertyWallElement();
      if (!!wallElement) {
        this.selectionGroup = CommonService.propertySelect(group as any, this.selectedProperty, wallElement as any, propertyData);
      }
    }

    this.shapeData.emit({
      selectedShape: undefined,
      shapeGroup: this.mainShapeGroup,
      selectedProperty: this.selectedProperty

    });
  }

  private deepSelectShape() {
    this.removeSelection();
    this.removePreviewElements();
    this.isShapeDeepSelect = true;
    const shapeIndex = this.shapes.findIndex(x => x.shapeID === this.selectedShape.id);
    const shapeGroup = this.selectedShape.parentElement;
    if (this.shapes[shapeIndex] && shapeGroup) {
      // this.pathLines.push(...CommonService.createLinesForPathV2(this.shapes[shapeIndex].points, shapeGroup));
    }
    if (this.selectedShape && this.shapes[shapeIndex]) {
      this.selectionGroup = CommonService.shapeSelection(shapeGroup, this.shapes[shapeIndex].pathArray);
    }
    this.shapeData.emit({
      selectedShape: this.selectedShape,
      shapeGroup: this.mainShapeGroup,
      selectedProperty: this.selectedProperty
    });
  }

  private breakLine(line: SVGGraphicsElement, currentPoint: MousePosition) {
    const startPoint = CommonService.getStartPointInPathLine(line as any);
    const endPoint = CommonService.getEndPointInPathLine(line);
    const shapeIndex = this.shapes.findIndex(x => x.shapeID === this.selectedShape.id);
    const startPointIndex = this.shapes[shapeIndex].pathArray.findIndex(x =>
      x.x === startPoint.x && x.y === startPoint.y
    );
    if (startPointIndex === -1) {
      return;
    }
    const shapeId = this.selectedShape.getAttribute('id');
    if (this.selectedShape.id.indexOf(ShapeType.LINE) >= 0) {
    } else {
      const shapeNumber = shapeId ? parseInt(shapeId.match(/\d+/)[0], 10) : -1;
      this.selectedShape.parentElement
        .setAttribute('id', `${ShapeType.PATH}_ShapeGroup_${shapeNumber}`);
      this.selectedShape.setAttribute('id', `${ShapeType.PATH}_shape_${shapeNumber}`);
      this.shapes[shapeIndex].shapeID = `${ShapeType.PATH}_shape_${shapeNumber}`;
      this.shapes[shapeIndex].type = ShapeType.PATH;

    }
    if (startPoint.x === endPoint.x) {
      const x = startPoint.x;
      const y = currentPoint.y;
      this.shapes[shapeIndex].pathArray.splice(startPointIndex + 1, 0, { command: 'L', x, y });
      // CommonService.setPathDString(this.selectedShape, CommonService.buildPathString(this.shapes[shapeIndex].pathArray));
      this.selectedShape.setAttribute('d', CommonService.buildPathString(this.shapes[shapeIndex].pathArray));
    } else if (startPoint.y === endPoint.y) {
      const y = startPoint.y;
      const x = currentPoint.x;
      this.shapes[shapeIndex].pathArray.splice(startPointIndex + 1, 0, { command: 'L', x, y });
      this.selectedShape.setAttribute('d', CommonService.buildPathString(this.shapes[shapeIndex].pathArray));
    } else {
      const x = this.currentPosition.x;
      const tan = (startPoint.y - endPoint.y) / (startPoint.x - endPoint.x);
      const y = startPoint.y - tan * (startPoint.x - x);
      this.shapes[shapeIndex].pathArray.splice(startPointIndex + 1, 0, { command: 'L', x, y });
      this.selectedShape.setAttribute('d', CommonService.buildPathString(this.shapes[shapeIndex].pathArray));
    }
  }

  private removePreviewElements() {
    const previewElement = this.svgElement.querySelector('#drawPreviewLine') as SVGGraphicsElement;
    const previewLengthElement = this.svgElement.querySelector('#lineLengthPreview') as SVGGraphicsElement;
    if (previewElement) {
      previewElement.remove();
    }
    if (previewLengthElement) {
      previewLengthElement.remove();
    }
  }

  private dragWallProperty() {
    const shapeIndex = this.shapes.findIndex(x => x.shapeID === this.selectedShape.id);
    if (this.shapes[shapeIndex].properties !== undefined) {
      const propertyIndex = this.shapes[shapeIndex].properties.findIndex(x => x.propertyId === this.selectedProperty.id);
      const startPoint = this.shapes[shapeIndex].properties[propertyIndex].lineStart;
      const endPoint = this.shapes[shapeIndex].properties[propertyIndex].lineEnd;
      this.removePropertySelection();
      if (startPoint.y === endPoint.y) {
        const x = this.currentPosition.x - this.initialCoordination.x;
        if (startPoint.x < endPoint.x && (startPoint.x) <= this.currentPosition.x && (endPoint.x) >= this.currentPosition.x) {
          this.selectedProperty.setAttribute('transform', `translate(${x})`);
        } else if (startPoint.x > endPoint.x && (startPoint.x) >= this.currentPosition.x && (endPoint.x) <= this.currentPosition.x) {
          this.selectedProperty.setAttribute('transform', `translate(${x})`);
        }
      }
      if (startPoint.x === endPoint.x) {
        const y = this.currentPosition.y - this.initialCoordination.y;
        if (startPoint.y > endPoint.y && (startPoint.y) >= this.currentPosition.y && (endPoint.y - 10) <= this.currentPosition.y) {
          this.selectedProperty.setAttribute('transform', `translate(0, ${y})`);
        } else if (startPoint.y < endPoint.y && (startPoint.y - 10) <= this.currentPosition.y && endPoint.y >= this.currentPosition.y) {
          this.selectedProperty.setAttribute('transform', `translate(0, ${y})`);
        }
      } else {
        const tan = (startPoint.y - endPoint.y) / (startPoint.x - endPoint.x);
        const y = (startPoint.y - tan * (startPoint.x - this.currentPosition.x)) - this.initialCoordination.y;
        const x = this.currentPosition.x - this.initialCoordination.x;

        if (startPoint.x < endPoint.x && startPoint.y < endPoint.y) {
          if (startPoint.x < this.currentPosition.x && endPoint.x > this.currentPosition.x) {
            this.selectedProperty.setAttribute('transform', `translate(${x}, ${y})`);

          }
        } else if (startPoint.x < endPoint.x && startPoint.y > endPoint.y) {
          if (startPoint.x < this.currentPosition.x && endPoint.x > this.currentPosition.x) {
            this.selectedProperty.setAttribute('transform', `translate(${x}, ${y})`);
          }

        } else if (startPoint.x > endPoint.x && startPoint.y > endPoint.y) {
          if (startPoint.x > this.currentPosition.x && endPoint.x < this.currentPosition.x) {
            this.selectedProperty.setAttribute('transform', `translate(${x}, ${y})`);
          }

        } else if (startPoint.x > endPoint.x && startPoint.y < endPoint.y) {
          if (startPoint.x > this.currentPosition.x && endPoint.x < this.currentPosition.x) {
            this.selectedProperty.setAttribute('transform', `translate(${x}, ${y})`);

          }
        }
      }
    }
  }

  private dragPropertyEnd() {
    const shapeIndex = this.shapes.findIndex(x => x.shapeID === this.selectedShape.id);
    if (this.shapes[shapeIndex].properties !== undefined) {
      const propertyIndex = this.shapes[shapeIndex].properties.findIndex(x => x.propertyId === this.selectedProperty.id);
      const startPoint = this.shapes[shapeIndex].properties[propertyIndex].lineStart;
      const endPoint = this.shapes[shapeIndex].properties[propertyIndex].lineEnd;

      this.removeSelection();
      this.selectedProperty.removeAttribute('transform');
      if (startPoint.y === endPoint.y) {
        const x = this.currentPosition.x - this.initialCoordination.x;
        if (startPoint.x < endPoint.x && (startPoint.x) <= this.currentPosition.x && (endPoint.x) >= this.currentPosition.x) {
          this.translateProperty({ x, y: 0 });
        } else if (startPoint.x > endPoint.x && (startPoint.x) >= this.currentPosition.x && (endPoint.x) <= this.currentPosition.x) {
          this.translateProperty({ x, y: 0 });
        }
      }
      if (startPoint.x === endPoint.x) {
        const y = this.currentPosition.y - this.initialCoordination.y;
        if (startPoint.y > endPoint.y && (startPoint.y) >= this.currentPosition.y && (endPoint.y - 10) <= this.currentPosition.y) {
          this.translateProperty({ x: 0, y });
        } else if (startPoint.y < endPoint.y && (startPoint.y - 10) <= this.currentPosition.y && endPoint.y >= this.currentPosition.y) {
          this.translateProperty({ x: 0, y });
        }
      } else {

        const tan = (startPoint.y - endPoint.y) / (startPoint.x - endPoint.x);
        const y = (startPoint.y - tan * (startPoint.x - this.currentPosition.x)) - this.initialCoordination.y;
        const x = this.currentPosition.x - this.initialCoordination.x;

        if (startPoint.x < endPoint.x && startPoint.y < endPoint.y) {
          if (startPoint.x < this.currentPosition.x && endPoint.x > this.currentPosition.x) {
            this.translateProperty({ x, y });
          }
        } else if (startPoint.x < endPoint.x && startPoint.y > endPoint.y) {
          if (startPoint.x < this.currentPosition.x && endPoint.x > this.currentPosition.x) {
            this.translateProperty({ x, y });
          }

        } else if (startPoint.x > endPoint.x && startPoint.y > endPoint.y) {
          if (startPoint.x > this.currentPosition.x && endPoint.x < this.currentPosition.x) {
            this.translateProperty({ x, y });
          }

        } else if (startPoint.x > endPoint.x && startPoint.y < endPoint.y) {
          if (startPoint.x > this.currentPosition.x && endPoint.x < this.currentPosition.x) {
            this.translateProperty({ x, y });
          }
        }
      }
    }
  }

  private translateProperty(propertyMove: MousePosition) {
    const shapeIndex = this.shapes.findIndex(x => x.shapeID === this.selectedShape.id);
    const propIndex = this.shapes[shapeIndex].properties.findIndex(x => x.propertyId === this.selectedProperty.id);
    const propElements = document.getElementById(this.shapes[shapeIndex].properties[propIndex].propertyId).querySelectorAll('.property');
    this.shapes[shapeIndex].properties[propIndex].pathArray.map(points => {
      points.x += propertyMove.x;
      points.y += propertyMove.y;
    });
    if (propElements.length > 0) {
      propElements.forEach(ele => {
        const x = +ele.getAttribute('x1');
        const y = +ele.getAttribute('y1');
        const x2 = +ele.getAttribute('x2');
        const y2 = +ele.getAttribute('y2');
        ele.setAttribute('x1', (x + propertyMove.x).toString());
        ele.setAttribute('y1', (y + propertyMove.y).toString());
        ele.setAttribute('x2', (x2 + propertyMove.x).toString());
        ele.setAttribute('y2', (y2 + propertyMove.y).toString());
      });
    }
  }

  private switchPropertyToWall(dropLine, PreviousWall, property) {
    let propertyData = this.getSelectedPropertyData();
    if (!!propertyData && !!PreviousWall) {
      this.selectedProperty.removeAttribute('transform');
      propertyData = this.createProperty.switchPropertyToWall(PreviousWall, dropLine, property, this.currentPosition, propertyData);
      this.initialCoordination = this.currentPosition;
      this.updateSelectedPropertyData(propertyData);
    }
  }

  private dragNonWallProperty(selectedProperty: Element, currentPosition: MousePosition) {
    const bBox = (selectedProperty as SVGGraphicsElement).getBBox();
    currentPosition.x -= bBox.width / 2;
    currentPosition.y -= bBox.height / 2;
    selectedProperty.setAttribute('x', currentPosition.x.toString());
    selectedProperty.setAttribute('y', currentPosition.y.toString());
    this.selectionGroup.style.display = 'none';
  }

  private scaleNonWallProperty(target: Element, currentPosition: MousePosition) {
    this.removeSelection();
    this.propertySelect();
    const initialPoint = new SvgPoints();
    const bBox = (target as SVGGraphicsElement).getBBox();
    initialPoint.x = +target.getAttribute('x');
    initialPoint.y = +target.getAttribute('y');
    const width = currentPosition.x - initialPoint.x;
    const height = currentPosition.y - initialPoint.y;
    this.scalePoint.x = width / bBox.width;
    this.scalePoint.y = height / bBox.height;

    if (initialPoint.x + 20 < currentPosition.x && initialPoint.x + 20 < currentPosition.x) {
      target.setAttribute('width', width.toString());
      target.setAttribute('height', height.toString());
    }

  }

  private addNewWallPoints(element: SVGGraphicsElement) {
    // todo refactor the add wall function with creating walls
    const shapeData = this.getSelectedShapeData();
    if (!!this.tempWallObj) {
      this.tempWallObj.endPoint = Object.assign(this.tempWallObj.endPoint, this.currentPosition);
      this.tempWallObj.pathArray = CommonService.createLinePathPoint(this.tempWallObj.startPoint, this.tempWallObj.endPoint);
      const shapeGroup: HTMLElement = this.selectedShape.parentElement;
      const existingWalls = shapeGroup.querySelector(`#wallGroup_${shapeData.shapeID}`);
      const wallG = CommonService.createGroupElement(existingWalls as any, `g_${this.tempWallObj.id}`);
      wallG.style.cursor = 'pointer';
      const lineEl: HTMLElement = CommonService.drawWall(wallG, this.tempWallObj) as any;
      lineEl.style.stroke = CommonService.setLightPercentage(shapeData.style.fill, 70);
      lineEl.style.strokeWidth = String(this.tempWallObj.style.strokeWidth);
      shapeData.walls.push(this.tempWallObj);
      this.updateSelectedShapeData(shapeData);
      this.tempWallObj = undefined;
    }
    this.tempWallObj = new Wall(`wall_${CommonService.generateUniqId}`);
    this.tempWallObj.startPoint = Object.assign(this.tempWallObj.startPoint, this.currentPosition);
  }

  private removeWallStart(line: SVGGraphicsElement, currentPoint: MousePosition) {
    let selectionGroup = this.mainShapeGroup.querySelector('#removeWallSelect');
    let removeLine = false;
    let removeWallDifferentLine = false;
    if (!!selectionGroup) {
      if (this.selectedLineForRemoveWall === line) {
        removeLine = true;
        removeWallDifferentLine = false;
      } else {
        removeWallDifferentLine = true;
        removeLine = false;
      }
    } else {
      removeLine = false;
      this.selectedLineForRemoveWall = line;
      selectionGroup = CommonService.createGroupElement(this.mainShapeGroup, 'removeWallSelect');
    }
    const startPoint = CommonService.getStartPointInPathLine(line);
    const endPoint = CommonService.getEndPointInPathLine(line);
    const shapeElement = line.parentElement.parentElement.parentElement.children[0];
    const shapeIndex = this.shapes.findIndex(x => x.shapeID === shapeElement.id);
    const startPointIndex = this.shapes[shapeIndex].pathArray.findIndex(x => x.x === startPoint.x && x.y === startPoint.y);
    const mousePoint = new SvgPoints();
    if (this.shapes[shapeIndex].type === ShapeType.CIRCLE) {
      mousePoint.x = currentPoint.x;
      mousePoint.y = currentPoint.y;
    } else {
      if (startPoint.x === endPoint.x) {
        mousePoint.x = startPoint.x;
        mousePoint.y = currentPoint.y;
      } else if (startPoint.y === endPoint.y) {
        mousePoint.y = startPoint.y;
        mousePoint.x = currentPoint.x;
      } else {
        mousePoint.x = this.currentPosition.x;
        const tan = (startPoint.y - endPoint.y) / (startPoint.x - endPoint.x);
        mousePoint.y = startPoint.y - tan * (startPoint.x - mousePoint.x);
      }
    }
    const cPoint = CommonService.createCircleElement(selectionGroup as any, mousePoint.x, mousePoint.y, 5, 'propMovePoint', 'blue', 'none');
    cPoint.style.cursor = 'move';
    if (removeLine && this.shapes[shapeIndex].type === ShapeType.CIRCLE) {
      this.removeWallsFromCircle(selectionGroup, shapeElement);
    } else if (removeLine) {
      this.removeWall(selectionGroup, line, shapeElement);
    } else if (removeWallDifferentLine) {
      this.removeWallsFromDifferentLine(selectionGroup, this.selectedLineForRemoveWall, line, shapeElement);
    }
  }

  private removeWallsFromCircle(points, selectedShape) {
    const shape = this.getSelectedShapeData();
    const radius = new SvgPoints();
    radius.x = shape.pathArray[1].arcRadiusX;
    radius.y = shape.pathArray[1].arcRadiusY;
    const removePointOne = CommonService.getCirclePoint(points.childNodes[0] as any);
    const removePointTwo = CommonService.getCirclePoint(points.childNodes[1] as any);
    const isSweepFlag = CommonService.getCircleSweepFlag(removePointOne, removePointTwo,
      CommonService.getCenterPosition(this.svgElement.getElementById(shape.shapeID)));
    shape.walls[0].pathArray = [
      { command: 'M', x: removePointOne.x, y: removePointOne.y },
      {
        command: 'A', arcRadiusX: radius.x, arcRadiusY: radius.y, xAxisRotation: 0,
        largeArcFlag: 1, sweepFlag: isSweepFlag, x: removePointTwo.x, y: removePointTwo.y
      },
    ];
    const shapeGroup: HTMLElement = selectedShape.parentElement;
    const existingWalls = shapeGroup.querySelector(`#wallGroup_${shape.shapeID}`);
    CommonService.removeChildElementFromParent(existingWalls as any);
    shape.walls.forEach(wall => {
      const wallG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      wallG.setAttribute('id', `g_${wall.id}`);
      existingWalls.appendChild(wallG);
      wallG.style.cursor = 'pointer';
      const lineEl: HTMLElement = CommonService.drawWall(wallG, wall) as any;
      lineEl.style.stroke = CommonService.setLightPercentage(shape.style.fill, 70);
      lineEl.style.strokeWidth = String(wall.style.strokeWidth);
    });
    points.remove();
  }

  private removeWallsFromDifferentLine(points, lineOne, lineTwo, selectedShape) {
    const lineOneStartPoint = CommonService.getStartPointInPathLine(lineOne);
    const lineOneEndPoint = CommonService.getEndPointInPathLine(lineOne);
    const lineTwoStartPoint = CommonService.getStartPointInPathLine(lineTwo);
    const lineTwoEndPoint = CommonService.getEndPointInPathLine(lineTwo);
    const pointOne = CommonService.getCirclePoint(points.childNodes[0] as any);
    const pointTwo = CommonService.getCirclePoint(points.childNodes[1] as any);
    const shapeIndex = this.shapes.findIndex(x => x.shapeID === selectedShape.id);
    const shape = this.shapes[shapeIndex];
    const firstWallIndex = shape.walls.findIndex(x =>
      (x.startPoint.x === lineOneStartPoint.x && x.startPoint.y === lineOneStartPoint.y) &&
      (x.endPoint.x === lineOneEndPoint.x && x.endPoint.y === lineOneEndPoint.y));
    const secondWallIndex = shape.walls.findIndex(x =>
      (x.startPoint.x === lineTwoStartPoint.x && x.startPoint.y === lineTwoStartPoint.y) &&
      (x.endPoint.x === lineTwoEndPoint.x && x.endPoint.y === lineTwoEndPoint.y));
    const firstWall = shape.walls[firstWallIndex];
    const secondWall = shape.walls[secondWallIndex];
    const wallOne = new Wall(`wall_${CommonService.generateUniqId}`);
    const wallTwo = new Wall(`wall_${CommonService.generateUniqId}`);
    if (_.isEqual(secondWall.startPoint, firstWall.endPoint)) {
      wallOne.startPoint = firstWall.startPoint;
      wallOne.endPoint = CommonService.findClosestPoint(firstWall.startPoint, pointOne, pointTwo);
      wallOne.pathArray = [
        new PathPoint('M', firstWall.startPoint.x, firstWall.startPoint.y),
        new PathPoint('L', wallOne.endPoint.x, wallOne.endPoint.y)
      ];
      wallTwo.startPoint = CommonService.findClosestPoint(secondWall.endPoint, pointOne, pointTwo);
      wallTwo.endPoint = secondWall.endPoint;
      wallTwo.pathArray = [
        new PathPoint('M', wallTwo.startPoint.x, wallTwo.startPoint.y),
        new PathPoint('L', secondWall.endPoint.x, secondWall.endPoint.y),
      ];
    } else if (_.isEqual(firstWall.startPoint, secondWall.endPoint)) {
      wallOne.startPoint = CommonService.findClosestPoint(firstWall.endPoint, pointOne, pointTwo);
      wallOne.endPoint = firstWall.endPoint;
      wallOne.pathArray = [
        new PathPoint('M', wallOne.startPoint.x, wallOne.startPoint.y),
        new PathPoint('L', firstWall.endPoint.x, firstWall.endPoint.y)
      ];
      wallTwo.startPoint = secondWall.startPoint;
      wallTwo.endPoint = CommonService.findClosestPoint(secondWall.startPoint, pointOne, pointTwo);
      wallTwo.pathArray = [
        new PathPoint('M', secondWall.startPoint.x, secondWall.startPoint.y),
        new PathPoint('L', wallTwo.endPoint.x, wallTwo.endPoint.y),
      ];
    }

    points.remove();
    shape.walls.splice(firstWallIndex, 1, wallOne);
    shape.walls.splice(secondWallIndex, 1, wallTwo);
    const shapeGroup: HTMLElement = selectedShape.parentElement;
    const existingWalls = shapeGroup.querySelector(`#wallGroup_${shape.shapeID}`);
    CommonService.removeChildElementFromParent(existingWalls as any);
    shape.walls.forEach(wall => {
      const wallG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      wallG.setAttribute('id', `g_${wall.id}`);
      existingWalls.appendChild(wallG);
      wallG.style.cursor = 'pointer';
      const lineEl: HTMLElement = CommonService.drawWall(wallG, wall) as any;
      lineEl.style.stroke = CommonService.setLightPercentage(shape.style.fill, 70);
      lineEl.style.strokeWidth = String(wall.style.strokeWidth);
    });
    this.shapes[shapeIndex] = shape;
  }

  private removeWall(points: Element, line, selectedShape) {
    const startPoint = CommonService.getStartPointInPathLine(line);
    const endPoint = CommonService.getEndPointInPathLine(line);
    const removePointOne = CommonService.getCirclePoint(points.childNodes[0] as any);
    const removePointTwo = CommonService.getCirclePoint(points.childNodes[1] as any);
    const shapeIndex = this.shapes.findIndex(x => x.shapeID === selectedShape.id);
    const shape = this.shapes[shapeIndex];
    const wallIndex = shape.walls.findIndex(x => {
      return (Math.round(x.startPoint.x) === Math.round(startPoint.x) && Math.round(x.startPoint.y) === Math.round(startPoint.y)) &&
        (Math.round(x.endPoint.x) === Math.round(endPoint.x) && Math.round(x.endPoint.y) === Math.round(endPoint.y));
    });
    if (wallIndex === -1) {
      this.toastR.error('Wall Object Not Found', 'Not Found');
      points.remove();
      return;
    }
    const selectedWall = shape.walls[wallIndex];
    const wallOne = new Wall(`wall_${CommonService.generateUniqId}`);
    const wallTwo = new Wall(`wall_${CommonService.generateUniqId}`);
    //  first Wall
    wallOne.startPoint = selectedWall.startPoint;
    wallOne.endPoint = CommonService.findClosestPoint(selectedWall.startPoint, removePointOne, removePointTwo);
    wallOne.pathArray = [
      new PathPoint('M', selectedWall.startPoint.x, selectedWall.startPoint.y),
      new PathPoint('L', wallOne.endPoint.x, wallOne.endPoint.y)
    ];
    wallTwo.startPoint = CommonService.findClosestPoint(selectedWall.endPoint, removePointOne, removePointTwo);
    wallTwo.endPoint = selectedWall.endPoint;
    wallTwo.pathArray = [
      new PathPoint('M', wallTwo.startPoint.x, wallTwo.startPoint.y),
      new PathPoint('L', selectedWall.endPoint.x, selectedWall.endPoint.y),
    ];
    points.remove();
    shape.walls.splice(wallIndex, 1);
    shape.walls.push(wallOne, wallTwo);
    const shapeGroup: HTMLElement = selectedShape.parentElement;
    const existingWalls = shapeGroup.querySelector(`#wallGroup_${shape.shapeID}`);
    CommonService.removeChildElementFromParent(existingWalls as any);
    shape.walls.forEach(wall => {
      const wallG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      wallG.setAttribute('id', `g_${wall.id}`);
      existingWalls.appendChild(wallG);
      wallG.style.cursor = 'pointer';
      const lineEl: HTMLElement = CommonService.drawWall(wallG, wall) as any;
      lineEl.style.stroke = CommonService.setLightPercentage(shape.style.fill, 70);
      lineEl.style.strokeWidth = String(wall.style.strokeWidth);
    });
    this.shapes[shapeIndex] = shape;

  }

  private translateWallsWithFacility(wallMovement: MousePosition) {
    const shapeIndex = this.shapes.findIndex(x => x.shapeID === this.selectedShape.id);
    const shapeGroup: HTMLElement = this.selectedShape.parentElement;
    const shape = _.cloneDeep(this.shapes[shapeIndex]);
    const wallsGroup = shapeGroup.querySelector(`#wallGroup_${shape.shapeID}`);
    this.shapes[shapeIndex].walls.forEach(wall => {
      const wallElement = wallsGroup.querySelector(`#${wall.id}`);
      if (!wallElement) {
        this.toastR.error('Wall Element not found', 'Error');
      }
      wall.pathArray.map(point => {
        if (point.command === 'Q') {
          console.log(_.cloneDeep(point));
        }
        if (point.command === 'A') {
        } else if (point.command !== 'z') {
          if (point.command === 'Q') {
            point.x1 += wallMovement.x;
            point.y1 += wallMovement.y;
          }
          point.x += wallMovement.x;
          point.y += wallMovement.y;
          if (point.command === 'M') {
            wall.startPoint.x = point.x;
            wall.startPoint.y = point.y;
          } else {
            wall.endPoint.x = point.x;
            wall.endPoint.y = point.y;
          }
        }
        if (point.command === 'Q') {
          console.log(_.cloneDeep(point));
        }
      });
      wallElement.setAttribute('d', CommonService.buildPathString(wall.pathArray));
    });
  }

  private scaleWallsWithFacility(startPort: MousePosition, scale: MousePosition) {
    const shapeIndex = this.shapes.findIndex(x => x.shapeID === this.selectedShape.id);
    const shapeGroup: HTMLElement = this.selectedShape.parentElement;
    const shape = _.cloneDeep(this.shapes[shapeIndex]);
    const wallsGroup = shapeGroup.querySelector(`#wallGroup_${shape.shapeID}`);
    this.shapes[shapeIndex].walls.forEach(wall => {
      const wallElement = wallsGroup.querySelector(`#${wall.id}`);
      wall.pathArray.map(point => {
        if (point.command === 'A') {
        } else if (point.command !== 'z') {
          point.x -= startPort.x;
          point.y -= startPort.y;
          point.x *= scale.x;
          point.y *= scale.y;
          point.x += startPort.x;
          point.y += startPort.y;
          if (point.command === 'Q') {
            point.x1 -= startPort.x;
            point.y1 -= startPort.y;
            point.x1 *= scale.x;
            point.y1 *= scale.y;
            point.x1 += startPort.x;
            point.y1 += startPort.y;
          }
          if (point.command === 'M') {
            wall.startPoint.x = point.x;
            wall.startPoint.y = point.y;
          } else {
            wall.endPoint.x = point.x;
            wall.endPoint.y = point.y;
          }
        }

      });
      wallElement.setAttribute('d', CommonService.buildPathString(wall.pathArray));
    });

  }

  private rotateWallsWithFacility(centerPoint) {
    const shapeIndex = this.shapes.findIndex(x => x.shapeID === this.selectedShape.id);
    const shapeGroup: HTMLElement = this.selectedShape.parentElement;
    const shape = _.cloneDeep(this.shapes[shapeIndex]);
    const wallsGroup = shapeGroup.querySelector(`#wallGroup_${shape.shapeID}`);
    this.shapes[shapeIndex].walls.forEach(wall => {
      const wallElement = wallsGroup.querySelector(`#${wall.id}`);
      console.log(wallElement);
      wall.pathArray.map(point => {
        if (point.command === 'A') {
        } else if (point.command !== 'z') {
          const x = point.x;
          const y = point.y;
          const tempX = x - centerPoint.x;
          const tempY = y - centerPoint.y;
          const rotatedX = tempX * Math.cos(this.rotateAngle * Math.PI / 180) - tempY * Math.sin(this.rotateAngle * Math.PI / 180);
          const rotatedY = tempX * Math.sin(this.rotateAngle * Math.PI / 180) + tempY * Math.cos(this.rotateAngle * Math.PI / 180);
          // translate back
          point.x = rotatedX + centerPoint.x;
          point.y = rotatedY + centerPoint.y;
          if (point.command === 'Q') {
            const Qx = point.x1;
            const Qy = point.y1;
            const QtempX = Qx - centerPoint.x;
            const QtempY = Qy - centerPoint.y;
            const QrotatedX = QtempX * Math.cos(this.rotateAngle * Math.PI / 180) - QtempY * Math.sin(this.rotateAngle * Math.PI / 180);
            const QrotatedY = QtempX * Math.sin(this.rotateAngle * Math.PI / 180) + QtempY * Math.cos(this.rotateAngle * Math.PI / 180);
            // translate back
            point.x1 = QrotatedX + centerPoint.x;
            point.y1 = QrotatedY + centerPoint.y;
          }
          if (point.command === 'M') {
            wall.startPoint.x = point.x;
            wall.startPoint.y = point.y;
          } else {
            wall.endPoint.x = point.x;
            wall.endPoint.y = point.y;
          }
        }

      });
      wallElement.setAttribute('d', CommonService.buildPathString(wall.pathArray));

    });
  }

  private translateNonSeatingAreas(wallMovement: MousePosition) {
    const shapeIndex = this.shapes.findIndex(x => x.shapeID === this.selectedShape.id);
    this.shapes[shapeIndex].nonSeatingArea.forEach(area => {
      const element = document.getElementById(`${area.id}`);
      area.pathArray.map(point => {
        if (point.command !== 'z') {
          point.x += wallMovement.x;
          point.y += wallMovement.y;
        }
      });
      if (!!element) {
        element.children[0].setAttribute('d', CommonService.buildPathString(area.pathArray));
      }
    });
  }

  private translateNonSeatingArea() {
    const wallMovement = new MousePosition();
    wallMovement.x = this.currentPosition.x - this.initialCoordination.x;
    wallMovement.y = this.currentPosition.y - this.initialCoordination.y;
    const shapeIndex = this.shapes.findIndex(x => x.shapeID === this.selectedShape.id);
    const nonSeatIndex = this.shapes[shapeIndex].nonSeatingArea.findIndex(x => this.selectedNonSeatingArea.id.indexOf(x.id) >= 0);
    this.shapes[shapeIndex].nonSeatingArea[nonSeatIndex].pathArray.map(point => {
      if (point.command !== 'z') {
        point.x += wallMovement.x;
        point.y += wallMovement.y;
      }
    });
    if (!!this.selectedNonSeatingArea) {
      this.selectedNonSeatingArea.parentElement.setAttribute('clip-path', `url(#${this.selectedShape.id}clip)`);
      this.selectedNonSeatingArea.parentElement.removeAttribute('transform');
      this.selectedNonSeatingArea.setAttribute('d', CommonService.buildPathString(this.shapes[shapeIndex].nonSeatingArea[nonSeatIndex].pathArray));
    }
    if (!this.isNonSeatAreaOverLap(this.selectedShape as any, this.shapes[shapeIndex].nonSeatingArea[nonSeatIndex].pathArray)) {
      this.selectedNonSeatingArea.parentElement.remove();
      this.shapesService.deleteSeatingArea(this.selectedShape.id, this.selectedNonSeatingArea.id);
    }
  }

  private isNonSeatAreaOverLap(shape: any, points: PathPoint[]) {
    let isPointFill = false;
    points.forEach(point => {
      let newPoint = this.svgElement.createSVGPoint();
      newPoint = Object.assign(newPoint, { x: point.x, y: point.y });
      if (!!shape.isPointInFill(newPoint)) {
        isPointFill = shape.isPointInFill(newPoint);
      }
    });
    return isPointFill;
  }

  private scaleNonSeatingAreas(startPort: MousePosition, scale: MousePosition) {
    const shapeIndex = this.shapes.findIndex(x => x.shapeID === this.selectedShape.id);
    const shapeGroup: HTMLElement = this.selectedShape.parentElement;
    const shape = _.cloneDeep(this.shapes[shapeIndex]);
    this.shapes[shapeIndex].nonSeatingArea.forEach(area => {
      const element = document.getElementById(`${area.id}`);
      area.pathArray.map(point => {
        if (point.command !== 'z') {
          point.x -= startPort.x;
          point.y -= startPort.y;
          point.x *= scale.x;
          point.y *= scale.y;
          point.x += startPort.x;
          point.y += startPort.y;
        }
      });
      if (!!element) {
        element.children[0].setAttribute('d', CommonService.buildPathString(area.pathArray));
      }
    });

  }

  private scaleSingleNonSeatingArea(startPort: MousePosition, scale: MousePosition) {
    const shapeIndex = this.shapes.findIndex(x => x.shapeID === this.selectedShape.id);
    const nonSeatIndex = this.shapes[shapeIndex].nonSeatingArea.findIndex(x => this.selectedNonSeatingArea.id.indexOf(x.id) >= 0);
    this.shapes[shapeIndex].nonSeatingArea[nonSeatIndex].pathArray.map(point => {
      if (point.command !== 'z') {
        point.x -= startPort.x;
        point.y -= startPort.y;
        point.x *= scale.x;
        point.y *= scale.y;
        point.x += startPort.x;
        point.y += startPort.y;
      }
    });
    if (!!this.selectedNonSeatingArea) {
      this.selectedNonSeatingArea.parentElement.setAttribute('clip-path', `url(#${this.selectedShape.id}clip)`);
      this.selectedNonSeatingArea.parentElement.removeAttribute('transform');
      this.selectedNonSeatingArea.setAttribute('d', CommonService.buildPathString(this.shapes[shapeIndex].nonSeatingArea[nonSeatIndex].pathArray));
      this.selectedNonSeatingArea.setAttribute('stroke', 'black ');
    }
  }

  private rotateSingleNonSeatingArea(centerPoint) {
    const shapeIndex = this.shapes.findIndex(x => x.shapeID === this.selectedShape.id);
    const nonSeatIndex = this.shapes[shapeIndex].nonSeatingArea.findIndex(x => this.selectedNonSeatingArea.id.indexOf(x.id) >= 0);
    this.shapes[shapeIndex].nonSeatingArea[nonSeatIndex].pathArray.map(point => {
      if (point.command !== 'z') {
        const x = point.x;
        const y = point.y;
        const tempX = x - centerPoint.x;
        const tempY = y - centerPoint.y;
        const rotatedX = tempX * Math.cos(this.rotateAngle * Math.PI / 180) - tempY * Math.sin(this.rotateAngle * Math.PI / 180);
        const rotatedY = tempX * Math.sin(this.rotateAngle * Math.PI / 180) + tempY * Math.cos(this.rotateAngle * Math.PI / 180);
        // translate back
        point.x = rotatedX + centerPoint.x;
        point.y = rotatedY + centerPoint.y;
      }
    });
    if (!!this.selectedNonSeatingArea) {
      this.selectedNonSeatingArea.parentElement.setAttribute('clip-path', `url(#${this.selectedShape.id}clip)`);
      this.selectedNonSeatingArea.parentElement.removeAttribute('transform');
      this.selectedNonSeatingArea.setAttribute('d', CommonService.buildPathString(this.shapes[shapeIndex].nonSeatingArea[nonSeatIndex].pathArray));
    }
  }

  private rotateNonSeatingAreas(centerPoint) {
    const shapeIndex = this.shapes.findIndex(x => x.shapeID === this.selectedShape.id);
    const shapeGroup: HTMLElement = this.selectedShape.parentElement;
    const shape = _.cloneDeep(this.shapes[shapeIndex]);
    this.shapes[shapeIndex].nonSeatingArea.forEach(area => {
      const element = document.getElementById(`${area.id}`);

      area.pathArray.map(point => {
        if (point.command === 'z') {
        } else {
          const x = point.x;
          const y = point.y;
          const tempX = x - centerPoint.x;
          const tempY = y - centerPoint.y;
          const rotatedX = tempX * Math.cos(this.rotateAngle * Math.PI / 180) - tempY * Math.sin(this.rotateAngle * Math.PI / 180);
          const rotatedY = tempX * Math.sin(this.rotateAngle * Math.PI / 180) + tempY * Math.cos(this.rotateAngle * Math.PI / 180);
          // translate back
          point.x = rotatedX + centerPoint.x;
          point.y = rotatedY + centerPoint.y;
        }
      });
      if (!!element) {
        element.children[0].setAttribute('d', CommonService.buildPathString(area.pathArray));
      }
    });
  }

  private drawNonSeatRectangle(element: SVGGraphicsElement, startPosition: MousePosition, currentPosition: MousePosition) {

    const shapeIndex = this.shapes.findIndex(x => x.shapeID === this.selectedShape.id);
    if (!!this.shapes[shapeIndex].nonSeatingArea) {
      const nonSeatingAreaIndex = this.shapes[shapeIndex].nonSeatingArea.findIndex(x => element.id.indexOf(x.id) >= 0);
      if (nonSeatingAreaIndex !== -1) {
        this.removeSelection();
        this.shapes[shapeIndex].nonSeatingArea[nonSeatingAreaIndex].pathArray = [
          new PathPoint('M', startPosition.x, startPosition.y),
          new PathPoint('L', currentPosition.x, startPosition.y),
          new PathPoint('L', currentPosition.x, currentPosition.y),
          new PathPoint('L', startPosition.x, currentPosition.y),
          new PathPoint('z')
        ];
        this.shapesService.updateShape(this.shapes[shapeIndex]);
        element.setAttribute('d',
          CommonService.buildPathString(this.shapes[shapeIndex].nonSeatingArea[nonSeatingAreaIndex].pathArray));
        element.setAttribute('fill', 'url(#pattern_non_seating)');
        element.setAttribute('stroke', 'black');
        this.selectionGroup = CommonService.setPathPoints(this.svgElement, this.shapes[shapeIndex].nonSeatingArea[nonSeatingAreaIndex].pathArray);
      }
    }
  }

  private drawNonSeatSquare(element: SVGGraphicsElement, startPosition: MousePosition, currentPosition: MousePosition) {
    const lengthSquare = Math.sqrt(Math.pow((startPosition.x - currentPosition.x), 2)
      + Math.pow((startPosition.y - currentPosition.y), 2)) * Math.cos(45);
    let pathArray;
    if (startPosition.x < currentPosition.x && startPosition.y < currentPosition.y) {
      pathArray = [
        { command: 'M', x: startPosition.x, y: startPosition.y },
        { command: 'L', x: (startPosition.x + lengthSquare), y: startPosition.y },
        { command: 'L', x: (startPosition.x + lengthSquare), y: (startPosition.y + lengthSquare) },
        { command: 'L', x: startPosition.x, y: (startPosition.y + lengthSquare) },
        { command: 'z' }
      ];
    } else if (startPosition.x > currentPosition.x && startPosition.y < currentPosition.y) {
      pathArray = [
        { command: 'M', x: startPosition.x, y: startPosition.y },
        { command: 'L', x: (startPosition.x - lengthSquare), y: startPosition.y },
        { command: 'L', x: (startPosition.x - lengthSquare), y: (startPosition.y + lengthSquare) },
        { command: 'L', x: startPosition.x, y: (startPosition.y + lengthSquare) },
        { command: 'z' }
      ];

    } else if (startPosition.x > currentPosition.x && startPosition.y > currentPosition.y) {

      pathArray = [
        { command: 'M', x: startPosition.x, y: startPosition.y },
        { command: 'L', x: (startPosition.x - lengthSquare), y: startPosition.y },
        { command: 'L', x: (startPosition.x - lengthSquare), y: (startPosition.y - lengthSquare) },
        { command: 'L', x: startPosition.x, y: (startPosition.y - lengthSquare) },
        { command: 'z' }
      ];

    } else if (startPosition.x < currentPosition.x && startPosition.y > currentPosition.y) {
      pathArray = [
        { command: 'M', x: startPosition.x, y: startPosition.y },
        { command: 'L', x: (startPosition.x + lengthSquare), y: startPosition.y },
        { command: 'L', x: (startPosition.x + lengthSquare), y: (startPosition.y - lengthSquare) },
        { command: 'L', x: startPosition.x, y: (startPosition.y - lengthSquare) },
        { command: 'z' }
      ];
    }
    const shapeIndex = this.shapes.findIndex(x => x.shapeID === this.selectedShape.id);
    if (!!this.shapes[shapeIndex].nonSeatingArea) {
      const nonSeatingAreaIndex = this.shapes[shapeIndex].nonSeatingArea.findIndex(x => element.id.indexOf(x.id) >= 0);
      if (nonSeatingAreaIndex !== -1) {
        this.removeSelection();
        this.shapes[shapeIndex].nonSeatingArea[nonSeatingAreaIndex].pathArray = pathArray;
        this.shapesService.updateShape(this.shapes[shapeIndex]);
        element.setAttribute('d',
          CommonService.buildPathString(this.shapes[shapeIndex].nonSeatingArea[nonSeatingAreaIndex].pathArray));
        element.setAttribute('fill', 'url(#pattern_non_seating)');
        element.setAttribute('stroke', 'black');
        this.selectionGroup = CommonService.setPathPoints(this.svgElement, this.shapes[shapeIndex].nonSeatingArea[nonSeatingAreaIndex].pathArray);

      }
    }
  }

  private drawNonSeatCircle(element: SVGGraphicsElement, startPosition: MousePosition, currentPosition: MousePosition) {
    const shapeIndex = this.shapes.findIndex(x => x.shapeID === this.selectedShape.id);
    const radius = new SvgPoints();
    radius.x = radius.y = Math.sqrt(Math.pow((startPosition.x - currentPosition.x), 2)
      + Math.pow((startPosition.y - currentPosition.y), 2));
    const start = CommonService.circle(startPosition.x, startPosition.y, radius, 359);
    const end = CommonService.circle(startPosition.x, startPosition.y, radius, 0);
    if (!!this.shapes[shapeIndex].nonSeatingArea) {
      const nonSeatingAreaIndex = this.shapes[shapeIndex].nonSeatingArea.findIndex(x => element.id.indexOf(x.id) >= 0);
      if (nonSeatingAreaIndex !== -1) {
        this.removeSelection();
        this.shapes[shapeIndex].nonSeatingArea[nonSeatingAreaIndex].pathArray = [
          { command: 'M', x: start.x, y: start.y },
          { command: 'A', arcRadiusX: radius.x, arcRadiusY: radius.y, xAxisRotation: 0, largeArcFlag: 1, sweepFlag: 0, x: end.x, y: end.y },
          { command: 'z' }
        ];
        this.shapesService.updateShape(this.shapes[shapeIndex]);
        element.setAttribute('d',
          CommonService.buildPathString(this.shapes[shapeIndex].nonSeatingArea[nonSeatingAreaIndex].pathArray));
        element.setAttribute('fill', 'url(#pattern_non_seating)');
        element.setAttribute('stroke', 'black');
        this.selectionGroup = CommonService.setPathPoints(this.svgElement, this.shapes[shapeIndex].nonSeatingArea[nonSeatingAreaIndex].pathArray);

      }
    }
  }

  private multiShapeSelect(currentSelectedShape: SVGGraphicsElement) {
    this.isMultiShapeSelected = true;
    const shapeExist = this.multiSelectedShape.findIndex(x => x === currentSelectedShape);
    if (shapeExist === -1) {
      if (!!this.selectedShape) {
        this.removeSelection();
        this.multiSelectedShape.push(...[this.selectedShape, currentSelectedShape]);
        this.selectedShape = undefined;
      } else {
        this.multiSelectedShape.push(currentSelectedShape);
      }
    } else {
      this.multiSelectedShape.splice(shapeExist, 1);
    }
    this.multiSelectedShapeGroup.forEach(ele => {
      ele.remove();
    });

    this.multiSelectedShape.forEach(shape => {
      const shapeGroup = shape.parentElement;
      this.multiSelectedShapeGroup.push(CommonService.singleSelectPathShape(shapeGroup, shape));
    });
  }

  private mergeSelectedShapes(shapes: Shape[]) {
    const pointsInShapeFill = [];
    const intersectionPoints: IntersectionPoint[] = [];
    // find intersection Points and Fill points
    shapes.forEach((aShape, i) => {
      shapes.forEach((bShape, j) => {
        if (i <= j) {
          return;
        } else {
          const aShapeEl = document.getElementById(aShape.shapeID);
          const bShapeEl = document.getElementById(bShape.shapeID);
          pointsInShapeFill.push(...CommonService.checkPointsInFill(aShape.pathArray, bShapeEl));
          pointsInShapeFill.push(...CommonService.checkPointsInFill(bShape.pathArray, aShapeEl));
          if (!!aShapeEl && !!bShapeEl) {
            intersectionPoints.push(...CommonService.getIntersection(aShapeEl, bShapeEl, aShape.walls, bShape.walls));
          }
        }
      });
    });

    const tempShapeArray = [];
    if (intersectionPoints.length === 0) {
      return;
    }
    // get temp shape array
    shapes.forEach(shape => {
      const pathPoints = [];
      shape.walls.forEach(wall => {
        const isWallStartIsRemovablePoint = pointsInShapeFill.findIndex(point =>
          point.x === wall.startPoint.x && point.y === wall.startPoint.y
        );
        const isWallEndIsRemovablePoint = pointsInShapeFill.findIndex(point =>
          point.x === wall.endPoint.x && point.y === wall.endPoint.y
        );
        //  check the intersection on the wall
        const isInterSection = intersectionPoints.filter(x => _.isEqual(x.wallOne.id, wall.id) || _.isEqual(x.wallTwo.id, wall.id));
        // there are no intersection in the wall
        if (isInterSection.length === 0) {
          const obj = {
            startPoint: wall.startPoint,
            endPoint: wall.endPoint,
            canDrawLine: true
          };
          if (isWallStartIsRemovablePoint > -1 || isWallEndIsRemovablePoint > -1) {
            obj.canDrawLine = false;
          }
          pathPoints.push(obj);
        } else {
          let firstPoint = wall.startPoint;
          if (shape.type === ShapeType.CIRCLE || shape.type === ShapeType.OVAL) {
            if (isInterSection.length >= 2) {
              const isSweepFlag = CommonService.getCircleSweepFlag(isInterSection[0].point, isInterSection[1].point,
                CommonService.getCenterPosition(this.svgElement.getElementById(shape.shapeID)));
              const objNew = {
                startPoint: isInterSection[0].point,
                endPoint: {
                  command: 'A',
                  arcRadiusX: shape.pathArray[1].arcRadiusX,
                  arcRadiusY: shape.pathArray[1].arcRadiusY,
                  xAxisRotation: 0,
                  largeArcFlag: 1,
                  sweepFlag: isSweepFlag,
                  x: isInterSection[1].point.x,
                  y: isInterSection[1].point.y
                },
                canDrawLine: true,
              };
              pathPoints.push(objNew);
            } else {
              return;
            }
          } else {
            for (const intersectionPoint of isInterSection) {
              const endPoint = CommonService.findClosestInArray(firstPoint, isInterSection).point;
              const obj = {
                startPoint: firstPoint,
                endPoint,
                canDrawLine: true,
              };
              const isStartIsIntersection = intersectionPoints.findIndex(x => x.point === obj.startPoint);
              const isEndIsIntersection = intersectionPoints.findIndex(x => x.point === obj.endPoint);
              let isIntersectionIsFillPoint = false;
              // tslint:disable-next-line:forin
              loopIntersectionPointIsFill:
              for (const i in shapes) {
                const aShape = shapes[i];
                // tslint:disable-next-line:forin
                for (const j in shapes) {
                  const bShape = shapes[j];
                  // debugger
                  if (i <= j) {
                  } else {
                    const aShapeEl = document.getElementById(aShape.shapeID);
                    const bShapeEl = document.getElementById(bShape.shapeID);
                    const fillPoint = CommonService.createSVGPoint({ x: endPoint.x, y: endPoint.y });
                    const isPointFillA = (aShapeEl as any).isPointInFill(fillPoint);
                    const isPointFillB = (bShapeEl as any).isPointInFill(fillPoint);
                    if (isPointFillA || isPointFillB) {
                      isIntersectionIsFillPoint = true;
                      break loopIntersectionPointIsFill;
                    }
                  }
                }
              }
              if ((obj.startPoint === wall.startPoint && isWallStartIsRemovablePoint > -1)) {
                obj.canDrawLine = false;
              } else if ((isStartIsIntersection > -1 && isEndIsIntersection > -1)) {
                obj.canDrawLine = !(intersectionPoints[isStartIsIntersection].shapeOne === intersectionPoints[isEndIsIntersection].shapeOne &&
                  intersectionPoints[isStartIsIntersection].shapeTwo === intersectionPoints[isEndIsIntersection].shapeTwo);
                if (isIntersectionIsFillPoint) {
                  obj.canDrawLine = false;
                }
              } else {
                obj.canDrawLine = true;
              }
              pathPoints.push(obj);
              firstPoint = obj.endPoint;
            }
            const objNew = {
              startPoint: firstPoint,
              endPoint: wall.endPoint,
              canDrawLine: true,
            };
            if (objNew.endPoint === wall.endPoint && isWallEndIsRemovablePoint > -1) {
              objNew.canDrawLine = false;
            }
            pathPoints.push(objNew);
          }
        }
      });
      tempShapeArray.push(pathPoints);
    });
    const newPathPoints = [];
    tempShapeArray.forEach(xShapes => {
      newPathPoints.push(...xShapes.filter(x => x.canDrawLine));
    });
    const loopCount = _.cloneDeep(newPathPoints.length);
    const shapePoint = [];
    for (let i = 0; i < loopCount; i++) {
      if (i === 0) {
        const points = _.cloneDeep(newPathPoints[i]);
        if (points.endPoint.command === 'A') {
          newPathPoints.splice(i, 1);
          shapePoint.push(...[
            new PathPoint('M', points.startPoint.x, points.startPoint.y),
            points.endPoint
          ]);
        } else {
          newPathPoints.splice(i, 1);
          shapePoint.push(...[
            new PathPoint('M', points.startPoint.x, points.startPoint.y),
            new PathPoint('L', points.endPoint.x, points.endPoint.y)
          ]);
        }
      } else {
        const lastPoint = shapePoint[shapePoint.length - 1];
        const isPointMergeWithStart = newPathPoints.findIndex(x => x.startPoint.x === lastPoint.x && x.startPoint.y === lastPoint.y);
        const isPointMergeWithEnd = newPathPoints.findIndex(x => x.endPoint.x === lastPoint.x &&
          x.endPoint.y === lastPoint.y);
        if (isPointMergeWithEnd > -1) {
          const points = _.cloneDeep(newPathPoints[isPointMergeWithEnd]);
          if (points) {
            newPathPoints.splice(isPointMergeWithEnd, 1);
            if (points.endPoint.command === 'A') {
              shapePoint.push(
                points.endPoint
              );
            } else {
              shapePoint.push(
                new PathPoint('L', points.startPoint.x, points.startPoint.y)
              );
            }

          }
        }
        if (isPointMergeWithStart > -1) {
          const points = _.cloneDeep(newPathPoints[isPointMergeWithStart]);
          if (points) {
            newPathPoints.splice(isPointMergeWithStart, 1);
            if (points.endPoint.command === 'A') {
              shapePoint.push(
                points.endPoint
              );
            } else {
              shapePoint.push(
                new PathPoint('L', points.endPoint.x, points.endPoint.y)
              );
            }
          }
        }
      }
    }
    if (shapePoint.length < loopCount / 2) {
      return;
    }
    const createdShape = CommonService.createPathElement(this.mainShapeGroup, ShapeType.PATH);
    this.selectedShape = createdShape.querySelector('.shapes');
    const newShape: Shape = {
      shapeID: this.selectedShape.id,
      pathArray: shapePoint,
      type: ShapeType.PATH,
      walls: [],
      isShapeGrouped: true,
      properties: undefined,
      style: new Style(this.shapeStyle.fillColor, this.shapeStyle.borderColor, 2, 1),
      visibility: true
    };
    this.shapesService.createNewShape(newShape);
    this.selectedShape.setAttribute('d', CommonService.buildPathString(newShape.pathArray));
    this.selectedShape.style.fill = newShape.style.fill;
    this.selectedShape.style.stroke = 'none';
    this.selectionGroup = CommonService.shapeSelection(this.svgElement, newShape.pathArray);
    this.updateSelectedShapeData(CommonService.createShapeWalls(this.getSelectedShapeData(), this.selectedShape, this.shapeStyle));
    shapes.forEach(x => {
      x.groupId = newShape.shapeID;
      this.shapesService.deleteShape(x.shapeID);
      const element = this.svgElement.getElementById(x.shapeID);
      element.parentElement.remove();
    });
    this.shapesService.addTempShape(shapes);
    this.shapesService.storeTempShape();
    // console.log('Intersections', intersectionPoints);
    // console.log('fill Points', pointsInShapeFill);
    // this.test3(shapePoint);
    // // this.test(intersectionPoints);
    // // this.test2(pointsInShapeFill);
    // this.test2(shapePoint);
    // console.log('Temp Shape Array', tempShapeArray);
    // console.log('final Shape Points', shapePoint);
  }

  // For Testing for merge shapes
  // ===========================================================================================
  // test(intersection: any[]) {
  //   intersection.forEach(ele => {
  //     const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  //     circle.setAttributeNS(null, 'cx', ele.point.x);
  //     circle.setAttributeNS(null, 'cy', ele.point.y);
  //     circle.setAttributeNS(null, 'r', '10');
  //     circle.setAttributeNS(null, 'style', 'fill: red; stroke: blue; stroke-width: 1px;');
  //     this.mainShapeGroup.appendChild(circle);
  //   });
  // }
  //
  // test2(intersection: any[]) {
  //   intersection.forEach(ele => {
  //     const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  //     circle.setAttributeNS(null, 'cx', ele.x);
  //     circle.setAttributeNS(null, 'cy', ele.y);
  //     circle.setAttributeNS(null, 'r', String(10));
  //     circle.setAttributeNS(null, 'style', 'fill: green; stroke: blue; stroke-width: 1px;');
  //     this.mainShapeGroup.appendChild(circle);
  //   });
  // }
  //
  // test3(intersection: any[]) {
  //   intersection.forEach(ele => {
  //     const circle = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  //     circle.setAttributeNS(null, 'd', CommonService.buildPathString(intersection));
  //     circle.setAttributeNS(null, 'style', 'fill: pink; stroke: blue; stroke-width: 1px;');
  //     this.mainShapeGroup.appendChild(circle);
  //   });
  // }
  // ===========================================================================================

  private canUnMergeSelectedShape(selectedShape: SVGGraphicsElement) {
    const shapeIndex = this.shapes.findIndex(x => x.shapeID === selectedShape.id);
    if (shapeIndex > -1) {
      return this.shapes[shapeIndex].isShapeGrouped;
    }
  }

  private unMergeShape(selectedShape: Shape, groupedShape: Shape[]) {
    const selectedShapeIndex = this.shapes.findIndex(x => x.shapeID === selectedShape.shapeID);
    this.shapes.splice(selectedShapeIndex, 1);
    this.selectedShape.parentElement.remove();
    groupedShape.forEach(shape => {
      shape.groupId = undefined;
      this.shapesService.deleteTempShape(shape.shapeID);
      this.shapes.push(shape);
    });
    this.shapesService.updateShapes(this.shapes);
    this.canUnMerge = false;
  }

  private resizeWallProperty(selectedProperty: SVGGraphicsElement, initialCoordination: MousePosition, currentPosition) {
    const property = this.getSelectedPropertyData();
    const propertyStartPoint = new SvgPoints();
    propertyStartPoint.x = !!selectedProperty.getBBox() ? selectedProperty.getBBox().x : 0;
    propertyStartPoint.y = !!selectedProperty.getBBox() ? selectedProperty.getBBox().y : 0;
    const length = CommonService.getLengthOfTwoPoints(propertyStartPoint, currentPosition);
    const propAttributes = {
      width: length,
      height: length / 2,
    };
    const wallElement = this.getSelectedPropertyWallElement();
    let newProperty;
    if (property.propertyId.indexOf(Properties.SINGLE_DOOR) >= 0) {
      newProperty = CreatePropertyService.addSingleDoor(propertyStartPoint, property, propAttributes, wallElement as any);
    } else if (property.propertyId.indexOf(Properties.DOUBLE_DOOR) >= 0) {
      newProperty = CreatePropertyService.addDoubleDoor(propertyStartPoint, property, propAttributes, wallElement as any);
    }
    CommonService.removeChildElementFromParent(selectedProperty as any);
    CommonService.drawLine(selectedProperty as any, newProperty);
    this.updateSelectedPropertyData(newProperty);
  }

  // ==================================================================================================================
  // helper Needed for refactoring
  private getSelectedShapeData(): Shape {
    const shapeIndex = this.shapes.findIndex(x => x.shapeID === this.selectedShape.id);
    return this.shapes[shapeIndex];
  }

  private getSelectedPropertyWallElement() {
    const propertyData = this.getSelectedPropertyData();
    const shapeData = this.getSelectedShapeData();
    const LineStartPoint = new MousePosition();
    const LineEndPoint = new MousePosition();
    LineStartPoint.x = _.cloneDeep(Math.round(propertyData.lineStart.x));
    LineStartPoint.y = _.cloneDeep(Math.round(propertyData.lineStart.y));
    LineEndPoint.x = _.cloneDeep(Math.round(propertyData.lineEnd.x));
    LineEndPoint.y = _.cloneDeep(Math.round(propertyData.lineEnd.y));
    const propertyInWall = shapeData.walls.find(wall => {
      const startPoint = new MousePosition();
      const endPoint = new MousePosition();
      startPoint.x = _.cloneDeep(Math.round(wall.startPoint.x));
      startPoint.y = _.cloneDeep(Math.round(wall.startPoint.y));
      endPoint.x = _.cloneDeep(Math.round(wall.endPoint.x));
      endPoint.y = _.cloneDeep(Math.round(wall.endPoint.y));
      return _.isEqual(startPoint, LineStartPoint) && _.isEqual(endPoint, LineEndPoint);
    });
    return !!propertyInWall ? this.selectedShape.parentElement.querySelector(`#${propertyInWall.id}`) : undefined;
  }

  private getSelectedPropertyData(): Property {
    const shape = this.getSelectedShapeData();
    const propertyIndex = shape.properties.findIndex(x => x.propertyId === this.selectedProperty.id);
    return shape.properties[propertyIndex];
  }

  private updateSelectedPropertyData(newData: Property) {
    const shapeIndex = this.shapes.findIndex(x => x.shapeID === this.selectedShape.id);
    const propertyIndex = this.shapes[shapeIndex].properties.findIndex(x => x.propertyId === this.selectedProperty.id);
    this.shapes[shapeIndex].properties[propertyIndex] = newData;
    this.shapesService.updateShape(this.shapes[shapeIndex]);
  }

  private updateSelectedShapeData(newData: Shape) {
    const shapeIndex = this.shapes.findIndex(x => x.shapeID === this.selectedShape.id);
    this.shapes[shapeIndex] = newData;
    this.shapesService.updateShape(this.shapes[shapeIndex]);
  }

  private get IS_SHAPE_ON_ACTION() {
    return !this.isSetWallPoint &&
      !this.isSetPoint &&
      !this.isDrawLine &&
      !this.drawNonSeatArea
      && !this.isPropertyDrag
      && !this.isPropertyResize
      && !this.isAddProperty
      && !this.isReshape
      && !this.isResize
      && !this.isLineBreak
      && !this.isSetPointForNonSeatingArea
      && !this.canAddNewWall
      && !this.canRemoveWall;
  }

  private get IS_POINT_IN_SELECTED_SHAPE() {
    return !!this.selectedShape && !!(this.selectedShape as any).isPointInFill(CommonService.createSVGPoint({
      x: this.currentPosition.x,
      y: this.currentPosition.y
    }));
  }

  // ==================================================================================================================

  private resizeShape(selectedShape: SVGGraphicsElement, shapeDimension) {
    const shapeIndex = this.shapes.findIndex(x => x.shapeID === selectedShape.id);
    const mouseMoved = new MousePosition();
    const shapeBB = selectedShape.getBBox();
    if (shapeDimension.width < 1) {
      shapeDimension.width = 1;
    } else if (shapeDimension.height < 1) {
      shapeDimension.height = 1;
    }
    mouseMoved.x = shapeDimension.width - shapeBB.width;
    mouseMoved.y = shapeDimension.height - shapeBB.height;
    const scaleValue = new MousePosition();
    scaleValue.x = (shapeBB.width + mouseMoved.x) / shapeBB.width;
    scaleValue.y = (shapeBB.height + mouseMoved.y) / shapeBB.height;

    if (shapeIndex > -1) {
      this.shapes[shapeIndex].pathArray = CommonService.scalePathPoint(this.shapes[shapeIndex].pathArray, scaleValue, shapeBB);
      CommonService.setPathDString(selectedShape, CommonService.buildPathString(this.shapes[shapeIndex].pathArray));
      this.reselectShape();
      // this.dragPathLine(mouseMoved);
      if (this.shapes[shapeIndex].properties !== undefined) {
        this.translateProperties(this.shapes[shapeIndex].properties, mouseMoved);
      }
      if (!!this.shapes[shapeIndex].walls) {
        if (this.shapes[shapeIndex].type === ShapeType.CIRCLE || this.shapes[shapeIndex].type === ShapeType.OVAL) {
          if (_.isEqual(this.shapes[shapeIndex].pathArray, this.shapes[shapeIndex].walls[0].pathArray)) {
            this.updateSelectedShapeData(CommonService.createShapeWalls(this.getSelectedShapeData(), this.selectedShape, this.shapeStyle));
          } else {
            this.scaleWallsWithFacility(shapeBB, scaleValue);
          }
        } else {
          this.scaleWallsWithFacility(shapeBB, scaleValue);
        }
      }
      if (!!this.shapes[shapeIndex].nonSeatingArea) {
        this.translateNonSeatingAreas(mouseMoved);
      }
    }
  }
}
