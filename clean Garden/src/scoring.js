// Score management module
let score = 0;
const scoreElement = document.createElement('div');
scoreElement.style.position = 'absolute';
scoreElement.style.top = '10px';
scoreElement.style.left = '10px';
scoreElement.style.color = '#00ff00';
scoreElement.style.fontFamily = 'monospace';
scoreElement.style.fontSize = '24px';
scoreElement.textContent = 'Score: 0';
document.body.appendChild(scoreElement);

export function addScore(points) {
  score += points;
  scoreElement.textContent = `Score: ${score}`;
}

export function getScore() {
  return score;
}

export function resetScore() {
  score = 0;
  scoreElement.textContent = 'Score: 0';
}