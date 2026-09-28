import { GameLoop } from './GameLoop.ts';
import { Matrix } from './Matrix.ts';
import { Piece } from './Piece.ts';
import { Renderer } from './Renderer.ts';
import { TetrominoType } from './constants.ts';
import { InputHandler } from './InputHandler.ts';
import { AudioManager } from './AudioManager.ts';

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

if (ctx) {
  const matrix = new Matrix();
  const renderer = new Renderer(ctx);
  const input = new InputHandler();
  const audio = new AudioManager();

  type GameState = 'MENU' | 'PLAYING' | 'PAUSED' | 'GAMEOVER';
  let currentState: GameState = 'MENU';

  // 7-bag randomizer
  let bag: TetrominoType[] = [];

  const ensureBagHasPieces = () => {
    while (bag.length < 4) {
      const types = Object.values(TetrominoType);
      // Fisher-Yates shuffle
      for (let i = types.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [types[i], types[j]] = [types[j], types[i]];
      }
      bag = bag.concat(types);
    }
  };

  const getNextPiece = () => {
    ensureBagHasPieces();
    const type = bag.shift()!;
    return new Piece(type);
  };

  // Hold mechanism state
  let heldPieceType: TetrominoType | null = null;
  let canHold = true;

  // Game state
  let score = 0;
  let level = 1;
  let totalLines = 0;
  let highScore = parseInt(localStorage.getItem('tetrisHighScore') || '0', 10);

  // Starting state
  let activePiece = getNextPiece();

  const resetGame = () => {
    matrix.clear();
    score = 0;
    level = 1;
    totalLines = 0;
    heldPieceType = null;
    canHold = true;
    bag = [];
    activePiece = getNextPiece();
    updateLevelAndGravity();
    updateDOM();
  };

  const updateLevelAndGravity = () => {
    // Level up every 10 lines
    level = Math.floor(totalLines / 10) + 1;
    // Calculate new gravity (tickRate in ms). E.g., drops by 50ms per level, min 100ms.
    const newTickRate = Math.max(100, 1000 - ((level - 1) * 50));
    loop.setTickRate(newTickRate);
  };

  const lockPiece = () => {
    audio.playSound('LOCK');
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

      if (linesCleared === 4) {
        audio.playSound('TETRIS');
      } else {
        audio.playSound('CLEAR');
      }

      updateLevelAndGravity();
      updateDOM();
    }

    // Spawn new piece
    activePiece = getNextPiece();
    canHold = true; // Reset hold lock

    // Game Over check: if the new piece immediately collides
    if (matrix.isCollision(activePiece.x, activePiece.y, activePiece.getShape())) {
      currentState = 'GAMEOVER';
      audio.stopMusic();
      audio.playSound('GAMEOVER');
      if (score > highScore) {
        highScore = score;
        localStorage.setItem('tetrisHighScore', highScore.toString());
      }
      updateDOM();
    }
  };

  // Input mapping
  input.on('HOLD', () => {
    if (currentState !== 'PLAYING' || !canHold) return;

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
    if (currentState !== 'PLAYING') return;
    if (activePiece.move(-1, 0, matrix)) audio.playSound('MOVE');
  });

  input.on('RIGHT', () => {
    if (currentState !== 'PLAYING') return;
    if (activePiece.move(1, 0, matrix)) audio.playSound('MOVE');
  });

  input.on('DOWN', () => {
    if (currentState !== 'PLAYING') return;
    if (activePiece.move(0, 1, matrix)) {
      score += 1; // 1 point per soft drop cell
      audio.playSound('MOVE');
      updateDOM();
    }
  });

  input.on('ROTATE', () => {
    if (currentState !== 'PLAYING') return;
    if (activePiece.attemptRotate(matrix)) audio.playSound('ROTATE');
  });

  input.on('DROP', () => {
    if (currentState !== 'PLAYING') return;
    const startY = activePiece.y;
    activePiece.hardDrop(matrix);
    const cellsDropped = activePiece.y - startY;
    score += (cellsDropped * 2); // 2 points per hard drop cell
    audio.playSound('DROP');
    updateDOM();
    lockPiece();
  });

  input.on('PAUSE', () => {
    if (currentState === 'PLAYING') {
      currentState = 'PAUSED';
      audio.stopMusic();
      updateDOM();
    } else if (currentState === 'PAUSED') {
      currentState = 'PLAYING';
      audio.playMusic();
      updateDOM();
    }
  });

  const scoreEl = document.getElementById('score')!;
  const levelEl = document.getElementById('level')!;
  const linesEl = document.getElementById('lines')!;
  const holdCanvas = document.getElementById('hold-canvas') as HTMLCanvasElement;
  const holdCtx = holdCanvas.getContext('2d')!;
  const nextCanvases = [
    document.getElementById('next-canvas-0') as HTMLCanvasElement,
    document.getElementById('next-canvas-1') as HTMLCanvasElement,
    document.getElementById('next-canvas-2') as HTMLCanvasElement
  ];
  const nextCtxs = nextCanvases.map(c => c.getContext('2d')!);

  const menuOverlay = document.getElementById('menu-overlay')!;
  const pauseOverlay = document.getElementById('pause-overlay')!;
  const gameOverOverlay = document.getElementById('game-over-overlay')!;
  const highScoreMenuEl = document.getElementById('high-score-menu')!;
  const finalScoreEl = document.getElementById('final-score')!;

  document.getElementById('btn-start')!.addEventListener('click', () => {
    resetGame();
    currentState = 'PLAYING';
    audio.playMusic();
    updateDOM();
  });

  document.getElementById('btn-resume')!.addEventListener('click', () => {
    currentState = 'PLAYING';
    audio.playMusic();
    updateDOM();
  });

  const handleRestart = () => {
    resetGame();
    currentState = 'PLAYING';
    audio.playMusic();
    updateDOM();
  };

  document.getElementById('btn-restart-pause')!.addEventListener('click', handleRestart);
  document.getElementById('btn-restart-over')!.addEventListener('click', handleRestart);

  const updateDOM = () => {
    scoreEl.textContent = score.toString();
    levelEl.textContent = level.toString();
    linesEl.textContent = totalLines.toString();

    // Overlays
    menuOverlay.classList.toggle('hidden', currentState !== 'MENU');
    pauseOverlay.classList.toggle('hidden', currentState !== 'PAUSED');
    gameOverOverlay.classList.toggle('hidden', currentState !== 'GAMEOVER');

    if (currentState === 'MENU') {
      highScoreMenuEl.textContent = highScore.toString();
    } else if (currentState === 'GAMEOVER') {
      finalScoreEl.textContent = score.toString();
    }

    // Render Next Queue
    ensureBagHasPieces();
    for (let i = 0; i < 3; i++) {
      Renderer.drawPreview(nextCtxs[i], bag[i]);
    }

    // Render Hold Queue
    Renderer.drawPreview(holdCtx, heldPieceType);
  };

  // Initial DOM update
  updateDOM();

  const update = () => {
    if (currentState !== 'PLAYING') return;

    // Gravity tick
    const moved = activePiece.move(0, 1, matrix);
    if (!moved) {
      lockPiece();
    }
  };

  const draw = () => {
    renderer.clear();
    renderer.drawMatrix(matrix);
    if (currentState === 'PLAYING') {
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
