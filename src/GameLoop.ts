export class GameLoop {
  private lastTime: number = 0;
  private accumulator: number = 0;
  private tickRate: number; // MS per game tick (gravity)
  private isRunning: boolean = false;
  private animationFrameId: number | null = null;

  public updateFn: () => void;
  public renderFn: () => void;

  constructor(tickRate: number, updateFn: () => void, renderFn: () => void) {
    this.tickRate = tickRate;
    this.updateFn = updateFn;
    this.renderFn = renderFn;
  }

  public start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.animationFrameId = requestAnimationFrame((time) => this.loop(time));
  }

  public stop(): void {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private loop(time: number): void {
    if (!this.isRunning) return;

    const deltaTime = time - this.lastTime;
    this.lastTime = time;
    this.accumulator += deltaTime;

    // Fixed timestep logic update
    while (this.accumulator >= this.tickRate) {
      this.updateFn();
      this.accumulator -= this.tickRate;
    }

    // Render as fast as possible (up to monitor refresh rate, usually 60fps)
    this.renderFn();

    this.animationFrameId = requestAnimationFrame((t) => this.loop(t));
  }
}
