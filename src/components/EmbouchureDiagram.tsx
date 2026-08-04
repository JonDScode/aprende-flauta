/**
 * Ilustración de la embocadura de un instrumento de bisel (fife y traversa
 * comparten el mismo principio físico): perfil de rostro con los labios
 * apoyados sobre el tubo, y un panel pequeño mostrando —visto desde
 * arriba— cuánto agujero tapa el labio inferior. Diagrama propio en SVG,
 * sin depender de imágenes externas.
 */
export default function EmbouchureDiagram() {
  return (
    <svg
      className="embouchure-diagram"
      viewBox="0 0 380 240"
      role="img"
      aria-label="Perfil de un rostro con los labios apoyados sobre el tubo de la flauta, y vista desde arriba de cuánto agujero cubre el labio inferior"
    >
      {/* ---------- ilustración principal: perfil + tubo ---------- */}
      <g className="emb-tube-group">
        <path d="M 15 222 L 128 128" />
        <path d="M 30 240 L 142 142" />
        <ellipse cx="22" cy="231" rx="18" ry="11" transform="rotate(-42 22 231)" className="emb-tube-cap" />
        <circle cx="22" cy="231" r="6" transform="rotate(-42 22 231)" />
      </g>
      <path
        className="emb-face"
        d="M 145,10
           C 128,14 116,30 113,50
           C 111,60 100,66 85,78
           C 92,85 98,88 100,94
           C 106,96 112,98 108,104
           L 106,107
           C 112,110 124,113 122,122
           C 116,128 106,130 100,138
           C 96,146 94,155 96,165
           C 92,174 92,180 96,190
           L 130,208
           C 175,203 200,168 202,122
           C 204,82 190,36 155,15
           Z"
      />
      <text x="70" y="228" className="emb-caption">
        El labio inferior se apoya sobre el agujero
      </text>

      {/* ---------- panel pequeño: vista superior, cuánto tapa el labio ---------- */}
      <path
        d="M 250 118 Q 250 90 285 90 L 320 90 Q 355 90 355 118 Q 355 146 320 146 L 285 146 Q 250 146 250 118 Z"
        className="emb-face-outline"
      />
      <ellipse cx="302" cy="118" rx="24" ry="13" className="emb-hole-top" />
      <path d="M 282 111 Q 302 101 322 111" className="emb-lip-line" />
      <text x="302" y="168" className="emb-caption" textAnchor="middle">
        Visto desde arriba:
      </text>
      <text x="302" y="180" className="emb-caption" textAnchor="middle">
        el labio cubre ≈ 1/3
      </text>
      <text x="302" y="192" className="emb-caption" textAnchor="middle">
        del agujero
      </text>
    </svg>
  );
}
