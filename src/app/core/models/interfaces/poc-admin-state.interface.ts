export interface IPocAdminState {
    webIdentRequired: boolean;
    webIdentPending: boolean;
    webIdentCompleted: boolean;
    userCreated: boolean;
    userActivated: boolean;
    userInactivated: boolean;
    errorMessage: string;
}
