import {ActivatedRoute, Router} from '@angular/router';
import {FacilityService} from '../../../services/facility.service';
import {OtherStructureService} from '../../../services/other-structure.service';
import {Component, OnInit, ViewChild, AfterViewInit, ElementRef, HostListener, ViewEncapsulation} from '@angular/core';
import {MatDialog, MatInput, MatMenuTrigger} from '@angular/material';
import {trigger, transition, style, animate} from '@angular/animations';

import {MatSlider, MatSliderChange} from '@angular/material/slider';
import {AddImageModelComponent} from '../../modals/add-image-model/add-image-model.component';
import {ImageService} from '../../../services/image.service';
import {Subscription} from 'rxjs';
import {ImageSrc, VenueMap} from '../../../models/Venue';
import {BackgroundImageModalComponent} from '../../modals/background-image-modal/background-image-modal.component';
import {ContextMenuType, RULERTYPE} from '../../../models/utils';
import {Facility} from '../../../models/Shape';
import {CommonService} from '../../../services/common.service';
import {VenueMapService} from '../../../services/venue-map.service';
import {Setting} from '../../../models/SettingModel';
import {SettingsService} from '../../../services/settings.service';
import set = Reflect.set;
import get = Reflect.get;
import {log} from 'util';
import {SidePanelDetail} from '../../../models/CommonModels';
import {DuplicateFacilityModalComponent} from '../../modals/duplicate-facility-modal/duplicate-facility-modal.component';
import {FormBuilder, Validators, FormGroup} from '@angular/forms';


@Component({
  selector: 'app-venue-map-layout',
  templateUrl: './venue-map-layout.component.html',
  styleUrls: ['./venue-map-layout.component.scss'],
  animations: [
    trigger('myAnimation',
      [
        transition(
          ':enter',
          [
            style({transform: 'translateY(-30%)', opacity: 0}),
            animate('300ms',
              style({transform: 'translateY(0)', opacity: 1}))
          ]
        ), transition(
        ':leave',
        [
          style({transform: 'translateY(0)', opacity: 1}),
          animate('300ms',
            style({transform: 'translateY(-30%)', opacity: 0})),
        ]
      )
      ]
    ),
  ]
})
export class VenueMapLayoutComponent implements OnInit, AfterViewInit {
  @ViewChild('hiddenText', {static: false}) textEl: ElementRef;

  facilities: Facility[] = [];
  otherStructures: any[] = [];
  images: ImageSrc[] = [];
  venueMap: VenueMap;
  componentHeight: number;
  rightPanelHeight = 0;
  sidePanelDetail: SidePanelDetail = new SidePanelDetail();
  dropData: any;
  setting: Setting;
  isFacilityLLoad = false;

  // Boolean
  isvenueMapNameEditable = false;
  isToolMenuOpen = false;

  // Subscription
  facilitiesSubscription: Subscription;
  otherStructureSubscription: Subscription;
  imageSubscription: Subscription;
  settingSubscription: Subscription;

  // =================================
  contextMenuPosition = {x: '0px', y: '0px'};
  bGImage;
  opacity: HTMLElement;

  isSearch = false;

  private selectedImage: ImageSrc;
  private isImageSelected: boolean;
  private venueMapBGImageEdit: boolean;
  private isBGImage: boolean;
  private isButtonVisible = true;
  private temname;
  private dragEnd = false;
  maxWidth = 350;
  width = 250;

  public form: FormGroup;
  searchText: string;

  isCenterPointSelected = false;
  imageURl: any;
  cropedImage: any;
  zoomValue = 100;
  finalZoomValue = this.zoomValue;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private venueMapService: VenueMapService,
    private otherStructureService: OtherStructureService,
    private facilityService: FacilityService,
    private route: ActivatedRoute,
    private settingService: SettingsService,
    private imageService: ImageService,
    private fb: FormBuilder) {
    this.onResize();
  }

  ngOnInit() {
    this.form = this.fb.group({
      facName: ['', Validators.required],
      facType: ['', Validators.required],
      category: ['', Validators.required],
    });


    this.venueMapService.selectedVenueMap$.subscribe((venueMap: any) => {
      if (!venueMap) {
        this.router.navigate(['../../'], {relativeTo: this.route});
      } else {
        this.venueMap = venueMap;
        const textWidth = this.venueMap.name.length * 6.6;
        if (textWidth < this.maxWidth) {
          this.width = textWidth;
        } else {
          this.width = this.maxWidth;
        }
      }
    });
    this.facilityService.getFacilities(this.venueMap.venueId);
    this.facilitiesSubscription = this.facilityService.facilities$.subscribe(
      (data) => {
        this.facilities = data;
        if (this.facilities.length > 0) {
          this.isFacilityLLoad = true;
        }
      },
      (err) => {
        console.log(err);
      }
    );
    this.otherStructureSubscription = this.otherStructureService.otherStructures$.subscribe(
      (data) => {
        this.otherStructures = data;
      }
    );
    this.imageSubscription = this.imageService.imageURL$.subscribe(
      (data) => {
        this.images = data;
      }
    );

    this.settingSubscription = this.settingService.setting$.subscribe(data => {
      this.setting = data;
    });
  }

  ngAfterViewInit() {
    this.createShapesForStructures(this.facilities);
    this.createShapesForStructures(this.otherStructures);
    this.resizeVenuMapNameInput();
  }

  get RULERTYPE() {
    return RULERTYPE;
  }

  get contextMenuType() {
    return ContextMenuType;
  }

  resizeText() {
    const textWidth = this.venueMap.name.length * 6.6;
    setTimeout(() => {
      if (textWidth < this.maxWidth) {
        this.width = this.textEl.nativeElement.offsetWidth + 2;
      } else {
        this.width = this.maxWidth;
      }
    }, 0);
  }

  // ============ LEFT PANEL HEIGHT SET ============================
  setHeight() {
    const facility = this.sidePanelDetail.facility.isSelected;
    const otherStructure = this.sidePanelDetail.otherStructure.isSelected;
    const images = this.sidePanelDetail.image.isSelected;

    if (facility && !otherStructure && !images) {
      this.setValueForHeight(this.rightPanelHeight, 0, 0);
    } else if (!facility && otherStructure && !images) {
      this.setValueForHeight(0, this.rightPanelHeight, 0);
    } else if (!facility && !otherStructure && images) {
      this.setValueForHeight(0, 0, this.rightPanelHeight);
    } else if (facility && otherStructure && !images) {
      this.setValueForHeight((this.rightPanelHeight / 3) * 2, (this.rightPanelHeight / 3) * 1, 0);
    } else if (facility && !otherStructure && images) {
      this.setValueForHeight((this.rightPanelHeight / 3) * 2, 0, (this.rightPanelHeight / 3) * 1);
    } else if (!facility && otherStructure && images) {
      this.setValueForHeight(0, (this.rightPanelHeight / 2) * 1, (this.rightPanelHeight / 2) * 1);
    } else if (facility && otherStructure && images) {
      this.setValueForHeight((this.rightPanelHeight / 4) * 2, (this.rightPanelHeight / 4) * 1, (this.rightPanelHeight / 4) * 1);
    } else if (!facility && !otherStructure && !images) {
      this.setValueForHeight(0, 0, 0);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.componentHeight = window.innerHeight - 45;
    this.rightPanelHeight = window.innerHeight - 172;

    this.setHeight();
  }

  setValueForHeight(facility, otherStructure, image) {
    this.sidePanelDetail.facility.height = facility;
    this.sidePanelDetail.otherStructure.height = otherStructure;
    this.sidePanelDetail.image.height = image;
  }


  // ========================== FACILITY/OTHER STRUCTURE ==============================
  createShapesForStructures(structures) {
    console.log(structures);
    structures.forEach((data, index) => {
      if (data.shapes.length > 0) {
        const svgElement = document.getElementById(`${data.type}${data.id}_${index}`);
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('class', 'minShapes');
        svgElement.appendChild(group);
        data.shapes.forEach(shape => {
          CommonService.createShapeExistingShape(group as any, shape);
        });
        const bBox = (group as any).getBBox();
        svgElement.setAttribute('viewBox', `${bBox.x - 10} ${bBox.y - 10} ${bBox.width + 10}, ${bBox.height + 10}`);
      }
    });
  }

  shapeDrag(event, data) {
    const dragElement = document.getElementById(`dom_${data.id}`);
    if (!!dragElement) {
      dragElement.style.opacity = '0';
    }
    this.dropData = Object.assign({}, data);
  }


  // ========================== BACKGROUND IMAGE ==============================
  openAddBackgroundModal() {
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
        this.cropedImage = result.image;
        this.imageURl = result.image.base64;
        this.addImageInVenueMap(this.imageURl);
        console.log(result);
      }
    });
  }

  addImageInVenueMap(src) {
    const mainSvg = document.getElementById('svg');
    const svgimg: any = mainSvg.querySelector('.backgroundImage');
    svgimg.setAttributeNS('http://www.w3.org/1999/xlink', 'href', src);
    svgimg.setAttribute('height', (this.componentHeight - 16).toString());
    svgimg.style.opacity = this.cropedImage.opacity / 100;
  }

  changeOpacity(event: MatSliderChange) {
    this.venueMap.backgroundImage.opacity = event.value;
    const bgImage: any = document.getElementsByClassName('venueBackgroundImage')[0];
    bgImage.style.opacity = (this.venueMap.backgroundImage.opacity / 100).toString();
  }


  // ========================== Image ==============================
  openAddImage() {
    const dialogRef = this.dialog.open(AddImageModelComponent,
      {
        panelClass: 'custom-dialog-container',
        height: '500px',
        width: '1000px'
      }
    );

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      }
    });
  }

  selectImage(id) {
    this.selectedImage = this.images.find(x => x.id === id);
    this.isImageSelected = true;
  }

  onSelection(event: any, buttonId): void {
    const menu = document.getElementById(buttonId);
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    menu.click();
  }

  // ================ VENUEMAP LAYOUT NAME =========================
  resizeVenuMapNameInput() {
    // setTimeout(() => {
    //   const minWidth = 60;
    //   let width;
    //   if (this.invTextER.nativeElement.offsetWidth > minWidth) {
    //     width = this.invTextER.nativeElement.offsetWidth + 50;
    //   } else {
    //     width = minWidth;
    //   }
    //   const ele = document.getElementById('inputVenueName');
    //   ele.style.width = `${width}px`;
    // }, 0);
  }

  checkLength() {
    const textWidth = this.venueMap.name.length * 6.6;
    if (textWidth > this.maxWidth) {
      this.width = this.maxWidth;
    } else {
      this.width = textWidth;
    }
  }

  atStart() {
    this.isvenueMapNameEditable = true;
    this.temname = this.venueMap.name;
  }

  saveName() {
    if (this.venueMap.name.length === 0) {
      this.venueMap.name = this.temname;
    } else {
      this.isvenueMapNameEditable = false;
      this.temname = this.venueMap.name;
    }
  }

  cancelEdit() {
    if (this.isvenueMapNameEditable) {
      this.isvenueMapNameEditable = false;
      this.venueMap.name = this.temname;
      this.checkLength();
    }
  }


  inputKeyPress(e: KeyboardEvent) {
    if (!this.venueMap.name.length) {
      return;
    }

    switch (e.key) {
      case 'Escape': {
        this.isvenueMapNameEditable = false;
        break;
      }
      case 'Enter': {
        this.isvenueMapNameEditable = false;
        break;
      }
      default: {
        break;
      }
    }
  }

  // ===============================================================

  saveVenueMap() {
    const venue = JSON.parse(localStorage.getItem('selectedVenueMap'));
    this.router.navigate(['../venueselection'], {relativeTo: this.route});
  }

  onClose() {
    if (!!this.venueMapBGImageEdit) {
      const venue: VenueMap = JSON.parse(localStorage.getItem('selectedVenueMap'));
      this.router.navigate(['../venueselection'], {relativeTo: this.route});
    }
  }

  shapeDragEnd(data) {
    const dragElement = document.getElementById(`dom_${data.id}`);
    if (!!dragElement) {
      dragElement.style.opacity = '1';
    }
    this.dragEnd = Object.assign({}, true);
  }

  setCenterPoint() {
    this.isCenterPointSelected = true;
  }

  deactivateCenterPoint(data) {
    this.isCenterPointSelected = data;
  }

  getZoomValue(data) {
    this.finalZoomValue = Math.round(this.zoomValue - data * 3.5);
  }

}
