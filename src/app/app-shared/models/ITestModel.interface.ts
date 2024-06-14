export interface ITestModel {
  prepareResultReport: (answeredWords: string[]) => void;
  startTest: () => void;
  stopTest: () => void;
  changeMode: () => void;
}

export interface ITestParagraph {
  Normal: string[];
  Pro: string;
}

export interface ITestModelResult {
  WPM: number;
  TotalWords: number;
  Correct: number;
  MistypeCount: number;
}
