import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, reduce } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AcitvateAction } from '../models/enums/acitvate-action.enum';
import { Filters, flattenFilters } from '../models/filters';
import { IListResult } from '../models/interfaces/list-result.interface';
import { IPocEmployeeState } from '../models/interfaces/poc-employee-state.interface';
import { IPocEmployee } from '../models/interfaces/poc-employee.interface';
import { ExportImportService } from './export-import.service';

interface IEmployeeActionState {
    employee: IPocEmployee;
    success: boolean;
}


@Injectable({
    providedIn: 'root',
})
export class PocEmployeeService {

    pocAdminPath = 'poc-admin/';
    baseUrl = environment.pocManagerApi + this.pocAdminPath;
    employeesStatusUrl = `${this.baseUrl}employee/status`;
    employeesUrl = `${this.baseUrl}employees`;
    importEmployeesUrl = `${this.baseUrl}employees/create`;

    constructor(
        private http: HttpClient,
        private importService: ExportImportService,
    ) {
    }

    getEmployee(employeeId: string): Observable<IPocEmployee> {
        const url = `${this.employeesUrl}/${employeeId}`;
        return this.http.get<IPocEmployee>(url);
    }

    getEmployees(filters: Filters) {
        //    return of(EMPLOYEES_MOCK).pipe(delay(500));
        return this.http.get<IListResult<IPocEmployee>>(this.employeesUrl, { params: flattenFilters(filters) as any });
    }

    getEmployeeState(employeeId: string) {
        //    return of(EMPLOYEE_STATE_MOCK).pipe(delay(500));
        return this.http.get<IPocEmployeeState>(`${this.employeesStatusUrl}/${employeeId}`);
    }

    putPocEmployee(employee: IPocEmployee): Observable<any> {
        const url = `${this.employeesUrl}/${employee.id}`;
        return this.http.put(url, employee);
    }

    importFile(file: File) {
        return this.importService.uploadFile(file, this.importEmployeesUrl);
    }

    changeActiveState(employeeId: string, activate: AcitvateAction) {
        const url = `${this.baseUrl}poc-employee/${employeeId}/active/${activate}`;
        return this.http.put(url, null);
    }

    changeActiveStateForAdmins(employees: IPocEmployee[], activate: AcitvateAction) {

        return from(employees).pipe(
            mergeMap(
                employee => this.changeActiveState(employee.id, activate).pipe(
                    map(() => ({ employee, success: true })),
                    catchError(() => of({ employee, success: false })),
                )
            ),
            reduce(
                (acc, current: IEmployeeActionState) => {
                    if (current.success) { acc.ok = [...acc.ok, current.employee]; }
                    else { acc.nok = [...acc.nok, current.employee]; }
                    return acc;
                }, { ok: [], nok: [] } as { ok: IPocEmployee[], nok: IPocEmployee[] }
            )
        );

    }

}
