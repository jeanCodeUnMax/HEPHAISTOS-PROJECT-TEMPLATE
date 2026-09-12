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
    dx: 5
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

for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1, color: colors[r] };
    }
}

// Controls
let rightPressed = false;
let leftPressed = false;

document.addEventListener("keydown", (e) => {
    if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
    else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
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
                    if (score === brickRowCount * brickColumnCount * 10) {
                        endGame("YOU WIN!");
                    }
                }
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = ball.color;
    ctx.fill();
    ctx.closePath();
    ctx.shadowBlur = 0; // reset
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
    } else if (ball.y + ball.dy > canvas.height - ball.r) {
        // Hit bottom
        if (ball.x > paddle.x && ball.x < paddle.x + paddle.w) {
            // Hit paddle
            ball.dy = -ball.dy;
            // Add some english
            let hitPoint = ball.x - (paddle.x + paddle.w/2);
            ball.dx = hitPoint * 0.15;
        } else {
            endGame("GAME OVER");
            return;
        }
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
