import { difficultyLevel } from '../../app-type-test-artifacts/types/common.types';
import {
  ITestModel,
  ITestModelResut,
  ITestParagraph,
} from './ITestModel.interface';

export class TestModel implements ITestModel {
  Paragraph: ITestParagraph;
  TestTime!: number;
  Difficulty!: difficultyLevel;
  Status!: 'running' | 'finished' | 'waiting';
  Result!: ITestModelResut;
  constructor(
    paragraph: ITestParagraph,

    difficulty: difficultyLevel
  ) {
    this.Paragraph = paragraph;

    this.Difficulty = difficulty;
    this.Status = 'waiting';
  }

  checkResult() {}

  startTest() {}

  stopTest() {}
  changeMode() {}
}
