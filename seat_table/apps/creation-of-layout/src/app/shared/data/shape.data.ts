import {ShapeType} from '../models/utils';

export interface ShapeTool {
  icon: string;
  type: ShapeType;
  name: string;
}

export const SHAPE_TOOL_DATA: ShapeTool[] = [
  {
    icon: 'crop_square',
    type : ShapeType.SQUARE,
    name: 'Square'
  },
  {
    icon: 'crop_5_4',
    type : ShapeType.RECTANGLE,
    name: 'Rectangle'
  },
  {
    icon: 'scatter_plot',
    type : ShapeType.PATH,
    name: 'Custom'
  },
  {
    icon: 'panorama_fish_eye',
    type : ShapeType.CIRCLE,
    name: 'Circle'
  },
  {
    icon: 'linear_scale',
    type : ShapeType.LINE,
    name: 'Line'
  }
];
