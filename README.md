# 📖 Legendarium de J.R.R Tolkien

Una aplicación web interactiva tipo SPA (Single Page Application) que explora el vasto universo literario de J.R.R. Tolkien. La aplicación muestra información detallada sobre *El Señor de los Anillos*, *El Hobbit* y otras obras del autor, cargando el contenido de forma dinámica y fluida.

## ✨ Características Principales

* **Carga Dinámica de Contenido:** Renderizado asíncrono utilizando peticiones `fetch` y `async/await` para consumir y organizar datos estructurados desde un archivo local (`data.json`).
* **Vanilla JavaScript:** Desarrollo completo de la lógica de navegación y manipulación avanzada del DOM sin depender de frameworks o librerías externas.
* **Generación Compleja de UI:** El script es capaz de interpretar objetos JSON anidados para generar dinámicamente texto, listas simples y ordenadas, tablas detalladas y layouts de imágenes.
* **Diseño Responsivo e Inmersivo:** * Interfaz diseñada con CSS3 utilizando variables globales para manejo de temas.
  * Efectos de cristal (backdrop-filter) y transiciones fluidas.
  * Layouts adaptativos mediante CSS Grid (clases `grip_container-i` y `grip_container-d`) que se ajustan automáticamente en dispositivos móviles.
* **Navegación Intuitiva:** Menú lateral interactivo (sidebar) con sistema de "overlay" que oscurece el fondo al activarse y bloquea el scroll de la página principal.

## 🛠️ Tecnologías Utilizadas

* **HTML5:** Estructura semántica básica.
* **CSS3:** Estilos, animaciones (`transform`, `transition`), Grid y Flexbox.
* **JavaScript (ES6+):** Lógica funcional, delegación de eventos y consumo de API nativa (Fetch).
* **JSON:** Actúa como una base de datos local ligera y estructurada que alimenta la vista.

## 📂 Estructura del Proyecto

```text
/
├── index.html   # Estructura principal, cabecera y contenedores vacíos para la SPA.
├── style.css    # Hoja de estilos globales, media queries y variables.
├── script.js    # Motor de la app: eventos, enrutamiento ligero y funciones de renderizado.
├── data.json    # Base de datos que contiene todos los textos, rutas de imágenes y configuración de layouts.
└── img/         # Carpeta con los recursos gráficos (logos, portadas de libros, fondos).