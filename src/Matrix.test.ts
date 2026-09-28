import { describe, it, expect, beforeEach } from 'vitest';
import { Matrix } from './Matrix.ts';
import { TetrominoType, GRID_WIDTH, GRID_HEIGHT } from './constants.ts';
import { TetrominoShapes } from './shapes.ts';

describe('Matrix', () => {
  let matrix: Matrix;

  beforeEach(() => {
    matrix = new Matrix();
  });

  it('initializes with a clean grid', () => {
    expect(matrix.grid.length).toBe(GRID_HEIGHT);
    expect(matrix.grid[0].length).toBe(GRID_WIDTH);
    expect(matrix.get(0, 0)).toBe(0);
  });

  it('can set and get values', () => {
    matrix.set(5, 5, TetrominoType.T);
    expect(matrix.get(5, 5)).toBe(TetrominoType.T);
    expect(matrix.get(0, 0)).toBe(0);
  });

  it('returns null for out of bounds get', () => {
    expect(matrix.get(-1, 0)).toBeNull();
    expect(matrix.get(0, -1)).toBeNull();
    expect(matrix.get(GRID_WIDTH, 0)).toBeNull();
    expect(matrix.get(0, GRID_HEIGHT)).toBeNull();
  });

  it('can clear the matrix', () => {
    matrix.set(0, 0, TetrominoType.I);
    matrix.clear();
    expect(matrix.get(0, 0)).toBe(0);
  });

  it('detects wall collisions correctly', () => {
    const square = TetrominoShapes[TetrominoType.O][0];

    // Left wall
    expect(matrix.isCollision(-1, 0, square)).toBe(true);
    // Inside bounds
    expect(matrix.isCollision(0, 0, square)).toBe(false);
    // Right wall (square is width 2, so width - 1 should collide)
    expect(matrix.isCollision(GRID_WIDTH - 1, 0, square)).toBe(true);
    // Bottom floor (square is height 2)
    expect(matrix.isCollision(0, GRID_HEIGHT - 1, square)).toBe(true);
  });

  it('detects collisions with existing blocks', () => {
    const square = TetrominoShapes[TetrominoType.O][0];
    matrix.set(5, 10, TetrominoType.I);
    matrix.set(6, 10, TetrominoType.I);

    // Collides exactly where the blocks are
    expect(matrix.isCollision(5, 9, square)).toBe(true);
    // Does not collide one space above
    expect(matrix.isCollision(5, 8, square)).toBe(false);
  });
});
