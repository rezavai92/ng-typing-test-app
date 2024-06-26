import { difficultyLevel } from '../types/common.types';

export interface ITestModelFilter {
  difficultyLevel: difficultyLevel;
  duration: number;
  mode: 'basic' | 'pro' | 'mobile';
}
