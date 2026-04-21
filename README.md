# 🎮 Apalabrados - Scrabble en Español Online

Un juego de Scrabble multijugador en línea, completamente en español, con todas las reglas oficiales.

## Características

✅ **Multijugador en línea** - 2-4 jugadores en tiempo real con WebSockets  
✅ **Diccionario español** - Validación de palabras en español (~80k palabras)  
✅ **Todas las reglas** - Multiplicadores (DL/TL/DP/TP), comodín, intercambio, pases  
✅ **Optimizado para móvil** - Interfaz responsive y táctil  
✅ **Chat integrado** - Comunicación entre jugadores  
✅ **Sin autenticación** - Juega con apodos anónimos  

## Requisitos

- Node.js 16+
- npm

## Instalación

```bash
# Clonar o descargar el proyecto
cd apalabrados

# Instalar dependencias (raíz + server + client)
npm install
npm --prefix server install
npm --prefix client install
```

## Desarrollo

```bash
# Ejecutar servidor y cliente en paralelo
npm run dev

# O por separado:
# Terminal 1
npm --prefix server run dev

# Terminal 2
npm --prefix client run dev
```

El servidor estará disponible en `http://localhost:3001`  
El cliente estará disponible en `http://localhost:5173`

## Arquitectura

### Backend (Node.js + Express + Socket.io)

- **GameManager**: Gestiona todas las salas activas
- **GameRoom**: Estado de cada partida (jugadores, tablero, fichas, historial)
- **GameEngine**: Lógica pura (validación de jugadas, extracción de palabras)
- **Board**: Modelo del tablero 15x15 con multiplicadores
- **TileBag**: Bolsa de fichas y distribución
- **Dictionary**: Validación de palabras en español

### Frontend (React + Vite + Socket.io-client)

- **Pages**: HomePage, LobbyPage, GamePage, ResultsPage
- **Components**: Board, Rack, Scoreboard, Chat, GameControls
- **Stores**: Zustand (gameStore, roomStore)
- **Socket**: Cliente Socket.io con reconexión automática

## Flujo de Juego

1. **Inicio**: Crear o unirse a una sala con código
2. **Lobby**: Esperar a que se unan otros jugadores (mínimo 2)
3. **Partida**: 
   - Colocar fichas en el tablero (drag & drop)
   - Confirmar jugada (validación en servidor)
   - Pasar turno o intercambiar fichas
   - Ganar puntos con multiplicadores
4. **Fin**: Cuando se acaban las fichas o nadie puede jugar

## Tablero

- **15x15 celdas** con multiplicadores:
  - **TP** (Triple Palabra): +3x puntos de palabra
  - **DP** (Doble Palabra): +2x puntos de palabra
  - **TL** (Triple Letra): +3x puntos de letra
  - **DL** (Doble Letra): +2x puntos de letra

## Fichas Españolas

Total: 100 fichas

- Vocales: A(12), E(12), O(9), I(6), U(5)
- Consonantes comunes: S(6), N(5), R(5), L(4), T(4), D(5)
- Consonantes especiales: CH(1), LL(1), RR(1), Ñ(1)
- Comodín: *(2)

## Reglas Implementadas

- ✓ Primera jugada debe pasar por el centro (7,7)
- ✓ Las fichas deben formar palabras válidas
- ✓ Las fichas nuevas deben conectar con fichas existentes
- ✓ Multiplicadores solo aplican a fichas nuevas
- ✓ Bonus de 50 puntos por usar las 7 fichas (bingo)
- ✓ Intercambio de fichas (si hay ≥7 en la bolsa)
- ✓ Pasar turno
- ✓ Fin de juego por bolsa vacía o pases consecutivos
- ✓ Penalizaciones: restar valor de fichas restantes

## Base de Datos

El proyecto **no usa base de datos**. El estado del juego se mantiene en memoria en el servidor. Las salas se limpian automáticamente después de 4 horas de inactividad.

## Diccionario

El diccionario español se carga del archivo `server/data/dictionary_es.json`. Para ampliar el diccionario con más palabras:

```bash
# Script de conversión desde hunspell dictionary
node scripts/convert-dictionary.js
```

Fuente recomendada: [wooorm/dictionaries](https://github.com/wooorm/dictionaries) - descargar `es/index.dic`

## Eventos Socket.io

### Sala
- `room:create` - Crear sala nueva
- `room:join` - Unirse a sala existente
- `room:start` - Iniciar partida (solo anfitrión)
- `room:reconnect` - Reconectarse a sala

### Juego
- `game:play` - Jugar fichas
- `game:pass` - Pasar turno
- `game:exchange` - Intercambiar fichas
- `game:resign` - Rendirse

### Chat
- `chat:message` - Enviar mensaje

## Limpiaciones / Conocidos

- El diccionario es pequeño (test), ampliar con fuente oficial
- Drag & drop básico (sin animaciones complejas aún)
- Sin persistencia de partidas (entre sesiones se pierden)
- Sin estadísticas de jugador

## Desarrollo Futuro

- [ ] Persistencia en base de datos (PostgreSQL/MongoDB)
- [ ] Autenticación y perfiles de usuario
- [ ] Historial de partidas
- [ ] Ranking global
- [ ] Undo/Redo de jugadas
- [ ] Animaciones y efectos visuales
- [ ] Tema oscuro
- [ ] Notificaciones de turnos
- [ ] Reconexión automática mejorada

## Licencia

MIT

## Contacto

Para reportar bugs o sugerencias, abre un issue en el repositorio.
