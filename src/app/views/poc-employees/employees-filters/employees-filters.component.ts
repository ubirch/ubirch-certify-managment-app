import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { EmployeeStatus, EmployeeStatusTranslation } from 'src/app/core/models/enums/employee-status.eunm';

@Component({
  selector: 'app-employees-filters',
  templateUrl: './employees-filters.component.html',
  styleUrls: ['./employees-filters.component.scss'],
})
export class EmployeesFiltersComponent {

  @Input() filters: FormGroup;

  statuses: string[] = [EmployeeStatus.completed, EmployeeStatus.pending, EmployeeStatus.processing, EmployeeStatus.aborted];
  EmployeeStatusTranslation = EmployeeStatusTranslation;

}
