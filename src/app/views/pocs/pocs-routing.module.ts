import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PocEditComponent} from './poc-edit/poc-edit.component';
import {PocImportComponent} from './poc-import/poc-import.component';
import {PocListComponent} from './poc-list/poc-list.component';
import {PocLocationEditComponent} from "./poc-edit/location-edit/poc-location-edit.component";
import {LocationIdChangeTableComponent} from "./poc-edit/location-id-change-table/location-id-change-table.component";

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: PocListComponent
    },
    {
        path: 'edit/:id',
        component: PocEditComponent
    },
    {
        path: 'edit/location/:id',
        component: PocLocationEditComponent
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
export class PocsRoutingModule {
}
