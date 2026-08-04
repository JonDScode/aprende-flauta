import type { Fingering } from '../types';
import { FINGER_NAMES } from '../types';
import type { InstrumentChoice } from '../data/fingerings';
import { diagramGeometry } from '../lib/diagramGeometry';
import { Primitive } from './FingeringDiagram';

/**
 * Esquema anatómico del instrumento: el diagrama completo (todo abierto) con
 * cada elemento etiquetado por mano (izq./LH · der./RH) y dedo, en ambos idiomas.
 */
export default function AnatomyCard({ choice }: { choice: InstrumentChoice }) {
  const { instrument, variant } = choice;
  const neutral: Fingering = { midi: 0, state: {} };
  const geo = diagramGeometry(instrument, neutral, variant);

  // geo.rows va 1:1 con instrument.layout (incluidos los flotantes)
  const rows = instrument.layout.map((row, i) => ({ row, y: geo.rows[i]?.y ?? 0 }));

  // etiquetas: si dos filas comparten altura (pulgar flotante junto al índice),
  // se separan verticalmente para que no se pisen
  const labelY = new Map<number, number>();
  const placed: number[] = [];
  rows.forEach(({ row }, i) => {
    if (!row.finger) return;
    let y = rows[i].y;
    while (placed.some((p) => Math.abs(p - y) < 6)) y += 6.2;
    placed.push(y);
    labelY.set(i, y);
  });

  const handSpan = (hand: 'L' | 'R') => {
    const ys = rows.filter((r) => r.row.hand === hand).map((r) => r.y);
    return ys.length ? { min: Math.min(...ys), max: Math.max(...ys) } : null;
  };
  const left = handSpan('L');
  const right = handSpan('R');

  const HAND_W = 22;
  const LABEL_W = 72;
  const scale = 3;
  const widthUnits = HAND_W + geo.width + LABEL_W;

  return (
    <div className="anatomy-card">
      <h3>Esquema — {choice.name}</h3>
      <svg
        width={widthUnits * scale}
        height={geo.height * scale}
        viewBox={`${-HAND_W} 0 ${widthUnits} ${geo.height}`}
        role="img"
        aria-label={`Esquema de manos y dedos de ${choice.name}`}
      >
        {/* corchetes de mano */}
        {([['L', left, 'Mano izq. · LH'] as const, ['R', right, 'Mano der. · RH'] as const]).map(
          ([hand, span, text]) =>
            span && (
              <g key={hand}>
                <path
                  d={`M -6 ${span.min - 4} L -9 ${span.min - 4} L -9 ${span.max + 4} L -6 ${span.max + 4}`}
                  className="anat-bracket"
                />
                <text
                  x={-13}
                  y={(span.min + span.max) / 2}
                  className="anat-hand-label"
                  transform={`rotate(-90 ${-13} ${(span.min + span.max) / 2})`}
                  textAnchor="middle"
                >
                  {text}
                </text>
              </g>
            ),
        )}
        {/* el diagrama en sí */}
        {geo.prims.map((p, i) => (
          <Primitive key={i} p={p} />
        ))}
        {/* etiquetas de dedo (y nombre de llave si aplica) */}
        {rows.map(
          ({ row }, i) =>
            row.finger && (
              <text key={i} x={geo.width + 2} y={(labelY.get(i) ?? rows[i].y) + 1.8} className="anat-label">
                {FINGER_NAMES[row.finger].es} · {FINGER_NAMES[row.finger].en}
                {row.label ? `  (${row.label})` : ''}
              </text>
            ),
        )}
      </svg>
    </div>
  );
}
