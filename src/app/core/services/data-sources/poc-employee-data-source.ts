import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, finalize } from 'rxjs/operators';
import { EMPLOYEES_MOCK } from '../../mocks/employees.mock';
import { Filters } from '../../models/filters';
import { IListResult } from '../../models/interfaces/list-result.interface';
import { IPocEmployee } from '../../models/interfaces/poc-employee.interface';
import { ErrorHandlerService } from '../error-handler.service';
import { PocEmployeeService } from '../poc-employee.service';

export class PocEmployeeDataSource implements DataSource<IPocEmployee> {

    private employeeSubject = new BehaviorSubject<IPocEmployee[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private totalItemsSubject = new BehaviorSubject<number>(0);

    public loading$ = this.loadingSubject.asObservable();
    public totalItems$ = this.totalItemsSubject.asObservable();

    get data() { return this.employeeSubject.value; }

    constructor(
        private employeeService: PocEmployeeService,
        private errorService: ErrorHandlerService
    ) { }

    connect(collectionViewer: CollectionViewer): Observable<IPocEmployee[] | readonly IPocEmployee[]> {
        return this.employeeSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.employeeSubject.complete();
        this.loadingSubject.complete();
    }

    loadEmpoloyees(filters: Filters) {
        this.loadingSubject.next(true);

        this.employeeService.getEmployees(filters).pipe(
            finalize(() => this.loadingSubject.next(false))
        ).subscribe(
            adminsResult => {
                this.employeeSubject.next(adminsResult.records ?? []);
                this.totalItemsSubject.next(adminsResult.total ?? 0);
            },
            (err: HttpErrorResponse) => {
                this.errorService.handlerResponseError(err);
                return of({} as IListResult<IPocEmployee>);
            }
        );
    }
}
