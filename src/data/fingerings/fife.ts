import type { Fingering, Instrument } from '../../types';

// Fife Yamaha YRF-21 — TRANSCRITO Y VERIFICADO contra el chart oficial de Yamaha
// (fife-flute.PNG, fuente canónica; transcripción columna a columna 2026-07-23).
// Claves del instrumento según el chart:
// - El meñique derecho (H7) va TAPADO como apoyo en casi todas las notas
//   (estabiliza el tubo y afina); queda abierto solo en Re y Re#.
// - La 2ª octava repite la digitación de la 1ª y se consigue con la velocidad
//   del aire (comportamiento de traversa; NO usa medio pulgar como la dulce).
// - Re y Re# agudos: se levanta el índice izquierdo (agujero de registro),
//   igual que en la traversa Boehm.
// midi = altura ESCRITA (la fife suena una octava arriba: 60 escrito = C5 sonando).

function f(midi: number, closed: string[], opts: Partial<Fingering> = {}): Fingering {
  const state: Fingering['state'] = {};
  for (const id of closed) state[id] = 'c';
  return { midi, state, ...opts };
}

export const fife: Instrument = {
  id: 'fife',
  name: 'Fife Yamaha YRF-21',
  soundingOffset: 12,
  program: 72, // GM Piccolo (timbre más cercano al fife)
  layout: [
    { ids: ['H1'], hand: 'L', finger: 'index' },
    // pulgar: mismo nivel que el primer agujero frontal, a su izquierda (= está detrás)
    { ids: ['T'], thumb: true, hand: 'L', finger: 'thumb', float: 'left', floatDy: 0, xOffset: -13, size: 0.78 },
    { ids: ['H2'], hand: 'L', finger: 'middle' },
    { ids: ['H3'], hand: 'L', finger: 'ring' },
    { ids: ['H4'], gapBefore: true, hand: 'R', finger: 'index' },
    { ids: ['H5'], hand: 'R', finger: 'middle' },
    { ids: ['H6'], hand: 'R', finger: 'ring' },
    // el del meñique queda lateral, cerca de la salida
    { ids: ['H7'], xOffset: -5, hand: 'R', finger: 'pinky' },
  ],
  fingerings: [
    // ---- primera octava escrita (C4-B4 escrito = C5-B5 sonando) ----
    f(60, ['T', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7'], {
      hint: 'Todos tapados. La embocadura es la de una traversa: sopla al bisel.',
    }),
    f(61, ['T', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'], {
      hint: 'Do#: como Do pero con el meñique a MEDIO agujero.',
      // medio agujero del meñique
    }),
    f(62, ['T', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6']),
    f(63, ['T', 'H1', 'H2', 'H3', 'H4', 'H5'], {
      hint: 'Re#: el anular derecho tapa MEDIO agujero.',
    }),
    f(64, ['T', 'H1', 'H2', 'H3', 'H4', 'H5', 'H7'], {
      hint: 'El meñique derecho va apoyado (tapado) en casi todas las notas: estabiliza y afina.',
    }),
    f(65, ['T', 'H1', 'H2', 'H3', 'H4', 'H7'], {
      hint: 'Fa secuencial (estilo alemán): se añade el índice derecho.',
    }),
    f(66, ['T', 'H1', 'H2', 'H3', 'H5', 'H6', 'H7']),
    f(67, ['T', 'H1', 'H2', 'H3', 'H7']),
    f(68, ['T', 'H1', 'H2', 'H4', 'H5', 'H6', 'H7']),
    f(69, ['T', 'H1', 'H2', 'H7']),
    f(70, ['T', 'H1', 'H3', 'H4', 'H5', 'H7']),
    f(71, ['T', 'H1', 'H7']),
    // ---- Do'-Re' escritos (C6-D6 sonando) ----
    f(72, ['H1', 'H7'], { hint: 'Sin pulgar: solo índice izquierdo y meñique de apoyo.' }),
    f(73, ['H7'], { hint: 'Do#: todo abierto salvo el meñique.' }),
    f(74, ['T', 'H2', 'H3', 'H4', 'H5', 'H6'], {
      hint: 'Se levanta el índice izquierdo (agujero de registro), igual que en la traversa.',
    }),
    f(75, ['T', 'H1', 'H2', 'H3', 'H4', 'H5'], {
      hint: 'Re#: el anular derecho a MEDIO agujero.',
    }),
    // ---- segunda octava: mismos dedos, la octava la hace el aire ----
    f(76, ['T', 'H1', 'H2', 'H3', 'H4', 'H5', 'H7'], {
      hint: 'Misma digitación que Mi grave: la octava se logra soplando más rápido.',
    }),
    f(77, ['T', 'H1', 'H2', 'H3', 'H4', 'H7']),
    f(78, ['T', 'H1', 'H2', 'H3', 'H5', 'H7']),
    f(79, ['T', 'H1', 'H2', 'H3', 'H7']),
    f(80, ['T', 'H1', 'H2', 'H4', 'H7']),
    f(81, ['T', 'H1', 'H2', 'H7']),
    f(82, ['T', 'H1', 'H3', 'H7']),
    f(83, ['T', 'H1', 'H7']),
    f(84, ['H1', 'H7']),
    f(85, ['H7']),
    f(86, ['T', 'H2', 'H3', 'H7']),
    // ---- extremo agudo del chart (E7 sonando) ----
    f(88, ['T', 'H1', 'H2', 'H4', 'H5', 'H7']),
  ],
};

// medios agujeros según el chart: Do# grave (meñique ø) y Re# (anular derecho ø)
for (const fing of fife.fingerings) {
  if (fing.midi === 61) fing.state['H7'] = 'h';
  if (fing.midi === 63 || fing.midi === 75) fing.state['H6'] = 'h';
}
