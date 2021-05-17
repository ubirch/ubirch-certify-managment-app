import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { filter, map, switchMap } from 'rxjs/operators';
import { IPoc } from 'src/app/core/models/interfaces/poc.interface';
import { ErrorHandlerService } from 'src/app/core/services/error-handler.service';
import { PocsService } from 'src/app/core/services/pocs.service';

@Component({
  selector: 'app-poc-edit',
  templateUrl: './poc-edit.component.html',
  styleUrls: ['./poc-edit.component.scss'],
})
export class PocEditComponent implements OnInit {

  form: FormGroup;
  poc: IPoc;

  constructor(
    private pocService: PocsService,
    private errorService: ErrorHandlerService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
  ) {

  }

  ngOnInit() {
    this.route.paramMap.pipe(
      map((params: ParamMap) => params.get('id')),
      filter(pocId => !!pocId),
      switchMap(pocId => this.pocService.getPoc(pocId))
    ).subscribe((res: any) => {
      this.poc = res.records[0];
      this.generateForm();
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





}
