import { WritableSignal } from '@angular/core';
import { INormalViewConfig } from '../../components/test-editor/test-editor.component';
import { InputKeyHandleStrategy } from './InputKeyHandleStrategy';
import { EditorKeys } from '../../../app-shared/constants/keyboardData';
import { TestModel } from '../../../app-shared/models/TestModel';

export class EnterKeyHandleStrategy extends InputKeyHandleStrategy {
  constructor(public testModel: TestModel) {
    super(testModel);
  }
  override handleKey(
    key: string,
    configSignal: WritableSignal<INormalViewConfig>,
    callback: Function
  ): void {
    const config = configSignal();
    config.wordStack.push(config.currentTypedWord);
    config.currentParaIndex++;

    if (config.currentParaIndex >= config.TotalPara) return;
    config.currentWordIndex = 0;
    config.currentParaWordCount = this.testModel.Paragraph.Normal[
      config.currentParaIndex
    ].split(EditorKeys.Space).length;

    config.currentTypedWord = EditorKeys.Space;

    configSignal.update((item) => ({ ...config }));

    callback();
  }
}
