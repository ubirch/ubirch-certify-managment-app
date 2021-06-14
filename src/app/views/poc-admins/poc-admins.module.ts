import { NgModule } from '@angular/core';

import { PocAdminsRoutingModule } from './poc-admins-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminListComponent } from './admin-list/admin-list.component';
import { AdminDetailsComponent } from './admin-details/admin-details.component';
import { AdminFiltersComponent } from './admin-filters/admin-filters.component';
import { AdminIdentifyComponent } from './admin-identify/admin-identify.component';
import { AdminEditComponent } from './admin-edit/admin-edit.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AdminListComponent,
    AdminDetailsComponent,
    AdminFiltersComponent,
    AdminIdentifyComponent,
    AdminEditComponent,
  ],
  imports: [
    ReactiveFormsModule,
    SharedModule,
    PocAdminsRoutingModule
  ]
})
export class PocAdminsModule { }
