import {TenantType} from "../enums/tenant-type.enum";
import {TenantPoCUsageType} from "../enums/tenant-poc-usage-type.enum";

export interface ITenant {
    id: string;
    name: string;
    tenantType: TenantType,
    usageType: TenantPoCUsageType,
    created: Date;
    email?: string;
    phone?: string;
    certExpirationDate?: Date;

}
