import { useEffect, useRef } from 'react';
import abcjs from 'abcjs';

/** Fragmento de partitura renderizado con abcjs para las lecciones. */
function AbcSnippet({ abc, width = 400 }: { abc: string; width?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      abcjs.renderAbc(ref.current, abc, { staffwidth: width, paddingbottom: 4, paddingtop: 0 });
    }
  }, [abc, width]);
  return <div className="abc-snippet" ref={ref} />;
}

const SCALE_ABC = `X:1
M:4/4
L:1/4
K:C
C D E F | G A B c |
w: Do Re Mi Fa Sol La Si Do
`;

const FIGURES = [
  { abc: 'X:1\nM:4/4\nL:1/1\nK:C\nG |]', name: 'Redonda', beats: '4 tiempos' },
  { abc: 'X:1\nM:4/4\nL:1/2\nK:C\nG G |]', name: 'Blanca', beats: '2 tiempos' },
  { abc: 'X:1\nM:4/4\nL:1/4\nK:C\nG G G G |]', name: 'Negra', beats: '1 tiempo' },
  { abc: 'X:1\nM:4/4\nL:1/8\nK:C\nGG GG GG GG |]', name: 'Corchea', beats: '½ tiempo' },
];

export default function Course() {
  return (
    <div className="course">
      <h2>Curso — fundamentos para tocar la flauta</h2>

      <section className="lesson">
        <h3>Lección 1 · El pentagrama</h3>
        <p>
          La música se escribe sobre el <strong>pentagrama</strong>: 5 líneas y 4 espacios. Cuanto
          más arriba está una nota, más agudo suena. El símbolo del inicio es la{' '}
          <strong>clave de sol</strong>: su espiral abraza la 2.ª línea y le da nombre — esa línea
          es <em>Sol</em>; desde ahí se cuentan las demás.
        </p>
        <AbcSnippet abc={SCALE_ABC} />
        <p>
          Sube por la escalera alternando líneas y espacios: Do (rayita debajo del pentagrama), Re,
          Mi, Fa, Sol, La, Si, Do′. En el <em>explorador de digitaciones</em> cada tarjeta muestra
          su nota en un mini-pentagrama exactamente así.
        </p>
        <p className="lesson-note">
          En flauta dulce y fife tocarás las mismas notas escritas (suenan una octava más brillante,
          es normal); en traversa suenan tal cual se escriben.
        </p>
      </section>

      <section className="lesson">
        <h3>Lección 2 · Las figuras: cuánto dura cada nota</h3>
        <p>
          El <strong>pulso</strong> es el latido constante de la música (cuenta 1-2-3-4). Cada
          figura dura un número de pulsos:
        </p>
        <div className="figures-table">
          {FIGURES.map((f) => (
            <div key={f.name} className="figure-row">
              <div className="figure-name">
                <strong>{f.name}</strong>
                <span>{f.beats}</span>
              </div>
              <AbcSnippet abc={f.abc} width={260} />
            </div>
          ))}
        </div>
        <p>
          El <strong>compás</strong> agrupa los pulsos: 4/4 = grupos de cuatro, 3/4 = grupos de tres
          (como un vals). Las barras verticales del pentagrama separan cada compás. Cada figura
          tiene además su <em>silencio</em> equivalente: respirar también es música.
        </p>
      </section>

      <section className="lesson">
        <h3>Lección 3 · El método: de la flauto-tab a leer partitura</h3>
        <p>Cada canción del repertorio te da tres andamios, para que sueltes uno a uno:</p>
        <ol>
          <li>
            <strong>Mira las notas de la canción</strong> — al abrir una canción verás primero las
            digitaciones de las notas que usa. Practícalas sueltas hasta que salgan sin pensar.
          </li>
          <li>
            <strong>Toca con la flauto-tab</strong> — bajo cada nota del pentagrama está su columna
            de dedos. Usa el reproductor lento (el control de %) y sigue el cursor.
          </li>
          <li>
            <strong>Apaga la flauto-tab</strong> — desactiva «Mostrar flauto-tab» y toca leyendo
            solo el pentagrama. Si dudas en una nota, vuelve a encenderla un momento.
          </li>
        </ol>
        <p className="lesson-note">
          Los niveles del repertorio introducen las notas de a pocas: nivel 1 usa solo Si·La·Sol
          (tres dedos de la mano izquierda). Domina un nivel antes de pasar al siguiente.
        </p>
      </section>
    </div>
  );
}
