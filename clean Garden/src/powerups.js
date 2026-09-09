// Power-up system with timed effects
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js';
import { scene, world, ballBody } from './main.js';

let powerUps = []; // array of {mesh, body, type, spawnedTime}
const powerUpSpawnProbability = 0.15; // 15% chance when brick destroyed
const powerUpSize = 0.3;

// Power-up types
const POWER_UP_TYPES = {
  MULTI_BALL: 'multi-ball'
};

// Timed effects: extra balls that disappear after duration
let timedBalls = []; // array of {mesh, body, removeTime}
const MULTI_BALL_DURATION = 8000; // 8 seconds in milliseconds

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
    const ballBodyLocal = new CANNON.Body({
      mass: 0.1,
      position: new CANNON.Vec3(ballBody.position.x, ballBody.position.y + 0.5, ballBody.position.z), // slightly above current ball
      velocity: new CANNON.Vec3(
        (Math.random() - 0.5) * 4, // random x velocity
        5, // upward velocity
        (Math.random() - 0.5) * 4  // random z velocity
      ),
      material: new CANNON.Material({ restitution: 0.8 })
    });
    ballBodyLocal.addShape(ballShape);
    world.addBody(ballBodyLocal);

    // Add to timed balls with expiration time
    const removeTime = Date.now() + MULTI_BALL_DURATION;
    timedBalls.push({ mesh: ballMesh, body: ballBodyLocal, removeTime });
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

// Expose functions
export { spawnPowerUp, updatePowerUps, checkPaddlePowerUpCollisions, updateTimedBalls };