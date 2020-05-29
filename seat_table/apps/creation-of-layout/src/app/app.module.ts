import { ErrorInterceptor } from './core/error.interceptor';
import { JwtInterceptor } from './core/jwt.Interceptor';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ColorPickerModule } from 'ngx-color-picker';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SeatPlanModule } from './seat-plan/seat-plan.module';
import { TablePlanModule } from './table-plan/table-plan.module';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MaterialUiModule } from '@seat-table/material-ui';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SeatPlanModule,
    TablePlanModule,
    ColorPickerModule,
    SharedModule,
    MaterialUiModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxMatSelectSearchModule,

  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
