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


{{< p5-iframe sketch="/showcase/sketches/brush3d.js" lib1="https://unpkg.com/ml5@latest/dist/ml5.min.js" lib2="https://cdn.jsdelivr.net/gh/freshfork/p5.EasyCam@1.2.1/p5.easycam.js" lib3="https://cdn.jsdelivr.net/gh/VisualComputing/p5.treegl/p5.treegl.js" width="758" height="624" >}}


## Discusión

* La libreria ml5.js no es precisa a la hora de detectar los movimientos de la mano, la profundidad se altera con facilidad
* Se pueden programar mas gestos y dar una mayor cantidad de opciones de lo que puede llegar a realizar con solo gestos de la mano
* Con el uso de un hardware especializado como el LeapMotion se puede llegar a tener un mejor rastreo de los movimientos de las manos, lastimosamente el software del LeapMotion esta desactualizado y sin soporte, las librerias actualmente utilizan un puerto websocket por el cual recibian la informacion del LeapMotion, pero actualmente el controlador ya no crea el servidor por el cual se conecta con las librerias, dejando las libreerias desactualizadas y sin funcionamiento


## Conclusiones

Se pueden realizar interfaces 3D capaces de detectar gestos para dibujar, con algunas mejoras en el hardware implementado se puede mejorar en la experiencia que tiene el usuario para dibujar


### Referencias

* ml5.js Handpose. https://learn.ml5js.org/#/reference/handpose


