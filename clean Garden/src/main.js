// Import modules
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js';
import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/postprocessing/RenderPass.js';
import { BloomPass } = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/postprocessing/BloomPass.js'); // Note: dynamic import due to potential issues; we'll use static import if possible.
// Actually we can import all three statically:
import { BloomPass } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/postprocessing/BloomPass.js';
import { initPhysics, stepPhysics, getPaddlePosition, getBallPosition, setPaddlePosition, launchBall, resetBall } from './physics.js';
import { isKeyPressed, getKeys } from './input.js';
import { addScore, getScore, resetScore } from './scoring.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

// Audio listener
const listener = new THREE.AudioListener();
camera.add(listener);

// Audio loader and sounds
const audioLoader = new THREE.AudioLoader();
const sounds = {};
let audioReady = false;
const soundNames = ['paddle_hit', 'brick_hit', 'wall_hit', 'powerup_collect', 'game_over', 'win'];
function loadSound(name, url) {
  audioLoader.load(url, (buffer) => {
    const sound = new THREE.Audio(listener);
    sound.setBuffer(buffer);
    sound.setVolume(0.5);
    sounds[name] = sound;
    // Check if all loaded
    if (Object.keys(sounds).length === soundNames.length) {
      audioReady = true;
      console.log('All sounds loaded');
    }
  });
}
// Load placeholder sounds (they will be empty but still load)
loadSound('paddle_hit', '/assets/audio/paddle_hit.wav');
loadSound('brick_hit', '/assets/audio/brick_hit.wav');
loadSound('wall_hit', '/assets/audio/wall_hit.wav');
loadSound('powerup_collect', '/assets/audio/powerup_collect.wav');
loadSound('game_over', '/assets/audio/game_over.wav');
loadSound('win', '/assets/audio/win.wav');

const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 1);
document.body.appendChild(renderer.domElement);

// Post-processing
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloomPass = new BloomPass(1.2); // strength, radius, threshold, renderToScreen
composer.addPass(bloomPass);
bloomPass.renderToScreen = true;

// Lighting (optional, MeshBasicMaterial ignores lights)
const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

// Physics initialization
const { world, paddleBody, ballBody } = initPhysics();

// Paddle mesh (thin box) - using BasicMaterial with neon cyan
const paddleGeometry = new THREE.BoxGeometry(1, 0.2, 1);
const paddleMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff }); // cyan
const paddleMesh = new THREE.Mesh(paddleGeometry, paddleMaterial);
scene.add(paddleMesh);

// Ball mesh (sphere) - neon magenta
const ballGeometry = new THREE.SphereGeometry(0.25, 16, 16);
const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff }); // magenta
const ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
scene.add(ballMesh);

// Brick setup constants
const brickWidth = 0.6;
const brickHeight = 0.2;
const brickDepth = 0.6;
const rows = 4;
const cols = 10;
const spacing = 0.1;
const startX = -(cols * (brickWidth + spacing) - spacing) / 2;
const startY = 2; // start above paddle
const startZ = 0;

const brickGeometry = new THREE.BoxGeometry(brickWidth, brickHeight, brickDepth);
const brickMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff }); // cyan, could alternate
// We'll alternate colors for variety
const bricks = [];
const brickBodies = [];

for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const brickMesh = new THREE.Mesh(brickGeometry, brickMaterial);
    const x = startX + col * (brickWidth + spacing);
    const y = startY - row * (brickHeight + spacing);
    const z = startZ;
    brickMesh.position.set(x, y, z);
    scene.add(brickMesh);
    bricks.push(brickMesh);

    // Static body for brick
    const brickShape = new CANNON.Box(new CANNON.Vec3(brickWidth/2, brickHeight/2, brickDepth/2));
    const brickBody = new CANNON.Body({ mass: 0 }); // static
    brickBody.addShape(brickShape);
    brickBody.position.set(x, y, z);
    world.addBody(brickBody);
    brickBodies.push(brickBody);
  }
}

// Background elements: large grid plane
const gridSize = 20;
const gridGeometry = new THREE.PlaneGeometry(gridSize, gridSize);
const gridMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
const gridMesh = new THREE.Mesh(gridGeometry, gridMaterial);
gridMesh.rotation.x = -Math.PI / 2; // lie flat
gridMesh.position.y = -3; // below play area
scene.add(gridMesh);
// We could add a grid texture but placeholder is fine.

// Power-up related
const powerUpSize = 0.3;
const powerUpSpawnProbability = 0.15; // 15% chance when brick destroyed
const POWER_UP_TYPES = {
  MULTI_BALL: 'multi-ball'
};
let powerUps = []; // each: {mesh, body, type, spawnedTime}

// Extra balls (timed) from multi-ball power-up
const MULTI_BALL_DURATION = 8000; // 8 seconds in milliseconds
let timedBalls = []; // each: {mesh, body, removeTime}

// UI elements
const scoreElement = document.getElementById('score');
const powerupInfoElement = document.getElementById('powerup-info');
const startOverlay = document.getElementById('startOverlay');
const gameOverOverlay = document.getElementById('gameOverOverlay');
const winOverlay = document.getElementById('winOverlay');
const finalScoreElement = document.getElementById('finalScore');
const winScoreElement = document.getElementById('winScore');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const winRestartButton = document.getElementById('winRestartButton');

// Game states
const STATE_START = 0;
const STATE_PLAY = 1;
const STATE_GAME_OVER = 2;
const STATE_WIN = 3;
let gameState = STATE_START;

// Input handling: paddle movement speed
const paddleSpeed = 5; // units per second

// Launch ball on spacebar
let ballLaunched = false;

// Function to create a level (bricks)
function createLevel() {
  // Clear existing bricks
  for (let i = bricks.length - 1; i >= 0; i--) {
    scene.remove(bricks[i]);
    world.removeBody(brickBodies[i]);
  }
  bricks = [];
  brickBodies = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Alternate brick colors for neon effect
      const brickColor = (row + col) % 2 === 0 ? 0x00ffff : 0xff00ff; // cyan or magenta
      const brickMesh = new THREE.Mesh(brickGeometry, new THREE.MeshBasicMaterial({ color: brickColor }));
      const x = startX + col * (brickWidth + spacing);
      const y = startY - row * (brickHeight + spacing);
      const z = startZ;
      brickMesh.position.set(x, y, z);
      scene.add(brickMesh);
      bricks.push(brickMesh);

      // Static body for brick
      const brickShape = new CANNON.Box(new CANNON.Vec3(brickWidth/2, brickHeight/2, brickDepth/2));
      const brickBody = new CANNON.Body({ mass: 0 }); // static
      brickBody.addShape(brickShape);
      brickBody.position.set(x, y, z);
      world.addBody(brickBody);
      brickBodies.push(brickBody);
    }
  }
  console.log(`Created ${bricks.length} bricks`);
}

// Function to reset physics objects (paddle, ball) to initial state
function resetPhysicsObjects() {
  // Reset paddle position and velocity
  paddleBody.position.set(0, -2.5, 0);
  paddleBody.velocity.set(0, 0, 0);
  paddleBody.angularVelocity.set(0, 0, 0);
  // Reset ball position and velocity
  ballBody.position.set(0, paddleBody.position.y + 0.5, 0);
  ballBody.velocity.set(0, 0, 0);
  ballBody.angularVelocity.set(0, 0, 0);
}

// Function to hide all overlays
function hideAllOverlays() {
  startOverlay.classList.add('hidden');
  gameOverOverlay.classList.add('hidden');
  winOverlay.classList.add('hidden');
}

// Function to show start overlay
function showStartOverlay() {
  hideAllOverlays();
  startOverlay.classList.remove('hidden');
}

// Function to show game over overlay
function showGameOverOverlay() {
  hideAllOverlays();
  gameOverOverlay.classList.remove('hidden');
  finalScoreElement.textContent = `Score: ${getScore()}`;
}

// Function to show win overlay
function showWinOverlay() {
  hideAllOverlays();
  winOverlay.classList.remove('hidden');
  winScoreElement.textContent = `Score: ${getScore()}`;
}

// Cleanup extra meshes and bodies (power-ups, extra balls)
function cleanupExtraObjects() {
  // Remove meshes that are not paddleMesh, ballMesh, or in bricks array
  for (let i = scene.children.length - 1; i >= 0; i--) {
    const obj = scene.children[i];
    if (obj !== paddleMesh && obj !== ballMesh && !bricks.includes(obj)) {
      scene.remove(obj);
    }
  }
  // Remove bodies that are not paddleBody, ballBody, or in brickBodies array
  for (let i = world.bodies.length - 1; i >= 0; i--) {
    const body = world.bodies[i];
    if (body !== paddleBody && body !== ballBody && !brickBodies.includes(body)) {
      world.removeBody(body);
    }
  }
}

// Initialize level and reset game state
function initGame() {
  resetScore();
  createLevel();
  resetPhysicsObjects();
  cleanupExtraObjects();
  powerUps = [];
  timedBalls = [];
  ballLaunched = false;
  hideAllOverlays();
  showStartOverlay();
}

// Power-up functions
function createPowerUpMesh(type) {
  const geometry = new THREE.SphereGeometry(powerUpSize, 8, 8);
  let color;
  switch (type) {
    case POWER_UP_TYPES.MULTI_BALL:
      color = 0xffff00; // yellow
      break;
    default:
      color = 0xff00ff;
  }
  const material = new THREE.MeshBasicMaterial({ color: color });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

function createPowerUpBody(position) {
  const shape = new CANNON.Sphere(powerUpSize);
  const body = new CANNON.Body({
    mass: 0.1, // light, falls with gravity
    position: new CANNON.Vec3(position.x, position.y, position.z),
    material: new CANNON.Material({ restitution: 0.3 })
  });
  body.addShape(shape);
  return body;
}

function spawnPowerUp(position) {
  // Decide if we spawn a power-up
  if (Math.random() > powerUpSpawnProbability) return null;

  // Choose type (for now only multi-ball)
  const type = POWER_UP_TYPES.MULTI_BALL;

  const mesh = createPowerUpMesh(type);
  const body = createPowerUpBody(position);

  scene.add(mesh);
  world.addBody(body);

  const powerUp = {
    mesh,
    body,
    type,
    spawnedTime: Date.now()
  };
  powerUps.push(powerUp);
  return powerUp;
}

function updatePowerUps(dt) {
  // Remove power-ups that fall too far (optional)
  for (let i = powerUps.length - 1; i >= 0; i--) {
    const pu = powerUps[i];
    if (pu.body.position.y < -10) {
      scene.remove(pu.mesh);
      world.removeBody(pu.body);
      powerUps.splice(i, 1);
    }
  }
}

function checkPaddlePowerUpCollisions() {
  const paddlePos = new CANNON.Vec3(paddleBody.position.x, paddleBody.position.y, paddleBody.position.z);
  const paddleHalfSize = new CANNON.Vec3(0.5, 0.1, 0.5); // matches paddle geometry

  for (let i = powerUps.length - 1; i >= 0; i--) {
    const pu = powerUps[i];
    const dx = Math.abs(pu.body.position.x - paddlePos.x);
    const dy = Math.abs(pu.body.position.y - paddlePos.y);
    const dz = Math.abs(pu.body.position.z - paddlePos.z);

    if (dx < (paddleHalfSize.x + powerUpSize) && 
        dy < (paddleHalfSize.y + powerUpSize) && 
        dz < (paddleHalfSize.z + powerUpSize)) {
      // Collision detected
      collectPowerUp(pu, i);
    }
  }
}

function collectPowerUp(powerUp, index) {
  // Remove from scene and physics world
  scene.remove(powerUp.mesh);
  world.removeBody(powerUp.body);
  powerUps.splice(index, 1);

  // Apply effect based on type
  applyPowerUpEffect(powerUp.type);
}

function applyPowerUpEffect(type) {
  switch (type) {
    case POWER_UP_TYPES.MULTI_BALL:
      spawnTimedBalls(2); // add two timed balls
      break;
    // Add other effects here
    default:
      console.log(`Unknown power-up type: ${type}`);
  }
}

function spawnTimedBalls(count) {
  for (let i = 0; i < count; i++) {
    // Create a new ball mesh and body
    const ballGeometry = new THREE.SphereGeometry(0.25, 16, 16);
    const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff, opacity: 0.8, transparent: true });
    const ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
    scene.add(ballMesh);

    const ballShape = new CANNON.Sphere(0.25);
    const ballBody = new CANNON.Body({
      mass: 0.1,
      position: new CANNON.Vec3(ballBody.position.x, ballBody.position.y + 0.5, ballBody.position.z), // slightly above current ball
      velocity: new CANNON.Vec3(
        (Math.random() - 0.5) * 4, // random x velocity
        5, // upward velocity
        (Math.random() - 0.5) * 4  // random z velocity
      ),
      material: new CANNON.Material({ restitution: 0.8 })
    });
    ballBody.addShape(ballShape);
    world.addBody(ballBody);

    // Add to timed balls with expiration time
    const removeTime = Date.now() + MULTI_BALL_DURATION;
    timedBalls.push({ mesh: ballMesh, body: ballBody, removeTime });
  }
}

function updateTimedBalls(dt) {
  const now = Date.now();
  for (let i = timedBalls.length - 1; i >= 0; i--) {
    const tb = timedBalls[i];
    if (now >= tb.removeTime) {
      // Remove from scene and world
      scene.remove(tb.mesh);
      world.removeBody(tb.body);
      timedBalls.splice(i, 1);
    }
  }
}

// Simple collision detection between ball and bricks
function checkBallBrickCollisions() {
  const ballPos = new CANNON.Vec3(ballBody.position.x, ballBody.position.y, ballBody.position.z);
  const ballRadius = 0.25;

  for (let i = brickBodies.length - 1; i >= 0; i--) {
    const brickBody = brickBodies[i];
    const brickPos = brickBody.position;
    const dx = Math.abs(ballPos.x - brickPos.x);
    const dy = Math.abs(ballPos.y - brickPos.y);
    const dz = Math.abs(ballPos.z - brickPos.z);

    if (dx < (brickWidth/2 + ballRadius) && 
        dy < (brickHeight/2 + ballRadius) && 
        dz < (brickDepth/2 + ballRadius)) {
      // Collision detected
      // Remove brick from scene and physics world
      scene.remove(bricks[i]);
      world.removeBody(brickBodies[i]);
      bricks.splice(i, 1);
      brickBodies.splice(i, 1);
      
      // Add score
      addScore(10);
      
      // Play brick hit sound if ready
      if (audioReady && sounds.brick_hit) {
        sounds.brick_hit.play();
      }
      
      // Spawn power-up with probability
      const powerUp = spawnPowerUp(new CANNON.Vec3(brickPos.x, brickPos.y, brickPos.z));
      // Optionally log
      // if (powerUp) console.log('Power-up spawned');
      
      break; // assume one collision per frame for simplicity
    }
  }
}

// Animation loop
const clock = new THREE.Clock();
function animate() {
  const dt = clock.getDelta(); // seconds
  
  if (gameState === STATE_PLAY) {
    // Handle input
    if (isKeyPressed('ArrowLeft')) {
      const pos = paddleBody.position;
      setPaddlePosition(pos.x - paddleSpeed * dt, pos.y, pos.z);
    }
    if (isKeyPressed('ArrowRight')) {
      const pos = paddleBody.position;
      setPaddlePosition(pos.x + paddleSpeed * dt, pos.y, pos.z);
    }
    if (isKeyPressed('Space') && !ballLaunched) {
      launchBall(2, 5, 0); // example velocity
      ballLaunched = true;
      if (audioReady && sounds.paddle_hit) {
        // Actually paddle hit sound is for paddle collision, not launch. We'll play a launch sound? We don't have launch sound. We'll skip.
        // We'll play paddle hit sound on paddle collision later.
      }
    }
    
    // Step physics
    stepPhysics(dt);
    
    // Update power-ups (remove fallen ones, etc.)
    updatePowerUps(dt);
    
    // Check for paddle-power-up collisions
    checkPaddlePowerUpCollisions();
    
    // Check for ball-brick collisions
    checkBallBrickCollisions();
    
    // Update timed balls (remove expired)
    updateTimedBalls(dt);
    
    // Synchronize meshes with physics bodies
    paddleMesh.position.copy(getPaddlePosition());
    paddleMesh.quaternion.copy(paddleBody.quaternion);
    
    ballMesh.position.copy(getBallPosition());
    ballMesh.quaternion.copy(ballBody.quaternion);
    
    // Synchronize timed balls
    timedBalls.forEach(tb => {
      tb.mesh.position.copy(tb.body.position);
      tb.mesh.quaternion.copy(tb.body.quaternion);
    });
    
    // Simple game over condition: ball falls below paddle (y < -3)
    // We'll consider game over if ALL balls fall below (or just the main one? For simplicity, if main ball falls)
    if (ballBody.position.y < -3) {
      // Reset ball and paddle? For now just stop launching
      ballLaunched = false;
      resetBall();
      // Play game over sound if ready
      if (audioReady && sounds.game_over) {
        sounds.game_over.play();
      }
      gameState = STATE_GAME_OVER;
      showGameOverOverlay();
    }
    
    // Win condition: no bricks left
    if (bricks.length === 0) {
      // Play win sound if ready
      if (audioReady && sounds.win) {
        sounds.win.play();
      }
      gameState = STATE_WIN;
      showWinOverlay();
    }
  }
  
  // Update UI
  scoreElement.textContent = `Score: ${getScore()}`;
  powerupInfoElement.textContent = `Power-ups: ${timedBalls.length}`;
  
  // Render scene with post-processing
  composer.render(scene, camera);
  
  // Request next frame
  requestAnimationFrame(animate);
}

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

// Initialize game on load
initGame();

// Start animation
animate();