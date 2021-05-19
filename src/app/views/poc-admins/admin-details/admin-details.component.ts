import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IPocAdminState } from 'src/app/core/models/interfaces/poc-admin-state.interface';
import { IPocAdmin } from 'src/app/core/models/interfaces/poc-admin.interface';
import { PocAdminService } from 'src/app/core/services/poc-admin.service';
import { fadeDownIn } from 'src/app/core/utils/animations';

@Component({
  selector: 'app-admin-details',
  templateUrl: './admin-details.component.html',
  styleUrls: ['./admin-details.component.scss'],
  animations: [fadeDownIn],
})
export class AdminDetailsComponent {

  adminState: Observable<IPocAdminState>;

  @Input() admin: IPocAdmin;
  @Input() set current(value: boolean) {
    if (value) { this.adminState = this.adminService.getAdminState(this.admin.id); }
    else { this.adminState = null; }
  }

  constructor(
    private adminService: PocAdminService
  ) { }

  icon(value: boolean) {
    if (value === true) { return 'check_circle'; }
    if (value === false) { return 'cancel'; }
    return '';
  }

}
