import { TetrominoType, GRID_WIDTH } from './constants.ts';
import { TetrominoShapes } from './shapes.ts';
import type { ShapeMatrix } from './shapes.ts';
import { WallKickData, IWallKickData } from './srs.ts';

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
    const oldRotation = this.rotationIndex;
    this.rotate();
    const newRotation = this.rotationIndex;

    const shape = this.getShape();

    // The 'O' piece doesn't need to wall kick, it just rotates in place (effectively doing nothing)
    if (this.type === TetrominoType.O) {
      if (!matrix.isCollision(this.x, this.y, shape)) {
        return true;
      }
      this.rotationIndex = oldRotation;
      return false;
    }

    const kickData = this.type === TetrominoType.I ? IWallKickData : WallKickData;
    const tests = kickData[oldRotation][newRotation];

    for (const [dx, dy] of tests) {
      // Note: SRS y-axis goes up in standard docs, but our grid y-axis goes down.
      // So we flip the sign of dy to match our coordinate system (y grows downwards).
      const testX = this.x + dx;
      const testY = this.y - dy;

      if (!matrix.isCollision(testX, testY, shape)) {
        this.x = testX;
        this.y = testY;
        return true; // Wall kick successful
      }
    }

    // All kicks failed, revert rotation
    this.rotationIndex = oldRotation;
    return false;
  }

  public hardDrop(matrix: import('./Matrix.ts').Matrix): void {
    while (!matrix.isCollision(this.x, this.y + 1, this.getShape())) {
      this.y++;
    }
  }
}
