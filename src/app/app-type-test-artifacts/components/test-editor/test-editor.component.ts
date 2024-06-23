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

export interface IEditorViewConfig {
  currentParaIndex: number;
  currentWordIndex: number;
  currentParaWordCount: number;
  currentTypedWord: string;
  wordStack: string[];
  typedlines: string[];
  TotalPara: number;
  testModel: TestModel | null;
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
  editorViewConfig: WritableSignal<IEditorViewConfig> = signal({
    currentParaIndex: 0,
    currentWordIndex: 0,
    currentParaWordCount: 0,
    currentTypedWord: ' ',
    wordStack: [],
    typedlines: [],
    TotalPara: 0,
    testModel: null,
  });

  resultLoading = false;
  typedLines = computed(() => {
    let config = this.editorViewConfig();

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
              duration: 10000,
            }
          );
          return;
        }

        this.editorViewConfig.update((config) => {
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
    let querySelector = this.selectedMode() == 'pro' ? 'textarea' : 'input';
    let elemRef =
      this.selectedMode() == 'pro'
        ? this.proViewPara
        : this.normalViewIndividualParas;

    elemRef.forEach((x, index) => {
      if (index == this.editorViewConfig().currentParaIndex) {
        x.nativeElement.querySelector(querySelector).focus();
      }
    });
  }

  shouldPreventEnterKey(config: IEditorViewConfig) {
    return (
      config.currentWordIndex < config.currentParaWordCount - 1 ||
      config.currentTypedWord == EditorKeys.Space
    );
  }

  shouldPreventSpaceKey(config: IEditorViewConfig) {
    let reachedLastWord =
      config.currentWordIndex >= config.currentParaWordCount - 1;
    let noWordTypedInCurrentIndex = config.currentTypedWord == EditorKeys.Space;

    return reachedLastWord || noWordTypedInCurrentIndex;
  }

  shouldPreventBackspaceKey(config: IEditorViewConfig) {
    const noCharacterInCurrentLine =
      config.currentWordIndex == 0 && config.currentTypedWord == ' ';

    return this.selectedMode() == 'basic'
      ? noCharacterInCurrentLine
      : config.currentParaIndex == 0 &&
          config.currentTypedWord == EditorKeys.Space &&
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
        this.editorViewConfig,
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

  shouldPreventSingleCharKey(config: IEditorViewConfig) {
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
    const config = this.editorViewConfig();

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
    const config = this.editorViewConfig();
    let targetInput: any = e?.target;
    config.typedlines[i] = targetInput.value;
    this.editorViewConfig.update((item) => ({ ...config }));
  }

  onModeChange(event: MatButtonToggleChange) {
    this.selectedMode.set(event.source.value);
    this.filter.mode = this.selectedMode();
    this.testAction.emitFilter(this.filter);
    this.cdr.detectChanges();
    this.focusNextPara();
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
