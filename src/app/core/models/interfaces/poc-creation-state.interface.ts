export interface IPocCreationState {
    validDataSchemaGroup: boolean;
    userRealmRoleCreated: boolean;
    userRealmGroupCreated: boolean;
    deviceRealmRoleCreated: boolean;
    deviceRealmGroupCreated: boolean;
    deviceCreated: boolean;
    clientCertDownloaded: boolean;
    clientCertProvided: boolean;
    logoRequired: boolean;
    logoReceived: boolean;
    logoStored: boolean;
    certApiProvided: boolean;
    coClientProvided: boolean;
    errorMessages: string[];
}
