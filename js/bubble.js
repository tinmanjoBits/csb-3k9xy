/* eslint-disable no-undef, no-unused-vars */
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
  constructor(x, y, s, k = 20, c = 0) {
    this.pos = createVector(x, y);
    this.vel = createVector(random(-0.08, 0.08), -random(0.09, 0.6));
    this.acc = createVector(0, 0);
    this.size = s;
    this.atSurface = false;
    this.surfaceLife = floor(random(5, 30));
    this.kSize = random(2, k);
    this.color = c;
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
    //fill(255, 255, 100, random(10, 170));
    let rl;
    let gl;
    let bl;
    let tm;
    let tmx;

    // normal bubble
    if (this.color === 0) {
      rl = 255;
      gl = 255;
      bl = 255;
      tm = 40;
      tmx = 100;
    } // fish bubble
    else if (this.color === 1) {
      rl = 0;
      gl = 200;
      bl = 70;
      tm = 60;
      tmx = 170;
    } else if (this.color === 2) {
      rl = 100;
      gl = 0;
      bl = 200;
      tm = 20;
      tmx = 100;
    } else {
      rl = 255;
      gl = 255;
      bl = 255;
      tm = 40;
      tmx = 100;
      //fill(255, 255, 255, random(40, 100));
    }

    fill(rl, gl, bl, random(tm, tmx));

    stroke(190);
    ellipse(
      this.pos.x,
      this.pos.y,
      this.size + this.kSize,
      this.size + this.kSize
    );

    noStroke();
    //  fill(255, 255, 255, 170);
    ellipse(
      this.pos.x + this.size / 2 + random(-1, 1),
      this.pos.y - random(0.5),
      (this.size + this.kSize) / 5,
      (this.size + this.kSize) / 5
    );
  }
}
