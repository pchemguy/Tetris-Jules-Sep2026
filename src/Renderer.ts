import { Matrix } from './Matrix.ts';
import { Piece } from './Piece.ts';
import { BLOCK_SIZE, TetrominoColors, GRID_WIDTH, GRID_HEIGHT, HIDDEN_ROWS } from './constants.ts';
import { TetrominoShapes } from './shapes.ts';

export class Renderer {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  public clear(): void {
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, GRID_WIDTH * BLOCK_SIZE, (GRID_HEIGHT - HIDDEN_ROWS) * BLOCK_SIZE);
  }

  public drawMatrix(matrix: Matrix): void {
    for (let y = HIDDEN_ROWS; y < GRID_HEIGHT; y++) {
      for (let x = 0; x < GRID_WIDTH; x++) {
        const cell = matrix.get(x, y);
        if (cell !== 0 && cell !== null) {
          this.drawBlock(x, y - HIDDEN_ROWS, TetrominoColors[cell]);
        }
      }
    }
  }

  public drawPiece(piece: Piece): void {
    const shape = piece.getShape();
    const color = TetrominoColors[piece.type];

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const drawY = piece.y + y - HIDDEN_ROWS;
          if (drawY >= 0) { // Don't draw if it's in the hidden spawn rows
            this.drawBlock(piece.x + x, drawY, color);
          }
        }
      }
    }
  }

  public drawGhostPiece(piece: Piece, matrix: Matrix): void {
    // Clone coordinates to simulate hard drop
    let ghostY = piece.y;
    while (!matrix.isCollision(piece.x, ghostY + 1, piece.getShape())) {
      ghostY++;
    }

    const shape = piece.getShape();
    const color = TetrominoColors[piece.type];

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const drawY = ghostY + y - HIDDEN_ROWS;
          if (drawY >= 0) {
            this.drawGhostBlock(piece.x + x, drawY, color);
          }
        }
      }
    }
  }

  private drawBlock(x: number, y: number, color: string): void {
    const px = x * BLOCK_SIZE;
    const py = y * BLOCK_SIZE;

    // Base color
    this.ctx.fillStyle = color;
    this.ctx.fillRect(px, py, BLOCK_SIZE, BLOCK_SIZE);

    // Bevel effect (simple)
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.fillRect(px, py, BLOCK_SIZE, 2);
    this.ctx.fillRect(px, py, 2, BLOCK_SIZE);

    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    this.ctx.fillRect(px, py + BLOCK_SIZE - 2, BLOCK_SIZE, 2);
    this.ctx.fillRect(px + BLOCK_SIZE - 2, py, 2, BLOCK_SIZE);
  }

  private drawGhostBlock(x: number, y: number, color: string): void {
    const px = x * BLOCK_SIZE;
    const py = y * BLOCK_SIZE;

    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 2;
    // Draw hollow block
    this.ctx.strokeRect(px + 1, py + 1, BLOCK_SIZE - 2, BLOCK_SIZE - 2);
  }

  // Draw a piece centered in a smaller preview canvas
  public static drawPreview(ctx: CanvasRenderingContext2D, type: import('./constants.ts').TetrominoType | null): void {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    // Clear background
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, width, height);

    if (!type) return;

    const shape = TetrominoShapes[type][0];
    const color = TetrominoColors[type];

    // Mini block size
    const bSize = 20;

    // Calculate bounding box of the shape to center it
    const shapeWidth = shape[0].length * bSize;
    const shapeHeight = shape.length * bSize;

    const offsetX = (width - shapeWidth) / 2;
    const offsetY = (height - shapeHeight) / 2;

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const px = offsetX + x * bSize;
          const py = offsetY + y * bSize;

          ctx.fillStyle = color;
          ctx.fillRect(px, py, bSize, bSize);

          ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.fillRect(px, py, bSize, 2);
          ctx.fillRect(px, py, 2, bSize);

          ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
          ctx.fillRect(px, py + bSize - 2, bSize, 2);
          ctx.fillRect(px + bSize - 2, py, 2, bSize);
        }
      }
    }
  }
}
