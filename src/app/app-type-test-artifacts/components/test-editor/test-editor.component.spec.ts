import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TestEditorComponent } from './test-editor.component';
import { TypeTestService } from '../../services/type-test.service';
import { TestActionService } from '../../services/test-action.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { TestModel } from '../../../app-shared/models/TestModel';
import { ITestModelFilter } from '../../interfaces/ITestModelFilter.interface';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { testModels } from '../../../app-shared/constants/testModelData';

describe('TestEditorComponent', () => {
  let component: TestEditorComponent;
  let fixture: ComponentFixture<TestEditorComponent>;
  let typeTestService: jasmine.SpyObj<TypeTestService>;
  let testActionService: jasmine.SpyObj<TestActionService>;
  let router: jasmine.SpyObj<Router>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let cdr: jasmine.SpyObj<ChangeDetectorRef>;

  beforeEach(() => {
    const typeTestServiceSpy = jasmine.createSpyObj('TypeTestService', [
      'loadTestModels',
    ]);
    const testActionServiceSpy = jasmine.createSpyObj('TestActionService', [], {
      testTriggered: new BehaviorSubject<ITestModelFilter | null>(null),
    });
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const cdrSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    TestBed.configureTestingModule({
      declarations: [TestEditorComponent],
      providers: [
        { provide: TypeTestService, useValue: typeTestServiceSpy },
        { provide: TestActionService, useValue: testActionServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: ChangeDetectorRef, useValue: cdrSpy },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TestEditorComponent);
    component = fixture.componentInstance;
    typeTestService = TestBed.inject(
      TypeTestService
    ) as jasmine.SpyObj<TypeTestService>;
    testActionService = TestBed.inject(
      TestActionService
    ) as jasmine.SpyObj<TestActionService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    cdr = TestBed.inject(
      ChangeDetectorRef
    ) as jasmine.SpyObj<ChangeDetectorRef>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call subscribeFilter on ngOnInit', () => {
    spyOn(component, 'subscribeFilter');
    component.ngOnInit();
    expect(component.subscribeFilter).toHaveBeenCalled();
  });

  // it('should call focusNextPara and detectChanges on ngAfterViewInit', () => {
  //   spyOn(component, 'focusNextPara');
  //   component.ngAfterViewInit();
  //   expect(component.focusNextPara).toHaveBeenCalled();
  //   expect(cdr.detectChanges).toHaveBeenCalled();
  // });

  // it('should load test model when filter is set in subscribeFilter', () => {
  //   spyOn(component, 'loadTestModel');
  //   const filter: ITestModelFilter = { duration: 30, difficultyLevel: 'easy' }; // Example filter
  //   testActionService.testTriggered.next(filter);
  //   expect(component.loadTestModel).toHaveBeenCalled();
  // });

  it('should load test model on loadTestModel call', () => {
    const testModel = testModels[0];
    typeTestService.loadTestModels.and.returnValue(of([testModel]));
    component.filter = {
      duration: 30,
      difficultyLevel: 'easy',
    } as ITestModelFilter;
    component.loadTestModel();
    expect(component.testModel).toEqual(jasmine.any(TestModel));
  });

  it('should start test and update remainingTime on startTest', () => {
    component.testModel = testModels[0];
    component.testModel.TestTime = 30;
    component.startTest();
    expect(component.testModel.Status).toEqual('running');
  });

  it('should open view result dialog on viewResult', () => {
    component.testModel = testModels[0];
    component.resultLoading = false;
    component.viewResult();
    expect(component.resultLoading).toBeTrue();
    setTimeout(() => {
      expect(component.resultLoading).toBeFalse();
      expect(dialog.open).toHaveBeenCalled();
    }, 1000);
  });

  it('should unsubscribe on ngOnDestroy', () => {
    spyOn(component.destroy$, 'next');
    spyOn(component.destroy$, 'complete');
    component.ngOnDestroy();
    expect(component.destroy$.next).toHaveBeenCalledWith(true);
    expect(component.destroy$.complete).toHaveBeenCalled();
  });

  // Add more tests as necessary for other functionalities and methods
});
