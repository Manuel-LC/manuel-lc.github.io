# Librería Aurora

La web simula una librería independiente ubicada en Madrid, con catálogo de productos, carrito de compras, información de contacto y diversas funcionalidades interactivas.

## Autor

- **Nombre:** Manuel López Castillo
- **Curso:** Desarrollo de aplicaciones web - Curso 2025/2026
- **Módulo:** Diseño de interfaces web

## Descripción del proyecto

Librería Aurora es una página web multi-página construida con HTML5, CSS3 y JavaScript vanilla, utilizando Bootstrap 5 como framework CSS. El proyecto incluye las siguientes funcionalidades principales:

- **Catálogo de libros:** Páginas de inicio, productos, búsqueda y ficha de producto detallada.
- **Carrito de compras:** Sistema de carrito dinámico con localStorage para persistencia de datos.
- **Contacto:** Información de contacto, equipo, mapa embebido y formulario.
- **Modo oscuro:** Cambio de tema claro/oscuro con preferencia del sistema y persistencia.
- **Interactividad:** Gráficos con Chart.js, lightbox de imágenes, animaciones CSS al scroll, y microinteracciones.
- **Accesibilidad:** Skip-link, menú hamburguesa con focus trap, aria-live, etiquetas semánticas, datos estructurados JSON-LD y metadatos SEO completos.

## Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| HTML5 | Estructura semántica de las páginas |
| CSS3 | Estilos propios con variables CSS, flexbox, grid, animaciones y media queries |
| JavaScript | Interactividad: menú móvil, tema oscuro, lightbox, gráficos, carrito |
| Bootstrap 5.3.3 | Componentes UI (badges, breadcrumbs, alertas, tabs) |
| Chart.js 4.4.7 | Gráficos interactivos de ventas |
| Google Fonts | Tipografía Poppins |
| FontAwesome | Iconos (en algunas versiones) |

## Estructura del proyecto

```
libreria-aurora/
├── index.html              # Página principal (landing)
├── producto.html           # Ficha de producto
├── contacto.html           # Contacto y equipo
├── busqueda.html           # Resultados de búsqueda
├── carrito.html            # Carrito de compras
├── informacion.html        # Sobre nosotros, mapa y vídeo
├── css/
│   ├── estilos.css         # Hoja de estilos principal
│   └── animaciones-logo.css # Animaciones SVG del logo
├── js/
│   └── main.js             # JavaScript principal
├── img/
│   ├── favicon.svg         # Favicon del sitio
│   ├── logo_claro.svg      # Logo modo claro
│   ├── logo_oscuro.svg     # Logo modo oscuro
│   ├── hero_books.jpg      # Imagen hero
│   ├── banner_libreria.jpg # Banner promocional
│   ├── equipo.jpg          # Foto de equipo
│   └── *.svg               # Iconos decorativos
└── README.md
```
## Licencia

Este proyecto ha sido creado con fines educativos. El código fuente se distribuye bajo licencia MIT.

---

**Librería Aurora** — Curso 2025/2026
