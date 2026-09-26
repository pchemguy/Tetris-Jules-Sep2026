# Implementation Plan: Classic Tetris (Browser + Electron)

## Phase 1: Project Setup and Skeleton (Days 1-2)

### 1.1 Web Application Initialization

- Initialize a new Vite project with Vanilla TypeScript (`npm create vite@latest
  tetris -- --template vanilla-ts`).
- Setup HTML shell (`index.html`) with the basic structure (`<canvas>` element,
  UI containers for score, level, lines, "Hold" queue, and "Next" queue).
- Setup base CSS for styling the layout (CSS Grid/Flexbox to center the playfield
  and side panels).

### 1.2 Electron Wrapper Initialization

- Add `electron`, `electron-builder`, and `concurrently` as development
  dependencies.
- Create `main.js` (Electron entry point) to load the Vite development server
  (during development) or the built static files (in production).
- Configure `package.json` with scripts for `dev`, `build`, and
  `electron:start`.

## Phase 2: Core Game Engine (Days 3-5)

### 2.1 State Management & Data Structures

- Define constants and enums (Colors, Tetromino Shapes, Grid Dimensions: 10x20).
- Create a `Matrix` class to manage the 10x20 grid, including collision
  detection and locking pieces.

### 2.2 Tetromino Logic

- Implement the 7 standard shapes (I, J, L, O, S, T, Z) with their
  corresponding rotation states (using SRS - Super Rotation System).
- Implement a `Piece` class handling its current position (x, y), shape, and
  rotation state.
- Implement the "7-bag" randomizer algorithm to generate the sequence of
  incoming pieces.

### 2.3 Movement and Mechanics

- Implement movement logic: Left, Right, Soft Drop, Hard Drop.
- Implement boundary checks and collision detection against locked blocks in
  the Matrix.
- Implement SRS wall kicks for rotation near boundaries or other blocks.

## Phase 3: Game Loop and Rendering (Days 6-8)

### 3.1 The Game Loop

- Implement `requestAnimationFrame` loop for rendering (60 FPS).
- Implement a tick-based logic loop for game mechanics (gravity/dropping).
- Tie the drop speed (gravity) to the current Level.

### 3.2 Canvas Rendering

- Draw the Matrix (locked blocks).
- Draw the active `Piece`.
- Draw the Ghost Piece (calculating its landing position based on the current
  active piece's x/y).
- Render the "Hold" piece and the "Next" pieces queue.

### 3.3 Input Handling

- Add event listeners for keyboard inputs.
- Map keys to game actions (Arrow keys, Spacebar, Z/X/C).
- Implement debouncing/repeating for held keys (e.g., holding Left/Right to
  slide).

## Phase 4: Game Rules, Scoring, and UI (Days 9-11)

### 4.1 Game Rules

- Implement Line Clearing logic (checking for full rows, removing them, and
  shifting blocks down).
- Implement Lock Delay (allow slides/rotations just before locking).
- Implement the "Hold" mechanism (swapping active piece with the held piece).
- Implement Game Over state ("Lock Out" / "Block Out").

### 4.2 Scoring System

- Calculate points based on cleared lines (Single, Double, Triple, Tetris) and
  current Level.
- Update UI elements (DOM manipulation) to display current Score, Level, and
  Lines cleared.
- Implement Level Progression (level up every 10 lines).

### 4.3 Menus and State Transitions

- Implement Main Menu screen overlay (Play, Settings).
- Implement Pause functionality and Pause Menu overlay.
- Implement Game Over overlay and Reset/Restart functionality.

## Phase 5: Audio and Polish (Days 12-13)

### 5.1 Audio Integration

- Load audio assets (background music, sound effects).
- Implement a simple Audio Manager class to play sounds on specific events:
  - Piece move/rotate/hard drop.
  - Line clear (different sounds for 1-3 lines vs. Tetris).
  - Game Over.
- Add UI controls to mute/unmute audio.

### 5.2 Local Storage

- Save High Score to `localStorage` and load it on startup.
- Save user preferences (volume, controls) to `localStorage`.

## Phase 6: Electron Build and Packaging (Day 14)

### 6.1 Application Polish

- Finalize Electron `main.js` configuration (hide default menu bar, set fixed
  window size/aspect ratio, configure application icon).
- Ensure global shortcuts (like Spacebar) do not trigger unwanted browser
  behaviors when running in the Electron wrapper.

### 6.2 Packaging

- Configure `electron-builder` in `package.json` for target OS (Windows
  `.exe`, macOS `.dmg`, Linux `.AppImage`).
- Test the production build (`npm run build` followed by Electron packaging).
- Verify the packaged application runs smoothly offline and assets (audio,
  images) load correctly.
