import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, from, of } from 'rxjs';
import { catchError, map, mergeMap, reduce } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AcitvateAction } from '../models/enums/acitvate-action.enum';
import { Filters, flattenFilters } from '../models/filters';
import { IListResult } from '../models/interfaces/list-result.interface';
import { IPocAdminState } from '../models/interfaces/poc-admin-state.interface';
import { IPocAdmin } from '../models/interfaces/poc-admin.interface';
import { IWebIdentConfirmation } from '../models/interfaces/web-ident-confirmation.interface';
import { IWebIdentInitiateId } from '../models/interfaces/web-ident-initiate-id.interface';
import { ErrorHandlerService } from './error-handler.service';

interface IAdminActionState {
    admin: IPocAdmin;
    success: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class PocAdminService {

    tenantAdminPath = 'tenant-admin/';
    baseUrl = environment.pocManagerApi + this.tenantAdminPath;
    adminStatusUrl = `${this.baseUrl}poc-admin/status`;
    adminUrl = `${this.baseUrl}poc-admin`;
    adminsUrl = `${this.baseUrl}poc-admins`;
    adminsIdentUrl = `${this.baseUrl}webident`;
    changeMainAdminUrl = `${this.baseUrl}poc-admin/main`;
    private selectedAdmin = new BehaviorSubject<IPocAdmin>(null);
    selectedAdmin$ = this.selectedAdmin.asObservable();

    constructor(
        private http: HttpClient,
        private errorService: ErrorHandlerService,
    ) {
    }

    setSelected(admin: IPocAdmin) {
        this.selectedAdmin.next(admin);
    }

    getAdmin(adminId: string): any {
        const url = `${this.adminUrl}/${adminId}`;
        return this.http.get<IPocAdmin>(url);
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
            map((val: IWebIdentInitiateId) => val.webInitiateId),
        );
    }

    postPocAdmin(admin: IPocAdmin) {
        const url = `${this.adminUrl}/create`;
        return this.http.post(url, admin);
    }

    putPocAdmin(admin: IPocAdmin) {
        const url = `${this.adminUrl}/${admin.id}`;
        return this.http.put(url, admin);
    }

    postWebIdentId(confirm: IWebIdentConfirmation) {
        const url = `${this.adminsIdentUrl}/id`;

        return this.http.post(url, confirm).pipe(
            catchError(err => this.errorService.handlerResponseError(err)),
        );
    }

    revoke2FA(adminId: string) {
        const url = `${this.adminUrl}/${adminId}/2fa-token`;
        return this.http.delete(url);
    }

    revoke2FAForAdmins(admins: IPocAdmin[]) {
        return from(admins).pipe(
            mergeMap(
                admin => this.revoke2FA(admin.id).pipe(
                    map(() => ({ admin, success: true })),
                    catchError(() => of({ admin, success: false })),
                ),
            ),
            reduce(
                (acc, current: IAdminActionState) => {
                    if (current.success) { acc.ok = [ ...acc.ok, current.admin ]; } else { acc.nok = [ ...acc.nok, current.admin ]; }
                    return acc;
                }, { ok: [], nok: [] } as { ok: IPocAdmin[], nok: IPocAdmin[] },
            ),
        );
    }

    changeActiveState(adminId: string, activate: AcitvateAction) {
        const url = `${this.adminUrl}/${adminId}/active/${activate}`;
        return this.http.put(url, null);
    }

    changeActiveStateForAdmins(admins: IPocAdmin[], activate: AcitvateAction) {

        return from(admins).pipe(
            mergeMap(
                admin => this.changeActiveState(admin.id, activate).pipe(
                    map(() => ({ admin, success: true })),
                    catchError(() => of({ admin, success: false })),
                ),
            ),
            reduce(
                (acc, current: IAdminActionState) => {
                    if (current.success) { acc.ok = [ ...acc.ok, current.admin ]; } else { acc.nok = [ ...acc.nok, current.admin ]; }
                    return acc;
                }, { ok: [], nok: [] } as { ok: IPocAdmin[], nok: IPocAdmin[] },
            ),
        );
    }

    retryAdmins(admins: IPocAdmin[]) {
        return from(admins).pipe(
            mergeMap(
                admin => this.retryAdmin(admin.id).pipe(
                    map(() => ({ admin, success: true })),
                    catchError(() => of({ admin, success: false })),
                ),
            ),
            reduce(
                (acc, current: IAdminActionState) => {
                    if (current.success) { acc.ok = [ ...acc.ok, current.admin ]; } else { acc.nok = [ ...acc.nok, current.admin ]; }
                    return acc;
                }, { ok: [], nok: [] } as { ok: IPocAdmin[], nok: IPocAdmin[] },
            ),
        );
    }

    retryAdmin(adminId: string) {
        const url = `${this.baseUrl}poc-admin/retry/${adminId}`;
        return this.http.put(url, null);
    }

    changeMainPoCAdmin(adminId: string) {
        const url = `${this.changeMainAdminUrl}/${adminId}`;
        return this.http.put(url, null);
    }
}
