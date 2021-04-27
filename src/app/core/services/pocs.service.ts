import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MOCK_DATA } from '../mocks/pocs.mock';
import { IListResult } from '../models/interfaces/poc-list-result.interface';
import { IPoc } from '../models/interfaces/poc.interface';
import { PocFilters } from '../models/poc-filters';

@Injectable({
  providedIn: 'root'
})
export class PocsService {

  pocsList = MOCK_DATA;

  constructor(private http: HttpClient) { }

  loadPocs(filters: PocFilters): Observable<IListResult<IPoc>> {
    let data = this.pocsList;

    if (filters.search?.trim()) {
      data = data.filter(r => JSON.stringify(r).includes(filters.search));
    }

    if (filters.filterColumns?.status?.length > 0) {
      data = data.filter(r => filters.filterColumns.status.includes(r.status));
    }

    if (filters.sortColumn) {
      data = data.slice().sort((a: IPoc, b: IPoc) => {
        if (typeof a[filters.sortColumn] === 'number') { return a[filters.sortColumn] - b[filters.sortColumn]; }
        else { return ('' + a[filters.sortColumn]).localeCompare(b[filters.sortColumn]); }
      });
      data = filters.sortOrder === 'asc' ? data : data.reverse();
    }

    return of({
      total: data.length,
      pocs: data.slice(filters.pageIndex * filters.pageSize, filters.pageIndex * filters.pageSize + filters.pageSize)
    } as IListResult<IPoc>).pipe(delay(1000));

    // TODO: Implement actual processing of datafetching
  }

  deletePocs(pocs: IPoc[]) {
    const count = this.pocsList.length;
    const pocIds = pocs.map(p => p.id);
    this.pocsList = this.pocsList.filter(p => !pocIds.includes(p.id));
    return of(count - this.pocsList.length);
  }

}
