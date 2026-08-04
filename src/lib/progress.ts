import { useCallback, useEffect, useState } from 'react';

// Progreso del estudiante: conjunto de ids de canciones marcadas como aprendidas.
// Persistido en localStorage; global (aprender una canción cuenta en cualquier instrumento).

const KEY = 'flute-progress';

function load(): Set<string> {
  try {
    const raw = localStorage.getItem(KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

export function useProgress() {
  const [done, setDone] = useState<Set<string>>(load);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify([...done]));
  }, [done]);

  const toggle = useCallback((id: string) => {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const isDone = useCallback((id: string) => done.has(id), [done]);

  return { done, toggle, isDone };
}
