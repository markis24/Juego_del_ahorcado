// Configuración de constantes y variables de juego
const maxIntentos = 10; // Número máximo de intentos permitidos
let palabrasGuardadas = []; // Almacena las palabras utilizadas en la partida
let letrasAdivinadas = []; // Almacena las letras adivinadas
let botonesAlfabeto = []; // Almacena los botones de letras para el juego
let palabra = ""; // Palabra secreta para adivinar
let puntosActuales = 0; // Puntos actuales del jugador
let totalPartidas = 0; // Total de partidas jugadas
let partidasGanadas = 0; // Total de partidas ganadas
let maxPuntos = 0; // Puntaje máximo alcanzado
let recordPartida = ""; // Formato: "día/hora - puntos" para el récord de la partida

// Información y estadísticas de cada jugador
let jugadores = [
    { puntos: 0, totalPartidas: 0, ganadas: 0, maxPuntos: 0, recordPartida: "" }, // Jugador 1
    { puntos: 0, totalPartidas: 0, ganadas: 0, maxPuntos: 0, recordPartida: "" }  // Jugador 2
];
let turnoActual = 0; // Indica el turno actual (0 para Jugador 1, 1 para Jugador 2)
let aciertosConsecutivos = [0, 0]; // Almacena los aciertos consecutivos por jugador

// Objetos del DOM para manipular elementos de la interfaz
const objetoEntrada = document.getElementById("palabraSecreta"); // Entrada para la palabra secreta
const titulo = document.getElementById("tituloJuego"); // Título del juego
const contenedorTitulo = document.getElementsByClassName("contenedor-titulo")[0]; // Contenedor del título


// Función para iniciar una nueva partida
function comenzarPartida() {
    totalPartidas++;
    palabra = objetoEntrada.value.trim().toUpperCase();

    if (!palabra) {
        alert("Por favor, escribe una palabra.");
        return;
    }
    if (palabra.length < 4) {
        alert("La palabra debe tener más de 3 caracteres.");
        return;
    }
    if (/\d/.test(palabra)) {
        alert("La palabra no puede contener números.");
        return;
    }

    // Reiniciar contadores de intento e imagen
    palabrasGuardadas.push(palabra);
    letrasAdivinadas = Array(palabra.length).fill("_");
    intentosFallidos = 0;
    indiceImagen = 0;

    // Establecer imagen inicial
    document.getElementById("img_ahorcado").src = imagenes[indiceImagen];

    // Configuración visual y de control
    mostrarPalabraOculta();
    document.getElementById("palabraSecreta").disabled = true;
    document.getElementById("comenzarPartida").disabled = true;
    botonesAlfabeto.forEach((boton) => {
        boton.style.color = "black";
        boton.style.borderColor = "black";
        boton.disabled = false;
    });

    // Cambiar fondo a azul al comenzar la partida
    document.querySelector(".contenedor-titulo").style.backgroundColor = "#bbc6ee";
}




// Función ejecutada al cargar la página para inicializar botones del alfabeto
window.onload = function () {
    const contenedorAlfabeto = document.getElementById("alfabeto");
    const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    letras.forEach((letra) => {
        const boton = document.createElement("button");
        boton.innerText = letra;
        boton.id = `boton_${letra}`;
        boton.style.color = "red";
        boton.style.borderColor = "red";
        boton.disabled = true;

        boton.addEventListener("click", function () {
            boton.style.color = "red";
            boton.style.borderColor = "red";
            boton.disabled = true;
            verificarLetra(letra); // Llama a la función para verificar la letra seleccionada
        });

        botonesAlfabeto.push(boton);
        contenedorAlfabeto.appendChild(boton);
    });

    actualizarUIJugador(); // Muestra el color de jugador actual al iniciar
}


// Función para verificar si la letra adivinada está en la palabra
function verificarLetra(letra) {
    let letraEncontrada = false; // Marca si la letra se encuentra en la palabra
    let vecesEnPalabra = 0; // Cuenta cuántas veces aparece la letra

    for (let i = 0; i < palabra.length; i++) {
        if (palabra[i] === letra) {
            letrasAdivinadas[i] = letra;
            letraEncontrada = true;
            vecesEnPalabra++;
        }
    }

    mostrarPalabraOculta(); // Actualiza la palabra oculta en la interfaz

    if (letraEncontrada) {
        aciertosConsecutivos[turnoActual]++; // Aumenta aciertos consecutivos
        jugadores[turnoActual].puntos += aciertosConsecutivos[turnoActual] * vecesEnPalabra;
    } else {
        aciertosConsecutivos[turnoActual] = 0; // Reinicia aciertos consecutivos
        jugadores[turnoActual].puntos = Math.max(jugadores[turnoActual].puntos - 1, 0); // Reduce puntos
        siguienteImagen(); // Cambia la imagen en caso de fallo
        turnoActual = 1 - turnoActual; // Cambia el turno
        actualizarUIJugador(); // Actualiza el color del turno actual
    }

    actualizarPuntos(); // Muestra los puntos actualizados
    verificarVictoria(); // Comprueba si alguien ha ganado o perdido
}

// Función para actualizar los puntos en la interfaz
function actualizarPuntos() {
    document.getElementById("puntosJugador1").textContent = jugadores[0].puntos;
    document.getElementById("puntosJugador2").textContent = jugadores[1].puntos;
}

// Cambia el fondo para mostrar el turno del jugador actual
function actualizarUIJugador() {
    const jugador1Div = document.getElementById("jugador1");
    const jugador2Div = document.getElementById("jugador2");

    if (turnoActual === 0) {
        jugador1Div.style.backgroundColor = "green";
        jugador2Div.style.backgroundColor = "red";
    } else {
        jugador1Div.style.backgroundColor = "red";
        jugador2Div.style.backgroundColor = "green";
    }
}
// Actualiza las estadísticas de un jugador tras finalizar la partida
function actualizarEstadisticas(jugador) {
    // Actualiza la cantidad total de partidas y las partidas ganadas para el jugador actual en el DOM
    document.getElementById(`totalPartidasJugador${jugador + 1}`).textContent = jugadores[jugador].totalPartidas;
    document.getElementById(`ganadasJugador${jugador + 1}`).textContent = jugadores[jugador].ganadas;

    // Si los puntos actuales son el máximo alcanzado, actualiza el récord de puntos
    if (jugadores[jugador].puntos > jugadores[jugador].maxPuntos) {
        jugadores[jugador].maxPuntos = jugadores[jugador].puntos; // Actualiza el puntaje máximo
        const fecha = new Date(); // Obtiene la fecha y hora actuales
        // Guarda el nuevo récord de partida con fecha, hora y puntos alcanzados
        jugadores[jugador].recordPartida = `${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString()} - ${jugadores[jugador].puntos} puntos`;
        // Muestra el récord en el elemento correspondiente del DOM
        document.getElementById(`recordPartidaJugador${jugador + 1}`).textContent = jugadores[jugador].recordPartida;
    }

    // Reinicia los puntos y aciertos consecutivos para ambos jugadores para la siguiente partida
    jugadores[0].puntos = 0;
    jugadores[1].puntos = 0;
    aciertosConsecutivos = [0, 0];
    intentosFallidos = 0; // Restablece los intentos fallidos
}


// Muestra la palabra oculta en el título del juego usando guiones bajos para letras no adivinadas
function mostrarPalabraOculta() {
    const palabraConGuiones = letrasAdivinadas.join(" "); // Combina letras y guiones en una sola cadena
    document.getElementById("tituloJuego").textContent = palabraConGuiones; // Muestra la cadena resultante en el título
}


// Verifica si el jugador ha ganado o perdido tras un intento de adivinanza
function verificarVictoria() {
    const titulo = document.getElementById("tituloJuego"); // Referencia al título del juego en el DOM
    const contenedorTitulo = document.getElementsByClassName("contenedor-titulo")[0]; // Referencia al contenedor del título

    // Condición de victoria: si no hay guiones en letrasAdivinadas, significa que la palabra ha sido adivinada completamente
    if (!letrasAdivinadas.includes("_")) {
        titulo.textContent = `¡Ganaste! La palabra era: ${palabra}`; // Muestra mensaje de victoria
        contenedorTitulo.style.backgroundColor = "green"; // Cambia el fondo a verde indicando victoria
        actualizarEstadisticas(turnoActual); // Actualiza estadísticas del jugador actual
        reiniciarPartida(); // Reinicia la partida para el próximo juego

        // Determina el jugador ganador entre ambos basándose en el puntaje
        const ganador = jugadores[0].puntos >= jugadores[1].puntos ? 0 : 1;
        jugadores[ganador].totalPartidas++; // Incrementa las partidas jugadas por el ganador
        jugadores[ganador].ganadas++; // Incrementa las partidas ganadas por el ganador

    // Condición de derrota: si el número de intentos fallidos supera el máximo permitido
    } else if (intentosFallidos >= maxIntentos) {
        titulo.textContent = `Perdiste. La palabra era: ${palabra}`; // Muestra mensaje de derrota
        contenedorTitulo.style.backgroundColor = "red"; // Cambia el fondo a rojo indicando derrota
        reiniciarPartida(); // Reinicia la partida para el próximo juego

        // Resetea los puntos de ambos jugadores en caso de derrota
        jugadores[0].puntos = 0;
        jugadores[1].puntos = 0;
    } else {
        titulo.style.color = "black"; // Mantiene el color del título en negro si la partida continúa
    }
}



// Configuración inicial de variables e imágenes para los intentos fallidos
let indiceImagen = 0; // Índice actual de imagen
let intentosFallidos = 0; // Conteo de intentos fallidos
const imagenes = [
    "img_penjat/penjat_0.jpg",
    "img_penjat/penjat_1.jpg",
    "img_penjat/penjat_2.jpg",
    "img_penjat/penjat_3.jpg",
    "img_penjat/penjat_4.jpg",
    "img_penjat/penjat_5.jpg",
    "img_penjat/penjat_6.jpg",
    "img_penjat/penjat_7.jpg",
    "img_penjat/penjat_8.jpg",
    "img_penjat/penjat_9.jpg",
    "img_penjat/penjat_10.jpg",
];

// Función de actualización de imagen en caso de fallar
function siguienteImagen() {
    const imgElemento = document.getElementById("img_ahorcado");

    if (imgElemento && intentosFallidos < maxIntentos) {
        intentosFallidos++;
        indiceImagen = intentosFallidos; // La imagen sigue el índice de fallos
        imgElemento.src = imagenes[indiceImagen];
    }
    verificarVictoria();
}



// Función para reiniciar la partida y habilitar la entrada de palabra y botón de comenzar
function reiniciarPartida() {
    document.getElementById("palabraSecreta").disabled = false;
    document.getElementById("comenzarPartida").disabled = false;
}

// Función para mostrar o ocultar la palabra secreta con iconos
function mostrarPalabra() {
    const img = document.querySelector("img");
    if (objetoEntrada.type === "password") {
        objetoEntrada.type = "text"; // Cambia a texto para mostrar la palabra
        img.src = "icons/eye-secret.png";
    } else {
        objetoEntrada.type = "password"; // Cambia a password para ocultar
        img.src = "icons/eye-open.png";
    }
}
