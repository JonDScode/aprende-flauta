import EmbouchureDiagram from './EmbouchureDiagram';

interface EmbouchureInfo {
  title: string;
  showDiagram?: boolean;
  paragraphs: string[];
}

const INFO: Record<string, EmbouchureInfo> = {
  recorder: {
    title: 'Embocadura — flauta dulce',
    paragraphs: [
      'La flauta dulce no exige técnica de labios: el pico ya le da forma al aire por dentro. Sella los labios alrededor de la boquilla como si bebieras con una pajita, sin morder ni apretar los dientes contra el plástico o la madera.',
      'Sopla con un aire suave y constante, como si empañaras un cristal. Demasiado aire "quiebra" la nota a la octava aguda antes de tiempo; muy poco y el sonido no sale.',
    ],
  },
  fife: {
    title: 'Embocadura — fife',
    showDiagram: true,
    paragraphs: [
      'El fife se sostiene de lado, como la traversa: el agujero de embocadura queda justo debajo del labio inferior, con la cabeza del instrumento apoyada contra la barbilla.',
      'Tensa ligeramente las comisuras de los labios para formar una abertura pequeña y centrada, y dirige un chorro de aire fino hacia el borde exterior del agujero — no hacia adentro. Cubre con el labio inferior cerca de un tercio del agujero.',
      'Al ser un tubo más estrecho que la traversa, necesita un chorro de aire más rápido y concentrado: es normal que cueste más sacar sonido los primeros días.',
    ],
  },
  flute: {
    title: 'Embocadura — flauta traversa',
    showDiagram: true,
    paragraphs: [
      'Apoya la placa de embocadura contra el mentón, justo debajo del labio inferior, con el agujero centrado respecto a la boca. Gira (o "enrolla") la flauta hacia adentro o afuera hasta que cubra aproximadamente un tercio del agujero con el labio inferior.',
      'Forma una abertura pequeña y plana entre los labios — como al decir "pu" o silbar suave — y dirige el aire en un chorro fino hacia el borde exterior del agujero, donde el aire se divide y hace vibrar la columna de aire dentro del tubo.',
      'El registro (grave/agudo) se controla con la velocidad del aire y el tamaño de la abertura, no con los dedos: aire más rápido y abertura más pequeña sube a la octava aguda.',
    ],
  },
};

export default function Embouchure({ instrumentId }: { instrumentId: string }) {
  const info = INFO[instrumentId];
  if (!info) return null;

  return (
    <div className="embouchure-card">
      <h3>{info.title}</h3>
      <div className="embouchure-body">
        {info.showDiagram && <EmbouchureDiagram />}
        <div className="embouchure-text">
          {info.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
