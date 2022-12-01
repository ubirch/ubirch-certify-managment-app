import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-tenants-list-filters',
  templateUrl: './tenants-list-filters.component.html',
  styleUrls: ['./tenants-list-filters.component.scss'],
})
export class TenantsListFiltersComponent implements OnInit {

    @Input() filters: FormGroup;

    constructor() { }

  ngOnInit() {}

}
