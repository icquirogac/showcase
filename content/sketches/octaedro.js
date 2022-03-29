function setup() {
    createCanvas(400, 400, WEBGL);
  
  }
  
  function draw() {
    background(100)
    beginShape();
    vertex(52.5, 55, 42.5);
    vertex(30, 0, 20);
    vertex(52.5, -55, 42.5);
    vertex(85, 0, 75);
    vertex(85, 0, 20);
    vertex(30, 0, 20);
    vertex(30, 0, 75);
    vertex(85, 0, 75);
    vertex(52.5, 55, 42.5);
    vertex(85, 0, 20);
    vertex(52.5, -55, 42.5);
    vertex(30, 0, 75);
    endShape(CLOSE);
    orbitControl();
  }