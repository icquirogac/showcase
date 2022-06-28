# Texture sampling - coloring brightness

## Introducción 

El desarrollo de este taller tiene como objetivo familiarizarse con el uso de shaders 

## Contexto
En este ejercicio se busca implementar un algoritmo el cual permita crear un patron el cual pueda ser asignada como textura a una figura. 

A continuación se muestra un patron similar al de una pared de ladrillos donde cada subregión es pintada.
## Resultados y Código (Solución)

{{< p5-iframe sketch="/showcase/sketches/texturing/pattern.js" lib1="https://unpkg.com/ml5@latest/dist/ml5.min.js" lib2="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" width="450" height="450">}}


{{< details title="pattern" open=false >}}
```js
let pg;
let truchetShader;
let colorS;

function preload() {
  // shader adapted from here: https://thebookofshaders.com/09/
  truchetShader = readShader('/showcase/sketches/texturing/pattern.frag', { matrices: Tree.NONE, varyings: Tree.NONE });
}

function setup() {
  createCanvas(400, 400, WEBGL);
  // create frame buffer object to render the procedural texture
  pg = createGraphics(400, 400, WEBGL);
  textureMode(NORMAL);
  noStroke();
  pg.noStroke();
  pg.textureMode(NORMAL);
  // use truchetShader to render onto pg
  pg.shader(truchetShader);
  // emitResolution, see:
  // https://github.com/VisualComputing/p5.treegl#macros
  pg.emitResolution(truchetShader);
  // https://p5js.org/reference/#/p5.Shader/setUniform
  truchetShader.setUniform('u_zoom', 3);
  // pg clip-space quad (i.e., both x and y vertex coordinates ∈ [-1..1])
  pg.quad(-1, -1, 1, -1, 1, 1, -1, 1);
  // set pg as texture
  texture(pg);
}

function draw() {
  background(33);
  orbitControl();
  rotateY(millis() / 800);
  cone(100, 200);
}

function mouseMoved() {
  // https://p5js.org/reference/#/p5.Shader/setUniform
  truchetShader.setUniform('u_zoom', int(map(mouseX, 0, width, 1, 30)));
  // pg clip-space quad (i.e., both x and y vertex coordinates ∈ [-1..1])
  pg.quad(-1, -1, 1, -1, 1, 1, -1, 1);
}
```
{{< /details >}}

{{< details title="pattern.frag" open=false >}}
```frag
// Author @patriciogv ( patriciogonzalezvivo.com ) - 2015

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform bool colorSh;

vec2 brickTile(vec2 _st, float _zoom){
    _st *= _zoom;
    // Here is where the offset is happening
    _st.x += step(1., mod(_st.y,2.0)) * 0.5;
    return fract(_st);
}

float box(vec2 _st, vec2 _size){
    _size = vec2(0.5)-_size*0.5;
    vec2 uv = smoothstep(_size,_size+vec2(1e-4),_st);
    uv *= smoothstep(_size,_size+vec2(1e-4),vec2(1.0)-_st);
    return uv.x*uv.y;
}

void main(void){
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);

    // Apply the brick tiling
    st = brickTile(st,5.0);

    color = vec3(box(st,vec2(0.9)));

    color = vec3(st,0.0);

    gl_FragColor = vec4(color,1.0);
}
```
{{< /details >}}