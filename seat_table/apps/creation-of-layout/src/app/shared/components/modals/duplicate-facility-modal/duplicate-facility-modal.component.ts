import { Facility, Shape } from '../../../models/Shape';
import { Component, OnInit, ViewEncapsulation, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSelect } from '@angular/material';
import { FormControl } from '@angular/forms';
import { CommonService } from '../../../services/common.service';
import { FacilityService } from '../../../services/facility.service';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-duplicate-facility-modal',
  templateUrl: './duplicate-facility-modal.component.html',
  styleUrls: ['./duplicate-facility-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class DuplicateFacilityModalComponent implements OnInit {
  @ViewChild('multiSelect', { static: true }) multiSelect: MatSelect;

  facilities: Facility[] = [];
  selectedFacility: Facility;

  private shapeGrope: SVGGraphicsElement;
  private svgElement: any;
  private selectedFacilities: Facility[] = [];

  // ==========================================================
  public facilitiesMultiCtrl: FormControl = new FormControl();
  public facilityMultiFilterCtrl: FormControl = new FormControl();
  public filteredFacilitiesMulti: ReplaySubject<Facility[]> = new ReplaySubject<Facility[]>(1);
  protected _onDestroy = new Subject<void>();
  // ==========================================================

  constructor(
    private facilityService: FacilityService,
    public dialogRef: MatDialogRef<DuplicateFacilityModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.svgElement = document.getElementById('svgElem') as any;
    this.shapeGrope = this.svgElement.getElementById('shapeGroup') as SVGGraphicsElement;
    this.facilities = this.data.facilities.filter(facility => facility.shapes.length === 0);

    this.filteredFacilitiesMulti.next(this.facilities.slice());

    this.facilityMultiFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBanksMulti();
      });

    this.selectedFacility = this.data.selectedFacility;

    if (this.selectedFacility) {
      setTimeout(() => {
        this.createExistingShapes(this.selectedFacility.shapes);
      }, 0);
    }
  }

  // ==========================================================

  protected filterBanksMulti() {
    if (!this.facilities) {
      return;
    }
    // get the search keyword
    let search = this.facilityMultiFilterCtrl.value;
    if (!search) {
      this.filteredFacilitiesMulti.next(this.facilities.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredFacilitiesMulti.next(
      this.facilities.filter(fac => fac.name.toLowerCase().indexOf(search) > -1)
    );
  }

  removeSelectedFacility(index) {
    if (index > -1) {
      this.facilitiesMultiCtrl.value.splice(index, 1);
    }
    this.facilitiesMultiCtrl.setValue(this.facilitiesMultiCtrl.value);
  }

  // ==========================================================

  createExistingShapes(shapes: Shape[]) {
    shapes.forEach(shape => {
      CommonService.createShapeExistingShape(this.shapeGrope, shape);
    });
    const bBox = (this.shapeGrope as any).getBBox();
    this.svgElement.setAttribute('viewBox', `${bBox.x - 10} ${bBox.y - 10} ${bBox.width + 10}, ${bBox.height + 10}`);
  }

  duplicateFacility() {
    console.log(this.selectedFacilities);
  }
}
