const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const messageEl = document.getElementById("message");

let score = 0;
let isGameOver = false;

// Paddle
const paddle = {
    w: 100, h: 10,
    x: canvas.width / 2 - 50, y: canvas.height - 30,
    color: "#0ff",
    dx: 7
};

// Ball
const ball = {
    x: canvas.width / 2, y: canvas.height - 50,
    r: 8,
    dx: 4, dy: -4,
    color: "#fff"
};

// Bricks
const brickRowCount = 5;
const brickColumnCount = 9;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 50;
const brickOffsetLeft = 20;

const bricks = [];
const colors = ["#f0f", "#0ff", "#ff0", "#0f0", "#f00"];

let totalBricks = 0;
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1, color: colors[r] };
        totalBricks++;
    }
}

// Powerups & Lasers
const powerups = [];
const bullets = [];
let laserActive = false;

// Controls
let rightPressed = false;
let leftPressed = false;

document.addEventListener("keydown", (e) => {
    if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
    else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
    else if (e.code === "Space" && laserActive) {
        bullets.push({x: paddle.x + paddle.w/2, y: paddle.y, dy: -6});
    }
});
document.addEventListener("keyup", (e) => {
    if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
    else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
});
document.addEventListener("mousemove", (e) => {
    const relativeX = e.clientX - canvas.getBoundingClientRect().left;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddle.x = relativeX - paddle.w / 2;
    }
});

function spawnPowerup(x, y) {
    if (Math.random() < 0.25) { // 25% chance
        const types = ["money", "laser", "night", "fast"];
        const type = types[Math.floor(Math.random() * types.length)];
        powerups.push({ x: x + brickWidth/2, y: y, type: type, dy: 3 });
    }
}

function activatePowerup(type) {
    if (type === "money") {
        score += 50;
    } else if (type === "laser") {
        laserActive = true;
        paddle.color = "#f0f"; // Change paddle color to indicate laser
        setTimeout(() => { laserActive = false; paddle.color = "#0ff"; }, 5000);
    } else if (type === "night") {
        document.body.classList.add("night-mode");
        canvas.classList.add("night-mode");
        setTimeout(() => {
            document.body.classList.remove("night-mode");
            canvas.classList.remove("night-mode");
        }, 3000);
    } else if (type === "fast") {
        let oldDx = ball.dx; let oldDy = ball.dy;
        ball.dx *= 1.5; ball.dy *= 1.5;
        setTimeout(() => {
            // Restore signs properly
            ball.dx = (ball.dx > 0 ? 1 : -1) * Math.abs(oldDx);
            ball.dy = (ball.dy > 0 ? 1 : -1) * Math.abs(oldDy);
        }, 4000);
    }
    scoreEl.innerText = `SCORE: ${score}`;
}

function checkWin() {
    let activeBricks = 0;
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) activeBricks++;
        }
    }
    if (activeBricks === 0) {
        endGame("YOU WIN!");
    }
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status === 1) {
                if (ball.x > b.x && ball.x < b.x + brickWidth && ball.y > b.y && ball.y < b.y + brickHeight) {
                    ball.dy = -ball.dy;
                    b.status = 0;
                    score += 10;
                    scoreEl.innerText = `SCORE: ${score}`;
                    spawnPowerup(b.x, b.y);
                    checkWin();
                }
            }
        }
    }
}

function updatePowerups() {
    ctx.font = "20px sans-serif";
    for(let i = powerups.length -1; i >= 0; i--) {
        let p = powerups[i];
        p.y += p.dy;
        
        let icon = "💰";
        if (p.type === "laser") icon = "🔫";
        if (p.type === "night") icon = "🕶️";
        if (p.type === "fast") icon = "⚡";
        
        ctx.fillText(icon, p.x - 10, p.y);
        
        // collision with paddle
        if (p.y + 10 > paddle.y && p.y - 20 < paddle.y + paddle.h && p.x > paddle.x && p.x < paddle.x + paddle.w) {
            activatePowerup(p.type);
            powerups.splice(i, 1);
        } else if (p.y > canvas.height) {
            powerups.splice(i, 1);
        }
    }
}

function updateBullets() {
    ctx.fillStyle = "#f0f";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#f0f";
    for (let i = bullets.length -1; i >= 0; i--) {
        let b = bullets[i];
        b.y += b.dy;
        ctx.fillRect(b.x - 2, b.y, 4, 15);
        
        let hit = false;
        for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                let bk = bricks[c][r];
                if (bk.status === 1) {
                    if (b.x > bk.x && b.x < bk.x + brickWidth && b.y > bk.y && b.y < bk.y + brickHeight) {
                        bk.status = 0;
                        hit = true;
                        score += 10;
                        scoreEl.innerText = `SCORE: ${score}`;
                        spawnPowerup(bk.x, bk.y);
                        checkWin();
                    }
                }
            }
        }
        if (hit || b.y < 0) {
            bullets.splice(i, 1);
        }
    }
    ctx.shadowBlur = 0;
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = ball.color;
    ctx.fill();
    ctx.closePath();
    ctx.shadowBlur = 0; 
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
    ctx.fillStyle = paddle.color;
    ctx.shadowBlur = 15;
    ctx.shadowColor = paddle.color;
    ctx.fill();
    ctx.closePath();
    ctx.shadowBlur = 0;
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = bricks[c][r].color;
                ctx.shadowBlur = 10;
                ctx.shadowColor = bricks[c][r].color;
                ctx.fill();
                ctx.closePath();
                ctx.shadowBlur = 0;
            }
        }
    }
}

function draw() {
    if (isGameOver) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawBricks();
    updateBullets();
    updatePowerups();
    drawBall();
    drawPaddle();
    collisionDetection();
    
    // Bounce left/right
    if (ball.x + ball.dx > canvas.width - ball.r || ball.x + ball.dx < ball.r) {
        ball.dx = -ball.dx;
    }
    // Bounce top
    if (ball.y + ball.dy < ball.r) {
        ball.dy = -ball.dy;
    }
    
    // Bounce bottom / Paddle logic FIX
    if (ball.y + ball.dy + ball.r > paddle.y && ball.y + ball.r < paddle.y + paddle.h) {
        // If within X bounds of paddle
        if (ball.x > paddle.x && ball.x < paddle.x + paddle.w) {
            ball.dy = -Math.abs(ball.dy); // Force upward movement
            let hitPoint = ball.x - (paddle.x + paddle.w/2);
            ball.dx = hitPoint * 0.15;
        }
    } else if (ball.y + ball.dy > canvas.height - ball.r) {
        endGame("GAME OVER");
        return;
    }
    
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    if (rightPressed && paddle.x < canvas.width - paddle.w) {
        paddle.x += paddle.dx;
    } else if (leftPressed && paddle.x > 0) {
        paddle.x -= paddle.dx;
    }
    
    requestAnimationFrame(draw);
}

function endGame(msg) {
    isGameOver = true;
    messageEl.innerText = msg;
    messageEl.classList.remove("hidden");
}

draw();
