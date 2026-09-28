export const GRID_WIDTH = 10;
export const GRID_HEIGHT = 20;
export const HIDDEN_ROWS = 2; // Rows above the visible playfield
export const BLOCK_SIZE = 30; // Pixel size of each grid square

export const TetrominoType = {
  I: 'I',
  J: 'J',
  L: 'L',
  O: 'O',
  S: 'S',
  T: 'T',
  Z: 'Z'
} as const;

export type TetrominoType = typeof TetrominoType[keyof typeof TetrominoType];

export const TetrominoColors: Record<TetrominoType, string> = {
  [TetrominoType.I]: '#00FFFF', // Cyan
  [TetrominoType.J]: '#0000FF', // Blue
  [TetrominoType.L]: '#FFA500', // Orange
  [TetrominoType.O]: '#FFFF00', // Yellow
  [TetrominoType.S]: '#00FF00', // Green
  [TetrominoType.T]: '#800080', // Purple
  [TetrominoType.Z]: '#FF0000'  // Red
};
