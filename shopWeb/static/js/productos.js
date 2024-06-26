$(document).ready(function() {
    // Evento cuando se clickea el botón de detalles
    $(document).on('click', '.detalles-btn', function() {
        const descripcion = $(this).siblings('.descripcion');
        descripcion.toggle();
    });

    // Evento para aumentar o disminuir la cantidad
    $(document).on('click', '.menos-btn', function() {
        const cantidadInput = $(this).siblings('.cantidad-input');
        let cantidad = parseInt(cantidadInput.val());
        if (cantidad > 1) {
            cantidad--;
            cantidadInput.val(cantidad);
        }
    });

    $(document).on('click', '.mas-btn', function() {
        const cantidadInput = $(this).siblings('.cantidad-input');
        let cantidad = parseInt(cantidadInput.val());
        cantidad++;
        cantidadInput.val(cantidad);
    });

    // Evento para añadir al carrito
    $(document).on('click', '.añadir-btn', function() {
        // Lógica para añadir al carrito
        alert('Producto añadido al carrito');
    });
});
