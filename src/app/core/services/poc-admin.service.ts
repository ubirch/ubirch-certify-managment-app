import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ADMINS_MOCK, ADMIN_STATE_MOCK } from '../mocks/admins.mock';
import { Filters, flattenFilters } from '../models/filters';
import { IListResult } from '../models/interfaces/list-result.interface';
import { IPocAdmin } from '../models/interfaces/poc-admin.interface';
import { IWebIdentConfirmation } from '../models/interfaces/web-ident-confirmation.interface';
import { ErrorHandlerService } from './error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class PocAdminService {

  private selectedAdmin = new BehaviorSubject<IPocAdmin>(null);
  selectedAdmin$ = this.selectedAdmin.asObservable();

  baseUrl = environment.pocManagerApi;
  adminStatusUrl = `${this.baseUrl}poc-admins/status`;
  adminsUrl = `${this.baseUrl}poc-admins`;
  adminsIdentUrl = `${this.baseUrl}poc-admins/identify`;

  constructor(
    private http: HttpClient,
    private errorService: ErrorHandlerService,
  ) { }

  setSelected(admin: IPocAdmin) {
    this.selectedAdmin.next(admin);
  }

  getAdmins(filters: Filters) {
    return of(ADMINS_MOCK).pipe(delay(1000));

    // return this.http.get<IListResult<IPocAdmin>>(this.adminsUrl, { params: flattenFilters(filters) as any });
  }


  getAdminState(adminId: string) {
    return of(ADMIN_STATE_MOCK).pipe(delay(500));

    // const url = `${this.adminStatusUrl}/${adminId}`;
    // return this.http.get<IPocAdminState>(url);
  }

  getInitialIdentId(adminId: string) {
    return of('74575b09-6699-4f09-b1b2-dc8e456e0c97').pipe(delay(500));

    // const url = `${this.adminsIdentUrl}/${adminId}`;
    // return this.http.get<string>(url);
  }

  postWebIdentId(confirm: IWebIdentConfirmation) {
    return this.http.post(this.adminsIdentUrl, confirm).pipe(
      catchError(err => this.errorService.handlerResponseError(err))
    );
  }
}
