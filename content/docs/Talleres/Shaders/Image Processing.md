# Image Processing

## Contexto

Aplicar sobre una zona el kernel seleccionado, o aplicar un kernel personalizado sobre una imagen o un video 

## Resultados y Código (Solución)

* Deslice el mouse sobre el canvas para aplicar el shader en la zona.
* En la esquina superior derecha puede ajustar el kernel.
* En la esquina superior derecha puede seleccionar entre la imagen y el video.


{{< details title="imgprocess.js" open=false >}}
```js
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
```
{{< /details >}}

{{< details title="mask.frag" open=false >}}
```js
precision mediump float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float radius;
// we need our interpolated color
varying vec4 vVertexColor;
// we need our interpolated tex coord
varying vec2 vTexCoord;

uniform sampler2D texture;
uniform vec2 texOffset;
// holds the 3x3 kernel
uniform float mask[9];



void main() {
  float pct = distance(gl_FragCoord.xy, u_mouse);
  if (pct >= radius) {
    gl_FragColor = texture2D(texture, vTexCoord) * vVertexColor;
  }
  else {
    // 1. Use offset to move along texture space.
    // In this case to find the texcoords of the texel neighbours.
    vec2 tc0 = vTexCoord + vec2(-texOffset.s, -texOffset.t);
    vec2 tc1 = vTexCoord + vec2(         0.0, -texOffset.t);
    vec2 tc2 = vTexCoord + vec2(+texOffset.s, -texOffset.t);
    vec2 tc3 = vTexCoord + vec2(-texOffset.s,          0.0);
    // origin (current fragment texcoords)
    vec2 tc4 = vTexCoord + vec2(         0.0,          0.0);
    vec2 tc5 = vTexCoord + vec2(+texOffset.s,          0.0);
    vec2 tc6 = vTexCoord + vec2(-texOffset.s, +texOffset.t);
    vec2 tc7 = vTexCoord + vec2(         0.0, +texOffset.t);
    vec2 tc8 = vTexCoord + vec2(+texOffset.s, +texOffset.t);

    // 2. Sample texel neighbours within the rgba array
    vec4 rgba[9];
    rgba[0] = texture2D(texture, tc0);
    rgba[1] = texture2D(texture, tc1);
    rgba[2] = texture2D(texture, tc2);
    rgba[3] = texture2D(texture, tc3);
    rgba[4] = texture2D(texture, tc4);
    rgba[5] = texture2D(texture, tc5);
    rgba[6] = texture2D(texture, tc6);
    rgba[7] = texture2D(texture, tc7);
    rgba[8] = texture2D(texture, tc8);

    // 3. Apply convolution kernel
    vec4 convolution;
    for (int i = 0; i < 9; i++) {
      convolution += rgba[i]*mask[i];
    }

    // 4. Set color from convolution
    gl_FragColor = vec4(convolution.rgb, 1.0); 
  }
}
```
{{< /details >}}

{{< details title="shader.vert" open=false >}}
```js
// Precision seems mandatory in webgl
precision highp float;

// 1. Attributes and uniforms sent by p5.js

// Vertex attributes and some uniforms are sent by
// p5.js following these naming conventions:
// https://github.com/processing/p5.js/blob/main/contributor_docs/webgl_mode_architecture.md

// 1.1. Attributes
// vertex position attribute
attribute vec3 aPosition;

// vertex texture coordinate attribute
attribute vec2 aTexCoord;

// vertex color attribute
attribute vec4 aVertexColor;

// 1.2. Matrix uniforms

// The vertex shader should project the vertex position into clip space:
// vertex_clipspace = vertex * projection * view * model (see the gl_Position below)
// Details here: http://visualcomputing.github.io/Transformations

// Either a perspective or an orthographic projection
uniform mat4 uProjectionMatrix;

// modelview = view * model
uniform mat4 uModelViewMatrix;

// B. varying variable names are defined by the shader programmer:
// vertex color
varying vec4 vVertexColor;

// vertex texcoord
varying vec2 vTexCoord;

void main() {
  // copy / interpolate color
  vVertexColor = aVertexColor;
  // copy / interpolate texcoords
  vTexCoord = aTexCoord;
  // vertex projection into clipspace
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
}

```
{{< /details >}}

{{< p5-iframe sketch="/showcase/sketches/imgprocess/imgprocess.js" lib1="https://cdn.jsdelivr.net/gh/freshfork/p5.EasyCam@1.2.1/p5.easycam.js" lib2="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" width="720" height="576" >}}

## Discusión

* Utilizando mascaras de convolucion adecuadas se podrian a llegar a detectar objetos, sin el uso de machine learning

## Conclusiones

* El procesamiento en tiempo real de una imagen puede ser muy util sobre todo en el area de la salud
* El uso de la GPU con la libreria de WEBGL permite que el procesamiento en tiempo real de una imagen o video sea fluidos

### Referencias

* Jean Pierre Charalambos. p5.treegl.js. https://github.com/VisualComputing/p5.treegl
* Wikipedia. Kernel (image processing). https://en.wikipedia.org/wiki/Kernel_%28image_processing%29
