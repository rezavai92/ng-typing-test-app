import { difficultyLevel } from '../../app-type-test-artifacts/types/common.types';
import {
  ITestModel,
  ITestModelResult,
  ITestParagraph,
} from './ITestModel.interface';

export class TestModel {
  Paragraph: ITestParagraph;
  TestTime!: number;
  Difficulty!: difficultyLevel;
  Status!: 'running' | 'finished' | 'waiting';
  Result!: ITestModelResult;
  constructor(
    paragraph: ITestParagraph,

    difficulty: difficultyLevel
  ) {
    this.Paragraph = paragraph;

    this.Difficulty = difficulty;
    this.Status = 'waiting';
  }

  compareTwoInputLinesInNormalTest(actual: string, written: string) {
    let misTypeCount = 0;
    let correct = 0;
    let actualWords = actual.split(' ');
    let writtenWords = written.split(' ');

    for (let i = 0; i < writtenWords.length; i++) {
      if (actualWords[i] == writtenWords[i]) {
        correct++;
      } else {
        misTypeCount++;
      }
    }

    return {
      misTypeCount,
      correct,
    };
  }

  prepareResultReport(filledUpLines: string[]) {
    let totalWords = this.Paragraph.Pro.split(' ').length;
    filledUpLines = filledUpLines.filter((x) => x != null);

    let { totalCorrect, totalMistypes } = filledUpLines.reduce(
      (a, b, index) => {
        let { correct, misTypeCount } = this.compareTwoInputLinesInNormalTest(
          this.Paragraph.Normal[index],
          b
        );

        a.totalCorrect += correct;
        a.totalMistypes += misTypeCount;

        return a;
      },
      { totalCorrect: 0, totalMistypes: 0 }
    );

    let wpm = Math.floor(totalCorrect / (this.TestTime / 60));
    this.Result = {
      MistypeCount: totalMistypes,
      Correct: totalCorrect,
      TotalWords: totalWords,
      WPM: wpm,
    };
  }
}
