import { Component } from '@angular/core';
import { difficultyLevel } from '../../types/common.types';
import { Router } from '@angular/router';
import { TestActionService } from '../../services/test-action.service';
@Component({
  selector: 'app-test-starter-card',
  templateUrl: './test-starter-card.component.html',
  styleUrl: './test-starter-card.component.scss',
})
export class TestStarterCardComponent {
  durationOptions = [30, 60, 120, 180, 300];

  difficultyLevels: difficultyLevel[] = ['easy', 'medium', 'hard'];

  selectedDifficultyLevel: difficultyLevel = 'easy';
  selectedDuration = 30;

  constructor(private _router: Router, public testAction: TestActionService) {}

  startTest() {
    this.testAction.emitFilter({
      difficultyLevel: this.selectedDifficultyLevel,
      duration: this.selectedDuration,
      mode: this.testAction.detectMode(),
    });

    this._router.navigateByUrl('test');
  }
}
