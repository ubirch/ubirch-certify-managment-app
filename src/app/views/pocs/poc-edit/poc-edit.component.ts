import {Component, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {filter, map, switchMap, tap} from 'rxjs/operators';
import {IPoc} from 'src/app/core/models/interfaces/poc.interface';
import {ErrorHandlerService} from 'src/app/core/services/error-handler.service';
import {NotificationService} from 'src/app/core/services/notification.service';
import {PocsService} from 'src/app/core/services/pocs.service';
import {ILocationIdChange} from "../../../core/models/interfaces/locationIdChange.interface";
import {LocationIdChangesStates} from "../../../core/models/enums/location-id-changes-states.enum";

@Component({
    selector: 'app-poc-edit',
    templateUrl: './poc-edit.component.html',
    styleUrls: ['./poc-edit.component.scss'],
})
export class PocEditComponent implements OnInit {

    form: UntypedFormGroup;
    poc: IPoc;
    locationIdChanges: ILocationIdChange[] = [];
    pocId: string;

    constructor(
        private pocService: PocsService,
        private errorService: ErrorHandlerService,
        private route: ActivatedRoute,
        private notificationService: NotificationService,
        private translateService: TranslateService,
        private fb: UntypedFormBuilder,
        private router: Router,
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
                console.log(this.poc)
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
            address: this.fb.group({
                street: this.fb.control(this.poc.address.street, [Validators.required, Validators.minLength(3)]),
                houseNumber: this.fb.control(this.poc.address.houseNumber, [Validators.required]),
                additionalAddress: this.fb.control(this.poc.address.additionalAddress),
                zipcode: this.fb.control(this.poc.address.zipcode, [Validators.required, Validators.minLength(5)]),
                city: this.fb.control(this.poc.address.city, [Validators.required, Validators.minLength(3)]),
                county: this.fb.control(this.poc.address.county),
                federalState: this.fb.control(this.poc.address.federalState),
                country: this.fb.control(this.poc.address.country, [Validators.required, Validators.minLength(2)]),
            }),
            phone: this.fb.control(this.poc.phone, [Validators.required]),
            manager: this.fb.group({
                lastName: this.fb.control(this.poc.manager.lastName, [Validators.required, Validators.minLength(2)]),
                firstName: this.fb.control(this.poc.manager.firstName, [Validators.required, Validators.minLength(2)]),
                email: this.fb.control(this.poc.manager.email, [Validators.required, Validators.email]),
                mobilePhone: this.fb.control(this.poc.manager.mobilePhone, [Validators.required])
            })
        });
    }

    submitForm() {
        const poc: IPoc = {...this.form.value, id: this.poc.id};
        this.pocService.putPoc(poc).subscribe({
            next: (_) => {
                this.notificationService.success({
                    message: this.translateService.instant('pocEdit.notifications.success'),
                    title: this.translateService.instant('pocEdit.notifications.successTitle'),
                });
                this.router.navigate(['views/', 'pocs']);
            },
            error: (err) => this.errorService.handlerResponseError(err)
        });
    }

    openChangeLocation() {
        this.router.navigate(['/views', 'pocs', 'edit', 'location', this.pocId]);
    }
}
