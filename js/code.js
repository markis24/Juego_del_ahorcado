// Coloca aquí el JavaScript proporcionado
const objetoEntrada = document.getElementById("palabraSecreta");
const botonComenzar = document.getElementById("comenzarPartida");
let botonesAlfabeto = []; // Variable global para almacenar los botones
let jugadasFallidas = 0;
let numeroPartidas = 0;
let maxNumeroPartidas = 10;
let partidasGanadas = 0;
let puntosActuales = 0;
let puntosMaximos = 0;
let totalPartidas = 0;
let palabrasGuardadas = []; // Array para guardar las palabras

const imagenes = ["img_penjat/penjat_0.png"];

function palabraSecreta() {
    const palabraSecreta = document.getElementById("palabraSecreta").value;
    const palabraArray = palabraSecreta.split("");
    const palabraArrayAdivinar = palabraArray.map((letra) =>
        letra === " " ? letra : "_"
    );
    document.getElementById("palabraAdivinar").innerHTML =
        palabraArrayAdivinar.join(" ");
}
function mostrarPalabra() {
    const img = document.querySelector("img");
    if (objetoEntrada.type === "password") {
        objetoEntrada.type = "text"; // Cambiar a texto para mostrar la palabra
        img.src = "icon/eye-secret.png";
    } else {
        objetoEntrada.type = "password"; // Cambiar a password para ocultar
        img.src = "icon/eye-open.png";
    }
}

function comenzarPartida() {
    const palabraSecreta = objetoEntrada.value;
    if (!palabraSecreta) {
        alert("Por favor, escribe una palabra.");
        return;
    }

    if (palabraSecreta.length < 4) {
        alert("La palabra debe tener más de 4 caracteres.");
        return;
    }

    if (/\d/.test(palabraSecreta)) {
        alert("La palabra no puede contener números.");
        return;
    }

    palabrasGuardadas.push(palabraSecreta);

    // Cambiar color y habilitar los botones del alfabeto
    botonesAlfabeto.forEach((boton) => {
        boton.style.color = "black"; // Cambiar color a negro
        boton.style.borderColor = "black"; // Cambiar el borde a negro
        boton.disabled = false; // Habilitar el botón
    });
}

window.onload = function () {
    const contenedorAlfabeto = document.getElementById("alfabeto");
    const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    letras.forEach((letra) => {
        // Crear un botón para cada letra
        const boton = document.createElement("button");
        boton.innerText = letra;
        boton.id = `boton_${letra}`; // Asignar un ID único
        boton.style.color = "red"; // Cambiar el color del texto del botón a rojo (por defecto deshabilitado)
        boton.style.borderColor = "red"; // Cambiar el color del borde del botón a rojo (por defecto deshabilitado)
        boton.disabled = true; // Deshabilitar el botón al inicio

        // Añadir un evento de clic al botón
        boton.addEventListener("click", function () {
            boton.style.color = "red"; // Cambiar color a rojo cuando se presione
            boton.style.borderColor = "red"; // Cambiar el borde a rojo
            boton.disabled = true; // Deshabilitar el botón
        });

        // Añadir el botón a la lista de botones
        botonesAlfabeto.push(boton);

        // Añadir el botón al contenedor
        contenedorAlfabeto.appendChild(boton);
    });
};
