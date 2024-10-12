let player;
let stars = [];
let bombs = [];
let score = 0;
let gameOver = false;
let playerSize = 50;
let starSize = 20;
let bombSize = 25;

// Q-learning variables
let Q = {}; // Q-table to store state-action values
let epsilon = 1.0; 
let alpha = 0.9;
let gamma = 0.5; 
let intervalId;

// Setup game environment
function setup() {
  createCanvas(600, 400);
  resetGame();
  frameRate(30);
  intervalId = setInterval(gameLoop, 100);  // Run game loop every 100ms
}

function draw() {
  background(0);
  if (gameOver) {
    clearInterval(intervalId);
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
      score += 10; // Increase score for collecting a star
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

// Star class
class Star {
  constructor() {
    this.x = random(width);
    this.y = random(-100, -10);
    this.speed = random(2, 5);
  }

  show() {
    fill(255, 255, 0); // Yellow star
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

// Bomb class
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

// Q-learning functions
function getState() {
  let nearestStar = getNearestObject(stars);
  let nearestBomb = getNearestObject(bombs);

  return {
    playerX: Math.floor(player.x / 50), 
    nearestStarX: Math.floor(nearestStar.x / 50),
    nearestStarY: Math.floor(nearestStar.y / 50),
    nearestBombX: Math.floor(nearestBomb.x / 50),
    nearestBombY: Math.floor(nearestBomb.y / 50)
  };
}

function getNearestObject(objects) {
  let nearestObject = objects[0];
  let minDist = dist(player.x, player.y, nearestObject.x, nearestObject.y);

  for (let obj of objects) {
    let d = dist(player.x, player.y, obj.x, obj.y);
    if (d < minDist) {
      minDist = d;
      nearestObject = obj;
    }
  }

  return nearestObject;
}

function getReward() {
  if (gameOver) {
    return -100;  
  }
  return score; 
}

function chooseAction(state) {
  if (Math.random() < epsilon) {
    return Math.floor(Math.random() * 3); 
  } else {
    let actions = Q[JSON.stringify(state)] || [0, 0, 0]; 
    return actions.indexOf(Math.max(...actions)); 
  }
}

function updateQ(state, action, reward, nextState) {
  let stateKey = JSON.stringify(state);
  let nextStateKey = JSON.stringify(nextState);

  if (!Q[stateKey]) {
    Q[stateKey] = [0, 0, 0];  
  }

  let actions = Q[nextStateKey] || [0, 0, 0]; // Q-values for next state
  let maxNextQ = Math.max(...actions);  // Best future Q-value
  Q[stateKey][action] += alpha * (reward + gamma * maxNextQ - Q[stateKey][action]);
}

// Game loop controlled by Q-learning
function gameLoop() {
  let state = getState();
  let action = chooseAction(state);

  if (action === 0) {
    player.setDir(-1); 
  } else if (action === 2) {
    player.setDir(1); 
  } else {
    player.setDir(0); // Stay still
  }

  draw();

  let reward = getReward();
  let nextState = getState();

  // Update Q-table
  updateQ(state, action, reward, nextState);

  if (gameOver) {
    resetGame();
  }
}

function resetGame() {
  player = new Player();
  stars = [];
  bombs = [];
  score = 0;
  gameOver = false;

  for (let i = 0; i < 5; i++) {
    stars.push(new Star());
  }
  for (let i = 0; i < 2; i++) {
    bombs.push(new Bomb());
  }

  clearInterval(intervalId);
  intervalId = setInterval(gameLoop, 100);  
}
