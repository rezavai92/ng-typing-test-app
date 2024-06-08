import { Routes } from '@angular/router';
import { TestLandingPageComponent } from './app-type-test-artifacts/components/test-landing-page/test-landing-page.component';
import { TestEditorComponent } from './app-type-test-artifacts/components/test-editor/test-editor.component';

export const routes: Routes = [
  {
    path: '',
    component: TestLandingPageComponent,
  },
  {
    path: 'test',
    component: TestEditorComponent,
  },
];
