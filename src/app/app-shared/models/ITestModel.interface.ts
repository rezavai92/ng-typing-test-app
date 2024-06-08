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
