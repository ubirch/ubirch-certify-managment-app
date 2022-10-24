import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PocSuperAdminsRoutingModule } from './poc-super-admins-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PocSuperAdminsRoutingModule,
    SharedModule,
    IonicModule
  ]
})
export class PocSuperAdminsModule { }
