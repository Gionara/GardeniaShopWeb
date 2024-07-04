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
        console.log("Producto agregado:", carrito); // Depuración
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
        console.log("Cantidad modificada:", carrito); // Depuración
    }

    function eliminarProducto(producto) {
        carrito = carrito.filter(item => item.producto.id !== producto.id);
        console.log("Producto eliminado:", carrito); // Depuración
        actualizarCarrito();
        guardarCarrito();
    }

    function guardarCarrito() {
        localStorage.setItem('carrito', JSON.stringify(carrito));  // Guardar en localStorage
        var csrftoken = getCookie('csrftoken');  // Obtener el CSRF Token desde las cookies
        console.log(csrftoken);
        $.ajax({
            url: 'shopWeb/guardar_carrito/',  // Asegúrate de que la URL sea absoluta o correcta
            type: 'POST',
            headers: { 'X-CSRFToken': csrftoken },  // Incluir el CSRF Token en los headers
            contentType: 'application/json',
            data: JSON.stringify({ carrito: carrito }),  // Enviar el carrito actual al servidor
            success: function(response) {
                console.log('Carrito guardado exitosamente:', response);
                // Manejar la respuesta del servidor si es necesario
            },
            error: function(xhr, status, error) {
                console.error('Error al guardar el carrito:', error);
                // Manejar errores si es necesario
            }
        });
    }

    function cargarCarrito() {
        const carritoGuardado = JSON.parse(localStorage.getItem('carrito'));
        if (carritoGuardado) {
            carrito = carritoGuardado;
            console.log("Carrito cargado desde localStorage:", carrito); // Depuración
            actualizarCarrito();
        } else {
            console.log("No se encontró carrito en localStorage"); // Depuración
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
        console.log("Carrito actualizado en el DOM:", carrito); // Depuración
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
                    console.error('No se pudo encontrar el elemento card asociado al botón añadir'); // Depuración
                }
            });
        });
        console.log("EventListeners añadidos a los botones de añadir"); // Depuración
    }

    function enviarCarritoAlServidor() {
        fetch('shopWeb/guardar_carrito/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({ carrito: carrito })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Carrito guardado en el servidor.'); // Depuración
            } else {
                console.error('Error al guardar el carrito en el servidor:', data.error); // Depuración
            }
        })
        .catch(error => console.error('Error:', error)); // Depuración
    }

    // Función auxiliar para obtener el CSRF Token de las cookies
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();
                // Buscar el cookie con el nombre especificado
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    cargarCarrito();  // Asegúrate de cargar el carrito desde localStorage
    añadirEventListeners();  // Añadir event listeners para los botones

    // También puedes añadir una llamada a enviarCarritoAlServidor aquí si es necesario
});
