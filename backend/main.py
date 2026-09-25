from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import random

app = FastAPI(title="Preguntados API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Memoria temporal para registrar los IDs de las preguntas ya vistas en esta sesión
preguntas_vistas = set()

@app.get("/")
def read_root():
    return {"mensaje": "¡Servidor de Preguntados activo con Base de Datos!"}

# Rutas para evitar errores 404 en las peticiones internas de diagnóstico de la terminal
@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/v1/models")
def list_models():
    return {"models": []}

@app.get("/question/random")
def obtener_pregunta_aleatoria(categoria: str = None):
    conn = sqlite3.connect("preguntados.db")
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    # Consultar la base de datos SQL según la categoría o todas
    if categoria:
        cursor.execute("SELECT * FROM preguntas WHERE LOWER(categoria) = LOWER(?)", (categoria,))
    else:
        cursor.execute("SELECT * FROM preguntas")
        
    filas = cursor.fetchall()
    conn.close()

    if not filas:
        raise HTTPException(status_code=404, detail="No se encontraron preguntas.")

    # Filtrar las preguntas que aún NO han salido en esta sesión
    disponibles = [f for f in filas if f["id"] not in preguntas_vistas]

    # Si ya se mostraron todas, limpiamos la memoria para reiniciar el ciclo automáticamente
    if not disponibles:
        preguntas_vistas.clear()
        disponibles = filas

    # Elegir una pregunta al azar de las disponibles
    fila = random.choice(disponibles)
    
    # Registrar esta pregunta como vista para que no vuelva a salir
    preguntas_vistas.add(fila["id"])

    # Organizar las opciones de respuesta
    opciones = [
        fila["respuesta_correcta"],
        fila["opcion_incorrecta1"],
        fila["opcion_incorrecta2"],
        fila["opcion_incorrecta3"]
    ]
    random.shuffle(opciones)

    return {
        "id": fila["id"],
        "categoria": fila["categoria"],
        "pregunta": fila["pregunta"],
        "opciones": opciones,
        "respuesta": fila["respuesta_correcta"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)