import { AfterViewInit, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ConfirmModalType, VenueMapStatus, RULERTYPE } from '../../../models/utils';

import { trigger, transition, style, animate } from '@angular/animations';
import { MatDialog } from '@angular/material';
import { VenueSelectionModalComponent } from '../../modals/venue-selection-modal/venue-selection-modal.component';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { ConfirmationModalComponent } from '../../modals/confirmation-modal/confirmation-modal.component';
import { VenueMapService } from '../../../services/venue-map.service';
import { Facility } from '../../../models/Shape';
import { CommonService } from '../../../services/common.service';
import { VenueOLD, VenueMap } from '../../../models/Venue';
import { Subscription } from 'rxjs';
import { Setting } from '../../../models/SettingModel';
import { SettingsService } from '../../../services/settings.service';

@Component({
  selector: 'app-venue-selection',
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
  ],
  templateUrl: './venue-selection.component.html',
  styleUrls: ['./venue-selection.component.scss']
})
export class VenueSelectionComponent implements OnInit, AfterViewInit {
  venues: VenueOLD[];
  newUser = true;
  selectedVenueId: string;
  selectedVenue: VenueOLD;
  selectedVenueMap: VenueMap;
  venueMapStatusEnum = VenueMapStatus;
  venueMapStatus = VenueMapStatus.ACTIVE;
  isMenuOpen = false;
  canLoad = false;
  private settingSubscription: Subscription;
  private setting: Setting;
  private zoomScale = 1;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private venueMapService: VenueMapService,
    private route: ActivatedRoute,
    private settingService: SettingsService,
  ) {
  }

  ngOnInit() {
    this.newUser = true;
    this.canLoad = true;

    // this.venueMapService.venues$.subscribe(
    //   (data: Venue[]) => {
    //     if (data) {
    //       this.venues = data;
    //       this.venues.forEach(vm => {
    //         if (vm.venueMap.length > 0) {
    //           this.newUser = false;
    //           if (!this.selectedVenueId) {
    //             this.selectedVenueId = vm.id;
    //           }
    //         }
    //         this.venueChange();
    //         this.canLoad = true;
    //       });
    //     } else {
    //       this.newUser = true;
    //     }
    //   }
    // );
    this.settingSubscription = this.settingService.setting$.subscribe((setting) => {
      this.setting = setting;
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.createVenueMapList();
      this.createVenueMap();
    }, 0);
  }

  get RULERTYPE() { return RULERTYPE; }

  statusTypeChange(e) {
    this.createVenueMapList();
    this.createVenueMap();
  }

  venueChange() {
    this.selectedVenue = this.venues.find((x) => x.id === this.selectedVenueId);
    if (this.selectedVenue && this.selectedVenue.venueMap.length > 0) {
      this.selectVenueMap(this.selectedVenue.venueMap[0].id);
    } else {
      this.newUser = true;
    }
    setTimeout(() => {
      this.createVenueMapList();
    }, 0);
  }

  selectVenueMap(id) {
    this.selectedVenueMap = this.selectedVenue.venueMap.find(x => x.id === id);
    setTimeout(() => {
      this.createVenueMap();
    }, 0);
  }

  onClickedOutside(e: Event) {
    if (this.isMenuOpen) {
      this.isMenuOpen = !this.isMenuOpen;
    }
  }

  openVenueSelectionModal() {
    const dialogRef = this.dialog.open(VenueSelectionModalComponent,
      {
        panelClass: 'custom-dialog-container',
        height: '500px',
        width: '1000px'
      }
    );

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.router.navigate(['../venuemaplayout'], { relativeTo: this.route });
      }
    });
  }

  createVenueMapList() {
    if (!!this.selectedVenue && !this.newUser) {
      // const elements = document.querySelectorAll('.venueMapList');
      this.selectedVenue.venueMap.forEach(venueMap => {
        const svgElement = document.getElementById(`${venueMap.id}`);
        if (!!svgElement) {
          CommonService.removeChildElementFromParent(svgElement);
          const grope = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          grope.setAttribute('class', 'minShapes');
          svgElement.appendChild(grope);
          venueMap.facilities.forEach((facility, index) => {
            if (facility.shapes.length > 0) {
              facility.shapes.forEach(shape => {
                CommonService.createShapeExistingShape(grope as any, shape);
              });
            }
          });
          if (!!this.selectedVenueMap.backgroundImage.location) {
            CommonService.createVenueBackgroundImage(svgElement, this.selectedVenueMap.backgroundImage);
          }
          const bBox = (grope as any).getBBox();
          svgElement.setAttribute('viewBox', `${bBox.x - 10} ${bBox.y - 10} ${bBox.width + 10}, ${bBox.height + 10}`);
        }
      });
    }
  }

  createVenueMap() {
    if (!!this.selectedVenueMap && !this.newUser) {
      const svgElement = document.getElementById(`venueMap_${this.selectedVenueMap.id}`);
      if (!!svgElement) {
        const grope = (svgElement as any).getElementById('shapeGroup');
        CommonService.removeChildElementFromParent(grope);
        this.selectedVenueMap.facilities.forEach((facility, index) => {
          if (facility.shapes.length > 0) {
            facility.shapes.forEach(shape => {
              CommonService.createShapeExistingShape(grope as any, shape);
            });
          }
        });
        if (!!this.selectedVenueMap.backgroundImage.location) {
          CommonService.createVenueBackgroundImage(grope, this.selectedVenueMap.backgroundImage);
        }
      }
    }
  }

  deleteVenueMapLayout() {
    const dialogRef = this.dialog.open(ConfirmationModalComponent,
      {
        panelClass: 'custom-dialog-container',
        height: 'auto',
        width: '500px',
        data: {
          title: 'Delete Confirmation',
          bodyText: 'Are sure you want to delete this venue map layout',
          confirmButton: true,
          confirmButtonText: 'Delete',
          modalType: ConfirmModalType.DELETE
        }
      }
    );

    dialogRef.afterClosed().subscribe(confirm => {
      if (confirm) {
        // To Do
        // this.venueMapService.deleteVenueMap(this.selectedVenueMap);
      }
    });
  }

  copyVenueMapLayout() {
    const newVenueMap = _.cloneDeep(this.selectedVenueMap);
    const lastChar = newVenueMap.name[newVenueMap.name.length - 1];
    const venueName = newVenueMap.name.substring(0, newVenueMap.name.length - 1);
    newVenueMap.name = `${venueName} ${parseInt(lastChar, 10) + 1}`;
    newVenueMap.id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    // this.venueMapService.createNewVenue(newVenueMap);
  }
  scaleChange(scale) {
    this.zoomScale = Math.round(scale);
  }
  editSelectedVenueMap() {
    if (!!this.selectedVenueMap) {
      // this.venueMapService.selectVenueMap(this.selectedVenueMap);
      this.router.navigate(['../venuemaplayout'], { relativeTo: this.route });
    }
  }
}
