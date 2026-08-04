# Aprende Flauta

🔗 **[jondscode.github.io/aprende-flauta](https://jondscode.github.io/aprende-flauta/)**

App web para aprender **flauta dulce soprano** (digitación barroca o alemana), **fife Yamaha YRF-21** y **flauta traversa** (sistema Boehm), con repertorio de dominio público graduado por dificultad.

Cada canción se muestra en **pentagrama + flauto-tab**: una columna de símbolos bajo cada nota (● tapado · ○ abierto · ◐ pulgar a medio agujero), la convención estándar de los charts de viento. Detalles visuales: el pulgar va desplazado a la izquierda (queda detrás del tubo) igual que el último agujero (lateral, cerca de la salida); los agujeros dobles se dibujan como dos puntos dentro de un círculo grande (se tapan con un solo dedo); y la traversa dibuja sus llaves con forma real (palanca de pulgar, anillos abiertos, palancas Sol#/Mi♭ y pastillas del pie) en vez de números. Al reproducir, el cursor resalta la nota y su digitación en grande.

## Uso

```
npm install
npm run dev      # http://localhost:5173
npm run build    # build estática en dist/
```

## Estructura

- `src/data/fingerings/` — tablas midi (altura escrita) → digitación por instrumento. Fuentes: Dolmetsch + American Recorder Society (dulce, doble verificación), Woodwind Fingering Guide (traversa), chart oficial Yamaha (fife, `fife-flute.PNG`).
- `src/data/songs/` — canciones en notación ABC (una por archivo) + `index.ts` con metadatos y niveles.
- `src/lib/flautoTab.ts` — dibuja la tab dentro del SVG de abcjs usando `noteTimings` (requiere `visual.setUpAudio()` previo para que los eventos traigan `midiPitches`).
- `src/components/` — `SheetMusic` (pentagrama + playback + cursor), `FingeringDiagram`, `Explorer` (chart interactivo), `SongList`.

## Convenciones

- Los midi de datos y canciones son siempre **altura escrita**; dulce y fife suenan una octava arriba (`soundingOffset: 12`, aplicado solo al audio).
- La misma canción sirve para los tres instrumentos sin transposición: la traversa la toca una octava real por debajo del sonido de la dulce, como es lo natural.
- Digitaciones con `verified: false` están pendientes de contrastar con la fuente canónica (segunda octava de la fife → `fife-flute.PNG`).

## Estado (ver PLAN.md)

- ✅ F0 esqueleto · F1 MVP · F2 fife verificada contra el chart oficial · F3 repertorio (15 canciones, niveles 1–6)
- ✅ Curso (pentagrama + figuras), explorador por octavas con mini-pentagrama, esquema anatómico bilingüe
- ✅ Progreso persistido (canciones aprendidas por nivel, en localStorage)
- ✅ **PWA**: instalable y 100% offline (`vite-plugin-pwa`); los soundfonts del CDN se cachean en runtime
- ⏳ Repertorio hacia ~50 canciones · rediseño a fondo de la traversa · F4 feedback por micrófono (pitchy)

### PWA / instalación

`npm run build` genera `dist/` con `manifest.webmanifest` y `sw.js`. Sírvelo por HTTPS (o `localhost`)
para que el service worker registre y la app sea instalable ("Añadir a pantalla de inicio"). El primer
uso online cachea todo (app + canciones + soundfonts); a partir de ahí funciona sin conexión.

### Despliegue en GitHub Pages

El workflow `.github/workflows/deploy.yml` construye y publica automáticamente en cada push a `main`.
Como Pages sirve el sitio bajo `/<repo>/`, el build pasa `BASE_PATH=/<repo>/` (`vite.config.ts` lo lee
vía `process.env.BASE_PATH`) y el manifest usa rutas relativas (`start_url: '.'`) para funcionar igual
en local y bajo el subpath. Para desplegar a mano: `BASE_PATH=/aprende-flauta/ npm run build` y sube `dist/`.
