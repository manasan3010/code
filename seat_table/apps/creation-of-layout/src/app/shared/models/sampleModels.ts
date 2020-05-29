import {MousePosition} from './Venue';
import {PathPoint} from './Shape';

export class IntersectionPoint {
  constructor(
    public point: any,
    public shapeOne: any,
    public shapeTwo: any,
    public wallOne: any,
    public wallTwo: any
  ) {
  }
}
