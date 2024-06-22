import { Injectable } from '@angular/core';
import { TestModel } from './TestModel';

@Injectable()
export class ScoreReporter {
  _testModel: TestModel;

  constructor(testModel: TestModel) {
    this._testModel = testModel;
    this._testModel.TestTime = 30;
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

  evaluateScore(filledUpLines: string[]) {
    console.log('filled up lines', filledUpLines);
    let totalWords = this._testModel.Paragraph.Pro.split(' ').length;
    filledUpLines = filledUpLines.filter((x) => x != null);
    if (this._testModel.Mode == 'pro') {
      filledUpLines = filledUpLines[0].split('\n').map((x) => x.trim());
    } else {
      filledUpLines = filledUpLines.map((x) => x.trim());
    }
    let { totalCorrect, totalMistypes } = filledUpLines.reduce(
      (a, b, index) => {
        let { correct, misTypeCount } = this.compareTwoInputLinesInNormalTest(
          this._testModel.Paragraph.Normal[index],
          b
        );

        a.totalCorrect += correct;
        a.totalMistypes += misTypeCount;

        return a;
      },
      { totalCorrect: 0, totalMistypes: 0 }
    );

    let wpm = Math.floor(totalCorrect / (this._testModel.TestTime / 60));
    this._testModel.Result = {
      MistypeCount: totalMistypes,
      Correct: totalCorrect,
      TotalWords: totalWords,
      WPM: wpm,
    };
  }
}
