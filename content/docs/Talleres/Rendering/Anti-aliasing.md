# **Anti-aliasing**

## **Introducción**

Con el siguinte taller se busca revisar los conceptos de coordenadas baricentricas, rasterización y aliasing al realizar una implementación del suavizado o antiescalinamiento(anti-aliasing) en p5.

## **Contexto**

El **antialiasing** es una técnica utilizada en gráficos por computadora para eliminar el efecto de aliasing. Este efecto consiste en la aparición de bordes irregulares o *"jaggies"* en una imagen rasterizada (una imagen renderizada usando píxeles). El problema de los bordes irregulares técnicamente ocurre debido a la distorsión de la imagen cuando la conversión del escaneo se realiza con muestreo a baja frecuencia, el cual resulta en la pérdida de información de la imagen. 

El proceso de antialiasing determina qué color debemos usar cuando rellenamos píxeles. Como se puede observar en la siguente imagen, cuando el antialiasing está habilitado, los píxeles son tonos de gris, sin embargo, cuando se deshabilita, el píxel se rellena como negro o blanco sólido y la forma se ve irregular.

<p align="center">
  <img src="/showcase/sketches/versus.png" />
</p>

### **Muestreo múltiple Antialiasing (MSAA - Multisampling)**

Existen diferente metodos para hacer que la imagen sea más agradable para el usuario, entre ellos se encuentra el **MSAA - Multisampling**, este metodo es uno de los más basicos sin embargo es uno de los más usados en juegos de rango medio, ya que tiene un equilibrio entre rendimiento y calidad.

{{< hint info >}}
El antialiasing MSAA se realiza siguiendo los siguientes pasos:
* Se toma una imagen que tiene jaggies.
* La imagen se representa en su estructura de alta resolución.
* A alta resolución, se toman muestras de color de píxeles adicionales que estaban ausentes en la imagen de baja resolución.
* A baja resolución, cada píxel obtiene otro color al que se ha llegado a un promedio de píxeles adicionales.
* El nuevo color ayuda a que los píxeles se mezclen de manera más efectiva y los jaggies resultan ser menos notables.
{{< /hint >}}

Para entrar en más detalle de como funciona este método primero se deben entender el concepto de rasterización el cual toma todos los vértices que pertenecen a una objeto y los transforma en un conjunto de fragmentos. Para la implementación realizada en este taller se hace uso del calculo de coordenadas baricentricas.

A continuación se muestra una cuadrícula de píxeles de pantalla, donde el centro de cada píxel contiene un punto de muestreo que se utiliza para determinar si un píxel está cubierto o no por el triángulo. Los puntos de muestra rojos indican que están cubiertos por el triángulo y para ellos se generia un fragmento, dando como resultado una imagen con bordes irregulares.

<p align="center">
  <img src="/showcase/sketches/one_sample.jpg" />
  <img src="/showcase/sketches/one.jpg" />
</p>

Al hacer uso del método MSAA, este no usa un único punto de muestreo para determinar la cobertura del triángulo, sino múltiples puntos de muestreo. Por ejemplo en la siguinete imagen se tienen 4 submuestras en un patrón general y estos se utilizan para determinar la cobertura de los píxeles. El lado izquierdo de la imagen se muestra cómo determinaríamos normalmente la cobertura de un triángulo. Este píxel específico no ejecutará un sombreador de fragmentos (y, por lo tanto, permanecerá en blanco) ya que su punto de muestra no estaba cubierto por el triángulo. El lado derecho de la imagen muestra una versión multimuestreada donde cada píxel contiene 4 puntos de muestra. Aquí podemos ver que solo 2 puntos de muestra cubren el triángulo por lo que obtine un tono del color original, para detemimar el tono a usar en ese pixel se promedian los colores de cada submuestra por píxel. 

<p align="center">
  <img src="/showcase/sketches/multisampling.jpg" />
</p>

En general el MSAA utiliza un búfer de profundidad/plantilla más grande para determinar la cobertura de la submuestra y el número de submuestras cubiertas determina cuánto contribuye el color del píxel al búfer de fotogramas. 

{{< hint info >}}
La cantidad de puntos de muestra puede ser cualquier número que deseemos, entre más muestras se logra una mejor precisión de cobertura.
{{< /hint >}}

Continuando con un píxel que contiene 4 submuestras, para cada píxel cuantas menos submuestras forman parte del triángulo, menos toma el color del triángulo. Si tuviéramos que completar los colores reales de los píxeles, obtendríamos la siguiente imagen, donde los bordes irregulares del triángulo ahora están rodeados por colores ligeramente más claros que el color del borde real, lo que hace que el borde parezca suave cuando se ve desde la distancia.
<p align="center">
  <img src="/showcase/sketches/four_sample.jpg" />
  <img src="/showcase/sketches/four.jpg" />
</p>

## Resultados y Código (Solución)

* Presione la tecla '1', '2' o '3' para mover alguno de los puntos del triangulo y cuaalquier otra tecla para dejar de mover el punto.

{{< p5-iframe sketch="/showcase/sketches/antialiasing.js" width="530" height="580" >}}

## Discusión y Conclusiones

La técnica del anti-alising es la razón por la que tenemos texto claro y formas vectoriales suaves en nuestras pantallas, esta técnica mejora la precisión de la rasterización al incluir zonas que estén parcialmente cubiertas por el triángulo, dando una mayor resolución y definición de objetos.

El método Multisampling es utilizando en equipos de gama media y alta ya que este corrige los jaggies en el polígono y requiere menos potencia de procesamiento por lo que es muy famoso entre los videojuegos.

### Referencias
* The barycentric conspiracy. (2017, 9 abril). The Ryg Blog. https://fgiesen.wordpress.com/2013/02/06/the-barycentric-conspirac/
* Anti Aliasing. Learn OpenGL. https://learnopengl.com/Advanced-OpenGL/Anti-Aliasing
* S. (2015, 25 enero). Rasterization: a Practical Implementation (Rasterization: a Practical Implementation). © 2009–2016 Scratchapixel. https://www.scratchapixel.com/lessons/3d-basic-rendering/rasterization-practical-implementation/rasterization-practical-implementation
* GeeksforGeeks. (2019, 31 enero). Computer Graphics | Antialiasing. https://www.geeksforgeeks.org/computer-graphics-antialiasing/
* Wikipedia. (2021). Antialiasing. Wikipedia, la enciclopedia libre. https://es.wikipedia.org/wiki/Antialiasing
