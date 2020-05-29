import { AgmCoreModule } from '@agm/core';
import { FacilityFilterPipe } from './pipes/facility-filter.pipe';
import { NgModule } from '@angular/core';

// All the pipes
import { VenueMapFilterPipe } from './pipes/venue-map-filter.pipe';
import { VenueFilterPipe } from './pipes/venue-filter.pipe';

// All the modules
import { AppRoutingModule } from '../app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClickOutsideModule } from 'ng-click-outside';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ColorPickerModule } from 'ngx-color-picker';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
// All the Directives
import { FileDropDirective } from './directives/file-drop.directive';

// All the components
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { VenueMapLayoutComponent } from './components/dashboard/venue-map-layout/venue-map-layout.component';
import { VenueSelectionComponent } from './components/dashboard/venue-selection/venue-selection.component';
import { VenueSelectionModalComponent } from './components/modals/venue-selection-modal/venue-selection-modal.component';
import { AddImageModelComponent } from './components/modals/add-image-model/add-image-model.component';
import { BackgroundImageModalComponent } from './components/modals/background-image-modal/background-image-modal.component';
import { CreateFacilityComponent } from './components/dashboard/create-facility/create-facility.component';
import { CreateOtherStructureComponent } from './components/dashboard/create-other-structure/create-other-structure.component';
import { DuplicateFacilityModalComponent } from './components/modals/duplicate-facility-modal/duplicate-facility-modal.component';
import { VenueMapDirective } from './directives/venue-map.directive';
import { SettingsComponent } from './components/dashboard/settings/settings.component';
import { ContextMenuComponent } from './components/dashboard/context-menu/context-menu.component';
import { AllocateSeatsTableComponent } from './components/dashboard/allocate-seats-table/allocate-seats-table.component';
import { ExistingFacilityLayoutModalComponent } from './components/modals/existing-facility-layout-modal/existing-facility-layout-modal.component';
import { ContextButtonMenuComponent } from './components/dashboard/context-button-menu/context-button-menu.component';
import { CommonFunctionDirective } from './directives/common-function.directive';
import { ConfirmationModalComponent } from './components/modals/confirmation-modal/confirmation-modal.component';
import { ShapeLayersComponent } from './components/dashboard/shape-layers/shape-layers.component';
import { ZoomPanDirective } from './directives/zoom-pan.directive';
import { PropertiePipePipe } from './pipes/property-filter.pipe';
import { TableArrangementDirective } from './directives/auto-allocation.directive';
import { LongPressDirective } from './directives/long-press.directive';
import { ColorThemeComponent } from './components/dashboard/color-theme/color-theme.component';
import { OpenImageModalComponent } from './components/modals/open-image-modal/open-image-modal.component';
import { SeatsAllocationDirective } from './directives/seats-allocation.directive';
import { SeatDeleteConfirmationModelComponent } from './components/modals/seat-delete-confirmation-model/seat-delete-confirmation-model.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {ToastrModule} from 'ngx-toastr';
import { InputComponent } from './components/dashboard/input/input.component';
import {CreateTableDirective} from './directives/create-table.directive';
import { MaterialUiModule } from '@seat-table/material-ui';


@NgModule({
  declarations: [
    LoginComponent,
    DashboardComponent,
    VenueMapLayoutComponent,
    VenueSelectionComponent,
    VenueMapFilterPipe,
    VenueFilterPipe,
    VenueSelectionModalComponent,
    FileDropDirective,
    AddImageModelComponent,
    BackgroundImageModalComponent,
    CreateFacilityComponent,
    FileDropDirective,
    AddImageModelComponent,
    CreateOtherStructureComponent,
    DuplicateFacilityModalComponent,
    VenueMapDirective,
    SettingsComponent,
    ContextMenuComponent,
    AllocateSeatsTableComponent,
    ExistingFacilityLayoutModalComponent,
    FacilityFilterPipe,
    ContextButtonMenuComponent,
    CommonFunctionDirective,
    ConfirmationModalComponent,
    ShapeLayersComponent,
    ZoomPanDirective,
    PropertiePipePipe,
    TableArrangementDirective,
    LongPressDirective,
    ColorThemeComponent,
    OpenImageModalComponent,
    SeatsAllocationDirective,
    SeatDeleteConfirmationModelComponent,
    InputComponent,
    CreateTableDirective
  ],
  imports: [
    MaterialUiModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ClickOutsideModule,
    NgbModule,
    ImageCropperModule,
    NgxUiLoaderModule,
    ColorPickerModule,
    NgxMatSelectSearchModule,
    ToastrModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDeYieR5QS_8QoAjU7gRe_Yr8fwh6GkVGM'
    }),
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'})
  ],
  exports: [
    LoginComponent,
    DashboardComponent,
    ConfirmationModalComponent,
    CreateTableDirective
  ],
  entryComponents: [
    VenueSelectionModalComponent,
    AddImageModelComponent,
    BackgroundImageModalComponent,
    AddImageModelComponent,
    DuplicateFacilityModalComponent,
    ExistingFacilityLayoutModalComponent,
    ConfirmationModalComponent,
    OpenImageModalComponent,
    SeatDeleteConfirmationModelComponent
  ],
  providers: []
})

export class SharedModule {
}
