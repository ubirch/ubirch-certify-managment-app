import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ADMINS_MOCK, ADMIN_STATE_MOCK } from '../mocks/admins.mock';
import { Filters, flattenFilters } from '../models/filters';
import { IListResult } from '../models/interfaces/list-result.interface';
import { IPocAdminState } from '../models/interfaces/poc-admin-state.interface';
import { IPocAdmin } from '../models/interfaces/poc-admin.interface';
import { IWebIdentConfirmation } from '../models/interfaces/web-ident-confirmation.interface';
import { IWebIdentInitiateId } from '../models/interfaces/web-ident-initiate-id.interface';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class PocAdminService {

  private selectedAdmin = new BehaviorSubject<IPocAdmin>(null);
  selectedAdmin$ = this.selectedAdmin.asObservable();

  baseUrl = environment.pocManagerApi;
  adminStatusUrl = `${this.baseUrl}poc-admin/status`;
  adminsUrl = `${this.baseUrl}poc-admins`;
  adminsIdentUrl = `${this.baseUrl}webident`;

  constructor(
    private http: HttpClient,
    private errorService: ErrorHandlerService,
  ) { }

  setSelected(admin: IPocAdmin) {
    this.selectedAdmin.next(admin);
  }

  getAdmins(filters: Filters) {
    // return of(ADMINS_MOCK).pipe(delay(1000));

    return this.http.get<IListResult<IPocAdmin>>(this.adminsUrl, { params: flattenFilters(filters) as any });
  }


  getAdminState(adminId: string) {
    // if (adminId === '1') { return of({ ...ADMIN_STATE_MOCK, webIdentInitiated: true }).pipe(delay(500)); }
    // if (adminId === '3') { return of({ ...ADMIN_STATE_MOCK, webIdentInitiated: true, webIdentSuccess: true }).pipe(delay(500)); }
    // return of(ADMIN_STATE_MOCK).pipe(delay(500));

    const url = `${this.adminStatusUrl}/${adminId}`;
    return this.http.get<IPocAdminState>(url);
  }

  getInitialIdentId(adminId: string) {
    // return of('74575b09-6699-4f09-b1b2-dc8e456e0c97').pipe(delay(500));

    const url = `${this.adminsIdentUrl}/initiate-id`;
    return this.http.post<IWebIdentInitiateId>(url, { pocAdminId: adminId }).pipe(
      map((val: IWebIdentInitiateId) => val.webInitiateId)
    );
  }

  postWebIdentId(confirm: IWebIdentConfirmation) {
    const url = `${this.adminsIdentUrl}/id`;

    return this.http.post(url, confirm).pipe(
      catchError(err => this.errorService.handlerResponseError(err))
    );
  }

}
