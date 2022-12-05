import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BehaviorSubject, from, interval, Observable, of, startWith, Subscription} from 'rxjs';
import { environment } from 'src/environments/environment';
import { IListResult } from '../models/interfaces/list-result.interface';
import { flattenFilters, Filters } from '../models/filters';
import { IPocSuperAdmin } from '../models/interfaces/poc-super-admin.interface';
import {switchMap} from "rxjs/operators";
import {ActivatedRoute} from "@angular/router";
import {IPoc} from "../models/interfaces/poc.interface";
import {ITenant} from "../models/interfaces/tenant.interface";

@Injectable({
    providedIn: 'root',
})
export class PocSuperAdminService {
    superAdminPath = 'super-admin/';
    baseUrl = environment.pocManagerApi + this.superAdminPath;
    pocsUrl = `${this.baseUrl}pocs`;
    pocDetailsUrl = `${this.baseUrl}poc`;
    tenantsUrl = `${this.baseUrl}tenants`;
    tenantDetailsUrl = `${this.baseUrl}tenant`;

    currentPoc = new BehaviorSubject(null);
    $currentPoc = this.currentPoc.asObservable();

    constructor(private http: HttpClient, private route: ActivatedRoute) {}

    getPoc(id: string) {
        const url = `${this.pocDetailsUrl}/${id}`;
        return this.http.get<IPocSuperAdmin>(url);
    }

    getAllPocs(filters: Filters): Observable<IListResult<IPocSuperAdmin>> {
        return this.http.get<IListResult<IPocSuperAdmin>>(this.pocsUrl, {
            params: flattenFilters(filters) as any,
        });
    }

    renewClientCert(pocId: string) {
        if (pocId) {
            const url = `${this.baseUrl}certificates/pocs/renew`;
            const array = [pocId];
            return this.http.patch(url, {ids: array});
        }
        return of(Error());
    }

    getAllTenants(filters: Filters): Observable<IListResult<ITenant>> {
        return this.http.get<IListResult<ITenant>>(this.tenantsUrl, {
            params: flattenFilters(filters) as any,
        });
    }

    getTenant(id: string) {
        const url = `${this.tenantDetailsUrl}/${id}`;
        return this.http.get<ITenant>(url);
    }
}
