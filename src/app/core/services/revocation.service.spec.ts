import { TestBed } from '@angular/core/testing';

import { RevocationService } from './revocation.service';

describe('RevocationService', () => {
  let service: RevocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RevocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
