import { GameLoop } from './GameLoop.ts';
import { Matrix } from './Matrix.ts';
import { Piece } from './Piece.ts';
import { Renderer } from './Renderer.ts';
import { TetrominoType, TetrominoColors } from './constants.ts';
import { InputHandler } from './InputHandler.ts';

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

if (ctx) {
  const matrix = new Matrix();
  const renderer = new Renderer(ctx);
  const input = new InputHandler();

  let isGameOver = false;

  // 7-bag randomizer
  let bag: TetrominoType[] = [];

  const fillBag = () => {
    const types = Object.values(TetrominoType);
    // Fisher-Yates shuffle
    for (let i = types.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [types[i], types[j]] = [types[j], types[i]];
    }
    bag = types;
  };

  const getNextPiece = () => {
    if (bag.length === 0) fillBag();
    const type = bag.pop()!;
    return new Piece(type);
  };

  // Hold mechanism state
  let heldPieceType: TetrominoType | null = null;
  let canHold = true;

  // Game state
  let score = 0;
  let level = 1;
  let totalLines = 0;

  // Starting state
  let activePiece = getNextPiece();

  const updateLevelAndGravity = () => {
    // Level up every 10 lines
    level = Math.floor(totalLines / 10) + 1;
    // Calculate new gravity (tickRate in ms). E.g., drops by 50ms per level, min 100ms.
    const newTickRate = Math.max(100, 1000 - ((level - 1) * 50));
    loop.setTickRate(newTickRate);
  };

  const lockPiece = () => {
    const shape = activePiece.getShape();
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c] !== 0) {
          matrix.set(activePiece.x + c, activePiece.y + r, activePiece.type);
        }
      }
    }

    // Check for cleared lines
    const linesCleared = matrix.checkLines();
    if (linesCleared > 0) {
      totalLines += linesCleared;

      // Calculate score based on classic Tetris scoring system
      let points = 0;
      switch (linesCleared) {
        case 1: points = 100 * level; break;
        case 2: points = 300 * level; break;
        case 3: points = 500 * level; break;
        case 4: points = 800 * level; break;
      }
      score += points;
      updateLevelAndGravity();
      updateDOM();
    }

    // Spawn new piece
    activePiece = getNextPiece();
    canHold = true; // Reset hold lock

    // Game Over check: if the new piece immediately collides
    if (matrix.isCollision(activePiece.x, activePiece.y, activePiece.getShape())) {
      isGameOver = true;
      console.log('GAME OVER!');
    }
  };

  // Input mapping
  input.on('HOLD', () => {
    if (isGameOver || !canHold) return;

    const currentType = activePiece.type;

    if (heldPieceType === null) {
      // First time holding: put current in hold, spawn next
      heldPieceType = currentType;
      activePiece = getNextPiece();
    } else {
      // Swap current with held
      const temp = heldPieceType;
      heldPieceType = currentType;
      activePiece = new Piece(temp);
    }

    canHold = false;
  });

  input.on('LEFT', () => {
    if (isGameOver) return;
    activePiece.move(-1, 0, matrix);
  });

  input.on('RIGHT', () => {
    if (isGameOver) return;
    activePiece.move(1, 0, matrix);
  });

  input.on('DOWN', () => {
    if (isGameOver) return;
    if (activePiece.move(0, 1, matrix)) {
      score += 1; // 1 point per soft drop cell
      updateDOM();
    }
  });

  input.on('ROTATE', () => {
    if (isGameOver) return;
    activePiece.attemptRotate(matrix);
  });

  input.on('DROP', () => {
    if (isGameOver) return;
    const startY = activePiece.y;
    activePiece.hardDrop(matrix);
    const cellsDropped = activePiece.y - startY;
    score += (cellsDropped * 2); // 2 points per hard drop cell
    updateDOM();
    lockPiece();
  });

  const scoreEl = document.getElementById('score')!;
  const levelEl = document.getElementById('level')!;
  const linesEl = document.getElementById('lines')!;
  const holdBox = document.getElementById('hold-box')!;
  const nextBox = document.getElementById('next-box')!;

  const updateDOM = () => {
    scoreEl.textContent = score.toString();
    levelEl.textContent = level.toString();
    linesEl.textContent = totalLines.toString();

    // Render Next Queue (HTML representation for simplicity, alternatively could use multiple canvases)
    nextBox.innerHTML = '';
    const nextPreview = document.createElement('div');
    nextPreview.className = 'queue-item';
    // Just showing the immediate next piece type for now
    if (bag.length === 0) fillBag();
    nextPreview.textContent = bag[bag.length - 1];
    nextPreview.style.color = TetrominoColors[bag[bag.length - 1]];
    nextBox.appendChild(nextPreview);

    // Render Hold Queue
    holdBox.innerHTML = '';
    if (heldPieceType) {
      const holdPreview = document.createElement('div');
      holdPreview.className = 'queue-item';
      holdPreview.textContent = heldPieceType;
      holdPreview.style.color = TetrominoColors[heldPieceType];
      holdBox.appendChild(holdPreview);
    }
  };

  // Initial DOM update
  updateDOM();

  const update = () => {
    if (isGameOver) return;

    // Gravity tick
    const moved = activePiece.move(0, 1, matrix);
    if (!moved) {
      lockPiece();
    }
  };

  const draw = () => {
    renderer.clear();
    renderer.drawMatrix(matrix);
    if (!isGameOver) {
      renderer.drawGhostPiece(activePiece, matrix);
      renderer.drawPiece(activePiece);
    }
  };

  // 1000ms = 1 second per drop tick
  const loop = new GameLoop(1000, update, draw);
  loop.start();

  console.log('Tetris initialized: Input and Movement active');
} else {
  console.error('Failed to get 2D context');
}
