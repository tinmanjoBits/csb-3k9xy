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
