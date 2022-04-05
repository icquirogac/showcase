# Masking - Image Kernel

## Introducción 

Stepping Feet o ilusion de los pies escalonadoes es un fenomeno de percepcion de movimiento en el cual se observa el movimiento de dos bloques un azul y otro amarillo. Los bloques parecen caminar alternativamente. El movimiento es más pronunciado si no se miran directamente los bloques, sino entre ellos. Aunque parecen ser pies dando pasos, en realidad su movimiento es siempre simultáneo.


## Contexto

Stuart Anstis demostró por primera vez esta ilusión en 2003.

En la ilusión cuando el bloque azul se encuentra sobre las franjas blancas, el contraste es alto (azul oscuro frente a blanco) y fácilmente visible, por lo que parece moverse más rápido que su velocidad real. Por el contrario, cuando el bloque azul está contra las franjas negras, el contraste es bajo (azul oscuro vs. negro) y más difícil de ver, por lo que el movimiento parece más lento. Los efectos opuestos ocurren para el bloque amarillo.

![Context](/showcase/sketches//Fast_slow.jpg)


## Resultados y Código (Solución)
* Presione la tecla '0' para quitar la textura.
* Mueva la barra deslizante para aumentar o disminuir la velocidad.

{{< details title="stepping-feet" open=false >}}
```html
{{</* p5-iframe sketch="/showcase/sketches/stepping_feet.js" lib1="https://cdn.jsdelivr.net/gh/freshfork/p5.EasyCam@1.2.1/p5.easycam.min.js" width="735" height="360" */>}}
```
{{< /details >}}

{{< p5-iframe sketch="/showcase/sketches/blur.js" width="735" height="800" >}}


## Discusión

* En general, los movimientos de mayor contraste se ven más rápidos que los de menor contraste. 
* El efecto desaparece cuando se quita la textura ya que no queda contraste, mostrando cómo el fondo de un objeto puede tener un efecto significativo en su velocidad percibida.


## Conclusiones

Al trabajar en esta ilusion se logra estudiar el **efecto contraste**, el cual es la tendencia añadir o reducir el valor de los objetos que percibimos al compararlos con otro objeto. Evidenciando que el contraste no solo modifica la latencia para esta ilusión, sino también la amplitud del movimiento percibido.



### Referencias
* Bach, M. (s. f.). “Stepping feet” Motion Illusion. 148 Visual Phenomena & Optical Illusions. https://michaelbach.de/ot/mot-feetLin/

* Anstis, S (2003). "Moving Objects Appear to Slow Down at Low Contrasts". Neural Networks. 16 (5): 933–938. doi:[10.1016/S0893-6080(03)00111-4.](https://www.sciencedirect.com/science/article/abs/pii/S0893608003001114?via%3Dihub)

* Wikipedia. Stepping feet illusion. https://en.wikipedia.org/wiki/Stepping_feet_illusion, Contrast effect https://en.wikipedia.org/wiki/Contrast_effect



