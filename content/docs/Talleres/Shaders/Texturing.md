# Texturing

## Introducción 

El desarrollo de este taller tiene como objetivo familiarizarse con el uso de shaders

## Contexto

Teniendo como punto de partida el codigo que el profesor nos brindo en la pagina del curso 

## Resultados y Código (Solución)

* Deslice el mouse sobre el canvas para aplicar el shader en la zona.
* Con el Mouse Wheeler puede cambiar el tamaño del shader aplicado.


{{< details title="texturing.js" open=false >}}
```js
let easycam;
let uvShader;
let opacity;
let radius;

function preload() {
  // Define geometry in world space (i.e., matrices: Tree.pmvMatrix).
  // The projection and modelview matrices may be emitted separately
  // (i.e., matrices: Tree.pMatrix | Tree.mvMatrix), which actually
  // leads to the same gl_Position result.
  // Interpolate only texture coordinates (i.e., varyings: Tree.texcoords2).
  // see: https://github.com/VisualComputing/p5.treegl#handling
  uvShader = readShader('uv_alpha.frag', { matrices: Tree.pmvMatrix, varyings: Tree.texcoords2 });
}

function setup() {
  createCanvas(300, 300, WEBGL);
  radius = 100;

  // easycam stuff
  let state = {
    distance: 250,           // scalar
    center: [0, 0, 0],       // vector
    rotation: [0, 0, 0, 1],  // quaternion
  };
  easycam = createEasyCam();
  easycam.state_reset = state;   // state to use on reset (double-click/tap)
  easycam.setState(state, 2000); // now animate to that state
  textureMode(NORMAL);
  opacity = createSlider(0, 1, 0.5, 0.01);
  opacity.position(10, 25);
  opacity.style('width', '280px');
}

function draw() {
  background(200);
  // reset shader so that the default shader is used to render the 3D scene
  resetShader();
  // world space scene
  axes();
  grid();
  translate(0, -70);
  rotateY(0.5);
  fill(color(255, 0, 255, 125));
  box(30, 50);
  translate(70, 70);
  fill(color(0, 255, 255, 125));
  sphere(30, 50);
  // use custom shader
  shader(uvShader);
  // https://p5js.org/reference/#/p5.Shader/setUniform
  uvShader.setUniform('opacity', opacity.value());
  // screen-space quad (i.e., x ∈ [0..width] and y ∈ [0..height])
  // see: https://github.com/VisualComputing/p5.treegl#heads-up-display
  beginHUD();
  noStroke();
  circle(mouseX, mouseY ,radius);
  endHUD();
}

function mouseWheel(event) {
  if(event.delta > 0 )
    radius += 10
  else
    radius -= 10
  return false;
}
```
{{< /details >}}

{{< details title="uv_alpha.frag" open=false >}}
```js
precision mediump float;

varying vec2 texcoords2;
varying vec4 color4;
// uniform is sent by the sketch
uniform float opacity;

void main() {
  gl_FragColor = vec4(0.0, texcoords2.xy,  opacity);
}
```
{{< /details >}}

{{< p5-iframe sketch="/showcase/sketches/texturing/texturing.js" lib1="https://cdn.jsdelivr.net/gh/freshfork/p5.EasyCam@1.2.1/p5.easycam.js" lib2="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" width="624" height="624" >}}


## Discusión

* Diferentes formas pueden ser aplicadas con el shader


## Conclusiones



### Referencias

