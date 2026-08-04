import type { Fingering, Instrument } from '../../types';

// Flauta dulce soprano. Digitaciones verificadas con doble fuente:
// - Dolmetsch Online: https://www.dolmetsch.com/textfingeringchart.htm
// - American Recorder Society: https://americanrecorder.org/docs/Fingering_Chart_for_Soprano_Recorder.pdf
// midi = altura ESCRITA (la soprano suena una octava arriba: 60 escrito = C4 escrito = C5 sonando).
// Elementos: T pulgar · H1-H3 mano izq. · H4-H5 mano der. · H6/H7 agujeros dobles (a/b).

function f(midi: number, closed: string[], opts: Partial<Fingering> = {}): Fingering {
  const state: Fingering['state'] = {};
  for (const id of closed) state[id] = 'c';
  return { midi, state, ...opts };
}
/** variante con pulgar pellizcado (medio agujero) */
function fp(midi: number, closed: string[], opts: Partial<Fingering> = {}): Fingering {
  const fing = f(midi, closed, opts);
  fing.state['T'] = 'h';
  return fing;
}

const ALL = ['T', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6a', 'H6b', 'H7a', 'H7b'];

export const recorder: Instrument = {
  id: 'recorder',
  name: 'Flauta dulce soprano',
  soundingOffset: 12,
  program: 74, // GM Recorder
  layout: [
    { ids: ['H1'], hand: 'L', finger: 'index' },
    // pulgar: mismo nivel que el primer agujero frontal, a su izquierda (= está detrás);
    // más pequeño que los frontales, como en el instrumento real
    { ids: ['T'], thumb: true, hand: 'L', finger: 'thumb', float: 'left', floatDy: 0, xOffset: -13, size: 0.78 },
    { ids: ['H2'], hand: 'L', finger: 'middle' },
    { ids: ['H3'], hand: 'L', finger: 'ring' },
    { ids: ['H4'], gapBefore: true, hand: 'R', finger: 'index' },
    { ids: ['H5'], hand: 'R', finger: 'middle' },
    { ids: ['H6a', 'H6b'], hand: 'R', finger: 'ring' },
    // el 7 queda lateral en el tubo (alcance del meñique) → desplazado
    { ids: ['H7a', 'H7b'], xOffset: -5, hand: 'R', finger: 'pinky' },
  ],
  fingerings: [
    // ---- primera octava escrita (C4-B4) ----
    f(60, ALL, { hint: 'Sella bien todos los agujeros; soplo muy suave.' }),
    f(61, ['T', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6a', 'H6b', 'H7a']),
    f(62, ['T', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6a', 'H6b']),
    f(63, ['T', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6a']),
    f(64, ['T', 'H1', 'H2', 'H3', 'H4', 'H5']),
    // Fa: LA diferencia barroca/alemana
    f(65, ['T', 'H1', 'H2', 'H3', 'H4', 'H6a', 'H6b', 'H7a', 'H7b'], {
      variant: 'baroque',
      hint: 'Digitación de horquilla: se abre el 5 y se vuelven a tapar 6 y 7.',
    }),
    f(65, ['T', 'H1', 'H2', 'H3', 'H4'], { variant: 'german' }),
    f(66, ['T', 'H1', 'H2', 'H3', 'H5', 'H6a', 'H6b'], { variant: 'baroque' }),
    f(66, ['T', 'H1', 'H2', 'H3', 'H5', 'H6a', 'H6b', 'H7a', 'H7b'], {
      variant: 'german',
      verified: false,
      hint: 'El Fa# alemán queda algo desafinado; corrige con el soplo.',
    }),
    f(67, ['T', 'H1', 'H2', 'H3']),
    f(68, ['T', 'H1', 'H2', 'H4', 'H5', 'H6a']),
    f(69, ['T', 'H1', 'H2']),
    f(70, ['T', 'H1', 'H3', 'H4']),
    f(71, ['T', 'H1']),
    // ---- Do'-Re' agudos ----
    f(72, ['T', 'H2'], { hint: 'Pulgar + dedo medio: “el saludo”.' }),
    f(73, ['H1', 'H2']),
    f(74, ['H2'], { hint: 'Solo el dedo medio, sin pulgar.' }),
    f(75, ['H2', 'H3', 'H4', 'H5', 'H6a', 'H6b']),
    // ---- registro agudo: pulgar pellizcado (ø) ----
    fp(76, ['H1', 'H2', 'H3', 'H4', 'H5'], {
      hint: 'Desde aquí: pulgar pellizcado (ø) — mismos dedos que la octava grave.',
    }),
    fp(77, ['H1', 'H2', 'H3', 'H4', 'H6a', 'H6b'], { variant: 'baroque' }),
    fp(77, ['H1', 'H2', 'H3', 'H4'], { variant: 'german', verified: false }),
    fp(78, ['H1', 'H2', 'H3', 'H5']),
    fp(79, ['H1', 'H2', 'H3']),
    fp(80, ['H1', 'H2', 'H4']),
    fp(81, ['H1', 'H2']),
    fp(82, ['H1', 'H2', 'H5', 'H6a', 'H6b']),
    fp(83, ['H1', 'H2', 'H4', 'H5']),
    fp(84, ['H1', 'H4', 'H5']),
    fp(85, ['H1', 'H3', 'H4', 'H6a', 'H6b'], {
      hint: 'Además hay que tapar la campana (contra la rodilla).',
    }),
    fp(86, ['H1', 'H3', 'H4', 'H6a', 'H6b']),
  ],
};
