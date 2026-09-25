import React, { useState, useEffect } from 'react';

function App() {
  const [pregunta, setPregunta] = useState(null);

  const cargarPregunta = async () => {
    try {
      const respuesta = await fetch('http://localhost:8000/question/random');
      const data = await respuesta.json();
      setPregunta(data);
    } catch (error) {
      console.error("Error al conectar con el backend:", error);
    }
  };

  useEffect(() => {
    cargarPregunta();
  }, []);

  const verificarRespuesta = (opcionSeleccionada, indexSeleccionado) => {
    let esCorrecta = false;

    // Si el backend manda un índice numérico, lo usamos (método infalible)
    if (pregunta.respuesta_index !== undefined) {
      esCorrecta = (indexSeleccionado === pregunta.respuesta_index);
    } 
    // Si manda texto tradicional, lo comparamos limpiando tildes y mayúsculas
    else if (pregunta.respuesta) {
      const sel = opcionSeleccionada.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
      const cor = pregunta.respuesta.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
      esCorrecta = (sel === cor);
    }

    if (esCorrecta) {
      alert("¡Correcto!");
    } else {
      alert("¡Incorrecto!");
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center', marginTop: '50px' }}>
      <h1>Preguntados - Versión Local</h1>
      {pregunta ? (
        <div style={{ background: '#f0f0f0', padding: '20px', borderRadius: '10px', display: 'inline-block' }}>
          <h3>Categoría: {pregunta.categoria}</h3>
          <h2>{pregunta.pregunta}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
            {pregunta.opciones.map((opcion, index) => (
              <button 
                key={index} 
                onClick={() => verificarRespuesta(opcion, index)}
                style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
              >
                {opcion}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p>Cargando pregunta desde el servidor...</p>
      )}
      <br /><br />
      <button onClick={cargarPregunta} style={{ padding: '10px 20px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        Girar / Siguiente Pregunta
      </button>
    </div>
  );
}

export default App;