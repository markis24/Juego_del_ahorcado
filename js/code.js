
        // Coloca aquí el JavaScript proporcionado
        const inputObject = document.getElementById("paraulaSecreta");
        const comenzarBtn = document.getElementById("comenzarBtn");
        let jugadaFallada = 0;
        let palabrasGuardadas = []; // Array para guardar las palabras

        const imagenes = ["img_penjat/penjat_0.png"];

        // Generar los botones del abecedario
        window.onload = function() {
            const alphabetContainer = document.getElementById('alphabet');
            const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

            letters.forEach(letter => {
                // Crear un botón para cada letra
                const button = document.createElement('button');
                button.innerText = letter;
                button.id = `boto_${letter}`; // Asignar un ID único

                // Añadir el botón al contenedor
                alphabetContainer.appendChild(button);
            });
        };


        // Cambiar el texto por una imagen
        function mostrarParaula() {
            if (inputObject.type === "password") {
                inputObject.type = "text"; // Cambiar a texto para mostrar la palabra
            } else {
                inputObject.type = "password"; // Cambiar a password para ocultar
            }
        }

        function jugarLletra(obj){
            let lletraJugada = obj.textContent;
            console.log(lletraJugada);
        }

        function enviarParaula() {
            comenzarPartida(); // Llamar a la función para manejar la palabra
        }

        function comenzarPartida() {
            const paraulaSecreta = inputObject.value;

            if (!paraulaSecreta) {
                alert("Por favor, escribe una palabra.");
                return;
            }

            if (paraulaSecreta.length < 4 ) {
                alert("La palabra debe tener más de 4 caracteres.");
                return;
            }

            if (/\d/.test(paraulaSecreta)) {
                alert("La palabra no puede contener números.");
                return;
            }

            palabrasGuardadas.push(paraulaSecreta);

            console.log(palabrasGuardadas);
        }