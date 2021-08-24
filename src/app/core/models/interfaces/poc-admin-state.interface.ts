export interface IPocAdminState {
    webIdentRequired: boolean;
    webIdentInitiated: boolean;
    webIdentSuccess: boolean;
    certifyUserCreated: boolean;
    pocAdminGroupAssigned: boolean;
    keycloakEmailSent: boolean;
    invitedToTeamDrive: boolean;
    clientCertProvided?: boolean;
    certifyApiProvided?: boolean;
    errorMessage: string;
}


