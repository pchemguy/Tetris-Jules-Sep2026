export type Action = 'LEFT' | 'RIGHT' | 'DOWN' | 'ROTATE' | 'DROP' | 'HOLD';

export class InputHandler {
  private keyMap: Record<string, Action> = {
    'ArrowLeft': 'LEFT',
    'ArrowRight': 'RIGHT',
    'ArrowDown': 'DOWN',
    'ArrowUp': 'ROTATE',
    'x': 'ROTATE',
    'X': 'ROTATE',
    ' ': 'DROP',
    'c': 'HOLD',
    'C': 'HOLD',
  };

  private callbacks: Partial<Record<Action, () => void>> = {};

  constructor() {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  public on(action: Action, callback: () => void): void {
    this.callbacks[action] = callback;
  }

  public destroy(): void {
    window.removeEventListener('keydown', this.handleKeyDown.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent): void {
    // Prevent default scrolling for game keys
    if (this.keyMap[event.key]) {
      event.preventDefault();
      const action = this.keyMap[event.key];
      if (this.callbacks[action]) {
        this.callbacks[action]!();
      }
    }
  }
}
