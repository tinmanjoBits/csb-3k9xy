/* eslint-disable no-undef, no-unused-vars */
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
