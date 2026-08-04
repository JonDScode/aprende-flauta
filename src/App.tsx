import { useEffect, useState } from 'react';
import './App.css';
import { INSTRUMENT_CHOICES, type InstrumentChoice } from './data/fingerings';
import { SONGS } from './data/songs';
import type { Song } from './types';
import SongList from './components/SongList';
import SheetMusic from './components/SheetMusic';
import Explorer from './components/Explorer';
import Course from './components/Course';
import FingeringDiagram from './components/FingeringDiagram';
import { useProgress } from './lib/progress';

type Page = 'songs' | 'course' | 'explorer';

export default function App() {
  const [choiceId, setChoiceId] = useState<string>(
    () => localStorage.getItem('flute-instrument') ?? 'recorder-baroque',
  );
  const [page, setPage] = useState<Page>('songs');
  const [song, setSong] = useState<Song | null>(null);
  const progress = useProgress();

  const choice: InstrumentChoice =
    INSTRUMENT_CHOICES.find((c) => c.id === choiceId) ?? INSTRUMENT_CHOICES[0];

  useEffect(() => {
    localStorage.setItem('flute-instrument', choice.id);
  }, [choice.id]);

  return (
    <div className="app">
      <header className="app-header">
        <h1 onClick={() => { setSong(null); setPage('songs'); }}>
          <img src={`${import.meta.env.BASE_URL}logo-mark.png`} alt="Aprende Flauta" className="app-logo-img" />
          Aprende Flauta
        </h1>
        <nav className="app-nav">
          <button
            className={page === 'explorer' ? 'active' : ''}
            onClick={() => { setPage('explorer'); setSong(null); }}
          >
            Notas
          </button>
          <button
            className={page === 'course' ? 'active' : ''}
            onClick={() => { setPage('course'); setSong(null); }}
          >
            Primeros pasos
          </button>
          <button
            className={page === 'songs' ? 'active' : ''}
            onClick={() => { setPage('songs'); setSong(null); }}
          >
            Repertorio
          </button>
        </nav>
        <select
          className="instrument-select"
          value={choice.id}
          onChange={(e) => setChoiceId(e.target.value)}
          aria-label="Instrumento"
        >
          {INSTRUMENT_CHOICES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </header>

      <main className="app-main">
        {page === 'explorer' ? (
          <Explorer choice={choice} />
        ) : page === 'course' ? (
          <Course />
        ) : song ? (
          <div className="song-view">
            <button className="back-button" onClick={() => setSong(null)}>
              ← Repertorio
            </button>
            <div className="song-view-head">
              <div>
                <h2>{song.title}</h2>
                {song.subtitle && <p className="song-view-subtitle">{song.subtitle}</p>}
              </div>
              <button
                className={`song-check${progress.isDone(song.id) ? ' song-check--done' : ''}`}
                onClick={() => progress.toggle(song.id)}
              >
                {progress.isDone(song.id) ? '✓ Aprendida' : 'Marcar aprendida'}
              </button>
            </div>
            <div className="song-notes-strip">
              <h3>Notas de esta canción</h3>
              <div className="song-notes-cards">
                {song.notes.map((m) => (
                  <div key={m} className="song-note-card">
                    <FingeringDiagram
                      instrument={choice.instrument}
                      variant={choice.variant}
                      midi={m}
                      scale={1.5}
                      showName
                      simpleName
                      showStaff
                      showHint={false}
                    />
                  </div>
                ))}
              </div>
            </div>
            <SheetMusic abc={song.abc} instrument={choice.instrument} variant={choice.variant} />
          </div>
        ) : (
          <SongList onSelect={setSong} isDone={progress.isDone} toggle={progress.toggle} />
        )}
      </main>

      <footer className="app-footer">
        {SONGS.length} canciones · {choice.name} · repertorio de dominio público
      </footer>
    </div>
  );
}
