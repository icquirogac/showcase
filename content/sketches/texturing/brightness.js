let lumaShader;
let img;
let grey_scale;

function preload() {
  lumaShader = readShader('/showcase/sketches/texturing/brightness.frag', { varyings: Tree.texcoords2 });
  // image source: https://en.wikipedia.org/wiki/HSL_and_HSV#/media/File:Fire_breathing_2_Luc_Viatour.jpg
  img = loadImage('/showcase/sketches/fire_breathing.jpg');
}

function setup() {
  createCanvas(700, 500, WEBGL);
  noStroke();
  textureMode(NORMAL);
  shader(lumaShader);
  //grey_scale = createCheckbox('luma', false);
  //grey_scale.position(10, 10);
  //grey_scale.style('color', 'white');
  //grey_scale.input(() => lumaShader.setUniform('grey_scale', grey_scale.checked()));
  //lumaShader.setUniform('texture', img);

  grey_scale = createRadio();
  grey_scale.option('1', 'Color photograph (RGB)');
  grey_scale.option('2', 'Luma');
  grey_scale.option('3', 'Component average');
  grey_scale.option('4', 'HSV');
  grey_scale.option('5', 'HSL');
  grey_scale.selected('1');
  grey_scale.changed(() => lumaShader.setUniform('grey_scale', grey_scale.value()));

  lumaShader.setUniform('texture', img);
  lumaShader.setUniform('grey_scale', grey_scale.value());

}

function draw() {
  background(0);
  quad(-width / 2, -height / 2, width / 2, -height / 2, width / 2, height / 2, -width / 2, height / 2);
}
