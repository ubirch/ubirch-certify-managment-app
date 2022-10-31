import { PocActivationState } from '../enums/poc-activation-state.enum';
import { PocStatus } from '../enums/poc-status.enum';
import { PocType } from '../enums/poc-type.enum';

export interface IPocSuperAdmin {
    id: string;
    tenantId: string;
    tenantName: string;
    externalId: string;
    pocType: PocType;
    pocName: string;
    extraConfig?: any;
    deviceId?: string;
    status: PocStatus;
    active: PocActivationState;
    creationAttempts: number;
    errorMessage?: string;
    lastUpdated?: Date;
    created: Date;
    mainAdmin?: pocMainAdmin;
}

export interface pocMainAdmin {
    active: boolean;
    createdAt: Date;
    email: string;
    firstName: string;
    id: string;
    lastName: string;
    phoneNumber: string;
    status: PocStatus;
}
