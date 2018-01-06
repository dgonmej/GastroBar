window.onload = function () {
    crearMenu();
};

/*
    ¡IMPORTANTE LEER!

    - Para conocer las funcionalidades adicionales lea el archivo README.txt adjunto en la carpeta de proyecto.
*/

// Lo usamos para el ID de los platos
var numeroPlato = 0;

// Crear el contenido del juego con todas las opciones
function crearMenu() {
    // Obtenemos el contenedor a través de su ID
    var contenedor = document.getElementById("contenedor");

    // Creamos el título
    contenedor.appendChild(crearElementoTexto("h1", "titulo", "Gastrobar"));

    // Creamos el formulario
    formulario = contenedor.appendChild(crearElementoContenedor("form", "name", "formulario", "id", "formulario"));
    contenedor.appendChild(formulario);

    // Creamos las opciones de categorías de platos (colores)
    colores = formulario.appendChild(crearElementoLabel("label", "for", "b_ColorRojo"));
    colores.appendChild(crearElementoBoton("radio", "id", "b_ColorRojo", "name", "categoria", "value", "entrante"));
    document.getElementById("b_ColorRojo").setAttribute("checked", true);
    colores.appendChild(crearElementoTexto("span", "Texto_Entrante", "Entrante"));
    colores = formulario.appendChild(crearElementoLabel("label", "for", "b_ColorAzul"));
    colores.appendChild(crearElementoBoton("radio", "id", "b_ColorAzul", "name", "categoria", "value", "primero"));
    colores.appendChild(crearElementoTexto("span", "Texto_Primero", "Primero"));
    colores = formulario.appendChild(crearElementoLabel("label", "for", "b_ColorVerde"));
    colores.appendChild(crearElementoBoton("radio", "id", "b_ColorVerde", "name", "categoria", "value", "segundo"));
    colores.appendChild(crearElementoTexto("span", "Texto_Segundo", "Segundo"));
    colores = formulario.appendChild(crearElementoLabel("label", "for", "b_ColorAmarillo"));
    colores.appendChild(crearElementoBoton("radio", "id", "b_ColorAmarillo", "name", "categoria", "value", "postre"));
    colores.appendChild(crearElementoTexto("span", "Texto_Postre", "Postre"));

    // Creamos el área para añadir nuevos platos
    formulario.appendChild(crearElementoBoton( "area", "id", "b_Plato", "placeholder", "Introduce un nuevo plato...", "name", "plato"));
    document.getElementById("b_Plato").addEventListener("keypress", function(){pulsarEnter(event)}, false); // Añadimos el evento al pulsar enter

    // Creamos las distintas opciones para manipular los platos del menú
    opciones = formulario.appendChild(crearElementoContenedor( "div", "id", "opciones", "class", "contenedor-opciones"));
    opciones.appendChild(crearElementoBoton("button", "id", "b_Nuevo", "class", "boton-opcion", "value", ""));
    opciones.appendChild(crearElementoBoton("button", "id", "b_Eliminar", "class", "boton-opcion", "value", ""));
    opciones.appendChild(crearElementoBoton("button", "id", "b_Tachar", "class", "boton-opcion", "value", ""));
    opciones.appendChild(crearElementoBoton("button", "id", "b_Activar", "class", "boton-opcion", "value", ""));
    opciones.appendChild(crearElementoBoton("button", "id", "b_Marcar", "class", "boton-opcion", "value", ""));
    opciones.appendChild(crearElementoBoton("button", "id", "b_Desmarcar", "class", "boton-opcion", "value", ""));
    opciones.appendChild(crearElementoBoton("button", "id", "b_MarcarColor", "class", "boton-opcion", "value", ""));
    opciones.appendChild(crearElementoBoton("button", "id", "b_Ordenar", "class", "boton-opcion", "value", ""));
    
    // Creamos la caja donde mostraremos el mensaje de ayuda de cada funcionalidad de los botones
    cajaMensaje = opciones.appendChild(crearElementoContenedor("div", "id", "mensaje", "class", "contenedor-mensaje"));
    cajaMensaje.appendChild(crearElementoTexto("span", "textoMensaje", ""));
    
    // Le añadimos a todos los botones de opciones el evento de al pasar por encima muestre el mensaje y además añada otro evento de la funcionalidad
    botones = [];
    botones.slice.call(document.querySelectorAll("input.boton-opcion")).map(elemento => {
        elemento.addEventListener("mouseover", function () {
            aplicarEvento(this)
        }, false)
    });

    // Creamos el contenedor de platos
    contenedorPlatos = formulario.appendChild(crearElementoContenedor("div", "id", "platos", "class", "contenedor-platos"));
    formulario.appendChild(contenedorPlatos);

    cargarPlatos();
}

// Función que añade los eventos a cada botón
function aplicarEvento(elemento) {
    mensaje = document.getElementById("textoMensaje");
    switch (true) {
        case (elemento.id == "b_Nuevo"):
            mensaje.textContent = "Insertar un plato nuevo.";
            elemento.addEventListener("click", insertarPlato, false);
            break;
        case (elemento.id == "b_Eliminar"):
            mensaje.textContent = "Eliminar los platos marcados.";
            elemento.addEventListener("click", eliminarPlato, false);
            break;
        case (elemento.id == "b_Tachar"):
            mensaje.textContent = "Tachar los platos marcados.";
            elemento.addEventListener("click", tacharPlato, false);
            break;
        case (elemento.id == "b_Activar"):
            mensaje.textContent = "Activar los platos marcados.";
            elemento.addEventListener("click", activarPlato, false);
            break;
        case (elemento.id == "b_Marcar"):
            mensaje.textContent = "Marcar todos los platos.";
            elemento.addEventListener("click", marcarPlato, false);
            break;
        case (elemento.id == "b_Desmarcar"):
            mensaje.textContent = "Desmarcar todos los platos.";
            elemento.addEventListener("click", desmarcarPlato, false);
            break;
        case (elemento.id == "b_MarcarColor"):
            mensaje.textContent = "Marcar los platos de la categoría seleccionada.";
            elemento.addEventListener("click", marcarPlatoPorCategoria, false);
            break;
        case (elemento.id == "b_Ordenar"):
            mensaje.textContent = "Ordenar los platos por categoría.";
            elemento.addEventListener("click", ordenarPlato, false);
            break;
        default:
            break;
    }
    // Cambiar el texto al quitar el ratón de encima
    elemento.addEventListener("mouseout", function () {
        mensaje.textContent = "Seleccione una opción...";
    }, false)
}

// Función para añadir un plato al pulsar enter
function pulsarEnter(evento) {
    if (evento.keyCode == 13) { // e.which <-- CONSULTAR
        evento.preventDefault();
        insertarPlato();
    }
}

// Cargamos los platos que existan en el LocalStorage
function cargarPlatos() {
	numeroPlato = localStorage.getItem("id");
    if (numeroPlato != null) {
        contenedorPlatos = document.getElementById("platos");
        numeroPlato++;
        for (i = 1; i < numeroPlato; i++) {
            elementosAlmacenados = obtenerPlatos(i);    
            if (elementosAlmacenados != null) {
                crearPlato(i, elementosAlmacenados[1], elementosAlmacenados[2], aplicarColor(elementosAlmacenados[2]))
            }
        }
    }
}

// Añadimos un plato con el color de categoría y el nombre especificado
function insertarPlato() {
    numeroPlato = localStorage.getItem("id");
    if (numeroPlato == null)
        numeroPlato = 0;
    numeroPlato++;

    nombrePlato = document.formulario.plato.value;
    categoria = document.formulario.categoria.value;
    color = aplicarColor(categoria);

    if (nombrePlato === "") {
        alert("¡Advertencia! No ha especificado un nombre para el plato.");
    } else {
        crearPlato(numeroPlato, nombrePlato, categoria, color)

        nuevoPlato = [numeroPlato, nombrePlato, categoria];
        localStorage.setItem("id", numeroPlato);
        localStorage.setItem("Plato-" + numeroPlato, JSON.stringify(nuevoPlato));
    }
    document.getElementById("b_Plato").value = "";
}

// Función genérica para crear el plato
function crearPlato(iterador, texto, categoria, color) {
    contenedorPlatos = document.getElementById("platos");
    labelplatos = contenedorPlatos.appendChild(crearElementoLabel("label", "for", "Plato-" + iterador));
    labelplatos.appendChild(crearElementoBoton("checkbox", "id", "Plato-" + iterador, "class", categoria, "name", "elemento"));
    labelplatos.appendChild(crearElementoTexto("span", "TextoPlato_" + iterador, texto));
    labelplatos.appendChild(crearElementoBoton("button", "id", "b_Editar" + iterador, "class", "boton-edicion", "value", ""));

     // Añadimos EventListener para evitar el intrusismo en el HTML
    document.getElementById("b_Editar" + iterador).addEventListener("click", function(){editarPlato(iterador)}, false);
    
    labelplatos.id = iterador;
    document.getElementById(iterador).style.backgroundColor = color; // Aplicamos el color según la categoría
}

// Cambiamos el nombre de la categoría por el color correspondiente.
function aplicarColor(categoria) {
    color = "";
    switch (true) {
        case (categoria == "entrante"):
            color = "rgb(207, 121, 121)";
            break;
        case (categoria == "primero"):
            color = "rgb(121, 149, 207)";
            break;
        case (categoria == "segundo"):
            color = "rgb(111, 180, 122)";
            break;
        case (categoria == "postre"):
            color = "rgb(212, 206, 124)";
            break;
        default:
            break;
    }
    return color;
}

// Eliminamos los platos que estén seleccionados
function eliminarPlato() {
    elementos = document.querySelectorAll("input[type='checkbox']:checked");
    mensaje = "¡Advertencia! No hay elementos seleccionados.";
    ejecutarAccion("borrar", elementos, mensaje);
}

// Tachamos los platos que estén seleccionados
function tacharPlato() {
    elementos = document.querySelectorAll("input[type='checkbox']:checked");
    mensaje = "¡Advertencia! No hay elementos seleccionados.";
    ejecutarAccion("tachar", elementos, mensaje);
}

// Destachamos los platos que estén seleccionados
function activarPlato() {
    elementos = document.querySelectorAll("input[type='checkbox']:checked");
    mensaje = "¡Advertencia! No hay elementos seleccionados.";
    ejecutarAccion("activar", elementos, mensaje);
}

// Marcamos todos los platos que haya
function marcarPlato() {
    elementos = document.querySelectorAll("input[type='checkbox']");
    mensaje = "¡Advertencia! No hay elementos para seleccionar.";
    ejecutarAccion("marcar", elementos, mensaje);
}

// Desmarcamos todos los platos que haya
function desmarcarPlato() {
    elementos = document.querySelectorAll("input[type='checkbox']:checked");
    mensaje = "¡Advertencia! No hay elementos seleccionados.";
    ejecutarAccion("desmarcar", elementos, mensaje);
}

function marcarPlatoPorCategoria() {
    categoria = document.formulario.categoria.value;
    elementos = document.getElementsByClassName(categoria);
    mensaje = "¡Advertencia! \nNo hay elementos de la categoría '" + categoria + "' para seleccionar.";
    ejecutarAccion("marcar", elementos, mensaje);
}

// Funcion genérica para ejecutar la acción requerida
function ejecutarAccion(accion, elementos, mensajeError) {
    if (elementos.length == 0) {
        alert(mensajeError);
    } else {
        for (i = 0; i < elementos.length; i++) {
            switch (true) {
                case (accion == "borrar"):
                    elemento = elementos[i].parentNode;
                    elemento.parentNode.removeChild(elemento);
                    localStorage.removeItem(elementos[i].id);
                    break;
                case (accion == "marcar"):
                    elemento = elementos[i];
                    elemento.checked = true;
                    break;
                case (accion == "desmarcar"):
                    elemento = elementos[i];
                    elemento.click();
                    break;
                case (accion == "tachar"):
                    elemento = elementos[i].nextSibling;
                    elemento.style.textDecoration = "line-through";
                    break;
                case (accion == "activar"):
                    elemento = elementos[i].nextSibling;
                    elemento.style.textDecoration = "initial";
                    break;
                default:
                    break;
            }
        }
    }
}

// Ordenamos todos los platos por orden de categoría
function ordenarPlato() {
    elementos = document.querySelectorAll("input[type='checkbox']");
    for (i = 0; i < elementos.length; i++) {
        elemento = elementos[i].parentNode;
        elemento.parentNode.removeChild(elemento);
    }

	numeroPlato = localStorage.getItem("id");

	if (numeroPlato != null) {
		numeroPlato++;
        contenedorPlatos = document.getElementById("platos");
		for (i = 1; i < numeroPlato; i++) {
            elementosAlmacenados = obtenerPlatos(i);
			if (elementosAlmacenados != null && elementosAlmacenados[2] == "entrante") {
                crearPlato(i, elementosAlmacenados[1], elementosAlmacenados[2], aplicarColor(elementosAlmacenados[2]))
			}
		}
		for (i = 1; i < numeroPlato; i++) {
            elementosAlmacenados = obtenerPlatos(i);
			if (elementosAlmacenados != null && elementosAlmacenados[2] == "primero") {
                crearPlato(i, elementosAlmacenados[1], elementosAlmacenados[2], aplicarColor(elementosAlmacenados[2]))
			}
		}
		for (i = 1; i < numeroPlato; i++) {
            elementosAlmacenados = obtenerPlatos(i);
			if (elementosAlmacenados != null && elementosAlmacenados[2] == "segundo") {
                crearPlato(i, elementosAlmacenados[1], elementosAlmacenados[2], aplicarColor(elementosAlmacenados[2]))
			}
		}
		for (i = 1; i < numeroPlato; i++) {
            elementosAlmacenados = obtenerPlatos(i);
			if (elementosAlmacenados != null && elementosAlmacenados[2] == "postre") {
                crearPlato(i, elementosAlmacenados[1], elementosAlmacenados[2], aplicarColor(elementosAlmacenados[2]))
			}
		}
	}
}

// Función para obtener los platos del LocalStorage
function obtenerPlatos(iterador) {
    elementosAlmacenados = localStorage.getItem("Plato-" + iterador);
    platos = JSON.parse(elementosAlmacenados);
    return platos;
}

// Editamos el nombre del plato
function editarPlato(iterador) {
    elementosAlmacenados = obtenerPlatos(iterador);
    nombreNuevo = prompt("¿Desea cambiar el nombre del plato? ", elementosAlmacenados[1]);
    if (nombreNuevo != null) {
        elementoActualizado = [iterador, nombreNuevo, elementosAlmacenados[2]];
        localStorage.setItem("Plato-" + iterador, JSON.stringify(elementoActualizado));
        document.getElementById("TextoPlato_" + iterador).textContent = nombreNuevo;
    }
}

// Crear los elementos de tipo contenedor como un form o un div
function crearElementoContenedor(elemento, atributo1, valor1, atributo2, valor2) {
    elementoContenedor = document.createElement(elemento);
    elementoContenedor.setAttribute(atributo1, valor1);
    elementoContenedor.setAttribute(atributo2, valor2);
    return elementoContenedor;
}

// Crear los elementos de tipo botón con los atributos que le pasemos
function crearElementoBoton(tipo, atributo1, valor1, atributo2, valor2, atributo3, valor3) {
    elementoBoton = document.createElement("input");
    elementoBoton.setAttribute("type", tipo);
    elementoBoton.setAttribute(atributo1, valor1);
    elementoBoton.setAttribute(atributo2, valor2);
    elementoBoton.setAttribute(atributo3, valor3);
    return elementoBoton;
}

// Crear los elementos que tengan solo texto como por ejemplo un "span" o un "h1"
function crearElementoTexto(nombre, identificador, texto) {
    elementoTexto = document.createElement(nombre);
    elementoTexto.setAttribute("id", identificador);
    elementoTexto.textContent = texto;
    return elementoTexto;
}

// Crear los elementos de tipo label con los atributos que queramos
function crearElementoLabel(nombre, atributo1, valor1) {
    elementoLabel = document.createElement(nombre);
    elementoLabel.setAttribute(atributo1, valor1);
    return elementoLabel;
}
