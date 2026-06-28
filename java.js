let carrito=JSON.parse(localStorage.getItem("carrito")) || [];

document.addEventListener("DOMContentLoaded", () => {
    
    const botonesAgregar = document.querySelectorAll(".btn-agregar");
    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", (e) => {

            const nombre = e.target.getAttribute("data-nombre");

            const precio = parseFloat(e.target.getAttribute("data-precio")); 
            
            agregarAlCarrito(nombre, precio);
        });
    });

    const btnVaciar = document.querySelector(".vaciar-carrito");
    if (btnVaciar) {
        btnVaciar.addEventListener("click", vaciarCarrito);
    }

    const btnComprar = document.querySelector(".comprar");
    if (btnComprar) {
        btnComprar.addEventListener("click", procesarCompra);
    }

    mostrarCarrito();
});

function agregarAlCarrito(nombre, precio) {
    const productoExistente = carrito.find(producto => producto.nombre === nombre);
    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        carrito.push({ nombre, precio, cantidad: 1 });
    }

    mostrarCarrito();
}

function mostrarCarrito() {
    const lista=document.getElementById("lista-carrito");  
    const total=document.getElementById("total-precio");
    lista.innerHTML="";
    let totalPrecio=0;

    carrito.forEach((producto, index) => {
        const precioNumerico=parseFloat(producto.precio);
        totalPrecio += (precioNumerico * producto.cantidad);
        const item=document.createElement("div");
        item.textContent = `${producto.cantidad}  ${producto.nombre}  $${(precioNumerico * producto.cantidad).toFixed(2)}`;
        item.style.display = "flex";
        item.style.fontSize = "15px";
        item.style.fontFamily = "Poppins, sans-serif";
        item.style.justifyContent = "space-between";
        item.style.alignItems = "center";
        item.style.marginBottom = "8px";
        const button=document.createElement("button");

        button.innerHTML = "X";
        button.style.fontSize = "10px";
        button.style.backgroundColor = "#ff4d4d";
        button.style.color = "white";
        button.style.borderRadius = "50%";
        button.style.border = "none";
        button.style.padding = "5px 8px";
        button.style.cursor = "pointer";
        button.style.marginLeft = "10px";
        button.onclick = () => eliminarDelCarrito(index);

        item.appendChild(button);
        lista.appendChild(item);
    });

    total.textContent = totalPrecio.toFixed(2);
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    mostrarCarrito();
}

function vaciarCarrito() {
    carrito = [];
    localStorage.removeItem("carrito");
    mostrarCarrito();
}

function procesarCompra() {
    if (carrito.length ===0) {
        alert("El carrito está vacío.");
        return;
    }

    const formulario = document.querySelector("#form form");
    const inputNombre = document.getElementById("nombre");
    const inputEmail = document.getElementById("email");
    const inputMensaje = document.getElementById("mensaje");
    const inputTotal = document.getElementById("total");
    const selectPago = document.getElementById("pago");

    if (!inputNombre.value || !inputEmail.value.trim()) {
        alert("Por favor, complete todos los campos del formulario.");
        document.getElementById("form").scrollIntoView({ behavior: "smooth" });
        return;
    }

    if (formulario) {
        if (inputTotal) {
            inputTotal.value = document.getElementById("total-precio").textContent;
        }
    }

    if (inputMensaje) {
        let mensaje = "Productos:\n";
        carrito.forEach(producto => {
            mensaje += `${producto.cantidad} x ${producto.nombre} - $${(parseFloat(producto.precio) * producto.cantidad).toFixed(2)}\n`;
        });
        inputMensaje.value = mensaje;
    }

    if (selectPago && selectPago.value==="Transferencia") {
        const url="https://link.mercadopago.com.ar/onrosnow";

        formulario.submit();

        window.open(url, "_blank");

        vaciarCarrito();
    }

    else {
        formulario.submit();
        vaciarCarrito();
    }

}

