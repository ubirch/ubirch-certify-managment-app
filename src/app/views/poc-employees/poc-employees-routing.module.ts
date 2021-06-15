import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeEditComponent } from './employee-edit/employee-edit.component';
import { EmployeesImportComponent } from './employees-import/employees-import.component';
import { EmployeesListComponent } from './employees-list/employees-list.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: EmployeesListComponent
  },
  {
    path: 'edit/:id',
    component: EmployeeEditComponent
  },
  {
    path: 'import',
    component: EmployeesImportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PocEmployeesRoutingModule { }
