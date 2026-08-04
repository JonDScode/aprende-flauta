const BASE = import.meta.env.BASE_URL;

interface Props {
  onStart: () => void;
  onExplore: () => void;
  onRepertoire: () => void;
}

/** Página de inicio: qué es la app, para quién, y accesos directos. */
export default function Home({ onStart, onExplore, onRepertoire }: Props) {
  return (
    <div className="home">
      <section className="home-hero">
        <h2>Tres flautas, un solo camino para aprender</h2>
        <p>
          <strong>Aprende Flauta</strong> es un curso interactivo y gratuito para flauta dulce
          soprano, fife y flauta traversa. Digitaciones verificadas contra fuentes oficiales,
          un curso de fundamentos (pentagrama, figuras, método) y un repertorio de música de
          dominio público organizado en 6 niveles de dificultad — de tres notas con la mano
          izquierda hasta melodías completas.
        </p>
        <div className="home-cta">
          <button className="home-cta-primary" onClick={onStart}>
            Empezar por los primeros pasos
          </button>
          <button className="home-cta-secondary" onClick={onExplore}>
            Ver digitaciones
          </button>
          <button className="home-cta-secondary" onClick={onRepertoire}>
            Ir al repertorio
          </button>
        </div>
      </section>

      <section className="home-instruments">
        <figure className="home-instrument-card">
          <img src={`${BASE}images/home-recorder.jpg`} alt="Persona tocando flauta dulce" loading="lazy" />
          <figcaption>
            <strong>Flauta dulce soprano</strong>
            <span>El punto de partida: digitación barroca o alemana, aprende a leer y a mover los dedos.</span>
          </figcaption>
        </figure>
        <figure className="home-instrument-card">
          <img src={`${BASE}images/home-fife.jpg`} alt="Persona tocando fife" loading="lazy" />
          <figcaption>
            <strong>Fife Yamaha YRF-21</strong>
            <span>El puente: dedos casi iguales a la dulce, pero con la embocadura de la traversa.</span>
          </figcaption>
        </figure>
        <figure className="home-instrument-card">
          <img src={`${BASE}images/home-traversa.jpg`} alt="Persona tocando flauta traversa" loading="lazy" />
          <figcaption>
            <strong>Flauta traversa</strong>
            <span>La meta: sistema Boehm completo, con todas sus llaves.</span>
          </figcaption>
        </figure>
      </section>

      <section className="home-how">
        <h3>¿Cómo funciona?</h3>
        <ol>
          <li>
            <strong>Notas</strong> — explora el mapa de digitaciones de tu instrumento: cada
            tarjeta muestra dónde vive la nota en el pentagrama y qué dedos van dónde.
          </li>
          <li>
            <strong>Primeros pasos</strong> — el curso: qué es el pentagrama, cómo se leen las
            figuras rítmicas, y el método para pasar de la tablatura a leer partitura sola.
          </li>
          <li>
            <strong>Repertorio</strong> — practica con canciones reales, del nivel 1 (tres notas)
            al 6 (registro agudo), con la digitación bajo cada nota y reproducción con cursor.
          </li>
        </ol>
      </section>
    </div>
  );
}
