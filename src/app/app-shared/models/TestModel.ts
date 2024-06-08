import { difficultyLevel } from '../../app-type-test-artifacts/types/common.types';
import { ITestModel, ITestParagraph } from './ITestModel.interface';

export class TestModel implements ITestModel {
  Paragraph: ITestParagraph;
  TestTime!: number;
  Difficulty!: difficultyLevel;

  constructor(
    paragraph: ITestParagraph,

    difficulty: difficultyLevel
  ) {
    this.Paragraph = paragraph;

    this.Difficulty = difficulty;
  }

  checkResult() {}

  startTest() {}

  stopTest() {}
  changeMode() {}
}
