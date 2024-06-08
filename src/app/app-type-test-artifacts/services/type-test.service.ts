import { Injectable } from '@angular/core';
import { ITestModelFilter } from '../interfaces/ITestModelFilter.interface';
import { Observable, Subject, of } from 'rxjs';
import { testModels } from '../../app-shared/constants/testModelData';

@Injectable({
  providedIn: 'root',
})
export class TypeTestService {
  constructor() {}

  loadTestModels(filter: ITestModelFilter) {
    return of(testModels.filter((x) => x.Difficulty == filter.difficultyLevel));
  }
}
