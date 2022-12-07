import {TenantType} from "../enums/tenant-type.enum";
import {TenantPoCUsageType} from "../enums/tenant-poc-usage-type.enum";
import {ITenantChanges} from "./tenant-changes.interface";

export interface ITenant extends ITenantChanges{
    id: string;
    name: string;
    tenantType: TenantType,
    usageType: TenantPoCUsageType,
    created: Date;
    certExpirationDate?: Date;
}
