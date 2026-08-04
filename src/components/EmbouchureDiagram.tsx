/**
 * Corte transversal del mecanismo de embocadura de un instrumento de bisel
 * (fife y traversa comparten el mismo principio físico), inspirado en los
 * diagramas clásicos de método de flauta: la chimenea (riser) eleva el
 * agujero hasta la placa de labio; el aire de los labios cruza el agujero
 * y se divide en el borde — una parte entra al tubo y suena, otra se
 * desvía fuera. El panel derecho muestra cuánto agujero tapa el labio
 * visto desde arriba. Diagrama propio en SVG, sin depender de imágenes
 * externas; identificado por números para evitar texto superpuesto.
 */
function Badge({ x, y, n }: { x: number; y: number; n: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={7} className="emb-badge" />
      <text x={x} y={y + 3} className="emb-badge-text" textAnchor="middle">
        {n}
      </text>
    </g>
  );
}

export default function EmbouchureDiagram() {
  return (
    <svg
      className="embouchure-diagram"
      viewBox="0 0 340 210"
      role="img"
      aria-label="Corte del mecanismo de embocadura: el aire de los labios cruza el agujero, elevado por la chimenea, y se divide en el borde de la placa de labio"
    >
      {/* ---------- panel A: corte lateral ---------- */}
      {/* tubo de la flauta, en corte (doble círculo = pared del tubo) */}
      <circle cx="95" cy="128" r="40" className="emb-tube-outer" />
      <circle cx="95" cy="128" r="33" className="emb-tube-inner" />

      {/* chimenea (riser): eleva el agujero desde el tubo hasta la placa de labio */}
      <path d="M 82 88 L 86 62 L 108 62 L 112 88 Z" className="emb-riser" />

      {/* placa de labio: superficie curva donde apoya la barbilla */}
      <path d="M 55 66 Q 97 52 140 66" className="emb-lipplate" />

      {/* aire: cuña delgada desde los labios hasta el borde cercano de la chimenea */}
      <path d="M 8 42 L 84 63 L 8 58 Z" className="emb-air-wedge" />
      <path d="M 20 48 L 34 50 M 20 52 L 34 53" className="emb-air-hatch" />

      {/* division del aire en el borde: una parte entra al tubo, otra se desvia fuera */}
      <path d="M 92 66 C 88 78, 88 92, 92 104" className="emb-air-split" markerEnd="url(#emb-arrow)" />
      <path d="M 100 63 C 112 50, 128 46, 145 50" className="emb-air-split" markerEnd="url(#emb-arrow)" />

      {/* onda dentro del tubo sugiriendo la columna de aire vibrando */}
      <path d="M 78 128 q 7 -9 14 0 t 14 0 t 14 0" className="emb-wave" />

      <Badge x={14} y={30} n={1} />
      <Badge x={97} y={58} n={2} />
      <Badge x={45} y={62} n={3} />
      <Badge x={95} y={172} n={4} />

      {/* ---------- panel B: vista superior — cuánto tapa el labio ---------- */}
      <path
        d="M 210 118 Q 210 90 250 90 L 290 90 Q 330 90 330 118 Q 330 146 290 146 L 250 146 Q 210 146 210 118 Z"
        className="emb-face-outline"
      />
      <ellipse cx="270" cy="118" rx="26" ry="14" className="emb-hole-top" />
      <path d="M 248 111 Q 270 100 292 111" className="emb-lip-line" />

      <Badge x={270} y={100} n={5} />

      <defs>
        <marker id="emb-arrow" markerWidth="6" markerHeight="6" refX="4" refY="2" orient="auto">
          <path d="M0,0 L4,2 L0,4 Z" className="emb-arrowhead" />
        </marker>
      </defs>

      {/* ---------- leyenda ---------- */}
      <g className="emb-legend">
        <text x="10" y="196">① Aire de los labios</text>
        <text x="10" y="208">② Chimenea (riser)</text>
        <text x="180" y="196">③ Placa de labio</text>
        <text x="180" y="208">④ Tubo de la flauta</text>
        <text x="205" y="165">⑤ El labio cubre ≈ 1/3 del agujero</text>
      </g>
    </svg>
  );
}
