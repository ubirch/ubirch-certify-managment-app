import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IPocEmployeeState } from 'src/app/core/models/interfaces/poc-employee-state.interface';
import { IPocEmployee } from 'src/app/core/models/interfaces/poc-employee.interface';
import { PocEmployeeService } from 'src/app/core/services/poc-employee.service';
import { fadeDownIn } from 'src/app/core/utils/animations';

@Component({
  selector: 'app-employees-details',
  templateUrl: './employees-details.component.html',
  styleUrls: ['./employees-details.component.scss'],
  animations: [fadeDownIn],
})
export class EmployeesDetailsComponent implements OnInit {


  employeeState$: Observable<IPocEmployeeState>;

  @Input() employee: IPocEmployee;
  @Input() set current(value: boolean) {
    if (value) { this.employeeState$ = this.employeeService.getEmployeeState(this.employee.id); }
    else { this.employeeState$ = null; }
  }

  constructor(
    private employeeService: PocEmployeeService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() { }

  icon(value: boolean) {
    if (value === true) { return 'check_circle'; }
    if (value === false) { return 'cancel'; }
    return '';
  }

}
