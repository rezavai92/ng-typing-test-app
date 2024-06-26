import { Injectable } from '@angular/core';
import { difficultyLevel } from '../../app-type-test-artifacts/types/common.types';
import {
  ITestModel,
  ITestModelResult,
  ITestParagraph,
} from './ITestModel.interface';

export class TestModel {
  Paragraph: ITestParagraph;
  TestTime!: number;
  Difficulty!: difficultyLevel;
  Status!: 'running' | 'finished' | 'waiting';
  Result!: ITestModelResult;
  Mode!: 'basic' | 'pro' | 'mobile';
  constructor(
    paragraph: ITestParagraph,

    difficulty: difficultyLevel
  ) {
    this.Paragraph = paragraph;

    this.Difficulty = difficulty;
    this.Status = 'waiting';
    this.Mode = 'basic';
  }
}
