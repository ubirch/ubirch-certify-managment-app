export interface IPocState {
    certifyRoleCreated: boolean;
    certifyGroupCreated: boolean;
    certifyGroupRoleAssigned: boolean;
    adminGroupCreated: boolean;
    adminRoleAssigned: boolean;
    employeeGroupCreated: boolean;
    employeeRoleAssigned: boolean;
    deviceRoleCreated: boolean;
    deviceGroupCreated: boolean;
    deviceGroupRoleAssigned: boolean;
    deviceCreated: boolean;
    assignedDataSchemaGroup: boolean;
    assignedTrustedPocGroup: boolean;
    assignedDeviceGroup: boolean;
    clientCertRequired: boolean;
    orgUnitCertCreated: boolean;
    clientCertCreated: boolean;
    clientCertProvided: boolean;
    logoRequired: boolean;
    logoReceived: boolean;
    logoStored: boolean;
    goClientProvided: boolean;
    certifyApiProvided: boolean;

    errorMessage: string;

    lastUpdated: Date;
    created: Date;
}
