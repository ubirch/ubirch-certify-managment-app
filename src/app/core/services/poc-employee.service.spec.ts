import { TestBed } from '@angular/core/testing';

import { PocEmployeeService } from './poc-employee.service';

describe('PocEmployeeService', () => {
  let service: PocEmployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PocEmployeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
