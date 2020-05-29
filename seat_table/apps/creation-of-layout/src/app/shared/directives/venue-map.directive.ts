import { AfterViewInit, Directive, ElementRef, HostListener, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { FacilityService } from '../services/facility.service';
import { FacilityType, ShapeType } from '../models/utils';
import { OtherStructureService } from '../services/other-structure.service';
import { CommonService } from '../services/common.service';
import { MousePosition, VenueMap } from '../models/Venue';
import { Facility, Image, SvgPoints } from '../models/Shape';
import { VenueMapService } from '../services/venue-map.service';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

@Directive({
  selector: '[appVenueMap]'
})
export class VenueMapDirective implements OnInit, OnDestroy, AfterViewInit {
  private currentPosition = new MousePosition();
  private initialVenueScale = 0.09;
  private imageCount = 0;
  private isDrag = false;
  private isRotate = false;
  private venueMapBGImageEdit = false;
  private svgElement;
  private mainGroup: SVGElement;
  private facilities: Facility[] = [];
  private otherStructure: Facility[] = [];
  private images: Image[] = [];
  private venueMap: VenueMap;
  private selectedFacility: SVGGraphicsElement;
  private selectedCenterPoint: SVGGraphicsElement;
  private selectionGroup: SVGGraphicsElement;
  private venueMapBackgroundImage: SVGGraphicsElement;
  private selectedImage: SVGGraphicsElement;
  private initialCoordination: MousePosition;
  private selectedFacilityObj: Facility;
  private rotateAngle: number;
  private scalePoint: MousePosition = new MousePosition();
  private venueSubscription: Subscription;
  private venueBGImageEditSubscription: Subscription;
  private selectedImageObj: Image;
  private droppedFacility: any;
  private temporaryDropElement: SVGGraphicsElement;
  private mouseDragDistance: MousePosition;
  private droppedOtherStructure: any;

  @Input() isCenterPointSelected: any;
  @Output() public disableCenterPointClick = new EventEmitter();
  constructor(
    private facilityService: FacilityService,
    private otherStructureService: OtherStructureService,
    private elementRef: ElementRef,
    private venueMapService: VenueMapService
  ) {
  }

  private static addImageInVenueMap(element, image: Image) {
    const svgimg = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    svgimg.setAttributeNS('http://www.w3.org/1999/xlink', 'href', image.location);
    svgimg.setAttribute('x', image.initialPoint.x.toString());
    svgimg.setAttribute('y', image.initialPoint.y.toString());
    svgimg.setAttribute('width', image.width.toString());
    svgimg.setAttribute('height', image.width.toString());
    svgimg.setAttribute('class', 'imageGroup');
    svgimg.style.opacity = String(image.opacity / 100);
    element.appendChild(svgimg);
  }




  @Input('droppedData')
  set dragStart(data) {
    if (!!data) {
      if (data.type === FacilityType.FACILLITY) {
        this.droppedFacility = _.cloneDeep(data);
        if (!!this.droppedFacility && !this.temporaryDropElement) {
          this.createDroppedFacility(this.droppedFacility, this.facilities);
        }
      } else if (data.type === FacilityType.OTHERSTRUCTURE) {
        this.droppedOtherStructure = _.cloneDeep(data);
        if (!!this.droppedOtherStructure && !this.temporaryDropElement) {
          this.createDroppedFacility(this.droppedOtherStructure, this.otherStructure);
        }
      }
    }
  }

  @Input('dragEnd')
  set dragEnd(data) {
    if (!!this.temporaryDropElement && !!this.droppedFacility) {
      this.temporaryDropElement.remove();
      this.temporaryDropElement = undefined;
      this.droppedFacility = undefined;
    }
  }

  ngOnInit() {
    this.svgElement = this.elementRef.nativeElement;
    this.mainGroup = this.svgElement.getElementById('shapeGroup');
    this.mainGroup.setAttribute('class', 'facilities');
    this.svgElement.appendChild(this.mainGroup);

    this.venueSubscription = this.venueMapService.selectedVenueMap$.subscribe(venueMap => {
      this.venueMap = venueMap;
      if (!!this.venueMap) {
        if (!!this.venueMap.facilities && this.venueMap.facilities.length > 0) {
          this.venueMap.facilities.forEach(facility => {
            const facilityIndex = this.facilities.findIndex(x => x.id === facility.id);
            if (facilityIndex === -1) {
              const group = CommonService.createFacilityForVenueMap(this.mainGroup, facility);
              this.facilities.push(facility);
              const x = group.getBBox().x;
              const y = group.getBBox().y;
              if (x !== facility.centerPoint.x || y !== facility.centerPoint.y) {
                const movedPos = new SvgPoints();
                movedPos.x = facility.centerPoint.x - x;
                movedPos.y = facility.centerPoint.y - y;
                facility = this.scaleFacilityOnLoad(group, facility, { x, y });
                this.setOriginalLoc(group, movedPos, facility);
              }
            }
          });
        }
        if (!!this.venueMap.backgroundImage && !!this.venueMap.backgroundImage.location) {
          this.venueMapBackgroundImage = CommonService.createVenueBackgroundImage(this.svgElement, this.venueMap.backgroundImage);
        }
        if (!!this.venueMap.images && this.venueMap.images.length > 0) {
          this.images.push(...this.venueMap.images);
          this.venueMap.images.forEach((image: Image) => {
            const group = document.createElementNS('http://www.w3.org/2000/svg', 'g') as SVGGraphicsElement;
            group.setAttribute('id', image.id);
            group.setAttribute('class', 'imageGroup');
            this.mainGroup.appendChild(group);
            const imageExist = this.images.findIndex(x => x.id === image.id);
            // if (imageExist > -1) {
            //   alert('Image Already exist');
            // } else {
            // }
            VenueMapDirective.addImageInVenueMap(group, image);

          });
        }
      } else {
        alert('there is no selected Venue');
      }
    });
    // this.venueBGImageEditSubscription = this.venueMapService.venueMapBGImageEdit$.subscribe(isEdit => {
    //   this.venueMapBGImageEdit = isEdit;
    //   if (!!this.venueMapBGImageEdit) {
    //     this.mainGroup.style.display = 'none';
    //   } else {
    //     this.mainGroup.style.display = 'block';
    //     this.removeSelection();
    //   }
    // });
  }

  private scaleFacilityOnLoad(mainGroup: SVGElement, facility: Facility, startPoint) {
    const elements = Array.from(mainGroup.querySelectorAll('.shapes'));
    elements.forEach(element => {
      const shapeIndex = facility.shapes.findIndex(x => x.shapeID === element.id);
      facility.shapes[shapeIndex].pathArray.forEach((point) => {
        if (point.command !== 'z') {
          if (point.command === 'A') {
            point.arcRadiusX *= this.initialVenueScale;
            point.arcRadiusY *= this.initialVenueScale;
          }
          if (point.command === 'Q') {
            point.x1 -= startPoint.x;
            point.y1 -= startPoint.y;
            point.x1 *= this.initialVenueScale;
            point.y1 *= this.initialVenueScale;
            point.x1 += startPoint.x;
            point.y1 += startPoint.y;
          }
          point.x -= startPoint.x;
          point.y -= startPoint.y;
          point.x *= this.initialVenueScale;
          point.y *= this.initialVenueScale;
          point.x += startPoint.x;
          point.y += startPoint.y;
        }
      });
      element.setAttribute('d', CommonService.buildPathString(facility.shapes[shapeIndex].pathArray));
    });
    return facility;
  }

  ngAfterViewInit() {
    if (!!this.venueMapBGImageEdit) {
      this.selectVenueBackgroundImage();
    } else {
      this.removeSelection();
    }
  }

  ngOnDestroy() {
    this.venueMap.facilities = this.facilities;
    this.venueMap.images = this.images;
    this.venueSubscription.unsubscribe();
    // this.venueBGImageEditSubscription.unsubscribe();
  }

  @HostListener('drop', ['$event'])
  onDrop($event) {
    $event.preventDefault();
    if (!!this.temporaryDropElement) {
      if (!!this.droppedFacility) {
        this.droppedFacilityInVenueMap(this.droppedFacility);
        this.droppedFacility = undefined;
      }
      if (!!this.droppedOtherStructure) {
        this.droppedFacilityInVenueMap(this.droppedOtherStructure);
        this.droppedOtherStructure = undefined;
      }
    }
  }

  @HostListener('dragover', ['$event'])
  onDragOver($event) {
    $event.preventDefault();
    this.currentPosition = CommonService.getMousePosition(this.svgElement, $event);
    if (!!this.temporaryDropElement) {
      this.draggingDroppedFacility();
    }
  }

  @HostListener('dragenter', ['$event'])
  onDragEnter($event) {
    $event.preventDefault();
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave($event) {
    $event.preventDefault();

  }

  private createDroppedFacility(facility, facilities) {
    const isFacilityExist = facilities.findIndex(x => x.id === facility.id);
    if (isFacilityExist !== -1) {
      alert('Facility Exist');
    } else if (!!facility && facility.shapes.length > 0) {
      this.temporaryDropElement = CommonService.createFacilityForVenueMap(this.mainGroup, facility);
      const startPoint = this.temporaryDropElement.getBBox();
      const elements: any = Array.from(this.temporaryDropElement.querySelectorAll('.shapes'));
      elements.forEach(element => {
        element.classList.add(facility.type);
        const shapeIndex = facility.shapes.findIndex(x => x.shapeID === element.id);
        facility.shapes[shapeIndex].pathArray.forEach((point) => {
          if (point.command !== 'z') {
            if (point.command === 'A') {
              point.arcRadiusX *= this.initialVenueScale;
              point.arcRadiusY *= this.initialVenueScale;
            }
            if (point.command === 'Q') {
              point.x1 -= startPoint.x;
              point.y1 -= startPoint.y;
              point.x1 *= this.initialVenueScale;
              point.y1 *= this.initialVenueScale;
              point.x1 += startPoint.x;
              point.y1 += startPoint.y;
            }
            point.x -= startPoint.x;
            point.y -= startPoint.y;
            point.x *= this.initialVenueScale;
            point.y *= this.initialVenueScale;
            point.x += startPoint.x;
            point.y += startPoint.y;
          }
        });
        element.setAttribute('d', CommonService.buildPathString(facility.shapes[shapeIndex].pathArray));
      });
      this.temporaryDropElement.style.display = 'none';
    }
  }

  private draggingDroppedFacility() {
    this.temporaryDropElement.style.display = 'block';
    const initialAttributes = this.temporaryDropElement.getBBox();
    this.mouseDragDistance = new SvgPoints();
    this.mouseDragDistance.x = this.currentPosition.x - initialAttributes.x - initialAttributes.width / 2;
    this.mouseDragDistance.y = this.currentPosition.y - initialAttributes.y - initialAttributes.height / 2;
    this.temporaryDropElement.setAttribute('transform', `translate(${this.mouseDragDistance.x}, ${this.mouseDragDistance.y})`);
  }

  private droppedFacilityInVenueMap(droppedShape: Facility) {
    const shapeElement = Array.from(this.temporaryDropElement.querySelectorAll('.shapes'));
    this.temporaryDropElement.removeAttribute('transform');
    shapeElement.forEach(element => {
      const shapeIndex = droppedShape.shapes.findIndex(x => x.shapeID === element.id);
      droppedShape.shapes[shapeIndex].pathArray.forEach((point) => {
        if (point.command !== 'z') {
          if (point.command === 'Q') {
            point.x1 += this.mouseDragDistance.x;
            point.y1 += this.mouseDragDistance.y;
          }
          point.x += this.mouseDragDistance.x;
          point.y += this.mouseDragDistance.y;
        }
      });
      element.setAttribute('d', CommonService.buildPathString(droppedShape.shapes[shapeIndex].pathArray));
    });
    const bBox = this.temporaryDropElement.getBBox();

    droppedShape.centerPoint.x = bBox.x;
    droppedShape.centerPoint.y = bBox.y;
    if (droppedShape.type === FacilityType.FACILLITY) {
      this.facilities.push(_.cloneDeep(droppedShape));
    } else {
      this.otherStructure.push(_.cloneDeep(droppedShape));
    }
    this.temporaryDropElement = undefined;
  }

  @HostListener('click', ['$event'])
  click(event) {
    if (this.isCenterPointSelected) {
      this.currentPosition = CommonService.getMousePosition(this.svgElement as any, event);
      this.venueMap.centerPoint = this.currentPosition;
      const venueCenter = this.svgElement.querySelector('.venueCenter');
      if (venueCenter) {
        venueCenter.remove();
      }
      this.drawPoint(this.venueMap.centerPoint);
      this.isCenterPointSelected = false;
      this.disableCenterPointClick.emit(this.isCenterPointSelected);
    }

  }


  @HostListener('mousedown', ['$event'])
  mouseDown(event) {
    this.currentPosition = CommonService.getMousePosition(this.mainGroup as any, event);
    if (event.target.classList.contains('venueCenter')) {
      this.selectedCenterPoint = event.target;
      this.selectCenterPoint();
    }
    if (event.target.classList.contains('shapes')) {
      if (!this.isCenterPointSelected) {
        this.selectedFacility = event.target.parentElement.parentElement;
        this.selectedImage = undefined;
        this.selectedImageObj = undefined;
        this.selectFacility();
      }
    }
    if (event.target.classList.contains('imageGroup')) {
      if (!this.isCenterPointSelected) {
      this.selectedImage = event.target;
      this.selectedFacility = undefined;
      this.selectedFacilityObj = undefined;
      this.selectImage();
      }
    }
    if (this.selectedFacility && event.target.classList.contains('shapes')) {
      this.initialCoordination = this.currentPosition;
      this.isDrag = true;
    }
    if (this.selectedImage && event.target.classList.contains('imageGroup')) {
      this.initialCoordination = this.currentPosition;
      this.isDrag = true;
    }
    if ((this.selectedFacility || this.venueMapBGImageEdit || this.selectedImage) && event.target.classList.contains('rotate')) {
      this.initialCoordination = this.currentPosition;
      this.isRotate = true;
    }
    if (this.venueMapBGImageEdit && event.target.classList.contains('venueBackgroundImage')) {
      this.initialCoordination = this.currentPosition;
      this.isDrag = true;
    }
    if ((event.target === this.svgElement)) {
      this.removeSelection();
    }

  }

  @HostListener('mousemove', ['$event'])
  mouseMove(event) {
    this.currentPosition = CommonService.getMousePosition(this.mainGroup as any, event);
    //
    // Drag
    // //
    // if (this.isCenterPosition) {
    //   CommonService.createDrawPreview(this.svgElement, this.currentPosition);
    // }
    if (this.isDrag && this.venueMapBGImageEdit) {
      this.startDragFacility(this.venueMapBackgroundImage, this.currentPosition);
    } else if (this.isDrag && this.selectedImage) {
      this.startDragFacility(this.selectedImage, this.currentPosition);
    } else if (this.isDrag) {
      this.startDragFacility(this.selectedFacility, this.currentPosition);
    }
    //
    // Rotate
    //
    if (this.isRotate && this.venueMapBGImageEdit) {
      this.startRotateFacility(this.venueMapBackgroundImage, this.currentPosition);
    } else if (this.isRotate && this.selectedImage) {
      this.startRotateFacility(this.selectedImage, this.currentPosition);
    } else if (this.isRotate) {
      this.startRotateFacility(this.selectedFacility, this.currentPosition);
    }
    //
    // scale
    //
    // if (this.isResize && this.venueMapBGImageEdit) {
    //   this.startScaleFacility(this.venueMapBackgroundImage, this.currentPosition);
    // } else if (this.isResize && this.selectedImage) {
    //   this.startScaleFacility(this.selectedImage, this.currentPosition);
    // } else if (this.isResize) {
    //   this.startScaleFacility(this.selectedFacility, this.currentPosition);
    // }
  }

  @HostListener('mouseup', ['$event'])
  mouseUp(event) {
    this.currentPosition = CommonService.getMousePosition(this.mainGroup as any, event);
    if (this.isDrag) {
      this.isDrag = false;
      if (this.venueMapBGImageEdit) {
        this.endDragBGImage(this.venueMapBackgroundImage, this.currentPosition);
      } else if (this.selectedImage) {
        this.endDragImage(this.selectedImage, this.currentPosition);
      } else {
        this.endDragFacility(this.selectedFacility, this.currentPosition);
      }
      this.venueMapService.storeTempData(this.venueMap);
    }
    if (this.isRotate) {
      this.isRotate = false;
      if (this.venueMapBGImageEdit) {
        this.venueMap.backgroundImage.rotate = this.rotateAngle;
      } else if (this.selectedImage) {
        this.selectedImageObj.rotate = this.rotateAngle;
      } else {
        this.endRotateFacility(this.selectedFacility);
      }
      this.venueMapService.storeTempData(this.venueMap);

    }
    // if (this.isResize) {
    //   this.isResize = false;
    //   if (this.venueMapBGImageEdit) {
    //     this.endScaleBGImage(this.venueMapBackgroundImage);
    //   } else if (this.selectedImage) {
    //     this.endScaleImage(this.selectedImage);
    //   } else {
    //     this.endScaleFacility(this.selectedFacility, this.scalePoint);
    //   }
    //   this.venueMapService.storeTempData(this.venueMap);
    // }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Delete') {
      if (!!this.selectedFacility) {
        const index = this.facilities.findIndex(x => x.id === this.selectedFacilityObj.id);
        this.facilities.splice(index, 1);
        this.venueMap.facilities = this.facilities;
        this.selectedFacility.remove();
        this.removeSelection();
      }
      if (!!this.selectedCenterPoint) {
        console.log(this.venueMap.centerPoint);
        this.venueMap.centerPoint = null;
        this.selectedCenterPoint.remove();
        this.removeSelection();
      }
      // if (!!this.selectImage) {
      //   const index = this.images.findIndex(x => x.id === this.selectedImageObj.id);
      //   this.images.splice(index, 1);
      //   this.venueMap.images = this.images;
      //   this.selectedImage.remove();
      //   this.removeSelection();
      //
      // }
    }
  }

  private selectCenterPoint() {
    this.removeSelection();
    const shapeGrope = this.selectedCenterPoint.parentElement;
    this.selectionGroup = CommonService.normalSelectPathShape(shapeGrope, this.selectedCenterPoint);

  }
  private selectFacility() {
    this.removeSelection();
    const shapeGrope = this.selectedFacility.parentElement;
    this.selectedFacilityObj = this.facilities.find(x => x.id === this.selectedFacility.id);
    this.selectionGroup = CommonService.singleSelectPathShape(shapeGrope, this.selectedFacility, true);
  }

  private selectImage() {
    this.removeSelection();
    const shapeGrope = this.selectedImage.parentElement;
    this.selectedImageObj = this.images.find(x => x.id === shapeGrope.id);
    this.selectionGroup = CommonService.singleSelectPathShape(shapeGrope, this.selectedImage);
  }

  private selectVenueBackgroundImage() {
    this.removeSelection();
    this.selectionGroup = CommonService.singleSelectPathShape(this.venueMapBackgroundImage.parentElement, this.venueMapBackgroundImage);
  }

  private removeSelection() {
    if (!!this.selectionGroup) {
      this.selectionGroup.remove();
    }
  }

  private startDragFacility(element: SVGGraphicsElement, currentPosition: MousePosition) {
    this.removeSelection();
    if (element) {
      const x = (currentPosition.x - this.initialCoordination.x);
      const y = (currentPosition.y - this.initialCoordination.y);
      if (this.venueMapBGImageEdit) {
        const bbox = (element as SVGGraphicsElement).getBBox();
        element.setAttribute('transform', `translate(${x}, ${y})
        rotate(${this.venueMap.backgroundImage.rotate}, ${bbox.x + (bbox.width / 2)}, ${bbox.y + (bbox.height / 2)})`);
      } else if (this.selectedImage) {
        const bbox = (element as SVGGraphicsElement).getBBox();
        element.setAttribute('transform', `translate(${x}, ${y})
        rotate(${this.selectedImageObj.rotate}, ${bbox.x + (bbox.width / 2)}, ${bbox.y + (bbox.height / 2)})`);
      } else {
        element.setAttribute('transform', `translate(${x}, ${y})`);
      }
    }
  }

  private startRotateFacility(selectedFacility: SVGGraphicsElement, currentPosition: MousePosition) {
    this.removeSelection();
    const centerPoint = CommonService.getCenterPosition(selectedFacility);
    this.rotateAngle = CommonService.getAngle(centerPoint, currentPosition);
    selectedFacility.setAttribute('transform', `rotate(${this.rotateAngle}, ${centerPoint.x} , ${centerPoint.y}) `);
  }

  private endRotateFacility(selectedFacility: SVGGraphicsElement) {
    const centerPoint = CommonService.getCenterPosition(selectedFacility);
    selectedFacility.removeAttribute('transform');
    this.selectedFacilityObj.shapes.forEach((shape) => {
      shape.pathArray = CommonService.rotatePathPoint(shape.pathArray, this.rotateAngle, centerPoint);
      const shapeElement = selectedFacility.querySelector('#' + shape.shapeID);
      shapeElement.setAttribute('d', CommonService.buildPathString(shape.pathArray));
    });
    this.removeSelection();
  }

  // private startScaleFacility(element: SVGGraphicsElement, currentPosition: MousePosition) {
  //   this.selectionGroup.style.display = 'none';
  //   const startPointTarget = CommonService.getScaleStartPoint(this.svgElement, this.resizeTarget);
  //   if (startPointTarget !== null) {
  //     const startPoint = CommonService.getCirclePoint(startPointTarget) || undefined;
  //     const resizeTargetPoint = CommonService.getCirclePoint(this.resizeTarget) || undefined;
  //     if (startPoint && resizeTargetPoint) {
  //       const firstDistance = Math.sqrt(Math.pow((startPoint.x - resizeTargetPoint.x), 2) + Math.pow((startPoint.y - resizeTargetPoint.y), 2));
  //       const lastDistance = Math.sqrt(Math.pow((startPoint.x - currentPosition.x), 2) + Math.pow((startPoint.y - currentPosition.y), 2));
  //       this.scalePoint.x = lastDistance / firstDistance;
  //       this.scalePoint.y = lastDistance / firstDistance;
  //       if (element.id.indexOf(ShapeType.LINE) >= 0) {
  //
  //       } else {
  //         element.removeAttribute('stroke');
  //       }
  //       if (this.venueMapBGImageEdit) {
  //         const bBox = (element as SVGGraphicsElement).getBBox();
  //         element.setAttribute('transform', `translate(${startPoint.x}, ${startPoint.y})
  //         scale(${this.scalePoint.x}, ${this.scalePoint.y})
  //         translate(${-Math.abs(startPoint.x)}, ${-Math.abs(startPoint.y)})
  //            rotate(${this.venueMap.backgroundImage.rotate}, ${bBox.x + (bBox.width / 2)}, ${bBox.y + (bBox.height / 2)})`);
  //       } else if (this.selectedImage) {
  //         const bBox = (element as SVGGraphicsElement).getBBox();
  //         element.setAttribute('transform', `translate(${startPoint.x}, ${startPoint.y})
  //         scale(${this.scalePoint.x}, ${this.scalePoint.y})
  //         translate(${-Math.abs(startPoint.x)}, ${-Math.abs(startPoint.y)})
  //            rotate(${this.selectedImageObj.rotate}, ${bBox.x + (bBox.width / 2)}, ${bBox.y + (bBox.height / 2)})`);
  //       } else {
  //         element.setAttribute('transform', `translate(${startPoint.x}, ${startPoint.y})
  //         scale(${this.scalePoint.x}, ${this.scalePoint.y})
  //         translate(${-(startPoint.x)}, ${-(startPoint.y)})`);
  //       }
  //
  //     }
  //   }
  // }
  //
  // private endScaleFacility(selectedFacility: SVGGraphicsElement, scalePoint: MousePosition) {
  //   const startPointTarget = CommonService.getScaleStartPoint(this.svgElement, this.resizeTarget);
  //   const startPoint = CommonService.getCirclePoint(startPointTarget) || undefined;
  //   selectedFacility.removeAttribute('transform');
  //   this.selectedFacilityObj.shapes.forEach(shape => {
  //     shape.pathArray = CommonService.scalePathPoint(shape.pathArray, scalePoint, startPoint);
  //     const shapeElement = selectedFacility.querySelector('#' + shape.shapeID);
  //     shapeElement.setAttribute('d', CommonService.buildPathString(shape.pathArray));
  //   });
  //   this.selectionGroup.style.display = 'block';
  //   this.selectFacility();
  // }

  private endDragFacility(selectedShape: SVGGraphicsElement, currentPosition: MousePosition) {
    let bBox = selectedShape.getBBox();
    selectedShape.removeAttribute('transform');
    const mouseMoved = new MousePosition();
    mouseMoved.x = currentPosition.x - this.initialCoordination.x;
    mouseMoved.y = currentPosition.y - this.initialCoordination.y;
    this.selectedFacilityObj.shapes.forEach(shape => {
      shape.pathArray = CommonService.translatePathPoint(shape.pathArray, mouseMoved);
      const shapeElement = selectedShape.querySelector('#' + shape.shapeID);
      shapeElement.setAttribute('d', CommonService.buildPathString(shape.pathArray));
      bBox = selectedShape.getBBox();
      this.selectedFacilityObj.centerPoint.x = bBox.x;
      this.selectedFacilityObj.centerPoint.y = bBox.y;
    });
  }

  private setDropLocation(selectedShape: SVGGraphicsElement, currentPosition: MousePosition, facility: Facility) {
    let bBox = selectedShape.getBBox();
    const mouseMoved = new MousePosition();
    mouseMoved.x = currentPosition.x - (bBox.x + bBox.width) / 2;
    mouseMoved.y = currentPosition.y - (bBox.y + bBox.height) / 2;
    facility.shapes.forEach(shape => {
      shape.pathArray.forEach(points => {
        if (points.command === 'z') {
        } else {
          points.x += mouseMoved.x;
          points.y += mouseMoved.y;
        }
      });
      const shapeElement = selectedShape.querySelector('#' + shape.shapeID);
      shapeElement.setAttribute('d', CommonService.buildPathString(shape.pathArray));

    });
    bBox = selectedShape.getBBox();
    facility.centerPoint.x = bBox.x;
    facility.centerPoint.y = bBox.y;

    return facility;
  }

  private setOriginalLoc(selectedShape: SVGGraphicsElement, mouseMove: MousePosition, facility: Facility) {
    const elements = Array.from(selectedShape.querySelectorAll('.shapes'));
    elements.forEach(element => {
      const shapeIndex = facility.shapes.findIndex(x => x.shapeID === element.id);
      facility.shapes[shapeIndex].pathArray.forEach((points) => {
        if (points.command === 'z') {
        } else {
          if (points.command === 'Q') {
            points.x1 += mouseMove.x;
            points.y1 += mouseMove.y;
          }
          points.x += mouseMove.x;
          points.y += mouseMove.y;
        }
      });
      element.setAttribute('d', CommonService.buildPathString(facility.shapes[shapeIndex].pathArray));
    });
    return facility;
  }

  private endDragBGImage(selectedImage: SVGGraphicsElement, currentPosition: MousePosition) {
    selectedImage.removeAttribute('transform');
    const mouseMoved = new MousePosition();
    mouseMoved.x = currentPosition.x - this.initialCoordination.x;
    mouseMoved.y = currentPosition.y - this.initialCoordination.y;
    this.venueMap.backgroundImage.initialPoint.x += mouseMoved.x;
    this.venueMap.backgroundImage.initialPoint.y += mouseMoved.y;
    selectedImage.setAttribute('x', this.venueMap.backgroundImage.initialPoint.x.toString());
    selectedImage.setAttribute('y', this.venueMap.backgroundImage.initialPoint.y.toString());
    const bbox = (selectedImage as SVGGraphicsElement).getBBox();
    selectedImage.setAttribute('transform',
      `rotate(${this.venueMap.backgroundImage.rotate}, ${bbox.x + (bbox.width / 2)}, ${bbox.y + (bbox.height / 2)})`);
    this.selectVenueBackgroundImage();

  }

  private endDragImage(selectedImage: SVGGraphicsElement, currentPosition: MousePosition) {
    selectedImage.removeAttribute('transform');
    const mouseMoved = new MousePosition();
    mouseMoved.x = currentPosition.x - this.initialCoordination.x;
    mouseMoved.y = currentPosition.y - this.initialCoordination.y;
    this.selectedImageObj.initialPoint.x += mouseMoved.x;
    this.selectedImageObj.initialPoint.y += mouseMoved.y;
    selectedImage.setAttribute('x', this.selectedImageObj.initialPoint.x.toString());
    selectedImage.setAttribute('y', this.selectedImageObj.initialPoint.y.toString());
    const bbox = (selectedImage as SVGGraphicsElement).getBBox();
    selectedImage.setAttribute('transform',
      `rotate(${this.selectedImageObj.rotate}, ${bbox.x + (bbox.width / 2)}, ${bbox.y + (bbox.height / 2)})`);
    this.selectImage();

  }

  // private endScaleBGImage(selectedImage: SVGGraphicsElement) {
  //   const startPointTarget = CommonService.getScaleStartPoint(this.svgElement, this.resizeTarget);
  //   const startPoint = CommonService.getCirclePoint(startPointTarget) || undefined;
  //   selectedImage.removeAttribute('transform');
  //
  //   this.venueMap.backgroundImage.width = Math.abs(this.currentPosition.x - startPoint.x);
  //   this.venueMap.backgroundImage.height = Math.abs(this.currentPosition.y - startPoint.y);
  //
  //   selectedImage.setAttribute('width', this.venueMap.backgroundImage.width.toString());
  //   selectedImage.setAttribute('height', this.venueMap.backgroundImage.height.toString());
  //   const bbox = (selectedImage as SVGGraphicsElement).getBBox();
  //   selectedImage.setAttribute('transform',
  //     `rotate(${this.venueMap.backgroundImage.rotate}, ${bbox.x + (bbox.width / 2)}, ${bbox.y + (bbox.height / 2)})`);
  // }
  //
  // private endScaleImage(selectedImage: SVGGraphicsElement) {
  //   const startPointTarget = CommonService.getScaleStartPoint(this.svgElement, this.resizeTarget);
  //   const startPoint = CommonService.getCirclePoint(startPointTarget) || undefined;
  //   selectedImage.removeAttribute('transform');
  //
  //   this.selectedImageObj.width = Math.abs(this.currentPosition.x - startPoint.x);
  //   this.selectedImageObj.height = Math.abs(this.currentPosition.y - startPoint.y);
  //
  //   selectedImage.setAttribute('width', this.selectedImageObj.width.toString());
  //   selectedImage.setAttribute('height', this.selectedImageObj.height.toString());
  //   const bbox = (selectedImage as SVGGraphicsElement).getBBox();
  //   selectedImage.setAttribute('transform',
  //     `rotate(${this.selectedImageObj.rotate}, ${bbox.x + (bbox.width / 2)}, ${bbox.y + (bbox.height / 2)})`);
  // }


  drawPoint(centerPosition) {
    const point = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    point.setAttribute('cx', centerPosition.x);
    point.setAttribute('cy', centerPosition.y);
    point.setAttribute('class', 'venueCenter');
    point.setAttribute('r', '6');
    point.setAttribute('fill', '#3D64E6');
    this.svgElement.appendChild(point);
  }
}
