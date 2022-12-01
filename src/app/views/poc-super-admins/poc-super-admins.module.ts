import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PocSuperAdminsRoutingModule } from './poc-super-admins-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { IonicModule } from '@ionic/angular';
import { SuperAdminListComponent } from './super-admin-list/super-admin-list.component';
import { SuperAdminListFiltersComponent } from './super-admin-list-filters/super-admin-list-filters.component';
import { SuperAdminDetailsComponent } from './super-admin-details/super-admin-details.component';
import { PocMainAdminComponent } from './super-admin-details/poc-main-admin/poc-main-admin.component';
import {TenantsListComponent} from "./tenants-list/tenants-list.component";
import {TenantsListFiltersComponent} from "./tenants-list-filters/tenants-list-filters.component";


@NgModule({
  declarations: [
    SuperAdminListComponent,
    SuperAdminListFiltersComponent,
    SuperAdminDetailsComponent,
    PocMainAdminComponent,
    TenantsListComponent,
    TenantsListFiltersComponent
  ],
  imports: [
    CommonModule,
    PocSuperAdminsRoutingModule,
    SharedModule,
    IonicModule
  ]
})
export class PocSuperAdminsModule { }
