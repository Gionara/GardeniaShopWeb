document.addEventListener("DOMContentLoaded", function () {
    // Evitar que se cierre el dropdown al hacer clic dentro
    document.querySelectorAll('.dropdown-menu').forEach(function (element) {
        element.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    });


    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    function agregarAlCarrito(producto, cantidad) {
        const productoExistente = carrito.find(item => item.producto.id === producto.id);
        if (productoExistente) {
            productoExistente.cantidad += cantidad;
        } else {
            carrito.push({ producto, cantidad });
        }
        actualizarCarrito();
        guardarCarrito();
    }

    function modificarCantidad(producto, nuevaCantidad) {
        const productoExistente = carrito.find(item => item.producto.id === producto.id);
        if (productoExistente) {
            productoExistente.cantidad = nuevaCantidad;
            if (productoExistente.cantidad <= 0) {
                eliminarProducto(producto);
            } else {
                actualizarCarrito();
                guardarCarrito();
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
                            <input type="text" class="form-control form-control-sm cantidad-input" value="${item.cantidad}" readonly>
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

            document.querySelectorAll('.menos-btn').forEach(button => {
                button.addEventListener('click', function () {
                    const id = this.getAttribute('data-id');
                    const productoExistente = carrito.find(item => item.producto.id == id);
                    if (productoExistente) {
                        const producto = productoExistente.producto;
                        const cantidadInput = this.nextElementSibling;
                        let cantidad = parseInt(cantidadInput.value);
                        if (cantidad > 1) {
                            cantidad--;
                            cantidadInput.value = cantidad;
                            modificarCantidad(producto, cantidad);
                        }
                    }
                });
            });

            document.querySelectorAll('.mas-btn').forEach(button => {
                button.addEventListener('click', function () {
                    const id = this.getAttribute('data-id');
                    const productoExistente = carrito.find(item => item.producto.id == id);
                    if (productoExistente) {
                        const producto = productoExistente.producto;
                        const cantidadInput = this.previousElementSibling;
                        let cantidad = parseInt(cantidadInput.value);
                        cantidad++;
                        cantidadInput.value = cantidad;
                        modificarCantidad(producto, cantidad);
                    }
                });
            });

            document.querySelectorAll('.eliminar-producto').forEach(button => {
                button.addEventListener('click', function () {
                    const id = this.getAttribute('data-id');
                    const productoExistente = carrito.find(item => item.producto.id == id);
                    if (productoExistente) {
                        const producto = productoExistente.producto;
                        eliminarProducto(producto);
                    }
                });
            });
        }
    }

    function añadirEventListeners() {
        document.querySelectorAll('.añadir-btn').forEach(button => {
            button.addEventListener('click', function () {
                const card = button.closest('.card');
                if (card) {
                    const producto = {
                        id: card.getAttribute('data-id'),
                        nombre: card.getAttribute('data-nombre'),
                        precio: parseFloat(card.getAttribute('data-precio')),
                        imagen: card.getAttribute('data-imagen')
                    };
                    const cantidad = parseInt(card.querySelector('.cantidad-input').value);
                    agregarAlCarrito(producto, cantidad);
                } else {
                    console.error('No se pudo encontrar el elemento card asociado al botón añadir');
                }
            });
        });
    }


    cargarCarrito();
    añadirEventListeners();

    const vaciarCarrito = document.getElementById('vaciar-carrito');
    if (vaciarCarrito) {
        vaciarCarrito.addEventListener('click', function () {
            carrito = [];
            actualizarCarrito();
            guardarCarrito();
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        const pagarCarrito = document.getElementById('pagar-carrito');
        if (pagarCarrito) {
            pagarCarrito.addEventListener('click', function () {
                // Redireccionar a la URL definida en Django para carro_compras
                window.location.href = '/carro_compras/';
            });
        }
    });


    document.addEventListener("DOMContentLoaded", function () {
        const pagarCarrito = document.getElementById('pagar-carrito');
        const opcionesPago = document.getElementById('opciones-pago');
        const metodoPago = document.getElementById('metodo-pago');
        const codigoDescuento = document.getElementById('codigo-descuento');

        if (pagarCarrito) {
            pagarCarrito.addEventListener('click', function () {
                if (!isUserLoggedIn()) {
                    showLoginModal();
                } else {
                    if (opcionesPago.style.display === 'none') {
                        opcionesPago.style.display = 'block';
                    } else {
                        confirmPayment();
                    }
                }
            });
        }

        function isUserLoggedIn() {
            // Suponiendo que tienes un indicador en la página que muestra si el usuario está autenticado
            return document.querySelector('p.logged-in') !== null;
        }

        function showLoginModal() {
            const loginModal = new bootstrap.Modal(document.getElementById('modalSignin'), {});
            loginModal.show();
        }

        function confirmPayment() {
            const confirmPayment = confirm("¿Confirmar el pago?");
            if (confirmPayment) {
                // Lógica para procesar el pago y descontar stock
                processPayment();
            }
        }

        function processPayment() {
            // Aquí iría tu lógica para procesar el pago y descontar el stock
            alert("Pago confirmado. Se descontará la cantidad de productos del stock.");
        }

        function processPayment() {
            const productos = [];
            const cantidades = [];
        
            // Construye la lista de productos y cantidades desde el carrito
            carrito.forEach(item => {
                productos.push(item.producto.id);
                cantidades.push(item.cantidad);
            });
        
            fetch('/finalizar_pago/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({
                    carrito: carrito,  // Aquí envías todo el carrito como JSON
                    metodo_pago: 'tarjeta',  // Ejemplo de método de pago, puedes ajustarlo según tus necesidades
                    codigo_descuento: ''  // Ajusta según necesites manejar códigos de descuento
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Pago confirmado. Se descontará la cantidad de productos del stock.");
                    localStorage.removeItem('carrito');
                    location.reload();  // O redirige a otra página según tus necesidades
                } else {
                    alert("Error al procesar el pago.");
                }
            })
            .catch(error => console.error('Error:', error));
        }
        
        function getCookie(name) {
            let cookieValue = null;
            if (document.cookie && document.cookie !== '') {
                const cookies = document.cookie.split(';');
                for (let i = 0; i < cookies.length; i++) {
                    const cookie = cookies[i].trim();
                    if (cookie.substring(0, name.length + 1) === (name + '=')) {
                        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                        break;
                    }
                }
            }
            return cookieValue;
        }

    });

    
});