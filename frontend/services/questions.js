// frontend/services/questions.js

const API_BASE_URL = "http://localhost:8001";

/**
 * Valida estrictamente el contrato de la pregunta que entrega FastAPI.
 */
function validarContratoPregunta(data) {
    if (!data || typeof data !== 'object') return false;
    if (typeof data.id !== 'number' || data.id <= 0) return false;
    if (!data.pregunta || typeof data.pregunta !== 'string' || data.pregunta.trim() === '') return false;
    if (!Array.isArray(data.opciones) || data.opciones.length < 2) return false;
    // Comprobamos que la respuesta correcta exista dentro de las opciones
    const respuestaCorrecta = data.respuesta || data.correcta;
    if (!respuestaCorrecta || typeof respuestaCorrecta !== 'string' || !data.opciones.includes(respuestaCorrecta)) return false;
    if (!data.categoria || typeof data.categoria !== 'string') return false;
    return true;
}

/**
 * Petición HTTP con soporte de AbortController para timeouts.
 */
async function fetchConTimeout(url, opciones = {}, timeout = 5000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
        const response = await fetch(url, { ...opciones, signal: controller.signal });
        clearTimeout(id);
        return response;
    } catch (err) {
        clearTimeout(id);
        throw err;
    }
}

/**
 * Obtiene una pregunta aleatoria o por categoría desde FastAPI asegurando el contrato.
 */
export async function obtenerPreguntaAPI(categoria = null) {
    let url = `${API_BASE_URL}/question/random`;
    if (categoria && categoria !== "Comodín") {
        url += `?categoria=${encodeURIComponent(categoria)}`;
    }

    try {
        const respuesta = await fetchConTimeout(url, {}, 5000);
        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        const data = await respuesta.json();
        
        if (!validarContratoPregunta(data)) {
            throw new Error("Contrato de pregunta inválido detectado en la frontera.");
        }

        return {
            id: data.id,
            categoria: data.categoria,
            pregunta: data.pregunta,
            opciones: data.opciones,
            respuesta: data.respuesta || data.correcta
        };
    } catch (error) {
        console.warn("Fallo en la API principal, intentando comodín general de respaldo:", error);
        
        // Intento de emergencia genérico si falla la categoría específica
        if (categoria) {
            return await obtenerPreguntaAPI(null);
        }
        throw error;
    }
}