import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PocImportComponent } from './poc-import/poc-import.component';
import { PocListComponent } from './poc-list/poc-list.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: PocListComponent
  },
  {
    path: 'import',
    component: PocImportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PocsRoutingModule { }
