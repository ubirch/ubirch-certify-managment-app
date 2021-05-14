export interface IPocCreationState {
    assignedDataSchemaGroup: boolean;
    assignedDeviceGroup: boolean;
    userRoleCreated: boolean;
    userGroupCreated: boolean;
    userGroupRoleAssigned: boolean;
    deviceRoleCreated: boolean;
    deviceGroupCreated: boolean;
    deviceGroupRoleAssigned: boolean;
    deviceCreated: boolean;
    clientCertRequired: boolean;
    logoRequired: boolean;
    logoReceived: boolean;
    logoStored: boolean;
    certifyApiProvided: boolean;
    goClientProvided: boolean;
    errorMessage: string;
    lastUpdated: Date;
    created: Date;
}
