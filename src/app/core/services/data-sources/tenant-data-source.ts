import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {ITenant} from "../../models/interfaces/tenant.interface";
import {BehaviorSubject, Observable, of} from "rxjs";
import {PocSuperAdminService} from "../poc-super-admin.service";
import {ErrorHandlerService} from "../error-handler.service";
import {Filters} from "../../models/filters";
import {finalize} from "rxjs/operators";
import {HttpErrorResponse} from "@angular/common/http";
import {IListResult} from "../../models/interfaces/list-result.interface";

export class TenantDataSource implements DataSource<ITenant>{
    private tenantsSubject = new BehaviorSubject<ITenant[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private totalItemsSubject = new BehaviorSubject<number>(0);

    public loading$ = this.loadingSubject.asObservable();
    public totalItems$ = this.totalItemsSubject.asObservable();

    get data() {
        return this.tenantsSubject.value;
    }

    constructor(
        private service: PocSuperAdminService,
        private error: ErrorHandlerService
    ) {}

    connect(
        collectionViewer: CollectionViewer
    ): Observable<ITenant[] | readonly ITenant[]> {
        return this.tenantsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.tenantsSubject.complete();
        this.loadingSubject.complete();
    }

    loadTenants(filters: Filters) {
        this.loadingSubject.next(true);

        this.service
            .getAllTenants(filters)
            .pipe(finalize(() => this.loadingSubject.next(false)))
            .subscribe({
                next: (tenantsResult) => {
                    this.tenantsSubject.next(tenantsResult.records ?? []);
                    this.totalItemsSubject.next(tenantsResult.total ?? 0);
                },
                error: (err: HttpErrorResponse) => {
                    this.error.handlerResponseError(err);
                    return of({} as IListResult<ITenant>);
                },
            });
    }
}
