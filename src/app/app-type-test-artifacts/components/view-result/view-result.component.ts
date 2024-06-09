import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ITestModelResut } from '../../../app-shared/models/ITestModel.interface';
import { TestModel } from '../../../app-shared/models/TestModel';

@Component({
  selector: 'app-view-result',
  standalone: false,

  templateUrl: './view-result.component.html',
  styleUrl: './view-result.component.scss',
})
export class ViewResultComponent {
  result!: ITestModelResut;
  constructor(
    public dialogRef: MatDialogRef<ViewResultComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { testModel: TestModel; filledupLines: string[] }
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.data.testModel.prepareResultReport(this.data.filledupLines);

    console.log('test model', this.data.testModel);
  }
}
