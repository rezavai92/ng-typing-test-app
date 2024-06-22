import { Injectable } from '@angular/core';
import { ITestModelFilter } from '../interfaces/ITestModelFilter.interface';
import { BehaviorSubject } from 'rxjs';
import { UtilityService } from '../../app-shared/services/utility.service';

@Injectable({
  providedIn: 'root',
})
export class TestActionService {
  testTriggered: BehaviorSubject<ITestModelFilter | null> =
    new BehaviorSubject<ITestModelFilter | null>(null);
  constructor(private _utilityService: UtilityService) {}

  clearFilter() {
    this.testTriggered.complete();
  }

  emitFilter(filter: ITestModelFilter) {
    this.testTriggered.next(filter);
  }

  detectMode() {
    if (this._utilityService.isMobile()) return 'mobile';
    return 'basic';
  }
}
