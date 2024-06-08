import { TestBed } from '@angular/core/testing';

import { TestActionService } from './test-action.service';

describe('TestActionService', () => {
  let service: TestActionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestActionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
