import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
  computed,
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

import { TestActionService } from '../../services/test-action.service';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';

import { ViewResultComponent } from '../view-result/view-result.component';

@Component({
  selector: 'app-test-editor',
  standalone: false,
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
    typedlines: new Array(),
    TotalPara: 0,
  });

  resultLoading = false;
  typedLines = computed(() => {
    let config = this.normalViewConfig();

    return config.typedlines;
  });
  @ViewChildren('paragraph') divs!: QueryList<ElementRef>;
  constructor(
    private _typeTestService: TypeTestService,
    public testAction: TestActionService,
    public router: Router,
    public dialog: MatDialog
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
            typedlines: new Array(this.testModel.Paragraph.Normal.length),
          };
        });
      });
  }

  navigateToHome() {
    this.router.navigateByUrl('/');
  }

  startTest() {
    this.testModel.Status = 'running';
    //this.testModel.startTest();
    this.timerSubscription = interval(1000)
      .pipe(take(this.testModel.TestTime), takeUntil(this.destroy$))
      .subscribe((res) => {
        this.remainingTime = this.testModel.TestTime - res - 1;

        if (this.remainingTime == 0) {
          this.testModel.Status = 'finished';
          this.viewResult();
        }
      });
  }

  viewResult() {
    this.resultLoading = true;

    setTimeout(() => {
      this.resultLoading = false;
      const resultModalRef = this.dialog.open(ViewResultComponent, {
        width: '500px',
        data: {
          testModel: this.testModel,
          filledupLines: this.constructParagraphFromCombinedInput(),
        },
      });
      resultModalRef.afterClosed().subscribe((res) => {
        this.router.navigateByUrl('/');
      });
    }, 1000);
  }

  handleArrowKeys(event: KeyboardEvent) {
    let arrows = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];

    if (arrows.includes(event.key)) {
      event.preventDefault();
    }
  }

  handleSpaceKey(config: any, event: KeyboardEvent) {
    config.wordStack.push(config.currentTypedWord);
    config.currentTypedWord = ' ';

    this.normalViewConfig.update((conf) => {
      conf.currentWordIndex++;

      return conf;
    });

    this.normalViewConfig().wordStack;
  }

  trackChange(event: any, index: number) {
    const config = this.normalViewConfig();
    config.typedlines[index] = event.target.value;

    this.normalViewConfig.update((conf) => ({ ...conf, ...config }));
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

    config.currentTypedWord = ' ';

    this.normalViewConfig.update((item) => ({ ...config }));

    this.focusNextPara();
    //  config.currentTypedWord = ' ';
  }

  constructParagraphFromCombinedInput() {
    return this.typedLines();
  }

  focusNextPara() {
    this.divs.forEach((x, index) => {
      if (index == this.normalViewConfig().currentParaIndex) {
        x.nativeElement.querySelector('input').focus();
      }
    });
  }

  handleCharacterKey(key: string) {
    let config = this.normalViewConfig();

    let newConfig = {
      ...config,
      currentTypedWord: config.currentTypedWord + key,
    };

    this.normalViewConfig.update((config) =>
      JSON.parse(JSON.stringify(newConfig))
    );
  }
  startTyping(e: KeyboardEvent, i: number) {
    if (this.testModel.Status == 'waiting') {
      this.startTest();
    }
    const config = this.normalViewConfig();

    if (e.key == ' ') {
      if (config.currentWordIndex >= config.currentParaWordCount - 1) {
        e.preventDefault();
        return;
      }

      if (config.currentTypedWord == ' ') {
        e.preventDefault();
        return;
      }
    }
    setTimeout(() => {
      let targetInput: any = e?.target;

      config.typedlines[i] = targetInput.value;

      this.handleArrowKeys(e);

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
        e.preventDefault();
      } else if (e.key == ' ') {
        this.handleSpaceKey(config, e);
      } else if (e.key == 'Enter') {
        this.handleEnterKey();
      } else if (e.key.length == 1) {
        this.handleCharacterKey(e.key);
      } else if (e.key == 'Backspace') {
        this.handleBackspaceKey(config);
      }
    }, 0);
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
  }
}
