import { ITestModel } from '../models/ITestModel.interface';
import { TestModel } from '../models/TestModel';
import {
  easyParagraph,
  hardParagraph,
  mediumParagraph,
} from './testParagraphs';

export const testModels: TestModel[] = [
  new TestModel(easyParagraph, 'easy'),
  new TestModel(mediumParagraph, 'medium'),
  new TestModel(hardParagraph, 'hard'),
];
