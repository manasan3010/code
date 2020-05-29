import {BehaviorSubject} from 'rxjs';
import {Injectable} from '@angular/core';
import {Facility} from '../models/Shape';
import {VenueMapService} from './venue-map.service';
import * as _ from 'lodash';
import {VenueMap} from '../models/Venue';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Deserializer} from 'ts-json-api-formatter';

@Injectable({
  providedIn: 'root'
})
export class FacilityService {
  facilities: Facility [] = [];
  selectedFacility$: BehaviorSubject<Facility> = new BehaviorSubject<Facility>(null);
  facilities$: BehaviorSubject<Facility[]> = new BehaviorSubject<Facility[]>(this.facilities);
  getDefineFacilities$ = new BehaviorSubject<Facility[]>(null);

  constructor(
    private venueMapService: VenueMapService,
    private http: HttpClient
  ) {
    if (this.getLocalStoreData()) {
      const facility: Facility = JSON.parse(localStorage.getItem('selectedFacility'));
      const fasIndex = this.facilities.findIndex(x => x.id === facility.id);
      let newFacility = new Facility();
      newFacility = Object.assign(newFacility, facility);
      this.facilities[fasIndex] = newFacility ;
      this.selectedFacility$.next(facility);
    }
    if (!!localStorage.getItem('facilities')) {
      this.facilities = JSON.parse(localStorage.getItem('facilities'));
      this.facilities$.next(this.facilities);
    }
  }

  getFacilities(venueId: string) {
    const url = `${environment.apiUrl}/api/V4.1/assets?filters.venueId=${venueId}&filters.assetClassId=1`;
    this.http.get<any>(url).pipe(map(data => {
      const deserializeData = new Deserializer().deserialize(data);
      return deserializeData.map(d => {
        return new Facility().initialize(d);
      });
    })).subscribe(data => {
      if (this.facilities.length === 0) {
        this.facilities = data;
      }
      this.facilities$.next(this.facilities);
    });
  }

  getFacility(id) {
    const fac = this.facilities.find(x => x.id === id);
    this.storeTempData(fac);
    this.selectedFacility$.next(fac);
  }

  getDefineFacilities() {
    const newData = this.facilities.filter(x => x.shapes.length > 0);
    this.getDefineFacilities$.next(newData);
  }

  updateFacility(data: Facility) {
    const index = this.facilities.findIndex(x => x.id === data.id);
    this.facilities[index] = data;
    const venueMap: VenueMap = this.venueMapService.selectedVenueMap$.value;
    if (venueMap && venueMap.facilities) {
      venueMap.facilities.forEach(facility => {
        if (facility.id === data.id) {
          const group = document.getElementById(facility.id);
          facility.shapes = _.cloneDeep(data.shapes);
        }
      });
    }
    localStorage.setItem('facilities', JSON.stringify(this.facilities));
    this.venueMapService.selectedVenueMap$.next(venueMap);
  }

  addExistingVenueMap(data) {
    const index = this.facilities.findIndex(x => x.id === data.id);
    this.facilities[index] = data;
    this.storeTempData(this.facilities[index]);
    this.selectedFacility$.next(this.facilities[index]);
  }

  removeLocalStoreData() {
    if (this.getLocalStoreData()) {
      localStorage.removeItem('selectedFacility');
    }
  }

  storeTempData(facility: Facility) {
    localStorage.setItem('selectedFacility', JSON.stringify(facility));
  }

  getLocalStoreData() {
    const facility = JSON.parse(localStorage.getItem('selectedFacility'));
    return !!facility;
  }

  duplicate(abc) {
    // const index = this.facilities.findIndex(x => x.id === abc.id);
    // this.facilities[index] = abc;
    //
    // console.log('Service data ',  this.facilities[index]);
    // const venueMap: VenueMap = this.venueMapService.selectedVenueMap$.value;
    // venueMap.facilities.forEach ( facility => {
    //   const group = document.getElementById(abc.id);
    //   facility.shapes = _.cloneDeep(abc.shapes);
    //   console.log('facility shapes', facility.shapes);
    //
    // });
  }
}
