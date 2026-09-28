import { GRID_WIDTH, GRID_HEIGHT, TetrominoType } from './constants.ts';
import type { ShapeMatrix } from './shapes.ts';

export class Matrix {
  public grid: (TetrominoType | 0)[][];

  constructor() {
    this.grid = Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill(0));
  }

  public get(x: number, y: number): TetrominoType | 0 | null {
    if (this.isOutOfBounds(x, y)) {
      return null;
    }
    return this.grid[y][x];
  }

  public set(x: number, y: number, value: TetrominoType | 0): boolean {
    if (this.isOutOfBounds(x, y)) {
      return false;
    }
    this.grid[y][x] = value;
    return true;
  }

  public clear(): void {
    this.grid = Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill(0));
  }

  public isOutOfBounds(x: number, y: number): boolean {
    return x < 0 || x >= GRID_WIDTH || y >= GRID_HEIGHT || y < 0; // Negative y is out of bounds for Matrix itself, but pieces can spawn there. Collision logic handles this.
  }

  public checkLines(): number {
    let linesCleared = 0;

    // Iterate from bottom to top
    for (let y = GRID_HEIGHT - 1; y >= 0; y--) {
      let isFull = true;
      for (let x = 0; x < GRID_WIDTH; x++) {
        if (this.grid[y][x] === 0) {
          isFull = false;
          break;
        }
      }

      if (isFull) {
        linesCleared++;
        // Remove the row and unshift a new empty row at the top
        this.grid.splice(y, 1);
        this.grid.unshift(Array(GRID_WIDTH).fill(0));
        // We removed a row, so the row that shifted down into index 'y'
        // needs to be checked in the next iteration. Increment y to counteract the decrement.
        y++;
      }
    }

    return linesCleared;
  }

  public isCollision(pieceX: number, pieceY: number, shape: ShapeMatrix): boolean {
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c] !== 0) {
          const targetX = pieceX + c;
          const targetY = pieceY + r;

          // Pieces can be above the board (negative Y), that's fine as long as they don't hit something there.
          // Wait, actually, if Y < 0 we don't check for collision with the board, but we DO check bounds on X
          if (targetX < 0 || targetX >= GRID_WIDTH || targetY >= GRID_HEIGHT) {
            return true; // Hit a wall or the floor
          }

          if (targetY >= 0 && this.grid[targetY][targetX] !== 0) {
             return true; // Hit an existing block
          }
        }
      }
    }
    return false;
  }
}
