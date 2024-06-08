import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ITestModel } from '../../../app-shared/models/ITestModel.interface';
import { TypeTestService } from '../../services/type-test.service';
import { Subject, Subscription, take, takeUntil, tap } from 'rxjs';
import { ITestModelFilter } from '../../interfaces/ITestModelFilter.interface';
import { TestModel } from '../../../app-shared/models/TestModel';
import { CommonModule } from '@angular/common';
import { TestActionService } from '../../services/test-action.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TextHighlighterDirective } from '../../directives/text-highlighter.directive';
@Component({
  selector: 'app-test-editor',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    TextHighlighterDirective,
    ReactiveFormsModule,
  ],
  templateUrl: './test-editor.component.html',
  styleUrl: './test-editor.component.scss',
})
export class TestEditorComponent implements OnInit, AfterViewInit, OnDestroy {
  testModel!: TestModel;
  filter!: ITestModelFilter;
  destroy$!: Subject<any>;

  constructor(
    private _typeTestService: TypeTestService,
    public testAction: TestActionService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.subscribeFilter();
  }

  ngAfterViewInit(): void {}

  subscribeFilter() {
    this.testAction.testTriggered
      .pipe(
        //      takeUntil(this.destroy$),
        tap((res) => {
          if (res) {
            this.filter = res as ITestModelFilter;
            this.loadTestModel();
          } else {
            this.router.navigateByUrl('/');
          }
        })
      )
      .subscribe((res) => {});
  }

  loadTestModel() {
    this._typeTestService
      .loadTestModels(this.filter)
      .pipe(take(1))
      .subscribe((res) => {
        this.testModel = res[0];
      });
  }

  startTest() {
    this.testModel.startTest();
  }
  ngOnDestroy(): void {}
}
