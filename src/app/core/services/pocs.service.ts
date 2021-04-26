import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { PocStatus } from '../models/enums/poc-status.enum';
import { ListResult } from '../models/interfaces/poc-list-result';
import { Poc } from '../models/interfaces/poc.interface';
import { PocFilters } from '../models/poc-filters';


const MOCK_DATA: Poc[] = [
  { id: 1, pocId: 1, name: 'POC #1', deviceId: 'd63787b0-9214-4215-9332-724c2ac6ebac', folderIdentifier: 'poc_folder_1', createdAt: new Date, updatedAt: new Date, status: PocStatus.ready },
  { id: 2, pocId: 2, name: 'POC #2', deviceId: 'd63787b0-9214-4215-9332-724c2ac6ebac', folderIdentifier: 'poc_folder_2', createdAt: new Date, updatedAt: new Date, status: PocStatus.ready },
  { id: 3, pocId: 3, name: 'POC #3', deviceId: 'd63787b0-9214-4215-9332-724c2ac6ebac', folderIdentifier: 'poc_folder_3', createdAt: new Date, status: PocStatus.processing },
  { id: 4, pocId: 4, name: 'POC #4', deviceId: 'd63787b0-9214-4215-9332-724c2ac6ebac', folderIdentifier: 'poc_folder_4', createdAt: new Date, status: PocStatus.pending },
  { id: 5, pocId: 5, name: 'POC #5', deviceId: 'd63787b0-9214-4215-9332-724c2ac6ebac', folderIdentifier: 'poc_folder_5', createdAt: new Date, updatedAt: new Date, status: PocStatus.ready },
  { id: 6, pocId: 6, name: 'POC #6', deviceId: 'd63787b0-9214-4215-9332-724c2ac6ebac', folderIdentifier: 'poc_folder_6', createdAt: new Date, updatedAt: new Date, status: PocStatus.ready },
  { id: 7, pocId: 7, name: 'POC #7', deviceId: 'd63787b0-9214-4215-9332-724c2ac6ebac', folderIdentifier: 'poc_folder_7', createdAt: new Date, updatedAt: new Date, status: PocStatus.ready },
  { id: 8, pocId: 8, name: 'POC #8', deviceId: 'd63787b0-9214-4215-9332-724c2ac6ebac', folderIdentifier: 'poc_folder_8', createdAt: new Date, status: PocStatus.processing },
  { id: 9, pocId: 9, name: 'POC #9', deviceId: 'd63787b0-9214-4215-9332-724c2ac6ebac', folderIdentifier: 'poc_folder_9', createdAt: new Date, status: PocStatus.pending },
  { id: 10, pocId: 10, name: 'POC #10', deviceId: 'd63787b0-9214-4215-9332-724c2ac6ebac', folderIdentifier: 'poc_folder_10', createdAt: new Date, updatedAt: new Date, status: PocStatus.ready },
  { id: 11, pocId: 11, name: 'POC #11', deviceId: 'd63787b0-9214-4215-9332-724c2ac6ebac', folderIdentifier: 'poc_folder_11', createdAt: new Date, updatedAt: new Date, status: PocStatus.ready },
  { id: 12, pocId: 12, name: 'POC #12', deviceId: 'd63787b0-9214-4215-9332-724c2ac6ebac', folderIdentifier: 'poc_folder_12', createdAt: new Date, updatedAt: new Date, status: PocStatus.ready },
  { id: 13, pocId: 13, name: 'POC #13', deviceId: 'd63787b0-9214-4215-9332-724c2ac6ebac', folderIdentifier: 'poc_folder_13', createdAt: new Date, status: PocStatus.processing },
  { id: 14, pocId: 14, name: 'POC #14', deviceId: 'd63787b0-9214-4215-9332-724c2ac6ebac', folderIdentifier: 'poc_folder_14', createdAt: new Date, status: PocStatus.pending },
  { id: 15, pocId: 15, name: 'POC #15', deviceId: 'd63787b0-9214-4215-9332-724c2ac6ebac', folderIdentifier: 'poc_folder_15', createdAt: new Date, updatedAt: new Date, status: PocStatus.ready },
  { id: 16, pocId: 16, name: 'POC #16', deviceId: 'd63787b0-9214-4215-9332-724c2ac6ebac', folderIdentifier: 'poc_folder_16', createdAt: new Date, updatedAt: new Date, status: PocStatus.ready },
  { id: 17, pocId: 17, name: 'POC #17', deviceId: 'd63787b0-9214-4215-9332-724c2ac6ebac', folderIdentifier: 'poc_folder_17', createdAt: new Date, updatedAt: new Date, status: PocStatus.ready },
  { id: 18, pocId: 18, name: 'POC #18', deviceId: 'd63787b0-9214-4215-9332-724c2ac6ebac', folderIdentifier: 'poc_folder_18', createdAt: new Date, status: PocStatus.processing },
  { id: 19, pocId: 19, name: 'POC #19', deviceId: 'd63787b0-9214-4215-9332-724c2ac6ebac', folderIdentifier: 'poc_folder_19', createdAt: new Date, status: PocStatus.pending },
  { id: 20, pocId: 20, name: 'POC #20', deviceId: 'd63787b0-9214-4215-9332-724c2ac6ebac', folderIdentifier: 'poc_folder_20', createdAt: new Date, updatedAt: new Date, status: PocStatus.ready },
];

@Injectable({
  providedIn: 'root'
})
export class PocsService {

  pocsList = MOCK_DATA;

  constructor(private http: HttpClient) { }

  loadPocs(filters: PocFilters): Observable<ListResult<Poc>> {
    let data = this.pocsList;

    if (filters.search?.trim()) {
      data = data.filter(r => JSON.stringify(r).includes(filters.search));
    }

    if (filters.filterColumns?.status?.length > 0) {
      data = data.filter(r => filters.filterColumns.status.includes(r.status));
    }

    if (filters.sortColumn) {
      data = data.slice().sort((a: Poc, b: Poc) => {
        if (typeof a[filters.sortColumn] === 'number') { return a[filters.sortColumn] - b[filters.sortColumn]; }
        else { return ('' + a[filters.sortColumn]).localeCompare(b[filters.sortColumn]); }
      });
      data = filters.sortOrder === 'asc' ? data : data.reverse();
    }

    return of({
      total: data.length,
      pocs: data.slice(filters.pageIndex * filters.pageSize, filters.pageIndex * filters.pageSize + filters.pageSize)
    } as ListResult<Poc>).pipe(delay(1000));

    // TODO: Implement actual processing of datafetching
  }

  deletePocs(pocs: Poc[]) {
    const count = this.pocsList.length;
    const pocIds = pocs.map(p => p.id);
    this.pocsList = this.pocsList.filter(p => !pocIds.includes(p.id));
    return of(count - this.pocsList.length);
  }

}
