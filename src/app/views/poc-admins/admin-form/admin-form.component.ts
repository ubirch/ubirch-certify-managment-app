import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { IPocAdmin } from 'src/app/core/models/interfaces/poc-admin.interface';
import { LocaleService } from 'src/app/core/services/locale.service';
import { birthDateFromString, getFormatedBirthDate } from 'src/app/core/utils/date';
import {ConfirmDialogService} from '../../../shared/components/confirm-dialog/confirm-dialog.service';
import {AdminStatus} from '../../../core/models/enums/admin-status.enum';
import {parsePhoneNumber} from 'libphonenumber-js/max';
import {ErrorBase} from '../../../core/models/interfaces/error.interface';
import {NotificationService} from '../../../core/services/notification.service';
import {isValidPhoneNumber} from 'libphonenumber-js';

@Component({
  selector: 'app-admin-form',
  templateUrl: './admin-form.component.html',
  styleUrls: ['./admin-form.component.scss'],
})
export class AdminFormComponent implements OnChanges {

  form: FormGroup;
  @Input() admin: IPocAdmin;
  @Input() pocId: string;
  @Output() submitted = new EventEmitter<IPocAdmin>();

  // true - edit, false - create
  get isEdit() { return !!this.admin; }
  get btnLabel() { return this.isEdit ? 'global.update' : 'global.create'; }
    adminStatues = AdminStatus;

  constructor(
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private fb: FormBuilder,
    private router: Router,
    public localeService: LocaleService,
    private confirmService: ConfirmDialogService,
    protected notificationService: NotificationService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.admin || this.pocId) {
      this.generateForm(this.admin, this.pocId);
    }
  }

  generateForm(admin?: IPocAdmin, pocId?: string) {
    this.form = this.fb.group({
      firstName: [admin?.firstName, [Validators.required, Validators.minLength(2)]],
      lastName: [admin?.lastName, [Validators.required, Validators.minLength(2)]],
      dateOfBirth: [admin ? getFormatedBirthDate(admin.dateOfBirth) : undefined, [Validators.required]],
      email: [admin?.email, [Validators.required, Validators.email]],
      phone: [admin?.phone, [
        Validators.required,
        Validators.pattern(/^(\+|00)[0-9]{1,3}[ \-0-9]{4,14}$/)
      ]],
    });

    if (this.isEdit) {
      this.form.addControl('id', new FormControl(admin?.id));
    } else {
      this.form.addControl('webIdentRequired', new FormControl(false, [Validators.required]));
      this.form.addControl('pocId', new FormControl(pocId, [Validators.required]));
    }
  }

  submitForm() {
      const phoneControl = this.form.get('phone');

      if (this.phoneNumberNotValid(phoneControl.value)){
          const err = new ErrorBase('adminEdit.notifications.invalidMobileNumber', 'adminEdit.notifications.invalidMobileNumberTitle');
          this.notificationService.error({ message: err.message, title: err.title });
          return;
      }
      const phoneNumber = parsePhoneNumber(phoneControl.value);
      if (phoneNumber.getType() !== 'MOBILE' && phoneNumber.getType() !== 'FIXED_LINE_OR_MOBILE'){
          const err = new ErrorBase('adminEdit.notifications.invalidMobileNumber', 'adminEdit.notifications.invalidMobileNumberTitle');
          this.notificationService.error({ message: err.message, title: err.title });
      }else {
          if (this.form.valid) {
              this.confirmService.open({
                  message: 'adminEdit.confirmText',
                  yes: 'dialog.yesSureLabel',
                  no: 'global.cancel',
              })
                  .subscribe(dialogResult => {
                      if (dialogResult) {
                          const dob = this.form.get('dateOfBirth').value;
                          const admin = {...this.form.value, dateOfBirth: birthDateFromString(dob)};

                          this.submitted.next(admin);
                      }
                  });
          }
      }
  }

  backToList() {
    this.router.navigate(['../..'], { relativeTo: this.route });
  }

  getBirthDayLabel(format: string) {
    const dobLabel = this.translateService.instant('pocAdmin.dateOfBirth');
    return `${dobLabel}  (${format})`;
  }

  private phoneNumberNotValid(numP: string): boolean {
      const phoneNum = numP.startsWith('00') ? '+' + numP.slice(2) : numP;
      return !isValidPhoneNumber(phoneNum);
  }

}
