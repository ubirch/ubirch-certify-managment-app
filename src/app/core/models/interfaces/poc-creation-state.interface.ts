export interface IPocCreationState {
    certifyRoleCreated: boolean;
    certifyGroupCreated: boolean;
    certifyGroupRoleAssigned: boolean;
    certifyGroupTenantRoleAssigned: boolean;
    deviceRoleCreated: boolean;
    deviceGroupCreated: boolean;
    deviceGroupRoleAssigned: boolean;
    deviceGroupTenantRoleAssigned: boolean;
    deviceCreated: boolean;
    assignedDataSchemaGroup: boolean;
    assignedDeviceGroup: boolean;
    clientCertRequired: boolean;
    clientCertCreated: boolean;
    clientCertProvided: boolean;
    orgUnitCertCreated: boolean;
    logoRequired: boolean;
    logoReceived: boolean;
    logoStored: boolean;
    goClientProvided: boolean;
    certifyApiProvided: boolean;
    errorMessage: string;
    lastUpdated: Date;
    created: Date;
}
