import { PocStatus } from '../enums/poc-status.enum';
import { IAddress } from './address.interface';
import { IPerson } from './person.interface';
import { IPocAddons } from './poc-addons.interface';

export interface IPoc {
    id: string;
    externalId: string;
    pocName: string;
    status: PocStatus;

    address?: IAddress;
    phone?: string;
    logoUrl?: string;
    extraConfig?: any;
    manager?: IPerson;

    schemaId?: string;
    certifyApp?: boolean;
    pocAddons: IPocAddons;

    createdAt: Date;
    updatedAt?: Date;
}


