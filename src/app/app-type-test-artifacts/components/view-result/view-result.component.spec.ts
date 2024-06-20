import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ViewResultComponent } from './view-result.component';
import { TestModel } from '../../../app-shared/models/TestModel';
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
});
