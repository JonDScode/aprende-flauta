import { useRef } from 'react';
import type { InstrumentChoice } from '../data/fingerings';
import type { Fingering } from '../types';
import { midiToFreq } from '../types';
import FingeringDiagram from './FingeringDiagram';
import AnatomyCard from './AnatomyCard';
import Embouchure from './Embouchure';

const OCTAVE_NAMES = ['Primera octava', 'Segunda octava', 'Tercera octava', 'Cuarta octava'];

/** Chart interactivo: digitaciones agrupadas por octava, con tono de referencia. */
export default function Explorer({ choice }: { choice: InstrumentChoice }) {
  const ctxRef = useRef<AudioContext | null>(null);

  const play = (writtenMidi: number) => {
    ctxRef.current ??= new AudioContext();
    const ctx = ctxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = midiToFreq(writtenMidi + choice.instrument.soundingOffset);
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.9);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1);
  };

  const { instrument, variant } = choice;
  const fingerings = instrument.fingerings
    .filter((f) => f.variant === undefined || f.variant === variant)
    .sort((a, b) => a.midi - b.midi || Number(a.alternative ?? false) - Number(b.alternative ?? false));

  // agrupar por octava escrita (Do a Si)
  const octaves = new Map<number, Fingering[]>();
  for (const f of fingerings) {
    const o = Math.floor(f.midi / 12) - 1;
    if (!octaves.has(o)) octaves.set(o, []);
    octaves.get(o)!.push(f);
  }
  const sortedOctaves = [...octaves.entries()].sort((a, b) => a[0] - b[0]);

  return (
    <div className="explorer">
      <h2>Digitaciones — {choice.name}</h2>
      <p className="explorer-tip">
        Pulsa una tarjeta para escuchar el tono de referencia. ● tapado · ○ abierto · ◐ medio
        agujero. La raya separa la mano izquierda de la derecha.
      </p>
      <Embouchure instrumentId={instrument.id} />
      <AnatomyCard choice={choice} />
      {sortedOctaves.map(([oct, fs], i) => (
        <section key={oct}>
          <h3>{OCTAVE_NAMES[i] ?? `Octava ${oct}`}</h3>
          <div className={`explorer-grid${instrument.id === 'flute' ? ' explorer-grid--wide' : ''}`}>
            {fs.map((f, j) => (
              <button key={`${f.midi}-${j}`} className="explorer-card" onClick={() => play(f.midi)}>
                {f.alternative && <span className="alt-badge">alternativa</span>}
                <FingeringDiagram
                  instrument={instrument}
                  variant={variant}
                  midi={f.midi}
                  fingering={f}
                  scale={1.8}
                  showName
                  simpleName
                  showStaff
                  showHint={false}
                />
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
