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
      //   if (random() < 0.1) {
      playBubble();
      //  }
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
