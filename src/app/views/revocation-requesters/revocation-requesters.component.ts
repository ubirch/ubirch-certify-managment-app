import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-revocation-requesters',
  templateUrl: './revocation-requesters.component.html',
  styleUrls: ['./revocation-requesters.component.scss'],
})
export class RevocationRequestersComponent implements OnInit {
  filters: FormGroup;
  constructor() { }

  ngOnInit() {}

}
