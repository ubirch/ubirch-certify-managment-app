import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { ILocationIdChange } from '../../../core/models/interfaces/locationIdChange.interface';
import { LocationIdChangesStates } from '../../../core/models/enums/location-id-changes-states.enum';
import { IPocSuperAdmin } from 'src/app/core/models/interfaces/poc-super-admin.interface';
import { PocSuperAdminService } from 'src/app/core/services/poc-super-admin.service';

@Component({
    selector: 'app-super-admin-details',
    templateUrl: './super-admin-details.component.html',
    styleUrls: ['./super-admin-details.component.scss'],
})
export class SuperAdminDetailsComponent implements OnInit {
    form: FormGroup;
    poc: any;
    pocId: any;

    constructor(
        private pocSuperAdminService: PocSuperAdminService,
        private errorService: ErrorHandlerService,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private router: Router
    ) {}
        

    ngOnInit() {
        this.route.paramMap
            .pipe(
                map((params: ParamMap) => params.get('id')),
                filter((pocId) => !!pocId),
                tap((pocId) => (this.pocId = pocId)),
                switchMap((pocId) => this.pocSuperAdminService.getPoc(pocId))
            )
            .subscribe({
                next: (res: any) => {
                    this.poc = res;
                    console.log(this.poc);
                    this.generateForm();
                },
                error: (err) => {
                    this.errorService.handlerResponseError(err);
                    this.router.navigate(['../../'], {
                        relativeTo: this.route,
                    });
                },
            });
    }

    generateForm() {
        this.form = this.fb.group({
            tenant: this.fb.control(this.poc.tenantName).disable(),
            pocDetails: this.fb.group({
                pocName: this.fb
                    .control(this.poc.pocName, [
                        Validators.required,
                        Validators.minLength(3),
                    ])
                    .disable(),
                externalId: this.fb
                    .control(this.poc.externalId, [Validators.required])
                    .disable(),
                status: this.fb
                    .control(this.poc.status.toLowerCase())
                    .disable(),
                createdAt: this.fb
                    .control(this.poc.created, [
                        Validators.required,
                        Validators.minLength(5),
                    ])
                    .disable(),
                active: this.fb
                    .control(this.poc.active, [
                        Validators.required,
                        Validators.minLength(3),
                    ])
                    .disable(),
            }),
            clientCert: this.fb
                .control(this.poc.phone, [Validators.required])
                .disable(),
        });
    }

    renewClientCertificate() {
        this.pocSuperAdminService.renewClientCert(this.poc.id)
    }
}
