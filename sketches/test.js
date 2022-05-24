const ROWS = 20;
const COLS = 20;
const LENGTH = 20;
let quadrille;
let ax, ay, bx, by, cx, cy;

function setup() {
  createCanvas(COLS * LENGTH, ROWS * LENGTH);
  quadrille = createQuadrille(20, 20);
  //randomize();
  //quadrille.colorizeTriangle(ax, ay, bx, by, cx, cy, [255, 0, 0], [0, 255, 0], [0, 0, 255]);
  //quadrille.colorizeTriangle(ax, ay, bx, by, cx, cy, 'red', 'green', 'blue');
  quadrille.colorize('red',  'blue', 'green','cyan');
}

function draw() {
  background(255);
  drawQuadrille(quadrille, { cellLength: LENGTH, outline: 'cyan', board: true });
  tri();
}

function tri() {
  //push();
  stroke('#060621');
  //strokeWeight(3);
  noFill();
  triangle(ay * LENGTH + LENGTH / 2, ax * LENGTH + LENGTH / 2, by * LENGTH + LENGTH / 2, bx * LENGTH + LENGTH / 2, cy * LENGTH + LENGTH / 2, cx * LENGTH + LENGTH / 2);
  //op();
}

function keyPressed() {
  randomize();
  quadrille.clear();
  if (key === 'r') {
    // [r, g, b, x, y]: rgb -> color components; x, y -> 2d normal
    quadrille.rasterizeTriangle(ax, ay, bx, by, cx, cy, colorize_shader, [255, 0, 0, 7, 4], [0, 255, 0, -1, -10], [0, 0, 255, 5, 8]);
  }
  if (key === 's') {
    quadrille.clear();
    randomize();
    quadrille.colorizeTriangle(ax*2, ay *2, bx, by, cx, cy, 'red', 'green', 'blue');
    //quadrille.rasterize(colorize_shader, [255, 0, 0, 7, 4], [0, 255, 0, -1, -10], [0, 0, 255, 5, 8], [255, 255, 0, -1, -10]);
  }
}

// pretty similar to what p5.Quadrille.colorizeTriangle does
function colorize_shader({ pattern: mixin }) {
  let rgb = mixin.slice(0, 3);
  // debug 2d normal
  console.log(mixin.slice(3));
  // use interpolated color as is
  return color(rgb);
}

function randomize() {
  ay = int(random(0, COLS));
  ax = int(random(0, ROWS));
  by = int(random(0, COLS));
  bx = int(random(0, ROWS));
  cy = int(random(0, COLS));
  cx = int(random(0, ROWS));
}

/*let quadrille;
let image;

function preload() {
  image = loadImage('../../../../sketches/mahakala.jpg');
}

function setup() {
  createCanvas(800, 360);
}

function draw() {
  if (frameCount % 100 === 0) {
    let scl = 2 ** int(random(4));
    quadrille = createQuadrille(20 * scl, image);
    drawQuadrille(quadrille, {cellLength: 40 / scl, outlineWeight: 1.6 / scl, outline: color(random(255))});
  }
}*/