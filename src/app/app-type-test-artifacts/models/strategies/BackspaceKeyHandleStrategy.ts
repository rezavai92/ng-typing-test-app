import { WritableSignal } from '@angular/core';
import { INormalViewConfig } from '../../components/test-editor/test-editor.component';
import { InputKeyHandleStrategy } from './InputKeyHandleStrategy';

export class BackspaceKeyHandleStrategy extends InputKeyHandleStrategy {
  override handleKey(
    key: string,
    configSignal: WritableSignal<INormalViewConfig>,
    callback: Function | null
  ): void {
    let config = configSignal();

    config.currentTypedWord = config.currentTypedWord.slice(
      0,
      config.currentTypedWord.length - 1
    );

    if (!config.currentTypedWord && config.currentWordIndex > 0) {
      config.currentTypedWord = config.wordStack.pop() as string;
      config.currentWordIndex--;
    }

    if (config.currentTypedWord == '' && config.currentWordIndex == 0) {
      config.currentParaIndex--;
      config.currentTypedWord = config.wordStack.pop() as string;
      config.currentParaWordCount =
        config.testModel?.Paragraph.Normal[config.currentParaIndex].split(' ')
          .length ?? 0;
      config.currentWordIndex = config.currentParaWordCount - 1;
    }
    configSignal.update((item) => ({ ...config }));
  }
}
