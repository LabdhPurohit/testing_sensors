const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const ball = {
  x: 50,
  y: 50,
  radius: 10,
  color: "cyan",
  speedX: 0,
  speedY: 0
};

// Define your own path or unfair layout with obstacles
const obstacles = [
  { x: 0, y: 150, width: 300, height: 20 },
  { x: 100, y: 300, width: 300, height: 20 },
  { x: 0, y: 450, width: 300, height: 20 }
];

// Draw obstacles and ball
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw obstacles
  ctx.fillStyle = "red";
  obstacles.forEach(ob => ctx.fillRect(ob.x, ob.y, ob.width, ob.height));

  // Draw ball
  ctx.beginPath();
  ctx.fillStyle = ball.color;
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
}

function update() {
  ball.x += ball.speedX;
  ball.y += ball.speedY;

  // Wall collision
  if (ball.x < ball.radius) ball.x = ball.radius;
  if (ball.x > canvas.width - ball.radius) ball.x = canvas.width - ball.radius;
  if (ball.y < ball.radius) ball.y = ball.radius;
  if (ball.y > canvas.height - ball.radius) ball.y = canvas.height - ball.radius;

  // Obstacle collision
  for (let ob of obstacles) {
    if (
      ball.x + ball.radius > ob.x &&
      ball.x - ball.radius < ob.x + ob.width &&
      ball.y + ball.radius > ob.y &&
      ball.y - ball.radius < ob.y + ob.height
    ) {
      // Simple bounce
      ball.x -= ball.speedX;
      ball.y -= ball.speedY;
      ball.speedX = 0;
      ball.speedY = 0;
    }
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

// Tilt control logic
function handleOrientation(e) {
  const tiltX = e.gamma; // left-right
  const tiltY = e.beta;  // front-back
  ball.speedX = tiltX * 0.1;
  ball.speedY = tiltY * 0.1;
}

// Start button click
document.getElementById("startButton").addEventListener("click", () => {
  document.getElementById("startButton").style.display = "none";
  canvas.style.display = "block";
  startGame();
});

function startGame() {
  if (typeof DeviceMotionEvent?.requestPermission === "function") {
    // iOS
    DeviceMotionEvent.requestPermission()
      .then(state => {
        if (state === "granted") {
          window.addEventListener("deviceorientation", handleOrientation);
        } else {
          alert("Motion permission denied.");
        }
      })
      .catch(err => {
        console.error("Permission error:", err);
        alert("Motion permission error.");
      });
  } else {
    // Android or desktop
    window.addEventListener("deviceorientation", handleOrientation);
  }

  loop();
}
