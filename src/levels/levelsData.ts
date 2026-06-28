import { Level } from '../types';
import { chapter1Levels } from './chapter1';
import { chapter2Levels } from './chapter2';
import { chapter3Levels } from './chapter3';

export const levels: Level[] = [
  ...chapter1Levels,
  ...chapter2Levels,
  ...chapter3Levels
];
