import { TestBed } from '@angular/core/testing';

import { TypeTestService } from './type-test.service';
import { ITestModelFilter } from '../interfaces/ITestModelFilter.interface';

describe('TypeTestService', () => {
  let service: TypeTestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeTestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be created', () => {
    let filter: ITestModelFilter = {
      difficultyLevel: 'easy',
      duration: 30,
    };
    expect(service.loadTestModels(filter)).toBeTruthy();

    service.loadTestModels(filter).subscribe((res) => {
      expect(res.length).toBe(1, 'does not match the length of test models');
    });
  });
});
