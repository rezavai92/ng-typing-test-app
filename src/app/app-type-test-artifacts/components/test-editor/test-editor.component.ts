import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
  signal,
  viewChildren,
} from '@angular/core';
import { ITestModel } from '../../../app-shared/models/ITestModel.interface';
import { TypeTestService } from '../../services/type-test.service';
import {
  Subject,
  Subscription,
  interval,
  take,
  takeUntil,
  tap,
  timer,
} from 'rxjs';
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
import { TimerFormatPipe } from '../../../app-shared/pipes/timer-format.pipe';
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
    TimerFormatPipe,
  ],
  templateUrl: './test-editor.component.html',
  styleUrl: './test-editor.component.scss',
})
export class TestEditorComponent implements OnInit, AfterViewInit, OnDestroy {
  testModel!: TestModel;
  filter!: ITestModelFilter;
  destroy$: Subject<any> = new Subject();
  timerSubscription!: Subscription;
  remainingTime!: number;
  normalViewConfig = signal({
    currentParaIndex: 0,
    currentWordIndex: 0,
    currentParaWordCount: 0,
    currentTypedWord: ' ',
    wordStack: new Array(),
    TotalPara: 0,
  });

  @ViewChildren('paragraph') divs!: QueryList<ElementRef>;
  constructor(
    private _typeTestService: TypeTestService,
    public testAction: TestActionService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.subscribeFilter();
  }

  ngAfterViewInit(): void {
    this.focusNextPara();
  }

  subscribeFilter() {
    this.testAction.testTriggered
      .pipe(
        takeUntil(this.destroy$),
        tap((res) => {
          //  debugger;
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
        //     debugger;
        const cloned = JSON.parse(JSON.stringify(res[0])) as TestModel;

        this.testModel = new TestModel(cloned.Paragraph, cloned.Difficulty);

        this.testModel.TestTime = this.filter.duration;
        this.remainingTime = this.testModel.TestTime;
        this.normalViewConfig.update((config) => {
          return {
            ...config,
            currentParaWordCount:
              this.testModel.Paragraph.Normal[config.currentParaIndex].split(
                ' '
              ).length,
            TotalPara: this.testModel.Paragraph.Normal.length,
          };
        });
      });
  }

  startTest() {
    this.testModel.Status = 'running';
    //this.testModel.startTest();
    this.timerSubscription = interval(1000)
      .pipe(take(this.testModel.TestTime + 1), takeUntil(this.destroy$))
      .subscribe((res) => {
        this.remainingTime = this.testModel.TestTime - res - 1;
        if (this.remainingTime == 0) {
          this.testModel.Status = 'finished';
          this.router.navigateByUrl('/');
        }
      });
  }

  handleSpaceKey(config: any) {
    config.wordStack.push(config.currentTypedWord);
    config.currentTypedWord = ' ';

    this.normalViewConfig.update((conf) => {
      conf.currentWordIndex++;
      if (conf.currentWordIndex >= conf.currentParaWordCount) {
        conf.currentParaIndex++;
        conf.currentWordIndex = 0;
        conf.currentParaWordCount =
          this.testModel.Paragraph.Normal[conf.currentParaIndex].split(
            ' '
          ).length;
      }

      return conf;
    });
  }

  handleBackspaceKey(config: any) {
    config.currentTypedWord = config.currentTypedWord.slice(
      0,
      config.currentTypedWord.length - 1
    );

    if (!config.currentTypedWord && config.currentWordIndex > 0) {
      config.currentTypedWord = config.wordStack.pop();
      config.currentWordIndex--;
    }

    this.normalViewConfig.update((config) => ({ ...config }));
  }

  handleEnterKey() {
    const config = this.normalViewConfig();
    config.wordStack.push(config.currentTypedWord);
    config.currentParaIndex++;
    if (config.currentParaIndex >= config.TotalPara) return;
    config.currentWordIndex = 0;
    config.currentParaWordCount =
      this.testModel.Paragraph.Normal[config.currentParaIndex].split(
        ' '
      ).length;

    this.normalViewConfig.update((item) => ({ ...config }));

    this.focusNextPara();
  }

  focusNextPara() {
    this.divs.forEach((x, index) => {
      if (index == this.normalViewConfig().currentParaIndex) {
        x.nativeElement.querySelector('input').focus();
      }
    });
  }

  handleCharacterKey(key: string) {
    this.normalViewConfig.update((config) => ({
      ...config,
      currentTypedWord: config.currentTypedWord + key,
    }));
  }
  startTyping(e: KeyboardEvent) {
    if (this.testModel.Status == 'waiting') {
      this.startTest();
    }

    const config = this.normalViewConfig();

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
      e.preventDefault();
    } else if (e.key == ' ') {
      this.handleSpaceKey(config);
    } else if (e.key == 'Enter') {
      this.handleEnterKey();
    } else if (e.key.length == 1) {
      this.handleCharacterKey(e.key);
    } else if (e.key == 'Backspace') {
      this.handleBackspaceKey(config);
    }
  }

  ngOnDestroy(): void {}
}
