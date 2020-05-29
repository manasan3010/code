import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'input-number',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit, OnChanges {
  @Input() inputValue: any;
  @Input() minValue: any;
  @Input() maxValue: any;

  @Output() outputValue = new EventEmitter<number>();

  isActive = false;
  oldx = 0;

  constructor() { }

  ngOnInit() {
    this.inputValue = Math.round(this.inputValue);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.inputValue) {
      this.inputValue = Math.round(this.inputValue);
    }
  }

  mouseDrag(event) {
    if (this.isActive) {
      if (event.pageX < this.oldx) {
        this.inputValue = this.inputValue - 1;
      } else if (event.pageX > this.oldx) {
        this.inputValue = this.inputValue + 1;
      }

      this.oldx = event.pageX;
      this.outputValue.emit(this.inputValue);
    }
  }

  valueChange() {
    this.outputValue.emit(this.inputValue);
  }

  increaseValue() {
    this.inputValue = this.inputValue + 1;
    this.outputValue.emit(this.inputValue);
  }
  decreaseValue() {
    this.inputValue = this.inputValue - 1;
    this.outputValue.emit(this.inputValue);
  }
}
