document.addEventListener("DOMContentLoaded", function () {

    // Evitar que se cierre el dropdown al hacer clic dentro
    document.querySelectorAll('.dropdown-menu').forEach(function (element) {
        element.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    });

    // Estado del carrito
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    function agregarAlCarrito(producto, cantidad) {
        const productoExistente = carrito.find(item => item.producto.nombre === producto.nombre);
        if (productoExistente) {
            productoExistente.cantidad += cantidad;
        } else {
            carrito.push({ producto, cantidad });
        }
        actualizarCarrito();
        guardarCarrito();
    }

    function modificarCantidad(producto, nuevaCantidad) {
        const productoExistente = carrito.find(item => item.producto.nombre === producto.nombre);
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
        carrito = carrito.filter(item => item.producto.nombre !== producto.nombre);
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

    // Actualizar la vista previa del carrito
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
                        <img class="col-6" src="${item.producto.imagen}" width="" alt="${item.producto.nombre}">
                        <div class="col-6 ">
                            <div class="carrito-item-nombre">${item.producto.nombre}</div>
                            <div class="carrito-item-precio">Precio: $${(item.producto.precio * item.cantidad).toFixed(2)}</div>
                        </div>
                        <div class="input-group carrito-item-cantidad col-6 justify-content-center m-3">
                            <span class="input-group-text">Cantidad:</span>
                            <button class="btn btn-outline-secondary btn-sm menos-btn" data-nombre="${item.producto.nombre}">-</button>
                            <input type="text" class="form-control form-control-sm cantidad-input justify-content-center aling-item-center" value="${item.cantidad}" readonly>
                            <button class="btn btn-outline-secondary btn-sm mas-btn" data-nombre="${item.producto.nombre}">+</button>
                            <button class="btn btn-sm btn-danger eliminar-producto" data-nombre="${item.producto.nombre}">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
                carritoContainer.appendChild(itemElement);
            });

            // Mostrar el total
            const totalContainer = document.getElementById('total-container');
            if (totalContainer) {
                totalContainer.innerHTML = `<h4>Total: $${total.toFixed(2)} </h4>`;
            }

            // Actualizar el icono del carrito en el navbar
            const carritoIcono = document.getElementById('carrito-icono');
            if (carritoIcono) {
                const totalCantidad = carrito.reduce((total, item) => total + item.cantidad, 0);
                carritoIcono.textContent = totalCantidad;
            }

            // mostrar la cantidad total de producto
            const cantidadTotalCarrito = document.getElementById('cantidad-total');
            if (cantidadTotalCarrito) {
                const totalCantidadCarrito = carrito.reduce((total, item) => total + item.cantidad, 0);
                cantidadTotalCarrito.textContent = totalCantidadCarrito;
                cantidadTotalCarrito.innerHTML = `<h5>Cantidad de Productos: ${totalCantidadCarrito} </h5>`;
            }

            // Añadir event listeners para modificar cantidad y eliminar productos
            document.querySelectorAll('.menos-btn').forEach(button => {
                button.addEventListener('click', function () {
                    const nombre = this.getAttribute('data-nombre');
                    const producto = carrito.find(item => item.producto.nombre === nombre).producto;
                    const cantidadInput = this.nextElementSibling;
                    let cantidad = parseInt(cantidadInput.value);
                    if (cantidad > 1) {
                        cantidad--;
                        cantidadInput.value = cantidad;
                        modificarCantidad(producto, cantidad);
                    }
                });
            });

            document.querySelectorAll('.mas-btn').forEach(button => {
                button.addEventListener('click', function () {
                    const nombre = this.getAttribute('data-nombre');
                    const producto = carrito.find(item => item.producto.nombre === nombre).producto;
                    const cantidadInput = this.previousElementSibling;
                    let cantidad = parseInt(cantidadInput.value);
                    cantidad++;
                    cantidadInput.value = cantidad;
                    modificarCantidad(producto, cantidad);
                });
            });

            document.querySelectorAll('.eliminar-producto').forEach(button => {
                button.addEventListener('click', function () {
                    const nombre = this.getAttribute('data-nombre');
                    const producto = carrito.find(item => item.producto.nombre === nombre).producto;
                    eliminarProducto(producto);
                });
            });
        }
    }

    // Evento click para el botón de pagar
    const pagarCarrito = document.getElementById('pagar-carrito');
    if (pagarCarrito) {
        pagarCarrito.addEventListener('click', function () {
            window.location.href = "/templates/carro_compras.html";
        });
    }

    // Evento click para el botón de vaciar carrito
    const vaciarCarrito = document.getElementById('vaciar-carrito');
    if (vaciarCarrito) {
        vaciarCarrito.addEventListener('click', function () {
            carrito = [];
            actualizarCarrito();
            guardarCarrito();
        });
    }

    // Función de Listener de los botones de añadir al carrito
    function añadirEventListeners() {
        document.querySelectorAll('.añadir-btn').forEach(button => {
            button.addEventListener('click', function () {
                const card = button.closest('.card');
                const nombre = card.querySelector('.card-title').textContent;
                const producto = productos.find(p => p.nombre === nombre);
                const cantidad = parseInt(card.querySelector('.form-control').value);
                agregarAlCarrito(producto, cantidad);
            });
        });
    }

    // Función para cargar los productos
    const productosContainer = document.getElementById('productos-container');
    const url = window.location.pathname;
    let productos = [];

    function cargarProductos() {
        fetch('/js/productos.json')
            .then(response => response.json())
            .then(data => {
                if (url.includes('templates/productos/herramientas/tijeras.html')) {
                    productos = data.herramientas.Tijeras;
                }
                if (url.includes('templates/productos/herramientas/palas.html')) {
                    productos = data.herramientas.palas;
                }
                if (url.includes('templates/productos/herramientas/otras_herramientas.html')) {
                    productos = data.herramientas.otras_herramientas;
                }
                if (url.includes('templates/productos/plantas_semillas/flores.html')) {
                    productos = data.plantas_semillas.flores;
                }
                if (url.includes('templates/productos/plantas_semillas/plantas_arboles.html')) {
                    productos = data.plantas_semillas.plantas_arboles;
                }
                if (url.includes('templates/productos/plantas_semillas/huerto.html')) {
                    productos = data.plantas_semillas.huerto;
                }
                if (url.includes('templates/productos/insumos/fertilizante.html')) {
                    productos = data.insumos.fertilizante;
                }
                if (url.includes('templates/productos/insumos/tierra.html')) {
                    productos = data.insumos.tierra;
                }
                if (url.includes('templates/productos/insumos/otros_insumos.html')) {
                    productos = data.insumos.otros_insumos;
                }
                if (url.includes('templates/productos/all_products.html')) {
                    Object.keys(data).forEach(categoria => {
                        if (data[categoria]) {
                            Object.keys(data[categoria]).forEach(subcategoria => {
                                if (Array.isArray(data[categoria][subcategoria])) {
                                    productos = productos.concat(data[categoria][subcategoria]);
                                }
                            });
                        }
                    });
                }
                mostrarProductos(productos);
            })
            .catch(error => console.error('Error al cargar los productos:', error));
    }

    // Función para mostrar los productos en el DOM
    function mostrarProductos(productos) {
        if (productosContainer) {
            productosContainer.innerHTML = '';

            productos.forEach(producto => {
                const card = document.createElement('div');
                card.classList.add('card');

                const nombre = document.createElement('h5');
                nombre.classList.add('card-title');
                nombre.textContent = producto.nombre;

                const imagen = document.createElement('img');
                imagen.classList.add('card-img-top');
                imagen.src = producto.imagen;
                imagen.alt = producto.nombre;

                const precio = document.createElement('p');
                precio.classList.add('card-text');
                precio.textContent = `Precio: $${producto.precio.toFixed(0)}`;

                const detallesBtn = document.createElement('button');
                detallesBtn.classList.add('btn', 'btn-outline-secondary', 'detalles-btn');
                detallesBtn.textContent = 'Detalles';

                const añadirBtn = document.createElement('button');
                añadirBtn.classList.add('btn', 'btn-outline-secondary', 'añadir-btn');
                añadirBtn.type = 'submit';
                añadirBtn.textContent = 'Añadir al Carrito';

                const cantidadContainer = document.createElement('div');
                cantidadContainer.classList.add('input-group', 'mt-3');

                const menosBtn = document.createElement('button');
                menosBtn.classList.add('btn', 'btn-outline-secondary');
                menosBtn.textContent = '-';

                const cantidadInput = document.createElement('input');
                cantidadInput.classList.add('form-control');
                cantidadInput.type = 'text';
                cantidadInput.value = '1';
                cantidadInput.readOnly = true;

                const masBtn = document.createElement('button');
                masBtn.classList.add('btn', 'btn-outline-secondary');
                masBtn.textContent = '+';

                menosBtn.addEventListener('click', () => {
                    let cantidad = parseInt(cantidadInput.value);
                    if (cantidad > 1) {
                        cantidad--;
                        cantidadInput.value = cantidad;
                    }
                });

                masBtn.addEventListener('click', () => {
                    let cantidad = parseInt(cantidadInput.value);
                    cantidad++;
                    cantidadInput.value = cantidad;
                });

                cantidadContainer.appendChild(menosBtn);
                cantidadContainer.appendChild(cantidadInput);
                cantidadContainer.appendChild(masBtn);

                const descripcion = document.createElement('div');
                descripcion.classList.add('descripcion');
                descripcion.textContent = producto.Descripción;
                descripcion.style.display = 'none';

                card.appendChild(nombre);
                card.appendChild(imagen);
                card.appendChild(precio);
                card.appendChild(detallesBtn);
                card.appendChild(descripcion);
                card.appendChild(cantidadContainer);
                card.appendChild(añadirBtn);

                productosContainer.appendChild(card);

                detallesBtn.addEventListener('mouseover', () => toggleDescripcion(descripcion, true));
                detallesBtn.addEventListener('mouseout', () => toggleDescripcion(descripcion, false));
                detallesBtn.addEventListener('click', () => toggleDescripcion(descripcion));
            });

            añadirEventListeners(); // Asegurarse de que los botones "Añadir al Carrito" tengan los listeners correctos
        }
    }

    // Función para mostrar u ocultar la descripción de un producto
    function toggleDescripcion(descripcion, show) {
        if (typeof show === 'boolean') {
            descripcion.style.display = show ? 'block' : 'none';
        } else {
            descripcion.style.display = descripcion.style.display === 'none' ? 'block' : 'none';
        }
    }

    // Añadir event listeners al botón "Añadir al Carrito"
    function añadirEventListeners() {
        document.querySelectorAll('.añadir-btn').forEach(button => {
            button.addEventListener('click', function () {
                const card = button.closest('.card');
                const nombre = card.querySelector('.card-title').textContent;
                const producto = productos.find(p => p.nombre === nombre);
                const cantidad = parseInt(card.querySelector('.form-control').value);
                agregarAlCarrito(producto, cantidad);
            });
        });
    }

    // Función para ordenar los productos por precio de menor a mayor
    function ordenarProductosPorPrecio() {
        productos.sort((a, b) => a.precio - b.precio); // Ordenar los productos por precio
        mostrarProductos(productos); // Mostrar los productos ordenados
    }

    // Evento click para el botón de ordenar
    const ordenarBtn = document.getElementById('ordenar-btn');
    if (ordenarBtn) {
        ordenarBtn.addEventListener('click', ordenarProductosPorPrecio);
    }

    cargarProductos(); // Cargar los productos al cargar el DOM
    cargarCarrito(); // Cargar el carrito desde localStorage al iniciar

});