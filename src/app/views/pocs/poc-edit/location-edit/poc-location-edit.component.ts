import {Component, OnInit} from '@angular/core';
import {IPoc} from "../../../../core/models/interfaces/poc.interface";
import {filter, map, switchMap, tap} from "rxjs/operators";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {PocsService} from "../../../../core/services/pocs.service";
import {ErrorHandlerService} from "../../../../core/services/error-handler.service";
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {getFormatedBirthDate} from "../../../../core/utils/date";
import {ILocationIdChange} from "../../../../core/models/interfaces/locationIdChange.interface";
import {NotificationService} from "../../../../core/services/notification.service";
import {NotificationType} from "../../../../core/models/enums/notification-type.enum";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-location-edit',
    templateUrl: './poc-location-edit.component.html',
    styleUrls: ['./poc-location-edit.component.scss'],
})
export class PocLocationEditComponent implements OnInit {

    poc: IPoc;
    pocId: string;
    locationIdChanges: ILocationIdChange[] = [];
    form: FormGroup;
    disableForm = false;


    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private pocService: PocsService,
        private errorService: ErrorHandlerService,
        private notificationService: NotificationService,
        private fb: FormBuilder,
        private translationService: TranslateService,
    ) {
    }

    ngOnInit() {
        this.route.paramMap.pipe(
            map((params: ParamMap) => params.get('id')),
            filter(pocId => !!pocId),
            tap(pocId => this.pocId = pocId),
            switchMap(pocId => this.pocService.getPoc(pocId))
        ).subscribe({
            next: (res: any) => {
                this.poc = res;
                this.locationIdChanges = this.poc.externalIdChanges;
                this.generateForm();
            },
            error: (err) => {
                this.errorService.handlerResponseError(err);
                this.router.navigate(['../../'], {relativeTo: this.route});
            }
        });
    }

    generateForm() {
        this.form = this.fb.group({
            current: [this.poc.externalId, [Validators.required]],
            new: ['', [Validators.required, Validators.minLength(5), this.locationIdValidator()]],
        });
    }

    submitEdit() {
        const {new: newId} = this.form.value;
        this.pocService.editLocationId(this.pocId, newId).subscribe({
            next: (res: any) => {
                this.notificationService.success({
                    message: this.translationService.instant('locationEdit.successMessage'),
                    title: this.translationService.instant('locationEdit.successTitle'),
                    duration: 3500,
                    type: NotificationType.success
                })
                this.disableForm = true;
                setTimeout(() => {
                    this.router.navigate(['../../', this.pocId], {relativeTo: this.route});
                }, 1500);
            },
            error: (err) => {
                this.errorService.handlerResponseError(err);
            }
        });
    }

    isBmgApiPocType(poc: IPoc) {
        return poc && poc?.pocType.toLowerCase().includes('bmg') && poc?.pocType.toLowerCase().includes('api');
    }

    locationIdValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {

            const pocType = this.poc?.pocType.toLowerCase();
            if (pocType.includes('bmg')) {
                const value = control.value;

                const alphanumeric = /^[A-Z0-9]+$/;

                if (value.length > 9) {
                    return {locationIdValidator: true};
                }

                return alphanumeric.test(value) ? null : {locationIdValidator: true};
            }

            return null;

        };
    }

}
