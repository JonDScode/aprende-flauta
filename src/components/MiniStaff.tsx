import { useEffect, useRef } from 'react';
import abcjs from 'abcjs';

// Mini-pentagrama de una sola nota, renderizado con abcjs (el mismo motor de las
// canciones y el curso): clave, líneas adicionales y alteraciones exactas.

const PC_ABC = ['C', '^C', 'D', '^D', 'E', 'F', '^F', 'G', '^G', 'A', '^A', 'B'];

function midiToAbc(midi: number): string {
  const pc = ((midi % 12) + 12) % 12;
  const oct = Math.floor(midi / 12) - 1;
  let note = PC_ABC[pc]; // octava 4 = mayúscula (Do central)
  if (oct === 3) note = `${note},`;
  else if (oct === 5) note = note.toLowerCase();
  else if (oct >= 6) note = `${note.toLowerCase()}${"'".repeat(oct - 5)}`;
  return note;
}

export default function MiniStaff({ midi }: { midi: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const abc = `X:1\nL:1/1\nK:C\n${midiToAbc(midi)}|]`;
    abcjs.renderAbc(ref.current, abc, {
      scale: 0.85,
      staffwidth: 84,
      paddingtop: 4,
      paddingbottom: 2,
      paddingleft: 0,
      paddingright: 0,
    });
  }, [midi]);
  // abcjs escribe estilos inline (overflow:hidden + altura) en su contenedor y
  // recortaba las notas con líneas adicionales: por eso va en un div interior,
  // y el exterior .ministaff impone la altura uniforme de todas las tarjetas
  return (
    <div className="ministaff">
      <div ref={ref} />
    </div>
  );
}
