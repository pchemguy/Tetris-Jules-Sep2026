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
});
