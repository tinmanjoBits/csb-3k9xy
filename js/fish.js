/* eslint-disable no-undef, no-unused-vars */

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
