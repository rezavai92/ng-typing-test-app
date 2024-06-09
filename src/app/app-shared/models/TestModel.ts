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

  compareParagraph(actual: string[], answered: string[]) {
    let i = 0;
    let correctCount = 0;
    while (i < actual.length) {
      if (actual[i] == answered[i]) correctCount++;
    }

    return [correctCount, actual.length - correctCount];
  }

  prepareResultReport(wordStack: string[]) {
    let actualWords = this.Paragraph.Pro.split(' ');

    let totalWords = this.Paragraph.Pro.split(' ').length;

    let [correct, mistTypeCount] = this.compareParagraph(
      actualWords,
      wordStack
    );

    let wpm = Math.floor(correct / (this.TestTime / 60));
    this.Result = {
      MistypeCount: mistTypeCount,
      Correct: totalWords - mistTypeCount,
      TotalWords: totalWords,
      WPM: wpm,
    };
  }

  startTest() {}

  stopTest() {}

  changeMode() {}
}
