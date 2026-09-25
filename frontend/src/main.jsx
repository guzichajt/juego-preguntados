from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import random

app = FastAPI(title="Preguntados API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PREGUNTAS_DB = [
    {
        "id": 1,
        "categoria": "Geografía",
        "pregunta": "¿Cuál es la capital de Francia?",
        "opciones": ["Londres", "París", "Roma", "Madrid"],
        "respuesta_index": 1  # "París" está en la posición 1 (0: Londres, 1: París...)
    },
    {
        "id": 2,
        "categoria": "Arte",
        "pregunta": "¿Quién pintó la Mona Lisa?",
        "opciones": ["Van Gogh", "Picasso", "Leonardo da Vinci", "Dalí"],
        "respuesta_index": 2  # "Leonardo da Vinci" está en la posición 2
    },
    {
        "id": 3,
        "categoria": "Ciencia",
        "pregunta": "¿Cuál es el planeta más grande del Sistema Solar?",
        "opciones": ["Marte", "Júpiter", "Saturno", "Venus"],
        "respuesta_index": 1  # "Júpiter" está en la posición 1
    }
]

@app.get("/")
def read_root():
    return {"mensaje": "¡Servidor de Preguntados activo!"}

@app.get("/question/random")
def obtener_pregunta_aleatoria(categoria: str = None):
    filtradas = PREGUNTAS_DB
    if categoria:
        filtradas = [p for p in PREGUNTAS_DB if p["categoria"].lower() == categoria.lower()]
    
    if not filtradas:
        raise HTTPException(status_code=404, detail="No hay preguntas disponibles")
    
    return random.choice(filtradas)

@app.get("/question/{pregunta_id}")
def obtener_pregunta(pregunta_id: int):
    for pregunta in PREGUNTAS_DB:
        if pregunta["id"] == pregunta_id:
            return pregunta
    raise HTTPException(status_code=404, detail="Pregunta non encontrada")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)