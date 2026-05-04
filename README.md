# Librería Aurora

> Tu librería de confianza en Madrid

Sitio web estático desarrollado como proyecto académico para el curso 2024/2025. La web simula una librería independiente ubicada en Madrid, con catálogo de productos, carrito de compras, información de contacto y diversas funcionalidades interactivas.

## Autor

- **Nombre:** [Tu nombre]
- **Curso:** Desarrollo Web — Curso 2024/2025
- **Asignatura:** Proyecto de desarrollo web con HTML5, CSS3 y JavaScript

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

## Instalación y uso local

1. Clona el repositorio:
   ```bash
   git clone https://github.com/TU_USUARIO/libreria-aurora.git
   cd libreria-aurora
   ```

2. Abre `index.html` directamente en tu navegador, o utiliza un servidor local:
   ```bash
   # Con Python 3
   python3 -m http.server 8080

   # Con Node.js
   npx serve .
   ```

3. Visita `http://localhost:8080` en tu navegador.

## Accesibilidad

El sitio ha sido diseñado siguiendo las pautas WCAG 2.1 nivel AA. Incluye:

- Skip-link para saltar al contenido principal
- Menú hamburguesa con focus trap para navegación con teclado
- Región `aria-live` para anuncios dinámicos a lectores de pantalla
- Atributos `aria-label`, `aria-expanded`, `aria-current` y `role` en elementos interactivos
- Etiquetas semánticas: `header`, `nav`, `main`, `footer`, `section`, `article`
- Datos estructurados JSON-LD (schema.org) para SEO
- Meta tags Open Graph y Twitter Cards
- Soporte para `prefers-reduced-motion`
- Clase `.sr-only` para contenido visible solo por lectores de pantalla

## Licencia

Este proyecto ha sido creado con fines educativos. El código fuente se distribuye bajo licencia MIT.

---

**Librería Aurora** — Curso 2024/2025
