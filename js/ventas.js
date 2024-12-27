function guardarVenta(productosVendidos) {
    try {
        let ventas = JSON.parse(localStorage.getItem('ventas')) || []; // Obtener las ventas existentes o crear un array vacío
        ventas.push({ fecha: new Date(), productos: productosVendidos }); // Agregar la nueva venta con la fecha
        localStorage.setItem('ventas', JSON.stringify(ventas));
        mostrarMensajeError('Venta guardada en localStorage con éxito');
        // Puedes mostrar un mensaje al usuario si lo deseas
    } catch (error) {
        mostrarMensajeError('Error al guardar la venta. Por favor, intenta más tarde.');
    }
}

function mostrarVentas() {
    try {
        const ventas = JSON.parse(localStorage.getItem('ventas')) || [];
        const contenedorVentas = document.getElementById('contenedor-ventas');
        contenedorVentas.innerHTML = ""; // Limpiar el contenedor

        let totalRecaudo = 0;

        ventas.forEach(venta => {
            // Crear la tarjeta (div)
            const tarjetaVenta = document.createElement('div');
            tarjetaVenta.className = 'tarjeta-venta'; // Puedes agregar estilos CSS para esta clase

            // Mostrar la fecha de la venta
            const fechaVenta = document.createElement('p');
            fechaVenta.textContent = `Fecha: ${venta.fecha}`;
            tarjetaVenta.appendChild(fechaVenta);

            // Crear una lista para los productos de la venta
            const listaProductos = document.createElement('ul');
            venta.productos.forEach(producto => {
                const itemProducto = document.createElement('li');
                itemProducto.textContent = `${producto.titulo} x ${producto.cantidad} - $${producto.precio * producto.cantidad}`;
                listaProductos.appendChild(itemProducto);
            });
            tarjetaVenta.appendChild(listaProductos);

            // Agregar la tarjeta al contenedor
            contenedorVentas.appendChild(tarjetaVenta);

            venta.productos.forEach(producto => {
                totalRecaudo += producto.precio * producto.cantidad; // Sumar al total de recaudo
            });
        });
        const totalRecaudoElement = document.createElement('h3');
    totalRecaudoElement.textContent = `Total de recaudo general: $${totalRecaudo}`;
    contenedorVentas.appendChild(totalRecaudoElement);
        
    } catch (error) {
        mostrarMensajeError('Error al guardar la venta. Por favor, intenta más tarde.');
    }
}
export function mostrarMensajeError(mensaje) {
    mostrarMensaje(mensaje);
}


function mostrarMensaje(mensaje) {
    const mensajeElement = document.createElement("div");
    mensajeElement.textContent = mensaje;
    mensajeElement.className = "mensaje-usuario";
    document.body.appendChild(mensajeElement);

    setTimeout(() => {
        document.body.removeChild(mensajeElement);
    }, 2000); // 3 segundos
}
document.addEventListener('DOMContentLoaded', mostrarVentas);

export{guardarVenta};