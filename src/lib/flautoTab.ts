import type { Instrument, RecorderVariant } from '../types';
import { getFingering } from '../types';
import { diagramGeometry, type DiagramPrimitive } from './diagramGeometry';

// Dibuja la "flauto-tab" DENTRO del SVG que generó abcjs: así hereda el
// escalado responsive (viewBox) y queda alineada al píxel con cada nota.

const SVG_NS = 'http://www.w3.org/2000/svg';

export interface TabNoteEvent {
  midiPitches?: { pitch: number }[];
  left: number;
  top: number;
  height: number;
  width?: number;
  type?: string;
}

function materialize(p: DiagramPrimitive, dx: number, dy: number): SVGElement {
  if (p.tag === 'circle') {
    const el = document.createElementNS(SVG_NS, 'circle');
    el.setAttribute('cx', String(dx + p.cx));
    el.setAttribute('cy', String(dy + p.cy));
    el.setAttribute('r', String(p.r));
    el.setAttribute('class', p.cls);
    return el;
  }
  if (p.tag === 'rect') {
    const el = document.createElementNS(SVG_NS, 'rect');
    el.setAttribute('x', String(dx + p.x));
    el.setAttribute('y', String(dy + p.y));
    el.setAttribute('width', String(p.w));
    el.setAttribute('height', String(p.h));
    el.setAttribute('rx', String(p.rx));
    el.setAttribute('class', p.cls);
    return el;
  }
  const el = document.createElementNS(SVG_NS, 'path');
  // los paths llegan ya en coordenadas locales; se trasladan con transform
  el.setAttribute('d', p.d);
  el.setAttribute('transform', `translate(${dx} ${dy})`);
  el.setAttribute('class', p.cls);
  return el;
}

export function drawFlautoTab(
  container: HTMLElement,
  noteTimings: TabNoteEvent[],
  instrument: Instrument,
  variant: RecorderVariant | undefined,
): Map<number, SVGGElement> {
  const svg = container.querySelector('svg');
  const groupsByLeft = new Map<number, SVGGElement>();
  if (!svg) return groupsByLeft;

  svg.querySelectorAll('.flauto-tab').forEach((el) => el.remove());
  const root = document.createElementNS(SVG_NS, 'g');
  root.setAttribute('class', 'flauto-tab');

  for (const ev of noteTimings) {
    if (ev.type === 'end' || !ev.midiPitches?.length) continue; // silencios y fin
    const midi = ev.midiPitches[0].pitch;
    const fingering = getFingering(instrument, midi, variant);

    const g = document.createElementNS(SVG_NS, 'g');
    g.setAttribute('class', 'flauto-tab-note');
    const yTop = ev.top + ev.height + 4;

    if (!fingering) {
      const text = document.createElementNS(SVG_NS, 'text');
      text.setAttribute('x', String(ev.left + 4));
      text.setAttribute('y', String(yTop + 12));
      text.setAttribute('class', 'tab-missing');
      text.textContent = '?';
      g.appendChild(text);
    } else {
      const geo = diagramGeometry(instrument, fingering, variant);
      const x0 = ev.left + 4 - geo.cx; // la columna principal, centrada bajo la cabeza de nota
      for (const p of geo.prims) g.appendChild(materialize(p, x0, yTop));
    }
    root.appendChild(g);
    groupsByLeft.set(Math.round(ev.left), g);
  }

  svg.appendChild(root);
  return groupsByLeft;
}
