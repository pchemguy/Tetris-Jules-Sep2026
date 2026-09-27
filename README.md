# Classic Tetris (Browser + Electron)

Welcome to the **Classic Tetris** project! This repository contains a modern
implementation of the classic Tetris game, designed to run smoothly in any
modern web browser, with optional support for being packaged as a native
desktop application using Electron.

## Project Overview

This project is built from scratch using web technologies. It focuses on
creating an authentic Tetris experience, complete with standard mechanics like
the Super Rotation System (SRS), a 7-bag randomizer, lock delay, and the
classic scoring system.

### Documentation

For a deep dive into the project's design and roadmap, please review the
following documents:

- **[SPEC.md](./SPEC.md)**: Details the core gameplay mechanics, technical
  architecture, UI/UX design, and rules.
- **[IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)**: Breaks down the
  development lifecycle into distinct, logical phases.
- **[TASK_LIST.md](./TASK_LIST.md)**: Provides a granular, step-by-step
  checklist used to track progress during the build phase.

## Tech Stack

The application is built using a lightweight and fast modern web stack:

- **Frontend**: HTML5 Canvas API, CSS3, Vanilla TypeScript.
- **Build Tool**: [Vite](https://vitejs.dev/) for a fast development server
  and optimized production builds.
- **Desktop Wrapper**: [Electron](https://www.electronjs.org/) for
  distributing the game as an offline native application.

## Getting Started

To run the game locally in your browser:

1. Ensure you have Node.js installed.
2. Clone this repository.
3. Install the dependencies:

   `npm install`

4. Start the development server:

   `npm start`

5. Open the provided URL in your browser to play!
