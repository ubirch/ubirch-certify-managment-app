import { TestBed } from '@angular/core/testing';

import { PocSuperAdminService } from './poc-super-admin.service';

describe('PocSuperAdminService', () => {
  let service: PocSuperAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PocSuperAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
