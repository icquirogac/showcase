//Declaracion de variables para las coordenadas baricentricas
let alpha, beta, gamma;
// Declaracion de variables para definir los tres puntos que conforman el triangulo
let ax, ay, bx, by, cx, cy;
// Declaracion de variables usadas en la realizacion de la cuadricula en el canvas
let squares, squaresF, row, col, pointA;
let i, j;
let resolution, checkbox;
// Comprobacion de si un punto (x, y) dado esta dentro del area que cubre un triangulo con vertices a, b, c
// Calcula coordenadas baricentricas del punto p
// Comprueba si los valores de alpha, beta y gamma tienen valores entre 0 y 1, es decir demostrando que p está dentro del triangulo
function inside_triangle(ax, ay, bx, by, cx, cy, x, y) {
    let d = (by - cy) * (ax - cx) + (cx - bx) * (ay - cy);
    let alpha = ((by - cy) * (x - cx) + (cx - bx) * (y - cy)) / d;
    let beta = ((cy - ay) * (x - cx) + (ax - cx) * (y - cy)) / d;
    let gamma = 1.0 - alpha - beta;
    return !(alpha < 0 || alpha > 1 || beta < 0 || beta > 1 || gamma < 0 || gamma > 1);
}

//Rasterizacion que emplea coordenadas baricentricas e implementa el anialising
function drawSquares() {
    stroke('cyan');
    strokeWeight(1);
    //Inicializacion de contadores
    i = 0;
    j = 0;
    col = 0;
    row = 0;
    //Recorrer las columnas y las filas
    for (i = 0; i <= squares; i++) {
        col = 0;
        for (j = 0; j <= squares; j++) {
            //Determina si el punto esta dentro del triangulo 
            strokeWeight(1);
            stroke('cyan');
            let sample = inside_triangle(ax, ay, bx, by, cx, cy,col + pointA, row + pointA);
            let sample1 = inside_triangle(ax, ay, bx, by, cx, cy, col + pointA / 2, row + pointA / 2);
            let sample2 = inside_triangle(ax, ay, bx, by, cx, cy, col + (3 * pointA / 2), row + pointA / 2);
            let sample3 = inside_triangle(ax, ay, bx, by, cx, cy, col + pointA / 2, row + (3 * pointA / 2));
            let sample4 = inside_triangle(ax, ay, bx, by, cx, cy, col + (3 * pointA / 2), row + (3 * pointA / 2));

            if (checkbox.checked()) {
                if ( (sample1 && sample2 && sample3 && sample4)){
                    fill(54, 0, 145)
                    rect(col, row, squaresF, squaresF);
                }
                else if  ((sample3 && sample4 && sample2) || (sample1 && sample4 && sample2)) {
                    fill(92, 42, 176)
                    //Dibujar la celda recien analizada
                    rect(col, row, squaresF, squaresF);

                } else if ((sample3 && sample4) || (sample1 && sample2) || (sample3 && sample3) || (sample4 && sample2)) {
                    //Rellenar la celda con la interpolacion entre las coordenadas baricentricas y los colores definidos
                    fill(136, 96, 204)
                    //Dibujar la celda recien analizada
                    rect(col, row, squaresF, squaresF);
                } else if (sample3 || sample4 || sample2 || sample1) {
                    //Rellenar la celda con la interpolacion entre las coordenadas baricentricas y los colores definidos
                    fill(198, 179, 232)
                    //Dibujar la celda recien analizada
                    rect(col, row, squaresF, squaresF);
                }
            } else if (sample) {
                //Calcular las coordenadas baricentricas del punto medio de la celda
                //Rellenar la celda con la interpolacion entre las coordenadas baricentricas y los colores definidos
                fill(54, 0, 145)
                //Dibujar la celda recien analizada
                rect(col, row, squaresF, squaresF);
            }
            //Pintar el en canvas el punto medio de la celda analizada
            strokeWeight(3);
            stroke(175, 5, 247);
            point(col + pointA, row + pointA);
            //Pintar el en canvas los puntos medios de cada de las muestras
            strokeWeight(3);
            stroke('green');
            point(col + pointA / 2, row + pointA / 2);

            strokeWeight(3);
            //stroke('green');
            point(col + (3 * pointA / 2), row + pointA / 2);

            strokeWeight(3);
            //stroke('blue');
            point(col + pointA / 2, row + (3 * pointA / 2));

            strokeWeight(3);
            //stroke('cyan');
            point(col + (3 * pointA / 2), row + (3 * pointA / 2));
            //Poner el color de trazo en negro para el siguiente ciclo
            stroke(255, 255, 255);
            //Actualizar la variable col con el valor de la ubicacion del inicio de la siguiente columna de celdas
            col += squaresF;
        }
        //Actualizar la variable row con el valor de la ubicacion del inicio de la siguiente fila de celdas
        row += squaresF;
    }
}

function setup() {
    //Creación del canvas
    createCanvas(500, 500);
    sld = createSlider(8, 24, 16,4);
    checkbox = createCheckbox('Anti-aliasing', false);
    //Coordenadas del triangulo inicial
    ax = 30;
    ay = height /2;
    bx = width - 40;
    by = 40;
    cx = width - 40;
    cy = height - 40;
}

function draw() {
    background(255);
    //Dibujar la cuadrícula y rasterizar el tríangulo actual
    val = sld.value();
    //Cantidad de celdas en alto y ancho que habrá en la cuadrícula
    squares = val;
    //Valor del tammaño de cada celda de la cuadricula inicial
    squaresF = 40;
    //Definir cantidad de pixeles por celda de la cuadrícula
    squaresF = width / squares;
    // Punto medio de la primer celda
    pointA = squaresF / 2;
    drawSquares();
    //Grosor del trazado y color del triangulo
    strokeWeight(1);
    stroke(0);
    noFill();
    triangle(ax, ay, bx, by, cx, cy);
    //Marcador del punto en la ubicación del cursor en el canvas
    strokeWeight(6);
    stroke('red');
    point(mouseX, mouseY);
    //Cambio de coordenadas de los vertices del triangulo segun el click del mouse
    if (mouseIsPressed) {
        if (key === '1') {
            ax = mouseX;
            ay = mouseY;
        }
        if (key === '2') {
            bx = mouseX;
            by = mouseY;
        }
        if (key === '3') {
            cx = mouseX;
            cy = mouseY;
        }
    }
}