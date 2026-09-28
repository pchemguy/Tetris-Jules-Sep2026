// Standard SRS Wall Kick Data
// Arrays represent [dx, dy] to test in order when a basic rotation fails.
// Indexing: [oldRotationIndex][newRotationIndex]
export const WallKickData: Record<number, Record<number, [number, number][]>> = {
  // 0: 0->R(1), 1: R(1)->2, 2: 2->L(3), 3: L(3)->0
  0: { 1: [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]] },
  1: { 0: [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]], 2: [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]] },
  2: { 1: [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]], 3: [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]] },
  3: { 2: [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]], 0: [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]] },
};

// The 'I' piece has a special set of wall kick data
export const IWallKickData: Record<number, Record<number, [number, number][]>> = {
  0: { 1: [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]] },
  1: { 0: [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]], 2: [[0, 0], [-1, 0], [2, 0], [-1, 2], [2, -1]] },
  2: { 1: [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]], 3: [[0, 0], [2, 0], [-1, 0], [2, 1], [-1, -2]] },
  3: { 2: [[0, 0], [-2, 0], [1, 0], [-2, -1], [1, 2]], 0: [[0, 0], [1, 0], [-2, 0], [1, -2], [-2, 1]] },
};
