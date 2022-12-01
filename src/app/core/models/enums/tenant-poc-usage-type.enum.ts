export enum TenantPoCUsageType {
    API = 'API',
    APP = 'APP',
    BOTH = 'BOTH'
}

export const TenantPoCUsageTypeTranslation: Record<TenantPoCUsageType, string> = {
    [TenantPoCUsageType.API]: 'API',
    [TenantPoCUsageType.APP]: 'APP',
    [TenantPoCUsageType.BOTH]: 'API/APP'
};
