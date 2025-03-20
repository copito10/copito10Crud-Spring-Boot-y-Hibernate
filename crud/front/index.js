// Declaramos las funciones globalmente para que sean accesibles desde los handlers onclick
let eliminarProducto;
let modificarProducto;

document.addEventListener('DOMContentLoaded', () => {
    // Variables Globales 
    const tablaProductosHTML = document.getElementById('tablaProductos');
    const nombre = document.getElementById('nombre');
    const precio = document.getElementById('precio');
    const cantidad = document.getElementById('cantidad');
    const btnGuardar = document.getElementById('btnGuardar');
    let tituloModal = document.getElementById('tituloModal');
    let idProductoModificar = 0;
    let modal = document.getElementById("myModal");
    let btn = document.getElementById("myBtn");
    let span = document.getElementsByClassName("close")[0];

    let listaProductos = [];

    // Acciones Guardar Producto
    btnGuardar.addEventListener('click', () => {
        if (tituloModal.innerText === "Modificar Producto") {
            crearProducto(idProductoModificar);
        } else if (tituloModal.innerText === "Crear Producto") {
            crearProducto(0);
        }
    });

    // Definimos eliminarProducto en el ámbito global
    eliminarProducto = async function(id) {
        try {
            const res = await fetch(`http://localhost:8080/api/producto/delete/${id}`, {
                method: 'DELETE',
                mode: 'cors',
                headers: { 'Content-Type': 'application/json' },
            });
            if (res.ok) {
                alert("Producto eliminado");
                obtenerProductos();
            } else {
                alert("Error al eliminar producto");
            }
        } catch (err) {
            console.error(err);
            alert("Error al eliminar producto");
        }
    };

    // Definimos modificarProducto en el ámbito global
    modificarProducto = function(id) {
        tituloModal.innerText = "Modificar Producto";
        modal.style.display = "block";
        idProductoModificar = id;
        resetModal();
        const producto = listaProductos.find(producto => producto.idproducto === id);
        if (producto) {
            nombre.value = producto.nombreproducto;
            precio.value = producto.precioproducto;
            cantidad.value = producto.cantidadproducto;
        }
    };

    // Crear Producto
    async function crearProducto(id) {
        const productoGuardar = {
            idproducto: id,
            nombreproducto: nombre.value,
            precioproducto: parseInt(precio.value),
            cantidadproducto: parseInt(cantidad.value),
            fecha: fechaHoy()
        };

        try {
            const res = await fetch('http://localhost:8080/api/producto/new', {
                method: 'POST',
                mode: 'cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productoGuardar)
            });
            if (res.ok) {
                alert("Producto guardado");
                modal.style.display = "none";
                obtenerProductos();
                resetModal();
            } else {
                alert("Error al crear producto");
            }
        } catch (err) {
            console.error(err);
            alert("Error al crear producto");
        }
    }

    function fechaHoy() {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Obtener Productos
    async function obtenerProductos() {
        tablaProductosHTML.innerHTML = '';
        try {
            const response = await fetch('http://localhost:8080/api/producto');
            if (!response.ok) throw new Error('Error al obtener productos');
            const productos = await response.json();
            console.log("Productos recibidos: ", productos);
            listaProductos = productos;
            productos.forEach(producto => {
                tablaProductosHTML.innerHTML += `
                    <tr>
                        <th scope="row">${producto.idproducto}</th>
                        <td>${producto.nombreproducto}</td>
                        <td>${producto.precioproducto}</td>
                        <td>${producto.cantidadproducto}</td>
                        <td>${producto.fecha}</td>
                        <td class="text-center">
                            <button class="btn btn-danger btn-sm mr-2" onclick="eliminarProducto(${producto.idproducto})">
                                <i class="fas fa-trash-alt"></i> Eliminar
                            </button>
                            <button class="btn btn-primary btn-sm" onclick="modificarProducto(${producto.idproducto})">
                                <i class="fas fa-edit"></i> Modificar
                            </button>
                        </td>
                    </tr>`;
            });
        } catch (err) {
            console.error(err);
            alert("Error al obtener productos");
        }
    }

    // Reset Modal
    function resetModal() {
        nombre.value = "";
        cantidad.value = "";
        precio.value = "";
    }

    // Modal Actions
    btn.onclick = function () {
        tituloModal.innerText = "Crear Producto";
        modal.style.display = "block";
    };
    span.onclick = function () {
        modal.style.display = "none";
        resetModal();
    };
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
            resetModal();
        }
    };

    // Llamada inicial
    obtenerProductos();
});