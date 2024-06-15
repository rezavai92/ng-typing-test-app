import { EditorKeys } from '../../../app-shared/constants/keyboardData';
import { testModels } from '../../../app-shared/constants/testModelData';
import { TestModel } from '../../../app-shared/models/TestModel';
import { BackspaceKeyHandleStrategy } from '../strategies/BackspaceKeyHandleStrategy';
import { CharacterKeyHandleStrategy } from '../strategies/CharacterKeyHandleStrategy';
import { EnterKeyHandleStrategy } from '../strategies/EnterKeyHandleStrategy';
import { InputKeyHandleStrategy } from '../strategies/InputKeyHandleStrategy';
import { SpaceKeyHandleStrategy } from '../strategies/SpaceKeyHandleStrategy';

export class InputKeyHandlerStrategyContext {
  private _strategy!: InputKeyHandleStrategy | undefined;

  constructor(key: EditorKeys, public testModel: TestModel) {
    this._strategy = this.selectStrategy(key);
  }

  selectStrategy(key: string) {
    switch (key) {
      case EditorKeys.Enter:
        return new EnterKeyHandleStrategy(this.testModel);
      case EditorKeys.Space:
        return new SpaceKeyHandleStrategy(this.testModel);
      case EditorKeys.Backspace:
        return new BackspaceKeyHandleStrategy(this.testModel);
      case EditorKeys.SingleChar:
        return new CharacterKeyHandleStrategy(this.testModel);
      default:
        return undefined;
    }
  }

  getStrategy() {
    return this._strategy;
  }
}
