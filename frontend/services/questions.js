// frontend/services/questions.js

/**
 * Valida estrictamente el contrato de la pregunta.
 */
function validarContratoPregunta(data) {
    if (!data || typeof data !== 'object') return false;
    if (typeof data.id !== 'number' || data.id <= 0) return false;
    if (!data.pregunta || typeof data.pregunta !== 'string' || data.pregunta.trim() === '') return false;
    if (!Array.isArray(data.opciones) || data.opciones.length < 2) return false;
    const respuestaCorrecta = data.respuesta || data.correcta;
    if (!respuestaCorrecta || typeof respuestaCorrecta !== 'string' || !data.opciones.includes(respuestaCorrecta)) return false;
    if (!data.categoria || typeof data.categoria !== 'string') return false;
    return true;
}

/**
 * Obtiene una pregunta aleatoria o por categoría desde el archivo local preguntas.json.
 */
export async function obtenerPreguntaAPI(categoria = null) {
    try {
        const respuesta = await fetch('./preguntas.json');
        if (!respuesta.ok) {
            throw new Error(`Error HTTP al cargar preguntas.json: ${respuesta.status}`);
        }

        const data = await respuesta.json();
        // Soportamos tanto si el json es un array directo como si es un objeto con la propiedad "preguntas"
        const listaPreguntas = Array.isArray(data) ? data : (data.preguntas || []);

        if (listaPreguntas.length === 0) {
            throw new Error("El archivo preguntas.json está vacío.");
        }

        // Filtramos por categoría si se especificó una (y no es Comodín)
        let preguntasFiltradas = listaPreguntas;
        if (categoria && categoria !== "Comodín") {
            preguntasFiltradas = listaPreguntas.filter(
                p => p.categoria && p.categoria.toLowerCase() === categoria.toLowerCase()
            );
        }

        // Si no hay preguntas de esa categoría específica, usamos todas las disponibles
        const pool = preguntasFiltradas.length > 0 ? preguntasFiltradas : listaPreguntas;

        // Seleccionamos una pregunta al azar del conjunto
        const randomIndex = Math.floor(Math.random() * pool.length);
        const dataPregunta = pool[randomIndex];

        // Validamos el contrato antes de devolverla
        if (!validarContratoPregunta(dataPregunta)) {
            throw new Error("Contrato de pregunta inválido detectado en el archivo JSON local.");
        }

        return {
            id: dataPregunta.id,
            categoria: dataPregunta.categoria,
            pregunta: dataPregunta.pregunta,
            opciones: dataPregunta.opciones,
            respuesta: dataPregunta.respuesta || dataPregunta.correcta
        };

    } catch (error) {
        console.error("Error al obtener la pregunta local:", error);
        throw error;
    }
}