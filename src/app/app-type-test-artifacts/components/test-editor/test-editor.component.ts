import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
  WritableSignal,
  computed,
  signal,
} from '@angular/core';

import { TypeTestService } from '../../services/type-test.service';
import { Subject, Subscription, interval, take, takeUntil, tap } from 'rxjs';
import { ITestModelFilter } from '../../interfaces/ITestModelFilter.interface';
import { TestModel } from '../../../app-shared/models/TestModel';
import { TestActionService } from '../../services/test-action.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ViewResultComponent } from '../view-result/view-result.component';
import { EditorKeys } from '../../../app-shared/constants/keyboardData';
import { InputKeyHandlerStrategyContext } from '../../models/contexts/KeyHandlerStrategyContext';

export interface INormalViewConfig {
  currentParaIndex: number;
  currentWordIndex: number;
  currentParaWordCount: number;
  currentTypedWord: string;
  wordStack: string[];
  typedlines: string[];
  TotalPara: number;
}
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
  normalViewConfig: WritableSignal<INormalViewConfig> = signal({
    currentParaIndex: 0,
    currentWordIndex: 0,
    currentParaWordCount: 0,
    currentTypedWord: ' ',
    wordStack: [],
    typedlines: [],
    TotalPara: 0,
  });

  resultLoading = false;
  typedLines = computed(() => {
    let config = this.normalViewConfig();

    return config.typedlines;
  });
  @ViewChildren('paragraph') normalViewIndividualParas!: QueryList<ElementRef>;
  constructor(
    private _typeTestService: TypeTestService,
    public testAction: TestActionService,
    public router: Router,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscribeFilter();
  }

  ngAfterViewInit(): void {
    this.focusNextPara();
    this.cdr.detectChanges();
  }

  subscribeFilter() {
    this.testAction.testTriggered
      .pipe(
        takeUntil(this.destroy$),
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
        const cloned = JSON.parse(JSON.stringify(res[0])) as TestModel;
        this.testModel = new TestModel(cloned.Paragraph, cloned.Difficulty);
        this.testModel.TestTime = this.filter.duration;
        this.remainingTime = this.testModel.TestTime;
        const typedLines: string[] = new Array(
          this.testModel.Paragraph.Normal.length
        );

        this.normalViewConfig.update((config) => {
          return {
            ...config,
            currentParaWordCount:
              this.testModel.Paragraph.Normal[config.currentParaIndex].split(
                ' '
              ).length,
            TotalPara: this.testModel.Paragraph.Normal.length,
            typedlines: typedLines,
          };
        });
      });
  }

  navigateToHome() {
    this.router.navigateByUrl('/');
  }

  startTest() {
    this.testModel.Status = 'running';
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
        width: '600px',
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
    let arrows: string[] = [
      EditorKeys.ArrowDown,
      EditorKeys.ArrowRight,
      EditorKeys.ArrowLeft,
      EditorKeys.ArrowUp,
    ];

    if (arrows.includes(event.key)) {
      event.preventDefault();
    }
  }

  handleSpaceKey() {
    const config = this.normalViewConfig();

    config.wordStack.push(config.currentTypedWord);
    config.currentTypedWord = ' ';
    this.normalViewConfig.update((conf) => {
      conf.currentWordIndex++;

      return conf;
    });
  }

  handleBackspaceKey() {
    let config = this.normalViewConfig();

    config.currentTypedWord = config.currentTypedWord.slice(
      0,
      config.currentTypedWord.length - 1
    );

    if (!config.currentTypedWord && config.currentWordIndex > 0) {
      config.currentTypedWord = config.wordStack.pop() as string;
      config.currentWordIndex--;
    }

    this.normalViewConfig.update((item) => ({ ...config }));
  }

  handleEnterKey() {
    const config = this.normalViewConfig();
    config.wordStack.push(config.currentTypedWord);
    config.currentParaIndex++;

    if (config.currentParaIndex >= config.TotalPara) return;
    config.currentWordIndex = 0;
    config.currentParaWordCount = this.testModel.Paragraph.Normal[
      config.currentParaIndex
    ].split(EditorKeys.Space).length;

    config.currentTypedWord = EditorKeys.Space;

    this.normalViewConfig.update((item) => ({ ...config }));

    this.focusNextPara();
  }

  constructParagraphFromCombinedInput() {
    return this.typedLines();
  }

  focusNextPara() {
    this.normalViewIndividualParas.forEach((x, index) => {
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

  shouldPreventEnterKey(config: INormalViewConfig) {
    return (
      config.currentWordIndex < config.currentParaWordCount - 1 ||
      config.currentTypedWord == ' '
    );
  }

  shouldPreventSpaceKey(config: INormalViewConfig) {
    let reachedLastWord =
      config.currentWordIndex >= config.currentParaWordCount - 1;
    let noWordTypedInCurrentIndex = config.currentTypedWord == EditorKeys.Space;

    return reachedLastWord || noWordTypedInCurrentIndex;
  }

  shouldPreventBackspaceKey(config: INormalViewConfig) {
    const noCharacterInCurrentLine =
      config.currentWordIndex == 0 && config.currentTypedWord == ' ';

    return noCharacterInCurrentLine;
  }

  getEditorKeyFromInput(key: string) {
    switch (key) {
      case EditorKeys.Space:
        return EditorKeys.Space;
      case EditorKeys.Backspace:
        return EditorKeys.Backspace;
      case EditorKeys.Enter:
        return EditorKeys.Enter;
      case EditorKeys.ArrowDown:
        return EditorKeys.ArrowDown;
      case EditorKeys.ArrowLeft:
        return EditorKeys.Backspace;
      case EditorKeys.ArrowRight:
        return EditorKeys.ArrowRight;
      case EditorKeys.ArrowUp:
        return EditorKeys.ArrowUp;
      default:
        return EditorKeys.SingleChar;
    }
  }

  getKeyEventCallback(key: string) {
    switch (key) {
      case EditorKeys.Enter:
        return this.focusNextPara.bind(this);

      default:
        return null;
    }
  }
  handlePermittedKeys(e: KeyboardEvent) {
    let key = this.getEditorKeyFromInput(e.key);
    // debugger;
    const keyHandletrategyContext = new InputKeyHandlerStrategyContext(
      key,
      this.testModel
    );
    const keyHandleStrategy = keyHandletrategyContext.getStrategy();

    if (keyHandleStrategy) {
      keyHandleStrategy.handleKey(
        key,
        this.normalViewConfig,
        this.getKeyEventCallback(e.key)
      );
    }
  }

  preventRestrictedKeys(e: KeyboardEvent) {
    this.handleArrowKeys(e);

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
      e.preventDefault();
    }
  }

  isPreventableKey(key: string) {
    const config = this.normalViewConfig();
    const preventableSpaceKey =
      key == EditorKeys.Space && this.shouldPreventSpaceKey(config);
    const preventableEnterKey =
      key == EditorKeys.Enter && this.shouldPreventEnterKey(config);
    const preventableBackspaceKey =
      key == EditorKeys.Backspace && this.shouldPreventBackspaceKey(config);

    return (
      preventableSpaceKey || preventableEnterKey || preventableBackspaceKey
    );
  }
  startTyping(e: KeyboardEvent, i: number) {
    if (this.testModel.Status == 'waiting') {
      this.startTest();
    }

    if (this.isPreventableKey(e.key)) {
      e.preventDefault();
      return;
    }

    let config = this.normalViewConfig();

    setTimeout(() => {
      let targetInput: any = e?.target;
      config.typedlines[i] = targetInput.value;
      this.normalViewConfig.update((item) => ({ ...config }));
      this.preventRestrictedKeys(e);

      this.handlePermittedKeys(e);
    }, 0);
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
