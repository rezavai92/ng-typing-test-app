import { WritableSignal } from '@angular/core';
import { IEditorViewConfig } from '../../components/test-editor/test-editor.component';
import { TestModel } from '../../../app-shared/models/TestModel';

export abstract class InputKeyHandleStrategy {
  constructor(testModel: TestModel) {}

  abstract handleKey(
    key: string,
    configSignal: WritableSignal<IEditorViewConfig>,
    callback: Function | null
  ): void;
}
