import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TestStarterCardComponent } from './test-starter-card.component';
import { Router } from '@angular/router';
import { TestActionService } from '../../services/test-action.service';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { of } from 'rxjs';
import { TypeTestArtifactsModule } from '../../type-test-artifacts/type-test-artifacts.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('TestStarterCardComponent', () => {
  let component: TestStarterCardComponent;
  let fixture: ComponentFixture<TestStarterCardComponent>;
  let routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
  let testActionServiceSpy = jasmine.createSpyObj('TestActionService', [
    'emitFilter',
  ]);

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestStarterCardComponent],
      imports: [TypeTestArtifactsModule, NoopAnimationsModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: TestActionService, useValue: testActionServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestStarterCardComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize duration options correctly', () => {
    expect(component.durationOptions).toEqual([30, 60, 120, 180, 300]);
  });

  it('should initialize difficulty levels correctly', () => {
    expect(component.difficultyLevels).toEqual(['easy', 'medium', 'hard']);
  });

  it('should initialize selected difficulty level to easy', () => {
    expect(component.selectedDifficultyLevel).toBe('easy');
  });

  it('should initialize selected duration to 30', () => {
    expect(component.selectedDuration).toBe(30);
  });

  it('should call testAction.emitFilter and navigate on startTest', () => {
    component.startTest();
    expect(testActionServiceSpy.emitFilter).toHaveBeenCalledWith({
      difficultyLevel: 'easy',
      duration: 30,
    });
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('test');
  });
});
