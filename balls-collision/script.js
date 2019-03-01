(function() {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
})();

function rand(min, max, precision) {
  var x = Math.random() * (max - min) + min;
  var p = Math.pow(10, precision);
  return Math.round(x * p) / p;
}

const canvas = $('#canvas')[0];
const ctx = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 500;

let mouse = { x: undefined, y: undefined };

class Ball {
  constructor(args) {
    this.cl = args.color;
    this.x = args.x;
    this.y = args.y;
    this.vx = args.vx;
    this.vy = args.vy;
    this.r = args.radius;
  }

  draw() {
    ctx.fillStyle = this.cl;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2, false);
    ctx.fill();
  }

  update() {
    this.draw();

    for (let i = 0; i < balls.length; i++) {
      if (this === balls[i]) continue;
      if (distance(this, balls[i]) <= 0) collision(this, balls[i]);
    }

    this.x += this.vx;
    this.y += this.vy;

    if (this.x + this.r >= canvas.width || this.x - this.r <= 0) this.vx = -this.vx;
    if (this.y + this.r >= canvas.height || this.y - this.r <= 0) this.vy = -this.vy;
  }
}

let balls = [];

canvas.addEventListener('click', e => {

  balls.push(new Ball({
    color: 'blue',
    x: mouse.x,
    y: mouse.y,
    vx: rand(-5, 5, 2),
    vy: rand(-5, 5, 2),
    radius: rand(25, 50, 0)
  }));
  
  console.log(balls.length);
});

canvas.addEventListener('mousemove', e => {
  mouse.x = e.offsetX;
  mouse.y = e.offsetY;
});


function distance(b1, b2) {
  let xDist = b1.x - b2.x;
  let yDist = b1.y - b2.y;
  return Math.floor(Math.sqrt(xDist * xDist + yDist * yDist) - (b1.r + b2.r));
}

function rotate(vx, vy, angle) {
  const x = vx * Math.cos(angle) - vy * Math.sin(angle);
  const y = vx * Math.sin(angle) + vy * Math.cos(angle);

  return {x, y};
}

function collision(b1, b2) {
  const xVd = b1.vx - b2.vx;
  const yVd = b1.vy - b2.vy;

  const xDist = b2.x - b1.x;
  const yDist = b2.y - b1.y;

  if (xVd * xDist + yVd * yDist >= 0) {
    const angle = -Math.atan2(b2.y - b1.y, b2.x - b1.x);

    const m1 = b1.r;
    const m2 = b2.r;

    const u1 = rotate(b1.vx, b1.vy, angle);
    const u2 = rotate(b2.vx, b2.vy, angle);

    const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
    const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

    const vFinal1 = rotate(v1.x, v1.y, -angle);
    const vFinal2 = rotate(v2.x, v2.y, -angle);

    b1.vx = vFinal1.x;
    b1.vy = vFinal1.y;

    b2.vx = vFinal2.x;
    b2.vy = vFinal2.y;
  }
}


function draw() {
  requestAnimationFrame(draw);
  
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  balls.forEach(b => b.update());
}

requestAnimationFrame(draw);