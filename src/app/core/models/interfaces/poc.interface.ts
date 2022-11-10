import { PocActivationState } from '../enums/poc-activation-state.enum';
import { PocStatus } from '../enums/poc-status.enum';
import { IAddress } from './address.interface';
import { IPerson } from './person.interface';
import { IPocAddons } from './poc-addons.interface';
import {ILocationIdChange} from "./locationIdChange.interface";
import { PocType } from '../enums/poc-type.enum';
import {IMainAdmin} from "./mainAdmin.interface";

export interface IPoc {
    id: string;
    active: PocActivationState;
    tenantId: string;
    externalId: string;
    externalIdChanges: ILocationIdChange[];
    pocName: string;
    deviceId: string;
    status: PocStatus;

    address?: IAddress;
    phone?: string;
    logoUrl?: string;
    extraConfig?: any;
    manager?: IPerson;
    roleName: string;
    mainAdmin?: IMainAdmin;

    certifyApp?: boolean;
    clientCertRequired: boolean;
    pocAddons: IPocAddons;
    pocType: PocType;

    created: Date;
    lastUpdated?: Date;
    errorMessage?: string;

    tenantName?: string;
}
