# Texture sampling - coloring brightness

## Introducción 

El desarrollo de este taller tiene como objetivo familiarizarse con el uso de shaders 

## Contexto
En este ejercicio se busca implementar otras herramientas de brillo de color ( coloring brightness ), tales como el valor V de HSV, la luminosidad L de HSL y el promedio de componentes, teniendo como punto de partida el codigo brindado por el profesor en la pagina del curso.

Los metodos implementados corresponden a las siguientes ecuaciones:
* Component average

{{< katex display >}} 
I = avg(R, G, G) = \frac 1 3 (R + G + B)
{{< /katex >}} 

* HSV value V

{{< katex display >}} 
V = max(R, G, G) = M
{{< /katex >}} 

* HSL lightness L

{{< katex display >}} 
V = mimd(R, G, G) = \frac 1 2 (M + m)
{{< /katex >}} 


Implemente el teñido de textura mezclando datos interpolados de color y texel.

## Resultados y Código (Solución)

{{< p5-iframe sketch="/showcase/sketches/texturing/brightness.js" lib1="https://unpkg.com/ml5@latest/dist/ml5.min.js" lib2="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" width="725" height="550">}}


{{< details title="coloring brightness" open=false >}}
```js
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

```
{{< /details >}}

{{< details title="brightness.frag" open=false >}}
```js
precision mediump float;

// uniforms are defined and sent by the sketch
uniform int grey_scale;
uniform sampler2D texture;

// interpolated texcoord (same name and type as in vertex shader)
varying vec2 texcoords2;

// returns luma of given texel
float luma(vec3 texel) {
  return 0.299 * texel.r + 0.587 * texel.g + 0.114 * texel.b;
}

// returns component average of given texel
float average(vec3 texel) {
  return (texel.r + texel.g +  texel.b)/3.0;
}

// returns HSV value of given texel
float hsv(vec3 texel) {
  return max (max (texel.r, texel.g), texel.b);
}

// returns HSL lightness of given texel
float hsl(vec3 texel) {
  return max(max(texel.r, texel.g), texel.b) / 2.0 + min(min(texel.r, texel.g), texel.b) / 2.0;
}

void main() {
  // texture2D(texture, texcoords2) samples texture at texcoords2 
  // and returns the normalized texel color
  vec4 texel = texture2D(texture, texcoords2);
  // gl_FragColor = grey_scale ? vec4((vec3(luma(texel.rgb))), 1.0) : texel;
  if(grey_scale == 1) {
    gl_FragColor = texel;
  }else if(grey_scale == 2) {
    gl_FragColor =   vec4((vec3(luma(texel.rgb))), 1.0);
  }else if(grey_scale == 3) {
    gl_FragColor = vec4((vec3(average(texel.rgb))), 1.0);
  }else if(grey_scale == 4) {
    gl_FragColor = vec4((vec3(hsv(texel.rgb))), 1.0);
  }else{
    gl_FragColor = vec4((vec3(hsl(texel.rgb))), 1.0);
    //
  }
}
```
{{< /details >}}