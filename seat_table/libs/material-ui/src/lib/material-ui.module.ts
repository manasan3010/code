import { NgModule } from '@angular/core';
import {MatSliderModule} from '@angular/material/slider';
import {DragDropModule} from '@angular/cdk/drag-drop';

import {
  MatButtonModule,
  MatCheckboxModule,
  MatSelectModule,
  MatFormFieldModule,
  MatRadioModule,
  MatCardModule,
  MatIconModule,
  MatExpansionModule,
  MatTooltipModule,
  MatDialogModule,
  MatAutocompleteModule,
  MatInputModule,
  MatButtonToggleModule,
  MatMenuModule,
  MatSlideToggleModule, MatTreeModule, MatProgressSpinnerModule, MatTabsModule
} from '@angular/material';
import {CdkTreeModule} from '@angular/cdk/tree';

@NgModule({
  imports: [
    MatSelectModule,
    MatFormFieldModule,
    MatRadioModule,
    MatCardModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatExpansionModule,
    MatTooltipModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatInputModule,
    MatButtonToggleModule,
    MatMenuModule,
    DragDropModule,
    MatSliderModule,
    MatDialogModule,
    MatSlideToggleModule,
    CdkTreeModule,
    MatTreeModule,
    MatProgressSpinnerModule,
    MatTabsModule
  ],
  exports: [
    MatSelectModule,
    MatFormFieldModule,
    MatRadioModule,
    MatCardModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatExpansionModule,
    MatTooltipModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatInputModule,
    MatButtonToggleModule,
    MatMenuModule,
    DragDropModule,
    MatSliderModule,
    MatDialogModule,
    MatSlideToggleModule,
    CdkTreeModule,
    MatTreeModule,
    MatProgressSpinnerModule,
    MatTabsModule
  ]
})
export class MaterialUiModule {}
