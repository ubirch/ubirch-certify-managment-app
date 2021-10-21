import { NgModule } from '@angular/core';

import { PocAdminsRoutingModule } from './poc-admins-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AdminListComponent } from './admin-list/admin-list.component';
import { AdminDetailsComponent } from './admin-details/admin-details.component';
import { AdminFiltersComponent } from './admin-filters/admin-filters.component';
import { AdminIdentifyComponent } from './admin-identify/admin-identify.component';
import { AdminFormComponent } from './admin-form/admin-form.component';
import { AdminEditComponent } from './admin-edit/admin-edit.component';
import { AdminCreateComponent } from './admin-create/admin-create.component';
import {IonicModule} from '@ionic/angular';


@NgModule({
  declarations: [
    AdminListComponent,
    AdminDetailsComponent,
    AdminFiltersComponent,
    AdminIdentifyComponent,
    AdminFormComponent,
    AdminEditComponent,
    AdminCreateComponent,
  ],
    imports: [
        SharedModule,
        PocAdminsRoutingModule,
        IonicModule
    ]
})
export class PocAdminsModule { }
