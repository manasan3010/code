import { Injectable } from '@angular/core';
import { Facility, SvgPoints } from '../models/Shape';
import { BehaviorSubject } from 'rxjs';
import { VenueMapStatus } from '../models/utils';
import { VenueOLD, VenueMap, Venue } from '../models/Venue';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Guid } from 'guid-typescript';

@Injectable({
  providedIn: 'root'
})
export class VenueMapService {
  selectedVenueMap$ = new BehaviorSubject<VenueMap>(null);

  constructor(private http: HttpClient) {
    if (VenueMapService.venueMapSelected()) {
      const venue: VenueMap = JSON.parse(localStorage.getItem('selectedVenueMap'));
      this.selectedVenueMap$.next(venue);
    }
  }

  static venueMapSelected() {
    const venueMap: VenueMap = JSON.parse(localStorage.getItem('selectedVenueMap'));
    return !!venueMap;
  }

  getVenue() {
    let url = `${environment.apiUrl}/api/V4.1/venues`;
    url += '?include=documents';
    return this.http.get<any>(url);
  }

  selectedVenueMap(venueMap: VenueMap) {
    this.selectedVenueMap$.next(venueMap);
  }

  createNewVenueMap(venue: Venue, venueMapName: string) {
    // GET ID FROM API
    const venueMap = new VenueMap(
      Guid.create().toString(),
      venue.id,
      venueMapName,
      VenueMapStatus.ACTIVE);

    this.selectedVenueMap$.next(venueMap);
    this.storeTempData(venueMap);
  }

  deleteVenueMap() {

  }

  storeTempData(venueMap) {
    localStorage.setItem('selectedVenueMap', JSON.stringify(venueMap));
  }
}
