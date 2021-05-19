import { TestBed } from '@angular/core/testing';

import { PocAdminService } from './poc-admin.service';

describe('PocAdminService', () => {
  let service: PocAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PocAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
