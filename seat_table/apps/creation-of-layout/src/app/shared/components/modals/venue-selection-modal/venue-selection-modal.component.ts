import { Image } from './../../../models/Shape'; import { OpenImageModalComponent } from './../open-image-modal/open-image-modal.component';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatInput, MatDialogRef, MatButtonToggleChange, MatDialog } from '@angular/material';
import { FormControl } from '@angular/forms';
import { VenueMapService } from '../../../services/venue-map.service';
import { VenueMap, Venue } from '../../../models/Venue';
import { Serializer } from 'ts-json-api-formatter';
import { Deserializer } from 'ts-json-api-formatter';
import { environment } from '../../../../../environments/environment.prod';
import { VENUETOGGLE } from '../../../models/utils';
@Component({
  selector: 'app-venue-selection-modal',
  templateUrl: './venue-selection-modal.component.html',
  styleUrls: ['./venue-selection-modal.component.scss']
})

export class VenueSelectionModalComponent implements OnInit {
  @ViewChild('venueMapNameInput', { static: false }) venueMapNameInput: MatInput;

  startingImg = 'assets/images/seats.jpg';
  venues: Venue[] = [];
  selectedVenue: Venue;
  mapZoom = 15;
  searchText: string;
  venueMapName: string;
  venueToggleView = VENUETOGGLE.IMAGE;

  // ALL THE BOOLEAN
  isVenueLoaded = false;
  isToggle = false;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private venueMapService: VenueMapService,
    public dialogRef: MatDialogRef<VenueSelectionModalComponent>
  ) {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(OpenImageModalComponent, {
      panelClass: 'custom-dialog-container',
      width: '1050px',
      height: '568px',

      data: { image: this.startingImg }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

    });
  }

  ngOnInit() {
    this.venueMapService.getVenue().subscribe(
      data => {
        const deserializedVenue = (new Deserializer()).deserialize(data);

        this.venues = deserializedVenue.map(c => {
          const ps = new Venue().inilialize({
            ...c,
            image: this.getImageURL(c.documents)
          });
          return ps;
        });
        this.isVenueLoaded = true;
      },
      err => { }
    );

    this.selectedVenue = new Venue();
  }

  get VENUETOGGLE() { return VENUETOGGLE; }

  getImageURL(data): string {
    if (data) {
      for (const document of data) {
        const documentFileType = document.documentFile.split('.')[1];

        if (documentFileType === 'png' || documentFileType === 'jpg') {
          return environment.apiUrl + document.documentFile;
        }
      }
    }
    return '';
  }

  mapToggle(e: MatButtonToggleChange) {
    this.venueToggleView = e.value;
  }

  onSelect(venue: Venue) {
    if (this.selectedVenue.id !== venue.id) {
      this.selectedVenue = venue;
      this.venueMapName = venue.name + ' Venue Map Layout';
      this.isToggle = true;

      if (!!venue.image && venue.image.length > 0) {
        this.startingImg = venue.image;
        this.venueToggleView = this.venueToggleView === VENUETOGGLE.INFO ? VENUETOGGLE.INFO : VENUETOGGLE.IMAGE;
      } else {
        this.venueToggleView = this.venueToggleView === VENUETOGGLE.INFO ? VENUETOGGLE.INFO : VENUETOGGLE.MAP;
      }
    } else {
      this.selectedVenue = new Venue();
      this.venueMapName = null;
      this.isToggle = false;
      this.startingImg = 'assets/images/seats.jpg';
      this.venueToggleView = VENUETOGGLE.IMAGE;
    }
    this.venueMapNameInput.focus();
  }

  confirm() {
    // const venueMap = new VenueMap(Math.random().toString(36).slice(-5), this.selectedVenue.id, this.venueMapName, []);
    // this.venueMapService.createNewVenue(venueMap);
    // console.log(venueMap);

    if (this.selectedVenue.id) {
      this.venueMapService.createNewVenueMap(this.selectedVenue, this.venueMapName);
      this.dialogRef.close(
        true
      );
    }
  }

  close() {
    if (this.selectedVenue.id) {
      this.dialogRef.close(
        false
      );
    }
  }
}
