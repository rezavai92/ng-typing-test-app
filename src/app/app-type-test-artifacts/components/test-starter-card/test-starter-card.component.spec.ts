import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestStarterCardComponent } from './test-starter-card.component';
import { TypeTestArtifactsModule } from '../../type-test-artifacts/type-test-artifacts.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('TestStarterCardComponent', () => {
  let component: TestStarterCardComponent;
  let fixture: ComponentFixture<TestStarterCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypeTestArtifactsModule, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TestStarterCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
