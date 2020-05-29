import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from '../app-routing.module';
import { CreateAndEditTableModalComponent } from './components/modals/create-and-edit-table-modal/create-and-edit-table-modal.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialUiModule } from '@seat-table/material-ui';

@NgModule({
    declarations: [
        CreateAndEditTableModalComponent,
    ],
    imports: [
        CommonModule,
        MaterialUiModule,
        AppRoutingModule,
        SharedModule,
        ReactiveFormsModule,
        FormsModule
    ],
    entryComponents: [
        CreateAndEditTableModalComponent
    ],
    exports: [
        CreateAndEditTableModalComponent
    ],
    providers: [

    ]
})

export class TablePlanModule { }
