export interface ITestModel {
  checkResult: () => void;
  startTest: () => void;
  stopTest: () => void;
  changeMode: () => void;
}

export interface ITestParagraph {
  Normal: string[];
  Pro: string;
}

export interface ITestModelResut {
  WPM: number;
  TotalWords: number;
  Correct: number;
  MistypeCount: number;
}
