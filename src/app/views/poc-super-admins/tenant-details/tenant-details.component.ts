import {Component, OnInit} from '@angular/core';
import {LocaleService} from "../../../core/services/locale.service";
import {ILocale} from "../../../core/models/interfaces/locale.interface";
import {filter, map, switchMap, tap} from "rxjs/operators";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {PocSuperAdminService} from "../../../core/services/poc-super-admin.service";
import {ITenant} from "../../../core/models/interfaces/tenant.interface";
import {ErrorHandlerService} from "../../../core/services/error-handler.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {getCertUrgency, getFormatedDateTime} from "../../../core/utils/date";
import {TenantTypeTranslation} from "../../../core/models/enums/tenant-type.enum";
import {TenantPoCUsageTypeTranslation} from "../../../core/models/enums/tenant-poc-usage-type.enum";
import {ITenantChanges} from "../../../core/models/interfaces/tenant-changes.interface";
import {NotificationService} from "../../../core/services/notification.service";
import {TranslateService} from "@ngx-translate/core";
import {interval, startWith, Subscription} from "rxjs";
import {CERTURGENCY} from "../../../core/models/enums/certUrgency.enum";
import {ConfirmDialogService} from "../../../shared/components/confirm-dialog/confirm-dialog.service";

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
    polling: Subscription;
    isPolling = false;
    CERTURGENCY = CERTURGENCY;

    constructor(
        private localService: LocaleService,
        private route: ActivatedRoute,
        private router: Router,
        private pocSuperAdminService: PocSuperAdminService,
        private errorService: ErrorHandlerService,
        private fb: FormBuilder,
        private notificationService: NotificationService,
        private translateService: TranslateService,
        private confirmDialog: ConfirmDialogService,
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
        if (!this.form.value.tenantDetails || !this.tenantId) {
            this.notificationService.error({
                message: this.translateService.instant('tenant.notifications.updateTenant.failedDataMissing'),
                title: this.translateService.instant('tenant.notifications.updateTenant.failedDataMissingTitle'),
            });
            return;
        }

        const tenantChanges: ITenantChanges = this.form.value.tenantDetails;
        this.pocSuperAdminService.updateTenant(this.tenantId, tenantChanges).subscribe({
            next: (_) => {
                this.notificationService.success({
                    message: this.translateService.instant('tenant.notifications.updateTenant.success'),
                    title: this.translateService.instant('tenant.notifications.updateTenant.successTitle'),
                });
                this.loadTenant(this.tenantId);
//                this.router.navigate(['/views/super-admin/tenants']);
            },
            error: (err) => this.errorService.handlerResponseError(err)
        });
    }

    renewClientCertificate() {
        this.confirmDialog.open({
            title: this.translateService.instant('superAdmin.cert.renew-title'),
            message: this.translateService.instant('superAdmin.cert.renew-message'),
            yes: this.translateService.instant('superAdmin.cert.renew-yes'),
            no: this.translateService.instant('superAdmin.cert.renew-no'),
            okOnly: false
        }).subscribe((result) => {
            if (result) {
                this.restartPolling(this.tenantId);
                this.pocSuperAdminService.renewTenantClientCert(this.tenantId).subscribe({
                    next: (res: any) => {
                        this.notificationService.success({
                            message: this.translateService.instant('superAdmin.cert.renew-success'),
                            title: this.translateService.instant('superAdmin.cert.renew-success-title'),
                        });
                    },
                    error: (err) => {
                        this.errorService.handlerResponseError(err);
                    },
                });
            }
        });
    }

    checkCertUrgency() {
        return getCertUrgency(this.tenant.certExpirationDate);
    }

    public restartPolling(tenantId: string) {
        this.stopPolling();

        this.polling = interval(10000)
            .pipe(
                startWith(0),
                switchMap(() => this.pocSuperAdminService.getTenant(tenantId))
            ).subscribe({
                next: (res: any) => {
                    this.isPolling = true;
                    let oldCert = this.tenant.certExpirationDate;
                    this.tenant = res;
                    this.generateForm();
                    if (oldCert !== this.tenant.certExpirationDate) {
                        this.stopPolling();
                        this.isPolling = false;
                    }
                },
                error: (err) => {
                    this.errorService.handlerResponseError(err);
                    this.router.navigate(['../../'], {
                        relativeTo: this.route,
                    });
                },
            });
    }

    public stopPolling() {
        if (this.polling) {
            this.polling.unsubscribe();
        }
    }

    ngOnDestroy() {
        this.stopPolling();
    }
}
