import { TestModel } from './TestModel';

export class ScoreReporter {
  private _testModel: TestModel;

  constructor(testModel: TestModel) {
    this._testModel = testModel;
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
    let totalWords = this._testModel.Paragraph.Pro.split(' ').length;
    filledUpLines = filledUpLines.filter((x) => x != null);

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
