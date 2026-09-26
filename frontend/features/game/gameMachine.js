export function createGameInitialState(numPlayers, difficulty) {
    let tiempoMaximo = 15;
    let multiplicadorPuntos = 1;

    if (difficulty === 'easy') { timeMaximum = 20; }
    else if (difficulty === 'dificil') { tiempoMaximo = 10; multiplicadorPuntos = 2; }

    const jugadores = [];
    for (let i = 0; i < numPlayers; i++) {
        jugadores.push({
            id: i,
            nombre: `Jugador ${i + 1}`,
            puntos: 0,
            vidas: 3,
            comodinUsado: false,
            racha: 0
        });
    }

    return {
        numPlayers,
        difficulty,
        tiempoMaximo,
        multiplicadorPuntos,
        jugadores,
        turnoActual: 0,
        fase: 'RULETA',
        // Lista de preguntas estáticas para que funcione sin servidor externo en el celular
        preguntas: [
            {
                categoria: "Matemáticas",
                pregunta: "¿Cuánto es 8 x 7?",
                opciones: ["54", "56", "64", "48"],
                correcta: "56"
            },
            {
                categoria: "Geografía",
                pregunta: "¿Cuál es la capital de Argentina?",
                opciones: ["Buenos Aires", "Córdoba", "Rosario", "Mendoza"],
                correcta: "Buenos Aires"
            }
            // Puedes agregar más preguntas aquí
        ],
        preguntaActual: null
    };
}

export function procesarRespuestaJugador(estado, esAcertada) {
    const jugadores = [...estado.jugadores];
    const jugadorActivo = { ...jugadores[estado.turnoActual] };

    if (esAcertada) {
        jugadorActivo.racha += 1;
        const puntosBase = 10 * estado.multiplicadorPuntos;
        const bonusRacha = jugadorActivo.racha > 1 ? (jugadorActivo.racha - 1) * 5 : 0;
        jugadorActivo.puntos += (puntosBase + bonusRacha);
    } else {
        jugadorActivo.racha = 0;
        jugadorActivo.vidas -= 1;
    }

    jugadores[estado.turnoActual] = jugadorActivo;
    return { ...estado, jugadores };
}