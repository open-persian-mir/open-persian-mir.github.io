import React, { useState } from 'react';

interface ScaleDegree {
  note: string;
  persianName: string;
  centsFromRoot: number;
  role?: string;
}

const SHUR_DEGREES: ScaleDegree[] = [
  { note: 'D4', persianName: 'Āghāz', centsFromRoot: 0, role: 'Āghāz' },
  { note: 'E♭𝄳4', persianName: 'Mi Koron', centsFromRoot: 140, role: 'Neutral 2nd' },
  { note: 'F4', persianName: 'Fa', centsFromRoot: 300 },
  { note: 'G4', persianName: 'Sol', centsFromRoot: 500, role: 'Shāhed' },
  { note: 'A♭4', persianName: 'La Bemol', centsFromRoot: 600, role: 'Moteghayyer' },
  { note: 'B♭4', persianName: 'Si Bemol', centsFromRoot: 800 },
  { note: 'C5', persianName: 'Do', centsFromRoot: 1000 },
  { note: 'D5', persianName: 'Re (Octave)', centsFromRoot: 1200 },
];

export default function DastgahExplorer() {
  const [activeNote, setActiveNote] = useState<string | null>(null);

  const playMicrotonalNote = (cents: number, label: string) => {
    setActiveNote(label);
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const baseFreq = 293.66; // D4
    osc.frequency.value = baseFreq * Math.pow(2, cents / 1200);
    osc.type = 'triangle';

    gain.gain.setValueAtTime(0.22, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.0);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1.0);
  };

  return (
    <div className="rounded-xl border border-teal-800/60 bg-slate-900/80 p-6 my-8">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-teal-300">Dastgāh-e Shur — Interactive Pitch Lab</h2>
          <p className="text-xs text-slate-400">Click a scale degree to synthesize microtonal cent offsets via Web Audio API</p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
          Neutral 2nd ≈ +140¢
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
        {SHUR_DEGREES.map((deg) => (
          <button
            type="button"
            key={deg.note}
            onClick={() => playMicrotonalNote(deg.centsFromRoot, deg.note)}
            className={`p-3 rounded-lg border text-left transition ${
              activeNote === deg.note
                ? 'border-amber-400 bg-amber-500/20'
                : 'border-slate-700 bg-slate-800/70 hover:border-teal-500'
            }`}
          >
            <div className="text-base font-bold text-white">{deg.note}</div>
            <div className="text-xs text-slate-300 truncate">{deg.persianName}</div>
            <div className="text-[11px] font-mono text-teal-400 mt-1">+{deg.centsFromRoot}¢</div>
            {deg.role && (
              <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-amber-200">
                {deg.role}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
