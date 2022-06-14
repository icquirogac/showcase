# Main Spaces

## Introducción 

El desarrollo de este taller tiene como objetivo implementar una herramienta de dibujo 3D, apoyandonos en el uso de librerias tales como [p5.treegl](https://github.com/VisualComputing/p5.treegl), [p5.EasyCam](https://github.com/freshfork/p5.EasyCam) y [ml5.js](https://ml5js.org)

## Contexto

Teniendo como punto de partida el codigo que el profesor nos brindo en la pagina del curso e integrandolo con una libreria como [ml5.js](https://ml5js.org), desarrollamos una herramienta la cual permite dibujar en una interfaz 3D, adicionalmente es capaz de leer ciertos gestos con la mano, dependiendo del gesto detectado se puede cambiar ciertas configuraciones a la hora de dibujar


## Resultados y Código (Solución)

* Presione la tecla 'r' para grabar.
* Presione la tecla 'c' para borrar el canvas
* Presione la tecla 'p' para cambiar el tipo de camara
* Presione dos veces sobre el canvas para reiniciar la posición de la camara
* Con la mano haga el gesto '☝️' para dibujar con una esfera
* Con la mano haga el gesto '✌️' para dibujar con una caja
* Con la mano haga el gesto '👌' para dibujar con un cono
* Con la mano haga el gesto '✊' para cambiar el color


{{< details title="main-spaces" open=false >}}
```js
// Goal in the 3d Brush is double, to implement:
// 1. a gesture parser to deal with depth, i.e.,
// replace the depth slider with something really
// meaningful. You may use a 3d sensor hardware
// such as: https://en.wikipedia.org/wiki/Leap_Motion
// or machine learning software to parse hand (or
// body) gestures from a (video) / image, such as:
// https://ml5js.org/
// 2. other brushes to stylize the 3d brush, taking
// into account its shape and alpha channel, gesture
// speed, etc.

// Brush controls

let depth;
let brush;

let easycam;
let state;

let escorzo;
let points;
let record;
let handpose;
let video;
let hands = [];
let colorIndex = 0;
let colorsDefault = ["#00ff00", "#bb00ff", "#0000ff", "#ffff00"];
let selectorsColor = [];
let selectorFigure;
let sizeX = 735
let sizeY = 600

let stateHand = "initial" //Closed, Unknow, Open, One, Two, Three

function setup() {
  createCanvas(sizeX, sizeY, WEBGL);
  video = createCapture(VIDEO);
  video.size(sizeX/5, sizeY/5);

  handpose = ml5.handpose(video, modelReady);

  // This sets up an event that fills the global variable "predictions"
  // with an array every time new hand poses are detected
  
  // Hide the video element, and just show the canvas
  video.hide();

  handpose.on("hand", results => {
    hands = results;
  });
  // easycam stuff
  let state = {
    distance: 250,           // scalar
    center: [0, 0, 0],       // vector
    rotation: [0, 0, 0, 1],  // quaternion
  };
  easycam = createEasyCam();
  easycam.state_reset = state;   // state to use on reset (double-click/tap)
  easycam.setState(state, 2000); // now animate to that state
  escorzo = true;
  perspective();

  // brush stuff
  points = [];
  selectorFigure = createSelect();
  selectorFigure.position(sizeX-80, 230);
  selectorFigure.option('Sphere');
  selectorFigure.option('Box');
  selectorFigure.option('Cone');
  selectorFigure.selected('Sphere');

  for (let i = 0; i<4 ; i++){
    selectorsColor[i] = createColorPicker(colorsDefault[i]);
    selectorsColor[i].position(width - 70, 30+(i*50));
  }
  
  // select initial brush
  brush = brushFun;
}

function modelReady() {
  console.log("Model ready!");
}

//Funcion que mapea una coordenada, normalizando y escalando
function mapCord(cord, originMin, originMax, min, max) {
  return (cord-originMin)/(originMax-originMin) * (max-min) + min
}


function draw() {
  update();
  background(120);
  push();
  strokeWeight(0.8);
  stroke('magenta');
  grid({ dotted: false });
  pop();
  axes();
  for (const point of points) {
    push();
    translate(point.worldPosition);
    brush(point);
    pop();
  }

  beginHUD();
    
    image(video, 0, 0, sizeX/4, sizeY/4);
    // fill(colorSel);
    // noStroke();
    // rect(width - 70, 20, 40, 40);
    noStroke();
    fill(selectorsColor[colorIndex].color());
    switch (selectorFigure.value()) {
      case "Sphere":
        circle(width - 95, 35+(colorIndex*50), 20);
        break;
      case "Box":
        square(width - 105, 25+(colorIndex*50), 19);
        break;
      case "Cone":
        triangle(width - 105, 45+(colorIndex*50), width - 95, 25+(colorIndex*50), width - 85,45+(colorIndex*50));
        break;
    
      default:
        break;
    }
    drawKeypoints();
  endHUD();

}
function checkGesture(landmarks){
  let fingers = [
    landmarks.indexFinger, 
    landmarks.middleFinger,
    landmarks.pinky,
    landmarks.ringFinger   
  ]
  let isOpen = true;
  let isClosed = true;
  let isOne = true;
  let isTwo = true;
  let isThree = true;

  for (let finger of fingers){
    for(let pos=1; pos < finger.length ; pos++){
      if(finger[pos-1][1] <= finger[pos][1]){
        isOpen=false;
        break;
      }
    }
  }
  if(isOpen) return "Open"
  
  for (let finger of fingers){
    if(finger[0][1] > finger[3][1]){
      isClosed=false;
      break;
    }
  }
  if(isClosed) return "Closed"

  fingers = [
    landmarks.middleFinger,
    landmarks.pinky,
    landmarks.ringFinger   
  ]
  for (let finger of fingers){
    if(finger[0][1] > finger[3][1]){
      isOne=false;
      break;
    }
  }
  for(let pos=1; pos < landmarks.indexFinger.length ; pos++){
    if(landmarks.indexFinger[pos-1][1] <= landmarks.indexFinger[pos][1]){
      isOne=false;
      break;
    }
  }
  if(isOne) return "One"

  fingers = [
    landmarks.pinky,
    landmarks.ringFinger   
  ]
  for (let finger of fingers){
    if(finger[0][1] > finger[3][1]){
      isTwo=false;
      break;
    }
  }
  fingers = [
    landmarks.indexFinger, 
    landmarks.middleFinger, 
  ]
  for (let finger of fingers){
    for(let pos=1; pos < finger.length ; pos++){
      if(finger[pos-1][1] <= finger[pos][1]){
        isTwo=false;
        break;
      }
    }
  }
  if(isTwo) return "Two"

  
  if(landmarks.indexFinger[2][1] > landmarks.indexFinger[3][1]){
    isThree=false;
  }
  fingers = [
    landmarks.middleFinger,
    landmarks.pinky,
    landmarks.ringFinger   
  ]
  for (let finger of fingers){
    for(let pos=1; pos < finger.length ; pos++){
      if(finger[pos-1][1] <= finger[pos][1]){
        isThree=false;
        break;
      }
    }
  }
  if(isThree) return "Three"

  return "Unknown";
  
}

//Cambia el color cada que se llama (Verde, Morado, Azul, Amarillo, Cian)
function switchSelector(){
  colorIndex=(colorIndex+1)%4;
}

function update() {
  let dx = abs(mouseX - pmouseX);
  let dy = abs(mouseY - pmouseY);
  speed = constrain((dx + dy) / (2 * (width - height)), 0, 1);
  let lastStateHand = stateHand;
  // console.log("mouseX" + mouseX + "mouseX" + mouseY);
  // console.log("pmouseX" + pmouseX + "pmouseY" + pmouseY);
  // console.log("---------");
  if(hands[0]?.annotations){
    
    stateHand = checkGesture(hands[0].annotations);
    console.log(stateHand)
    if(lastStateHand != stateHand){
      if(stateHand == "Closed"){
        switchSelector();
      }
      if(stateHand == "One"){
        selectorFigure.selected('Sphere');
      }
      if(stateHand == "Two"){
        selectorFigure.selected('Box');
      }
      if(stateHand == "Three"){
        selectorFigure.selected('Cone');
      }
    }
    

    if (record) {

      points.push({
        worldPosition: treeLocation([
          mapCord(600-hands[0].annotations.indexFinger[3][0], 30, 600, 0, sizeX), 
          mapCord(hands[0].annotations.indexFinger[3][1], 30, 460, 0, sizeY), 
          mapCord(1-hands[0].annotations.indexFinger[3][2], -60, 60, 0.2, 0.8)], { from: 'SCREEN', to: 'WORLD' }),
        color: selectorsColor[colorIndex].color(),
        speed: speed,
        figure: selectorFigure.value(),
      });

    }
  }else{
    stateHand="Unknown";
  }
}

function brushFun(point) {
  push();
  noStroke();
  // TODO parameterize sphere radius and / or
  // alpha channel according to gesture speed
  fill(point.color);
  switch (point.figure) {
    case "Sphere":
      sphere(3);
      break;
    case "Box":
      box(5);
      break;
    case "Cone":
      cone(5);
      break;
    default:
      sphere(3);
      break;
  }
  pop();
}

function keyPressed() {
  if (key === 'r') {
    record = !record;
  }
  if (key === 'p') {
    escorzo = !escorzo;
    escorzo ? perspective() : ortho();
  }
  if (key == 'c') {
    points = [];
  }
}

function mouseWheel(event) {
  //comment to enable page scrolling
  return false;
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() 
{
    for (let i = 0; i < hands.length; i += 1) {
        const hand = hands[i];
        for (let j = 0; j < hand.landmarks.length; j += 1) {
        const keypoint = hand.landmarks[j];
        fill(selectorsColor[colorIndex].color());
        noStroke();
        ellipse(
            mapCord(600-keypoint[0], 30, 600, 0, sizeX),
            mapCord(keypoint[1], 30, 460, 0, sizeY),
            10,
            10);
        }
    }
}
```
{{< /details >}}

{{< p5-iframe sketch="/showcase/sketches/brush3d.js" lib1="https://unpkg.com/ml5@latest/dist/ml5.min.js" lib2="https://cdn.jsdelivr.net/gh/freshfork/p5.EasyCam@1.2.1/p5.easycam.js" lib3="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" width="758" height="624" >}}


## Discusión

* La libreria ml5.js no es precisa a la hora de detectar los movimientos de la mano, la profundidad se altera con facilidad
* Se pueden programar mas gestos y dar una mayor cantidad de opciones de lo que puede llegar a realizar con solo gestos de la mano
* Con el uso de un hardware especializado como el LeapMotion se puede llegar a tener un mejor rastreo de los movimientos de las manos, lastimosamente el software del LeapMotion esta desactualizado y sin soporte, las librerias actualmente utilizan un puerto websocket por el cual recibian la informacion del LeapMotion, pero actualmente el controlador ya no crea el servidor por el cual se conecta con las librerias, dejando las libreerias desactualizadas y sin funcionamiento


## Conclusiones

Se pueden realizar interfaces 3D capaces de detectar gestos para dibujar, con algunas mejoras en el hardware implementado se puede mejorar en la experiencia que tiene el usuario para dibujar


### Referencias

* ml5.js Handpose. https://learn.ml5js.org/#/reference/handpose


