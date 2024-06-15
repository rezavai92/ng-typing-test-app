import { WritableSignal } from '@angular/core';
import { INormalViewConfig } from '../../components/test-editor/test-editor.component';
import { InputKeyHandleStrategy } from './InputKeyHandleStrategy';

export class CharacterKeyHandleStrategy extends InputKeyHandleStrategy {
  override handleKey(
    key: string,
    configSignal: WritableSignal<INormalViewConfig>,
    callback: Function | null
  ): void {
    let config = configSignal();

    let newConfig = {
      ...config,
      currentTypedWord: config.currentTypedWord + key,
    };

    configSignal.update((config) => JSON.parse(JSON.stringify(newConfig)));
  }
}
