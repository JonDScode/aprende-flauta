# Plan: App para aprender flauta (dulce, fife, traversa)

> Resultado de la investigación del 2026-07-23. Tres frentes investigados en paralelo:
> digitaciones de los 3 instrumentos, tecnología de notación web, y repertorio pedagógico graduado.

## 1. Visión del producto

App web **estática, sin backend** (corre local o en GitHub Pages) para aprender tres instrumentos:

| Instrumento | Afinación | Digitación | Rol pedagógico |
|---|---|---|---|
| Flauta dulce soprano | Do (C5–D7) | **Barroca** y **Alemana** (toggle) | Punto de entrada: lectura + dedos |
| Fife Yamaha YRF-21 | Do (C5–E7) | Tipo **alemana**, 8 agujeros sin llaves | Puente: dedos de la dulce + embocadura de traversa |
| Flauta traversa (Boehm) | Do (C4–D6 estudiante) | Llaves Boehm | Meta final |

Cada canción se muestra en **pentagrama + "flauto-tab"**: columna vertical de círculos debajo de cada nota (● tapado, ○ abierto, ◐ medio pulgar), la convención universal de charts de viento — es la misma notación del chart oficial de Yamaha que tenemos en `fife-flute.PNG`.

### Hallazgos clave de la investigación

1. **"Dos versiones según afinación" de la dulce** → son en realidad dos cosas distintas:
   - **Barroca vs. Alemana**: misma flauta, difiere solo la digitación de Fa (barroca = horquilla `0123 4·67`; alemana = secuencial `01234`). Se distinguen por el tamaño relativo de los agujeros 4 y 5, o la letra B/G grabada. Yamaha y Moeck recomiendan **aprender barroca** (la alemana desafina las alteraciones). La app soporta ambas con un toggle — solo cambian Fa y derivados.
   - **Soprano (Do) vs. Alto (Fa)**: instrumentos distintos con el mismo patrón de dedos. Fase 2 si interesa.
2. **La fife YRF-21 usa digitación tipo alemana** (verificado en distribuidores + reseñas). Comparte casi todo el mapa de dedos con la dulce alemana (incluido el medio pulgar para la 2ª octava) y comparte con la traversa la embocadura y postura. Es exactamente el puente pedagógico intermedio.
3. **Regla de oro de la dulce**: E6–B6 repiten los dedos de E5–B5 con pulgar pellizcado (ø) — vale la pena enseñarla explícitamente en la app.
4. **Regla de oro de la traversa**: E5–C6 repiten exactamente la digitación de E4–C5, solo cambia el aire (excepciones: D5/Eb5 levantan el índice izquierdo). Error típico de principiante: F#4 va con el **anular** derecho, no el índice.
5. **Progresión pedagógica estándar** (dulce y método Wye de traversa coinciden): empezar con **Si–La–Sol (B-A-G)**, solo mano izquierda. Luego mano derecha (Mi, Re), luego agudos (Do', Re'), luego Fa#, luego Do grave/Fa, y al final el registro agudo con medio pulgar. Modelo de referencia: Recorder Karate (9 cinturones) — **variar una sola dimensión de dificultad por nivel**.

## 2. Stack técnico

| Capa | Elección | Por qué |
|---|---|---|
| Framework | **Vite + React + TypeScript** | Build estática, DX en Windows, familiaridad fullstack |
| Notación | **abcjs 6.x** (MIT) | Renderiza ABC a SVG, synth integrado, cursor de reproducción, `TimingCallbacks` da la coordenada x + pitch de cada nota → alineamos la flauto-tab al píxel. Transposición con `visualTranspose`/`strTranspose` |
| Flauto-tab | **Componente propio (~200 líneas SVG)** | abcjs solo trae tablatura de cuerdas. Iteramos las notas del render, consultamos tabla `midi → digitación` del instrumento activo y pintamos la columna de círculos debajo |
| Formato canciones | **ABC como fuente única** + `songs.json` de metadatos (título, nivel, notas nuevas, transposición por instrumento) | Una canción = ~5 líneas de texto; miles de melodías folk ya existen en ABC; transposición automática por instrumento |
| Digitaciones | JSON estático por instrumento: `layout` de elementos (agujeros/llaves) + mapa `midi → estado {c, o, h}` | Esquema unificado para agujeros simples, dobles (6/7 de la dulce), pulgar medio (ø) y llaves Boehm. Diseñado en la investigación (ver §5 del informe de digitaciones) |
| Audio | Synth de abcjs + soundfonts **gleitz/midi-js-soundfonts** (GM 73 flute / 74 recorder), descargados a `public/soundfonts/` para offline | Gratis, licencia libre, cero configuración |
| Fase 2: feedback por micrófono | `getUserMedia` + **pitchy** (algoritmo MPM) comparando contra la nota esperada del timing callback | Las flautas son el caso fácil de detección de pitch (tono casi sinusoidal). Requiere servir por localhost/HTTPS, no `file://` |

Riesgo principal identificado: la alineación de la flauto-tab depende de coordenadas del SVG de abcjs con `responsive: "resize"` → recalcular en cada resize/re-render desde el día 1.

## 3. Modelo de datos

```
src/data/
  fingerings/
    recorder-soprano.json   # variantes baroque|german inline (solo difieren Fa y derivados)
    fife-yrf21.json         # verificar 2ª octava contra fife-flute.PNG (fuente canónica)
    flute-boehm.json
  songs/
    index.json              # metadatos: id, título, nivel, notas usadas, compás, origen, transposición por instrumento
    *.abc                   # una canción por archivo, en tonalidad cómoda para soprano
```

- Digitación: `{ "midi": 77, "label": "F5", "variant": "baroque", "state": {"T":"c","H1":"c",...} }` — estados `c` (cerrado), `o` (abierto), `h` (medio). Agujeros dobles como sub-elementos (`H6a/H6b`).
- Las digitaciones de dulce ya están **doble-verificadas** (Dolmetsch + American Recorder Society coinciden en C5–D7). La 2ª octava de la fife se transcribe de `fife-flute.PNG`.
- Traversa: transcrita de The Woodwind Fingering Guide (wfg.woodwind.org), 1ª y 2ª octava.

## 4. Repertorio graduado (6 niveles, ~50 canciones de dominio público)

Criterios de dificultad (función de puntuación): ámbito, registro (agudos ø / graves con sellado), alteraciones/horquillas, cambios de digitación no adyacentes, saltos, fraseo/respiración, tonalidad, ritmo.

| Nivel | Novedad técnica | Ejemplos (todo dominio público) |
|---|---|---|
| 1 | Solo B-A-G (mano izq.) | Hot Cross Buns, Merrily We Roll Along, Au clair de la lune, Mary Had a Little Lamb |
| 2 | + Do' agudo / Mi-Re graves (pentatónica) | Arroz con leche, Los pollitos dicen, Old MacDonald, Suo Gân, El puente está quebrado |
| 3 | Hexacordo Sol→Re' | **Oda a la Alegría**, Jingle Bells, Frère Jacques/Martinillo, London Bridge, Amazing Grace, Mambrú |
| 4 | Fa# o graves completos | **Estrellita/Twinkle**, **Cumpleaños feliz** (PD desde 2016/2017), Yankee Doodle, Oh! Susanna, De colores, La bamba (melodía trad.) |
| 5 | Fa natural (horquilla), menores/modos | Noche de paz, Greensleeves, Scarborough Fair, Los peces en el río, Auld Lang Syne, Sakura |
| 6 | Registro agudo (ø), ámbito >8ª, velocidad | Minueto en Sol (Petzold), Danny Boy, El cóndor pasa, La Mañana (Grieg), Can-can, Cielito Lindo |

Fuentes para transcribir: abcnotation.com (~800k melodías ABC), The Session, folktunefinder.com, colección Essen. **Transcribimos nuestro propio corpus ABC** (las melodías tradicionales son PD; transcribir nosotros elimina dudas de © de arreglos ajenos).

Avisos legales anotados: "Estrellita" de Ponce y "Cielito Lindo" siguen protegidas en México (vida+100); El burrito sabanero, Titanic, Star Wars = © → excluidas. Alternativa mexicana PD a Cumpleaños feliz: Las mañanitas.

Adaptación por instrumento: dulce y fife comparten repertorio ~1:1 (ajustando Fa#↔Fa según variante); traversa baja una octava real y evita notas bajo Re4 en niveles 1–4.

## 5. Pantallas

1. **Selector de instrumento** (dulce barroca/alemana · fife · traversa) — persiste en localStorage.
2. **Explorador de digitaciones**: chart interactivo — clic en nota del pentagrama ↔ diagrama del instrumento, con audio de referencia. (Patrón de Recorder Dojo / fingeringchart.org.)
3. **Repertorio**: lista por niveles con progreso (estilo "cinturones"), cada canción marca qué notas nuevas introduce.
4. **Vista de canción**: pentagrama (abcjs) + flauto-tab alineada debajo + controles: play/pausa, tempo (50–120%), cursor que resalta nota actual y su digitación en grande al costado, toggle mostrar/ocultar tab (progresión: solo tab → tab+pentagrama → solo pentagrama, patrón de WindTab).

## 6. Fases

- **F0 — Esqueleto** (Vite+React+TS, abcjs renderizando 1 canción, estructura de datos).
- **F1 — MVP dulce**: digitaciones soprano completas (barroca+alemana), flauto-tab alineada, 10 canciones niveles 1–2, playback con cursor.
- **F2 — Fife + traversa**: tablas de digitación restantes (fife verificada contra la imagen Yamaha), transposición por instrumento, explorador de digitaciones.
- **F3 — Repertorio completo**: ~50 canciones en 6 niveles, progreso persistido, tempo variable.
- **F4 — Feedback por micrófono** (opcional): pitchy + comparación contra nota esperada.

## 7. Preguntas abiertas

1. ¿Nombres de nota en español (Do-Re-Mi) como principal, con letras (C-D-E) secundarias? (Propuesta: sí, Do-Re-Mi principal.)
2. ¿React o preferencia por otro framework?
3. ¿"Dos versiones según afinación" se refería a barroca/alemana (cubierto) o a soprano/alto en Fa? (La alto sería fase extra.)
4. ¿Interesa la fase de micrófono o priorizamos repertorio?
