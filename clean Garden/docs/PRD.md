# Cyberpunk 3D Breakout Game - Product Requirements Document

## Title
Cyberpunk 3D Breakout Game

## Problem
Users seeking engaging browser-based games lack visually impressive, mechanically solid options that showcase modern web technologies in a retro-archetype format. Existing breakout clones are often 2D, visually plain, or lack meaningful progression systems.

## Users / Actors
- **Primary**: Casual gamers (18-35) interested in arcade games and cyberpunk aesthetics
- **Secondary**: Developers/tech enthusiasts looking to study modern JS game dev patterns (Three.js, physics engines)
- **Tertiary**: Streamers/content creators seeking visually distinctive games to showcase

## Context
Built as a demonstration project using HEPHAISTOS methodology, leveraging ThreeJS and cannon-esx for 3D rendering/physics in a browser environment. The project aims to combine retro gameplay with modern visual fidelity while following a strict task-driven development process.

## Goals
- Create a playable, visually striking cyberpunk-themed 3D Breakout game
- Demonstrate proficiency in modern JavaScript game development with Three.js physics
- Provide an enjoyable arcade experience with meaningful progression (score, power-ups, level completion)
- Serve as a showcase project for HEPHAISTOS-driven development (evidence-ledger, traceable tasks)
- Achieve a polished MVP that can be extended with additional features (levels, multiplayer, etc.)

## Non-Goals
- Not intended as a commercial product with monetization (focus on technical demonstration)
- Not focused on hyper-realistic physics (arcade-style preferred for gameplay feel)
- Not requiring account creation or online features for MVP (local high scores optional)
- Not targeting low-end devices as primary platform (modern desktop browsers first)
- Not implementing complex narrative or RPG elements (keep core loop simple)

## Functional Requirements
1. **Rendering**: Render 3D environment with cyberpunk aesthetic (neon colors on dark background, urban elements like simple buildings or grid)
2. **Paddle Control**: Player-controlled paddle (raquette) that moves horizontally with smooth, responsive input
3. **Ball Physics**: Ball that bounces off paddle, walls, and bricks with predictable, tunable physics (using cannon-esx)
4. **Brick System**: Destructible bricks arranged in configurable patterns; bricks disappear on ball impact
5. **Scoring**: Score tracking and display that increases on brick destruction
6. **Game States**: 
   - Start screen with instructions
   - Active gameplay state
   - Game over state (ball falls below paddle)
   - Win state (all bricks destroyed)
   - Restart capability from any state
7. **Power-ups**: At least 3 distinct power-up types that spawn on brick destruction and affect gameplay when collected by paddle (examples: multi-ball, laser paddle, sticky paddle, paddle enlargement, slow motion)
8. **Feedback**: 
   - Visual: Particle effects, screen shake, color flashes on collisions/power-ups
   - Audio: Distinct sounds for paddle hit, brick destruction, power-up collection, game over/win
9. **Responsiveness**: Game UI and canvas adapt to common desktop browser window sizes
10. **Controls**: 
    - Keyboard: Left/Right arrows for paddle movement, Space to launch ball (if stuck) or start game
    - Optional: Mouse movement for paddle (secondary)
    - Touch: Placeholder for future mobile support (not required for MVP)

## Non-Functional Requirements
- **Performance**: Maintain 60 FPS on average desktop hardware (equivalent to 2020-era integrated graphics)
- **Code Quality**: Modular, readable JavaScript/TypeScript with clear separation of concerns (rendering, physics, game logic, UI)
- **Accessibility**: 
    - Colorblind-friendly mode option for critical game elements (ball, paddle, bricks)
    - Sufficient contrast between foreground and background elements
    - Option to reduce or disable intense visual effects (post-processing)
- **Portability**: Runs in standard web browsers (Chrome, Firefox, Edge, Safari) without plugins
- **Maintainability**: Well-documented code with comments explaining key systems and architecture decisions
- **Determinism**: Game state should be reproducible given same initial conditions and input sequence (for testing/debugging)

## Constraints
- Must use JavaScript/TypeScript as primary language (ES6+ features allowed)
- Must use Three.js (r150+) for rendering
- Must use cannon-esx (or equivalent lightweight 3D physics engine) for rigid body dynamics
- Must run in standard browser environment (no Node.js dependencies for core gameplay)
- Development must follow HEPHAISTOS methodology: 
    - Tasks tracked in `.hephaistos/tasks/` with evidence and done_when criteria
    - Regular commits tied to task completion
    - Project state visible via `.hephaistos/state.yaml` and `docs/master/PROJECT_MASTER.md`
- Timeboxed to reasonable scope for demonstration project (aim for 2-3 weeks part-time effort)

## Assumptions
- Target audience has access to modern web browsers released within last 3 years
- Users prefer keyboard controls for precision in arcade-style games (mouse/touch considered secondary or bonus)
- Basic understanding of arcade game mechanics (paddle, ball, bricks) is present
- Three.js and cannon-esx are available via npm (primary) or CDN (fallback for quick prototyping)
- Local development environment supports npm/yarn and a basic HTTP server (or Vite/dev server)

## Interfaces
- **Input**: 
    - Primary: Keyboard (ArrowLeft/ArrowRight for paddle, Space for launch/start)
    - Secondary: Mouse X-axis for paddle position (clamped to play area)
    - Future: Touch gestures (left/right drag) - not required for MVP
- **Output**: 
    - Visual: WebGL canvas via Three.js (responsive to container size)
    - Audio: HTML5 Audio API or Web Audio API for sound effects and optional background track
- **Persistence**: 
    - LocalStorage for storing high score (optional, can be deferred to backlog)
    - No server-side dependencies for MVP
- **External**: 
    - None required for core gameplay loop
    - Potential future: Simple REST API for global leaderboards (backlog)

## Data/Evidence Requirements
- Game state (positions, velocities, scores, active power-ups) must be serializable for debugging
- Collision events (ball-paddle, ball-brick, ball-wall) must be detectable and loggable
- Resource loading (models, textures, audio) must complete before gameplay begins; show loading indicator
- Power-up spawn rates, types, and effects must be configurable via constants or simple config object
- Frame rate independence: Game logic should use delta time or fixed time steps

## Security/Privacy Considerations
- No personal data collection in MVP (all data local to browser)
- If leaderboard added later: 
    - Sanitize all user inputs (names, scores)
    - Implement rate limiting to prevent abuse
    - Use HTTPS in production
    - Consider basic anti-cheat (impossible scores detection)
- No use of eval() or similar dangerous functions
- Content Security Policy (CSP) friendly if deployed

## Success Metrics
- **Technical**: 
    - Game loads and reaches interactive state within 3 seconds on target hardware
    - Average frame rate ≥ 55 FPS during gameplay on reference device (e.g., laptop with Intel Iris Xe)
    - Zero JavaScript errors in console during normal gameplay
    - Memory usage stable (no leaks detected via brief profiling)
- **User Experience**: 
    - Average play session > 90 seconds in informal testing
    - ≥ 80% of testers report controls feel responsive ("not sluggish")
    - Visual theme consistently perceived as "cyberpunk" by observers
    - Clear audiovisual feedback for all major events (collisions, power-ups, state changes)
- **Development**: 
    - All tasks have clear done_when criteria met with evidence
    - Project follows HEPHAISTOS state transitions correctly
    - Code passes basic linting if configured (eslint with sensible defaults)

## Acceptance Criteria
- [ ] Player can move paddle left/right with arrow keys (mouse optional)
- [ ] Ball launches on spacebar press and follows predictable physics
- [ ] Ball bounces correctly off walls, paddle, and bricks (angle of incidence = angle of reflection)
- [ ] Bricks are destroyed on ball impact and disappear from scene
- [ ] Score increases by fixed amount per brick destroyed (displayed in UI)
- [ ] Game ends when ball's Y position falls below paddle's Y position, showing final score
- [ ] Game can be restarted after game over (return to start state)
- [ ] Win condition triggered when all bricks are destroyed (show win screen)
- [ ] At least one power-up type spawns on brick destruction and affects gameplay when collected by paddle
- [ ] Visual theme clearly conveys cyberpunk aesthetic: dark background, neon accents (cyan, magenta, blue), emissive materials
- [ ] No JavaScript errors in console during gameplay from start to finish
- [ ] Game is playable from start to win/lose state without needing to refresh the page

## Risks
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Scope creep (adding features before core is solid) | Medium | High | Strict adherence to done_when; defer non-core ideas to backlog |
| Performance issues (Three.js physics heavy) | Low-Medium | Medium | Profile early; simplify physics if needed; use instancing for bricks |
| Control imprecision (paddle feels sluggish/responsive) | Medium | High | Tune physics parameters; use kinematic body for paddle; test with various input methods |
| Visual clutter (cyberpunk effects obscure gameplay) | Medium | Medium | Prioritize contrast; make ball/paddle clearly visible; offer effect intensity slider |
| Dependency issues (version conflicts, broken CDN links) | Low | Medium | Pin versions in package.json; test install process; consider yarn.lock |
| Feature imbalance (power-ups too strong/weak) | Medium | Low-Medium | Implement tuning constants; playtest extensively; adjust based on feedback |
| Insufficient differentiation from 2D breakout clones | Low | Medium | Leverage 3D for unique camera angles, parallax, particle depth; commit to aesthetic |

## Unresolved Questions
1. **Brick Layouts**: What specific patterns/arrangements to use for initial levels? (Consider procedural generation later)
2. **Power-up Mechanics**: Should power-ups drop randomly, on specific brick hits, or have a guaranteed rate per level?
3. **Audio Direction**: What specific audio palette best complements cyberpunk (synthwave, chiptune, industrial ambiance)?
4. **Build Approach**: Use a dev server (Vite) for hot reloading, or plain HTML/JS with manual refresh for simplicity?
5. **Environment Detail**: Level of detail for 3D background (simple planes vs. low-poly buildings vs. shader-based cityscape)?
6. **Control Scheme**: Should mouse control be primary or secondary? How to handle pointer lock?
7. **Power-up Variety**: Beyond multi-ball/laser/sticky, what other fun, balanced power-ups fit the theme? (e.g., time slow, ball attraction, score multiplier)
8. **Win/Lose Screens**: What information to display beyond "Game Over"/"You Win"? (Score, replay option, level select?)

## Deliverables
1. **Playable Game**: Accessible via `index.html` in repository root (served by static server)
2. **Source Code**: 
    - `/src` directory containing JavaScript/TypeScript modules
    - Clear separation: `render.js`, `physics.js`, `game.js`, `ui.js`, `input.js`
3. **Assets**: 
    - `/assets/textures` for any needed textures (though many materials can be procedural)
    - `/assets/audio` for sound effects (laser, hit, power-up, background loop)
    - `/assets/models` if using external models (prefer procedural where possible)
4. **Documentation**: 
    - Root `README.md` with: project overview, tech stack, how to run dev/build, controls
    - HEPHAISTOS artifacts: `.hephaistos/project.yaml`, `.hephaistos/state.yaml`, `.hephaistos/ledger.jsonl`, `docs/master/PROJECT_MASTER.md`
    - Evidence directories: `/evidence/T001/`, `/evidence/T002/`, etc. with screenshots, logs, test results
5. **Quality Artifacts**: 
    - Linting/formatting configuration (if used)
    - Basic test suite placeholder (even if just manual test procedures)
    - GitHub Actions workflow placeholder for CI (optional)

---
*Document version: 1.0*  
*Last updated: 2026-09-08*  
*Prepared using HEPHAISTOS PRD skill (.agent/skills/prd.md)*