# Possumus Trivia

Aplicación de trivia desarrollada como ejercicio técnico (kata) para una entrevista en **Possumus**. Permite configurar una sesión de trivia eligiendo temática y dificultad, responder 5 preguntas de opción múltiple obtenidas de la API pública [Open Trivia DB](https://opentdb.com/), y ver el puntaje final con opción de reiniciar o volver al inicio.

---

## Stack

| Tecnología | Rol |
|---|---|
| [Next.js 16](https://nextjs.org/) | Framework full-stack (App Router) |
| [React 19](https://react.dev/) | UI |
| [TypeScript](https://www.typescriptlang.org/) | Tipado estático |
| [Tailwind CSS v4](https://tailwindcss.com/) | Estilos |
| [shadcn/ui](https://ui.shadcn.com/) + [Base UI](https://base-ui.com/) | Componentes accesibles |
| [Embla Carousel](https://www.embla-carousel.com/) | Carrusel de categorías |
| [Lucide React](https://lucide.dev/) | Iconos de categorías |
| [GSAP](https://gsap.com/) + [React Bits](https://reactbits.dev/) | Animaciones de texto y fondo |
| [he](https://github.com/mathiasbynens/he) | Decodificación de HTML entities |
| [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/) | Tests unitarios |
| [Playwright](https://playwright.dev/) | Tests end-to-end |

---

## Arquitectura

### Pantallas y rutas

```
/                          →  SetupPage    (selección de categoría y dificultad)
/game/[sessionId]          →  GamePage     (flujo de preguntas)
/game/[sessionId]/result   →  ResultPage   (puntaje y revisión)
```

El `sessionId` es el token de sesión de OpenTDB, lo que garantiza que no se repitan preguntas dentro de la misma sesión.

### Flujo de datos

```
SetupPage (Server Component)
  └── fetchCategories() → renderiza CategoryCarousel + SetupForm
        └── submit → startGame() (Server Action)
              └── fetchSession() → redirect /game/[token]?categoryId=X&difficulty=Y

GamePage (Server Component)
  └── fetchQuestions(sessionId, config)
        └── <GameClient questions={...} /> (Client Component)
              └── al terminar → persiste resultado en sessionStorage
                    └── redirect /game/[sessionId]/result

ResultPage (Server Component)
  └── <ResultClient sessionId={...} /> (Client Component)
        └── lee resultado desde sessionStorage
```

### Estructura del proyecto

```
possumus-trivia/
├── app/
│   ├── page.tsx                      # Setup page
│   ├── actions.ts                    # Server Action: startGame()
│   ├── layout.tsx                    # Layout global (metadata, fuentes, fondo)
│   ├── api/
│   │   └── mock-opentdb/[...slug]/   # Mock API para tests E2E
│   └── game/
│       └── [sessionId]/
│           ├── page.tsx              # Game page
│           └── result/
│               └── page.tsx          # Result page
├── components/
│   ├── category-carousel.tsx         # Carrusel interactivo de categorías
│   ├── setup-form.tsx                # Formulario de configuración
│   ├── game-client.tsx               # Lógica de juego (client)
│   ├── result-client.tsx             # Pantalla de resultados (client)
│   └── ui/                           # Componentes base (shadcn/ui)
├── lib/
│   ├── opentdb.ts                    # Cliente de la API OpenTDB
│   ├── mappers.ts                    # Transformación de datos de la API
│   ├── trivia-config.ts              # Validación de configuración
│   ├── category-icons.ts             # Metadatos de categorías (ícono, imagen)
│   └── game-result-storage.ts        # Persistencia de resultados (sessionStorage)
├── types/
│   └── trivia.ts                     # Tipos e interfaces del dominio
└── tests/
    ├── vitest/                        # Tests unitarios
    └── playwright/                    # Tests E2E
```

---

## Decisiones de diseño

**Server Components por defecto.** El fetch de categorías y preguntas ocurre en el servidor. Solo se usa `"use client"` donde hay interactividad real (carrusel, lógica de juego, lectura de sessionStorage).

**Server Action para iniciar el juego.** El formulario de setup usa un Server Action (`startGame`) en lugar de un handler cliente. Esto permite que el flujo funcione sin JavaScript activo (progressive enhancement) y mantiene la lógica de creación de sesión fuera del bundle.

**Token de OpenTDB como ID de sesión.** Usar el token directamente como segmento de ruta evita crear un ID propio y aprovecha el mecanismo anti-repetición de la API.

**`he` para HTML entities.** OpenTDB devuelve texto con entidades HTML (`&#039;`, `&eacute;`, etc.). Se usa `he` en lugar de una regex casera para garantizar cobertura completa.

**Mock de API para tests E2E.** Los Server Actions y `fetch()` del servidor no pueden ser interceptados por `page.route()` de Playwright (que solo opera en el browser). La solución es una variable de entorno `OPENTDB_BASE_URL` que en modo test apunta a una ruta interna (`/api/mock-opentdb`), haciendo los tests deterministas sin depender de la API real.

**Inglés en la UI.** Las preguntas de OpenTDB están en inglés. Usar el mismo idioma en botones y etiquetas evita mezclar idiomas en la misma pantalla.

**Imágenes AVIF.** Las imágenes de categorías (generadas con IA) fueron comprimidas a formato AVIF con [Squoosh](https://squoosh.app/) para reducir peso y mejorar los Core Web Vitals.

---

## Casos de aceptación cubiertos

| # | Descripción | Estado |
|---|---|---|
| 1 | La pantalla principal se muestra al iniciar | ✅ |
| 2 | Se puede seleccionar temática | ✅ |
| 3 | Se puede seleccionar dificultad | ✅ |
| 4 | Todas las preguntas son de opción múltiple | ✅ |
| 5 | La trivia tiene 5 preguntas fijas | ✅ |
| 6 | Encoding por default (HTML entities decodificadas con `he`) | ✅ |
| 7 | Botón "Play!" para comenzar | ✅ |
| 8 | Pantalla de juego con pregunta y opciones como botones | ✅ |
| 9 | Respuesta correcta → botón verde | ✅ |
| 10 | Respuesta incorrecta → botón rojo + correcta en verde | ✅ |
| 11 | 20 puntos por respuesta correcta | ✅ |
| 12 | Al terminar: pantalla de resultado con puntaje, "Restart" y "Exit" | ✅ |

---

## Instalación y uso

### Requisitos

- Node.js 20+
- npm

### Instalación

```bash
git clone https://github.com/<tu-usuario>/possumus-trivia.git
cd possumus-trivia
npm install
```

### Desarrollo

```bash
npm run dev
```

La app estará disponible en [http://localhost:3000](http://localhost:3000).

### Build de producción

```bash
npm run build
npm run start
```

---

## Tests

### Tests unitarios (Vitest + React Testing Library)

```bash
npm run test        # modo watch
npm run test:run    # una sola ejecución
```

Cubren: cliente de API, mappers, validación de configuración, y componentes de UI (carrusel, formulario, cliente de juego, pantalla de resultados).

### Tests end-to-end (Playwright)

```bash
npm run test:e2e
```

El servidor de test se levanta automáticamente con `npm run dev:test`, que activa `OPENTDB_BASE_URL=http://localhost:3001/api/mock-opentdb` para que todos los fetches del servidor apunten al mock interno en lugar de a OpenTDB. Esto garantiza tests deterministas independientemente del estado de la API externa.

---

## API utilizada

[Open Trivia Database](https://opentdb.com/) — API pública y gratuita de preguntas de trivia.

| Endpoint | Uso |
|---|---|
| `GET /api_token.php?command=request` | Obtiene token de sesión |
| `GET /api_category.php` | Lista todas las categorías |
| `GET /api.php?amount=5&category=X&difficulty=Y&type=multiple&token=Z` | Obtiene las 5 preguntas |
