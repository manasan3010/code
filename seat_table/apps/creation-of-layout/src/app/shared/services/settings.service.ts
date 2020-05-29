import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Setting } from '../models/SettingModel';
import { RULERTYPE } from '../models/utils';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  setting$ = new BehaviorSubject<Setting>(new Setting(RULERTYPE.RULER, 30, 30));

  constructor() { }
}
