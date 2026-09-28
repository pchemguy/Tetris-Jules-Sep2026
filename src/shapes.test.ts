import { describe, it, expect } from 'vitest';
import { TetrominoShapes } from './shapes.ts';
import { TetrominoType } from './constants.ts';

describe('TetrominoShapes', () => {
  it('should have 7 shapes defined', () => {
    expect(Object.keys(TetrominoShapes).length).toBe(7);
  });

  it('each shape should have 4 rotation states', () => {
    Object.values(TetrominoType).forEach((type) => {
      expect(TetrominoShapes[type].length).toBe(4);
    });
  });

  it('I shape should be a 4x4 grid', () => {
    const iShape = TetrominoShapes[TetrominoType.I][0];
    expect(iShape.length).toBe(4);
    expect(iShape[0].length).toBe(4);
  });

  it('T shape should be a 3x3 grid', () => {
    const tShape = TetrominoShapes[TetrominoType.T][0];
    expect(tShape.length).toBe(3);
    expect(tShape[0].length).toBe(3);
  });
});
