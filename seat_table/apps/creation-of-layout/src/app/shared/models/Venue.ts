import { Facility, Image, OtherStructure } from './Shape';
import { VenueMapStatus } from './utils';

export class Venue {
  public id: string;
  public name: string;
  public type: string;
  public latitude: number;
  public longitude: number;
  public description: string;
  public direction: string;
  public url: string;
  public telephone: string;
  public email: string;
  public image?: string;

  constructor() { }

  inilialize(obj: any) {
    this.id = obj && obj.id;
    this.name = (obj && obj.name) || '';
    this.type = (obj && obj.type) || '';
    this.latitude = obj && obj.latitude ? +obj.latitude : 0;
    this.longitude = obj && obj.longitude ? +obj.longitude : 0;
    this.description = (obj && obj.description) || '';
    this.direction = (obj && obj.direction) || '';
    this.url = (obj && obj.url) || '';
    this.telephone = (obj && obj.telephone) || '';
    this.email = (obj && obj.email) || '';
    this.image = (obj && obj.image) || '';

    return this;
  }
}
export class VenueMap {
  constructor(
    public id: string,
    public venueId: string,
    public name: string,
    public status = VenueMapStatus.ACTIVE,

    public facilities?: Facility[],
    public otherStructures?: OtherStructure[],
    public images?: Image[],

    public backgroundImage?: Image,
    public centerPoint?: MousePosition
  ) {
  }
}
export class ImageSrc {
  constructor(
    public id: string,
    public file: FileReader,
    public src: string | ArrayBuffer
  ) {
  }
}

export class MousePosition {
  x: number;
  y: number;

  constructor() {
    this.x = 0;
    this.y = 0;
  }
}

export class VenueOLD {
  constructor(
    public id?: string,
    public name?: string,
    public image?: string,
    public location?: {
      lat: number,
      lnt: number
    },
    public venueMap?: VenueMap[]
  ) {
  }
}




