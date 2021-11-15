import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AcitvateAction } from '../models/enums/acitvate-action.enum';
import { IListResult } from '../models/interfaces/list-result.interface';
import { IPocEmployee } from '../models/interfaces/poc-employee.interface';
import { IPocState } from '../models/interfaces/poc-state.interface';
import { IPoc } from '../models/interfaces/poc.interface';
import { flattenFilters, Filters } from '../models/filters';
import { ExportImportService } from './export-import.service';
import { catchError, map, mergeMap, reduce } from 'rxjs/operators';

interface IPocActionState {
    poc: IPoc;
    success: boolean;
}

@Injectable({
    providedIn: 'root',
})
export class PocsService {

    tenantAdminPath = 'tenant-admin/';
    baseUrl = environment.pocManagerApi + this.tenantAdminPath;
    pocStatusUrl = `${this.baseUrl}pocStatus`;
    editUrl = `${this.baseUrl}poc`;
    pocsUrl = `${this.baseUrl}pocs`;
    uploadUrl = `${this.baseUrl}pocs/create`;
    downloadUrl = `${this.baseUrl}devices`;

    constructor(
        private http: HttpClient,
        private importService: ExportImportService,
    ) {
    }

    getPoc(id: string) {
        const url = `${this.editUrl}/${id}`;
        return this.http.get<IPoc>(url);
    }

    getPocs(filters: Filters): Observable<IListResult<IPoc>> {
        return this.http.get<IListResult<IPoc>>(this.pocsUrl, { params: flattenFilters(filters) as any });
    }

    getPocStatus(pocId: string) {
        const url = `${this.pocStatusUrl}/${pocId}`;
        return this.http.get<IPocState>(url);
    }

    deletePocs(pocs: IPoc[]) {
        return this.http.delete(this.pocsUrl, { params: { pocIds: pocs.map(p => p.id).toString() } });
    }

    putPoc(poc: Partial<IPoc>) {
        const url = `${this.editUrl}/${poc.id}`;
        return this.http.put(url, poc);
    }

    changeActiveState(pocId: string, activate: AcitvateAction) {
        const url = `${this.baseUrl}pocs/${pocId}/active/${activate}`;
        return this.http.put(url, null);
    }

    changeActiveStateForPoCs(pocs: IPoc[], activate: AcitvateAction) {

        return from(pocs).pipe(
            mergeMap(
                poc => this.changeActiveState(poc.id, activate).pipe(
                    map(() => ({ poc, success: true })),
                    catchError(() => of({ poc, success: false })),
                ),
            ),
            reduce(
                (acc, current: IPocActionState) => {
                    if (current.success) { acc.ok = [ ...acc.ok, current.poc ]; } else { acc.nok = [ ...acc.nok, current.poc ]; }
                    return acc;
                }, { ok: [], nok: [] } as { ok: IPoc[], nok: IPoc[] },
            ),
        );
    }

    importFile(file: File) {
        return this.importService.uploadFile(file, this.uploadUrl);
    }

    exportPocs() {
        return this.http.get(this.downloadUrl, { responseType: 'blob' });
    }

    retryPOCs(pocs: IPoc[]) {
        return from(pocs).pipe(
            mergeMap(
                poc => this.retryPOC(poc.id).pipe(
                    map(() => ({ poc, success: true })),
                    catchError(() => of({ poc, success: false })),
                ),
            ),
            reduce(
                (acc, current: IPocActionState) => {
                    if (current.success) { acc.ok = [ ...acc.ok, current.poc ]; } else { acc.nok = [ ...acc.nok, current.poc ]; }
                    return acc;
                }, { ok: [], nok: [] } as { ok: IPoc[], nok: IPoc[] },
            ),
        );
    }

    retryPOC(pocId: string) {
        const url = `${this.baseUrl}poc/retry/${pocId}`;
        return this.http.put(url, null);
    }

}
