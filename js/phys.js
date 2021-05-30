/* eslint-disable no-undef, no-unused-vars */

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
