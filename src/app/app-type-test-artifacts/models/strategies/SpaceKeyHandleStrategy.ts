import { WritableSignal } from '@angular/core';
import { IEditorViewConfig } from '../../components/test-editor/test-editor.component';
import { InputKeyHandleStrategy } from './InputKeyHandleStrategy';

export class SpaceKeyHandleStrategy extends InputKeyHandleStrategy {
  override handleKey(
    key: string,
    configSignal: WritableSignal<IEditorViewConfig>,
    callback: Function | null
  ): void {
    const config = configSignal();

    config.wordStack.push(config.currentTypedWord);
    config.currentTypedWord = ' ';
    configSignal.update((conf) => {
      conf.currentWordIndex++;

      return conf;
    });
  }
}
