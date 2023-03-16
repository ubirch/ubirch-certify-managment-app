import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-revocation-requesters',
  templateUrl: './revocation-requesters.component.html',
  styleUrls: ['./revocation-requesters.component.scss'],
})
export class RevocationRequestersComponent implements OnInit {
  filters: UntypedFormGroup;
  constructor() { }

  ngOnInit() {}

}
