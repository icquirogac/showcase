let x = 0;
let xspeed = 1;
let slider;
let flag = true;
let val;

function setup() {
    // crear lienzo
    createCanvas(710, 310);
    noStroke();
    slider = createSlider(0, 3, 1, 0.5);
    slider.position(5, 320);
}

function draw() {
    background(0);
    val = slider.value();

    if (flag) {
        xspeed = val;
    }
    else {
        xspeed = -val;
    }

    // Quitar la textura
    if (keyIsPressed && key == '0') {
        background(150);
    }
    else {
        createBars();
    }
    moveBrick();
}

// Función para crear las franjas verticales blancas
function createBars() {
    let len = 12;
    for (let i = 0; i < width / len; i++) {
        fill(255);
        if (i % 2 == 0)
            rect(i * len, height, len, -height);
    }
}

// Funcion para mover los bloques
function moveBrick() {
    fill(0, 0, 255);
    rect(x, 100, 70, 30);
    fill(255, 255, 0);
    rect(x, 200, 70, 30);

    if (x + 70 >= width) {
        flag = false;
    }
    else if (x <= 0) {
        flag = true;
    } 
    x += xspeed;
}
