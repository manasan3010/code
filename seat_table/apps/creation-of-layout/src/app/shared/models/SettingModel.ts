import { RULERTYPE } from './utils';

export class Setting {
  constructor(
    public rulerType: RULERTYPE,
    public tableTableSpace: number,
    public wallTableSpace: number
  ) { }
}
