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

  compareTwoInputLinesInNormalTest(actual: string, written: string) {
    let misTypeCount = 0;
    let correct = 0;
    let actualWords = actual.split(' ');
    let writtenWords = written.split(' ');

    for (let i = 0; i < actualWords.length; i++) {
      if (i >= writtenWords.length) misTypeCount++;
      else if (actualWords[i] == writtenWords[i]) {
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
    debugger;
    let totalWords = this.Paragraph.Pro.split(' ').length;
    filledUpLines = filledUpLines.filter((x) => x != null);
    let totalCorrect = 0;
    let totalMistypes = 0;
    for (let i = 0; i < filledUpLines.length; i++) {
      let { correct, misTypeCount } = this.compareTwoInputLinesInNormalTest(
        this.Paragraph.Normal[i],
        filledUpLines[i]
      );
      totalCorrect += correct;
      totalMistypes += misTypeCount;
    }

    let wpm = Math.floor(totalCorrect / (this.TestTime / 60));
    this.Result = {
      MistypeCount: totalMistypes,
      Correct: totalCorrect,
      TotalWords: totalWords,
      WPM: wpm,
    };
  }

  startTest() {}

  stopTest() {}

  changeMode() {}
}
