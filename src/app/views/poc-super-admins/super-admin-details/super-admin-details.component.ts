import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {filter, map, switchMap, tap} from 'rxjs/operators';
import {ErrorHandlerService} from 'src/app/core/services/error-handler.service';
import {NotificationService} from 'src/app/core/services/notification.service';
import {PocSuperAdminService} from 'src/app/core/services/poc-super-admin.service';
import {ConfirmDialogService} from "../../../shared/components/confirm-dialog/confirm-dialog.service";
import {ILocale} from "../../../core/models/interfaces/locale.interface";
import {LocaleService} from "../../../core/services/locale.service";
import {CERTURGENCY} from "../../../core/models/enums/certUrgency.enum";
import {interval, startWith, Subscription} from "rxjs";
import {getFormatedDateTime} from "../../../core/utils/date";
import {EXPIRED_THRESHOLD, URGENT_THRESHOLD, VERY_URGENT_THRESHOLD} from "../../../core/utils/constants";

@Component({
    selector: 'app-super-admin-details',
    templateUrl: './super-admin-details.component.html',
    styleUrls: ['./super-admin-details.component.scss'],
})
export class SuperAdminDetailsComponent implements OnInit {
    form: FormGroup;
    poc: any;
    pocId: string;
    locale: ILocale;

    polling: Subscription;
    isPolling = false;

    constructor(
        private pocSuperAdminService: PocSuperAdminService,
        private errorService: ErrorHandlerService,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private router: Router,
        private confirmDialog: ConfirmDialogService,
        private translate: TranslateService,
        private notificationService: NotificationService,
        private localService: LocaleService,
    ) {
    }


    ngOnInit() {
        this.localService.current$.subscribe(locale => this.locale = locale);
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
//                    console.log(this.poc);
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
            tenant: this.fb.control(this.poc.tenantName),
            pocDetails: this.fb.group({
                pocName: this.fb
                    .control(this.poc.pocName, [
                        Validators.required,
                        Validators.minLength(3),
                    ]),
                externalId: this.fb
                    .control(this.poc.externalId, [Validators.required]),
                status: this.fb
                    .control(this.poc.status.toLowerCase()),
                createdAt: this.fb
                    .control(getFormatedDateTime(this.poc.created, this.locale), [
                        Validators.required,
                        Validators.minLength(5),
                    ]),
                active: this.fb
                    .control(this.poc.active, [
                        Validators.required,
                        Validators.minLength(3),
                    ]),
            }),
            clientCert: this.fb
                .control(this.poc.phone, [Validators.required]),
        });
    }

    renewClientCertificate() {
        this.confirmDialog.open({
            title: this.translate.instant('superAdmin.cert.renew-title'),
            message: this.translate.instant('superAdmin.cert.renew-message'),
            yes: this.translate.instant('superAdmin.cert.renew-yes'),
            no: this.translate.instant('superAdmin.cert.renew-no'),
            okOnly: false
        }).subscribe((result) => {
            if (result) {
                this.restartPolling(this.pocId);
                this.pocSuperAdminService.renewAppPoCClientCert(this.poc.id).subscribe({
                    next: (res: any) => {
                        this.notificationService.success({
                            message: this.translate.instant('superAdmin.cert.renew-success'),
                            title: this.translate.instant('superAdmin.cert.renew-success-title'),
                        });
                    },
                    error: (err) => {
                        this.errorService.handlerResponseError(err);
                    },
                });
            }
        });
    }

    getCertUrgency() {
        let urgentThreshold = URGENT_THRESHOLD;
        let veryUrgentThreshold = VERY_URGENT_THRESHOLD;
        let expiredThreshold = EXPIRED_THRESHOLD;

        let expirationDate = new Date(this.poc.mainAdmin.certExpirationDate);
        let today = new Date();

        let timeDiff = expirationDate.getTime() - today.getTime();

        let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

        if (diffDays <= expiredThreshold) {
            return CERTURGENCY.EXPIRED;
        }

        if (diffDays <= veryUrgentThreshold) {
            return CERTURGENCY.VERYURGENT;
        }

        if (diffDays <= urgentThreshold) {
            return CERTURGENCY.URGENT;
        }

        return CERTURGENCY.NONE;
    }

    public restartPolling(pocId: string) {
        this.stopPolling();

        this.polling = interval(10000)
            .pipe(
                startWith(0),
                switchMap(() => this.pocSuperAdminService.getPoc(pocId))
            ).subscribe({
                next: (res: any) => {
                    this.isPolling = true;
                    console.log("polling");
                    let oldCert = this.poc.mainAdmin.certExpirationDate;
                    this.poc = res;
                    this.generateForm();
                    if (oldCert !== this.poc.mainAdmin.certExpirationDate) {
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
