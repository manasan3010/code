import { ImageService } from '../../../services/image.service';
import { Component, OnInit, Input } from '@angular/core';
import { ContextMenuType } from '../../../models/utils';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { DuplicateFacilityModalComponent } from '../../modals/duplicate-facility-modal/duplicate-facility-modal.component';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrls: ['./context-menu.component.scss']
})
export class ContextMenuComponent implements OnInit {
  @Input() contextMenuInputType: ContextMenuType;
  @Input() images;
  @Input() otherStructure;
  @Input() facility;
  @Input() facilities;
  @Input() details;

  contextMenuType = ContextMenuType;

  constructor(
    public dialog: MatDialog,
    private imageService: ImageService,
    private router: Router,
  ) {
  }

  ngOnInit() {
  }

  allocateSeatTable() {
    this.router.navigate(['dashboard/allocateseatsandtable', this.facility.id]);
  }

  createFacility() {
    this.router.navigate(['dashboard/createFacility', this.facility.id]);
  }

  editFacility() {
    if (this.contextMenuInputType === this.contextMenuType.DEFINED) {
      this.router.navigate(['dashboard/createFacility', this.facility.id]);
    } else if (this.contextMenuInputType === this.contextMenuType.OTHERSTRUCTURE) {
      this.router.navigate(['dashboard/createotherstructure', this.otherStructure.id]);
    }
  }

  deleteImage() {

    this.imageService.removeImage(this.details.id);
  }

  openDuplicate(): void {
    const dialogRef = this.dialog.open(DuplicateFacilityModalComponent, {
      width: '500px',
      data: {
        facilities: this.facilities,
        selectedFacility: this.facility
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
