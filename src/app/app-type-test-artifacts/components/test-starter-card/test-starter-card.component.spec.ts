import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestStarterCardComponent } from './test-starter-card.component';

describe('TestStarterCardComponent', () => {
  let component: TestStarterCardComponent;
  let fixture: ComponentFixture<TestStarterCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestStarterCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestStarterCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
