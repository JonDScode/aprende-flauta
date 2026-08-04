import { useEffect, useRef, useState } from 'react';
import abcjs from 'abcjs';
import 'abcjs/abcjs-audio.css';
import type { Instrument, RecorderVariant } from '../types';
import { drawFlautoTab, type TabNoteEvent } from '../lib/flautoTab';
import { diagramGeometry } from '../lib/diagramGeometry';
import FingeringDiagram from './FingeringDiagram';

interface Props {
  abc: string;
  instrument: Instrument;
  variant?: RecorderVariant;
}

/**
 * Pentagrama (abcjs) + flauto-tab bajo cada nota + reproducción con cursor.
 * La tab se dibuja dentro del propio SVG de abcjs para heredar el responsive.
 */
export default function SheetMusic({ abc, instrument, variant }: Props) {
  const paperRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const synthRef = useRef<InstanceType<typeof abcjs.synth.SynthController> | null>(null);
  const tabGroupsRef = useRef<Map<number, SVGGElement>>(new Map());
  const highlightedRef = useRef<Element[]>([]);
  const [showTab, setShowTab] = useState(true);
  const [currentMidi, setCurrentMidi] = useState<number | null>(null);

  useEffect(() => {
    const paper = paperRef.current;
    if (!paper) return;

    // espacio entre sistemas y al pie según la altura real de la columna de tab
    const sampleHeight = diagramGeometry(instrument, instrument.fingerings[0], variant).height;
    const tabSpace = Math.round(sampleHeight + 45);
    // pocos compases por sistema para que las columnas de la tab respiren
    const abcSource = showTab ? `%%staffsep ${tabSpace}\n%%barsperstaff 4\n${abc}` : abc;
    const visual = abcjs.renderAbc(paper, abcSource, {
      responsive: 'resize',
      add_classes: true,
      paddingbottom: showTab ? tabSpace - 20 : 20,
      staffwidth: 720,
    })[0];

    // setUpAudio rellena midiPitches en cada nota (sin él, los timings vienen sin altura)
    visual.setUpAudio({});
    visual.setTiming(0, 0);
    const timings = (visual as unknown as { noteTimings: TabNoteEvent[] }).noteTimings ?? [];
    tabGroupsRef.current = showTab
      ? drawFlautoTab(paper, timings, instrument, variant)
      : new Map();

    const clearHighlight = () => {
      for (const el of highlightedRef.current) el.classList.remove('note-active');
      highlightedRef.current = [];
      setCurrentMidi(null);
    };

    const cursorControl: abcjs.CursorControl = {
      onEvent: (ev: abcjs.NoteTimingEvent) => {
        for (const el of highlightedRef.current) el.classList.remove('note-active');
        highlightedRef.current = [];
        const pitches = ev.midiPitches as { pitch: number }[] | undefined;
        if (!pitches?.length || ev.left == null) return;
        const els: Element[] = ((ev.elements as unknown as Element[][]) ?? []).flat();
        const tabGroup = tabGroupsRef.current.get(Math.round(ev.left));
        if (tabGroup) els.push(tabGroup);
        for (const el of els) el.classList.add('note-active');
        highlightedRef.current = els;
        // los eventos del cursor traen la altura escrita (la transposición es solo del audio)
        setCurrentMidi(pitches[0].pitch);
      },
      onFinished: clearHighlight,
    };

    if (abcjs.synth.supportsAudio()) {
      if (!synthRef.current && controlsRef.current) {
        synthRef.current = new abcjs.synth.SynthController();
        synthRef.current.load(controlsRef.current, cursorControl, {
          displayPlay: true,
          displayProgress: true,
          displayWarp: true,
          displayLoop: true,
          displayRestart: true,
        });
      } else if (synthRef.current) {
        // re-vincular el cursor al nuevo render
        synthRef.current.load(controlsRef.current!, cursorControl, {
          displayPlay: true,
          displayProgress: true,
          displayWarp: true,
          displayLoop: true,
          displayRestart: true,
        });
      }
      synthRef.current?.setTune(visual, false, {
        program: instrument.program,
        midiTranspose: instrument.soundingOffset,
      });
    }

    return clearHighlight;
  }, [abc, instrument, variant, showTab]);

  return (
    <div className="sheet-music">
      <div className="sheet-toolbar">
        <label className="tab-toggle">
          <input type="checkbox" checked={showTab} onChange={(e) => setShowTab(e.target.checked)} />
          Mostrar flauto-tab
        </label>
      </div>
      <div className="sheet-layout">
        <div className="sheet-paper" ref={paperRef} />
        <aside className="current-fingering">
          {currentMidi != null ? (
            <FingeringDiagram
              instrument={instrument}
              variant={variant}
              midi={currentMidi}
              scale={3}
              showLabels={instrument.id === 'flute'}
              showName
            />
          ) : (
            <div className="current-placeholder">
              ▶ Reproduce para ver la digitación de cada nota en grande
            </div>
          )}
        </aside>
      </div>
      <div className="sheet-controls" ref={controlsRef} />
    </div>
  );
}
