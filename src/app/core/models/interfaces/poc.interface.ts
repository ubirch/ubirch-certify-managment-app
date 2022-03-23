import { PocActivationState } from '../enums/poc-activation-state.enum';
import { PocStatus } from '../enums/poc-status.enum';
import { IAddress } from './address.interface';
import { IPerson } from './person.interface';
import { IPocAddons } from './poc-addons.interface';

export interface IPoc {
    id: string;
    active: PocActivationState;
    tenantId: string;
    externalId: string;
    pocName: string;
    deviceId: string;
    status: PocStatus;

    address?: IAddress;
    phone?: string;
    logoUrl?: string;
    extraConfig?: any;
    manager?: IPerson;
    roleName: string;

    certifyApp?: boolean;
    clientCertRequired: boolean;
    pocAddons: IPocAddons;
    pocType: string;

    created: Date;
    lastUpdated?: Date;
    errorMessage?: string;
}
