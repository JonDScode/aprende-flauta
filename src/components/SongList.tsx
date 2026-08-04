import type { Song } from '../types';
import { noteName } from '../types';
import { LEVELS, songsByLevel } from '../data/songs';

interface Props {
  onSelect: (song: Song) => void;
  isDone: (id: string) => boolean;
  toggle: (id: string) => void;
}

export default function SongList({ onSelect, isDone, toggle }: Props) {
  return (
    <div className="song-list">
      {[...songsByLevel().entries()].map(([level, songs]) => {
        const doneCount = songs.filter((s) => isDone(s.id)).length;
        return (
          <section key={level} className="level-section">
            <header className="level-header">
              <span className="level-badge">Nivel {level}</span>
              <div>
                <h2>{LEVELS[level]?.name ?? ''}</h2>
                <p>{LEVELS[level]?.detail ?? ''}</p>
              </div>
              <span className="level-progress">
                {doneCount}/{songs.length}
              </span>
            </header>
            <div className="level-songs">
              {songs.map((song) => (
                <div key={song.id} className={`song-card${isDone(song.id) ? ' song-card--done' : ''}`}>
                  <button className="song-card-main" onClick={() => onSelect(song)}>
                    <span className="song-title">{song.title}</span>
                    {song.subtitle && <span className="song-subtitle">{song.subtitle}</span>}
                    <span className="song-origin">{song.origin}</span>
                    <span className="song-notes">
                      {song.notes.map((m) => (
                        <span key={m} className="note-chip">
                          {noteName(m).es}
                        </span>
                      ))}
                    </span>
                  </button>
                  <button
                    className="song-check"
                    onClick={() => toggle(song.id)}
                    title={isDone(song.id) ? 'Marcar como pendiente' : 'Marcar como aprendida'}
                    aria-pressed={isDone(song.id)}
                  >
                    {isDone(song.id) ? '✓ Aprendida' : 'Marcar aprendida'}
                  </button>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
