import { NgModule } from '@angular/core';
import { PocAdminsListComponent } from './poc-edit/poc-admins-list/poc-admins-list.component';

import { PocsRoutingModule } from './pocs-routing.module';
import { PocImportComponent } from './poc-import/poc-import.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PocListComponent } from './poc-list/poc-list.component';
import { PocListFiltersComponent } from './poc-list-filters/poc-list-filters.component';
import { PocDetailsComponent } from './poc-details/poc-details.component';
import { PocEditComponent } from './poc-edit/poc-edit.component';


@NgModule({
    declarations: [
        PocImportComponent,
        PocListComponent,
        PocEditComponent,
        PocListFiltersComponent,
        PocDetailsComponent,
        PocAdminsListComponent,
    ],
  imports: [
    SharedModule,
    PocsRoutingModule
  ]
})
export class PocsModule { }
