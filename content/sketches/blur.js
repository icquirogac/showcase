let scl = 0;
let mask, quadrille, orig, conv;
let image;
let image_mode = true;
let input = [9];
let button;
let button2;

function update() {
  let c = quadrille == null ? false : quadrille === conv;
  //let c = false;
  orig = createQuadrille(40 * (2 ** scl), image);
  conv = orig.clone();
  conv.filter(mask);
  quadrille = orig;
  quadrille = c ? conv : orig;
}

function preload() {
  image = loadImage('../../../../sketches/Monalisa.jpg');
}

function setup() {
  createCanvas(710, 770);
  //*
  mask = createQuadrille([[0.0625, 0.125, 0.0625],
                          [0.125,  0.25,  0.125],
                          [0.0625, 0.125, 0.0625]]);
  //*/
  /*
  mask = createQuadrille([ [ 1, -1, 0 ],
                           [ 1, 0, 0 ],
                           [ 1, -1, 0 ] ]); 
  // */
  
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      input[i*3+j] = createInput();
      input[i*3+j].position(200+(j*50), 200+(i*50));
      input[i*3+j].style('text-align:center');
      input[i*3+j].style('font-size:16px');
      input[i*3+j].size(42,44);
      input[i*3+j].hide();
    }
  }

  button = createButton('Aplicar');
  button.position(400, 265);
  button.mousePressed(apply);
  button.hide();
  button2 = createButton('Reset');
  button2.position(400, 305);
  button2.mousePressed(reset);
  button2.hide();
  update();
}

function apply() {
  mask = createQuadrille([[parseFloat(input[0].value()), parseFloat(input[1].value()), parseFloat(input[2].value()),],
                          [parseFloat(input[3].value()), parseFloat(input[4].value()), parseFloat(input[5].value()),],
                          [parseFloat(input[6].value()), parseFloat(input[7].value()), parseFloat(input[8].value()),],])
  update();
}
function reset() {
  mask = createQuadrille([[0.0625, 0.125, 0.0625],
        [0.125,  0.25,  0.125],
        [0.0625, 0.125, 0.0625]]);
  update();
}

function draw() {
  background('#060621');
  if (image_mode) {
    drawQuadrille(quadrille,
      {
        cellLength: 20 / (2 ** scl),
        outlineWeight: 0,
        //outline: quadrille === orig ? 'magenta' : 'magenta'
      });
  } else {
    drawQuadrille(mask,
      {
        col: 4,
        row: 8,
        cellLength: 50,
        min: 0.0625,
        max: 0.25,
        numberColor: 'white'
      });
  }
}

function keyPressed() {
  if (key === 's') {
    scl = scl < 2 ? scl + 1 : 0;
    update();
  }
  if (key === 'c') {
    quadrille = quadrille === orig ? conv : orig;
  }
  if (key === 'i') {
    if(image_mode){
      image_mode = !image_mode;
      for (const inp in input) {
        input[inp].show();
        button.show();
        button2.show();
      }
    }else{
      image_mode = !image_mode;
      for (const inp in input) {
        input[inp].hide();
        button.hide();
        button2.hide();
      }
    }
  }
  
  if (keyCode === UP_ARROW) {
    quadrille.reflect();
  } else if (keyCode === DOWN_ARROW) {
    quadrille.rotate();
  }
  
}