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

  // 1. Dastgāh Cycle Visualizer
  const dcFig = document.getElementById("dastgah-cycle-figure");
  if (dcFig) {
    const stages = Array.from(dcFig.querySelectorAll(".dc-stage"));
    const playAllBtn = document.getElementById("dc-play-all");
    const readout = document.getElementById("dc-readout");
    let dcTimers = [];

    function clearDc() {
      dcTimers.forEach((id) => window.clearTimeout(id));
      dcTimers = [];
    }

    function parseFreqs(el) {
      return (el.getAttribute("data-dc-freqs") || "")
        .split(",")
        .map((n) => parseFloat(n.trim()))
        .filter((n) => Number.isFinite(n) && n > 0);
    }

    stages.forEach((stage) => {
      const btn = stage.querySelector("[data-dc-play]");
      btn?.addEventListener("click", async () => {
        clearDc();
        stages.forEach((s) => s.classList.remove("is-active"));
        stage.classList.add("is-active");
        if (readout) readout.textContent = stage.getAttribute("data-dc-desc") || "";

        const ctx = await unlockAudio();
        if (!ctx) return;
        const freqs = parseFreqs(stage);
        const t0 = ctx.currentTime + 0.02;
        freqs.forEach((f, idx) => scheduleTone(ctx, f, t0 + idx * 0.34, 0.28, 0.2));
      });
    });

    playAllBtn?.addEventListener("click", async () => {
      clearDc();
      const ctx = await unlockAudio();
      if (!ctx) return;

      let cursorSec = 0;
      const t0 = ctx.currentTime + 0.02;

      stages.forEach((stage) => {
        const freqs = parseFreqs(stage);
        const desc = stage.getAttribute("data-dc-desc") || "";
        const startOffsetSec = cursorSec;

        dcTimers.push(
          window.setTimeout(() => {
            stages.forEach((s) => s.classList.remove("is-active"));
            stage.classList.add("is-active");
            if (readout) readout.textContent = desc;
          }, startOffsetSec * 1000)
        );

        freqs.forEach((f, idx) => {
          scheduleTone(ctx, f, t0 + startOffsetSec + idx * 0.32, 0.26, 0.19);
        });

        cursorSec += freqs.length * 0.32 + 0.35;
      });
    });
  }

  // 2. Forūd-e Māhūr Cadence
  const fmFig = document.getElementById("forud-mahur-figure");
  if (fmFig) {
    const pills = Array.from(fmFig.querySelectorAll(".fm-pill"));
    const playBtn = document.getElementById("fm-play");
    const readout = document.getElementById("fm-readout");
    let fmTimers = [];

    function clearFm() {
      fmTimers.forEach((id) => window.clearTimeout(id));
      fmTimers = [];
      pills.forEach((p) => p.classList.remove("is-lit"));
    }

    playBtn?.addEventListener("click", async () => {
      clearFm();
      if (readout) {
        readout.textContent = "Playing Forūd-e Māhūr: F4 → E4 → D4 → C4 → B3 → C4 (resolution).";
      }

      const ctx = await unlockAudio();
      if (!ctx) return;

      let offsetSec = 0;
      const t0 = ctx.currentTime + 0.02;

      pills.forEach((pill) => {
        const hz = parseFloat(pill.getAttribute("data-fm-hz") || "261.63");
        const dur = parseFloat(pill.getAttribute("data-fm-dur") || "0.4");
        const startSec = offsetSec;

        scheduleTone(ctx, hz, t0 + startSec, dur * 0.9, 0.21);

        fmTimers.push(
          window.setTimeout(() => {
            pills.forEach((p) => p.classList.remove("is-lit"));
            pill.classList.add("is-lit");
          }, startSec * 1000),
          window.setTimeout(() => {
            pill.classList.remove("is-lit");
          }, (startSec + dur * 0.9) * 1000)
        );

        offsetSec += dur;
      });
    });
  }

  // 3. 7 Dastgāhs & 5 Āvāzes Tree
  const treeFig = document.getElementById("dastgah-tree-figure");
  if (treeFig) {
    const branchBtns = Array.from(treeFig.querySelectorAll("[data-dt-id]"));
    const panels = Array.from(treeFig.querySelectorAll("[data-dt-panel]"));

    branchBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-dt-id");
        branchBtns.forEach((b) => {
          const selected = b === btn;
          b.classList.toggle("active", selected);
          b.setAttribute("aria-selected", selected ? "true" : "false");
        });
        panels.forEach((panel) => {
          panel.classList.toggle("is-hidden", panel.getAttribute("data-dt-panel") !== id);
        });
      });
    });
  }
});