import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IListResult } from '../models/interfaces/list-result.interface';
import { IPocCreationState } from '../models/interfaces/poc-creation-state.interface';
import { IPoc } from '../models/interfaces/poc.interface';
import { flattenFilters, PocFilters } from '../models/poc-filters';

@Injectable({
  providedIn: 'root'
})
export class PocsService {

  baseUrl = environment.pocManagerApi;
  pocStatusUrl = `${this.baseUrl}pocStatus`;
  pocsUrl = `${this.baseUrl}pocs`;

  constructor(private http: HttpClient) { }

  getPoc(id: string) {
    const url = `${this.pocsUrl}/${id}`;
    return this.http.get<IPoc>(this.pocsUrl);
  }

  getPocs(filters: PocFilters): Observable<IListResult<IPoc>> {
    return this.http.get<IListResult<IPoc>>(this.pocsUrl, { params: flattenFilters(filters) as any });
  }

  getPocStatus(pocId: string) {
    const url = `${this.pocStatusUrl}/${pocId}`;
    return this.http.get<IPocCreationState>(url);
  }

  deletePocs(pocs: IPoc[]) {
    return this.http.delete(this.pocsUrl, { params: { pocIds: pocs.map(p => p.id).toString() } });
  }

  putPoc(poc: Partial<IPoc>) {
    return this.http.put(this.pocsUrl, poc);
  }

}
