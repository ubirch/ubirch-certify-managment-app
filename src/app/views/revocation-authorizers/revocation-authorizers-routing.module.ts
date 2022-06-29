import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RevocationAuthorizersComponent } from './revocation-authorizers.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: RevocationAuthorizersComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class RevocationAuthorizerRoutingModule {}
