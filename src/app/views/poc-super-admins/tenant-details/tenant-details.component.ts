import { Component, OnInit } from '@angular/core';
import {LocaleService} from "../../../core/services/locale.service";
import {ILocale} from "../../../core/models/interfaces/locale.interface";
import {filter, map, switchMap, tap} from "rxjs/operators";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {PocSuperAdminService} from "../../../core/services/poc-super-admin.service";
import {ITenant} from "../../../core/models/interfaces/tenant.interface";
import {ErrorHandlerService} from "../../../core/services/error-handler.service";

@Component({
  selector: 'app-tenant-details',
  templateUrl: './tenant-details.component.html',
  styleUrls: ['./tenant-details.component.scss'],
})
export class TenantDetailsComponent implements OnInit {

    locale: ILocale;
    tenantId: string;
    tenant: ITenant;

    constructor(
      private localService: LocaleService,
      private route: ActivatedRoute,
      private router: Router,
      private pocSuperAdminService: PocSuperAdminService,
      private errorService: ErrorHandlerService,
  ) { }

  ngOnInit() {
      this.localService.current$.subscribe(locale => this.locale = locale);
      this.route.paramMap
          .pipe(
              map((params: ParamMap) => params.get('id')),
              filter((tenantId) => !!tenantId),
              tap((tenantId) => (this.tenantId = tenantId)),
              switchMap((tenantId) => this.pocSuperAdminService.getTenant(tenantId))
          )
          .subscribe({
              next: (res: any) => {
                  this.tenant = res;
                  console.log(this.tenant);
//                  this.generateForm();
              },
              error: (err) => {
                  this.errorService.handlerResponseError(err);
                  this.router.navigate(['../../'], {
                      relativeTo: this.route,
                  });
              },
          });
  }

}
