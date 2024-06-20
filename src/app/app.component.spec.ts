import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TypeTestArtifactsModule } from './app-type-test-artifacts/type-test-artifacts/type-test-artifacts.module';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet, RouterLink, ActivatedRoute } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockActivatedRoute: ActivatedRoute;
  beforeEach(async () => {
    mockActivatedRoute = jasmine.createSpyObj(
      'ActivatedRoute',
      ['toString'],
      ['children']
    );

    await TestBed.configureTestingModule({
      imports: [TypeTestArtifactsModule, NoopAnimationsModule],
      providers: [{ provide: ActivatedRoute, useValue: mockActivatedRoute }],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });
});
