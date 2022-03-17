import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { IPocEmployee } from 'src/app/core/models/interfaces/poc-employee.interface';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { LocaleService } from 'src/app/core/services/locale.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { PocEmployeeService } from 'src/app/core/services/poc-employee.service';

@Component({
  selector: 'app-employee-edit',
  templateUrl: './employee-edit.component.html',
  styleUrls: ['./employee-edit.component.scss'],
})
export class EmployeeEditComponent implements OnInit, OnDestroy {

  form: FormGroup;

  private unsubscribe$ = new Subject<void>();

  constructor(
    private employeeService: PocEmployeeService,
    private errorService: ErrorHandlerService,
    private notificationService: NotificationService,
    private translateService: TranslateService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      map((params: ParamMap) => params.get('id')),
      filter(employeeId => !!employeeId),
      switchMap(employeeId => this.employeeService.getEmployee(employeeId)),
      takeUntil(this.unsubscribe$)
    ).subscribe({
        next: (employee: IPocEmployee) => this.generateForm(employee),
        error: (err) => {
            this.errorService.handlerResponseError(err);
            this.router.navigate(['../../'], { relativeTo: this.route });
        }
    });
  }

  generateForm(employee: IPocEmployee) {
    this.form = this.fb.group({
      id: [employee.id],
      firstName: [employee.firstName, [Validators.required, Validators.minLength(2)]],
      lastName: [employee.lastName, [Validators.required, Validators.minLength(2)]],
      email: [employee.email, [Validators.required, Validators.email]],
    });
  }

  submitForm() {
    const employee: IPocEmployee = this.form.value;

    this.employeeService.putPocEmployee(employee).subscribe({
        next: (_) => {
            this.notificationService.success({
                message: this.translateService.instant('employeeEdit.notifications.success'),
                title: this.translateService.instant('employeeEdit.notifications.successTitle'),
            });
            this.router.navigate(['views/', 'poc-employees']);
        },
        error: (err) => this.errorService.handlerResponseError(err)
    });
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
