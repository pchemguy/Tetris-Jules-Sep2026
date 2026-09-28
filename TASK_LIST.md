# Tetris Implementation Task List

This document breaks down the implementation of the Tetris clone into the smallest
sensible and testable units of work.

## 1. Project Initialization

- [x] **Task 1.1**: Initialize Vite project with Vanilla TypeScript
  (`npm create vite@latest . -- --template vanilla-ts`).
  - *Verification*: `npm install` and `npm run dev` start a default Vite page.
- [x] **Task 1.2**: Set up basic HTML skeleton and CSS grid/flexbox layout for
  the game container (Center playfield, Left panel, Right panel).
  - *Verification*: Visual inspection shows three distinct columns/areas on
    the page.
- [x] **Task 1.3**: Add a `<canvas>` element to the center playfield with fixed
  internal resolution (e.g., 300x600 for a 10x20 grid at 30px per block).
  - *Verification*: Canvas element exists and draws a solid background color.

## 2. Core Data Structures (No Rendering)

- [x] **Task 2.1**: Define Enums and Constants (`Colors`, `Shapes`,
  `GridSize: 10x20`).
  - *Verification*: TypeScript compiles without errors.
- [x] **Task 2.2**: Implement `Matrix` class with a 2D array representation.
  Include a method to get/set cell values.
  - *Verification*: Unit tests check getting and setting values out of bounds
    (should throw or return null).
- [x] **Task 2.3**: Implement `Matrix.clear()` and
  `Matrix.isCollision(x, y, shape)`.
  - *Verification*: Unit tests check collision against edges and existing
    blocks.
- [x] **Task 2.4**: Define the 7 Tetromino shapes and their SRS rotation arrays.
  - *Verification*: Unit tests verify the shape matrices match standard
    Tetris SRS.

## 3. Basic Game Loop & Rendering

- [x] **Task 3.1**: Implement `GameLoop` class using `requestAnimationFrame`
  for rendering at 60 FPS and a separate tick timer for game logic updates.
  - *Verification*: Console logs tick at a set interval (e.g., 1000ms), while
    render logs tick at 60fps.
- [x] **Task 3.2**: Implement `Renderer.drawMatrix(matrix)` to draw the locked
  blocks on the canvas.
  - *Verification*: Hardcode some blocks in the `Matrix` and verify they
    render correctly on screen.
- [x] **Task 3.3**: Implement `Piece` class with initial `x, y`, `shape`,
  and `rotation` state.
  - *Verification*: `Piece` instantiates correctly with default values.
- [x] **Task 3.4**: Implement `Renderer.drawPiece(piece)` to draw the active
  piece over the matrix.
  - *Verification*: Hardcode a `Piece` and verify it renders correctly over
    the matrix.

## 4. Movement & Input Handling

- [x] **Task 4.1**: Setup keyboard event listeners (Keydown/Keyup) and map them
  to actions (`Left`, `Right`, `Down`, `Rotate`).
  - *Verification*: Pressing keys logs the corresponding action to the console.
- [x] **Task 4.2**: Implement basic left/right horizontal movement for the
  active `Piece`, validating against `Matrix.isCollision`.
  - *Verification*: Piece can be moved left and right but stops at the edges.
- [x] **Task 4.3**: Implement Soft Drop (down movement) and gravity tick
  (automatic downward movement).
  - *Verification*: Piece automatically moves down every tick, and pressing
    'Down' moves it faster.
- [x] **Task 4.4**: Implement basic rotation for the `Piece` (without wall
  kicks initially).
  - *Verification*: Piece rotates on command but fails to rotate if blocked
    by walls.

## 5. Locking and Line Clearing

- [ ] **Task 5.1**: Implement Locking logic. When a piece collides moving
  downwards, write its blocks to the `Matrix` and spawn a new piece at the top.
  - *Verification*: Piece drops, hits the bottom, turns into locked blocks,
    and a new piece spawns.
- [ ] **Task 5.2**: Implement `Matrix.checkLines()` to identify and remove full
  rows, shifting rows above downwards.
  - *Verification*: Fill a row completely, drop a piece to lock, and observe
    the row disappear and blocks shift down.
- [ ] **Task 5.3**: Implement Game Over detection (spawning a new piece
  immediately results in a collision).
  - *Verification*: Stack pieces to the top; verify the game stops when a new
    piece cannot spawn.

## 6. Advanced Mechanics

- [ ] **Task 6.1**: Implement SRS Wall Kicks for rotation.
  - *Verification*: Piece successfully rotates near walls/blocks by "kicking"
    left, right, or up.
- [ ] **Task 6.2**: Implement Hard Drop (instantly calculate lowest collision
  point, move piece there, and lock).
  - *Verification*: Pressing 'Space' instantly drops and locks the piece.
- [ ] **Task 6.3**: Implement Ghost Piece rendering (calculating the hard drop
  position and drawing it semi-transparently).
  - *Verification*: A ghost outline appears at the bottom indicating where
    the piece will land.
- [ ] **Task 6.4**: Implement "7-bag" randomizer for piece generation instead
  of pure random.
  - *Verification*: Unit test or console log verifies that every sequence of
    7 pieces contains one of each shape.
- [ ] **Task 6.5**: Implement the "Hold" mechanism.
  - *Verification*: Pressing 'Hold' swaps the active piece with the held piece
    (or stores it and gets the next piece if empty).

## 7. UI & Scoring

- [ ] **Task 7.1**: Implement scoring logic (points for 1, 2, 3, 4 lines
  cleared).
  - *Verification*: Clearing lines correctly increments the internal score state.
- [ ] **Task 7.2**: Implement Level logic (level up every 10 lines, increase
  gravity speed).
  - *Verification*: Reaching 10 lines increases the level and makes pieces
    drop faster.
- [ ] **Task 7.3**: Update DOM elements to display Score, Level, and Lines.
  - *Verification*: On-screen counters update correctly during gameplay.
- [ ] **Task 7.4**: Implement "Next" piece queue rendering (showing the next 3
  pieces) and "Hold" piece rendering in their respective UI panels.
  - *Verification*: Side panels correctly display the held piece and upcoming
    pieces.

## 8. Menus, Audio & Polish

- [ ] **Task 8.1**: Implement HTML Overlays for Main Menu, Pause Menu, and
  Game Over Screen.
  - *Verification*: Game starts paused on Main Menu, Esc pauses gameplay,
    and Game Over shows the restart button.
- [ ] **Task 8.2**: Integrate Audio Manager to play sounds for movement,
  locking, line clears, and music.
  - *Verification*: Actions produce corresponding sounds; background music
    plays.
- [ ] **Task 8.3**: Implement `localStorage` saving for High Scores.
  - *Verification*: Refreshing the page persists the High Score.

## 9. Electron Packaging

- [ ] **Task 9.1**: Create Electron `main.js` and configure it to load the
  Vite build.
  - *Verification*: Running `npm run electron:start` opens the game in a
    native window.
- [ ] **Task 9.2**: Configure `electron-builder` and build the executable for
  the current OS.
  - *Verification*: A standalone executable is generated and runs successfully
    outside the development environment.
