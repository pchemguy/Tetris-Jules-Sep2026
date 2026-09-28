import { TetrominoType, GRID_WIDTH } from './constants.ts';
import { TetrominoShapes } from './shapes.ts';
import type { ShapeMatrix } from './shapes.ts';

export class Piece {
  public x: number;
  public y: number;
  public type: TetrominoType;
  public rotationIndex: number;

  constructor(type: TetrominoType) {
    this.type = type;
    this.rotationIndex = 0;

    // Spawn centered horizontally. Some pieces might need slight adjustments in a full implementation,
    // but standard SRS spawns them centered.
    const shape = this.getShape();
    this.x = Math.floor(GRID_WIDTH / 2) - Math.floor(shape[0].length / 2);
    this.y = 0; // Spawn at the top
  }

  public getShape(): ShapeMatrix {
    return TetrominoShapes[this.type][this.rotationIndex];
  }

  public rotate(): void {
    // Basic rotation without wall kicks
    this.rotationIndex = (this.rotationIndex + 1) % 4;
  }

  public move(dx: number, dy: number, matrix: import('./Matrix.ts').Matrix): boolean {
    if (!matrix.isCollision(this.x + dx, this.y + dy, this.getShape())) {
      this.x += dx;
      this.y += dy;
      return true; // Moved successfully
    }
    return false; // Collision prevented movement
  }

  public attemptRotate(matrix: import('./Matrix.ts').Matrix): boolean {
    const originalRotation = this.rotationIndex;
    this.rotate();

    if (!matrix.isCollision(this.x, this.y, this.getShape())) {
      return true; // Rotated successfully
    }

    // Basic rotation failed, revert (Wall kicks will be implemented later)
    this.rotationIndex = originalRotation;
    return false;
  }
}
