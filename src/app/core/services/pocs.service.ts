import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IListResult } from '../models/interfaces/list-result.interface';
import { IPocState } from '../models/interfaces/poc-state.interface';
import { IPoc } from '../models/interfaces/poc.interface';
import { flattenFilters, Filters } from '../models/filters';
import { ExportImportService } from './export-import.service';

@Injectable({
  providedIn: 'root'
})
export class PocsService {

  baseUrl = environment.pocManagerApi;
  pocStatusUrl = `${this.baseUrl}pocStatus`;
  pocsUrl = `${this.baseUrl}pocs`;
  uploadUrl = `${this.baseUrl}pocs/create`;
  downloadUrl = `${this.baseUrl}devices`;

  constructor(
    private http: HttpClient,
    private importService: ExportImportService,
  ) { }

  getPoc(id: string) {
    const url = `${this.pocsUrl}/${id}`;
    return this.http.get<IPoc>(this.pocsUrl);
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
    return this.http.put(this.pocsUrl, poc);
  }

  importFile(file: File) {
    return this.importService.uploadFile(file, this.uploadUrl);
  }

  exportPocs() {
    return this.http.get(this.downloadUrl, { responseType: 'blob' });
  }

}
