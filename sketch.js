let speedSlider;
let orbs;
let colors;
let fr;
let numCircles;
let maxCircles;
let degreeStep;
let radius;
let orbPlaced;
let playSize;
let light;
let dark;

function setup() {
  orbs = [];
  colors = ["#e06767", "#e09c67", "#e0cc67", "#a2e067", "#67d6e0", "#a467e0"];
  fr = 60;
  numCircles = 0;
  maxCircles = 6;
  degreeStep = PI / 6;
  radius = 200;
  orbPlaced = false;
  playSize = 10;
  light = 'rgba(255, 255, 255, .3)';
  dark = '#222';

  let c = createCanvas(700, 500);
  frameRate(fr);

  c.mouseOver(enlargePlayIcon);
  c.mouseOut(shrinkPlayIcon);

  speedSlider = createSlider(1, 4, 1, .1);
  speedSlider.position(0, 0);
  speedSlider.input(updateSpeed);
  speedSlider.hide();

  for (let i = 0; i < maxCircles; i++) {
    orbs[i] = new Orb(
      width / 2 + cos(degreeStep * i) * radius,
      height / 2 + sin(degreeStep * i) * radius,
      width / 2 + cos(PI + degreeStep * i) * radius,
      height / 2 + sin(PI + degreeStep * i) * radius,
      colors[i]
    );
  }
}

function updateSpeed() {
  console.log(speedSlider.value());
  for (let i = 0; i < maxCircles; i++) {
    orbs[i].speed = speedSlider.value();
  }
}

function draw() {
  clear();
  speedSlider.hide();

  if (!focused) {
    noStroke();
    fill(light);
    triangle(width / 2 - playSize, height / 2 - 2 * playSize, width / 2 + 2 * playSize, height / 2, width / 2 - playSize, height / 2 + 2 * playSize);
    return;
  }

  speedSlider.show();
  noFill();
  stroke(light);
  strokeWeight(2);
  circle(width / 2, height / 2, radius * 2);
  console.log(mouseX);

  stroke('#222');
  for (let i = 0; i < numCircles; i++) {
    orbs[i].draw();
  }
}

function enlargePlayIcon() {
  playSize = 13;
}

function shrinkPlayIcon() {
  playSize = 10;
}

function keyReleased() {
  if (key == ' ' && numCircles + 1 <= maxCircles) {
    numCircles++;
  }
  else if (keyCode == BACKSPACE && numCircles - 1 >= 0) {
    orbs[numCircles - 1].reset();
    numCircles--;
  }
}

class Orb {
  constructor(x1, y1, x2, y2, c) {
    this.vec = createVector(x2 - x1, y2 - y1);
    this.ix = x1;
    this.iy = y1;
    this.c = c;

    this.radius = 50;
    this.step = 0;
    this.speed = 1;
  }

  draw() {
    fill(this.c);
    let x = this.easeInOut(float(this.step / (fr * 3)));
    let cvec = p5.Vector.mult(this.vec, x);
    circle(this.ix + cvec.x, this.iy + cvec.y, this.radius);
    this.step += this.speed;
  }

  reset() {
    this.step = 0;
  }

  easeInOut(x) {
    return -(cos(PI * x) - 1) / 2;
  }
}
