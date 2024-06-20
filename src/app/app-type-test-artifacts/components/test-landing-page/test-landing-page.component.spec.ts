import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestLandingPageComponent } from './test-landing-page.component';
import { TypeTestArtifactsModule } from '../../type-test-artifacts/type-test-artifacts.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('TestLandingPageComponent', () => {
  let component: TestLandingPageComponent;
  let fixture: ComponentFixture<TestLandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TypeTestArtifactsModule, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TestLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
