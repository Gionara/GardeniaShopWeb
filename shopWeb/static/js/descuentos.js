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
                console.log(response);
                console.log("APLICAR CUPON")
                if (response.success) {
                    var descuentoCupon = response.descuento;
                    console.log("DESCUENTO CUPON", descuentoCupon)
                    $('#descuentoCupon').text(descuentoCupon);
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

        // Asegúrate de que totalCarrito es un número válido
        if (isNaN(totalCarrito)) {
            totalCarrito = 0;
        }

        if ((descuentoCupon>0) || (descuentoSuscripcion>0)){ 
            if(descuentoCupon>0){ 
                var descuentoCuponValor = (totalCarrito * descuentoCupon )/ 100;
                
            }else{
                var descuentoCuponValor = 0
            }

            if(descuentoSuscripcion>0){ 
            var descuentoSuscripcionValor = (totalCarrito * descuentoSuscripcion) / 100;
            
            }else{
                var descuentoSuscripcionValor = 0
            }
            console.log("descuentoCuponValor", descuentoCuponValor)
            console.log("descuentoSuscripcionValor", descuentoSuscripcionValor)
            var totalConDescuentos = totalCarrito - descuentoCuponValor - descuentoSuscripcionValor;
            console.log("totalConDescuentos", totalConDescuentos)

            $('#descuentoCuponValor').text(descuentoCuponValor);
            $('#descuentoSuscripcionValor').text(descuentoSuscripcionValor);
            $('#totalConDescuentos').text(totalConDescuentos);
            
        }else{
            var descuentoCuponValor = 0;
            var descuentoSuscripcionValor = 0;
            var totalConDescuentos = totalCarrito;
            $('#totalCarrito').text(totalCarrito);
            $('#descuentoCuponValor').text(descuentoCuponValor);
            $('#descuentoSuscripcionValor').text(descuentoSuscripcionValor);
            $('#totalConDescuentos').text(totalConDescuentos);
        }
    }
    $(document).ready(function() {
        $('#aplicar-descuento').click(function() {
            aplicarDescuentoCupon();
        });

        var descuentoSuscripcion = parseFloat($('#descuentoSuscripcion').text());
        if (isNaN(descuentoSuscripcion)) {
            descuentoSuscripcion = 0;
        }
        aplicarDescuentoSuscripcion(descuentoSuscripcion);
    });

});