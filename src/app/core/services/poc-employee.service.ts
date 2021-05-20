import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { EMPLOYEES_MOCK, EMPLOYEE_STATE_MOCK } from '../mocks/employees.mock';
import { Filters } from '../models/filters';
import { IListResult } from '../models/interfaces/list-result.interface';
import { IPocEmployeeState } from '../models/interfaces/poc-employee-state.interface';
import { IPocEmployee } from '../models/interfaces/poc-employee.interface';
import { ExportImportService } from './export-import.service';

@Injectable({
  providedIn: 'root'
})
export class PocEmployeeService {

  baseUrl = environment.pocManagerApi;
  employeesStatusUrl = `${this.baseUrl}poc-employees/status`;
  employeesUrl = `${this.baseUrl}poc-employees`;
  importEmployeesUrl = `${this.baseUrl}poc-employees/create`;

  constructor(
    private http: HttpClient,
    private importService: ExportImportService,
  ) { }

  getEmployeeState(employeeId: string) {
    return of(EMPLOYEE_STATE_MOCK).pipe(delay(500));
    // return this.http.get<IPocEmployeeState>(`${this.employeesStatusUrl}/${employeeId}` );
  }

  getEmployees(filters: Filters) {
    return of(EMPLOYEES_MOCK).pipe(delay(500));
    // return this.http.get<IListResult<IPocEmployee>>(this.employeesUrl);
  }

  importFile(file: File) {
    return this.importService.uploadFile(file, this.importEmployeesUrl);
  }

}
