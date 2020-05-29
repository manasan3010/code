import { SettingsService } from './../../../services/settings.service';
import { Component, OnInit } from '@angular/core';
import { Setting } from '../../../models/SettingModel';
import * as _ from 'lodash';
import { RULERTYPE } from '../../../models/utils';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})

export class SettingsComponent implements OnInit {
  setting: Setting;
  constructor(
    private settingService: SettingsService
  ) { }

  ngOnInit() {
    this.settingService.setting$.subscribe((data) => {
      this.setting = _.cloneDeep(data);
    });
  }

  get RULERTYPE() { return RULERTYPE; }

  svgViewChange(e) {
    this.setting.rulerType = e.value;
    this.settingService.setting$.next(this.setting);
  }

  spaceChange() {
    this.settingService.setting$.next(this.setting);
  }
}
