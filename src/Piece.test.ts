import { describe, it, expect } from 'vitest';
import { Piece } from './Piece.ts';
import { TetrominoType, GRID_WIDTH } from './constants.ts';

describe('Piece', () => {
  it('initializes correctly', () => {
    const piece = new Piece(TetrominoType.T);
    expect(piece.type).toBe(TetrominoType.T);
    expect(piece.rotationIndex).toBe(0);
    expect(piece.y).toBe(0);

    const shape = piece.getShape();
    expect(piece.x).toBe(Math.floor(GRID_WIDTH / 2) - Math.floor(shape[0].length / 2));
  });

  it('rotates correctly', () => {
    const piece = new Piece(TetrominoType.T);
    expect(piece.rotationIndex).toBe(0);
    piece.rotate();
    expect(piece.rotationIndex).toBe(1);
    piece.rotate();
    piece.rotate();
    piece.rotate();
    expect(piece.rotationIndex).toBe(0); // Wrapped around
  });

  it('moves if no collision', async () => {
    // Dynamic import to avoid test setup issues
    const { Matrix } = await import('./Matrix.ts');
    const matrix = new Matrix();
    const piece = new Piece(TetrominoType.O);

    piece.x = 5;
    piece.y = 5;

    const success = piece.move(1, 0, matrix);
    expect(success).toBe(true);
    expect(piece.x).toBe(6);
  });

  it('blocks movement on collision', async () => {
    const { Matrix } = await import('./Matrix.ts');
    const matrix = new Matrix();
    const piece = new Piece(TetrominoType.O); // 2x2 square

    // Move to right edge
    piece.x = GRID_WIDTH - 2;
    piece.y = 5;

    // Moving right should hit the wall and return false
    const success = piece.move(1, 0, matrix);
    expect(success).toBe(false);
    expect(piece.x).toBe(GRID_WIDTH - 2); // Did not move
  });
});
