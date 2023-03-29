import {SessionEndedInterceptor} from './session-ended';

import {TestBed} from "@angular/core/testing";

describe('SessionEndedInterceptor', () => {
    let service: SessionEndedInterceptor;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SessionEndedInterceptor);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
