import { Properties, PropertyType } from '../models/utils';

export interface PropertyNode {
  id: string;
  name: string;
  type: string;
  icon?: string;
  select?: boolean;
  children?: PropertyNode[];
}

export const PROPERTIES_DATA: PropertyNode[] = [
  {
    id: 'door_1',
    name: 'Door',
    icon: 'fullscreen',
    type: PropertyType.WALL_PROPERTY,
    children: [
      {
        id: 'door_1_1',
        name: Properties.SINGLE_DOOR,
        icon: 'fullscreen',
        type: PropertyType.WALL_PROPERTY,
        select: false,
      },
      {
        id: 'door_1_2',
        name: Properties.DOUBLE_DOOR,
        icon: 'fullscreen',
        type: PropertyType.WALL_PROPERTY,
        select: false,

      }
    ]
  },
  {
    id: 'window_1',
    name: 'Window',
    icon: 'fullscreen',
    type: PropertyType.WALL_PROPERTY,
    children: [
      {
        id: 'window_1_1',
        name: Properties.SINGLE_WINDOW,
        icon: 'fullscreen',
        select: false,

        type: PropertyType.WALL_PROPERTY,
      },
      {
        id: 'window_1_2',
        name: Properties.DOUBLE_WINDOW,
        icon: 'fullscreen',
        select: false,

        type: PropertyType.WALL_PROPERTY,
      }
    ]
  },
  {
    id: `${Properties.CAFETERIA}_1`,
    name: Properties.CAFETERIA,
    icon: 'free_breakfast',
    select: false,
    type: PropertyType.NON_WALL_PROPERTY
  },
  {
    id: `${Properties.WASHROOM}_1`,
    name: Properties.WASHROOM,
    icon: 'wc',
    select: false,
    type: PropertyType.NON_WALL_PROPERTY
  },
];

