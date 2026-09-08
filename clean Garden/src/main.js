// Import three.js and cannon-es as ES modules
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js';
import { initPhysics, stepPhysics, getPaddlePosition, getBallPosition, setPaddlePosition, launchBall, resetBall } from './physics.js';
import { isKeyPressed, getKeys } from './input.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040, 2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

// Physics initialization
const { world, paddleBody, ballBody } = initPhysics();

// Paddle mesh (thin box)
const paddleGeometry = new THREE.BoxGeometry(1, 0.2, 1); // width, height, depth
const paddleMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00, emissive: 0x00ff00 });
const paddleMesh = new THREE.Mesh(paddleGeometry, paddleMaterial);
scene.add(paddleMesh);

// Ball mesh (sphere)
const ballGeometry = new THREE.SphereGeometry(0.25, 32, 32);
const ballMaterial = new THREE.MeshStandardMaterial({ color: 0xff00ff, emissive: 0xff00ff });
const ballMesh = new THREE.Mesh(ballGeometry, ballMaterial);
scene.add(ballMesh);

// Input handling: paddle movement speed
const paddleSpeed = 5; // units per second

// Launch ball on spacebar
let ballLaunched = false;

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
  
  // Synchronize meshes with physics bodies
  paddleMesh.position.copy(getPaddlePosition());
  paddleMesh.quaternion.copy(paddleBody.quaternion);
  
  ballMesh.position.copy(getBallPosition());
  ballMesh.quaternion.copy(ballBody.quaternion);
  
  // Simple game over condition: ball falls below paddle (optional, we'll handle later)
  // For now just keep rendering
  
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