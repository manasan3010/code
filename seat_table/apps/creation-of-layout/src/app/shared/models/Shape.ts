import {FacilityType, ShapeType, PropertyType} from './utils';
import {MousePosition} from './Venue';
import {CONFIGTYPE} from './utils';
import {propertyMap} from '../helpers/modelMapper';
import {ImageCroppedEvent} from 'ngx-image-cropper';

export class SvgPoints {
  x: number;
  y: number;

  constructor() {
    this.x = 0;
    this.y = 0;
  }
}

class BBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class Facility {

  constructor(
    public id?: string,
    public name?: string,
    public shapes?: Shape [],
    public temporaryShape?: Shape[],
    public type?: FacilityType,
    public length?: number,
    public width?: number,
    public height?: number,
    public centerPoint = new SvgPoints()
  ) {
  }

  initialize(data) {
    if (data) {
      this.id = !!data.id ? data.id : '';
      this.name = !!data.name ? data.name : '';
      this.shapes = [];
      this.temporaryShape = [];
      this.type = !! data.type ? data.type : undefined;
      this.height = !! data.height ? data.height : 0;
      this.width = !! data.width ? data.width : 0;
      this.length = !! data.length ? data.length : 0;
    }
    return this;
  }
}

export class Block {
  constructor(
    public id: string,
    public facilityID: string,
    public facilityShapeID: string,
    public type: ShapeType,
    public pathPoint: PathPoint[],
    public seatsRow: SeatsRow [] = [],
    public style = new Style('none', 'black', 2, 1)
  ) {
  }
}

export class SeatsRow {
  constructor(
    public id: string,
    public name: string,
    public linePathPoint?: PathPoint [],
    public seats?: Seat [],
    public seatsRadius?: number,
    public curve?: number,
    public seatSpacing?: number,
    public isSeatLabelInAsc = true
  ) {
  }
}

export class FormSeatsProperties {
  constructor(
    public priceBand: PriceBand,
    public radius: number,
    public curve: number,
    public seatSpacing: number,
    public  isSeatLabelAsc: boolean,
    public  rowStart: string,
  ) {
  }
}

export class FormTableTypeProperties {
  constructor(
    public name: string,
    public seatCount: number,
    public priceBand: PriceBand,
    public shareType: string,
    public width: number,
    public length: number,
    public radius: number
  ) {
  }
}

export class OtherStructure {
  constructor(
    public id?: string,
    public name?: string,
    public shapes?: Shape [],
    public temporaryShape?: Shape[],
    public type?: FacilityType,
    public centerPoint = new SvgPoints()
  ) {

  }
}

export class Shape {
  shapeID: string;
  visibility: boolean;
  style: Style;
  type: ShapeType;
  walls: Wall[];
  isShapeGrouped = false;
  groupId?: string;
  nonSeatingArea?: NonSeatingArea[];
  pathArray?: PathPoint[];
  properties?: Property[];
}

export class NonSeatingArea {
  constructor(
    public id: string,
    public shapeType: ShapeType,
    public pathArray?: PathPoint[],
  ) {
  }
}

export class Wall {
  constructor(
    public id: string,
    public pathArray: PathPoint[] = [],
    public style = new Style('none', 'black', 3, 1),
    public startPoint = new SvgPoints(),
    public endPoint = new SvgPoints(),
  ) {
  }
}

export class PathPoint {
  constructor(
    public command?: string,
    public x?: number,
    public y?: number,
    public x1?: number,
    public y1?: number,
    public x2?: number,
    public y2?: number,
    public style?: Style,
    public arcRadiusX?: number,
    public arcRadiusY?: number,
    public xAxisRotation?: number,
    public largeArcFlag?: number,
    public sweepFlag?: number
  ) {
  }
}

export interface ImageCroppedEvent extends ImageCroppedEvent {
  opacity: number;
}

export class Property {
  constructor(
    public propertyId: string,
    public type: PropertyType,
    public lineStart?: SvgPoints,
    public lineEnd?: SvgPoints,
    public image?: Image,
    public pathArray?: PathPoint[]
  ) {
  }
}

export class Image {
  constructor(
    public id?: string,
    public initialPoint = new SvgPoints(),
    public rotate = 0,
    public opacity = 100,
    public location?: string,
    public width?: number,
    public height?: number
  ) {
  }
}

export class Style {
  constructor(
    public fill?: string,
    public stroke?: string,
    public strokeWidth?: number,
    public opacity?: number,
  ) {
  }
}


export class Config {
  id: string;
  facilityId: string;
  type: CONFIGTYPE;
  name: string;
  tables?: AllocatedTable[];
}

export class TableType {
  constructor(
    public id: string,
    public name?: string,
    public shape?: Shape,
    public seats?: Seat[],
    public shareType?: string,
    public attributes = new Attributes(),
  ) {
  }
}

export class AllocatedTable {
  public id: string;
  public name: string;
  public priceBand: PriceBand;
  public tableType: TableType;
  public tableShape: Shape;
  public seats: Seat[];
  public rotatedAngle: number;
  public isColapsed = false;

  constructor() {
  }
}

export class Seat {
  constructor(
    public id: string,
    public centerPoint = new MousePosition(),
    public sideStartPoint?: MousePosition,
    public sideEndPoint?: MousePosition,
    public radius = 5,
    public priceBand?: PriceBand,
    public style = new Style(),
    public name?: string
  ) {
  }
}

export class SelectedTableInfo {
  constructor(
    public tableType: TableType,
    public cover: number,
    public startingNumber: number,
    public priceband: PriceBand,
    public prefix?: string,
    public draggable?: boolean
  ) {
  }
}

export class Attributes {
  constructor(
    public length = 0,
    public height = 0,
    public width = 0,
    public radius = 0
  ) {

  }
}

export class PriceBand {
  id: string;
  name: string;
  color: string;
}
