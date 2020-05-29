import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-color-theme',
  templateUrl: './color-theme.component.html',
  styleUrls: ['./color-theme.component.scss'],
})
export class ColorThemeComponent implements OnInit {
  clickedButton: string = '';
  // x: any;
  ngOnInit() {
    this.clickedButton = '#676768';
    this.chnageColor(this.clickedButton);
  }
  constructor() { }
  chnageColor(value) {
    // this.x = document.querySelectorAll("[id='style']");
    this.clickedButton = value;

   


   
    document.documentElement.style.setProperty('--left-panel-tab-header-bgcolor', value);


  }
}
