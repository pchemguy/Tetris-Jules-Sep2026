# Specification: Classic Tetris (Browser + Electron)

## 1. Overview

This specification details the requirements and architecture for a classic
Tetris clone. The game is designed primarily as a web application running in a
modern browser, with an optional Electron wrapper for distribution as a native
desktop application (Windows, macOS, Linux).

## 2. Core Gameplay Mechanics

### 2.1 The Matrix (Playfield)

- **Dimensions**: 10 columns by 20 rows.
- **Hidden Rows**: 2 hidden rows at the top for tetromino spawning (often
  termed the "vanish zone").
- **Grid**: Standard square grid where each block occupies one grid cell.

### 2.2 Tetrominoes

- The game will feature the standard 7 Tetromino shapes: I, J, L, O, S, T,
  and Z.
- **Colors**:
  - I: Cyan
  - J: Blue
  - L: Orange
  - O: Yellow
  - S: Green
  - T: Purple
  - Z: Red
- **Spawning**:
  - Pieces spawn horizontally centered.
  - The 'O' and 'I' pieces spawn exactly in the middle columns.
  - Other pieces spawn in the middle, biased to the left if the grid width
    is even.
- **Randomizer**: "7-bag" randomizer system to ensure a relatively even
  distribution of pieces (each sequence of 7 pieces contains one of each
  type).

### 2.3 Movement and Rotation

- **Movement**: Left, Right, Soft Drop (moves piece down faster), Hard Drop
  (instantly drops and locks the piece).
- **Rotation**: Standard Super Rotation System (SRS) for predictable rotation
  behavior and wall kicks.
- **Lock Delay**: When a piece touches the ground or other blocks, a brief
  lock delay (e.g., 500ms) occurs before it solidifies, allowing for
  last-minute slides or rotations.

### 2.4 Ghost Piece

- A faint representation of the active piece is shown at the bottom of the
  matrix where it would land if a Hard Drop were performed.

### 2.5 Hold Mechanism

- The player can press a key to swap the current active piece with a piece in
  the "Hold" queue.
- If the Hold queue is empty, the active piece is moved to Hold, and the next
  piece from the sequence becomes active.
- A piece can only be swapped once per drop (cannot hold back-to-back).

### 2.6 Line Clearing and Scoring

- **Line Clear**: A row is cleared when all 10 cells in that row are filled.
- **Gravity**: Blocks above cleared lines drop down by the number of cleared
  lines.
- **Scoring System**: Based on the classic system, multiplied by the current
  level.
  - Single: 100 × Level
  - Double: 300 × Level
  - Triple: 500 × Level
  - Tetris (4 lines): 800 × Level
  - Soft Drop: 1 point per cell
  - Hard Drop: 2 points per cell

### 2.7 Level Progression

- **Level up**: The player levels up every 10 lines cleared.
- **Speed**: As the level increases, the base drop speed (gravity) increases,
  leaving less time to react.

### 2.8 Game Over State

- The game ends when a newly spawned piece cannot be placed in the matrix
  because existing blocks are in the way (often called "Block Out" or
  "Lock Out").

## 3. Controls

### 3.1 Keyboard Inputs (Default)

- **Arrow Left / Arrow Right**: Move piece horizontally.
- **Arrow Down**: Soft Drop.
- **Spacebar**: Hard Drop.
- **Arrow Up / X**: Rotate Clockwise.
- **Z / Ctrl**: Rotate Counter-Clockwise.
- **C / Shift**: Hold piece.
- **Esc / P**: Pause game.
- **M**: Mute/Unmute sound.

## 4. UI/UX Design

### 4.1 Layout

- **Center**: The main 10x20 playfield.
- **Left Panel**:
  - "Hold" piece box.
  - Current Score, Level, and Lines cleared.
- **Right Panel**:
  - "Next" piece queue (shows the upcoming 3 to 5 pieces).

### 4.2 Screens

- **Main Menu**: Play button, Settings (controls, volume), High Scores.
- **Gameplay**: The active game interface.
- **Pause Menu**: Resume, Restart, Quit to Menu.
- **Game Over Screen**: Final score, level achieved, "Play Again" button.

### 4.3 Audio

- **Music**: Classic 8-bit style background track, with the option to loop
  seamlessly.
- **SFX**: Sound effects for piece movement, rotation, locking, line clears
  (distinct sounds for single/double/triple and a special sound for a
  Tetris), and Game Over.

## 5. Technical Architecture

### 5.1 Web Application (Browser)

- **Frontend Stack**: HTML5, CSS3, JavaScript/TypeScript.
- **Rendering Engine**: HTML5 `<canvas>` API for efficient 2D rendering.
  Alternatively, WebGL or a lightweight framework like PixiJS could be used
  for advanced effects.
- **State Management**: A predictable state container pattern (Redux-style or
  simple Class properties) to manage game state (matrix, score, level,
  active piece).
- **Game Loop**: `requestAnimationFrame` for a smooth 60 FPS rendering cycle,
  decoupled from the game logic tick rate.
- **Storage**: `localStorage` to save high scores, user preferences (volume,
  custom controls).

### 5.2 Desktop Application (Electron)

- **Wrapper**: Electron will load the web application (either local files or
  a bundled React/Vue/Vanilla build).
- **Window Management**:
  - Fixed aspect ratio or responsive resizing that maintains the playfield
    proportions.
  - Default size: e.g., 800x600.
  - Custom application icon.
- **Native OS Integration**:
  - Application Menus (File -> Exit, View -> Fullscreen).
  - Global shortcuts to prevent default browser behaviors (like scrolling
    with spacebar).
- **Offline Capability**: Packaged assets ensure the game can be played fully
  offline without an internet connection.

## 6. Build and Deployment

- **Bundler**: Vite or Webpack to bundle JS/TS, CSS, and audio assets.
- **Web Deployment**: Static file hosting (e.g., GitHub Pages, Vercel, Netlify).
- **Electron Build**: `electron-builder` or `electron-forge` to package the
  app into executable binaries (.exe for Windows, .dmg or .app for macOS,
  AppImage/Snap for Linux).

## 7. Future Enhancements (Phase 2)

- Online Leaderboards (requires backend/database).
- Local Multiplayer (split screen).
- Controller / Gamepad Support via the HTML5 Gamepad API.
- Theme customization (e.g., Game Boy theme, Modern theme).
