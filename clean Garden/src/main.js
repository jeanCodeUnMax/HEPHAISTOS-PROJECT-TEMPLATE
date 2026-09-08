// Import three.js and cannon-es as ES modules
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js';
import { initPhysics, stepPhysics, getPaddlePosition, getBallPosition, setPaddlePosition, launchBall, resetBall } from './physics.js';
import { isKeyPressed, getKeys } from './input.js';
import { addScore, getScore, resetScore } from './scoring.js';
import { spawnPowerUp, updatePowerUps, checkPaddlePowerUpCollisions, updateTimedBalls } from './powerups.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting (optional, MeshBasicMaterial ignores lights)
const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

// Physics initialization
const { world, paddleBody, ballBody } = initPhysics();

// Paddle mesh (thin box) - using BasicMaterial to avoid complex shaders
const paddleGeometry = new THREE.BoxGeometry(1, 0.2, 1);
const paddleMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const paddleMesh = new THREE.Mesh(paddleGeometry, paddleMaterial);
scene.add(paddleMesh);

// Ball mesh (sphere)
const ballGeometry = new THREE.SphereGeometry(0.25, 16, 16); // fewer segments for lower load
const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff });
const ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
scene.add(ballMesh);

// Brick setup
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
const brickMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff });

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

// UI elements
const scoreElement = document.getElementById('score');
const powerupInfoElement = document.getElementById('powerup-info');

// Input handling: paddleBody already from initPhysics
// ballBody already from initPhysics

// Input handling: paddle movement speed
const paddleSpeed = 5; // units per second

// Launch ball on spacebar
let ballLaunched = false;

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
  
  // Update UI
  scoreElement.textContent = `Score: ${getScore()}`;
  powerupInfoElement.textContent = `Power-ups: ${timedBalls.length}`;
  
  // Simple game over condition: ball falls below paddle (y < -3)
  // We'll consider game over if ALL balls fall below (or just the main one? For simplicity, if main ball falls)
  if (ballBody.position.y < -3) {
    // Reset ball and paddle? For now just stop launching
    ballLaunched = false;
    resetBall();
    // Optionally reset score or show game over
  }
  
  // Win condition: no bricks left
  if (bricks.length === 0) {
    // You could display a win message here
    // For now, just prevent further collisions
  }
  
  renderer.render(scene, camera);
  
  // Request next frame
  requestAnimationFrame(animate);
}

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start animation
animate();