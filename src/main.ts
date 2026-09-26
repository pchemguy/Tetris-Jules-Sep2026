const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');

if (ctx) {
  // Fill with a dark background color to test it renders
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  console.log('Tetris initialized: Canvas ready');
} else {
  console.error('Failed to get 2D context');
}
