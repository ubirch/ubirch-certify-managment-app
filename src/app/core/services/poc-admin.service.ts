import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ADMIN_STATE_MOCK } from '../mocks/admins.mock';
import { Filters } from '../models/filters';
import { IListResult } from '../models/interfaces/list-result.interface';
import { IPocAdminState } from '../models/interfaces/poc-admin-state.interface';
import { IPocAdmin } from '../models/interfaces/poc-admin.interface';

@Injectable({
  providedIn: 'root'
})
export class PocAdminService {

  baseUrl = environment.pocManagerApi;
  adminStatusUrl = `${this.baseUrl}poc-admins/status`;
  adminsUrl = `${this.baseUrl}poc-admins`;

  constructor(private http: HttpClient) { }

  getAdmins(filters: Filters) {
    return this.http.get<IListResult<IPocAdmin>>(this.adminsUrl);
  }

  getAdminState(adminId: string) {
    return of(ADMIN_STATE_MOCK).pipe(delay(500));

    // const url = `${this.adminStatusUrl}/${adminId}`;
    // return this.http.get<IPocAdminState>(url);
  }
}
