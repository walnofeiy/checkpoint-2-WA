// Game settings
const grassColor = '#4cbc42';
const roadColor = '#696969';
const chickenCrownColor = '#ff0000';
const chickenColor = '#ffffff';
const enemyColor = '#ffff00';
const roadHeight = 64;
const moveX = 64;
const numberRoads = 10;
const bottomOffset = 40;

// Screen classes 

class startScreen {
  //put instruction here

  //if (mouseX > 30 && mouseX < 130 && mouseY > 25 && mouseY < 75) {
  draw() {
    fill(0, 0, 0, 200);
    noStroke();
    //rect(btnx + 50, btny + 75, 200, 100);
    rect(width / 2, height / 2, 0.8 * width, 0.8 * height);
    fill(255);
    textSize(24);
    textAlign(CENTER, CENTER);
    text("Crossy Road Game\nby Wejdan Alnofeiy", width / 2, height / 4, 0.8 * width, 0.4 * height);
    textSize(12);
    text("Press <space> to show instructions", width / 2, height * 3 / 4, 0.8 * width, 0.4 * height);

    // Display the chicken
    Chicken.xpos = width / 2;
    Chicken.ypos = height / 2;
    Chicken.display();
  }


}

class instructionScreen {
  //put instruction here

  //if (mouseX > 30 && mouseX < 130 && mouseY > 25 && mouseY < 75) {
  draw() {
    fill(0, 0, 0, 200);
    noStroke();
    //rect(btnx + 50, btny + 75, 200, 100);
    rect(width / 2, height / 2, 0.8 * width, 0.8 * height);
    fill(255);
    textSize(24);
    textAlign(CENTER, CENTER);
    text("Crossy Road Game\nby Wejdan Alnofeiy", width / 2, height / 4, 0.8 * width, 0.4 * height);
    textSize(12);

    // Define the instructions text here
    textAlign(LEFT, CENTER);
    let instr = `Press W, A, S, D to move the chicken
    Difficulty levels:
    - Easy - Chicken crosses the roads alone.
    - Medium - Race against an NPC.
    - Hard - Race against an NPC with faster cars.
    Press 
    - <1> to start in easy mode
    - <2> to start in medium mode
    - <3> to start int difficult mode.
    `;

    text(instr, width / 2, height * 3 / 4, 0.6 * width, 0.4 * height);

    // Draw the chicken
    Chicken.xpos = width / 2;
    Chicken.ypos = height / 2;
    Chicken.display();
  }


}

class winScreen {
  //if (mouseX > 30 && mouseX < 130 && mouseY > 25 && mouseY < 75) {
  draw() {
    fill(0, 0, 0, 200);
    noStroke();
    //rect(btnx + 50, btny + 75, 200, 100);
    rect(width / 2, height / 2, 0.8 * width, 0.8 * height);
    fill(255);
    textSize(24);
    textAlign(CENTER, CENTER);
    text("You Won!", width / 2, height / 4, 0.8 * width, 0.4 * height);

    text(`Score: ${score}`, width / 2, height / 2, 0.8 * width, 0.4 * height);
    textSize(12);
    text("Press <space> to show instructions", width / 2, height * 3 / 4, 0.8 * width, 0.4 * height);
  }
}

class gameOverScreen {
  draw() {
    fill(0, 0, 0, 200);
    noStroke();
    //rect(btnx + 50, btny + 75, 200, 100);
    rect(width / 2, height / 2, 0.8 * width, 0.8 * height);
    fill(255);
    textSize(24);
    textAlign(CENTER, CENTER);
    text("Game Over!", width / 2, height / 4, 0.8 * width, 0.4 * height);

    text(`Score: ${score}`, width / 2, height / 2, 0.8 * width, 0.4 * height);
    textSize(12);
    text("Press <space> to show instructions", width / 2, height * 3 / 4, 0.8 * width, 0.4 * height);
  }
}

// Create the screens 
const InstructionScreen = new instructionScreen();
const StartScreen = new startScreen();
const WinScreen = new winScreen();
const GameOverScreen = new gameOverScreen();


// Game variables 
let screen = StartScreen;
let Chicken = null;
let Enemy = null;
let lives = 0;
let score = 0;
let level = 1;
let gameOver = true;

// Game objects
const roads = [];

// Object classes 
class road {
  constructor(ypos, movement, spawnInterval, spawnProb, carSpeed) {
    this.ypos = ypos;
    this.cars = [];
    this.movement = movement;
    this.interval = spawnInterval;
    this.prob = spawnProb;
    this.speed = carSpeed;
  }

  draw() {
    // Draw road background
    noStroke();
    fill(roadColor);
    rect(width / 2, this.ypos, width, roadHeight);

    roadlines(this.ypos);

    // Draw the cars
    this.cars.forEach(car => car.display());
  }

  leftSpawnLoc() {
    return -60;
  }

  rightSpawnLoc() {
    return width + 60;
  }

  spawn() {
    // Create a car 
    if ((frameCount % this.interval) == 0 && random() > this.prob) {
      if (this.movement == 'L') {
        // Add if there is no car 
        let canSpawn = true;
        for (let i = 0; i < this.cars.length; i++) {
          if (this.cars[i].xpos > (width - 60)) {
            canSpawn = false;
            break;
          }
        }

        if (canSpawn)
          this.cars.push(new car(this.rightSpawnLoc(), this.ypos, this.speed));
      } else {
        // Add if there is no car 
        let canSpawn = true;
        for (let i = 0; i < this.cars.length; i++) {
          if (this.cars[i].xpos < 60) {
            canSpawn = false;
            break;
          }
        }

        if (canSpawn)
          this.cars.push(new car(this.leftSpawnLoc(), this.ypos, this.speed));
      }
    }
  }

  move() {
    // For each car 
    this.cars.forEach(car => {
      if (this.movement == 'L') {
        car.moveL();
      } else {
        car.moveR();
      }
    }, this);

    // Filter cars out of bounds
    if (this.movement == 'L') {
      this.cars = this.cars.filter(car => !(car.xpos < this.leftSpawnLoc()), this);
    } else {
      this.cars = this.cars.filter(car => !(car.xpos > this.rightSpawnLoc()), this);
    }
  }
}

function roadlines(ypos) {
  //draw a road background here
  for (let i = 0; i < width; i += 40) {
    stroke(255);
    line(i, ypos, i + 25, ypos);
  }
}

class car {
  //create car objects
  //two rounded, vertical rect + a big rounded horizontal rect
  //randomize color
  constructor(_x, _y, speed) {
    //put parameters in here x,y, color, speed
    this.xpos = _x;
    this.ypos = _y;
    this.r = random(255);
    this.g = random(255);
    this.b = random(255);
    this.speed = speed;
  }
  display() {
    //draw using rect
    //noStroke();

    //wheels
    fill(0);
    rect(this.xpos - 10, this.ypos, 10, 35, 30);
    rect(this.xpos + 10, this.ypos, 10, 35, 30);

    //body
    fill(this.r, this.g, this.b);
    rect(this.xpos, this.ypos, 55, 20, 13);

  }
  moveR() {
    //using push & pop to move the cars to the right
    this.xpos += this.speed;
  }
  moveL() {
    this.xpos -= this.speed;
  }
  stop() {
    this.speed = 0;

    //console.log("hi");
  }

  contains(x, y) {
    // Check if point is within the car's hit box 
    return (this.xpos - 30) < x && x < (this.xpos + 30) && (this.ypos - 10) < y && y < (this.ypos + 10);
  }
}


function periodicMovement(min, max, freq, phase) {
  let s = sin(2 * PI * frameCount / freq + phase);
  return min + (max - min) / 2 * s;
}


class chicken {
  //create a chicken 
  constructor() {
    //put parameters in here -size,x,y
    this.xpos = width / 2;
    this.ypos = 0;
  }

  display() {
    //draw the chicken using rect

    noStroke();
    fill(chickenColor);
    rect(this.xpos, this.ypos, 30, 50);

    let wingsY = periodicMovement(-1, 5, 50, 0);

    //wings
    rect(this.xpos - 20, this.ypos + wingsY, 10, 20);
    rect(this.xpos + 20, this.ypos + wingsY, 10, 20);

    //crown
    fill(chickenCrownColor);
    rect(this.xpos, this.ypos - 27, 10, 15);

    //eyes
    fill(0);
    rect(this.xpos - 7, this.ypos - 8, 5);
    rect(this.xpos + 7, this.ypos - 8, 5);

    //beak
    fill(255, 0, 0);
    rect(this.xpos, this.ypos, 6, 6);
    fill(255, 100, 0);
    rect(this.xpos, this.ypos + 6, 4, 6)

    //feet
    fill(255, 100, 0);
    rect(this.xpos - 7, this.ypos + 30, 4, 10);
    rect(this.xpos + 7, this.ypos + 30, 4, 10);
  }

  moveUp() {
    if (!this.hitsEnemy(this.xpos, this.ypos - roadHeight)) {
      this.ypos -= roadHeight;
    }
  }

  hitsEnemy(x, y) {
    return level > 1 && Enemy.xpos == x && Enemy.ypos == y;
  }

  moveDown() {
    if (this.ypos < 0 && !this.hitsEnemy(this.xpos, this.ypos + roadHeight)) {
      this.ypos += roadHeight;
    }
  }

  moveLeft() {
    if (this.xpos >= moveX && !this.hitsEnemy(this.xpos - moveX, this.ypos)) {
      this.xpos -= moveX;
    }
  }

  moveRight() {
    if (this.xpos <= (width - moveX) && !this.hitsEnemy(this.xpos + moveX, this.ypos)) {
      this.xpos += moveX;
    }
  }

}

class enemy {
  // enemy states:
  // 1 - grass
  // 2 - road 
  constructor() {
    //put parameters in here -size,x,y
    this.xpos = width / 2 + moveX;
    this.ypos = 0;
    this.state = 1;
    this.interval = 30;
  }

  display() {
    //draw the chicken using rect

    noStroke();
    fill(enemyColor);
    rect(this.xpos, this.ypos + 15, 30, 30);

    let wingsY = periodicMovement(-1, 5, 50, 0);

    //wings
    rect(this.xpos - 20, this.ypos + 12 + wingsY, 10, 20);
    rect(this.xpos + 20, this.ypos + 12 + wingsY, 10, 20);

    //head
    fill(enemyColor);
    circle(this.xpos, this.ypos - 10, 30);
    //rect(this.xpos, this.ypos - 27, 10, 15);

    //eyes
    fill(0);
    rect(this.xpos - 7, this.ypos - 10, 5);
    rect(this.xpos + 7, this.ypos - 10, 5);

    //beak
    fill(0, 0, 0);
    rect(this.xpos, this.ypos - 2, 6, 6);
    //fill(255, 100, 0);
    //rect(this.xpos, this.ypos + 6, 4, 6)

    //feet
    fill(0, 0, 0);
    rect(this.xpos - 7, this.ypos + 30, 4, 10);
    rect(this.xpos + 7, this.ypos + 30, 4, 10);
  }

  moveUp() {
    this.ypos -= roadHeight;
  }

  moveDown() {
    if (this.ypos < 0) {
      this.ypos += roadHeight;
    }
  }

  moveLeft() {
    if (this.xpos >= moveX) {
      this.xpos -= moveX;
    }
  }

  moveRight() {
    if (this.xpos <= (width - moveX)) {
      this.xpos += moveX;
    }
  }

  getRoad(y) {
    // Find if this is on the road or not
    let rd = null;
    for (let i = 0; i < roads.length; i++) {
      if (roads[i].ypos == y) {
        return roads[i];
      }
    }

    return null;
  }

  getRoadAhead() {
    return this.getRoad(this.ypos - roadHeight);
  }

  isThereACar(rd, x, y) {
    for (let i = 0; i < rd.cars.length; i++) {
      if (rd.cars[i].contains(x - 30, y) || rd.cars[i].contains(x + 30, y)) {
        return rd.cars[i];
        break;
      }
    }

    return null;
  }

  move() {
    if (frameCount % this.interval != 0)
      return;

    if (this.state === 1) {
      // Grass state
      // Find if this is on the road or not
      let rd = this.getRoadAhead();

      if (rd != null) {
        // Next is a road 
        // Check if there is a car 
        let cr = this.isThereACar(rd, this.xpos, this.ypos - roadHeight);

        // There is no car
        if (cr == null) {
          this.moveUp();
          this.state = 2;
        }
      } else {
        // Next is grass 
        this.moveUp();
        this.state = 1;
      }
    } else {
      // Road state 
      let rd = this.getRoadAhead();

      if (rd == null) {
        // Next is grass
        this.moveUp();
        this.state = 1;
      } else {
        // Next is road 
        // Check if there is a car 
        let cr = this.isThereACar(rd, this.xpos, this.ypos - roadHeight);

        // There is no car
        if (cr == null) {
          this.moveUp();
        } else {
          rd = this.getRoad(this.ypos);
          if (rd != null) {
            // Do nothing. Wait for next 
            // Move to left/right
            if (rd.movement == 'L') {
              this.moveLeft();
            } else {
              this.moveRight();
            }
          }
        }
      }
    }
  }

}


function setup() {
  createCanvas(500, 500);
  rectMode(CENTER);

  Chicken = new chicken();
  Enemy = new enemy();
}

function heart(x, y, size) {
  beginShape();
  vertex(x, y);
  bezierVertex(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
  bezierVertex(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
  endShape(CLOSE);
}

function drawLife(x, y) {
  fill('#FF0000');
  noStroke();
  heart(x, y - 10, 20);
}

function draw() {
  background(grassColor);

  // Apply view transformation 
  push();

  // Spawn and move cars 
  roads.forEach(rd => { rd.spawn(); rd.move(); });

  // Move the enemy
  if (level > 1 && !gameOver) {
    Enemy.move();
  }

  // Keep the chicken in the middle of the game 
  translate(0, height / 2 - Chicken.ypos);
  roads.forEach(rd => rd.draw());
  checkCollision();
  Chicken.display();

  if (level > 1) {
    Enemy.display();
  }

  pop();

  // Display splash screens
  if (screen != null) {
    screen.draw();
  } else {
    // Display game details
    drawLives();
    displayScore();
    displayLevel();
  }

  // Check if we win 
  if (!gameOver && Chicken.ypos < roads[roads.length - 1].ypos) {
    gameOver = true;
    score = computeScore();
    screen = WinScreen;
  }

  // Check if enemy is done
  if (!gameOver && level > 1 && Enemy.ypos < roads[roads.length - 1].ypos) {
    gameOver = true;
    score = computeScore();
    screen = GameOverScreen;
  }
}

function keyPressed() {
  if (gameOver) {
    if (keyCode == 32) {
      if (screen === StartScreen) {
        screen = InstructionScreen;
      } else if (screen === WinScreen) {
        screen = InstructionScreen;
      } else if (screen === GameOverScreen) {
        screen = InstructionScreen;
      }
    } else if (screen === InstructionScreen) {
      // Check the level
      switch (keyCode) {
        case 49:
          level = 1;
          initLevel1();
          break;
        case 50:
          level = 2;
          initLevel2();
          break;
        case 51:
          level = 3;
          initLevel3();
          break;
        default:
          level = 0;
          break;
      }

      if (level > 0) {
        // Hide splash screens
        screen = null;

        // Move the chicken below to starting point 
        Chicken.ypos = 0;
        Chicken.xpos = width / 2;

        // Move the enemy to the starting point 
        if (level > 1) {
          Enemy.ypos = 0;
          Enemy.xpos = width / 2 + moveX;
        }

        // Record start game time 
        lives = 3;
        gameOver = false;
      }
    }
  } else {
    // Check for arrow keys 
    if (keyCode == 68) {
      Chicken.moveRight();
    } else if (keyCode == 65) {
      Chicken.moveLeft();
    } else if (keyCode == 87) {
      Chicken.moveUp();
    } else if (keyCode == 83) {
      Chicken.moveDown();
    }
  }
}

function findNearestGrass(y) {
  let i = roads.length - 1;

  // Find the road where y is on
  for (; i >= 0; i--) {
    if (roads[i].ypos >= y) {
      break;
    }
  }

  // Continue moving down 
  while (i >= 0 && roads[i].ypos == y) {
    y += roadHeight;
    i--;
  }

  // Check if y is on grass
  return y;
}

function die() {
  lives--;

  if (lives == 0) {
    score = computeScore();
    gameOver = true;
    //showInstructions = true;
    screen = GameOverScreen;
    Chicken.xpos = width / 2;
    Chicken.ypos = 0;
    level = 0;
  } else {
    // Move back to the nearest grass 
    Chicken.ypos = findNearestGrass(Chicken.ypos);
  }
}

function enemyDie() {
  // Move back to the nearest grass 
  Enemy.ypos = findNearestGrass(Enemy.ypos);
}

function checkCollisionWithCars(cars) {
  for (let i = 0; i < cars.length; i++) {
    if (cars[i].contains(Chicken.xpos, Chicken.ypos)) {
      die();
      break;
    }

    if (level > 1 && cars[i].contains(Enemy.xpos, Enemy.ypos)) {
      enemyDie();
    }
  }
}

function checkCollision() {
  // Check if there is a collision 
  roads.forEach(rd => checkCollisionWithCars(rd.cars));
}

function computeScore() {
  if (screen != null)
    return 0;
  else
    return -Chicken.ypos / roadHeight;
}

function displayScore() {
  fill(255);
  textSize(20);
  textAlign(RIGHT, CENTER);
  text(`Score: ${computeScore()}`, width - 20, height - bottomOffset);
}

function displayLevel() {
  fill(255);
  textSize(28);
  textAlign(CENTER, CENTER);
  text(`Level ${level}`, width / 2, height - bottomOffset);
}

function drawLives() {
  for (let i = 0; i < lives; i++) {
    drawLife(20 + i * 30, height - bottomOffset);
  }
}

function initLevel1() {
  // Clear the roads
  roads.length = 0;

  // Define road parameter functions
  let roadMovement = (index) => {
    return index % 2 == 0 ? 'L' : 'R';
  };

  let roadSpawnInterval = (index) => {
    return max(10, 30 - 2 * index);
  };

  let roadSpawnProb = (index) => {
    return min(0.7, 0.5 + 0.02 * index);
  };

  let roadCarSpeed = (index) => {
    return min(5, 3 + 0.04 * index);
  };

  // Create random roads
  for (let y = -roadHeight; roads.length < numberRoads;) {
    roads.push(new road(y,
      roadMovement(roads.length),
      roadSpawnInterval(roads.length),
      roadSpawnProb(roads.length),
      roadCarSpeed(roads.length)));

    // Compute spacing in random 
    let space = round(random(1, 3));
    y -= space * roadHeight;
  }

}

function initLevel2() {
  // Clear the roads
  roads.length = 0;

  // Define road parameter functions
  let roadMovement = (index) => {
    return index % 2 == 0 ? 'L' : 'R';
  };

  let roadSpawnInterval = (index) => {
    return max(10, 30 - 2 * index);
  };

  let roadSpawnProb = (index) => {
    return min(0.7, 0.5 + 0.02 * index);
  };

  let roadCarSpeed = (index) => {
    return min(5, 3 + 0.04 * index);
  };

  // Create random roads
  for (let y = -roadHeight; roads.length < numberRoads;) {
    roads.push(new road(y,
      roadMovement(roads.length),
      roadSpawnInterval(roads.length),
      roadSpawnProb(roads.length),
      roadCarSpeed(roads.length)));

    // Compute spacing in random 
    let space = round(random(1, 3));
    y -= space * roadHeight;
  }

}

function initLevel3() {
  // Clear the roads
  roads.length = 0;

  // Define road parameter functions
  let roadMovement = (index) => {
    return index % 2 == 0 ? 'L' : 'R';
  };

  let roadSpawnInterval = (index) => {
    return max(10, 30 - 3 * index);
  };

  let roadSpawnProb = (index) => {
    return min(0.9, 0.5 + 0.04 * index);
  };

  let roadCarSpeed = (index) => {
    return min(8, 3 + 0.1 * index);
  };

  // Create random roads
  for (let y = -roadHeight; roads.length < 2 * numberRoads;) {
    roads.push(new road(y,
      roadMovement(roads.length),
      roadSpawnInterval(roads.length),
      roadSpawnProb(roads.length),
      roadCarSpeed(roads.length)));

    // Compute spacing in random 
    let space = round(random(1, 3));
    y -= space * roadHeight;
  }

}