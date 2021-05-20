import { NgModule } from '@angular/core';

import { PocEmployeesRoutingModule } from './poc-employees-routing.module';
import { EmployeesListComponent } from './employees-list/employees-list.component';
import { EmployeesImportComponent } from './employees-import/employees-import.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { EmployeesFiltersComponent } from './employees-filters/employees-filters.component';
import { EmployeesDetailsComponent } from './employees-details/employees-details.component';


@NgModule({
  declarations: [
    EmployeesListComponent,
    EmployeesImportComponent,
    EmployeesFiltersComponent,
    EmployeesDetailsComponent,
  ],
  imports: [
    SharedModule,
    PocEmployeesRoutingModule
  ]
})
export class PocEmployeesModule { }
