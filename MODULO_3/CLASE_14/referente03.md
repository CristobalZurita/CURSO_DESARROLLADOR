### **https://www.enmilocalfunciona.io/consejos-en-desarrollo-css-estrategias-para-un-codigo-css-eficiente-y-adaptable/**

### **Trabaja con el flujo, no en contra él**

Vamos
 a hablar del flujo en CSS, ese comportamiento predeterminado de los
elementos del DOM que a veces olvidamos valorar. El flujo es similar a
una coreografía de danza para los elementos de tu página web. Cuando un
elemento sigue el flujo, se posiciona naturalmente en relación con los
demás. Sin embargo, cuando empezamos a extraer elementos del flujo, las
cosas pueden volverse caóticas. Imagínate una fiesta en la que todos
bailan al unísono; si alguien se sale del ritmo, ¡se genera un desorden!
 Lo mismo sucede en CSS.

Evita posicionar los elementos de manera
absoluta. En su lugar, es preferible trabajar dentro del flujo tanto
como sea posible para prevenir que tus estilos se conviertan en un
rompecabezas difícil de resolver.

Por ejemplo, si queremos que una cabecera esté siempre al principio de una página, es mejor usar `position: sticky`. Este comando mantiene el espacio que ocupa la cabecera, evitando que quede flotando con los elementos por debajo.

### **z-index: ¡No te vayas al extremo!**

Ah,
 el misterioso z-index, esa propiedad que puede ser tanto tu mejor
aliado como tu peor enemigo. Podríamos compararlo con la fila de
asientos en un cine: si todos los asistentes desean ocupar la primera
fila, el resultado será un desastre total! Esta analogía se aplica
perfectamente a los valores de z-index cuando se utilizan de manera
descontrolada y con cifras extremadamente altas. Mantenerlo simple y
moderado es clave para evitar dolores de cabeza innecesarios y
superposiciones inesperadas que pueden arruinar tu diseño. De esta
manera, todos los elementos en tu página podrán encontrar su lugar
adecuado sin tener que luchar por el mejor asiento.

Mi consejo
sería tener una escala de z-index en variables CSS, esto te permitirá
tener un mayor control y facilidad al gestionar la superposición de
elementos. Por ejemplo:

```css
:root {
	--index-1: 1;
	--index-2: 2;
	--index-3: 3;
}
```

### **Libertad de tamaño**

¿Quién
 quiere estar atrapado en una talla única cuando se trata de diseño web?
 Desde los dispositivos móviles hasta las pantallas gigantes de
escritorio, tus elementos de diseño CSS deberían ser como un traje a
medida, ¡perfecto para cualquier ocasión! Evita los tamaños fijos como
un guante demasiado apretado y deja que tus elementos respiren. ¿Cómo?
Con unidades relativas y algunas propiedades como min-width y max-width.

Por
 ejemplo, imagina que estás creando un sitio web de noticias. Quieres
que tus artículos se vean geniales en cualquier dispositivo, desde un
teléfono inteligente hasta una tableta o una computadora de escritorio.
En lugar de fijar el ancho de tus artículos en píxeles, podrías usar
porcentajes o ems. Así, sin importar el tamaño de la pantalla, tus
artículos se ajustarán suavemente y lucirán igual de elegantes en todas
partes.

Las propiedades como `min-width` y `max-width`.
 Estas te permiten establecer límites para que tus elementos no se
estiren demasiado o se encogen demasiado en pantallas extremadamente
pequeñas o grandes. Es como tener un sastre virtual ajustando el traje
de tus elementos para que siempre se vean impecables, sin importar el
tamaño de la pantalla del usuario.

Con estas técnicas, tus
elementos de diseño CSS se adaptarán a cualquier situación, garantizando
 una experiencia de usuario fluida y atractiva en todos los
dispositivos. ¡Es la verdadera definición de un diseño adaptable y
flexible!

### **Media queries con moderación:**

Las
 media queries son como los condimentos en una receta: un toque añade
sabor, pero ¡demasiado puede arruinar la comida! Es tentador llenar tu
CSS con media queries para cada tamaño de pantalla posible, pero
¿realmente necesitas tantas?

Imagina que estás preparando una
ensalada. Agregar un poco de sal y pimienta realza el sabor, pero si
sigues agregando más y más condimentos, ¡puede que el plato se vuelva
incomible! Lo mismo ocurre con las media queries en tu código CSS.
Aunque son útiles para ajustar el diseño en diferentes dispositivos,
usarlas en exceso puede hacer que tu código sea difícil de mantener y
entender.

En lugar de eso, pruebas técnicas más fluidas que se
adapten automáticamente al tamaño de la pantalla. Por ejemplo, en lugar
de tener una media query para cada tamaño de dispositivo, podrías usar
unidades relativas como porcentajes o vw (viewport width) para
establecer el tamaño de tus elementos. Esto hará que tu diseño sea más
adaptable sin necesidad de media queries adicionales.

Te voy a
poner un ejemplo en código, supongamos que queremos crear un diseño de
cuadrícula flexible que se adapte a diferentes tamaños de pantalla y
tenga columnas que puedan expandirse hasta un cierto límite máximo y no
colapsar más allá de un límite mínimo.

HTML

```html
<div class="grid-container">
  <div class="item">1</div>
  <div class="item">2</div>
  <div class="item">3</div>
  <div class="item">4</div>
  <div class="item">5</div>
  <div class="item">6</div>
</div>
```

CSS

```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); /* Columnas que pueden expandirse entre 200px y 1fr */
  gap: 10px; /* Espacio entre los elementos */
}
```

En este ejemplo, estamos creando una cuadrícula con **`display: grid`** en el contenedor  **`.grid-container`** . La propiedad **`grid-template-columns`** define las columnas de la cuadrícula. Usamos  **`repeat(auto-fit, minmax(200px, 1fr))`** ,
 lo que significa que las columnas se repetirán automáticamente y
tendrán un ancho mínimo de 200px y un ancho máximo de 1fr (fracción de
espacio disponible). Esto permite que las columnas se expandan y
contraigan según el tamaño de la pantalla, pero nunca se reduzcan más
allá de 200px ni se expandan más allá de ocupar todo el espacio
disponible.

### **Flexbox y Grid dos superheroes aliados**

Imagina
 a Flexbox y Grid como Batman y Robin, dos superhéroes del mundo CSS.
Juntos, pueden enfrentar cualquier desafío y crear diseños que
impresionarían incluso al mismísimo Joker. ¿Pero qué hace que cada uno
sea tan especial?

Flexbox es como Robin, ágil y preciso. Es
perfecto para organizar elementos en una sola dirección, como una fila
de sillas en un cine. Con Flexbox, puedes alinear y distribuir elementos
 horizontal o verticalmente con facilidad. Es genial para crear diseños
simples y flexibles, como barras de navegación, listas de elementos o
diseños de tarjetas.

Por otro lado, Grid Layout es como Batman, el
 cerebro táctico del equipo. Con su habilidad para crear una cuadrícula
de filas y columnas, Grid es ideal para diseños más complejos y
estructurados. Puedes organizar tus elementos en una rejilla
bidimensional, como un tablero de ajedrez, y controlar su ubicación y
tamaño con precisión. Es perfecto para diseñar páginas completas con
secciones bien definidas.

Ahora, ¿qué sucede cuando juntamos a
estos dos superhéroes? ¡Magia! Podemos aprovechar lo mejor de ambos
mundos para crear diseños verdaderamente impresionantes. Por ejemplo,
podríamos usar Flexbox para organizar los elementos dentro de cada
sección de nuestra página y luego usar Grid para colocar esas secciones
en el Layout general. Esto nos brinda la flexibilidad de Flexbox junto
con la estructura y el control de Grid, ¡como tener a Batman y Robin
trabajando juntos para salvar Gotham!


https://www.pragma.com.co/academia/lecciones/10-pasos-para-una-maquetacion-eficiente-con-html-y-css



## Antes de tirar código

### 1. Arquitectura de la información definida

Tener clara la arquitectura de la información te ayudará a
estructurar las páginas y los componentes de tu proyecto, además de las
etiquetas semánticas `<h1>`, `<h2>`, `<h3>`, `<p>`,

<section>, etc. También tendrás claras las URLs de las páginas del
 proyecto para cuando debas hacer la lógica del enrutamiento más 
adelante.

![10 pasos para una maquetación eficiente con HTML y CSS](https://www.pragma.com.co/hs-fs/hubfs/charity_app_ia.png?width=600&name=charity_app_ia.png)

### 2. Flujos de navegación claros

Esto te ayudará a maquetar los componentes en el contexto de la
aplicación y te guiará en la toma de decisiones de la estructura de
páginas, del código y de las carpetas donde ubicarás los diferentes
componentes del proyecto.

![10 pasos para una maquetación eficiente con HTML y CSS](https://www.pragma.com.co/hs-fs/hubfs/uinavigation.png?width=600&name=uinavigation.png)

### 3. Insumos gráficos aprobados y optimizados

Asegúrate de tener todo lo necesario para empezar a maquetar. El
punto de partida es tener acceso a la última versión del diseño aprobada
 por el Product Owner en herramientas gráficas como Adobe XD, acompañado
 de las imágenes optimizadas para medios digitales, paleta de colores,
tipografías, microinteracciones, etc. **La comunicación con el equipo de diseño gráfico es vital para que tu tiempo como maquetador sea el más efectivo posible.**

### **4. ¿Qué elementos son reusables en la interfaz?**

Botones, inputs, íconos, templates (estructuras de páginas), entre
otros; son los elementos que pueden identificarse en el escaneo visual
inicial del diseño de la UI. Estos elementos pueden ser los primeros que
 se maquetan, para que sean reusados más adelante en los otros
componentes.

![10 pasos para una maquetación eficiente con HTML y CSS 3](https://www.pragma.com.co/hs-fs/hubfs/styleguides_07.jpg?width=600&name=styleguides_07.jpg)

### 5. ¿En qué navegadores y dispositivos se soportará la aplicación?

Esta información será vital para que sepas qué propiedades podrás
usar en CSS o los insumos gráficos que necesitarás para asegurar la
misma experiencia de usuario en los diferentes navegadores y
dispositivos.

## Al tirar código

### 6. De lo general a lo específico

Teniendo en cuenta que la información del sitio debe adaptarse a
diferentes dispositivos, piensa la UI como cajas móviles o estáticas que
 contienen otras cajas móviles o estáticas a través de las distintas
resoluciones.  **Las etiquetas semánticas en HTML, el modelo de
caja, las posiciones y los sistemas de rejilla en CSS te guiarán en la
construcción de los contenedores principales de la UI** , para llegar luego a los detalles del diseño.

![ejj](https://www.pragma.com.co/hs-fs/hubfs/ejj.png?width=512&name=ejj.png)

### 7. Busca constantemente buenas prácticas

Aunque se te ocurra una solución ingeniosa para un problema, siempre
es útil tener otros puntos de vista, e independiente de tu nivel de
conocimiento, nunca dejes de perseguir la mejor manera de hacer las
cosas.

### 8. Trabaja en equipo, aprende a preguntar rápido y sé recursivo

Solos vamos más rápido, pero acompañados llegamos más lejos. **Los retos compartidos abren paso a soluciones más creativas, eficientes y efectivas.**
 Seguramente alguien más tuvo un problema como el que tienes, y
ahorrarás tiempo de desarrollo si absorbes ideas rápidas que te lleven a
 la solución.

### 9. Todo puede cambiar

Las necesidades del entorno pueden ser muy variables y el desarrollo
debe estar pensado para eso. Si algún componente cambia, y ya estabas
preparado, ahorrarás tiempo y te tomará menos esfuerzo hacer el cambio.

### 10. Atención a los detalles

“Los detalles no son solo detalles, ellos hace el diseño” (Charles
Eames). Como maquetadores se vuelve crucial desarrollar el “ojo de
pixel”, con el fin de ejecutar interfaces con detalles enfocados a la
experiencia final de los usuarios. **Un buen “ojo de pixel” puede ayudarte a predecir y corregir errores de interfaz** a tiempo y a perfeccionar tus habilidades gráficas.

https://www.arsys.es/blog/trucos-utiles-css-disenoweb



# Trucos útiles de CSS para facilitar el diseño de cualquier página web

    Compartir:
						[](mailto:?Subject=Trucos útiles de CSS para facilitar el diseño de cualquier página web&Body=Este post del blog de Arsys quizás te interese: https://www.arsys.es/blog/trucos-utiles-css-disenoweb)[
](https://www.facebook.com/sharer.php?u=https://www.arsys.es/blog/trucos-utiles-css-disenoweb)
						[
](https://www.linkedin.com/shareArticle?mini=true&url=https://www.arsys.es/blog/trucos-utiles-css-disenoweb)
						[](https://x.com/intent/post?url=https://www.arsys.es/blog/trucos-utiles-css-disenoweb)
						[](https://wa.me/?text=Este post del blog de Arsys quizás te interese: https://www.arsys.es/blog/trucos-utiles-css-disenoweb)

3min

Recopilamos  **diez pequeños trucos CSS, al alcance de cualquier desarrollador y esenciales para cualquier [sitio web](https://www.arsys.es/pagina-web/crear)** . Usados en su conjunto o por separado, harán que cualquier diseño resulte más fácil de acometer. Aunque hablemos de CSS,  **recuerda comenzar por un buen HTML** ,
 ya que cualquier diseño comienza por una buena base con el lenguaje de
etiquetas. Debes mantener el HTML sencillo, aplicar una buena semántica y
 limitarlo a expresar el contenido, nunca la presentación.

Índice* [1o Trucos en CSS para mejorar el diseño web](https://www.arsys.es/blog/trucos-utiles-css-disenoweb#tree-1)

## 1o Trucos en CSS para mejorar el diseño web

### ** *Box-sizing* .**

Todo diseño debería comenzar por el uso de la propiedad  *box-sizing* ,
 ya que te elimina diferencias en el modelo de caja entre navegadores.
Así cuando pruebes tus páginas en diversos navegadores tendrás más
posibilidades de que todo esté colocado en el mismo lugar.

```
*{
box-sizing: border-box;
}
```

### **Contenedor principal centrado.**

Centrar un contenedor principal es tarea habitual:

```css
#contenedor{
margin: 0 0 32px 0;}
```

### **Deja que se adapte.**

Permite que los contenidos se adapten a las dimensiones de los
contenedores, para ello usas medidas relativas. No solo en los tamaños
de los elementos, también en atributos como el margen.

```css
.articulo{
width: 32%;
margin: 0 0 32px 0;}
```

### **Ni *inline* ni  *block* .**

El estilo de *display: inline-block* combina las distintas alternativas de cajas *inline* y  *block* .
 Permite que los elementos se posiciones línea pero permite que sigan
comportándose como elementos de bloque a la hora de aceptar los
atributos de estilo y el valores de [posicionamiento](https://www.arsys.es/herramientas/seo).

```css
a.bloque{
display: inline-block;
}
```

### ***Overflow* para el problema del  *float* .**

En las cajas que tienen fondos y cuyo crecimiento es debido a
contener elementos flotantes, ocurre que los fondos no llegan a ocupar
el área que deberían, quedándose como plegados en la parte superior.
Esto lo solucionas con el atributo  *overflow* .

```css
#contenedorConFlotantes{
overflow: hidden;
}
```

 **Listas horizontales** .

Los elementos de listas pueden vivir en la horizontal sin problemas,
puedes eliminar las feas bolitas o bullets y hacer que floten para crear
 barras de navegación, listas de etiquetas, etc.

```css
li{
width: 100px;
height: 20px;
margin: 0 0 32px 0;list-style: none;
background-color: burlywood;
}
```

 **Usando *inline-block* en elementos de lista** .

La misma funcionalidad de antes la puedes conseguir con *inline-block* y evitas el problema derivado de las cajas flotantes descrito en el punto 5.

```css
li{
display: inline-block;
width: 100px;
height: 20px;
margin: 0 0 32px 0;background-color: burlywood;
list-style: none;
}
```

 **Alineación vertical con* table-cell*** .

Si usas el modelo de tablas desde css, con los display correctos,
puedes conseguir la siempre difícil alineación vertical, ya que las
celdas sí que permiten el atributo  *vertical-align* . Además, funciona de manera generalizada en los navegadores.

```css
.caja{
display: table-cell;
vertical-align: middle;
}
```

### **RGBA en los colores con transparencia.**

Ya disponemos de transparencia en los colores, por canal RGBA, sin necesidad de hacer trucos con imágenes png.

```css
#soloFondoSemitransparente {
background-color: rgba(255, 120, 50, 0.5);
}
```

### **Includes de CSS.**

Para distribuir tu CSS en diferentes archivos no realices los poco recomendados *@import,*
 pues implica más conexiones al servidor. Los preprocesadores CSS te
permiten eso y mucho más, aprende uno. Less es muy sencillo. Este código
 estaría en un archivo .less y se incluyen otros archivos less con las
distintas partes de tu código Less. Antes de publicar tu web tendrás que
 procesar los less y generar el CSS, lo que resulta muy sencillo
mediante diferentes herramientas.

```javascript
// CSS reset
@import 'reset.less';
@import 'site.less';
```
