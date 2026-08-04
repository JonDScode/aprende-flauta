import type { Fingering, Instrument, RecorderVariant } from '../types';
import { getFingering, noteLabel, noteName } from '../types';
import { diagramGeometry, type DiagramPrimitive } from '../lib/diagramGeometry';
import MiniStaff from './MiniStaff';

interface Props {
  instrument: Instrument;
  variant?: RecorderVariant;
  midi: number;
  /** digitación concreta a dibujar (p. ej. una alternativa); si falta, se busca la principal */
  fingering?: Fingering;
  scale?: number;
  showLabels?: boolean;
  showName?: boolean;
  /** nombre corto para principiantes ("Do") en vez de "Do (C4)" */
  simpleName?: boolean;
  /** mini-pentagrama con la posición de la nota */
  showStaff?: boolean;
  showHint?: boolean;
}

export function Primitive({ p }: { p: DiagramPrimitive }) {
  switch (p.tag) {
    case 'circle':
      return <circle cx={p.cx} cy={p.cy} r={p.r} className={p.cls} />;
    case 'rect':
      return <rect x={p.x} y={p.y} width={p.w} height={p.h} rx={p.rx} className={p.cls} />;
    case 'path':
      return <path d={p.d} className={p.cls} />;
  }
}

/** Diagrama de digitación como componente React (explorador, franja de notas, nota activa). */
export default function FingeringDiagram({
  instrument,
  variant,
  midi,
  fingering: explicitFingering,
  scale = 2,
  showLabels = false,
  showName = false,
  simpleName = false,
  showStaff = false,
  showHint = true,
}: Props) {
  const fingering = explicitFingering ?? getFingering(instrument, midi, variant);
  if (!fingering) {
    return <div className="diagram-missing">Sin digitación para {noteLabel(midi)}</div>;
  }
  const geo = diagramGeometry(instrument, fingering, variant);
  const labelSpace = showLabels ? 52 : 0;
  // viewBox ajustado a lo realmente dibujado → el diagrama queda centrado en la tarjeta
  const vbX = geo.minX - 2;
  const vbW = geo.maxX - geo.minX + 4 + labelSpace;

  return (
    <div className="fingering-diagram">
      {showName && (
        <div className="diagram-note-name">
          {simpleName ? noteName(midi).es : noteLabel(midi)}
        </div>
      )}
      {showStaff && <MiniStaff midi={midi} />}
      <svg
        width={vbW * scale}
        height={geo.height * scale}
        viewBox={`${vbX} 0 ${vbW} ${geo.height}`}
        role="img"
        aria-label={`Digitación de ${noteLabel(midi)}`}
      >
        {geo.prims.map((p, i) => (
          <Primitive key={i} p={p} />
        ))}
        {showLabels &&
          geo.rows.map(
            (row, i) =>
              row.label && (
                <text key={i} x={geo.maxX + 4} y={row.y + 2} className="tab-label">
                  {row.label}
                </text>
              ),
          )}
      </svg>
      {fingering.verified === false && (
        <div className="diagram-unverified" title="Digitación pendiente de verificar">
          ⚠ por verificar
        </div>
      )}
      {showHint && fingering.hint && <div className="diagram-hint">{fingering.hint}</div>}
    </div>
  );
}
