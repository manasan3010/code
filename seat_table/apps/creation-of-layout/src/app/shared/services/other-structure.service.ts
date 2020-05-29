import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { OtherStructure } from '../models/Shape';
import { FacilityType } from '../models/utils';

@Injectable({
  providedIn: 'root'
})
export class OtherStructureService {
  otherStructures: OtherStructure[] = [
    // new Facility('001', 'stage 001', [], [], FacilityType.OTHERSTRUCTURE),
  ];
  otherStructures$ = new BehaviorSubject<OtherStructure[]>(this.otherStructures);
  otheStructure$ = new BehaviorSubject<OtherStructure>(null);

  constructor() {
  }

  getOtherStructure(id) {
    const fac = this.otherStructures.find(x => x.id === id);
    this.otheStructure$.next(fac);
  }

  createOtherStructure(shape: OtherStructure) {
    shape.type = FacilityType.OTHERSTRUCTURE;
    this.otherStructures.push(shape);
  }

  updateOtherStructure(data: OtherStructure) {
    const index = this.otherStructures.findIndex(x => x.id === data.id);
    this.otherStructures[index] = data;
    this.otheStructure$.next(this.otherStructures[index]);
  }
}
