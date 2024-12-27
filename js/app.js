import {guardarVenta} from "./ventas.js";
import { mostrarMensajeError } from "./ventas.js";
// --- Funciones para crear y mostrar las tarjetas de productos ---
const contenedor = document.getElementById("contenedor");

async function armadorTarjetas() {
    try {
        const response = await fetch('productos.json');
        if (!response.ok) {
            // La respuesta no fue exitosa (código de estado diferente a 2xx)
            const message = `Error al obtener los productos: ${response.status} ${response.statusText}`;
            throw new Error(message); // Lanzar un error para que sea capturado por el catch
        }
        const productos = await response.json();

        contenedor.innerHTML = "";
        productos.forEach(producto => {
            const cardProducto = crearCardProducto(producto);
            contenedor.appendChild(cardProducto);
        });
    } catch (error) {
        console.error(error); // Registrar el error en la consola

        // Mostrar un mensaje de error al usuario (opcional)
        const mensajeError = document.createElement("div");
        mensajeError.textContent = "Error al cargar los productos. Por favor, intenta más tarde.";
        mensajeError.className = "mensaje-error";

        contenedor.appendChild(mensajeError); // Mostrar el mensaje en el contenedor
    }
}
document.addEventListener('DOMContentLoaded', armadorTarjetas);

function crearCardProducto(producto) {
    const { imagen, titulo, precio, categoria, stock, color, talle } = producto; // Desestructuración

    const card = document.createElement("div");
    card.className = "card";
    card.style.width = "18rem";
    card.style.margin = "1rem";

    card.innerHTML = `
        <img src="${imagen}" class="card-img-top" alt="${titulo}">
        <div class="card-body">
            <h5 class="card-title">${titulo}</h5>
            <p class="card-text"><strong>Precio:</strong> $${precio}</p>
            <p class="card-text"><strong>Categoría:</strong> ${categoria}</p>
            <p class="card-text"><strong>Stock:</strong> ${stock > 0 ? stock : "Agotado"}</p>
            <p class="card-text"><strong>Color:</strong> ${color}</p>
            <p class="card-text"><strong>Talle:</strong> ${talle}</p>
            <button class="btn btn-primary agregar-carrito">Agregar al carrito</button>
        </div>
    `;

    card.querySelector(".agregar-carrito").addEventListener("click", () => {
        agregarAlCarrito(producto);
        Swal.fire({
            title: 'Perfecto',
            text: 'Producto agregado al carrito',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });
    });

    return card;
}

async function filtroCategoria() {
    try {
        const response = await fetch('productos.json');
        if (!response.ok) {
            throw new Error(`Error al obtener los productos: ${response.status} ${response.statusText}`);
        }
        const productos = await response.json();

        const parametro = document.getElementById("categoriaRopa").value;
        const categoria = productos.filter(producto => producto.categoria === parametro);

        contenedor.innerHTML = "";

        if (parametro) {
            categoria.forEach(producto => {
                const cardProducto = crearCardProducto(producto);
                contenedor.appendChild(cardProducto);
            });
        } else {
            armadorTarjetas();
        }
    } catch (error) {
        mostrarMensajeError("Error al cargar los productos. Por favor, intenta más tarde.");
    }
}

let Carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function eliminarDelCarrito(index) {
    try {
        Carrito.splice(index, 1);
        localStorage.setItem('carrito', JSON.stringify(Carrito));
        actualizarCarrito();
    } catch (error) {
        // Manejar el error de forma apropiada, por ejemplo, mostrar un mensaje al usuario
        mostrarMensajeError("Error al eliminar del carrito.");
    }
}

function actualizarCarrito() {
    const carritoContenedor = document.getElementById("carrito");
    carritoContenedor.innerHTML = "";

    const h2 = document.createElement("h2");
    h2.textContent = "CARRITO DE COMPRAS";
    carritoContenedor.appendChild(h2);

    let total = 0;

    Carrito.forEach((producto, index) => {
        const { imagen, titulo, precio, cantidad } = producto; // Desestructuración

        const card = document.createElement("div");
        card.className = "mini-card";
        card.innerHTML = `
            <img src="${imagen}" class="mini-card-img" alt="${titulo}">
            <div class="mini-card-info">
                <p><strong>${titulo}</strong></p>
                <p>$${precio}</p>
                <p>Cantidad: ${cantidad}</p>
            </div>
            <button class="btn btn-danger eliminar-carrito">Eliminar</button>
        `;

        card.querySelector(".eliminar-carrito").addEventListener("click", () => {
            eliminarDelCarrito(index);
        });

        carritoContenedor.appendChild(card);

        total += precio * cantidad;
    });

    const totalElement = document.createElement("div");
    totalElement.className = "total-carrito";
    totalElement.innerHTML = `<strong>Total: $${total}</strong>`;
    carritoContenedor.appendChild(totalElement);

    const button = document.createElement("button");
    button.className = "btn-cp";
    button.textContent = "Finalizar compra";
    button.addEventListener("click", () => {
        guardarVenta(Carrito);
        Carrito = [];
        localStorage.setItem('carrito', JSON.stringify(Carrito));
        actualizarCarrito();
        Swal.fire({
            title: 'Perfecto',
            text: 'compra realizada con exito',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        });
    });
    carritoContenedor.appendChild(button);
}

function agregarAlCarrito(producto) {
    const existingProduct = Carrito.find(item => item.id === producto.id);

    if (existingProduct) {
        if (existingProduct.cantidad < existingProduct.stock) {
            existingProduct.cantidad++;
        } else {
            mostrarMensajeError("No hay suficiente stock disponible.");
        }
    } else {
        Carrito.push({ ...producto, cantidad: 1 });
    }

    localStorage.setItem('carrito', JSON.stringify(Carrito));
    actualizarCarrito();
}

// --- Inicialización ---
armadorTarjetas();
document.addEventListener('DOMContentLoaded', actualizarCarrito);