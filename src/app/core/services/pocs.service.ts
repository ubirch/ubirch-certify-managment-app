import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IListResult } from '../models/interfaces/list-result.interface';
import { IPoc } from '../models/interfaces/poc.interface';
import { flattenFilters, PocFilters } from '../models/poc-filters';

@Injectable({
  providedIn: 'root'
})
export class PocsService {

  pocListUrl = `${environment.pocManagerApi}${environment.pocList}`;

  constructor(private http: HttpClient) { }

  loadPocs(filters: PocFilters): Observable<IListResult<IPoc>> {
    return this.http.get<IListResult<IPoc>>(this.pocListUrl, { params: flattenFilters(filters) as any });
  }

  deletePocs(pocs: IPoc[]) {
    // const count = this.pocsList.length;
    // const pocIds = pocs.map(p => p.id);
    // this.pocsList = this.pocsList.filter(p => !pocIds.includes(p.id));
    return of([]);
  }

}
