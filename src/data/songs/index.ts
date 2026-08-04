import type { Song } from '../../types';
import hotCrossBuns from './hot-cross-buns.abc?raw';
import merrily from './merrily.abc?raw';
import auClair from './au-clair.abc?raw';
import mary from './mary.abc?raw';
import rainRain from './rain-rain.abc?raw';
import oldMacdonald from './old-macdonald.abc?raw';
import lightlyRow from './lightly-row.abc?raw';
import odeToJoy from './ode-to-joy.abc?raw';
import twinkle from './twinkle.abc?raw';
import jingleBells from './jingle-bells.abc?raw';
import amazingGrace from './amazing-grace.abc?raw';
import happyBirthday from './happy-birthday.abc?raw';
import ohSusanna from './oh-susanna.abc?raw';
import silentNight from './silent-night.abc?raw';
import condorPasa from './condor-pasa.abc?raw';

export const LEVELS: Record<number, { name: string; detail: string }> = {
  1: { name: 'Si · La · Sol', detail: 'Solo mano izquierda: tres notas, tres dedos.' },
  2: { name: 'Mano derecha y Do′', detail: 'Se suman Mi y Re graves, y el Do agudo.' },
  3: { name: 'Hexacordo Sol–Re′', detail: 'Todo el rango de Sol a Re agudo.' },
  4: { name: 'Primera octava completa', detail: 'Do grave y Fa#: aparece la horquilla barroca.' },
  5: { name: 'Tonalidades menores', detail: 'Compás 6/8, modo menor y frases más largas.' },
  6: { name: 'Registro agudo', detail: 'Notas altas y ámbito amplio: el reto final.' },
};

export const SONGS: Song[] = [
  {
    id: 'hot-cross-buns',
    title: 'Hot Cross Buns',
    level: 1,
    origin: 'Pregón inglés, s. XVIII',
    abc: hotCrossBuns,
    notes: [67, 69, 71],
  },
  {
    id: 'merrily',
    title: 'Merrily We Roll Along',
    level: 1,
    origin: 'Tradicional, EE. UU., s. XIX',
    abc: merrily,
    notes: [67, 69, 71],
  },
  {
    id: 'au-clair',
    title: 'Au clair de la lune',
    level: 1,
    origin: 'Tradicional, Francia, s. XVIII',
    abc: auClair,
    notes: [67, 69, 71],
  },
  {
    id: 'mary',
    title: 'Mary Had a Little Lamb',
    level: 2,
    origin: 'EE. UU., 1830',
    abc: mary,
    notes: [67, 69, 71, 74],
  },
  {
    id: 'rain-rain',
    title: 'Rain, Rain, Go Away',
    subtitle: 'Canción de corro',
    level: 2,
    origin: 'Tradicional, Inglaterra',
    abc: rainRain,
    notes: [67, 71, 72],
  },
  {
    id: 'old-macdonald',
    title: 'Old MacDonald',
    subtitle: 'En la granja de Pepito',
    level: 2,
    origin: 'Tradicional, EE. UU.',
    abc: oldMacdonald,
    notes: [62, 64, 67, 69, 71],
  },
  {
    id: 'lightly-row',
    title: 'Lightly Row',
    subtitle: 'Hänschen klein',
    level: 3,
    origin: 'Tradicional, Alemania',
    abc: lightlyRow,
    notes: [67, 69, 71, 72, 74],
  },
  {
    id: 'ode-to-joy',
    title: 'Himno a la Alegría',
    subtitle: 'Oda a la Alegría',
    level: 3,
    origin: 'Beethoven, 9.ª sinfonía, 1824',
    abc: odeToJoy,
    notes: [62, 67, 69, 71, 72, 74],
  },
  {
    id: 'jingle-bells',
    title: 'Jingle Bells',
    subtitle: 'Estribillo',
    level: 3,
    origin: 'J. Pierpont, EE. UU., 1857',
    abc: jingleBells,
    notes: [67, 69, 71, 72, 74],
  },
  {
    id: 'amazing-grace',
    title: 'Amazing Grace',
    level: 3,
    origin: 'Melodía “New Britain”, EE. UU., 1835',
    abc: amazingGrace,
    notes: [62, 64, 67, 69, 71, 74],
  },
  {
    id: 'twinkle',
    title: 'Estrellita',
    subtitle: 'Twinkle, Twinkle, Little Star',
    level: 4,
    origin: '“Ah! vous dirai-je, maman”, Francia, 1761',
    abc: twinkle,
    notes: [60, 62, 64, 65, 67, 69],
  },
  {
    id: 'happy-birthday',
    title: 'Cumpleaños feliz',
    subtitle: 'Dominio público desde 2016',
    level: 4,
    origin: 'Hill, EE. UU., 1893',
    abc: happyBirthday,
    notes: [62, 64, 66, 67, 69, 71, 72, 74],
  },
  {
    id: 'oh-susanna',
    title: 'Oh! Susanna',
    level: 4,
    origin: 'S. Foster, EE. UU., 1848',
    abc: ohSusanna,
    notes: [60, 62, 64, 67, 69],
  },
  {
    id: 'silent-night',
    title: 'Noche de paz',
    subtitle: 'Villancico',
    level: 5,
    origin: 'F. Gruber, Austria, 1818',
    abc: silentNight,
    notes: [62, 64, 65, 67, 69, 71, 72, 74, 77],
  },
  {
    id: 'condor-pasa',
    title: 'El cóndor pasa',
    subtitle: 'Melodía andina',
    level: 6,
    origin: 'D. Alomía Robles, Perú, 1913',
    abc: condorPasa,
    notes: [64, 67, 69, 71, 74, 76],
  },
];

export function songsByLevel(): Map<number, Song[]> {
  const map = new Map<number, Song[]>();
  for (const song of SONGS) {
    if (!map.has(song.level)) map.set(song.level, []);
    map.get(song.level)!.push(song);
  }
  return new Map([...map.entries()].sort((a, b) => a[0] - b[0]));
}
