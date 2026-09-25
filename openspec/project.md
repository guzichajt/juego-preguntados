# Declaración del proyecto

## Qué es este sistema

Aplicación web de juego de preguntas para dos personas que juegan por turnos en el mismo dispositivo. Debe conservar la ruleta clásica y sus mecánicas completas, con una identidad visual propia, y obtener cada pregunta desde una API FastAPI local conectada a PostgreSQL. La prioridad funcional es que la ruleta, los turnos, el tablero y la puntuación se comporten de forma clara y coherente durante toda la partida.

## Alcance del primer ciclo

Incluye:

- Una interfaz web construida con React, JavaScript y Vite.
- Dos jugadores locales por turnos, sin sincronización entre dispositivos.
- Una ruleta clásica, tablero, importes, bonificaciones, quiebra y fin de partida.
- Una pregunta obtenida desde FastAPI cuando la partida necesite una.
- Validación de respuestas y puntuación solo en el cliente.
- Estados visibles de carga, error, respuesta correcta, respuesta incorrecta y fin de partida.

No incluye:

- Modificar FastAPI, su modelo de datos o PostgreSQL.
- Cuentas, autenticación, perfiles o progreso sincronizado.
- Multijugador por Internet.
- Administración o edición de preguntas desde el juego.
- Aplicaciones móviles nativas, monetización ni publicidad.

## Actores y modalidad

- **Jugador 1 y Jugador 2:** comparten el mismo navegador y se turnan para interactuar.
- **Cliente web:** conserva el estado completo de la partida y coordina la ruleta, el tablero, las preguntas y la puntuación.
- **FastAPI:** sistema externo que entrega preguntas; no coordina la partida.
- **PostgreSQL:** propiedad exclusiva de FastAPI. El navegador nunca se conecta directamente a la base de datos.

No hay una autoridad de partida remota: recargar o abandonar la página afecta únicamente al estado local de esa partida. La política de persistencia entre recargas permanece abierta.

## Reglas e invariantes del juego

La experiencia debe ser fiel a una ruleta clásica completa, pero la distribución exacta de casillas, importes, bonificaciones y categorías todavía debe definirse.

Invariantes ya decididos:

- Solo un jugador está activo en cada momento.
- Los turnos se alternan según las reglas de la partida.
- La ruleta no puede volver a girarse mientras una animación está en curso.
- Una respuesta queda bloqueada después de que el jugador confirme o revele su opción.
- Una respuesta se puntúa una sola vez.
- Animación, resultado de la ruleta, pregunta y puntuación deben permanecer sincronizados.
- Un error recuperable de la API no puede convertir por sí solo una respuesta incorrecta en correcta ni alterar el marcador.
- La partida debe siempre alcanzar un estado final inequívoco, incluso si hay empate, quiebra o puntuación cero.

Las reglas pendientes se detallan en la sección **Preguntas abiertas**.

## Flujo principal de usuario

1. Abrir el juego en el navegador.
2. Configurar los dos jugadores.
3. Iniciar la partida.
4. Iniciar el turno del jugador activo.
5. Girar la ruleta o interactuar con el tablero según las reglas clásicas seleccionadas.
6. Obtener la pregunta necesaria desde la API.
7. Responder y ver el resultado.
8. Actualizar la puntuación y el estado del turno.
9. Continuar hasta el final de la partida.
10. Mostrar el resultado final y permitir comenzar otra partida.

La posición exacta de la pregunta dentro de este flujo —inmediatamente después de girar, al elegir una casilla o según otra mecánica— es una decisión de producto pendiente.

## Runtime y lenguaje

| | |
|---|---|
| Lenguaje | JavaScript moderno con JSX; sin TypeScript |
| Runtime | Node.js `>=20.19`; la versión concreta debe quedar fijada en `package.json` |
| Versiones de dependencias | `package.json` y `package-lock.json` |
| Instalación reproducible | `npm ci` |
| Un comando para compilar | `npm run build` |
| Un comando para probar | `npm test` |
| Un comando para lint y formato | `npm run lint` |
| Un comando para type-check | No aplica mientras el proyecto use JavaScript |
| Cobertura mínima | 80% global y al menos 80% en la lógica de juego y el cliente de API modificados |

Estos scripts son parte del contrato del proyecto y deben existir en el scaffold, aunque todavía no se haya creado el paquete de la aplicación.

## Frameworks y bibliotecas

- **Frontend web:** React y Vite.
- **Integración HTTP:** API `fetch` del navegador, encapsulada en un cliente de preguntas.
- **Estado:** primitivas de React; un reducer o máquina de estados debe concentrar las transiciones de la partida.
- **Estilos:** CSS con custom properties para la paleta; no está aprobado ningún framework de estilos.
- **Backend de preguntas:** FastAPI en `http://localhost:8000`, fuera del alcance de implementación del frontend.
- **Persistencia de preguntas:** PostgreSQL, propiedad de FastAPI y accesible únicamente a través de su API.
- **Testing:** el runner, la librería de componentes y la herramienta E2E deben elegirse antes del scaffold. El contrato de comandos y cobertura de esta tabla no cambia con esa elección.
- **Trabajo en segundo plano:** no hay procesos, colas ni tareas periódicas declaradas para el frontend.

No se autoriza agregar una biblioteca de estado, animación, enrutado, estilos o HTTP sin actualizar este documento y registrar la excepción correspondiente.

## Almacenamiento de datos

| Almacén | Contiene | Accede a él | Migraciones |
|---|---|---|---|
| Estado local del navegador | Estado de la sesión de juego; la persistencia sigue pendiente | Aplicación React | No aplica |
| PostgreSQL | Preguntas administradas por el sistema externo | FastAPI | Fuera del alcance del frontend; herramienta y comando pendientes |

La aplicación no abre conexiones a PostgreSQL, no conoce su esquema y no recibe credenciales de base de datos. Las pruebas que necesiten datos reales deben obtenerlos mediante FastAPI y una base sembrada según el procedimiento que se documente para el backend.

## Fronteras del sistema

| Componente | Es dueño de | Habla con | Sobre |
|---|---|---|---|
| Aplicación React | Estado local, interfaz, ruleta, tablero, turnos y puntuación | FastAPI por HTTP | Eventos de usuario y solicitudes REST |
| FastAPI | Validación de solicitudes, acceso a preguntas y traducción de errores | PostgreSQL | Contrato `/question/<id>` |
| PostgreSQL | Persistencia de preguntas | FastAPI | Acceso interno de la base de datos |

La UI no conoce SQL, credenciales de PostgreSQL ni detalles del modelo de datos. El cliente HTTP no conoce reglas de puntuación. Las reglas de juego no construyen URLs ni interpretan errores de red.

## Configuración

| Variable | Valor inicial | Naturaleza |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8000` | Configuración pública del navegador; no es un secreto |

Cualquier valor `VITE_*` queda expuesto al bundle del navegador. Nunca debe contener una clave privada, token o credencial de base de datos.

La aplicación usa `localhost:8000` únicamente para ejecución local. Si se publica fuera del equipo de desarrollo, deberá definirse una URL de API accesible para los clientes y configurarse CORS o un proxy explícitamente. La topología de producción aún no está decidida.

## Contrato de la API de preguntas

### Solicitud conocida

```http
GET http://localhost:8000/question/<id>
Accept: application/json
```

El frontend solicita una pregunta cada vez que la necesita y consume la respuesta como datos no confiables.

### Respuesta `200`

Ejemplo proporcionado por la persona responsable del proyecto:

```json
{
  "id": 1,
  "pregunta": "¿Cuánto es 2 + 2?",
  "opciones": ["3", "4", "5", "6"],
  "correcta": "4",
  "categoria": "Matemáticas"
}
```

Todos los campos del ejemplo son obligatorios para este cliente, incluido `correcta`.

### Error `404`

```json
{
  "detail": "Pregunta no encontrada"
}
```

### Validación en la frontera

Antes de incorporar una respuesta al estado del juego, el frontend debe comprobar que:

- El cuerpo es un objeto JSON.
- `id` es un entero positivo.
- `pregunta` es texto no vacío.
- `opciones` contiene al menos dos textos no vacíos y distintos.
- `correcta` coincide exactamente con una de las opciones.
- `categoria` es texto no vacío.

Una respuesta que no cumpla el contrato se trata como error de integración, no como una pregunta válida. Los errores `404`, validación inválida, JSON inválido, timeout y fallo de red deben llegar a estados distinguibles para la UI y permitir reintentar o continuar según las reglas de partida que se definan.

El frontend no debe registrar la respuesta correcta ni otros datos que puedan filtrar respuestas en logs de diagnóstico.

### Obtención de IDs

Las preguntas se seleccionan desde PostgreSQL mediante la API, según una fuente aleatoria o secuencial, pero todavía no existe un endpoint documentado para descubrir IDs ni para recibir una pregunta aleatoria.

Por tanto, antes de implementar la selección de preguntas se debe confirmar uno de estos contratos:

- Un endpoint que devuelva un ID o una pregunta aleatoria.
- Un endpoint que devuelva una lista o cursor paginado de IDs.
- Una regla de secuencia segura y explícita.

El frontend no debe inventar IDs incrementales ni asumir que son consecutivos solo porque la base actualmente tenga esa forma.

## Identidad y autorización

- No se ha declarado autenticación ni autorización en el MVP local.
- No hay dos identidades de jugador en el backend; son únicamente etiquetas locales.
- No se implementan permisos, sesiones, auditoría de acceso ni recuperación de cuentas.
- Cualquier acceso a la API distinto del supuesto local debe documentar autenticación, autorización y CORS antes de implementarse.

## Secretos

- El frontend no necesita secretos.
- Las credenciales de PostgreSQL pertenecen al proceso FastAPI y se obtienen mediante su configuración de entorno o gestor de secretos.
- Ninguna credencial puede aparecer en React, variables `VITE_*`, código, logs, errores, datos de prueba, manifiestos o artefactos.
- El bundle del navegador puede mostrar `VITE_API_BASE_URL`; no puede mostrar secretos de servidor.

## Despliegue

- **Objetivo inicial confirmado:** ejecución local en desarrollo.
- **Artefacto de la aplicación:** bundle estático producido por `npm run build`.
- **Objetivo de producción:** pendiente; no se presupone Vercel, Netlify, contenedores ni servidor propio.
- **Pipeline, firma e infraestructura como código:** pendientes junto con la decisión de producción.
- **Rollback:** cuando exista despliegue, debe restaurarse el artefacto estático anterior sin recompilar.
- **Acceso a FastAPI y PostgreSQL:** infraestructura externa; este proyecto no provisiona ni despliega esos componentes.

## Observabilidad

- Los fallos de integración deben registrar contexto mínimo: evento, ID solicitado, estado HTTP o categoría de error y duración.
- No se registran la respuesta correcta, la respuesta seleccionada ni secretos.
- Las trazas internas se muestran solo en desarrollo; la UI recibe mensajes aptos para personas usuarias.
- No hay métricas, trazas distribuidas ni identificadores de correlación declarados. La API no expone un contrato para añadirlos y no deben inventarse.
- El estado de partida debe poder reiniciarse de forma limpia después de un error recuperable.

## Dirección visual y accesibilidad

- Estética clásica de ruleta, con diseño original y sin copiar marca, logotipo, locución ni recursos de terceros.
- La paleta completa se declara mediante tokens CSS para mantener coherencia entre ruleta, tablero, botones, estados y diseño adaptable.
- El significado nunca depende únicamente del color; las casillas y respuestas también necesitan texto, símbolo o patrón.
- Objetivo mínimo WCAG 2.1 AA para contraste, navegación por teclado, foco visible, nombres accesibles y reducción de movimiento.
- Las animaciones de la ruleta deben respetar `prefers-reduced-motion` y conservar un resultado final inequívoco.
- La interfaz debe adaptarse a escritorio y tablet sin perder controles ni información.
- Los estados de carga, vacío, error, correcto, incorrecto, quiebra y fin de partida deben tener contenido y tratamiento visual propio.
- No hay imágenes, tipografías, iconos ni sonidos aprobados todavía.

## Convenciones del proyecto

- Código JavaScript modular con ES Modules, JSX y componentes funcionales de React.
- El estado de partida se actualiza de forma inmutable mediante acciones y transiciones explícitas; no se mutan directamente puntajes, turnos ni casillas.
- La selección aleatoria, el tiempo, el cliente HTTP y el reloj deben ser dependencias controlables para que las pruebas sean deterministas.
- La configuración se carga una vez en el borde de la aplicación y no se lee mediante `import.meta.env` en medio de reglas de negocio.
- Los componentes gestionan presentación e interacción; las reglas de juego, puntuación y validación viven en módulos sin dependencias del DOM.
- El cliente de preguntas es el único módulo que conoce la URL y la forma de la API.
- Los errores se traducen en el límite hacia mensajes y categorías que la UI pueda tratar sin filtrar información interna.
- Se prefieren funciones y componentes pequeños, nombres explícitos y módulos agrupados por función.
- No se incluyen identificadores de cambios, referencias al workflow ni historial en comentarios del código.
- Los commits siguen `<type>: <descripción>` con los tipos `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf` y `ci`.

### Organización mínima prevista

```text
src/
  components/          # Componentes visuales reutilizables
  features/game/       # Estado, reglas, componentes y pruebas de la partida
  services/questions/  # Cliente HTTP y validación del contrato de preguntas
  config/              # Configuración de runtime
  test/                # Utilidades compartidas de pruebas
```

La estructura final se puede ajustar sin cambiar las fronteras ni introducir dependencias no declaradas.

## Estrategia de pruebas

- **Unitarias:** geometría y resultado de la ruleta, transiciones, turnos, puntuación, quiebra, desempate y validación de respuestas.
- **De componentes:** cada estado visual, controles bloqueados durante animaciones, teclado, foco y reducción de movimiento.
- **De contrato e integración del cliente:** `200`, `404`, JSON inválido, esquema inválido, timeout y fallo de red.
- **End-to-end:** inicio de partida, turnos, respuesta correcta e incorrecta, quiebra, final y reinicio con una API determinista.
- Las pruebas reales de FastAPI y PostgreSQL deben usar una base sembrada y credenciales con la misma forma que en producción. Su ausencia no puede convertirse en una omisión silenciosa.
- Las mutaciones o cambios deliberados que deberían romper una prueba deben demostrarse en rojo durante la implementación.
- La cobertura se mide sobre el código modificado y el conjunto completo; perseguir porcentaje sin aserciones significativas no cumple el estándar.

## Desvíos registrados

Ninguno. Cualquier framework, servicio, datastore, protocolo o destino de despliegue fuera de esta declaración requiere aprobación humana y un ADR.

## Preguntas abiertas

### Bloqueantes para implementar la selección de preguntas

1. ¿Cuál es el endpoint exacto que entrega IDs aleatorios, un listado o la siguiente pregunta?
2. ¿Cuál es su esquema de respuesta y cómo se comporta cuando no quedan preguntas?
3. ¿La API entrega alguna paginación, total o criterio para evitar preguntas repetidas?

### Bloqueantes para especificar la partida completa

4. ¿Cuál es la distribución exacta de la ruleta y el tablero, incluidos importes, categorías y bonificaciones?
5. ¿Cómo se integra una pregunta de opción múltiple con la mecánica clásica? ¿Se responde después de cada giro, al elegir una vocal o solo cuando el jugador completa una palabra?
6. ¿Qué ocurre al fallar: se pierde el turno, el importe, se重返 a la casilla o se aplica otra regla?
7. ¿Cuántas rondas tiene una partida, cómo se desempata y cuándo una puntuación es ganadora?
8. ¿Las preguntas pueden repetirse dentro o entre partidas?
9. ¿El estado debe sobrevivir a una recarga de la página?

### Pendientes de producto y operación

10. ¿Habrá nombres configurables, límite de tiempo, sonido o animaciones sonoras?
11. ¿Cuál es la paleta, tipografía y dirección artística exactas del diseño original clásico?
12. ¿La aplicación se pondrá en producción? Si es así, ¿dónde se alojará y cómo se configurará CORS?
13. ¿Qué tiempo máximo debe esperar el cliente antes de cancelar una solicitud a FastAPI?
14. ¿Qué herramientas se usarán para pruebas unitarias y de componentes, cobertura y pruebas end-to-end?
15. ¿La API requiere autenticación cuando deje de ser local?

## Estado de preparación

La visión, el stack principal, la modalidad local y el contrato de `GET /question/<id>` están documentados. La implementación de la selección de preguntas y la especificación completa de la partida no deben comenzar hasta resolver las preguntas bloqueantes 1–9.
