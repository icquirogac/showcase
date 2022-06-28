let image;
let video;
let videoCheck;
let maskOption;
let shaderMask;
let mask = [0, -1, 0, -1, 5, -1, 0, -1, 0]
let input = [9];
let button;
let selectorFigure;

function preload() {
  video = createVideo(['/showcase/sketches/imgprocess/dogs.webm']);
  video.hide(); // by default video shows up in separate dom
  shaderMask = loadShader('/showcase/sketches/imgprocess/shader.vert', '/showcase/sketches/imgprocess/mask.frag');
   image = loadImage('/showcase/sketches/imgprocess/test.jpg');
  // image = loadImage('/showcase/sketches/imgprocess/test2.jpg');
  // image = loadImage('/showcase/sketches/imgprocess/test3.jpeg');
  // image = loadImage('/showcase/sketches/imgprocess/test4.jpg');
}

function setup() {
  // shaders require WEBGL mode to work
  createCanvas(700, 550, WEBGL);
  noStroke();
  textureMode(NORMAL);
  videoCheck = createCheckbox('video', false);
  videoCheck.style('color', 'white');
  videoCheck .changed(() => {
    if (videoCheck.checked()) {
      shaderMask.setUniform('texture', video);
      video.loop();
    } else {
      shaderMask.setUniform('texture', image);
      video.pause();
    }
  });
  videoCheck.position(640, 40);
  maskOption = createCheckbox('options', false);
  maskOption.position(640, 20);
  maskOption.style('color', 'white');
  maskOption.changed(() => {
    if (maskOption.checked()) {
      for (const inp in input) {
        input[inp].show();
        selectorFigure.show();
        button.show();
      }
    }else{
      for (const inp in input) {
        input[inp].hide();
        button.hide();
        selectorFigure.hide();
      }
    }
  });
  shader(shaderMask);
  shaderMask.setUniform('texture', image);
  emitTexOffset(shaderMask, image, 'texOffset');

  shaderMask.setUniform('radius', 50*pixelDensity());
  shaderMask.setUniform('u_resolution', [width*pixelDensity(), height*pixelDensity()]);
  
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      input[i*3+j] = createInput();
      input[i*3+j].position(200+(j*50), 200+(i*50));
      input[i*3+j].style('text-align:center');
      input[i*3+j].style('font-size:16px');
      input[i*3+j].size(42,44);
      input[i*3+j].hide();
      input[i*3+j].value(mask[i*3+j]);
    }
  }
  button = createButton('Aplicar');
  button.position(400, 265);
  button.mousePressed(apply);
  button.hide();

  selectorFigure = createSelect();
  selectorFigure.position(400, 230);
  selectorFigure.option('Sharpen');
  selectorFigure.option('Ridge detection');
  selectorFigure.option('Blur');
  selectorFigure.option('Personalized');
  selectorFigure.option('Identity');
  selectorFigure.selected('Sharpen');
  selectorFigure.hide();
  selectorFigure.changed(() => {
    switch(selectorFigure.value()){
      case "Sharpen":
        changeInputs([0, -1, 0, -1, 5, -1, 0, -1, 0]);
        break;
      case "Ridge detection":
        changeInputs([-1, -1, -1, -1, 8, -1, -1, -1, -1])
        break;
      case "Blur":
        changeInputs([1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9]);
        break;
      case "Identity":
        changeInputs([0, 0, 0, 0, 1, 0, 0, 0, 0]);
        break;
      case "Personalized":
        apply();
        break;
    }
  });
}

function changeInputs(masks){
  for (let i = 0; i < 9; i++) {
    input[i].value(masks[i]);
  }
  apply();
}

function apply() {
  mask = [parseFloat(input[0].value()), parseFloat(input[1].value()), parseFloat(input[2].value()), 
          parseFloat(input[3].value()), parseFloat(input[4].value()), parseFloat(input[5].value()),
          parseFloat(input[6].value()), parseFloat(input[7].value()), parseFloat(input[8].value())]
}
function reset() {
  mask = createQuadrille([[0.0625, 0.125, 0.0625],
        [0.125,  0.25,  0.125],
        [0.0625, 0.125, 0.0625]]);
}


function draw() {
  if(maskOption.checked()){
    background('#060621');
  }else{
    background(0);
    shaderMask.setUniform('mask', mask);
    shaderMask.setUniform('u_mouse', [mouseX*pixelDensity(), (height - mouseY)*pixelDensity()]);
    cover(true);
    quad(-width / 2, -height / 2, width / 2, -height / 2, width / 2, height / 2, -width / 2, height / 2);
  }

}

function cover(texture = false) {
  beginShape();
  if (texture) {
    vertex(-width / 2, -height / 2, 0, 0, 0);
    vertex(width / 2, -height / 2, 0, 1, 0);
    vertex(width / 2, height / 2, 0, 1, 1);
    vertex(-width / 2, height / 2, 0, 0, 1);
  }
  else {
    vertex(-width / 2, -height / 2, 0);
    vertex(width / 2, -height / 2, 0);
    vertex(width / 2, height / 2, 0);
    vertex(-width / 2, height / 2, 0);
  }
  endShape(CLOSE);
}