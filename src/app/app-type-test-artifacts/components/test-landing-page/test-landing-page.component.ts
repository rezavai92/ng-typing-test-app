import { Component } from '@angular/core';
import { TestStarterCardComponent } from '../test-starter-card/test-starter-card.component';

@Component({
  selector: 'app-test-landing-page',
  standalone: true,
  imports: [TestStarterCardComponent],
  templateUrl: './test-landing-page.component.html',
  styleUrl: './test-landing-page.component.scss',
})
export class TestLandingPageComponent {}
