export type SoundEffect = 'MOVE' | 'ROTATE' | 'DROP' | 'LOCK' | 'CLEAR' | 'TETRIS' | 'GAMEOVER';

export class AudioManager {
  private muted: boolean = false;

  constructor() {
    // In a real game, we would load HTMLAudioElements here.
    // e.g. this.sounds['MOVE'] = new Audio('./assets/move.mp3');
  }

  public toggleMute(): void {
    this.muted = !this.muted;
    console.log(`Audio is now ${this.muted ? 'MUTED' : 'UNMUTED'}`);
  }

  public playSound(effect: SoundEffect): void {
    if (this.muted) return;

    // Simulate playing sound
    console.log(`[Audio] Playing SFX: ${effect}`);
  }

  public playMusic(): void {
    if (this.muted) return;
    console.log(`[Audio] Playing Background Music`);
  }

  public stopMusic(): void {
    console.log(`[Audio] Stopping Background Music`);
  }
}
