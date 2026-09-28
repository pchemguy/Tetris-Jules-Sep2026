import { GameLoop } from './GameLoop.ts';
import { Matrix } from './Matrix.ts';
import { Piece } from './Piece.ts';
import { Renderer } from './Renderer.ts';
import { TetrominoType } from './constants.ts';
import { InputHandler } from './InputHandler.ts';

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

if (ctx) {
  const matrix = new Matrix();
  const renderer = new Renderer(ctx);
  const input = new InputHandler();

  // Starting state
  let activePiece = new Piece(TetrominoType.T);

  // Add some floor blocks for testing collision visually
  matrix.set(4, 19, TetrominoType.I);
  matrix.set(5, 19, TetrominoType.I);
  matrix.set(6, 19, TetrominoType.I);

  // Input mapping
  input.on('LEFT', () => {
    activePiece.move(-1, 0, matrix);
  });

  input.on('RIGHT', () => {
    activePiece.move(1, 0, matrix);
  });

  input.on('DOWN', () => {
    activePiece.move(0, 1, matrix);
  });

  input.on('ROTATE', () => {
    activePiece.attemptRotate(matrix);
  });

  const update = () => {
    // Gravity tick
    const moved = activePiece.move(0, 1, matrix);
    if (!moved) {
      // Locking logic will go here in Phase 5
      // For now, reset to top to avoid crashing/halting
      activePiece = new Piece(TetrominoType.T);
    }
  };

  const draw = () => {
    renderer.clear();
    renderer.drawMatrix(matrix);
    renderer.drawPiece(activePiece);
  };

  // 1000ms = 1 second per drop tick
  const loop = new GameLoop(1000, update, draw);
  loop.start();

  console.log('Tetris initialized: Input and Movement active');
} else {
  console.error('Failed to get 2D context');
}
