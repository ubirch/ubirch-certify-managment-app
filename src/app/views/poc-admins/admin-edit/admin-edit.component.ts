import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject, throwError } from 'rxjs';
import { filter, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ErrorBase } from 'src/app/core/models/interfaces/error.interface';
import { IPocAdmin } from 'src/app/core/models/interfaces/poc-admin.interface';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { LocaleService } from 'src/app/core/services/locale.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { PocAdminService } from 'src/app/core/services/poc-admin.service';
import { birthDateFromString, getFormatedBirthDate } from 'src/app/core/utils/date';

@Component({
  selector: 'app-admin-edit',
  templateUrl: './admin-edit.component.html',
  styleUrls: ['./admin-edit.component.scss'],
})
export class AdminEditComponent implements OnInit, OnDestroy {

  form: FormGroup;

  private unsubscribe$ = new Subject();

  constructor(
    private pocAdminService: PocAdminService,
    private errorService: ErrorHandlerService,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private translateService: TranslateService,
    private fb: FormBuilder,
    private router: Router,
    public localeService: LocaleService,
  ) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      map((params: ParamMap) => params.get('id')),
      filter(adminId => !!adminId),
      switchMap(adminId => this.pocAdminService.getAdmin(adminId)),
      tap(
        (admin: IPocAdmin) => {
          if (!admin.webIdentRequired || admin.webIdentInitiateId) {
            throw new ErrorBase('adminEdit.notifications.editNotAllowed', 'adminEdit.notifications.editNotAllowedTitle');
          }
        }
      ),
      takeUntil(this.unsubscribe$)
    ).subscribe(
      (admin: IPocAdmin) => this.generateForm(admin),
      (err) => {
        if (err instanceof ErrorBase) {
          this.notificationService.error({ message: err.message, title: err.title });
        } else {
          this.errorService.handlerResponseError(err);
        }
        this.router.navigate(['../../'], { relativeTo: this.route });
      }
    );
  }

  generateForm(admin: IPocAdmin) {
    this.form = this.fb.group({
      id: [admin.id],
      firstName: [admin.firstName, [Validators.required, Validators.minLength(2)]],
      lastName: [admin.lastName, [Validators.required, Validators.minLength(2)]],
      dateOfBirth: [getFormatedBirthDate(admin.dateOfBirth), [Validators.required]],
      email: [admin.email, [Validators.required, Validators.email]],
      phone: [admin.phone, [
        Validators.required,
        Validators.pattern(/^(\+|00)[0-9]{1,3}[ \-0-9]{4,14}$/g)
      ]],
    });
  }

  submitForm() {
    const dob = this.form.get('dateOfBirth').value;
    const admin = { ...this.form.value, dateOfBirth: birthDateFromString(dob) };

    this.pocAdminService.putPocAdmin(admin).subscribe(
      _ => {
        this.notificationService.success({
          message: this.translateService.instant('adminEdit.notifications.success'),
          title: this.translateService.instant('adminEdit.notifications.successTitle'),
        });
        this.router.navigate(['views/', 'poc-admins']);
      },
      err => this.errorService.handlerResponseError(err)
    );
  }

  backToList() {
    this.router.navigate(['../..'], { relativeTo: this.route });
  }

  getBirthDayLabel(format: string) {
    const dobLabel = this.translateService.instant('pocAdmin.dateOfBirth');
    return `${dobLabel}  (${format})`;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
