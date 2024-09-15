let player;
let stars = [];
let bombs = [];
let score = 0;
let gameOver = false;
let playerSize = 50;
let starSize = 20;
let bombSize = 25;

function setup() {
  createCanvas(600, 400);
  player = new Player();
  for (let i = 0; i < 5; i++) {
    stars.push(new Star());
  }
  for (let i = 0; i < 2; i++) {
    bombs.push(new Bomb());
  }
}

function draw() {
  background(0);
  if (gameOver) {
    textSize(32);
    fill(255, 0, 0);
    textAlign(CENTER);
    text("Game Over!", width / 2, height / 2);
    textSize(20);
    text("Final Score: " + score, width / 2, height / 2 + 40);
    return;
  }
  
  player.show();
  player.move();
  
  
  for (let i = stars.length - 1; i >= 0; i--) {
    stars[i].fall();
    stars[i].show();
    if (stars[i].hits(player)) {
      score++;
      stars.splice(i, 1);
      stars.push(new Star());
    } else if (stars[i].offScreen()) {
      stars.splice(i, 1);
      stars.push(new Star());
    }
  }
  
  
  for (let i = bombs.length - 1; i >= 0; i--) {
    bombs[i].fall();
    bombs[i].show();
    if (bombs[i].hits(player)) {
      gameOver = true;
    } else if (bombs[i].offScreen()) {
      bombs.splice(i, 1);
      bombs.push(new Bomb());
    }
  }

  fill(255);
  textSize(20);
  text("Score: " + score, 50, 50);
}

class Player {
  constructor() {
    this.x = width / 2;
    this.y = height - 40;
    this.xdir = 0;
  }

  show() {
    fill(0, 0, 255);
    rect(this.x, this.y, playerSize, playerSize);
  }

  setDir(dir) {
    this.xdir = dir;
  }

  move() {
    this.x += this.xdir * 5;
    this.x = constrain(this.x, 0, width - playerSize);
  }
}

class Star {
  constructor() {
    this.x = random(width);
    this.y = random(-100, -10);
    this.speed = random(2, 5);
  }

  show() {
    fill(255, 255, 0);
    ellipse(this.x, this.y, starSize, starSize);
  }

  fall() {
    this.y += this.speed;
  }

  offScreen() {
    return this.y > height;
  }

  hits(player) {
    return dist(this.x, this.y, player.x + playerSize / 2, player.y + playerSize / 2) < (starSize + playerSize) / 2;
  }
}

class Bomb {
  constructor() {
    this.x = random(width);
    this.y = random(-100, -10);
    this.speed = random(3, 6);
  }

  show() {
    fill(255, 0, 0);
    ellipse(this.x, this.y, bombSize, bombSize);
  }

  fall() {
    this.y += this.speed;
  }

  offScreen() {
    return this.y > height;
  }

  hits(player) {
    return dist(this.x, this.y, player.x + playerSize / 2, player.y + playerSize / 2) < (bombSize + playerSize) / 2;
  }
}

function keyPressed() {
  if (keyCode === RIGHT_ARROW) {
    player.setDir(1);
  } else if (keyCode === LEFT_ARROW) {
    player.setDir(-1);
  }
}

function keyReleased() {
  player.setDir(0);
}
