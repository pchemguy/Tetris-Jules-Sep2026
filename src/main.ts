import { GameLoop } from './GameLoop.ts';
import { Matrix } from './Matrix.ts';
import { Piece } from './Piece.ts';
import { Renderer } from './Renderer.ts';
import { TetrominoType } from './constants.ts';

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

if (ctx) {
  const matrix = new Matrix();
  const renderer = new Renderer(ctx);

  // Set up a fake test state to verify rendering works
  const activePiece = new Piece(TetrominoType.T);
  activePiece.x = 3;
  activePiece.y = 5; // Will draw at y=3 due to HIDDEN_ROWS

  matrix.set(4, 19, TetrominoType.I);
  matrix.set(5, 19, TetrominoType.I);
  matrix.set(6, 19, TetrominoType.I);
  matrix.set(7, 19, TetrominoType.I);

  const update = () => {
    // Logic updates would go here
  };

  const draw = () => {
    renderer.clear();
    renderer.drawMatrix(matrix);
    renderer.drawPiece(activePiece);
  };

  const loop = new GameLoop(1000, update, draw);
  loop.start();

  console.log('Tetris game loop and renderer initialized');
} else {
  console.error('Failed to get 2D context');
}
