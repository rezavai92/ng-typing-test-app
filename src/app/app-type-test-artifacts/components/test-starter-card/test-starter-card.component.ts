import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { difficultyLevel } from '../../types/common.types';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TestActionService } from '../../services/test-action.service';
@Component({
  selector: 'app-test-starter-card',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './test-starter-card.component.html',
  styleUrl: './test-starter-card.component.scss',
})
export class TestStarterCardComponent {
  durationOptions = [30, 60, 120, 180, 300];

  difficultyLevels: difficultyLevel[] = ['easy', 'medium', 'hard'];

  selectedDifficultyLevel: difficultyLevel = 'easy';
  selectedDuration = 30;
  durationFormControl!: FormControl;
  difficultyFormControl!: FormControl;

  constructor(private _router: Router, public testAction: TestActionService) {}

  startTest() {
    this.testAction.emitFilter({
      difficultyLevel: this.selectedDifficultyLevel,
      duration: this.selectedDuration,
    });

    this._router.navigateByUrl('test');
  }
}
