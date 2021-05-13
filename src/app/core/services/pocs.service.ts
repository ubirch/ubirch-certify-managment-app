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
  pocListUrl = `${this.baseUrl}pocs`;

  constructor(private http: HttpClient) { }

  getPocs(filters: PocFilters): Observable<IListResult<IPoc>> {
    return this.http.get<IListResult<IPoc>>(this.pocListUrl, { params: flattenFilters(filters) as any });
  }

  getPocStatus(pocId: string) {
    const url = `${this.pocStatusUrl}/${pocId}`;
    return this.http.get<IPocCreationState>(url);
  }

  deletePocs(pocs: IPoc[]) {
    return this.http.delete(this.pocListUrl, { params: { pocIds: pocs.map(p => p.id).toString() } });
  }

}
