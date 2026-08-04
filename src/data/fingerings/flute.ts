import type { Fingering, Instrument } from '../../types';

// Flauta traversa sistema Boehm en Do. Transcrita de The Woodwind Fingering Guide:
// https://www.wfg.woodwind.org/flute/fl_bas_1.html (1ª octava) y fl_bas_2.html (2ª octava).
// midi = altura real (la traversa no transpone).
// Elementos: T pulgar (llave de Si) · L1-L3 mano izq. · Gs palanca Sol# ·
// R1-R3 mano der. · Eb llave Mib (meñique der.) · Cs/C rodillos del pie.

function f(midi: number, closed: string[], opts: Partial<Fingering> = {}): Fingering {
  const state: Fingering['state'] = {};
  for (const id of closed) state[id] = 'c';
  return { midi, state, ...opts };
}

export const flute: Instrument = {
  id: 'flute',
  name: 'Flauta traversa (Boehm)',
  soundingOffset: 0,
  program: 73, // GM Flute
  // diagrama vertical con TODAS las llaves siempre visibles (estilo chart completo):
  // pulgar doble (Si♭ + Si) a la izquierda, platos de dedos, gancho de Sol#,
  // llavecitas de trino entre las de la mano derecha, y pie (Mi♭ + rodillos).
  layout: [
    { ids: ['L1'], hand: 'L', finger: 'index' },
    // pulgar (palanca Briccialdi Si♭ + pastilla Si): detrás del tubo → flotante izquierda
    { ids: ['T', 'ThBb'], kind: 'thumbFlute', float: 'left', label: 'Si · Si♭', hand: 'L', finger: 'thumb' },
    { ids: ['L2'], hand: 'L', finger: 'middle' },
    { ids: ['L3'], hand: 'L', finger: 'ring' },
    { ids: ['Gs'], kind: 'gsHook', float: 'right', label: 'Sol#', hand: 'L', finger: 'pinky', xOffset: 4 },
    { ids: ['R1'], gapBefore: true, hand: 'R', finger: 'index' },
    { ids: ['Tr1'], kind: 'trill', float: 'right', xOffset: 8 },
    { ids: ['R2'], hand: 'R', finger: 'middle' },
    { ids: ['Tr2'], kind: 'trill', float: 'right', xOffset: 8 },
    { ids: ['R3'], hand: 'R', finger: 'ring' },
    { ids: ['Eb'], kind: 'shoe', label: 'Mi♭', hand: 'R', finger: 'pinky', xOffset: -2 },
    // pie: rodillos de Do# y Do como barritas gemelas
    { ids: ['Cs', 'C'], kind: 'roller', label: 'Do# · Do', hand: 'R', finger: 'pinky', xOffset: 2 },
  ],
  fingerings: [
    // ---- primera octava ----
    f(60, ['T', 'L1', 'L2', 'L3', 'R1', 'R2', 'R3', 'C'], {
      hint: 'Do grave: rodillo de Do con el meñique, mucha columna de aire.',
    }),
    f(61, ['T', 'L1', 'L2', 'L3', 'R1', 'R2', 'R3', 'Cs']),
    f(62, ['T', 'L1', 'L2', 'L3', 'R1', 'R2', 'R3'], {
      hint: 'Sin la llave de Mi♭ (excepción, igual que Re5).',
    }),
    f(63, ['T', 'L1', 'L2', 'L3', 'R1', 'R2', 'R3', 'Eb']),
    f(64, ['T', 'L1', 'L2', 'L3', 'R1', 'R2', 'Eb']),
    f(65, ['T', 'L1', 'L2', 'L3', 'R1', 'Eb']),
    f(66, ['T', 'L1', 'L2', 'L3', 'R3', 'Eb'], {
      hint: '¡Fa# va con el ANULAR derecho, no con el índice! Error típico.',
    }),
    f(67, ['T', 'L1', 'L2', 'L3', 'Eb']),
    f(68, ['T', 'L1', 'L2', 'L3', 'Gs', 'Eb']),
    f(69, ['T', 'L1', 'L2', 'Eb']),
    f(70, ['T', 'L1', 'R1', 'Eb'], {
      hint: 'La digitación estándar; favorécela al practicar escalas.',
    }),
    f(70, ['ThBb', 'L1', 'Eb'], {
      alternative: true,
      hint: 'Alternativa: palanca Briccialdi (Si♭ de pulgar). Cómoda en tonalidades con bemoles.',
    }),
    f(71, ['T', 'L1', 'Eb']),
    f(72, ['L1', 'Eb'], { hint: 'Do central: SIN pulgar.' }),
    f(73, ['Eb'], { hint: 'Casi todo abierto: solo la llave de Mi♭.' }),
    // ---- segunda octava ----
    f(74, ['T', 'L2', 'L3', 'R1', 'R2', 'R3'], {
      hint: 'Se levanta el índice izquierdo (agujero de registro). Sin Mi♭.',
    }),
    f(75, ['T', 'L2', 'L3', 'R1', 'R2', 'R3', 'Eb']),
    // De Mi5 a Do6: idénticas a la primera octava, solo cambia el aire.
    f(76, ['T', 'L1', 'L2', 'L3', 'R1', 'R2', 'Eb'], {
      hint: 'Mismos dedos que Mi4: solo cambia la velocidad del aire.',
    }),
    f(77, ['T', 'L1', 'L2', 'L3', 'R1', 'Eb']),
    f(78, ['T', 'L1', 'L2', 'L3', 'R3', 'Eb']),
    f(79, ['T', 'L1', 'L2', 'L3', 'Eb']),
    f(80, ['T', 'L1', 'L2', 'L3', 'Gs', 'Eb']),
    f(81, ['T', 'L1', 'L2', 'Eb']),
    f(82, ['T', 'L1', 'R1', 'Eb']),
    f(82, ['ThBb', 'L1', 'Eb'], {
      alternative: true,
      hint: 'Alternativa: palanca Briccialdi (Si♭ de pulgar).',
    }),
    f(83, ['T', 'L1', 'Eb']),
    f(84, ['L1', 'Eb']),
    f(85, ['Eb']),
    f(86, ['T', 'L2', 'L3', 'Eb']),
  ],
};
