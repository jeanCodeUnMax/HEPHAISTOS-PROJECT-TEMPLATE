# Cyberpunk 3D Breakout Game

A visually stunning 3D breakout game with a cyberpunk theme, built using Three.js for rendering and cannon-es for physics. This project follows the HEPHAISTOS methodology for task-driven development, ensuring traceability, evidence-based validation, and anti-drift/anti-amnesia practices.

## Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Game Controls](#game-controls)
- [How to Run](#how-to-run)
- [Project Structure](#project-structure)
- [HEPHAISTOS Methodology](#hephaistos-methodology)
- [Acknowledgements](#acknowledgements)

## Overview
Cyberpunk 3D Breakout is a modern twist on the classic breakout (brick-breaker) game. Set in a neon-lit cyberpunk world, the player controls a paddle to bounce a ball and destroy bricks, with power-ups, scoring, and immersive audiovisual feedback.

## Tech Stack
- **Rendering**: [Three.js](https://threejs.org/) (r160)
- **Physics**: [cannon-es](https://github.com/pmndrs/cannon-es) (0.20.0)
- **Language**: JavaScript (ES6+)
- **Build**: None required (runs directly in browser via CDN dependencies)
- **Development Methodology**: [HEPHAISTOS](#hephaistos-methodology) for task tracking, evidence, and validation

## Features
- **Cyberpunk Aesthetic**: Dark background with neon accents (cyan, magenta, yellow), emissive materials, and bloom post-processing effect.
- **Responsive 3D Physics**: Realistic ball and paddle physics using cannon-es.
- **Power-Up System**: 
  - Multi-ball power-up (spawns two additional balls for 8 seconds)
  - Power-ups spawn probabilistically on brick destruction and fall under gravity.
  - Visual and audio feedback on collection.
- **Scoring System**: Points awarded per brick destroyed, displayed in real-time.
- **Game States**: 
  - Start screen with instructions
  - Active gameplay
  - Game over (when ball falls below paddle)
  - Win (when all bricks destroyed)
  - Restart functionality from any state.
- **Audio Feedback**: 
  - Paddle hit: synth blip
  - Brick hit: crisp click
  - Wall hit: soft thud
  - Power-up collection: rising whoop
  - Game over: low bwaah
  - Win: short jingle
- **User Interface**: 
  - Score display (top-left)
  - Active power-ups count (top-right)
  - Overlays for start, game over, and win states with restart buttons.
- **Cross-Platform**: Runs in any modern web browser (Chrome, Firefox, Edge, Safari).

## Game Controls
- **Left Arrow / Right Arrow**: Move paddle left/right
- **Space Bar**: Launch ball (when stuck) or start game from start screen
- **Restart Button**: Available on game over and win screens to play again

## How to Run
1. Ensure you have a modern web browser (Chrome, Firefox, Edge, Safari).
2. Simply open `index.html` in your browser.
   - For local development, you can use a simple static server to avoid potential CORS issues (though none are expected as all dependencies are CDN-hosted):
     - Using Python: `python -m http.server 8000` then visit `http://localhost:8000`
     - Using Node.js: `npx serve` or `npm i -g serve` then `serve`
     - Using npm (if you prefer): `npm install` (to install dev dependencies) then `npm run dev` (if you have a dev script; otherwise use the above).

## Project Structure
```
.
├── index.html                 # Main HTML file
├── src/
│   ├── main.js                # Core game logic (rendering, physics, input, states, power-ups, scoring)
│   ├── physics.js             # Physics world initialization (cannon-es)
│   ├── input.js               # Keyboard input handling
│   └── scoring.js             # Score management
├── assets/
│   ├── audio/                 # Sound effect placeholders
│   └── textures/              # Texture placeholders (grid, neon border)
├── evidence/                  # HEPHAISTOS evidence directories for each task (T001-T007)
├── .hephaistos/               # HEPHAISTOS project state (project.yaml, state.yaml, ledger.jsonl, tasks/)
├── .githooks/                 # Git hook scripts (pre-commit, commit-msg, pre-push) for HEPHAISTOS watchdog
├── .watchdog.json             # Watchdog configuration
├── .gitignore                 # Git ignore file
├── hephaistos.cmd             # Windows batch script for HEPHAISTOS CLI
├── hephaistos.ps1             # Windows PowerShell script for HEPHAISTOS CLI
├── install-hephaistos.ps1     # Windows PowerShell installer for HEPHAISTOS hooks
├── install-hephaistos.sh      # Unix shell installer for HEPHAISTOS hooks
├── package.json               # npm dependencies (three, cannon-es, vite dev server optional)
└── README.md                  # This file
```

## HEPHAISTOS Methodology
This game was developed using the [HEPHAISTOS](https://github.com/kilo-org/kilocode) methodology, which emphasizes:
- **Anti-drift**: Tasks cannot be started until their dependencies are satisfied.
- **Anti-amnesia**: Project state is stored in `.hephaistos/` and synchronized with `docs/master/PROJECT_MASTER.md`.
- **Evidence-Based Validation**: Each task must provide evidence (screenshots, logs, etc.) to be marked as done.
- **Deterministic Task Graph**: Tasks are executed in a strict order based on dependencies.
- **Scientific Approach**: Hypotheses, experiments, and data are tracked for reproducibility.

The CLI (`.\hephaistos`) is used to manage tasks:
- `.\hephaistos tasks` – list all tasks and their status
- `.\hephaistos start T00X` – begin working on a task (if dependencies are met)
- `.\hephaistos check T00X` – verify that a task’s evidence is satisfied
- `.\hephaistos finish T00X` – mark a task as complete and activate the next admissible task

## Acknowledgements
- Thanks to the Three.js and cannon-es teams for their excellent open-source libraries.
- Inspired by classic breakout games and cyberpunk aesthetics from media like *Blade Runner*, *Cyberpunk 2077*, and *Deus Ex*.

Enjoy the game!