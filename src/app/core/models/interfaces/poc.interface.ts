import { PocStatus } from '../enums/poc-status.enum';
import { IAddress } from './address.interface';
import { IPerson } from './person.interface';
import { IPocAddons } from './poc-addons.interface';

export interface IPoc {
    id: string;
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

    dataSchemaId?: string;
    certifyApp?: boolean;
    clientCertRequired: boolean;
    pocAddons: IPocAddons;

    created: Date;
    lastUpdated?: Date;
}
