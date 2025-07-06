const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 16;
const PLAYER_X = 20;
const AI_X = canvas.width - PLAYER_X - PADDLE_WIDTH;
const PADDLE_SPEED = 6;
const BALL_SPEED = 6;

// Paddle objects
const player = {
    x: PLAYER_X,
    y: canvas.height/2 - PADDLE_HEIGHT/2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0
};

const ai = {
    x: AI_X,
    y: canvas.height/2 - PADDLE_HEIGHT/2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0
};

const ball = {
    x: canvas.width/2 - BALL_SIZE/2,
    y: canvas.height/2 - BALL_SIZE/2,
    width: BALL_SIZE,
    height: BALL_SIZE,
    dx: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
    dy: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1)
};

function drawRect(x, y, w, h, color='#fff') {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color='#fff') {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2, false);
    ctx.closePath();
    ctx.fill();
}

function resetBall() {
    ball.x = canvas.width/2 - BALL_SIZE/2;
    ball.y = canvas.height/2 - BALL_SIZE/2;
    ball.dx = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
}

function draw() {
    // Clear canvas
    drawRect(0, 0, canvas.width, canvas.height, '#111');

    // Draw middle dashed line
    for (let y = 0; y < canvas.height; y += 34) {
        drawRect(canvas.width/2 - 2, y, 4, 20, '#444');
    }

    // Draw paddles
    drawRect(player.x, player.y, player.width, player.height, '#fff');
    drawRect(ai.x, ai.y, ai.width, ai.height, '#fff');

    // Draw ball
    drawCircle(ball.x + ball.width/2, ball.y + ball.height/2, BALL_SIZE/2, '#fff');
}

function update() {
    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top/bottom walls
    if (ball.y <= 0) {
        ball.y = 0;
        ball.dy *= -1;
    }
    if (ball.y + ball.height >= canvas.height) {
        ball.y = canvas.height - ball.height;
        ball.dy *= -1;
    }

    // Ball collision with paddles
    if (
        ball.x < player.x + player.width &&
        ball.x + ball.width > player.x &&
        ball.y < player.y + player.height &&
        ball.y + ball.height > player.y
    ) {
        ball.x = player.x + player.width;
        ball.dx *= -1;
        // Add some "spin" based on where paddle was hit
        let collidePoint = (ball.y + ball.height/2) - (player.y + player.height/2);
        collidePoint = collidePoint / (player.height/2);
        ball.dy = BALL_SPEED * collidePoint;
    }

    if (
        ball.x + ball.width > ai.x &&
        ball.x < ai.x + ai.width &&
        ball.y < ai.y + ai.height &&
        ball.y + ball.height > ai.y
    ) {
        ball.x = ai.x - ball.width;
        ball.dx *= -1;
        let collidePoint = (ball.y + ball.height/2) - (ai.y + ai.height/2);
        collidePoint = collidePoint / (ai.height/2);
        ball.dy = BALL_SPEED * collidePoint;
    }

    // Reset if ball goes out of bounds (score)
    if (ball.x < 0 || ball.x > canvas.width) {
        resetBall();
    }

    // Simple AI paddle movement
    let aiCenter = ai.y + ai.height/2;
    if (aiCenter < ball.y + ball.height/2 - 10) {
        ai.y += PADDLE_SPEED;
    } else if (aiCenter > ball.y + ball.height/2 + 10) {
        ai.y -= PADDLE_SPEED;
    }
    // Clamp AI paddle position
    if (ai.y < 0) ai.y = 0;
    if (ai.y + ai.height > canvas.height) ai.y = canvas.height - ai.height;
}

// Mouse movement for player paddle
canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    player.y = mouseY - player.height/2;
    // Clamp paddle position
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
});

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();