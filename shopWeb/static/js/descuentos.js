// descuentos.js
document.addEventListener("DOMContentLoaded", function () {
    function aplicarDescuentoCupon() {
        var codigoDescuento = $('#codigo-descuento').val();

        $.ajax({
            type: 'POST',
            url: 'shopWeb/aplicar_cupon/',  // Asegúrate de que la URL sea la correcta
            data: JSON.stringify({ 'codigo_cupon': codigoDescuento }),
            
            contentType: 'application/json',
            success: function(response) {
  
                console.log("RESPONSE",response);
                console.log("APLICAR CUPON")
                if (response.success) {
                    var codigoCupon = response.codigo
                    var descuentoCupon = response.descuento;
                    console.log("DESCUENTO CUPON", descuentoCupon)
                    console.log("CODIGO",codigoCupon)
                    $('#descuentoCupon').text(descuentoCupon);
                    $('#codigoCupon').text(codigoCupon)
                    localStorage.setItem('descuentoCupon',descuentoCupon)
                    localStorage.setItem('codigoCupon',codigoCupon)
                    $('#descuentoCuponContainer').removeClass('hidden');
                    calcularTotalConDescuentos(descuentoCupon);
                } else {
                    alert('Error: ' + response.error);
                }
            },
            error: function(xhr, status, error) {
                console.error('Error en la solicitud AJAX:', status, error);
            }
        });

    }

    function eliminarDescuentoCupon() {
        $('#descuentoCupon').text(0);
        $('#descuentoCuponContainer').addClass('hidden'); // Ocultar la sección de descuento por cupón
        localStorage.removeItem('descuentoCupon');
        calcularTotalConDescuentos(0);
    }

    function aplicarDescuentoSuscripcion(descuentoSuscripcion) {
        // Lógica para aplicar el descuento de suscripción
        $('#descuentoSuscripcion').text(descuentoSuscripcion);
        calcularTotalConDescuentos();
    }

    function calcularTotalConDescuentos(descuentoCupon) {
        var totalCarrito = parseInt($('#totalCarrito').text());
        var descuentoSuscripcion = parseInt($('#descuentoSuscripcion').text());
        console.log("totalCarrito", totalCarrito)
        console.log("descuentoCupon", descuentoCupon)
        console.log("descuentoSuscripcion", descuentoSuscripcion)

        if (isNaN(totalCarrito)) {
            totalCarrito = 0;
        }

        if ((descuentoCupon > 0) || (descuentoSuscripcion > 0)) {
            var descuentoCuponValor = descuentoCupon > 0 ? (totalCarrito * descuentoCupon) / 100 : 0;
            var descuentoSuscripcionValor = descuentoSuscripcion > 0 ? (totalCarrito * descuentoSuscripcion) / 100 : 0;

            var totalConDescuentos = totalCarrito - descuentoCuponValor - descuentoSuscripcionValor;
            console.log("totalConDescuentos", totalConDescuentos)

            $('#descuentoCuponValor').text(descuentoCuponValor.toFixed(0));
            $('#descuentoSuscripcionValor').text(descuentoSuscripcionValor.toFixed(0));
            $('#totalConDescuentos').text(totalConDescuentos.toFixed(0));

        } else {
            $('#descuentoCuponValor').text(0);
            $('#descuentoSuscripcionValor').text(0);
            $('#totalConDescuentos').text(totalCarrito.toFixed(0));
        }
    }

    function actualizarDescuentos() {
        var descuentoCupon = parseFloat($('#descuentoCupon').text()) || parseFloat(localStorage.getItem('descuentoCupon')) || 0;
       console.log("DESCUENTO PARA HIDDEN",descuentoCupon)
        $('#descuentoCupon').text(descuentoCupon);
        if (descuentoCupon > 0) {
            $('#descuentoCuponContainer').removeClass('hidden'); // Mostrar la sección de descuento por cupón
        } else {
            $('#descuentoCuponContainer').addClass('hidden'); // Ocultar la sección de descuento por cupón si no hay descuento
        }
        calcularTotalConDescuentos(descuentoCupon);
    }
    $(document).ready(function() {
        $('#aplicar-descuento').click(function() {
            aplicarDescuentoCupon();
            
        });

        $('#eliminar-descuento').click(function() {
            eliminarDescuentoCupon();
        });

        var descuentoSuscripcion = parseFloat($('#descuentoSuscripcion').text()) || 0;
        aplicarDescuentoSuscripcion(descuentoSuscripcion);

        actualizarDescuentos();
    });

    window.actualizarDescuentos = actualizarDescuentos;

});