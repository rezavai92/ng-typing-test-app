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

    configSignal.update((item) => ({ ...config }));
  }
}
