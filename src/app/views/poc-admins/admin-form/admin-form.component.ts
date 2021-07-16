import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { IPocAdmin } from 'src/app/core/models/interfaces/poc-admin.interface';
import { LocaleService } from 'src/app/core/services/locale.service';
import { birthDateFromString, getFormatedBirthDate } from 'src/app/core/utils/date';

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

  constructor(
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private fb: FormBuilder,
    private router: Router,
    public localeService: LocaleService,
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
    const dob = this.form.get('dateOfBirth').value;
    const admin = { ...this.form.value, dateOfBirth: birthDateFromString(dob) };

    this.submitted.next(admin);
  }

  backToList() {
    this.router.navigate(['../..'], { relativeTo: this.route });
  }

  getBirthDayLabel(format: string) {
    const dobLabel = this.translateService.instant('pocAdmin.dateOfBirth');
    return `${dobLabel}  (${format})`;
  }


}
