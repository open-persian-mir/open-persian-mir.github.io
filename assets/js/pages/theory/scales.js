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

  // 1. Sound Field & Register Explorer
  const sfFig = document.getElementById("sound-field-figure");
  if (sfFig) {
    const readout = document.getElementById("sf-readout");
    sfFig.querySelectorAll(".sf-card").forEach((card) => {
      const btn = card.querySelector("[data-sf-play]");
      const freqs = (card.getAttribute("data-sf-freqs") || "")
        .split(",")
        .map((n) => parseFloat(n.trim()))
        .filter((n) => Number.isFinite(n) && n > 0);
      const note = card.getAttribute("data-sf-note") || "";

      btn?.addEventListener("click", async () => {
        sfFig.querySelectorAll(".sf-card").forEach((c) => c.classList.remove("is-active"));
        card.classList.add("is-active");
        if (readout && note) readout.textContent = note;

        const ctx = await unlockAudio();
        if (!ctx) return;
        const t0 = ctx.currentTime + 0.02;
        freqs.forEach((f, idx) => scheduleTone(ctx, f, t0 + idx * 0.32, 0.28, 0.2));
      });
    });
  }

  // 2. Scale Comparison Figure
  const scFig = document.getElementById("scale-comparison-figure");
  if (scFig) {
    const readout = document.getElementById("sc-readout");
    let timers = [];
    let activeBtn = null;

    function clearSc() {
      timers.forEach((id) => window.clearTimeout(id));
      timers = [];
      scFig.querySelectorAll(".sc-pill.is-lit").forEach((el) => el.classList.remove("is-lit"));
      if (activeBtn) {
        activeBtn.classList.remove("is-playing");
        activeBtn = null;
      }
    }

    scFig.querySelectorAll(".sc-row").forEach((row) => {
      const btn = row.querySelector("[data-sc-play]");
      const pills = Array.from(row.querySelectorAll(".sc-pill"));
      const desc = row.getAttribute("data-sc-desc") || "";
      const freqs = (row.getAttribute("data-sc-freqs") || "")
        .split(",")
        .map((n) => parseFloat(n.trim()))
        .filter((n) => Number.isFinite(n) && n > 0);

      if (!btn || freqs.length === 0) return;

      btn.addEventListener("click", async () => {
        clearSc();
        activeBtn = btn;
        btn.classList.add("is-playing");
        if (readout && desc) readout.textContent = desc;

        const stepSec = freqs.length > 10 ? 0.22 : 0.38;
        const durSec = freqs.length > 10 ? 0.18 : 0.32;

        freqs.forEach((_, idx) => {
          const ms = idx * stepSec * 1000;
          timers.push(
            window.setTimeout(() => {
              pills.forEach((p) => p.classList.remove("is-lit"));
              pills[idx]?.classList.add("is-lit");
            }, ms),
            window.setTimeout(() => pills[idx]?.classList.remove("is-lit"), ms + durSec * 1000)
          );
        });

        timers.push(
          window.setTimeout(() => {
            btn.classList.remove("is-playing");
            if (activeBtn === btn) activeBtn = null;
          }, freqs.length * stepSec * 1000)
        );

        const ctx = await unlockAudio();
        if (!ctx) return;
        const t0 = ctx.currentTime + 0.02;
        freqs.forEach((f, idx) => scheduleTone(ctx, f, t0 + idx * stepSec, durSec, 0.19));
      });
    });
  }

  // 3. Maqām Builder
  const mbFig = document.getElementById("maqam-builder-figure");
  if (mbFig) {
    const pills = Array.from(mbFig.querySelectorAll("[data-mb-deg]"));
    const presetBtns = Array.from(mbFig.querySelectorAll("[data-mb-preset]"));
    const playBtn = document.getElementById("mb-play");
    const readout = document.getElementById("mb-readout");

    const presets = {
      "textbook-mode": {
        focus: [1, 4],
        sequence: [4, 5, 4, 6, 5, 4, 3, 2, 1],
        note: "Dwelling on degree 5 (G) and concluding on degree 2 (D) establishes a clear degree hierarchy and modal ethos."
      },
      "lower-dang": {
        focus: [0, 2],
        sequence: [2, 3, 2, 1, 2, 1, 0],
        note: "Confining the melody to a single 4-note dāng (C–D–E–F) with emphasis on E and cadence on C illustrates how a Persian mode can operate within just four pitches."
      },
      "upper-dang": {
        focus: [4, 6],
        sequence: [4, 5, 6, 5, 7, 6, 5, 4],
        note: "Using the upper tetrachord (G–A–B♭–C5) with a recurring melodic turn around A and B♭ creates a bright, elevated modal character."
      }
    };

    let activeKey = "textbook-mode";
    let timers = [];

    function clearMb() {
      timers.forEach((id) => window.clearTimeout(id));
      timers = [];
      pills.forEach((p) => p.classList.remove("is-lit"));
    }

    function applyPreset(key) {
      activeKey = presets[key] ? key : "textbook-mode";
      const cfg = presets[activeKey];
      presetBtns.forEach((b) => b.classList.toggle("active", b.getAttribute("data-mb-preset") === activeKey));
      pills.forEach((p, idx) => p.classList.toggle("is-focus", cfg.focus.includes(idx)));
      if (readout) readout.textContent = cfg.note;
    }

    presetBtns.forEach((b) => {
      b.addEventListener("click", () => {
        clearMb();
        applyPreset(b.getAttribute("data-mb-preset"));
      });
    });

    playBtn?.addEventListener("click", async () => {
      clearMb();
      const cfg = presets[activeKey];
      const stepSec = 0.4;
      const durSec = 0.34;

      cfg.sequence.forEach((degIdx, i) => {
        const ms = i * stepSec * 1000;
        timers.push(
          window.setTimeout(() => {
            pills.forEach((p) => p.classList.remove("is-lit"));
            pills[degIdx]?.classList.add("is-lit");
          }, ms),
          window.setTimeout(() => pills[degIdx]?.classList.remove("is-lit"), ms + durSec * 1000)
        );
      });

      const ctx = await unlockAudio();
      if (!ctx) return;
      const t0 = ctx.currentTime + 0.02;
      cfg.sequence.forEach((degIdx, i) => {
        const hz = parseFloat(pills[degIdx]?.getAttribute("data-hz") || "293.66");
        scheduleTone(ctx, hz, t0 + i * stepSec, durSec, 0.2);
      });
    });

    applyPreset(activeKey);
  }
});