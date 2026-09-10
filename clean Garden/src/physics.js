// Physics module using cannon-es
import * as THREE from 'three';
import * as CANNON from 'cannon-es';

let world, paddleBody, ballBody;

// Initialize physics world
function initPhysics() {
  world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.82, 0), // m/s²
    broadphase: new CANNON.NaiveBroadphase(),
    solver: new CANNON.GSSolver()
  });
  world.defaultContactMaterial.contactEquationStiffness = 1e7;
  world.defaultContactMaterial.restitution = 0.5;
  world.broadphase.useBoundingBoxes = true;

  // Create paddle (kinematic, moves with player)
  const paddleShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.1, 0.5)); // half extents
  paddleBody = new CANNON.Body({ mass: 0 }); // mass 0 => kinematic
  paddleBody.addShape(paddleShape);
  paddleBody.position.set(0, -2.5, 0); // adjust y as needed
  world.addBody(paddleBody);

  // Create ball (dynamic)
  const ballShape = new CANNON.Sphere(0.25); // radius
  ballBody = new CANNON.Body({
    mass: 0.1,
    position: new CANNON.Vec3(0, 0, 0),
    velocity: new CANNON.Vec3(0, 0, 0),
    material: new CANNON.Material({ restitution: 0.8 })
  });
  ballBody.addShape(ballShape);
  world.addBody(ballBody);

  // Create walls (static)
  const wallThickness = 0.1;
  const wallSize = 5;
  // Left wall
  const leftWallShape = new CANNON.Box(new CANNON.Vec3(wallThickness/2, wallSize/2, wallSize/2));
  const leftWallBody = new CANNON.Body({ mass: 0 });
  leftWallBody.addShape(leftWallShape);
  leftWallBody.position.set(-wallSize/2, 0, 0);
  world.addBody(leftWallBody);
  // Right wall
  const rightWallBody = new CANNON.Body({ mass: 0 });
  rightWallBody.addShape(leftWallShape);
  rightWallBody.position.set(wallSize/2, 0, 0);
  world.addBody(rightWallBody);
  // Top wall
  const topWallShape = new CANNON.Box(new CANNON.Vec3(wallSize/2, wallThickness/2, wallSize/2));
  const topWallBody = new CANNON.Body({ mass: 0 });
  topWallBody.addShape(topWallShape);
  topWallBody.position.set(0, wallSize/2, 0);
  world.addBody(topWallBody);
  // Bottom wall (we'll handle game over when ball goes below paddle, but we can still have a wall to bounce if needed)
  // Actually for breakout we want the ball to fall below paddle to lose, so we might not have a bottom wall, or we have it but kill velocity.
  // We'll add a bottom wall but later we will check position.
  const bottomWallBody = new CANNON.Body({ mass: 0 });
  bottomWallBody.addShape(topWallShape);
  bottomWallBody.position.set(0, -wallSize/2, 0);
  world.addBody(bottomWallBody);

  return { world, paddleBody, ballBody };
}

// Step the physics world
function stepPhysics(dt) {
  world.step(1/60, dt, 3); // 60 Hz, dt in seconds, max sub steps
}

// Get paddle position
function getPaddlePosition() {
  return new THREE.Vector3(paddleBody.position.x, paddleBody.position.y, paddleBody.position.z);
}

// Get ball position
function getBallPosition() {
  return new THREE.Vector3(ballBody.position.x, ballBody.position.y, ballBody.position.z);
}

// Set paddle position (kinematic)
function setPaddlePosition(x, y, z) {
  paddleBody.position.set(x, y, z);
}

// Launch ball with initial velocity
function launchBall(x, y, z) {
  ballBody.velocity.set(x, y, z);
}

// Reset ball to position above paddle
function resetBall() {
  const paddlePos = paddleBody.position;
  ballBody.position.set(paddlePos.x, paddlePos.y + 0.5, paddlePos.z);
  ballBody.velocity.set(0, 0, 0);
}

export { initPhysics, stepPhysics, getPaddlePosition, getBallPosition, setPaddlePosition, launchBall, resetBall };