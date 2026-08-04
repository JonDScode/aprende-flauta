import type { Instrument, RecorderVariant } from '../../types';
import { recorder } from './recorder';
import { fife } from './fife';
import { flute } from './flute';

export { recorder, fife, flute };

/** Opciones que ve el usuario: instrumento + variante de digitación */
export interface InstrumentChoice {
  id: string;
  name: string;
  short: string;
  instrument: Instrument;
  variant?: RecorderVariant;
}

export const INSTRUMENT_CHOICES: InstrumentChoice[] = [
  { id: 'recorder-baroque', name: 'Flauta dulce (barroca)', short: 'Dulce barroca', instrument: recorder, variant: 'baroque' },
  { id: 'recorder-german', name: 'Flauta dulce (alemana)', short: 'Dulce alemana', instrument: recorder, variant: 'german' },
  { id: 'fife', name: 'Fife Yamaha YRF-21', short: 'Fife', instrument: fife },
  { id: 'flute', name: 'Flauta traversa', short: 'Traversa', instrument: flute },
];
