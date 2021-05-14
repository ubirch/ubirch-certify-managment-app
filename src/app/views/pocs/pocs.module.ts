import { NgModule } from '@angular/core';

import { PocsRoutingModule } from './pocs-routing.module';
import { PocImportComponent } from './poc-import/poc-import.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PocListComponent } from './poc-list/poc-list.component';
import { PocListFiltersComponent } from './poc-list-filters/poc-list-filters.component';
import { PocDetailsComponent } from './poc-details/poc-details.component';


@NgModule({
  declarations: [
    PocImportComponent,
    PocListComponent,
    PocListFiltersComponent,
    PocDetailsComponent,
  ],
  imports: [
    SharedModule,
    PocsRoutingModule
  ]
})
export class PocsModule { }
