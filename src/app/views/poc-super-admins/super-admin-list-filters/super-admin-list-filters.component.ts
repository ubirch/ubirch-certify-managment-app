import {Component, Input} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';
import {PocStatus, PocStatusTranslation} from 'src/app/core/models/enums/poc-status.enum';


@Component({
  selector: 'app-super-admin-list-filters',
  templateUrl: './super-admin-list-filters.component.html',
  styleUrls: ['./super-admin-list-filters.component.scss'],
})
export class SuperAdminListFiltersComponent {

  @Input() filters: UntypedFormGroup;

  statuses: string[] = [PocStatus.completed, PocStatus.pending, PocStatus.processing, PocStatus.aborted];
  PocStatusTranslation = PocStatusTranslation;
}

