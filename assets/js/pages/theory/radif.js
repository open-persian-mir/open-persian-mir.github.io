document.addEventListener("DOMContentLoaded", () => {
  let audioCtx = null;

  async function unlockAudio() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!audioCtx || audioCtx.state === "closed") {
      audioCtx = new AudioCtx();
    }
    if (audioCtx.state === "suspended") {
      await audioCtx.resume();
    }
    return audioCtx;
  }

  function scheduleTone(ctx, freq, startAt, duration = 0.36, peakGain = 0.2) {
    if (!ctx || !Number.isFinite(freq) || freq <= 0) return;

    const start = Math.max(ctx.currentTime, startAt);
    const stop = start + duration + 0.04;

    const osc = ctx.createOscillator();
    const harm = ctx.createOscillator();
    const harmGain = ctx.createGain();
    const env = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, start);

    harm.type = "sine";
    harm.frequency.setValueAtTime(freq * 2, start);
    harmGain.gain.setValueAtTime(0.12, start);

    env.gain.setValueAtTime(0.0001, start);
    env.gain.linearRampToValueAtTime(peakGain, start + 0.02);
    env.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    osc.connect(env);
    harm.connect(harmGain);
    harmGain.connect(env);
    env.connect(ctx.destination);

    osc.start(start);
    harm.start(start);
    osc.stop(stop);
    harm.stop(stop);
  }

  // 1. Gūsheh Classifier Audio Player
  const gcFig = document.getElementById("gusheh-classifier-figure");
  if (gcFig) {
    const readout = document.getElementById("gc-readout");
    let timers = [];
    let activeBtn = null;

    function clearGc() {
      timers.forEach((id) => window.clearTimeout(id));
      timers = [];
      gcFig.querySelectorAll(".gc-pill.is-lit").forEach((p) => p.classList.remove("is-lit"));
      if (activeBtn) {
        activeBtn.classList.remove("is-playing");
        activeBtn = null;
      }
    }

    gcFig.querySelectorAll(".gc-row").forEach((row) => {
      const btn = row.querySelector("[data-gc-play]");
      const pills = Array.from(row.querySelectorAll(".gc-pill"));
      const desc = row.getAttribute("data-gc-desc") || "";
      const freqs = (row.getAttribute("data-gc-freqs") || "")
        .split(",")
        .map((n) => parseFloat(n.trim()))
        .filter((n) => Number.isFinite(n) && n > 0);
      const durs = (row.getAttribute("data-gc-durs") || "")
        .split(",")
        .map((n) => parseFloat(n.trim()));

      if (!btn || freqs.length === 0) return;

      btn.addEventListener("click", async () => {
        clearGc();
        activeBtn = btn;
        btn.classList.add("is-playing");
        if (readout && desc) readout.textContent = desc;

        let offsetSec = 0;
        const schedule = freqs.map((hz, idx) => {
          const dur = Number.isFinite(durs[idx]) && durs[idx] > 0 ? durs[idx] : 0.36;
          const start = offsetSec;
          offsetSec += dur;
          return { hz, dur, start, idx };
        });

        schedule.forEach((s) => {
          timers.push(
            window.setTimeout(() => {
              pills.forEach((p) => p.classList.remove("is-lit"));
              pills[s.idx]?.classList.add("is-lit");
            }, s.start * 1000),
            window.setTimeout(() => {
              pills[s.idx]?.classList.remove("is-lit");
            }, (s.start + s.dur * 0.88) * 1000)
          );
        });

        timers.push(
          window.setTimeout(() => {
            btn.classList.remove("is-playing");
            if (activeBtn === btn) activeBtn = null;
          }, offsetSec * 1000)
        );

        const ctx = await unlockAudio();
        if (!ctx) return;
        const t0 = ctx.currentTime + 0.02;
        schedule.forEach((s) => scheduleTone(ctx, s.hz, t0 + s.start, s.dur * 0.88, 0.2));
      });
    });
  }

  // 2. Gūsheh Etymology Explorer
  const geFig = document.getElementById("gusheh-etymology-figure");
  if (geFig) {
    const tabs = Array.from(geFig.querySelectorAll("[data-ge-cat]"));
    const panels = Array.from(geFig.querySelectorAll("[data-ge-panel]"));

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const catId = tab.getAttribute("data-ge-cat");
        tabs.forEach((t) => {
          const active = t === tab;
          t.classList.toggle("active", active);
          t.setAttribute("aria-selected", active ? "true" : "false");
        });
        panels.forEach((panel) => {
          panel.classList.toggle("is-hidden", panel.getAttribute("data-ge-panel") !== catId);
        });
      });
    });
  }

  // 3. Tree of Persian Classical Music
  const rtFig = document.getElementById("radif-tree-figure");
  if (rtFig) {
    const layers = Array.from(rtFig.querySelectorAll(".rt-layer"));
    const readout = document.getElementById("rt-readout");

    layers.forEach((layer) => {
      layer.addEventListener("click", () => {
        layers.forEach((l) => l.classList.remove("is-active"));
        layer.classList.add("is-active");
        if (readout) {
          readout.textContent = layer.getAttribute("data-rt-detail") || "";
        }
      });
    });
  }
});