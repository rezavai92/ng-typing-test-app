import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ITestModelResult } from '../../../app-shared/models/ITestModel.interface';
import { TestModel } from '../../../app-shared/models/TestModel';
import { ScoreReporter } from '../../../app-shared/models/ScoreReporter';

@Component({
  selector: 'app-view-result',
  standalone: false,

  templateUrl: './view-result.component.html',
  styleUrl: './view-result.component.scss',
})
export class ViewResultComponent {
  result!: ITestModelResult;
  scoreReporter!: ScoreReporter;
  constructor(
    public dialogRef: MatDialogRef<ViewResultComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { testModel: TestModel; filledupLines: string[] }
  ) {
    dialogRef.disableClose = true;
    this.scoreReporter = new ScoreReporter(this.data.testModel);
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.scoreReporter.evaluateScore(this.data.filledupLines);
  }
}
