//import { Foo } from "./test.js";
/* eslint-disable no-undef, no-unused-vars */

let bubbles = [];
let fishes = [];
let pellets = [];
let prowns = [];
let lites = [];
let fishfloor = [];

let ball;
const WATERLEVEL = 50;

let _debug = false;

function setup() {
  createCanvas(800, 600);
  textSize(9);
  let p = p5.Vector(0, 0);
  let k = new Foo();
  console.log(k);

  for (let i = 0; i < 100; i++) {
    bubbles[i] = new TankBubble();
  }

  for (let i = 0; i < 6; i++) {
    fishes[i] = new Fish();
  }

  for (let i = 0; i < 10; i++) {
    pellets[i] = new Pellet();
  }

  for (let i = 0; i < 5; i++) {
    prowns[i] = new Prown();
  }

  for (let i = 0; i < 1; i++) {
    lites[i] = new Lite();
  }

  createFishFloor();

  ball = new Ball(
    width / 2,
    height / 2,
    3,
    3,
    0,
    new BoundaryObject(0, 0, width, height, 50, 50)
  );
}

function createFishFloor() {
  // create fishfloor texture
  fishfloor = createImage(width, 40);
  fishfloor.loadPixels();
  for (var x = 0; x < fishfloor.width; x++) {
    for (var y = 0; y < fishfloor.height; y++) {
      //var a = map(y, 0, fishfloor.height, 255, 0);
      var c = color(random(60, 100), random(100), 0, 160);
      fishfloor.set(x, y, c);
    }
  }
  fishfloor.updatePixels();
}

function mousePressed() {
  //fishes[0].currentTarget = createVector(mouseX, mouseY);

  //b = new Bubble(fishes[0].pos.x, fishes[0].pos.y);
  b = new Bubble(mouseX, mouseY, 10);
}

function keyPressed() {
  console.log(_debug);
  if (keyCode === DOWN_ARROW) {
    if (_debug) {
      _debug = false;
    } else {
      _debug = true;
    }
  }
}

function draw() {
  background(0, 200, 255);
  noStroke();
  fill(0, 160, 180);
  rect(0, WATERLEVEL, width, height);
  // fill(255,0,0);
  // rect(0,height-20,width,height-20);
  image(fishfloor, 0, height - 40);
  fill(100, 100, 100);
  rect(100, height - 60, 5, 30);

  fill(255);

  ball.update();
  ball.render();
  doBubbles();
  doPellets();
  doFishes();
  doProwns();
  //doLites();
  // drawTankLighting();
}

function drawTankLighting() {
  noStroke();
  for (let y = 0; y < height; y += 5) {
    let k = y / 150;

    fill(80, 80, 80, k);

    rect(0, y, width, y - 2);
  }
}

function doProwns() {
  for (let p of prowns) {
    p.update();
    p.render();
  }
}
function doBubbles() {
  for (let b of bubbles) {
    b.update();
    b.render();
  }
}

function doPellets() {
  for (let p of pellets) {
    p.update();
    p.render();
  }
}

function doFishes() {
  for (let f of fishes) {
    f.update();

    f.render();
  }
}

function doLites() {
  for (let l of lites) {
    l.update();

    l.render();
  }
}

class BoundaryObject {
  constructor(left, top, right, bottom, w, h) {
    this.left = left;
    this.right = right;
    this.top = top;
    this.bottom = bottom;
    this.width = w;
    this.height = h;
  }

  static IsOutsideBounds(pos, boundObj) {
    if (
      pos.x < boundObj.left ||
      pos.x > boundObj.right - boundObj.width ||
      pos.y < boundObj.top ||
      pos.y > boundObj.bottom - boundObj.height
    ) {
      return true;
    }

    return false;
  }
}

class KinematicObject {
  constructor(
    x,
    y,
    xv,
    yv,
    xa,
    ya,
    force,
    boundObj,
    mass = 0.2,
    elasticity = 20
  ) {
    this.pos = createVector(x, y);
    this.vel = createVector(xv, yv);
    this.acc = createVector(xa, ya);
    this.accForce = force;
    this.mass = mass;
    this.elasticity = elasticity;

    this.boundObj = boundObj;
  }

  setVelLimit(limit) {
    this.vel.limit(limit);
  }

  setAccForce(force) {
    this.acc.mult(force);
  }

  applyForce(p) {
    this.acc.add(p);
  }

  updateKinematic(friction, maxVel) {
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.vel.limit(maxVel);
    this.acc.mult(-friction * this.mass);
  }

  updateBounds(l = 0, t = 0, r = 0, b = 0) {
    let p = createVector(this.pos.x, this.pos.y);

    if (p.x < this.boundObj.left + this.boundObj.width / 2) {
      p.x = this.boundObj.left + this.boundObj.width / 2;

      // apply forces at the boundaries, combines 2d collion elastic behaviors
      this.applyForce(createVector(l, 0));

      // self elasticity
      this.applyForce(createVector(this.elasticity, 0));
    }

    if (p.x > this.boundObj.right - this.boundObj.width / 2) {
      p.x = this.boundObj.right - this.boundObj.width / 2;
      this.applyForce(createVector(r, 0));
      this.applyForce(createVector(-this.elasticity, 0));
    }

    if (p.y < this.boundObj.top + this.boundObj.height / 2) {
      p.y = this.boundObj.top + this.boundObj.height / 2;
      this.applyForce(createVector(0, t));
      this.applyForce(createVector(0, this.elasticity));
    }

    if (p.y > this.boundObj.bottom - this.boundObj.height / 2) {
      p.y = this.boundObj.bottom - this.boundObj.height / 2;
      this.applyForce(createVector(0, b));
      this.applyForce(createVector(0, -this.elasticity));
    }

    this.pos = p;
  }
}

class Ball {
  constructor(x, y, xv, yv, f, boundObj) {
    this.physics = new KinematicObject(x, y, xv, yv, 0, 0, f, boundObj);
    this.visualSize = 50;
  }

  update() {
    this.physics.applyForce(createVector(0, 0));
    this.physics.updateKinematic(1, 5);

    // this.physics.pos = createVector(mouseX, mouseY);
    this.physics.updateBounds(2, 2, -2, 0);

    if (
      BoundaryObject.IsOutsideBounds(
        this.physics.pos,
        0,
        0,
        width,
        height,
        this.size,
        this.size
      )
    ) {
      console.log("Outside");
    }
  }

  render() {
    fill(255);
    stroke(0);

    ellipse(
      this.physics.pos.x,
      this.physics.pos.y,
      this.visualSize,
      this.visualSize
    );
  }
}

class TankBubble {
  constructor() {
    this.startx = 100;
    this.pos = createVector(this.startx, height - 63);
    this.vel = createVector(random(-0.08, 0.08), -random(0.09, 0.7));
    this.acc = createVector(0, 0);
    this.size = random(1, 5);
    this.atSurface = false;
    this.surfaceLife = floor(random(30));
    this.kSize = floor(random(this.size / 0.8));
  }

  update() {
    if (!this.atSurface) {
      this.vel.add(this.acc);
      this.vel.x = random(-0.7, 0.7);
      if (random(10) > 9.5) {
        this.vel.y = random(-0.09, -3.7);
      }

      if (random() < 0.001) {
        this.pos.y = height - 65 + random(2, 6);
        this.pos.x = this.startx;
      }

      this.pos.add(this.vel);
      this.vel.add(this.acc);
      this.vel.limit(-5);
      this.acc.mult(0);
    }

    if (this.pos.y < WATERLEVEL + 1) {
      this.atSurface = true;
    }

    if (this.atSurface) {
      this.vel.y = 0;
      this.pos.y = WATERLEVEL - 1 + this.kSize / 2;
      this.surfaceLife -= 0.1;
      this.vel.x = random(-1.7, 1.7);
      //this.add.mult(0.5);
      this.pos.add(this.vel);
      this.vel.add(this.acc);
      this.vel.limit(-5);
      this.acc.mult(0);
    }

    if (this.atSurface && this.surfaceLife <= 0) {
      this.pos.y = height - 65 + random(2, 6);
      this.pos.x = this.startx;
      this.atSurface = false;
      this.surfaceLife = floor(random(30));
    }
  }
  render() {
    fill(255, 255, 255, random(40, 100));
    noStroke();
    stroke(190);
    ellipse(
      this.pos.x,
      this.pos.y,
      this.size + this.kSize,
      this.size + this.kSize
    );

    noStroke();
    fill(255, 255, 255, 160);
    ellipse(
      this.pos.x + this.size / 2 + random(-1, 1),
      this.pos.y - random(0.5),
      (this.size + this.kSize) / 5,
      (this.size + this.kSize) / 5
    );
  }
}

class Fish {
  constructor() {
    this.pos = createVector(random(width / 2), random(height / 2));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.moveAroundTarget = null;
    this.currentTarget = this.chooseRandomTarget();
    this.state = 1; // 0 wait to gain energy, 1 choosePellet, 2 moveTowrds pellet, 3 eat Pellet.
    this.chosenPellet = null;
    this.stomach = floor(random(30, 100));
    this.waitTime = floor(random(50, 500));
    this.size = 17;
    this.visibility = random(60, height / 2);
    this.myBubble = new Bubble(this.pos.x, this.pos.y, random(5, 15));
    this.fishcol = floor(random(10, 120));
    this.fishpoos = [];
    this.rotation = 0;
  }

  setWaitTime(waitFor) {
    if (waitFor >= 1) {
      this.waitTime = waitFor;
    } else {
      this.waitTime = floor(random(40, 1000));
    }
  }

  chooseRandomTarget() {
    let rx = floor(random(20, width - 20));
    let ry = floor(random(WATERLEVEL + 20, height - 70));
    return createVector(rx, ry);
  }

  chooseFood() {
    // choose closest pellet

    let d = Utils.calcDist2d(this.pos, pellets[0].pos);
    let choice = 0;
    let k = 0;
    // console.log("Pellet count:" + pellets.length);
    for (let i = 1; i < pellets.length; i++) {
      k = Utils.calcDist2d(this.pos, pellets[i].pos);

      if (k < d) {
        d = k;
        choice = i;
      }
      //  console.log(d, k);
    }
    // console.log("Chosen pellet dist:" + d);

    if (d <= this.visibility) {
      this.chosenPellet = choice;
      this.currentTarget = pellets[choice].pos;

      // move towards pellet and eat
      this.state = 3;
    } else {
      //console.log(this + " cant see");
      // this.state = 0;
    }
  }

  moveAround() {
    this.moveAroundTarget = createVector(
      this.currentTarget.x,
      this.currentTarget.y
    );

    if (_debug) {
      // Target line of sight
      stroke(255, 0, 0);
      line(
        this.pos.x,
        this.pos.y,
        this.moveAroundTarget.x,
        this.moveAroundTarget.y
      );
    }

    this.moveAroundTarget.sub(this.pos);
    this.moveAroundTarget.setMag(0.2);

    this.acc = this.moveAroundTarget;

    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.vel.limit(0.7);

    let d = Utils.calcDist2d(this.pos, this.currentTarget);

    if (d <= 25 / 2) {
      this.currentTarget = this.chooseRandomTarget();
    }

    // empty stomach
    this.stomach -= 0.1;

    // when stomach empty then find food
    if (this.stomach <= 0) {
      this.state = 2;
      // chance of pooing
      if (random() > 0.2) {
        for (let k = 0; k < floor(random(20)); k++) {
          this.fishpoos.push(
            new Poo(this.pos.x, this.pos.y, this.vel.x, this.vel.y)
          );
        }
      }
    }
  }

  moveTowardsPellet() {
    this.moveAroundTarget = createVector(
      this.currentTarget.x,
      this.currentTarget.y
    );

    stroke(255, 0, 0);
    line(
      this.pos.x,
      this.pos.y,
      this.moveAroundTarget.x,
      this.moveAroundTarget.y
    );

    this.moveAroundTarget.sub(this.pos);
    this.moveAroundTarget.setMag(0.5);

    this.acc = this.moveAroundTarget;

    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.vel.limit(0.89);

    let d = Utils.calcDist2d(this.pos, this.currentTarget);

    if (d <= this.size / 2) {
      // Fish eats pellet and gain stomach
      this.stomach = pellets[this.chosenPellet].pelletValue;
      pellets[this.chosenPellet].reset();
      // set state to moving around randomly
      this.size += 1;
      this.state = 1;
      //  if (random() > 0.5) {
      //  this.myBubble = new Bubble(this.pos.x, this.pos.y, random(5, 15));
      // }
      this.vel.limit(0.3);
    }

    // empty stomach
    this.stomach -= 0.1;

    // this.chanceMoveBackwards(0.992);
  }

  waitFor() {
    this.vel.mult(0.09);
    this.waitTime -= 0.1;

    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.vel.limit(0.2);
    this.stomach -= 0.01;
    if (this.waitTime < 0) {
      this.setWaitTime(-1);
      this.state = 1;
      this.myBubble = new Bubble(this.pos.x, this.pos.y, random(5, 15));
    }

    // chance to move backwards
    this.chanceMoveBackwards(0.992);
  }

  chanceMoveBackwards(chance) {
    if (random() > chance) {
      this.vel.sub = createVector(this.vel.x + 1, 0);
    }
  }

  update() {
    // apply slight gravity
    this.vel.add(createVector(0, random(0.01, 0.2)));

    if (this.state === 1) {
      this.moveAround();
      // text(this.target, 10, 10);
      if (random() < 0.0002) {
        this.state = 0;
      }
    }

    if (this.state === 2 && this.stomach < 0) {
      this.chooseFood();
      // text(this.target, 10, 10);
    }

    if (this.state === 3) {
      this.moveTowardsPellet();
      // text(this.target, 10, 10);
    }

    // wait for a period of time until stomach is at least 0.25% full
    if (this.state === 0 && this.waitTime > 0 && this.stomach > 0) {
      this.waitFor();
      // choose randomly wait if moveing around only
    }

    // when stomach empty then find food
    if (this.stomach <= 0) {
      this.state = 2;
    }

    if (this.pos.x < 12) {
      this.pos.x = 12;
    }
    if (this.pos.x > width - 12) {
      this.pos.x = width - 12;
    }
    if (this.pos.y < WATERLEVEL + 10) {
      this.pos.y = WATERLEVEL + 10;
    }
    if (this.pos.y > height - 10) {
      this.pos.y = height - 10;
    }

    // if there is poo then render and update it
    for (let p of this.fishpoos) {
      p.update();
      p.render();
      if (p.lifetime <= 0) {
        this.fishpoos.pop(p);
      }
    }
  }

  render() {
    fill(100 + this.fishcol, 255, 100 + this.fishcol);
    stroke(100);

    let visualStomach = this.stomach / 90 + 5 + this.size;
    ellipse(this.pos.x, this.pos.y, visualStomach, visualStomach);
    stroke(0);

    // draw eyes
    //push();
    //translate(0, 0);
    //rotate(PI / 3.0);
    fill(0);
    ellipse(this.pos.x + -3, this.pos.y + 3, 3, 3);
    ellipse(this.pos.x + 6, this.pos.y + 3, 3, 3);

    // pop();
    if (_debug) {
      fill(0);
      textSize(10);
      text(this.state, this.pos.x + 10, this.pos.y + 10);
      textSize(8);
      text(floor(this.stomach), this.pos.x - 5, this.pos.y + 1);
      text(floor(this.waitTime), this.pos.x - 5, this.pos.y - 10);
    }
  }
}

class Utils {
  static calcDist2d(a, b) {
    let dist = 0;

    dist = abs(Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2)));
    //print(dist)
    return dist;
  }
}

class Prown {
  constructor() {
    this.pos = createVector(random(width), random(WATERLEVEL + 5, height - 50));
    this.vel = createVector(random(-5, 5), random(-5, 5));
    this.acc = createVector(0, 0);
    this.target = createVector(0, 0);
    this.current = createVector(0, 0);
    this.holdingPellet = this.target;
    this.state = 0; //0 move around,   1 target a pellet,  2 // move towards pellet,  3 move pellet randomly

    this.PTIME = 0.0008;
    this.MOVETIME = 0.001;
    this.energy = 1000;
    this.visibility = random(10, height);
  }
  update() {
    if (this.state === 0) {
      this.moveAround();
      if (random() < this.MOVETIME) {
        this.state = 1;
        //print(10)
      }
    }

    if (this.state === 1) {
      this.setTarget();
      this.state = 2;
    }

    if (this.state === 2) {
      this.moveTowardsPellet();

      // random chance to loose interest in the pellet
      if (random() < 0.0002) {
        this.state = 0;

        // only in state 2
        if (this.holdingPellet instanceof Pellet) {
          this.holdingPellet.vel.y = random(2, 6);
        }
      }
    }
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.vel.limit(0.3);

    this.pos.x = constrain(this.pos.x, 5, width - 5);
    this.pos.y = constrain(this.pos.y, WATERLEVEL + 2, height - 5);

    if (this.state === 2) {
      if (Utils.calcDist2d(this.pos, this.target.pos) <= 5) {
        this.state = 3;
        this.holdingPellet = this.target;
        this.current = this.setRandomPoint();
      }
    }

    if (this.state === 3) {
      this.movePelletAroundRandom();
    }
  }

  movePelletAroundRandom() {
    this.holdingPellet.pos.x = this.pos.x + 2;
    this.holdingPellet.pos.y = this.pos.y + 2;

    if (random() < this.PTIME) {
      this.state = 0;
      this.holdingPellet.vel.x = 0;
      this.holdingPellet.vel.y = 0;
    }
  }

  moveTowardsPellet() {
    this.current = createVector(this.target.pos.x, this.target.pos.y);

    this.current.sub(this.pos);
    this.current.normalize();

    this.acc = this.current;

    //console.log(this.target.pos)
    // line(this.pos.x, this.pos.y, this.target.x, this.target.y);

    // this.target.pos.mult(
    //   10.6 * 0.3 * 0.1 / (this.target.pos.mag() * this.target.pos.mag())
    // );
  }

  moveAround() {
    this.vel.x = random(-0.5, 0.5);
    this.vel.y = random(-0.5, 0.5);
  }

  setTarget() {
    let l = floor(random(pellets.length));
    let d = Utils.calcDist2d(this.pos, pellets[l].pos);
    //  if (d <= this.visibility) {
    this.target = pellets[l];
    //  } else {
    this.state = 0;
    //  }
  }

  setRandomPoint() {
    return createVector(floor(random(width)), floor(random(height - 5)));
  }

  render() {
    fill(200, 0, 0);
    noStroke();
    // textSize(24)
    // text(this.state,this.pos.x+5,this.pos.y)
    if (this.target != null) {
      //line(0, 0, this.target.x, this.target.y);
    }
    ellipse(this.pos.x, this.pos.y, 7, 7);
  }
}

class Lite {
  constructor() {
    this.pos = createVector(random(width), random(WATERLEVEL + 5, height - 50));
    this.vel = createVector(random(-5, 5), random(-5, 5));
    this.acc = createVector(0, 0);
    this.target = createVector(0, 0);
    this.current = createVector(0, 0);
    this.holdingPoo = this.target;
    this.state = 0; //0 move around,   1 target a pellet,  2 // move towards pellet,  3 move pellet randomly

    this.PTIME = 0.0008;
    this.MOVETIME = 0.001;
    this.energy = 1000;
    this.visibility = random(10, height);
  }
  update() {
    if (this.state === 0) {
      this.moveAround();
      if (random() < this.MOVETIME) {
        this.state = 1;
        //print(10)
      }
    }

    if (this.state === 1) {
      this.setTarget();
      this.state = 2;
    }

    if (this.state === 2) {
      this.moveTowardsPoo();

      // random chance to loose interest in the pellet
      if (random() < 0.0002) {
        this.state = 0;

        // only in state 2
        if (this.holdingPoo instanceof Pellet) {
          this.holdingPoo.vel.y = random(2, 6);
        }
      }
    }
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.vel.limit(0.3);

    this.pos.x = constrain(this.pos.x, 5, width - 5);
    this.pos.y = constrain(this.pos.y, WATERLEVEL + 2, height - 5);

    if (this.state === 2) {
      if (Utils.calcDist2d(this.pos, this.target.pos) <= 5) {
        this.state = 3;
        this.holdingPoo = this.target;
        this.current = this.setRandomPoint();
      }
    }

    if (this.state === 3) {
      this.movePooAroundRandom();
    }
  }

  movePooAroundRandom() {
    this.holdingPoo.pos.x = this.pos.x + 2;
    this.holdingPoo.pos.y = this.pos.y + 2;

    if (random() < this.PTIME) {
      this.state = 0;
      this.holdingPoo.vel.x = 0;
      this.holdingPoo.vel.y = 0;
    }
  }

  moveTowardsPoo() {
    if (this.target) {
      this.current = createVector(this.target.pos.x, this.target.pos.y);

      this.current.sub(this.pos);
      this.current.normalize();

      this.acc = this.current;
    } else {
      this.state = 0;
    }

    //console.log(this.target.pos)
    // line(this.pos.x, this.pos.y, this.target.x, this.target.y);

    // this.target.pos.mult(
    //   10.6 * 0.3 * 0.1 / (this.target.pos.mag() * this.target.pos.mag())
    // );
  }

  moveAround() {
    this.vel.x = random(-0.5, 0.5);
    this.vel.y = random(-0.5, 0.5);
  }

  setTarget() {
    // set random fish
    let ft = floor(random(fishes.length));
    let f = fishes[ft];
    // get random fish poo
    let pt = floor(random(f.fishpoos.length));
    let p = f.fishpoos[pt];
    if (p) {
      let d = Utils.calcDist2d(this.pos, p.pos);

      //  if (d <= this.visibility) {
      this.target = p;
      //  } else {
      this.state = 0;
    } else {
      this.state = 1;
    }
    //  }
  }

  setRandomPoint() {
    return createVector(floor(random(width)), floor(random(height - 5)));
  }

  render() {
    fill(100, 200, 200);
    noStroke();
    // textSize(24)
    // text(this.state,this.pos.x+5,this.pos.y)
    if (this.target != null) {
      //line(0, 0, this.target.x, this.target.y);
    }
    ellipse(this.pos.x, this.pos.y, 5, 5);
  }
}

class Pellet {
  constructor() {
    this.pos = createVector(random(10, width - 10), random(-20000));
    this.vel = createVector(random(-0.05, 0.05), random(0.6));
    this.acc = createVector(0, 0);
    this.size = 6;
    this.pelletValue = 50;
  }

  reset() {
    this.pos = createVector(random(10, width - 10), random(-20000));
    this.vel = createVector(random(-0.05, 0.05), random(0.6));
    this.acc = createVector(0, 0);
  }

  update() {
    this.vel.x = random(-0.177, 0.177);
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.vel.limit(0.4);

    if (this.pos.y >= height - random(10, 30)) {
      //this.pos.y = random(-100, -10);
      //this.pos.x = random(width / 2);
      this.vel.x = random(-0.07 * sin(30), 0.07 * sin(30));
      //this.vel.y =0;
      this.acc = 0.4;
    }
    if (this.pos.x < 0) {
      this.pos.x = 0;
    }
    if (this.pos.x > width - this.size) {
      this.pos.x = width - this.size;
    }

    // if outside the boundary, take out and set to start from top
    if (this.pos.x > width + this.size || this.pos.x < 0) {
      this.pos = createVector(random(10, width - 10), random(-5000));
    }

    if (this.pos.y > height + this.size) {
      this.pos = createVector(random(10, width - 10), random(-5000));
    }

    // check if pellet is in air, if so drop quicker.
    if (this.pos.y <= WATERLEVEL) {
      this.vel.y = random(1, 4);
      this.vel.limit(10);
    } else {
      this.vel.limit(random(0.3, 0.3));
      // if pellet vel is very low then add gravity
      if (this.vel.y > 0.2) {
        this.vel.y = random(0.6);
      }
    }
  }

  render() {
    fill(0, 230, 0);
    stroke(100, 100, 100, 180);
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
  }
}

class Poo {
  constructor(x, y, xv, yv) {
    this.pos = createVector(x, y);
    this.vel = createVector(xv, random(3));
    this.acc = createVector(0, 0);
    this.size = 3;
    this.lifetime = 10000;
  }

  reset() {
    this.pos = createVector(-1000, -1000);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
  }

  update() {
    this.lifetime -= 0.1;
    this.vel.x = random(-0.133, 0.133);
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.vel.limit(0.2);

    if (this.pos.x < 0) {
      this.pos.x = 0;
    }
    if (this.pos.x > width - this.size) {
      this.pos.x = width - this.size;
    }

    // if outside the boundary, take out and set to start from top
    if (this.pos.x > width + this.size || this.pos.x < 0) {
      this.reset();
    }

    if (this.pos.y > height - random(25)) {
      this.vel.mult(0);
    }

    this.vel.limit(random(0.3, 0.3));
    // if pellet vel is very low then add gravity
    if (this.vel.y > 0.2) {
      this.vel.y = random(0.1, 0.4);
    }
  }

  render() {
    //fill(165, 42, 42);
    fill(255, 255, 255);
    stroke(100, 100, 100, 180);
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
  }
}

// class StateMachine {
//   constructor() {
//     this.states = [];
//     this.prevState = null;
//     this.currentState = null;
//   }

//   transition(s) {
//     this.prevState = this.currentState;
//     this.currentState = s;
//   }
// }

// class State {
//   constructor(s, f) {
//     this.data = s;
//     this.transitValue = f;
//   }
// }

class Bubble {
  constructor(x, y, s) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-0.08, 0.08), -random(0.09, 0.6));
    this.acc = createVector(0, 0);
    this.size = s;
    this.atSurface = false;
    this.surfaceLife = floor(random(30));
    this.kSize = floor(random(this.size / 0.8));
  }

  update() {
    if (!this.atSurface) {
      this.vel.add(this.acc);
      this.vel.x = random(-0.7, 0.7);
      if (random(10) > 9.5) {
        this.vel.y = random(-0.09, -1.9);
      }

      this.pos.add(this.vel);
      this.vel.add(this.acc);
      this.vel.limit(-5);
      this.acc.mult(0);
    }

    if (this.pos.y < WATERLEVEL + 1) {
      this.atSurface = true;
    }

    if (this.atSurface) {
      this.vel.y = 0;
      this.pos.y = WATERLEVEL - 1 + this.kSize / 2;
      this.surfaceLife -= 0.1;
      this.vel.x = random(-1.7, 1.7);
      //this.add.mult(0.5);
      this.pos.add(this.vel);
      this.vel.add(this.acc);
      this.vel.limit(-5);
      this.acc.mult(0);
    }

    if (this.atSurface && this.surfaceLife <= 0) {
      this.pos.y = -100;
      this.pos.x = -100;
      this.atSurface = false;
    }
  }
  render() {
    fill(255, 255, 100, random(10, 170));

    stroke(190);
    ellipse(
      this.pos.x,
      this.pos.y,
      this.size + this.kSize,
      this.size + this.kSize
    );

    noStroke();
    fill(255, 255, 255, 160);
    ellipse(
      this.pos.x + this.size / 2 + random(-1, 1),
      this.pos.y - random(0.5),
      (this.size + this.kSize) / 5,
      (this.size + this.kSize) / 5
    );
  }
}
