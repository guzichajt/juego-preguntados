import sqlite3
import csv

def cargar_datos_masivos():
    # Conectarse a la base de datos
    conn = sqlite3.connect("preguntados.db")
    cursor = conn.cursor()

    # 1. CREAR LA TABLA PRIMERO (Esto soluciona tu error)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS preguntas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            categoria VARCHAR(50),
            pregunta TEXT,
            respuesta_correcta TEXT,
            opcion_incorrecta1 TEXT,
            opcion_incorrecta2 TEXT,
            opcion_incorrecta3 TEXT
        )
    ''')

    # 2. Abrir el archivo CSV y cargar los datos
    try:
        with open("preguntas_masivas.csv", "r", encoding="utf-8") as archivo:
            lector = csv.reader(archivo)
            next(lector) # Saltar la primera fila de los encabezados
            
            preguntas = []
            for fila in lector:
                # Nos aseguramos de que la fila tenga exactamente 6 columnas
                if len(fila) == 6:
                    preguntas.append(tuple(fila))

        # 3. Insertar todas las preguntas de golpe en SQL
        cursor.executemany('''
            INSERT INTO preguntas 
            (categoria, pregunta, respuesta_correcta, opcion_incorrecta1, opcion_incorrecta2, opcion_incorrecta3)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', preguntas)

        conn.commit()
        print(f"¡Éxito! Se inyectaron {len(preguntas)} preguntas en la base de datos.")
    
    except FileNotFoundError:
        print("Error: No se encontró el archivo 'preguntas_masivas.csv'.")
    except Exception as e:
        print(f"Ocurrió un error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    cargar_datos_masivos()