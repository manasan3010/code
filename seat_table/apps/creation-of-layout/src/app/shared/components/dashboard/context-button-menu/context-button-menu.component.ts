import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ContextButtonActionType, ContextButtonType} from '../../../models/utils';

@Component({
  selector: 'app-context-button-menu',
  templateUrl: './context-button-menu.component.html',
  styleUrls: ['./context-button-menu.component.scss']
})
export class ContextButtonMenuComponent implements OnInit {
  @Input() buttonMenuType;
  @Output() buttonActionType = new EventEmitter();
  actionType = ContextButtonActionType;
  menuType = ContextButtonType;
  constructor() { }

  ngOnInit() {
  }
  buttonAction(actionType: ContextButtonActionType) {
    this.buttonActionType.emit(actionType);
  }
}
