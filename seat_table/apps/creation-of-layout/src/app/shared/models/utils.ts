export enum VenueMapStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  ALL = 'All'
}

export enum FacilityType {
  OTHERSTRUCTURE = 'otherStructure',
  FACILLITY = 'facility'
}

export enum ContextMenuType {
  DEFINED = 'Defined',
  UNDEFINED = 'Undefined',
  OTHERSTRUCTURE = 'Other Structure',
  IMAGES = 'Images'
}

export enum ShapeType {
  RECTANGLE = 'Rectangle',
  SQUARE = 'Square',
  CIRCLE = 'Circle',
  PATH = 'Path',
  OVAL = 'Oval',
  LINE = 'Line'
}

export enum VENUETOGGLE {
  MAP = 'MAP',
  IMAGE = 'IMAGE',
  INFO = 'INFO'
}

export enum CONFIGTYPE {
  SEAT = 'SEAT',
  TABLE = 'TABLE'
}

export enum RULERTYPE {
  RULER = 'Ruler',
  GRID = 'Grid'
}

export enum ContextButtonActionType {
  DELETE_PROPERTY = 'Delete Property',
  FLIP_PROPERTY_VERICAL = 'Flip Property Vertical',
  FLIP_PROPERTY_HORIZONTAL = 'Flip Property Horizontal',
  ADD_NEW_LINE = 'Add New Line'
}

export enum Controls {
  SELECT = 'Select',
  DELETE = 'Delete Property',
  BREAK_LINE = 'Break Line',
  ADD_WALL = 'add wall',
  REMOVE_WALL = 'Remove Wall',
  MERGE_SHAPES = 'Merge Shapes',
  DRAW_NON_SEAT_AREA = 'DRAW_NON_SEAT_AREA',
  CURVE_WALL = 'CURVE_WALL',
  FLIP_PROPERTY_VERICAL = 'Flip Property Vertical',
  FLIP_PROPERTY_HORIZONTAL = 'Flip Property Horizontal',
}

export enum MultiSelectionType {
  RECT_SELECTION = 'RECT_SELECTION'
}

export enum Properties {
  SINGLE_DOOR = 'Single_Door',
  DOUBLE_DOOR = 'Double_Door',
  SINGLE_WINDOW = 'Single_Window',
  DOUBLE_WINDOW = 'Double_Window',
  CAFETERIA = 'Cafeteria',
  WASHROOM = 'Washroom'
}

export enum SeatAllocationSelectionType {
  CAN_SELECT_BLOCK = 'CAN_SELECT_BLOCK',
  CAN_SELECT_ROWS = 'CAN_SELECT_ROWS',
  CAN_SELECT_SEATS = 'CAN_SELECT_SEATS',
}

export enum PropertyType {
  WALL_PROPERTY = 'wall_Prop',
  NON_WALL_PROPERTY = 'non_wall'
}

export enum ContextButtonType {
  WALL_PROPERTY = 'wall_property',
  NON_WALL_PROPERTY = 'non_wall_property',
  WALL = 'wall'
}

export enum RectanglePoints {
  TOP_LEFT = 'TOP_LEFT',
  TOP_CENTER = 'TOP_CENTER',
  TOP_RIGHT = 'TOP_RIGHT',
  BOTTOM_LEFT = 'BOTTOM_LEFT',
  BOTTOM_RIGHT = 'BOTTOM_RIGHT',
  BOTTOM_CENTER = 'BOTTOM_CENTER',
  LEFT_CENTER = 'LEFT_CENTER',
  RIGHT_CENTER = 'RIGHT_CENTER'
}

export enum ConfirmModalType {
  DELETE = 'DELETE'
}

export enum TableModelType {
  CREATE_TABLE_TYPE = 'CREATE_TABLE_TYPE',
  EDIT_TABLE_TYPE = 'EDIT_TABLE_TYPE',
  DUPLICATE_TABLE_TYPE = 'DUPLICATE_TABLE_TYPE',
  EDIT_ALLOCATED_TABLE = 'EDIT_ALLOCATED_TABLE'
}

export enum SeatingRowType {
  SINGLE_ROW_SEATS = 'SINGLE_ROW_SEATS',
  MULTI_ROW_SEATS = 'MULTI_ROW_SEATS'
}

export enum SeatSelectionConfigType {
  SPLIT_SPACE,
  CHANGE_LABEL_ORDER
}
