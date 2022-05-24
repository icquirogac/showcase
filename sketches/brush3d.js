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