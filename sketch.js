/* eslint-disable no-undef, no-unused-vars */

// Declarations
let bubbles = [];
let fishes = [];
let pellets = [];
let prowns = [];
let lites = [];
let fishfloor = [];

let ps;
let pl;

let ball;
const WATERLEVEL = 50;

let _debug = false;
let bubbleSndCount = 0;

function setup() {
  createCanvas(800, 600);
  textSize(9);
  ps = loadSound("snds/pbubble.wav", playBubble);
  pl = loadSound("snds/pbubble.wav", playBubble);
  ps.setVolume(0.1);
  pl.setVolume(0.09);

  for (let i = 0; i < 100; i++) {
    bubbles[i] = new TankBubble();
    //  playBubble();
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

function playBubble() {
  // Prevent sounds overload
  if (random() < 0.5) {
    ps.rate(random(0.01, 0.8));
    ps.play();
    ps.rate(random(0.1, 0.6));
    pl.play();
  }
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
  ps.autoplay(true);
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
  if (bubbleSndCount > 3000) {
    ps.stop();
    ps.play();
    bubbleSndCount = 0;
  }
  for (let b of bubbles) {
    b.update();
    bubbleSndCount += 1;
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

class Utils {
  static calcDist2d(a, b) {
    let dist = 0;

    dist = abs(Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2)));
    //print(dist)
    return dist;
  }
}
