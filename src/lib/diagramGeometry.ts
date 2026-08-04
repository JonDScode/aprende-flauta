import type { Fingering, Instrument, RecorderVariant } from '../types';

// Geometría compartida de los diagramas de digitación (la "flauto-tab").
// Devuelve PRIMITIVAS de dibujo (círculos/rects/paths con clase CSS) para que
// el componente React y el dibujado imperativo dentro del SVG de abcjs
// produzcan exactamente el mismo diagrama.
//
// Convenciones (charts clásicos de viento + estilo flutetunes.com para traversa):
// - Pulgar de dulce/fife: desplazado a la IZQUIERDA (está detrás del tubo) + anillo punteado.
// - Último agujero (cerca de la salida): también desplazado (queda lateral en el tubo).
// - Agujero doble: dos puntos pequeños DENTRO de un círculo grande (un solo dedo).
// - Raya horizontal separando mano izquierda y derecha (gapBefore).
// - Tamaños de agujero realistas: en barroca el 4 es pequeño y el 5 grande; en alemana al revés.
// - Traversa (flutetunes vertical): círculos de dedos, pulgar como "coma" a la izquierda
//   entre L1 y L2 (contorno si no se presiona), gancho de Sol# junto al anular (solo si se
//   presiona), zapatito de Mi♭ y rodillos Do#/Do al pie.

export type DiagramPrimitive =
  | { tag: 'circle'; cx: number; cy: number; r: number; cls: string }
  | { tag: 'rect'; x: number; y: number; w: number; h: number; rx: number; cls: string }
  | { tag: 'path'; d: string; cls: string };

export interface DiagramRowInfo {
  y: number;
  label?: string;
}

export interface DiagramGeometry {
  prims: DiagramPrimitive[];
  rows: DiagramRowInfo[];
  width: number;
  height: number;
  /** x de la columna principal — el punto que se alinea bajo la cabeza de nota */
  cx: number;
  /** caja real dibujada (para centrar el diagrama en tarjetas) */
  minX: number;
  maxX: number;
}

const STEP = 13; // separación vertical entre filas
const R = 4.6; // radio de agujero base
const R_OUTER = 5.4; // círculo grande del agujero doble
const R_DOT = 1.9; // cada puntito del agujero doble
const GAP = 7; // separación extra entre manos (aloja la raya separadora)

/** path SVG de medio círculo (mitad izquierda rellena) para el estado 'h' */
export function halfCirclePath(x: number, y: number, r: number): string {
  return `M ${x} ${y - r} A ${r} ${r} 0 0 0 ${x} ${y + r} Z`;
}

/** pulgar de traversa con sus DOS piezas siempre visibles (estilo chart completo):
 *  arriba el cuadradito de la palanca Briccialdi (Si♭), debajo la pastilla del Si */
function thumbFlutePrims(x: number, y: number, state: string, bbState = 'o'): DiagramPrimitive[] {
  return [
    { tag: 'rect', x: x - 2.6, y: y - 8.2, w: 5.2, h: 4.4, rx: 1.2, cls: `tab-hole tab-${bbState}` },
    { tag: 'rect', x: x - 2.2, y: y - 2.6, w: 4.4, h: 10, rx: 1.6, cls: `tab-hole tab-${state}` },
  ];
}

/** gancho de la palanca de Sol# (media luna que "sale" del anular izquierdo) */
function gsHookPath(x: number, y: number): string {
  return `M ${x} ${y} C ${x + 4} ${y + 3.5}, ${x + 8} ${y + 3}, ${x + 9.5} ${y - 2.5} C ${x + 8.5} ${y + 6}, ${x + 2} ${y + 6.5}, ${x} ${y} Z`;
}

/** zapatito de la llave de Mi♭ (punta hacia la derecha) */
function shoePath(x: number, y: number): string {
  return `M ${x - 5.5} ${y - 0.5} Q ${x - 5.5} ${y - 3.5} ${x - 2} ${y - 3.5} L ${x + 4.5} ${y - 1} Q ${x + 6.5} ${y} ${x + 4.5} ${y + 2} L ${x - 2.5} ${y + 3} Q ${x - 5.5} ${y + 3} ${x - 5.5} ${y - 0.5} Z`;
}

export function diagramGeometry(
  instrument: Instrument,
  fingering: Fingering,
  variant?: RecorderVariant,
): DiagramGeometry {
  // ancho asimétrico: espacio extra a la izquierda para el pulgar desplazado
  // (con 34 de ancho el pulgar de dulce/fife quedaba cortado)
  const width = 42;
  const cx = 24;
  const prims: DiagramPrimitive[] = [];
  const rows: DiagramRowInfo[] = [];
  let y = R_OUTER + 2;
  let prevY = y;
  let minX = cx;
  let maxX = cx;
  const grow = (a: number, b: number) => {
    if (a < minX) minX = a;
    if (b > maxX) maxX = b;
  };

  for (const row of instrument.layout) {
    const kind = row.kind ?? 'hole';
    const state = fingering.state[row.ids[0]] ?? 'o';

    // elementos flotantes: anclados a la fila anterior, sin avanzar la columna
    if (row.float) {
      const fy = prevY + (row.floatDy ?? STEP * 0.45);
      const fx = cx + (row.xOffset ?? (row.float === 'left' ? -9 : 8));
      if (kind === 'thumbFlute') {
        const bbState = row.ids[1] ? fingering.state[row.ids[1]] ?? 'o' : 'o';
        prims.push(...thumbFlutePrims(fx, fy, state, bbState));
        grow(fx - 2.6, fx + 2.6);
      } else if (kind === 'gsHook') {
        // siempre visible: relleno al presionar, contorno si no
        prims.push({ tag: 'path', d: gsHookPath(fx, fy - 3), cls: `tab-hole tab-${state}` });
        grow(fx, fx + 9.5);
      } else if (kind === 'trill') {
        // llavecitas de trino: siempre en contorno (no se usan en digitaciones básicas)
        prims.push({ tag: 'circle', cx: fx, cy: fy, r: 2, cls: `tab-hole tab-${state}` });
        grow(fx - 2, fx + 2);
      } else {
        // agujero flotante (pulgar de dulce/fife junto al primer agujero frontal)
        const r = R * (row.size ?? 1);
        if (row.thumb) prims.push({ tag: 'circle', cx: fx, cy: fy, r: r + 1.8, cls: 'tab-thumb-ring' });
        prims.push({ tag: 'circle', cx: fx, cy: fy, r, cls: `tab-hole tab-${state}` });
        if (state === 'h') prims.push({ tag: 'path', d: halfCirclePath(fx, fy, r), cls: 'tab-half' });
        grow(fx - r - 1.8, fx + r + 1.8);
      }
      rows.push({ y: fy, label: row.label });
      continue;
    }

    if (row.gapBefore) {
      y += GAP;
      // raya separadora entre mano izquierda y derecha
      prims.push({ tag: 'rect', x: cx - 7, y: y - GAP / 2 - STEP / 2 - 0.6, w: 14, h: 1.3, rx: 0.6, cls: 'tab-hand-sep' });
    }
    const x = cx + (row.xOffset ?? 0);
    rows.push({ y, label: row.label });

    if (row.ids.length === 2 && kind !== 'roller') {
      // agujero doble: para leer rápido se dibuja como un círculo normal;
      // solo cuando sus dos mitades difieren (Do#/Re# graves) se muestran los dos puntos
      const s0 = fingering.state[row.ids[0]] ?? 'o';
      const s1 = fingering.state[row.ids[1]] ?? 'o';
      grow(x - R_OUTER, x + R_OUTER);
      if (s0 === s1) {
        prims.push({ tag: 'circle', cx: x, cy: y, r: R, cls: `tab-hole tab-${s0}` });
      } else {
        prims.push({ tag: 'circle', cx: x, cy: y, r: R_OUTER, cls: 'tab-outer' });
        for (let i = 0; i < 2; i++) {
          const s = fingering.state[row.ids[i]] ?? 'o';
          prims.push({
            tag: 'circle',
            cx: x + (i === 0 ? -R_DOT - 0.6 : R_DOT + 0.6),
            cy: y,
            r: R_DOT,
            cls: `tab-hole tab-${s}`,
          });
        }
      }
    } else if (kind === 'roller') {
      // rodillos del pie (Do# y Do): dos barritas verticales lado a lado
      grow(x - 3.2, x + 3.2);
      for (let i = 0; i < row.ids.length; i++) {
        const s = fingering.state[row.ids[i]] ?? 'o';
        prims.push({
          tag: 'rect',
          x: x + (i === 0 ? -3.2 : 0.8),
          y: y - 3.5,
          w: 2.4,
          h: 7,
          rx: 1,
          cls: `tab-hole tab-${s}`,
        });
      }
    } else if (kind === 'shoe') {
      prims.push({ tag: 'path', d: shoePath(x, y), cls: `tab-hole tab-${state}` });
      grow(x - 5.5, x + 6.5);
    } else {
      const sizeFactor = (variant && row.sizeByVariant?.[variant]) ?? row.size ?? 1;
      const r = R * sizeFactor;
      if (row.thumb) {
        prims.push({ tag: 'circle', cx: x, cy: y, r: r + 1.8, cls: 'tab-thumb-ring' });
      }
      prims.push({ tag: 'circle', cx: x, cy: y, r, cls: `tab-hole tab-${state}` });
      if (state === 'h') {
        prims.push({ tag: 'path', d: halfCirclePath(x, y, r), cls: 'tab-half' });
      }
      grow(x - r - (row.thumb ? 1.8 : 0), x + r + (row.thumb ? 1.8 : 0));
    }

    prevY = y;
    y += STEP;
  }

  return { prims, rows, width, height: y - STEP + R_OUTER + 2, cx, minX, maxX };
}
