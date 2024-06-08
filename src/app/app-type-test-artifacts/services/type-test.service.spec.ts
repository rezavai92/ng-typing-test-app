import { TestBed } from '@angular/core/testing';

import { TypeTestService } from './type-test.service';

describe('TypeTestService', () => {
  let service: TypeTestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeTestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
