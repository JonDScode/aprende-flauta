// Modelo de datos unificado para los tres instrumentos.
// Los midi de las digitaciones y canciones son SIEMPRE altura ESCRITA
// (la dulce y la fife suenan una octava arriba: soundingOffset = +12).

export type HoleState = 'c' | 'o' | 'h'; // cerrado | abierto | medio (pulgar pellizcado)

export type RecorderVariant = 'baroque' | 'german';

export type FingerName = 'thumb' | 'index' | 'middle' | 'ring' | 'pinky';

export const FINGER_NAMES: Record<FingerName, { es: string; en: string }> = {
  thumb: { es: 'Pulgar', en: 'Thumb' },
  index: { es: 'Índice', en: 'Index' },
  middle: { es: 'Medio', en: 'Middle' },
  ring: { es: 'Anular', en: 'Ring' },
  pinky: { es: 'Meñique', en: 'Pinky' },
};

export interface LayoutRow {
  /** ids de los elementos de esta fila; 2 ids = agujero doble (dos puntos dentro de un círculo) */
  ids: string[];
  /** mano que opera el elemento (para el esquema anatómico) */
  hand?: 'L' | 'R';
  /** dedo que opera el elemento (para el esquema anatómico) */
  finger?: FingerName;
  /** etiqueta corta mostrada en el diagrama grande (llaves de traversa, T de pulgar) */
  label?: string;
  /** el agujero del pulgar se dibuja con anillo distintivo */
  thumb?: boolean;
  /** separación visual antes de esta fila (cambio de mano → dibuja la raya separadora) */
  gapBefore?: boolean;
  /**
   * forma del elemento:
   * hole (agujero) · thumbFlute (pulgar doble Si♭+Si de traversa) · gsHook (gancho Sol#) ·
   * trill (llavecita de trino) · shoe (zapatito de Mi♭) · roller (rodillos del pie, 2 ids)
   */
  kind?: 'hole' | 'thumbFlute' | 'gsHook' | 'trill' | 'shoe' | 'roller';
  /** desplazamiento horizontal: negativo = detrás/lateral del tubo (pulgar, último agujero) */
  xOffset?: number;
  /** tamaño relativo del agujero (1 = normal); los agujeros reales no son todos iguales */
  size?: number;
  /** tamaño según variante de digitación (barroca: 4 pequeño y 5 grande; alemana: al revés) */
  sizeByVariant?: Partial<Record<RecorderVariant, number>>;
  /** elemento flotante: no avanza la columna, se ancla junto a la fila anterior */
  float?: 'left' | 'right';
  /** desplazamiento vertical del flotante respecto a la fila anterior
   *  (0 = misma fila; por defecto queda entre la anterior y la siguiente) */
  floatDy?: number;
}

export interface Fingering {
  /** altura escrita (midi). Ej: 71 = Si4 escrito */
  midi: number;
  /** solo flauta dulce: a qué variante aplica; undefined = ambas */
  variant?: RecorderVariant;
  /** elementos NO abiertos: id -> 'c' | 'h'. Lo no listado está abierto */
  state: Record<string, HoleState>;
  /** false = pendiente de verificar contra fuente canónica */
  verified?: boolean;
  /** consejo pedagógico mostrado junto al diagrama grande */
  hint?: string;
  /** digitación alternativa ("or" en los charts): se muestra en el explorador,
   *  pero la tab de las canciones usa la principal */
  alternative?: boolean;
}

export interface Instrument {
  id: 'recorder' | 'fife' | 'flute';
  name: string;
  /** semitonos que suena por encima de lo escrito */
  soundingOffset: number;
  /** programa General MIDI (base 0) para el sintetizador */
  program: number;
  layout: LayoutRow[];
  fingerings: Fingering[];
}

export interface Song {
  id: string;
  title: string;
  subtitle?: string;
  level: number;
  origin: string;
  abc: string;
  /** midis escritos que usa la canción (para chips y para saber qué enseña) */
  notes: number[];
}

const ES_NAMES = ['Do', 'Do#', 'Re', 'Re#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si'];
const EN_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export function noteName(midi: number): { es: string; en: string; octave: number } {
  const pc = ((midi % 12) + 12) % 12;
  return { es: ES_NAMES[pc], en: EN_NAMES[pc], octave: Math.floor(midi / 12) - 1 };
}

/** "Si (B4)" para midi 71 */
export function noteLabel(midi: number): string {
  const n = noteName(midi);
  return `${n.es} (${n.en}${n.octave})`;
}

export function getFingering(
  instrument: Instrument,
  midi: number,
  variant?: RecorderVariant,
): Fingering | undefined {
  const candidates = instrument.fingerings.filter(
    (f) => f.midi === midi && !f.alternative && (f.variant === variant || f.variant === undefined),
  );
  // la específica de la variante gana sobre la compartida
  return candidates.find((f) => f.variant === variant) ?? candidates[0];
}

export function midiToFreq(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}
