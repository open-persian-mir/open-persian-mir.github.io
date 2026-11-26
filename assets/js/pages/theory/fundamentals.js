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

  // --- 1. Scale Comparison Figure ---
  const scaleFig = document.getElementById("scale-comparison-figure");
  if (scaleFig) {
    const readout = document.getElementById("fc-scale-readout");
    let timers = [];
    let activeBtn = null;

    function clearScalePlayback() {
      timers.forEach((id) => window.clearTimeout(id));
      timers = [];
      scaleFig.querySelectorAll(".fc-note-pill.is-lit").forEach((el) => {
        el.classList.remove("is-lit");
      });
      if (activeBtn) {
        activeBtn.classList.remove("is-playing");
        activeBtn = null;
      }
    }

    scaleFig.querySelectorAll(".fc-scale-row").forEach((row) => {
      const btn = row.querySelector("[data-fc-play]");
      const pills = Array.from(row.querySelectorAll(".fc-note-pill"));
      const desc = row.getAttribute("data-desc") || "";
      const freqs = (row.getAttribute("data-freqs") || "")
        .split(",")
        .map((n) => parseFloat(n.trim()))
        .filter((n) => Number.isFinite(n) && n > 0);

      if (!btn || freqs.length === 0) return;

      btn.addEventListener("click", async () => {
        clearScalePlayback();
        activeBtn = btn;
        btn.classList.add("is-playing");
        if (readout && desc) readout.textContent = desc;

        const stepSec = freqs.length > 10 ? 0.24 : 0.4;
        const durSec = freqs.length > 10 ? 0.2 : 0.34;

        freqs.forEach((_, idx) => {
          const offsetMs = idx * stepSec * 1000;
          timers.push(
            window.setTimeout(() => {
              pills.forEach((p) => p.classList.remove("is-lit"));
              if (pills[idx]) pills[idx].classList.add("is-lit");
            }, offsetMs),
            window.setTimeout(() => {
              if (pills[idx]) pills[idx].classList.remove("is-lit");
            }, offsetMs + durSec * 1000)
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
        freqs.forEach((freq, idx) => {
          scheduleTone(ctx, freq, t0 + idx * stepSec, durSec, 0.19);
        });
      });
    });
  }

  // --- 2. Degree Hierarchy Explorer ---
  const dhFig = document.getElementById("degree-hierarchy-figure");
  if (dhFig) {
    const pills = Array.from(dhFig.querySelectorAll("[data-dh-deg]"));
    const presetBtns = Array.from(dhFig.querySelectorAll("[data-dh-preset]"));
    const playBtn = document.getElementById("dh-play-phrase");
    const readout = document.getElementById("dh-readout");

    const presets = {
      "g-sh-d-kh": {
        roles: { 1: "خ", 3: "ی", 4: "آ / ش" },
        sequence: [4, 5, 4, 6, 5, 4, 3, 2, 1],
        note: "Same actual scale (C–D–E–F–G–A–B♭–C): emphasizing degree 5 (G, Shāhed ش), pausing on F (Īst ی), and resolving on degree 2 (D, Khātemeh خ)."
      },
      "c-centered": {
        roles: { 0: "خ", 2: "آ / ش", 4: "ی" },
        sequence: [2, 3, 4, 2, 3, 2, 1, 0],
        note: "Identical 7 pitches, shifted gravity: dwelling on E (Shāhed ش) and concluding on C (Khātemeh خ) creates a different modal feeling."
      },
      moteghayyer: {
        roles: { 0: "خ", 4: "آ / ش", 6: "م" },
        sequence: [4, 5, "Bnat", 7, 6, 5, 4, 2, 0],
        note: "Moteghayyer (م): degree 7 rises to B♮ (493.88 Hz) in ascent toward C5, then lowers to B♭ (466.16 Hz) in descent."
      }
    };

    let activePresetKey = "g-sh-d-kh";
    let dhTimers = [];

    function clearDhTimers() {
      dhTimers.forEach((id) => window.clearTimeout(id));
      dhTimers = [];
      pills.forEach((p) => p.classList.remove("is-lit"));
    }

    function applyPreset(key) {
      activePresetKey = presets[key] ? key : "g-sh-d-kh";
      const cfg = presets[activePresetKey];

      presetBtns.forEach((b) => {
        b.classList.toggle("active", b.getAttribute("data-dh-preset") === activePresetKey);
      });

      pills.forEach((pill, idx) => {
        const roleEl = pill.querySelector("[data-dh-role]");
        const role = cfg.roles[idx] || "";
        if (roleEl) roleEl.textContent = role;
        pill.classList.toggle("has-role", Boolean(role));
      });

      if (readout) readout.textContent = cfg.note;
    }

    presetBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        clearDhTimers();
        applyPreset(btn.getAttribute("data-dh-preset"));
      });
    });

    playBtn?.addEventListener("click", async () => {
      clearDhTimers();
      const cfg = presets[activePresetKey];
      const stepSec = 0.42;
      const durSec = 0.35;

      const resolved = cfg.sequence.map((item) => {
        if (item === "Bnat") {
          return { pillIdx: 6, hz: 493.88, tempLabel: "B♮ (م)" };
        }
        const pill = pills[item];
        return {
          pillIdx: item,
          hz: parseFloat(pill?.getAttribute("data-hz") || "293.66"),
          tempLabel: null
        };
      });

      resolved.forEach((step, idx) => {
        const offsetMs = idx * stepSec * 1000;
        dhTimers.push(
          window.setTimeout(() => {
            pills.forEach((p) => p.classList.remove("is-lit"));
            const target = pills[step.pillIdx];
            if (target) {
              target.classList.add("is-lit");
              if (step.tempLabel && readout) {
                readout.textContent = `${cfg.note} — Playing raised Moteghayyer: ${step.tempLabel}`;
              }
            }
          }, offsetMs),
          window.setTimeout(() => {
            pills[step.pillIdx]?.classList.remove("is-lit");
          }, offsetMs + durSec * 1000)
        );
      });

      const ctx = await unlockAudio();
      if (!ctx) return;
      const t0 = ctx.currentTime + 0.02;
      resolved.forEach((step, idx) => {
        scheduleTone(ctx, step.hz, t0 + idx * stepSec, durSec, 0.2);
      });
    });

    applyPreset(activePresetKey);
  }

  // --- 3. Dastgāh & Āvāz Tree ---
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