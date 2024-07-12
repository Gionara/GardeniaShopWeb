// descuentos.js

function calcularTotalConDescuento() {
    const descuentoSuscripcionElement = document.getElementById('descuentoSuscripcion');
    const descuentoCuponElement = document.getElementById('descuentoCupon');

    const descuentoSuscripcion = descuentoSuscripcionElement ? parseFloat(descuentoSuscripcionElement.textContent) : 0;
    const descuentoCupon = descuentoCuponElement ? parseFloat(descuentoCuponElement.textContent) : 0;

    const totalContainer = document.getElementById('total-container');
    const carrito = JSON.parse(localStorage.getItem('carrito'))
    let total = carrito.reduce((acc, item) => acc + item.producto.precio * item.cantidad, 0);
    let descuentoSus = (total * descuentoSuscripcion) / 100;
    let descuentoCup = (total * descuentoCupon) / 100;
    let totalConDescuento = total - descuentoSus - descuentoCup;

    if (totalContainer) {
        totalContainer.innerHTML = `<h4>Total: $${total.toLocaleString()}</h4>
                                    <h4>Descuento Suscripción: $${descuentoSus.toLocaleString()}</h4>
                                    <h4>Descuento Cupón: $${descuentoCup.toLocaleString()}</h4>
                                    <h4>Total con Descuento: $${totalConDescuento.toLocaleString()}</h4>`;
    }
}


document.addEventListener("DOMContentLoaded", function () {
    const aplicarCuponBtn = document.getElementById('aplicarCupon');
    if (aplicarCuponBtn) {
        aplicarCuponBtn.addEventListener('click', function () {
            var codigoCupon = document.getElementById('cupon').value;
            var descuentoCupon = 0;

            fetch(`/aplicar_cupon/${codigoCupon}/`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        descuentoCupon = data.descuento;
                        document.getElementById('descuentoCupon').innerText = descuentoCupon;
                        calcularTotalConDescuento();
                        alert('Cupón aplicado con éxito.');
                    } else {
                        alert('Cupón inválido o no aplicable.');
                    }
                });
        });
    }
});
