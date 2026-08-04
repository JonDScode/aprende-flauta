/**
 * Corte transversal del mecanismo de embocadura de un instrumento de bisel
 * (fife y traversa comparten el mismo principio físico): los labios lanzan
 * una lámina de aire que cruza el agujero y se divide en el borde exterior
 * — una parte entra al tubo (hace sonar la columna de aire), otra se
 * desvía fuera. Diagrama propio en SVG, sin depender de imágenes externas.
 */
export default function EmbouchureDiagram() {
  return (
    <svg
      className="embouchure-diagram"
      viewBox="0 0 260 150"
      role="img"
      aria-label="Corte del mecanismo de embocadura: los labios dirigen el aire hacia el borde del agujero, donde se divide"
    >
      {/* tubo del instrumento, en corte */}
      <rect x="70" y="60" width="180" height="40" rx="4" className="emb-tube" />
      {/* pared frontal con el agujero de embocadura */}
      <rect x="66" y="55" width="10" height="50" className="emb-wall" />
      <ellipse cx="71" cy="80" rx="4" ry="11" className="emb-hole" />

      {/* labios */}
      <path
        d="M 10 74 C 18 66, 34 66, 44 74 C 34 80, 18 80, 10 74 Z"
        className="emb-lip emb-lip-upper"
      />
      <path
        d="M 10 86 C 18 94, 34 94, 44 86 C 34 82, 18 82, 10 86 Z"
        className="emb-lip emb-lip-lower"
      />

      {/* lámina de aire desde los labios hasta el borde del agujero */}
      <path d="M 44 80 L 68 80" className="emb-air-main" markerEnd="url(#emb-arrow)" />

      {/* división del aire en el borde: una parte entra al tubo, otra se desvía fuera */}
      <path d="M 71 75 C 78 58, 95 50, 112 46" className="emb-air-split" markerEnd="url(#emb-arrow)" />
      <path d="M 74 84 C 82 96, 100 100, 118 100" className="emb-air-split" markerEnd="url(#emb-arrow)" />

      {/* onda dentro del tubo sugiriendo la columna de aire vibrando */}
      <path d="M 130 80 q 8 -10 16 0 t 16 0 t 16 0 t 16 0" className="emb-wave" />

      <defs>
        <marker id="emb-arrow" markerWidth="6" markerHeight="6" refX="4" refY="2" orient="auto">
          <path d="M0,0 L4,2 L0,4 Z" className="emb-arrowhead" />
        </marker>
      </defs>

      {/* etiquetas */}
      <text x="27" y="105" className="emb-label" textAnchor="middle">Labios</text>
      <text x="71" y="118" className="emb-label" textAnchor="middle">Agujero</text>
      <text x="95" y="38" className="emb-label" textAnchor="middle">Aire desviado</text>
      <text x="180" y="118" className="emb-label" textAnchor="middle">Columna de aire (suena)</text>
    </svg>
  );
}
