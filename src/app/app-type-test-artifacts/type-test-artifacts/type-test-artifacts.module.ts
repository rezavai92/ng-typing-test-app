import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardActions, MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { TimerFormatPipe } from '../../app-shared/pipes/timer-format.pipe';
import { TextHighlighterDirective } from '../directives/text-highlighter.directive';
import { TestEditorComponent } from '../components/test-editor/test-editor.component';
import { ViewResultComponent } from '../components/view-result/view-result.component';
import { TestStarterCardComponent } from '../components/test-starter-card/test-starter-card.component';
import { TestLandingPageComponent } from '../components/test-landing-page/test-landing-page.component';

@NgModule({
  declarations: [
    TestEditorComponent,
    ViewResultComponent,
    TestStarterCardComponent,
    TestLandingPageComponent,
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    //  FormsModule,
    MatIconModule,
    TextHighlighterDirective,
    //   ReactiveFormsModule,
    TimerFormatPipe,
    MatDialogModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    TimerFormatPipe,
    TextHighlighterDirective,
    MatCardActions,
    MatDividerModule,
  ],
})
export class TypeTestArtifactsModule {}
