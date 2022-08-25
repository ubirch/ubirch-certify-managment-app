import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Filters, flattenFilters } from '../models/filters';
import { AllRevocations } from '../models/interfaces/all-revocations.interface';
import { IListResult } from '../models/interfaces/list-result.interface';
import { RevocationBatch } from '../models/interfaces/revocation-batch.interface';
import { RevocationEntry } from '../models/interfaces/revocation-entry.interface';
import { Revocation } from '../models/interfaces/revocation.interface';

import { ExportImportService } from './export-import.service';

@Injectable({
    providedIn: 'root',
})
export class RevocationService {
    baseUrl = `${environment.revocationApi}api/dcc/revocation`;
    pendingRevocationsPath = `${this.baseUrl}/pending`;
    allRevocationsPath = `${this.baseUrl}/uploaded`;
    uploadUrl = `${this.baseUrl}/upload`;
    revocationBatchesUrl = `${this.baseUrl}/batch`;

    constructor(
        private http: HttpClient,
        private importService: ExportImportService
    ) {}

    getRevocations(filters: Filters): Observable<IListResult<Revocation>> {
        return this.http.get<IListResult<Revocation>>(
            this.pendingRevocationsPath,
            {
                params: flattenFilters(filters) as any,
            }
        );
    }
    getAllRevocations(
        filters: Filters
    ): Observable<IListResult<AllRevocations>> {
        return this.http.get<IListResult<AllRevocations>>(
            this.allRevocationsPath,
            {
                params: flattenFilters(filters) as any,
            }
        );
    }

    checkPendingRevocations(): Observable<IListResult<Revocation>> {
        return this.http.get<IListResult<Revocation>>(
            this.pendingRevocationsPath
        );
    }

    importFile(base64Revocation: String) {
        return this.importService.importRevocation(
            base64Revocation,
            this.baseUrl
        );
    }

    exportRevocations(filters: Filters) {
        const headers = new HttpHeaders().set('Accept', 'text/csv');
        return this.http.get(this.allRevocationsPath, {
            headers,
            responseType: 'blob',
            params: flattenFilters(filters) as any,
        });
    }

    uploadRevocations() {
        return this.http.put(this.uploadUrl, null, { responseType: 'text' });
    }

    deleteRevocationBatch(revocationBatch: RevocationBatch) {
        const url = `${this.revocationBatchesUrl}/${revocationBatch.id}`;
        return this.http.delete(url, { responseType: 'text' });
    }
    getBatches(filters: Filters): Observable<IListResult<RevocationBatch>> {
        return this.http.get<IListResult<RevocationBatch>>(
            this.revocationBatchesUrl,
            { params: flattenFilters(filters) as any }
        );
    }
    getBatchEntries(
        batchId: string,
        filters: Filters
    ): Observable<IListResult<RevocationEntry>> {
        const url = `${this.revocationBatchesUrl}/${batchId}`;
        return this.http.get<IListResult<RevocationEntry>>(url, {
            params: flattenFilters(filters) as any,
        });
    }
}
