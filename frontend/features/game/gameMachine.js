export function createGameInitialState(numPlayers, difficulty) {
    let tiempoMaximo = 15;
    let multiplicadorPuntos = 1;

    if (dificultad === 'facil') { tiempoMaximo = 20; }
    else if (dificultad === 'dificil') { tiempoMaximo = 10; multiplicadorPuntos = 2; }

    const jugadores = [];
    for (let i = 0; i < numJugadores; i++) {
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
        numJugadores,
        dificultad,
        tiempoMaximo,
        multiplicadorPuntos,
        jugadores,
        turnoActual: 0,
        fase: 'RULETA'
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