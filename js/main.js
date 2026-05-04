/**
 * Librería Aurora - JavaScript Principal
 */

document.addEventListener('DOMContentLoaded', function () {

  /* ============================================
     ANNOUNCER ARIA-LIVE
     Utilidad para anunciar cambios a lectores de pantalla
     ============================================ */
  function announce(message) {
    var announcer = document.getElementById('ariaAnnouncer');
    if (announcer) {
      announcer.textContent = '';
      // Forzar repintado para que el lector de pantalla detecte el cambio
      setTimeout(function () {
        announcer.textContent = message;
      }, 100);
    }
  }

  /* ============================================
     MENÚ HAMBURGUESA MÓVIL
     Botón visible solo en pantallas pequeñas,
     con focus trap y gestión de ARIA
     ============================================ */
  var menuToggle = document.getElementById('menuToggle');
  var mainNav = document.getElementById('mainNav');

  if (menuToggle && mainNav) {
    var menuLinks = mainNav.querySelectorAll('a');
    var firstMenuLink = menuLinks[0];
    var lastMenuLink = menuLinks[menuLinks.length - 1];

    function openMenu() {
      mainNav.classList.add('active');
      menuToggle.setAttribute('aria-expanded', 'true');
      menuToggle.setAttribute('aria-label', 'Cerrar menú de navegación');
      // Enfocar primer enlace del menú
      if (firstMenuLink) firstMenuLink.focus();
      announce('Menú de navegación abierto');
    }

    function closeMenu() {
      mainNav.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Abrir menú de navegación');
      menuToggle.focus();
      announce('Menú de navegación cerrado');
    }

    menuToggle.addEventListener('click', function () {
      var isOpen = mainNav.classList.contains('active');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Focus trap dentro del menú móvil
    mainNav.addEventListener('keydown', function (e) {
      if (!mainNav.classList.contains('active')) return;

      if (e.key === 'Escape') {
        closeMenu();
        return;
      }

      if (e.key === 'Tab') {
        if (e.shiftKey) {
          // Shift+Tab: si estamos en el primer enlace, volver al botón
          if (document.activeElement === firstMenuLink) {
            e.preventDefault();
            lastMenuLink.focus();
          }
        } else {
          // Tab: si estamos en el último enlace, volver al botón
          if (document.activeElement === lastMenuLink) {
            e.preventDefault();
            firstMenuLink.focus();
          }
        }
      }
    });

    // Cerrar menú al redimensionar (si volvemos a escritorio)
    window.addEventListener('resize', function () {
      if (window.innerWidth > 768 && mainNav.classList.contains('active')) {
        closeMenu();
      }
    });
  }

  /* ============================================
     TEMA OSCURO
     ============================================ */
  const themeToggle = document.getElementById('themeToggle');
  const themeToggleFooter = document.getElementById('themeToggleFooter');

  function setTheme(dark) {
    if (dark) {
      document.body.classList.add('theme-dark');
      localStorage.setItem('theme', 'dark');
      updateLogo('dark');
      announce('Modo oscuro activado');
    } else {
      document.body.classList.remove('theme-dark');
      localStorage.setItem('theme', 'light');
      updateLogo('light');
      announce('Modo claro activado');
    }
    updateToggleButtons(dark);
  }

  function updateLogo(theme) {
    const logos = document.querySelectorAll('.logo');
    logos.forEach(function (logo) {
      if (theme === 'dark') {
        logo.src = 'img/logo_oscuro.svg';
      } else {
        logo.src = 'img/logo_claro.svg';
      }
    });
  }

  function updateToggleButtons(dark) {
    const text = dark ? 'Modo claro' : 'Modo oscuro';
    if (themeToggle) themeToggle.textContent = text;
    if (themeToggleFooter) themeToggleFooter.textContent = text;
  }

  // Cargar tema guardado
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    setTheme(true);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      setTheme(!document.body.classList.contains('theme-dark'));
    });
  }

  if (themeToggleFooter) {
    themeToggleFooter.addEventListener('click', function () {
      setTheme(!document.body.classList.contains('theme-dark'));
    });
  }

  /* ============================================
     SCROLL ANIMATIONS
     IntersectionObserver para activar animaciones al scroll
     ============================================ */
  const scrollElements = document.querySelectorAll('.scroll-animate, .scale-in');

  if ('IntersectionObserver' in window) {
    const scrollObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          scrollObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });

    scrollElements.forEach(function (el) {
      scrollObserver.observe(el);
    });
  } else {
    // Fallback: mostrar todo
    scrollElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }

  /* ============================================
     LAZY LOADING
     Carga imágenes solo cuando son visibles
     ============================================ */
  const lazyImages = document.querySelectorAll('img[data-src]');

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
          }
          img.removeAttribute('data-src');
          img.removeAttribute('data-srcset');
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '100px'
    });

    lazyImages.forEach(function (img) {
      imageObserver.observe(img);
    });
  } else {
    // Fallback
    lazyImages.forEach(function (img) {
      img.src = img.dataset.src;
    });
  }

  /* ============================================
     LIGHTBOX + Focus trap + Focus restoration
     Al hacer click en imagen de producto, abrir grande
     ============================================ */
  var lightboxOverlay = document.getElementById('lightbox');
  var lightboxTrigger = null; // Guardar el elemento que abrió el lightbox

  // Focus trap para el lightbox
  function trapFocusInLightbox(e) {
    if (e.key !== 'Tab' || !lightboxOverlay || !lightboxOverlay.classList.contains('active')) return;

    var closeBtn = lightboxOverlay.querySelector('.lightbox-close');
    var lightboxImg = lightboxOverlay.querySelector('img');
    var focusableElements = [];
    if (closeBtn) focusableElements.push(closeBtn);
    if (lightboxImg) focusableElements.push(lightboxImg);

    if (focusableElements.length === 0) return;

    var firstFocusable = focusableElements[0];
    var lastFocusable = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  }

  // Delegación de eventos para lightbox
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-lightbox]');
    if (trigger) {
      e.preventDefault();
      lightboxTrigger = trigger; // Guardar referencia para restaurar foco
      var largeSrc = trigger.dataset.lightbox;
      if (lightboxOverlay) {
        var lightboxImg = lightboxOverlay.querySelector('img');
        lightboxImg.src = largeSrc;
        lightboxImg.alt = trigger.alt || 'Imagen ampliada';
        lightboxOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        // Enfocar el botón de cerrar para accesibilidad
        var closeBtn = lightboxOverlay.querySelector('.lightbox-close');
        if (closeBtn) closeBtn.focus();
        announce('Visor de imagen abierto. Pulsa Escape para cerrar.');
        // Activar focus trap
        document.addEventListener('keydown', trapFocusInLightbox);
      }
    }
  });

  function closeLightbox() {
    if (!lightboxOverlay) return;
    lightboxOverlay.classList.remove('active');
    document.body.style.overflow = '';
    // Desactivar focus trap
    document.removeEventListener('keydown', trapFocusInLightbox);
    // Restaurar foco al elemento que abrió el lightbox
    if (lightboxTrigger) {
      lightboxTrigger.focus();
      lightboxTrigger = null;
    }
    announce('Visor de imagen cerrado');
  }

  // Cerrar lightbox
  if (lightboxOverlay) {
    lightboxOverlay.addEventListener('click', function (e) {
      if (e.target === lightboxOverlay || e.target.closest('.lightbox-close')) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightboxOverlay.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  /* ============================================
     CHART.JS - Estadísticas de ventas
     ============================================ */
  const chartCanvas = document.getElementById('salesChart');
  if (chartCanvas && typeof Chart !== 'undefined') {
    const ctx = chartCanvas.getContext('2d');

    // Datos de ventas mensuales
    const salesData = {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
      datasets: [
        {
          label: 'Ventas 2024',
          data: [65, 59, 80, 81, 56, 55, 72, 88, 95, 110, 130, 145],
          borderColor: '#6a4c93',
          backgroundColor: 'rgba(106, 76, 147, 0.15)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 7,
          pointBackgroundColor: '#6a4c93'
        },
        {
          label: 'Ventas 2025',
          data: [78, 70, 95, 100, 68, 75, 90, 105, 120, 140, 155, 170],
          borderColor: '#b8a9c9',
          backgroundColor: 'rgba(184, 169, 201, 0.15)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 7,
          pointBackgroundColor: '#b8a9c9'
        }
      ]
    };

    // Datos por categoría
    const categoryData = {
      labels: ['Ficción', 'Poesía', 'Ensayo', 'Infantil', 'Clásicos', 'Ciencia'],
      datasets: [{
        label: 'Unidades vendidas',
        data: [320, 180, 210, 250, 190, 140],
        backgroundColor: [
          'rgba(106, 76, 147, 0.8)',
          'rgba(184, 169, 201, 0.8)',
          'rgba(150, 100, 200, 0.8)',
          'rgba(200, 150, 230, 0.8)',
          'rgba(80, 50, 120, 0.8)',
          'rgba(120, 80, 170, 0.8)'
        ],
        borderColor: '#fff',
        borderWidth: 2,
        hoverOffset: 15
      }]
    };

    let currentChart = new Chart(ctx, {
      type: 'line',
      data: salesData,
      options: {
        responsive: true,
        maintainAspectRatio: true,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: { family: 'Poppins', size: 13 },
              color: '#222'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(106, 76, 147, 0.9)',
            titleFont: { family: 'Poppins' },
            bodyFont: { family: 'Poppins' },
            padding: 12,
            cornerRadius: 8
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.06)' },
            ticks: { font: { family: 'Poppins' } }
          },
          x: {
            grid: { color: 'rgba(0,0,0,0.06)' },
            ticks: { font: { family: 'Poppins' } }
          }
        }
      }
    });

    // Controles del gráfico
    const chartBtns = document.querySelectorAll('.chart-btn');
    chartBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        chartBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');

        const type = btn.dataset.chart;
        currentChart.destroy();

        if (type === 'line') {
          currentChart = new Chart(ctx, {
            type: 'line',
            data: salesData,
            options: getChartOptions('line')
          });
        } else if (type === 'bar') {
          currentChart = new Chart(ctx, {
            type: 'bar',
            data: categoryData,
            options: getChartOptions('bar')
          });
        } else if (type === 'doughnut') {
          currentChart = new Chart(ctx, {
            type: 'doughnut',
            data: categoryData,
            options: getChartOptions('doughnut')
          });
        }
      });
    });

    function getChartOptions(type) {
      const base = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: type === 'doughnut' ? 'right' : 'top',
            labels: {
              font: { family: 'Poppins', size: 13 },
              color: '#222'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(106, 76, 147, 0.9)',
            titleFont: { family: 'Poppins' },
            bodyFont: { family: 'Poppins' },
            padding: 12,
            cornerRadius: 8
          }
        }
      };

      if (type !== 'doughnut') {
        base.scales = {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.06)' },
            ticks: { font: { family: 'Poppins' } }
          },
          x: {
            grid: { color: 'rgba(0,0,0,0.06)' },
            ticks: { font: { family: 'Poppins' } }
          }
        };
      }

      return base;
    }
  }

  /* ============================================
     NAVEGACIÓN ACTIVA
     Marca la página actual en el menú
     ============================================ */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.main-nav a');
  navLinks.forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  /* ============================================
     BUSCADOR SIMULADO
     ============================================ */
  const searchForms = document.querySelectorAll('.buscador');
  searchForms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const input = form.querySelector('input[type="search"]');
      if (input && input.value.trim()) {
        window.location.href = 'busqueda.html?q=' + encodeURIComponent(input.value.trim());
      }
    });
  });

  /* ============================================
     BOTÓN LEER MÁS / LEER MENOS
     ============================================ */
  document.querySelectorAll('.read-more-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var container = btn.closest('.read-more-container') || btn.previousElementSibling;
      if (!container) return;
      var isExpanded = container.classList.toggle('expanded');
      btn.textContent = isExpanded ? 'Leer menos' : 'Leer más';
    });
  });

  /* ============================================
     VALORACIÓN POR ESTRELLAS
     ============================================ */
  var starContainer = document.querySelector('.star-rating-interactive');
  var ratingLabel = document.getElementById('ratingLabel');

  if (starContainer && ratingLabel) {
    var stars = starContainer.querySelectorAll('.star');
    var ratingTexts = ['', 'Malo', 'Regular', 'Bueno', 'Muy bueno', 'Excelente'];

    stars.forEach(function (star) {
      star.addEventListener('click', function () {
        var value = star.dataset.value;
        stars.forEach(function (s) { s.classList.remove('selected'); });
        // Seleccionar esta estrella y todas las anteriores (direction: rtl)
        star.classList.add('selected');
        ratingLabel.textContent = 'Tu valoración: ' + value + '/5 — ' + ratingTexts[value];
        starContainer.setAttribute('aria-valuenow', value);
        announce('Has valorado el libro con ' + value + ' estrellas');
      });

      star.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          star.click();
        }
      });
    });
  }

  /* ============================================
     ATAJOS DE TECLADO
     ============================================ */
  var toastContainer = document.querySelector('.toast-container');

  function showToast(message) {
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.className = 'toast-container';
      toastContainer.style.cssText = 'position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;';
      document.body.appendChild(toastContainer);
    }
    var toast = document.createElement('div');
    toast.className = 'toast-item';
    toast.style.cssText = 'background:var(--primary);color:#fff;padding:0.6rem 1.2rem;border-radius:0.5rem;margin-top:0.5rem;font-size:0.85rem;font-family:var(--font-main);opacity:0;transform:translateY(10px);transition:opacity 0.3s,transform 0.3s;box-shadow:0 2px 8px rgba(0,0,0,0.2);';
    toast.textContent = message;
    toastContainer.appendChild(toast);
    requestAnimationFrame(function () {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });
    setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(function () { toast.remove(); }, 300);
    }, 2000);
  }

  document.addEventListener('keydown', function (e) {
    var tag = document.activeElement.tagName.toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

    if (e.key === 't' || e.key === 'T') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast('Scroll al inicio (atajo: T)');
    }
    if (e.key === '/') {
      e.preventDefault();
      var searchInput = document.getElementById('searchInput');
      if (searchInput) searchInput.focus();
      showToast('Buscador enfocado (atajo: /)');
    }
  });

});