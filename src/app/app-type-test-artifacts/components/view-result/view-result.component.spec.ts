import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ViewResultComponent } from './view-result.component';
import { ITestModelResult } from '../../../app-shared/models/ITestModel.interface';
import { TestModel } from '../../../app-shared/models/TestModel';
import { ScoreReporter } from '../../../app-shared/models/ScoreReporter';
import { testModels } from '../../../app-shared/constants/testModelData';
import { TypeTestArtifactsModule } from '../../type-test-artifacts/type-test-artifacts.module';
import { RouterOutlet, RouterLink } from '@angular/router';

describe('ViewResultComponent', () => {
  let component: ViewResultComponent;
  let fixture: ComponentFixture<ViewResultComponent>;
  let mockDialogRef: MatDialogRef<ViewResultComponent>;
  let mockData: { testModel: TestModel; filledupLines: string[] };

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    mockData = {
      testModel: testModels[0],
      filledupLines: ['line1', 'line2'],
    };

    await TestBed.configureTestingModule({
      imports: [RouterOutlet, RouterLink, TypeTestArtifactsModule],
      declarations: [ViewResultComponent],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockData },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should disable dialog close', () => {
  //   expect(mockDialogRef.disableClose).toBeTrue();
  // });

  // it('should initialize scoreReporter in constructor', () => {
  //   expect(component.scoreReporter).toBeDefined();
  //   expect(component.scoreReporter instanceof ScoreReporter).toBeTrue();
  // });

  // it('should call evaluateScore on ngOnInit', () => {
  //   spyOn(component.scoreReporter, 'evaluateScore');
  //   component.ngOnInit();
  //   expect(component.scoreReporter.evaluateScore).toHaveBeenCalledWith(
  //     mockData.filledupLines
  //   );
  // });

  // it('should have the correct data injected', () => {
  //   expect(component.data).toEqual(mockData);
  // });
});
