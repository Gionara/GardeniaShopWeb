document.addEventListener("DOMContentLoaded", function () {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    function agregarAlCarrito(producto, cantidad) {
        const productoExistente = carrito.find(item => item.producto.id === producto.id);
        if (productoExistente) {
            const totalEnCarrito = productoExistente.cantidad + cantidad;
            if (totalEnCarrito > producto.stock) {
                const cantidadPermitida = producto.stock - productoExistente.cantidad;
                if (cantidadPermitida > 0) {
                    productoExistente.cantidad += cantidadPermitida;
                    alert(`No puedes añadir más de ${producto.stock} unidades de este producto al carrito.`);
                } else {
                    alert('Este producto ya está en el carrito en la cantidad máxima permitida.');
                }
            } else {
                productoExistente.cantidad += cantidad;
            }
        } else {
            if (cantidad <= producto.stock) {
                carrito.push({ producto, cantidad });
            } else {
                alert(`No puedes añadir más de ${producto.stock} unidades de este producto.`);
                return;
            }
        }
        guardarCarrito();
        actualizarCarrito();
    }

    function modificarCantidad(producto, nuevaCantidad) {
        const productoExistente = carrito.find(item => item.producto.id === producto.id);
        if (productoExistente) {
            if (nuevaCantidad <= producto.stock) {
                productoExistente.cantidad = nuevaCantidad;
            } else {
                alert(`No puedes seleccionar más de ${producto.stock} unidades de este producto.`);
                productoExistente.cantidad = producto.stock;
            }
            if (productoExistente.cantidad <= 0) {
                eliminarProducto(producto);
            } else {
                guardarCarrito();
                actualizarCarrito();
            }
        }
    }

    function eliminarProducto(producto) {
        carrito = carrito.filter(item => item.producto.id !== producto.id);
        actualizarCarrito();
        guardarCarrito();
    }

    function guardarCarrito() {
        localStorage.setItem('carrito', JSON.stringify(carrito));
        var csrftoken = getCookie('csrftoken');
        $.ajax({
            url: 'shopWeb/guardar_carrito/',
            type: 'POST',
            headers: { 'X-CSRFToken': csrftoken },
            contentType: 'application/json',
            data: JSON.stringify({ carrito: carrito }),
            success: function(response) {
                console.log('Carrito guardado exitosamente:', response);
            },
            error: function(xhr, status, error) {
                console.error('Error al guardar el carrito:', error);
            }
        });
    }

    function cargarCarrito() {
        const carritoGuardado = JSON.parse(localStorage.getItem('carrito'));
        if (carritoGuardado) {
            carrito = carritoGuardado;
            actualizarCarrito();
        }
    }

    function actualizarCarrito() {
        const carritoContainer = document.getElementById('carrito-container');
        if (carritoContainer) {
            carritoContainer.innerHTML = '';
            let total = 0;

            carrito.forEach(item => {
                total += item.producto.precio * item.cantidad;
                const itemElement = document.createElement('div');
                itemElement.classList.add('carrito-item');
                itemElement.innerHTML = `
                    <div class="row m-3">
                        <img class="col-6" src="${item.producto.imagen}" alt="${item.producto.nombre}">
                        <div class="col-6">
                            <div class="carrito-item-nombre">${item.producto.nombre}</div>
                            <div class="carrito-item-precio">Precio: $${(item.producto.precio * item.cantidad).toFixed(0)}</div>
                        </div>
                        <div class="input-group carrito-item-cantidad col-6 justify-content-center m-3">
                            <span class="input-group-text">Cantidad:</span>
                            <button class="btn btn-outline-secondary btn-sm menos-btn" data-id="${item.producto.id}">-</button>
                            <input type="number" class="form-control form-control-sm cantidad-input" value="${item.cantidad}" min="1" max="${item.producto.stock}" readonly>
                            <button class="btn btn-outline-secondary btn-sm mas-btn" data-id="${item.producto.id}">+</button>
                            <button class="btn btn-sm btn-danger eliminar-producto" data-id="${item.producto.id}">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
                carritoContainer.appendChild(itemElement);
            });

            const totalContainer = document.getElementById('total-container');
            if (totalContainer) {
                totalContainer.innerHTML = `<h4>Total: $${total.toLocaleString()} </h4>`;
            }

            const carritoIcono = document.getElementById('carrito-icono');
            if (carritoIcono) {
                const totalCantidad = carrito.reduce((total, item) => total + item.cantidad, 0);
                carritoIcono.textContent = totalCantidad;
            }

            const cantidadTotalCarrito = document.getElementById('cantidad-total');
            if (cantidadTotalCarrito) {
                const totalCantidadCarrito = carrito.reduce((total, item) => total + item.cantidad, 0);
                cantidadTotalCarrito.innerHTML = `<h4>Cantidad de Productos: ${totalCantidadCarrito} </h4>`;
            }

            document.querySelectorAll('.menos-btn').forEach(btn => {
                btn.removeEventListener('click', handleMenosButtonClick);
                btn.addEventListener('click', handleMenosButtonClick);
            });

            document.querySelectorAll('.mas-btn').forEach(btn => {
                btn.removeEventListener('click', handleMasButtonClick);
                btn.addEventListener('click', handleMasButtonClick);
            });

            document.querySelectorAll('.eliminar-producto').forEach(btn => {
                btn.removeEventListener('click', handleEliminarProductoClick);
                btn.addEventListener('click', handleEliminarProductoClick);
            });
        }
    }

    function handleMenosButtonClick(event) {
        const btn = event.currentTarget;
        const productoId = btn.getAttribute('data-id');
        const producto = carrito.find(item => item.producto.id == productoId);
        if (producto) {
            modificarCantidad(producto.producto, producto.cantidad - 1);
        }
    }

    function handleMasButtonClick(event) {
        const btn = event.currentTarget;
        const productoId = btn.getAttribute('data-id');
        const producto = carrito.find(item => item.producto.id == productoId);
        if (producto) {
            const nuevaCantidad = producto.cantidad + 1;
            if (nuevaCantidad <= producto.producto.stock) {
                modificarCantidad(producto.producto, nuevaCantidad);
            } else {
                alert(`No puedes seleccionar más de ${producto.producto.stock} unidades de este producto.`);
            }
        }
    }

    function handleEliminarProductoClick(event) {
        const btn = event.currentTarget;
        const productoId = btn.getAttribute('data-id');
        const producto = carrito.find(item => item.producto.id == productoId);
        if (producto) {
            eliminarProducto(producto.producto);
        }
    }

    document.querySelectorAll('.añadir-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.card');
            const id = card.getAttribute('data-id');
            const nombre = card.getAttribute('data-nombre');
            const precio = parseFloat(card.getAttribute('data-precio'));
            const imagen = card.getAttribute('data-imagen');
            const stock = parseInt(card.getAttribute('data-stock'));

            const cantidadInput = card.querySelector('.cantidad-input');
            const cantidad = parseInt(cantidadInput.value);

            const producto = { id, nombre, precio, imagen, stock };
            agregarAlCarrito(producto, cantidad);
        });
    });

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; cookies.length > i; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    cargarCarrito();
    actualizarCarrito();
});
//KJHGFDS