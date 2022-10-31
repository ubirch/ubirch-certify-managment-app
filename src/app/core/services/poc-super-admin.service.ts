import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IListResult } from '../models/interfaces/list-result.interface';
import { flattenFilters, Filters } from '../models/filters';
import { IPocSuperAdmin } from '../models/interfaces/poc-super-admin.interface';

@Injectable({
    providedIn: 'root',
})
export class PocSuperAdminService {
    superAdminPath = 'super-admin/';
    baseUrl = environment.pocManagerApi + this.superAdminPath;
    pocsUrl = `${this.baseUrl}pocs`;
    pocDetailsUrl = `${this.baseUrl}poc`;

    constructor(private http: HttpClient) {}

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
        const url = `${this.baseUrl}certificates/pocs`;
        const body = { pocId };
        return this.http.post(url, body);
    }
}
