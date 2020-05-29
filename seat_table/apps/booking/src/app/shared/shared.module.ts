import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
// @ts-ignore
import { MaterialUiModule } from '@seat-table/material-ui';
import { AppRoutingModule } from '../app-routing.module';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    MaterialUiModule,
    CommonModule,
    AppRoutingModule,
  ],
  exports: [
    DashboardComponent,
  ],
})
export class SharedModule { }
