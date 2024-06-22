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
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface INormalViewConfig {
  currentParaIndex: number;
  currentWordIndex: number;
  currentParaWordCount: number;
  currentTypedWord: string;
  wordStack: string[];
  typedlines: string[];
  TotalPara: number;
  testModel: TestModel | null;
}

export interface IProViewConfig {
  currentWordIndex: number;
  wordStack: string[];
  currentTypedWord: string;
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
    testModel: null,
  });

  proViewConfig: WritableSignal<IProViewConfig> = signal({
    currentWordIndex: 0,
    wordStack: [],
    currentTypedWord: ' ',
  });

  resultLoading = false;
  typedLines = computed(() => {
    let config = this.normalViewConfig();

    return config.typedlines;
  });

  currentProModeLineIndex = 0;

  selectedMode: WritableSignal<'basic' | 'pro'> = signal('basic');
  @ViewChildren('paragraph') normalViewIndividualParas!: QueryList<ElementRef>;
  @ViewChildren('proViewParagraph') proViewPara!: QueryList<ElementRef>;
  constructor(
    private _typeTestService: TypeTestService,
    public testAction: TestActionService,
    public router: Router,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private _snackbar: MatSnackBar
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
        this.testModel.Mode = this.filter.mode;
        this.remainingTime = this.testModel.TestTime;
        const typedLines: string[] = new Array(
          this.testModel.Paragraph.Normal.length
        );
        if (this.filter.mode == 'mobile') {
          this._snackbar.open(
            'Please test with a PC! We  will provide this feature for the mobile devices soon.',
            'Close',
            {
              duration: 5000,
            }
          );
          return;
        }

        this.normalViewConfig.update((config) => {
          return {
            ...config,
            currentParaWordCount:
              this.testModel.Paragraph.Normal[config.currentParaIndex].split(
                ' '
              ).length,
            TotalPara: this.testModel.Paragraph.Normal.length,
            typedlines: typedLines,
            testModel: this.testModel,
          };
        });
      });
  }

  navigateToHome() {
    this.router.navigateByUrl('/');
  }

  startTest() {
    if (this.filter.mode == 'mobile') {
      return;
    }
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
    console.log('final config', this.normalViewConfig());
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

  constructParagraphFromCombinedInput() {
    return this.typedLines();
  }

  focusNextPara() {
    if (this.selectedMode() == 'pro') {
      this.proViewPara.forEach((x, index) => {
        if (index == this.normalViewConfig().currentParaIndex) {
          x.nativeElement.querySelector('textarea').focus();
        }
      });
      return;
    }
    this.normalViewIndividualParas.forEach((x, index) => {
      if (index == this.normalViewConfig().currentParaIndex) {
        x.nativeElement.querySelector('input').focus();
      }
    });
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

    return this.selectedMode() == 'basic'
      ? noCharacterInCurrentLine
      : config.currentParaIndex == 0 &&
          config.currentTypedWord == ' ' &&
          config.currentWordIndex == 0;
  }

  getEditorKeyFromInput(key: string): EditorKeys {
    const defaultKeys: string[] = [
      EditorKeys.Space,
      EditorKeys.Backspace,
      EditorKeys.ArrowDown,
      EditorKeys.ArrowLeft,
      EditorKeys.ArrowRight,
      EditorKeys.ArrowUp,
      EditorKeys.Enter,
      EditorKeys.Shift,
    ];

    return (
      defaultKeys.includes(key) ? key : EditorKeys.SingleChar
    ) as EditorKeys;
  }

  getKeyEventCallback(key: string) {
    if (EditorKeys.Enter) return this.focusNextPara.bind(this);
    return null;
  }

  formatKey(key: EditorKeys) {
    if (key == EditorKeys.Shift) return EditorKeys.Blank;
    return key;
  }

  handlePermittedKeys(e: KeyboardEvent) {
    let key = this.getEditorKeyFromInput(e.key);
    key = this.formatKey(key);
    const keyHandletrategyContext = new InputKeyHandlerStrategyContext(
      key,
      this.testModel
    );
    const keyHandleStrategy = keyHandletrategyContext.getStrategy();

    if (keyHandleStrategy) {
      let actualKey = key == EditorKeys.SingleChar ? e.key : key;
      keyHandleStrategy.handleKey(
        actualKey,
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

  shouldPreventSingleCharKey(config: INormalViewConfig) {
    let ind = config.currentParaIndex;

    let typedLines =
      this.selectedMode() == 'basic'
        ? config.typedlines
        : config.typedlines.length > 0
        ? config.typedlines[0]?.split('\n')
        : [];

    return typedLines && typedLines[ind]?.length > 44;
  }

  isPreventableKey(key: string) {
    const config = this.normalViewConfig();

    const preventableSpaceKey =
      key == EditorKeys.Space && this.shouldPreventSpaceKey(config);
    const preventableEnterKey =
      key == EditorKeys.Enter && this.shouldPreventEnterKey(config);
    const preventableBackspaceKey =
      key == EditorKeys.Backspace && this.shouldPreventBackspaceKey(config);
    const preventableSingleCharKey =
      key.length == 1 && this.shouldPreventSingleCharKey(config);

    return (
      preventableSpaceKey ||
      preventableEnterKey ||
      preventableBackspaceKey ||
      preventableSingleCharKey
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

    setTimeout(() => {
      this.updateTypedLines(e, i);
      this.preventRestrictedKeys(e);
      this.handlePermittedKeys(e);
    }, 0);
  }

  updateTypedLines(e: KeyboardEvent, i: number) {
    const config = this.normalViewConfig();
    let targetInput: any = e?.target;
    config.typedlines[i] = targetInput.value;
    this.normalViewConfig.update((item) => ({ ...config }));
  }

  onModeChange(event: MatButtonToggleChange) {
    this.selectedMode.set(event.source.value);
    this.filter.mode = this.selectedMode();
    this.testAction.emitFilter(this.filter);
    this.cdr.detectChanges();
    this.focusNextPara();
    // this.cdr.detectChanges();
  }
  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
