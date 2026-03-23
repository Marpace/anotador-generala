# Generala Scorer

Anotador de puntos para el juego de dados Generala. Soporta hasta **12 jugadores**.

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **SASS** (CSS Modules)
- Sin backend — todo el estado se guarda en `localStorage`

## Desarrollo local

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Deploy en Vercel

1. Subir el repositorio a GitHub
2. Importar el proyecto en [vercel.com](https://vercel.com)
3. Vercel detecta Next.js automáticamente — hacer clic en **Deploy**

## Categorías del juego

| Categoría       | Puntaje máximo |
|-----------------|----------------|
| Unos            | 5              |
| Doses           | 10             |
| Treses          | 15             |
| Cuatros         | 20             |
| Cincos          | 25             |
| Seises          | 30             |
| Escalera        | 20             |
| Full            | 30             |
| Póker           | 40             |
| Generala        | 50             |
| Generala Doble  | 100            |

## Estructura del proyecto

```
src/
├── app/
│   ├── layout.tsx       # Root layout + metadata
│   ├── page.tsx         # Entry point
│   └── page.module.scss
├── components/
│   ├── SetupScreen.tsx  # Pantalla de configuración de jugadores
│   ├── ScoreBoard.tsx   # Tabla de puntajes principal
│   └── ScoreModal.tsx   # Modal para ingresar puntajes
├── hooks/
│   └── useGameState.ts  # Estado del juego + localStorage
├── styles/
│   ├── globals.scss
│   ├── _variables.scss
│   └── _mixins.scss
├── types/
│   └── game.ts          # Tipos + categorías + opciones de puntaje
└── utils/
    └── game.ts          # Funciones de cálculo
```
