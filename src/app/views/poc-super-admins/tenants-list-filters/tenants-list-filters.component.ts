import {Component, Input, OnInit} from '@angular/core';
import {UntypedFormGroup} from "@angular/forms";
import {TenantType, TenantTypeTranslation} from "../../../core/models/enums/tenant-type.enum";
import {TenantPoCUsageType, TenantPoCUsageTypeTranslation} from "../../../core/models/enums/tenant-poc-usage-type.enum";

@Component({
  selector: 'app-tenants-list-filters',
  templateUrl: './tenants-list-filters.component.html',
  styleUrls: ['./tenants-list-filters.component.scss'],
})
export class TenantsListFiltersComponent implements OnInit {

    @Input() filters: UntypedFormGroup;

    tenantTypes: string[] = [TenantType.bmg, TenantType.ubirch];
    tenantPoCUsageTypes: string[] = [TenantPoCUsageType.API, TenantPoCUsageType.APP, TenantPoCUsageType.BOTH];
    TenantTypeTranslation = TenantTypeTranslation;
    TenantPoCUsageTypeTranslation = TenantPoCUsageTypeTranslation;

    constructor() { }

  ngOnInit() {}

}
