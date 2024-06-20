import { Injectable } from '@angular/core';
import { ITestModelFilter } from '../interfaces/ITestModelFilter.interface';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TestActionService {
  testTriggered: BehaviorSubject<ITestModelFilter | null> =
    new BehaviorSubject<ITestModelFilter | null>(null);
  constructor() {}

  clearFilter() {
    this.testTriggered.complete();
  }

  emitFilter(filter: ITestModelFilter) {
    this.testTriggered.next(filter);
  }
}
