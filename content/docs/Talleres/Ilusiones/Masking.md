# Masking - Image Kernel

## Introducción 

Image Processing o procesamiento digital de imagenes, es el producto de utilizar un kernel, matriz de convolucion o mascara, para el desenfoque, enfoque, realce, detección de bordes, entre otros.

## Contexto

El proceso de aplicar una mascara sobre una imagen, consta en modificar el valor de cada pixel de la imagen, tomando informacion de los pixeles que la rodean, dependiendo del kernel se da prioridad a ciertos pixeles sobre otro, se pueden lograr efectos diferentes sobre la imagen modificando el kernel.

## Resultados y Código (Solución)


{{< details title="Image Processing - Instrucciones" open=false >}}

Instrucciones de uso
* Presione la tecla 'c' para intercambiar entre la imagen original y la modificada.
* Presione la tecla 'i' para intercambiar entre la vista de configuracion y la vista de visualizacion de la imagen
* Presione la tecla 's' para redimensionar  la imagen

{{< /details >}}

{{< p5-iframe sketch="/showcase/sketches/blur.js" width="735" height="800" >}}


## Discusión

* Diferentes resultados se obtienen con diferentes kernels. 
* Dependiendo de la imagen se pueden obtener mejores resultados.


## Conclusiones

El campo de Image Processing tiene varias aplicaciones, una de las mas conocidas es utilizando un kernel Gaussian, el cual difumina la imagen original.

### Referencias
* Bach, M. (s. f.). “Stepping feet” Motion Illusion. 148 Visual Phenomena & Optical Illusions. https://michaelbach.de/ot/mot-feetLin/

* Wikipedia. Kernel (image processing). https://en.wikipedia.org/wiki/Kernel_%28image_processing%29


