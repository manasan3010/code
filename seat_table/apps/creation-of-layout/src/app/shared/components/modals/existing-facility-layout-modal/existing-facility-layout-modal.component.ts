import {FormControl} from '@angular/forms';
import {Subscription, Observable} from 'rxjs';
import {FacilityService} from '../../../services/facility.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Component, OnInit, OnDestroy, ViewChild, Inject} from '@angular/core';
import {Facility, Shape} from '../../../models/Shape';
import {CommonService} from '../../../services/common.service';

@Component({
  selector: 'app-existing-facility-layout-modal',
  templateUrl: './existing-facility-layout-modal.component.html',
  styleUrls: ['./existing-facility-layout-modal.component.scss']
})
export class ExistingFacilityLayoutModalComponent implements OnInit, OnDestroy {
  facilities: Facility[] = [];
  facilitySubscription: Subscription;
  selectedFacility = new Facility();
  venueMapName: string;
  isSearchToggle = false;

  searchText: string;
  private svgElement: any;
  private shapeGrope: SVGGraphicsElement;

  constructor(
    private DialogRef: MatDialogRef<ExistingFacilityLayoutModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { facility: Facility },
    private facilityService: FacilityService) {
  }

  ngOnInit() {

    this.facilityService.getDefineFacilities();
    this.facilitySubscription = this.facilityService.getDefineFacilities$.subscribe(
      (facilities) => {
        this.facilities = facilities;
      }
    );
  }

  onSelect(facility) {
    CommonService.removeChildElementFromParent(this.shapeGrope as any);
    if (this.selectedFacility.id !== facility.id) {
      this.selectedFacility = facility;
      if (this.selectedFacility.shapes && this.selectedFacility.shapes.length > 0) {
        setTimeout(() => {
          this.createExistingShapes(this.selectedFacility.shapes);
        }, 0);
      }
    } else {
      this.selectedFacility = new Facility();
      this.venueMapName = null;
    }

  }

  close() {
    this.DialogRef.close();
  }

  confirm() {
    const facility: Shape [] = JSON.parse(JSON.stringify(this.selectedFacility.shapes));
    this.data.facility.shapes = [...this.data.facility.shapes, ...facility];
    this.facilityService.addExistingVenueMap(this.data.facility);
    this.DialogRef.close();
  }

  ngOnDestroy(): void {
    this.facilitySubscription.unsubscribe();
  }

  createExistingShapes(shapes: Shape[]) {
    this.svgElement = document.getElementById('svgelem') as any;
    this.shapeGrope = this.svgElement.getElementById('shapeGroup') as SVGGraphicsElement;
    shapes.forEach(shape => {
      CommonService.createShapeExistingShape(this.shapeGrope, shape);
    });
    const bBox = (this.shapeGrope as any).getBBox();
    const centerPoint = CommonService.getCenterPosition(this.shapeGrope);
    // const tString = `
    // translate(-${centerPoint.x} -${centerPoint.y})
    // scale(0.5 0.5)
    // translate(${centerPoint.x} ${centerPoint.y})
    // `;
    this.svgElement.setAttribute('viewBox', `${bBox.x - 50} ${bBox.y - 50} ${bBox.width + 50}, ${bBox.height + 100}`);
    // this.shapeGrope.setAttribute('transform', tString);
  }
}
