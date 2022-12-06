import {Component, OnInit} from '@angular/core';
import {LocaleService} from "../../../core/services/locale.service";
import {ILocale} from "../../../core/models/interfaces/locale.interface";
import {filter, map, switchMap, tap} from "rxjs/operators";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {PocSuperAdminService} from "../../../core/services/poc-super-admin.service";
import {ITenant} from "../../../core/models/interfaces/tenant.interface";
import {ErrorHandlerService} from "../../../core/services/error-handler.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {getFormatedDateTime} from "../../../core/utils/date";
import {TenantTypeTranslation} from "../../../core/models/enums/tenant-type.enum";
import {TenantPoCUsageTypeTranslation} from "../../../core/models/enums/tenant-poc-usage-type.enum";
import {ITenantChanges} from "../../../core/models/interfaces/tenant-changes.interface";
import {NotificationService} from "../../../core/services/notification.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-tenant-details',
    templateUrl: './tenant-details.component.html',
    styleUrls: ['./tenant-details.component.scss'],
})
export class TenantDetailsComponent implements OnInit {

    form: FormGroup;
    locale: ILocale;
    tenantId: string;
    tenant: ITenant;

    constructor(
        private localService: LocaleService,
        private route: ActivatedRoute,
        private router: Router,
        private pocSuperAdminService: PocSuperAdminService,
        private errorService: ErrorHandlerService,
        private fb: FormBuilder,
        private notificationService: NotificationService,
        private translateService: TranslateService,
    ) {
    }

    ngOnInit() {
        this.localService.current$.subscribe(locale => this.locale = locale);
        this.route.paramMap
            .pipe(
                map((params: ParamMap) => params.get('id')),
                filter((tenantId) => !!tenantId),
                tap((tenantId) => (this.tenantId = tenantId)),
                switchMap((tenantId) => this.pocSuperAdminService.getTenant(tenantId))
            )
            .subscribe({
                next: (res: any) => {
                    this.tenant = res;
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

    loadTenant(tenantId: string) {
        this.pocSuperAdminService.getTenant(tenantId)
            .subscribe({
                next: (res: any) => {
                    this.tenant = res;
                    this.generateForm();
                },
                error: (err) => {
                    this.errorService.handlerResponseError(err);
                    this.router.navigate(['../../'], {
                        relativeTo: this.route,
                    });
                },
            })
    }

    generateForm() {
        this.form = this.fb.group({
            tenantDetails: this.fb.group({
                name: [{value: this.tenant?.name, disabled: true},
                    [Validators.required, Validators.minLength(3)]],
                email: [this.tenant?.email, [Validators.required, Validators.email]],
                phone: [this.tenant?.phone, [
                    Validators.required,
                    Validators.pattern(/^(\+|00)[0-9]{1,3}[ \-0-9]{4,14}$/),
                ]],
                createdAt: [{value: getFormatedDateTime(this.tenant.created, this.locale), disabled: true},
                    [Validators.required]],
                tenantType: [{
                    value: this.tenant?.tenantType ? TenantTypeTranslation[this.tenant?.tenantType]
                        : 'undefined', disabled: true
                }],
                usageType: [{
                    value: this.tenant?.usageType ? TenantPoCUsageTypeTranslation[this.tenant?.usageType]
                        : 'undefined', disabled: true
                }],
            })
        });
    }


    submitForm() {
        if (!this.form.value.tenantDetails || !this.tenant?.id) {
            this.notificationService.error({
                message: this.translateService.instant('tenant.notifications.updateTenant.failedDataMissing'),
                title: this.translateService.instant('tenant.notifications.updateTenant.failedDataMissingTitle'),
            });
            return;
        }

        const tenantChanges: ITenantChanges = this.form.value.tenantDetails;
        this.pocSuperAdminService.updateTenant(this.tenant.id, tenantChanges).subscribe({
            next: (_) => {
                this.notificationService.success({
                    message: this.translateService.instant('tenant.notifications.updateTenant.success'),
                    title: this.translateService.instant('tenant.notifications.updateTenant.successTitle'),
                });
                this.loadTenant(this.tenant.id);
//                this.router.navigate(['/views/super-admin/tenants']);
            },
            error: (err) => this.errorService.handlerResponseError(err)
        });
    }
}
