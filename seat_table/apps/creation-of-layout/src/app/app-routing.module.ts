import { EditVenueGuard } from './shared/guards/edit-venue.guard';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardGuard } from './shared/guards/auth-guard.guard';
import { DashboardComponent } from './shared/components/dashboard/dashboard.component';
import { LoginComponent } from './shared/components/login/login.component';
import { VenueMapLayoutComponent } from './shared/components/dashboard/venue-map-layout/venue-map-layout.component';
import { VenueSelectionComponent } from './shared/components/dashboard/venue-selection/venue-selection.component';
import { CreateFacilityComponent } from './shared/components/dashboard/create-facility/create-facility.component';
import { CreateOtherStructureComponent } from './shared/components/dashboard/create-other-structure/create-other-structure.component';
import { DuplicateFacilityModalComponent } from './shared/components/modals/duplicate-facility-modal/duplicate-facility-modal.component';
import { AllocateSeatsTableComponent } from './shared/components/dashboard/allocate-seats-table/allocate-seats-table.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuardGuard],
    component: DashboardComponent,
    children: [
      {
        path: 'venueselection',
        canActivate: [AuthGuardGuard],
        component: VenueSelectionComponent
      },
      {
        path: 'venuemaplayout',
        canActivate: [AuthGuardGuard],
        component: VenueMapLayoutComponent
      },
      // {
      //   path: 'venuemaplayout/:id',
      //   canActivate: [AuthGuardGuard],
      //   component: VenueMapLayoutComponent
      // },
      {
        path: 'createFacility/:id',
        canActivate: [AuthGuardGuard],
        component: CreateFacilityComponent
      },
      {
        path: 'createotherstructure',
        canActivate: [AuthGuardGuard],
        component: CreateOtherStructureComponent
      },
      {
        path: 'createotherstructure/:id',
        canActivate: [AuthGuardGuard],
        component: CreateOtherStructureComponent
      },
      {
        path: 'allocateseatsandtable/:id',
        component: AllocateSeatsTableComponent
      },
      { path: '', pathMatch: 'full', redirectTo: 'venueselection' },
      { path: '**', redirectTo: '' },
    ]
  },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: '' },
  { path: 'duplicate', component: DuplicateFacilityModalComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
