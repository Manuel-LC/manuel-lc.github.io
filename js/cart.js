/**
 * Librería Aurora - Carrito de compras
 * Persistencia en localStorage, renderizado dinámico,
 * panel desplegable y modal de confirmación Bootstrap.
 */

/* ============================================
   CATÁLOGO DE PRODUCTOS
   Datos estáticos de los libros disponibles
   ============================================ */
var CATALOGO = [
  {
    id: 1,
    nombre: 'El jardín secreto',
    precio: 14.90,
    imagen: 'https://editorialverbum.es/wp-content/uploads/2020/12/El-jardin-secreto.jpg',
    autor: 'Frances H. Burnett'
  },
  {
    id: 2,
    nombre: 'La voz de los árboles',
    precio: 12.50,
    imagen: 'https://www.udllibros.com/imagenes/9788418/978841853807.JPG?version=79557',
    autor: 'Autor Anónimo'
  },
  {
    id: 3,
    nombre: 'Los caminos de la luz',
    precio: 11.90,
    imagen: 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1683896858i/153231338.jpg',
    autor: 'Autor Anónimo'
  },
  {
    id: 4,
    nombre: 'El tiempo en las sombras',
    precio: 16.00,
    imagen: 'https://cdn.shopify.com/s/files/1/1161/3498/files/9781702264211.jpg?v=1703730470&width=1200&crop=center',
    autor: 'Autor Anónimo'
  },
  {
    id: 5,
    nombre: 'Cien años de soledad',
    precio: 18.90,
    imagen: 'https://images.cdn2.buscalibre.com/fit-in/360x360/60/92/609292cd455de788e0bbd9fcb8e1bd53.jpg',
    autor: 'Gabriel García Márquez'
  },
  {
    id: 6,
    nombre: 'Don Quijote de la Mancha',
    precio: 15.50,
    imagen: 'https://imagessl0.casadellibro.com/a/l/tl5/1/9788420412146.jpg',
    autor: 'Miguel de Cervantes'
  },
  {
    id: 7,
    nombre: 'Rayuela',
    precio: 13.90,
    imagen: 'https://images.cdn2.buscalibre.com/fit-in/360x360/16/85/1685f8f5dbae81e04af749c27c8dfb61.jpg',
    autor: 'Julio Cortázar'
  },
  {
    id: 8,
    nombre: '1984',
    precio: 10.90,
    imagen: 'https://m.media-amazon.com/images/I/71kxaF-3JYL._AC_UF1000,1000_QL80_.jpg',
    autor: 'George Orwell'
  }
];

/* ============================================
   CLASE SHOPPING CART
   ============================================ */
var ShoppingCart = (function () {
  'use strict';

  function ShoppingCart(key) {
    this.key = key || 'libreriaAuroraCart';
    this.items = this._loadCart();
  }

  /* Cargar carrito desde localStorage */
  ShoppingCart.prototype._loadCart = function () {
    try {
      var data = localStorage.getItem(this.key);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn('Error al cargar carrito desde localStorage:', e);
      return [];
    }
  };

  /* Guardar carrito en localStorage */
  ShoppingCart.prototype._saveCart = function () {
    try {
      localStorage.setItem(this.key, JSON.stringify(this.items));
    } catch (e) {
      console.warn('Error al guardar carrito en localStorage:', e);
    }
  };

  /* Añadir un producto al carrito */
  ShoppingCart.prototype.addItem = function (productId, quantity) {
    quantity = quantity || 1;
    var existing = null;
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].id === productId) {
        existing = this.items[i];
        break;
      }
    }

    if (existing) {
      existing.cantidad += quantity;
    } else {
      var producto = this._findProduct(productId);
      if (producto) {
        this.items.push({
          id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          imagen: producto.imagen,
          cantidad: quantity
        });
      }
    }
    this._saveCart();
    this._updateCartBadge();
  };

  /* Eliminar producto del carrito */
  ShoppingCart.prototype.removeItem = function (productId) {
    this.items = this.items.filter(function (item) {
      return item.id !== productId;
    });
    this._saveCart();
    this._updateCartBadge();
  };

  /* Reducir cantidad */
  ShoppingCart.prototype.decreaseQuantity = function (productId) {
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].id === productId) {
        this.items[i].cantidad--;
        if (this.items[i].cantidad <= 0) {
          this.items.splice(i, 1);
        }
        break;
      }
    }
    this._saveCart();
    this._updateCartBadge();
  };

  /* Aumentar cantidad */
  ShoppingCart.prototype.increaseQuantity = function (productId) {
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].id === productId) {
        this.items[i].cantidad++;
        break;
      }
    }
    this._saveCart();
    this._updateCartBadge();
  };

  /* Modificar valor exacto */
  ShoppingCart.prototype.updateQuantity = function (productId, quantity) {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].id === productId) {
        this.items[i].cantidad = quantity;
        break;
      }
    }
    this._saveCart();
    this._updateCartBadge();
  };

  /* Vaciar carrito completo */
  ShoppingCart.prototype.clearCart = function () {
    this.items = [];
    this._saveCart();
    this._updateCartBadge();
  };

  /* Obtener total del carrito */
  ShoppingCart.prototype.getTotal = function () {
    var total = 0;
    for (var i = 0; i < this.items.length; i++) {
      total += this.items[i].precio * this.items[i].cantidad;
    }
    return total;
  };

  /* Obtener número total de elementos */
  ShoppingCart.prototype.getItemCount = function () {
    var count = 0;
    for (var i = 0; i < this.items.length; i++) {
      count += this.items[i].cantidad;
    }
    return count;
  };

  /* Buscar producto en catálogo */
  ShoppingCart.prototype._findProduct = function (productId) {
    for (var i = 0; i < CATALOGO.length; i++) {
      if (CATALOGO[i].id === productId) {
        return CATALOGO[i];
      }
    }
    return null;
  };

  /* Actualizar badge visual del carrito */
  ShoppingCart.prototype._updateCartBadge = function () {
    var badges = document.querySelectorAll('.cart-badge');
    var count = this.getItemCount();
    for (var i = 0; i < badges.length; i++) {
      badges[i].textContent = count;
      badges[i].style.display = count > 0 ? 'flex' : 'none';
    }
  };

  return ShoppingCart;
})();

/* ============================================
   INSTANCIA GLOBAL DEL CARRITO
   ============================================ */
var cart;

/* ============================================
   PANEL DESPLEGABLE DEL CARRITO
   Se crea dinámicamente en cada página.
   Al pulsar el icono del carrito, se muestra
   un panel lateral con resumen de productos.
   ============================================ */
function createCartPanel() {
  /* Overlay oscuro */
  var overlay = document.createElement('div');
  overlay.id = 'cartPanelOverlay';
  overlay.className = 'cart-panel-overlay';
  overlay.setAttribute('aria-hidden', 'true');

  /* Panel lateral */
  var panel = document.createElement('aside');
  panel.id = 'cartPanel';
  panel.className = 'cart-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', 'Resumen del carrito de compras');
  panel.setAttribute('aria-hidden', 'true');

  panel.innerHTML =
    '<div class="cart-panel-header">' +
    '  <h3>' +
    '    <img src="img/carrito.svg" alt="" width="22" height="22" aria-hidden="true" style="vertical-align: middle; margin-right: 0.5rem;" />' +
    '    Tu carrito ' +
    '    <span class="cart-badge cart-panel-badge" style="display:none;font-size:0.7rem;">0</span>' +
    '  </h3>' +
    '  <button id="cartPanelClose" type="button" aria-label="Cerrar panel del carrito">&times;</button>' +
    '</div>' +
    '<div class="cart-panel-body" id="cartPanelBody">' +
    '  <div class="cart-empty-state">' +
    '    <img src="img/carrito.svg" alt="" width="48" height="48" aria-hidden="true" style="opacity:0.3;margin-bottom:1rem;" />' +
    '    <p>Tu carrito está vacío</p>' +
    '    <a href="busqueda.html" class="cart-empty-link">Explorar libros</a>' +
    '  </div>' +
    '</div>' +
    '<div class="cart-panel-footer" id="cartPanelFooter">' +
    '  <div class="cart-panel-shipping">' +
    '    <img src="img/paquete.svg" alt="" width="16" height="16" aria-hidden="true" />' +
    '    <span id="cartPanelShippingMsg">Envío gratis en pedidos +30 €</span>' +
    '  </div>' +
    '  <p class="cart-total">Total: <strong id="cartPanelTotal">0,00 €</strong></p>' +
    '  <a href="carrito.html" class="btn-comprar btn-success" style="display:block;text-align:center;text-decoration:none;padding:0.8rem;font-size:1rem;">' +
    '    Ver carrito completo' +
    '  </a>' +
    '</div>';

  document.body.appendChild(overlay);
  document.body.appendChild(panel);

  /* Eventos para cerrar el panel */
  overlay.addEventListener('click', closeCartPanel);
  document.getElementById('cartPanelClose').addEventListener('click', closeCartPanel);

  /* Eventos para abrir el panel: click en botones .cart-btn */
  var cartButtons = document.querySelectorAll('.cart-btn');
  for (var i = 0; i < cartButtons.length; i++) {
    cartButtons[i].addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      openCartPanel();
    });
  }

  /* Actualizar badge al cargar */
  cart._updateCartBadge();
}

/* Abrir panel del carrito */
function openCartPanel() {
  var panel = document.getElementById('cartPanel');
  var overlay = document.getElementById('cartPanelOverlay');
  if (!panel || !overlay) return;

  renderCartPanel();

  panel.setAttribute('aria-hidden', 'false');
  overlay.setAttribute('aria-hidden', 'false');
  panel.classList.add('active');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  /* Enfocar botón de cerrar para accesibilidad */
  setTimeout(function () {
    var closeBtn = document.getElementById('cartPanelClose');
    if (closeBtn) closeBtn.focus();
  }, 150);
}

/* Cerrar panel del carrito */
function closeCartPanel() {
  var panel = document.getElementById('cartPanel');
  var overlay = document.getElementById('cartPanelOverlay');
  if (!panel || !overlay) return;

  panel.setAttribute('aria-hidden', 'true');
  overlay.setAttribute('aria-hidden', 'true');
  panel.classList.remove('active');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

/* Renderizar contenido del panel */
function renderCartPanel() {
  var body = document.getElementById('cartPanelBody');
  var totalEl = document.getElementById('cartPanelTotal');
  var footer = document.getElementById('cartPanelFooter');
  var shippingMsg = document.getElementById('cartPanelShippingMsg');

  if (!body) return;

  if (cart.items.length === 0) {
    body.innerHTML =
      '<div class="cart-empty-state">' +
      '  <img src="img/carrito.svg" alt="" width="48" height="48" aria-hidden="true" style="opacity:0.3;margin-bottom:1rem;" />' +
      '  <p>Tu carrito está vacío</p>' +
      '  <a href="busqueda.html" class="cart-empty-link">Explorar libros</a>' +
      '</div>';
    if (totalEl) totalEl.textContent = '0,00 €';
    if (footer) footer.style.display = 'none';
    return;
  }

  if (footer) footer.style.display = 'block';

  var html = '';
  for (var i = 0; i < cart.items.length; i++) {
    var item = cart.items[i];
    var subtotal = (item.precio * item.cantidad).toFixed(2).replace('.', ',');
    var precio = item.precio.toFixed(2).replace('.', ',');

    html +=
      '<div class="cart-panel-item">' +
      '  <img src="' + item.imagen + '" alt="Portada de ' + item.nombre + '" width="50" height="70" loading="lazy" />' +
      '  <div class="cart-panel-item-info">' +
      '    <p class="cart-panel-item-name">' + item.nombre + '</p>' +
      '    <p class="cart-panel-item-qty">' + item.cantidad + ' &times; ' + precio + ' €</p>' +
      '    <p class="cart-panel-item-subtotal"><strong>' + subtotal + ' €</strong></p>' +
      '  </div>' +
      '</div>';
  }

  body.innerHTML = html;

  var total = cart.getTotal().toFixed(2).replace('.', ',');
  if (totalEl) totalEl.textContent = total + ' €';

  /* Mensaje de envío */
  var cartTotal = cart.getTotal();
  if (shippingMsg) {
    if (cartTotal >= 30) {
      shippingMsg.textContent = '¡Tienes envío gratis!';
      shippingMsg.style.color = 'var(--success)';
    } else {
      var remaining = (30 - cartTotal).toFixed(2).replace('.', ',');
      shippingMsg.textContent = 'Te faltan ' + remaining + ' € para envío gratis';
      shippingMsg.style.color = '';
    }
  }

  /* Actualizar badge del panel */
  var panelBadge = document.querySelector('.cart-panel-badge');
  if (panelBadge) {
    panelBadge.textContent = cart.getItemCount();
    panelBadge.style.display = cart.getItemCount() > 0 ? 'flex' : 'none';
  }
}

/* ============================================
   RENDERIZADO DE LA PÁGINA carrito.html
   Genera dinámicamente el listado de productos,
   cantidades, precios y total.
   ============================================ */
function renderCartPage() {
  var container = document.getElementById('cartItemsContainer');
  var totalEl = document.getElementById('cartTotalPrice');
  var summaryEl = document.getElementById('cartSummary');
  var emptyEl = document.getElementById('cartEmpty');

  if (!container) return;

  /* Estado vacío */
  if (cart.items.length === 0) {
    container.innerHTML = '';
    container.style.display = 'none';
    if (emptyEl) emptyEl.style.display = 'block';
    if (summaryEl) summaryEl.style.display = 'none';
    return;
  }

  /* Estado con productos */
  container.style.display = 'flex';
  if (emptyEl) emptyEl.style.display = 'none';
  if (summaryEl) summaryEl.style.display = 'block';

  var html = '';
  for (var i = 0; i < cart.items.length; i++) {
    var item = cart.items[i];
    var subtotal = (item.precio * item.cantidad).toFixed(2).replace('.', ',');
    var precio = item.precio.toFixed(2).replace('.', ',');

    html +=
      '<article class="item scroll-animate visible" role="listitem" data-product-id="' + item.id + '">' +
      '  <img src="' + item.imagen + '" alt="Portada de ' + item.nombre + '" loading="lazy" width="120" height="160" />' +
      '  <div class="info">' +
      '    <h2>' + item.nombre + '</h2>' +
      '    <p class="precio">' + precio + ' €</p>' +
      '    <div class="cart-quantity-controls">' +
      '      <button class="cart-qty-btn cart-qty-minus" type="button" aria-label="Reducir cantidad de ' + item.nombre + '" data-id="' + item.id + '">−</button>' +
      '      <span class="cart-qty-value">' + item.cantidad + '</span>' +
      '      <button class="cart-qty-btn cart-qty-plus" type="button" aria-label="Aumentar cantidad de ' + item.nombre + '" data-id="' + item.id + '">+</button>' +
      '    </div>' +
      '    <p class="item-subtotal">Subtotal: <strong>' + subtotal + ' €</strong></p>' +
      '  </div>' +
      '  <button class="btn-comprar btn-danger cart-delete-btn" type="button" aria-label="Eliminar ' + item.nombre + ' del carrito" data-id="' + item.id + '" data-name="' + item.nombre + '">' +
      '    <img src="img/eliminar.svg" alt="" width="16" height="16" aria-hidden="true" style="vertical-align: middle;" />' +
      '  </button>' +
      '</article>';
  }

  container.innerHTML = html;

  /* Actualizar total */
  var total = cart.getTotal().toFixed(2).replace('.', ',');
  if (totalEl) totalEl.textContent = total + ' €';

  /* Evento: botones de cantidad −/+ */
  var minusBtns = container.querySelectorAll('.cart-qty-minus');
  for (var j = 0; j < minusBtns.length; j++) {
    minusBtns[j].addEventListener('click', function () {
      var id = parseInt(this.dataset.id);
      cart.decreaseQuantity(id);
      renderCartPage();
      renderCartPanel();
      updateShippingAlert();
    });
  }

  var plusBtns = container.querySelectorAll('.cart-qty-plus');
  for (var k = 0; k < plusBtns.length; k++) {
    plusBtns[k].addEventListener('click', function () {
      var id = parseInt(this.dataset.id);
      cart.increaseQuantity(id);
      renderCartPage();
      renderCartPanel();
      updateShippingAlert();
    });
  }

  /* Evento: botón eliminar -> mostrar modal de confirmación */
  var deleteBtns = container.querySelectorAll('.cart-delete-btn');
  for (var m = 0; m < deleteBtns.length; m++) {
    deleteBtns[m].addEventListener('click', function (e) {
      e.stopPropagation();
      var id = parseInt(this.dataset.id);
      var name = this.dataset.name;
      showDeleteConfirmModal(id, name);
    });
  }
}

/* Actualizar alerta de envío gratis */
function updateShippingAlert() {
  var alertEl = document.getElementById('shippingAlert');
  if (!alertEl) return;

  var total = cart.getTotal();

  if (total === 0) {
    alertEl.style.display = 'none';
    return;
  }

  alertEl.style.display = 'block';

  if (total >= 30) {
    alertEl.className = 'alert alert-success mt-3';
    alertEl.setAttribute('role', 'status');
    alertEl.innerHTML =
      '<img src="img/paquete.svg" alt="" width="20" height="20" aria-hidden="true" style="vertical-align: middle; margin-right: 0.3rem;" /> ' +
      '¡Tienes <strong>envío gratis</strong> en tu pedido.';
  } else {
    var remaining = (30 - total).toFixed(2).replace('.', ',');
    alertEl.className = 'alert alert-info mt-3';
    alertEl.setAttribute('role', 'status');
    alertEl.innerHTML =
      '<img src="img/paquete.svg" alt="" width="20" height="20" aria-hidden="true" style="vertical-align: middle; margin-right: 0.3rem;" /> ' +
      'Te faltan <strong>' + remaining + ' €</strong> para disfrutar de <strong>envío gratis</strong>. ¡Añade otro libro!';
  }
}

/* ============================================
   MODAL DE CONFIRMACIÓN CON BOOTSTRAP 5
   Para eliminar productos del carrito
   ============================================ */
var pendingDeleteId = null;

function showDeleteConfirmModal(productId, productName) {
  pendingDeleteId = productId;

  var modalEl = document.getElementById('confirmDeleteModal');
  if (!modalEl) return;

  /* Actualizar texto del modal con el nombre del producto */
  var modalBody = modalEl.querySelector('.modal-body');
  if (modalBody) {
    modalBody.innerHTML =
      '¿Estás seguro de que deseas eliminar <strong>"' + productName + '"</strong> del carrito? Esta acción no se puede deshacer.';
  }

  /* Abrir modal con la API de Bootstrap */
  if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
    var modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
  }
}

/* Confirmar eliminación */
function handleConfirmDelete() {
  if (pendingDeleteId !== null) {
    var deletedName = '';
    for (var i = 0; i < cart.items.length; i++) {
      if (cart.items[i].id === pendingDeleteId) {
        deletedName = cart.items[i].nombre;
        break;
      }
    }

    cart.removeItem(pendingDeleteId);
    renderCartPage();
    renderCartPanel();
    updateShippingAlert();

    /* Notificación visual */
    if (window.showToast) {
      window.showToast('"' + deletedName + '" eliminado del carrito', 'danger');
    }

    pendingDeleteId = null;
  }

  /* Cerrar modal */
  var modalEl = document.getElementById('confirmDeleteModal');
  if (modalEl && typeof bootstrap !== 'undefined' && bootstrap.Modal) {
    var modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
  }
}

/* ============================================
   MODAL PARA VACIAR CARRITO
   ============================================ */
function showClearCartConfirmModal() {
  var modalEl = document.getElementById('clearCartModal');
  if (!modalEl) return;

  if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
    var modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
  }
}

function handleClearCart() {
  cart.clearCart();
  renderCartPage();
  renderCartPanel();

  if (window.showToast) {
    window.showToast('Carrito vaciado correctamente', 'info');
  }

  var modalEl = document.getElementById('clearCartModal');
  if (modalEl && typeof bootstrap !== 'undefined' && bootstrap.Modal) {
    var modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
  }
}

/* ============================================
   BOTONES "AÑADIR AL CARRITO"
   Se asignan a elementos con data-add-to-cart
   ============================================ */
function setupAddToCartButtons() {
  var btns = document.querySelectorAll('[data-add-to-cart]');
  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      var productId = parseInt(this.dataset.addToCart);
      cart.addItem(productId);

      /* Obtener nombre del producto */
      var producto = null;
      for (var j = 0; j < CATALOGO.length; j++) {
        if (CATALOGO[j].id === productId) {
          producto = CATALOGO[j];
          break;
        }
      }
      var nombre = producto ? producto.nombre : 'el producto';

      /* Notificación visual (toast) */
      if (window.showToast) {
        window.showToast('"' + nombre + '" añadido al carrito', 'success');
      }

      /* Abrir panel del carrito brevemente */
      openCartPanel();
      setTimeout(closeCartPanel, 1800);
    });
  }
}

/* ============================================
   INICIALIZACIÓN (DOMContentLoaded)
   ============================================ */
document.addEventListener('DOMContentLoaded', function () {
  /* Crear instancia global del carrito */
  cart = new ShoppingCart();

  /* Crear panel desplegable en todas las páginas */
  createCartPanel();

  /* Configurar botones "Añadir al carrito" */
  setupAddToCartButtons();

  /* Si estamos en la página del carrito, renderizar */
  if (document.getElementById('cartItemsContainer')) {
    renderCartPage();
    updateShippingAlert();
  }

  /* Configurar botones de confirmación del modal de eliminar */
  var confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', handleConfirmDelete);
  }

  /* Configurar botón de vaciar carrito (abrir modal) */
  var clearCartTriggerBtn = document.getElementById('clearCartBtn');
  if (clearCartTriggerBtn) {
    clearCartTriggerBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      showClearCartConfirmModal();
    });
  }

  /* Configurar confirmación de vaciar carrito */
  var clearCartConfirmBtn = document.getElementById('clearCartConfirmBtn');
  if (clearCartConfirmBtn) {
    clearCartConfirmBtn.addEventListener('click', handleClearCart);
  }

  /* Configurar botón "Finalizar compra" */
  var checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (cart.items.length === 0) {
        if (window.showToast) {
          window.showToast('Tu carrito está vacío', 'warning');
        }
      } else {
        if (window.showToast) {
          window.showToast('Redirigiendo al pago...', 'info');
        }
      }
    });
  }

  /* Cerrar panel del carrito con Escape */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      var panel = document.getElementById('cartPanel');
      if (panel && panel.classList.contains('active')) {
        closeCartPanel();
      }
    }
  });

  /* Trapping del foco dentro del panel del carrito */
  var cartPanel = document.getElementById('cartPanel');
  if (cartPanel) {
    cartPanel.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;

      var focusable = cartPanel.querySelectorAll('button:not([disabled]), a[href], input, select, [tabindex]:not([tabindex="-1"])');
      var first = focusable[0];
      var last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }
});
