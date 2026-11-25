document.addEventListener("DOMContentLoaded", function () {
  const ksLab = document.getElementById("koron-sori-lab");
  if (!ksLab) return;

  const CONTEXTS = {
    theory: {
      koronCents: 50,
      soriCents: 50,
      note: "Vazīrī standard notation: exact quarter-tone shift (±50¢)."
    },
    shur: {
      koronCents: 60,
      soriCents: 50,
      note: "Performance nuance (Shūr): Koron leans slightly lower (-60¢) than an equal quarter tone."
    },
    segah: {
      koronCents: 40,
      soriCents: 50,
      note: "Performance nuance (Segāh): Koron sits slightly higher (-40¢) than an equal quarter tone."
    }
  };

  let audioCtx = null;

  async function ensureAudioContext() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!audioCtx) {
      audioCtx = new AudioCtx();
    }
    if (audioCtx.state === "suspended") {
      await audioCtx.resume();
    }
    return audioCtx;
  }

  async function playSingleTone(freq, duration = 0.85, delaySec = 0, peakGain = 0.22) {
    const ctx = await ensureAudioContext();
    if (!ctx) return;

    const start = ctx.currentTime + delaySec;
    const stopTime = start + duration + 0.04;

    const osc = ctx.createOscillator();
    const overtone = ctx.createOscillator();
    const overtoneGain = ctx.createGain();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, start);

    overtone.type = "sine";
    overtone.frequency.setValueAtTime(freq * 2, start);
    overtoneGain.gain.setValueAtTime(0.18, start);

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.linearRampToValueAtTime(peakGain, start + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    osc.connect(gain);
    overtone.connect(overtoneGain);
    overtoneGain.connect(gain);
    gain.connect(ctx.destination);

    osc.start(start);
    overtone.start(start);
    osc.stop(stopTime);
    overtone.stop(stopTime);
  }

  async function playSequence(freqs, stepSec = 0.48, gapSec = 0.09) {
    await ensureAudioContext();
    freqs.forEach((f, idx) => {
      playSingleTone(f, stepSec, idx * (stepSec + gapSec), 0.22);
    });
  }

  async function playCluster(freqs, duration = 1.2) {
    await ensureAudioContext();
    freqs.forEach((f) => {
      playSingleTone(f, duration, 0, 0.15);
    });
  }

  const baseSelect = document.getElementById("ks-base-select");
  const contextSelect = document.getElementById("ks-context-select");
  const hzKoronEl = document.getElementById("ks-hz-koron");
  const hzNaturalEl = document.getElementById("ks-hz-natural");
  const hzSoriEl = document.getElementById("ks-hz-sori");
  const readoutEl = document.getElementById("ks-readout");

  const markerKoron = document.getElementById("ks-marker-koron");
  const markerNatural = document.getElementById("ks-marker-natural");
  const markerSori = document.getElementById("ks-marker-sori");

  const playKoronBtn = document.getElementById("ks-play-koron");
  const playNaturalBtn = document.getElementById("ks-play-natural");
  const playSoriBtn = document.getElementById("ks-play-sori");
  const playCompareBtn = document.getElementById("ks-play-compare");
  const playChordBtn = document.getElementById("ks-play-chord");

  function highlightMarkers(markers, totalMs = 900) {
    [markerKoron, markerNatural, markerSori].forEach((m) => m && m.classList.remove("is-active"));
    markers.forEach((m) => m && m.classList.add("is-active"));
    setTimeout(() => {
      markers.forEach((m) => m && m.classList.remove("is-active"));
    }, totalMs);
  }

  function pulseButton(btn) {
    if (!btn) return;
    btn.classList.add("is-playing");
    setTimeout(() => btn.classList.remove("is-playing"), 850);
  }

  function getState() {
    const baseHz = Number(baseSelect && baseSelect.value ? baseSelect.value : 293.66);
    const ctxKey = contextSelect && contextSelect.value ? contextSelect.value : "theory";
    const cfg = CONTEXTS[ctxKey] || CONTEXTS.theory;

    const koronHz = baseHz * Math.pow(2, -cfg.koronCents / 1200);
    const soriHz = baseHz * Math.pow(2, cfg.soriCents / 1200);
    return { baseHz, koronHz, soriHz, cfg };
  }

  function updateUI() {
    const { baseHz, koronHz, soriHz, cfg } = getState();
    if (hzKoronEl) hzKoronEl.textContent = `${koronHz.toFixed(1)} Hz (-${cfg.koronCents}¢)`;
    if (hzNaturalEl) hzNaturalEl.textContent = `${baseHz.toFixed(1)} Hz (0¢)`;
    if (hzSoriEl) hzSoriEl.textContent = `${soriHz.toFixed(1)} Hz (+${cfg.soriCents}¢)`;
    const KORON_SVG =
      '<svg class="accidental-svg" viewBox="0 0 18 24" width="0.85em" height="1.15em" aria-hidden="true" style="display:inline-block;vertical-align:-0.15em;">' +
      '<path d="M5.5 3v18M5.5 3L14 7.2L5.5 11.4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />' +
      "</svg>";

    const SORI_SVG =
      '<svg class="accidental-svg" viewBox="0 0 20 24" width="0.9em" height="1.15em" aria-hidden="true" style="display:inline-block;vertical-align:-0.15em;">' +
      '<path d="M7.5 3v18M12.5 2.5v18M3.5 8.5L15.5 12L3.5 15.5" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" />' +
      "</svg>";
    if (readoutEl) {
      readoutEl.innerHTML =
        `<strong>${KORON_SVG} Koron</strong> (-${cfg.koronCents}¢): <code>${koronHz.toFixed(2)} Hz</code> · ` +
        `<strong>♮ Natural</strong> (0¢): <code>${baseHz.toFixed(2)} Hz</code> · ` +
        `<strong>${SORI_SVG} Sori</strong> (+${cfg.soriCents}¢): <code>${soriHz.toFixed(2)} Hz</code><br>` +
        `<span>${cfg.note}</span>`;
    } 
  }

  if (baseSelect) baseSelect.addEventListener("change", updateUI);
  if (contextSelect) contextSelect.addEventListener("change", updateUI);

  if (playKoronBtn) {
    playKoronBtn.addEventListener("click", () => {
      const { koronHz } = getState();
      pulseButton(playKoronBtn);
      highlightMarkers([markerKoron], 850);
      playSingleTone(koronHz, 0.85);
    });
  }

  if (playNaturalBtn) {
    playNaturalBtn.addEventListener("click", () => {
      const { baseHz } = getState();
      pulseButton(playNaturalBtn);
      highlightMarkers([markerNatural], 850);
      playSingleTone(baseHz, 0.85);
    });
  }

  if (playSoriBtn) {
    playSoriBtn.addEventListener("click", () => {
      const { soriHz } = getState();
      pulseButton(playSoriBtn);
      highlightMarkers([markerSori], 850);
      playSingleTone(soriHz, 0.85);
    });
  }

  if (playCompareBtn) {
    playCompareBtn.addEventListener("click", () => {
      const { koronHz, baseHz, soriHz } = getState();
      pulseButton(playCompareBtn);
      highlightMarkers([markerKoron, markerNatural, markerSori], 1650);
      playSequence([koronHz, baseHz, soriHz], 0.48, 0.09);
    });
  }

  if (playChordBtn) {
    playChordBtn.addEventListener("click", () => {
      const { koronHz, baseHz, soriHz } = getState();
      pulseButton(playChordBtn);
      highlightMarkers([markerKoron, markerNatural, markerSori], 1200);
      playCluster([koronHz, baseHz, soriHz], 1.2);
    });
  }
  updateUI();
});

(function () {
  function initStepLabs() {
    let stepAudioCtx = null;

    async function ensureStepAudio() {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      if (!stepAudioCtx) {
        stepAudioCtx = new AudioCtx();
      }
      if (stepAudioCtx.state === "suspended") {
        await stepAudioCtx.resume();
      }
      return stepAudioCtx;
    }

    async function playTone(freq, duration = 0.75, delay = 0, gainPeak = 0.2) {
      const ctx = await ensureStepAudio();
      if (!ctx || !Number.isFinite(freq) || freq <= 0) return;

      const t0 = ctx.currentTime + Math.max(0, delay);
      const t1 = t0 + duration + 0.05;

      const osc = ctx.createOscillator();
      const harm = ctx.createOscillator();
      const harmGain = ctx.createGain();
      const env = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, t0);

      harm.type = "sine";
      harm.frequency.setValueAtTime(freq * 2, t0);
      harmGain.gain.setValueAtTime(0.14, t0);

      env.gain.setValueAtTime(0.0001, t0);
      env.gain.linearRampToValueAtTime(gainPeak, t0 + 0.02);
      env.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

      osc.connect(env);
      harm.connect(harmGain);
      harmGain.connect(env);
      env.connect(ctx.destination);

      osc.start(t0);
      harm.start(t0);
      osc.stop(t1);
      harm.stop(t1);
    }

    function pulse(els, ms = 900) {
      const list = els.filter(Boolean);
      list.forEach((el) => el.classList.add("is-active"));
      window.setTimeout(() => {
        list.forEach((el) => el.classList.remove("is-active"));
      }, ms);
    }

    // Mojannab (Neutral Second - ج)
    const mojLab = document.getElementById("mojannab-lab");
    if (mojLab) {
      const rootEl = document.getElementById("moj-root-select");
      const centsEl = document.getElementById("moj-cents-select");
      const hzRoot = document.getElementById("moj-hz-root");
      const hzTarget = document.getElementById("moj-hz-target");
      const hzRef = document.getElementById("moj-hz-ref");
      const readout = document.getElementById("moj-readout");
      const mRoot = document.getElementById("moj-marker-root");
      const mTarget = document.getElementById("moj-marker-target");

      const getState = () => {
        const rootHz = parseFloat(rootEl && rootEl.value ? rootEl.value : "293.66");
        const cents = parseFloat(centsEl && centsEl.value ? centsEl.value : "150");
        return {
          rootHz,
          cents,
          targetHz: rootHz * Math.pow(2, cents / 1200),
          baqHz: rootHz * Math.pow(2, 100 / 1200),
          tanHz: rootHz * Math.pow(2, 200 / 1200)
        };
      };

      const render = () => {
        const s = getState();
        if (hzRoot) hzRoot.textContent = `${s.rootHz.toFixed(1)} Hz`;
        if (hzTarget) hzTarget.textContent = `${s.targetHz.toFixed(1)} Hz (+${s.cents}¢)`;
        if (hzRef) hzRef.textContent = `${s.baqHz.toFixed(1)} / ${s.tanHz.toFixed(1)} Hz`;
        if (readout) {
          readout.innerHTML =
            `<strong>Root</strong>: <code>${s.rootHz.toFixed(2)} Hz</code> · ` +
            `<strong>Mojannab (ج)</strong>: <code>${s.targetHz.toFixed(2)} Hz</code> (<code>+${s.cents}¢</code>) · ` +
            `<em>Baqiyyeh (ب)</em>: <code>${s.baqHz.toFixed(2)} Hz</code> · ` +
            `<em>Ṭanīnī (ط)</em>: <code>${s.tanHz.toFixed(2)} Hz</code>`;
        }
      };

      rootEl && rootEl.addEventListener("change", render);
      centsEl && centsEl.addEventListener("change", render);

      document.getElementById("moj-play-root")?.addEventListener("click", () => {
        const s = getState();
        pulse([mRoot], 800);
        playTone(s.rootHz, 0.8, 0, 0.22);
      });

      document.getElementById("moj-play-target")?.addEventListener("click", () => {
        const s = getState();
        pulse([mTarget], 800);
        playTone(s.targetHz, 0.8, 0, 0.22);
      });

      document.getElementById("moj-play-melodic")?.addEventListener("click", async () => {
        const s = getState();
        await ensureStepAudio();
        pulse([mRoot, mTarget], 1100);
        playTone(s.rootHz, 0.45, 0, 0.22);
        playTone(s.targetHz, 0.55, 0.52, 0.22);
      });

      document.getElementById("moj-play-harmonic")?.addEventListener("click", async () => {
        const s = getState();
        await ensureStepAudio();
        pulse([mRoot, mTarget], 1150);
        playTone(s.rootHz, 1.05, 0, 0.16);
        playTone(s.targetHz, 1.05, 0, 0.16);
      });

      render();
    }

    // Bīsh-Ṭanīnī (Super-Major Second - هـ = ج + ب)
    const btLab = document.getElementById("bish-tanini-lab");
    if (btLab) {
      const rootEl = document.getElementById("bt-root-select");
      const centsEl = document.getElementById("bt-cents-select");
      const hzStart = document.getElementById("bt-hz-start");
      const hzUpper = document.getElementById("bt-hz-upper");
      const hzRef = document.getElementById("bt-hz-ref");
      const readout = document.getElementById("bt-readout");
      const mStart = document.getElementById("bt-marker-start");
      const mUpper = document.getElementById("bt-marker-upper");

      const getState = () => {
        const startHz = parseFloat(rootEl && rootEl.value ? rootEl.value : "277.18");
        const cents = parseFloat(centsEl && centsEl.value ? centsEl.value : "250");
        return {
          startHz,
          cents,
          upperHz: startHz * Math.pow(2, cents / 1200),
          tanHz: startHz * Math.pow(2, 200 / 1200),
          min3Hz: startHz * Math.pow(2, 300 / 1200)
        };
      };

      const render = () => {
        const s = getState();
        if (hzStart) hzStart.textContent = `${s.startHz.toFixed(1)} Hz`;
        if (hzUpper) hzUpper.textContent = `${s.upperHz.toFixed(1)} Hz (+${s.cents}¢)`;
        if (hzRef) hzRef.textContent = `${s.tanHz.toFixed(1)} / ${s.min3Hz.toFixed(1)} Hz`;
        if (readout) {
          readout.innerHTML =
            `<strong>Lower Tone</strong>: <code>${s.startHz.toFixed(2)} Hz</code> · ` +
            `<strong>Bīsh-Ṭanīnī (هـ = ج + ب)</strong>: <code>${s.upperHz.toFixed(2)} Hz</code> (<code>+${s.cents}¢</code>) · ` +
            `<em>Ṭanīnī (ط)</em>: <code>${s.tanHz.toFixed(2)} Hz</code> · ` +
            `<em>Minor 3rd</em>: <code>${s.min3Hz.toFixed(2)} Hz</code>`;
        }
      };

      rootEl && rootEl.addEventListener("change", render);
      centsEl && centsEl.addEventListener("change", render);

      document.getElementById("bt-play-start")?.addEventListener("click", () => {
        const s = getState();
        pulse([mStart], 800);
        playTone(s.startHz, 0.8, 0, 0.22);
      });

      document.getElementById("bt-play-upper")?.addEventListener("click", () => {
        const s = getState();
        pulse([mUpper], 800);
        playTone(s.upperHz, 0.8, 0, 0.22);
      });

      document.getElementById("bt-play-melodic")?.addEventListener("click", async () => {
        const s = getState();
        await ensureStepAudio();
        pulse([mStart, mUpper], 1100);
        playTone(s.startHz, 0.45, 0, 0.22);
        playTone(s.upperHz, 0.55, 0.52, 0.22);
      });

      document.getElementById("bt-play-harmonic")?.addEventListener("click", async () => {
        const s = getState();
        await ensureStepAudio();
        pulse([mStart, mUpper], 1150);
        playTone(s.startHz, 1.05, 0, 0.16);
        playTone(s.upperHz, 1.05, 0, 0.16);
      });

      render();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initStepLabs);
  } else {
    initStepLabs();
  }
})();


(function () {
  function initHarmonicMelodicFigure() {
    const fig = document.getElementById("harmonic-melodic-figure");
    if (!fig) return;

    const rootSelect = document.getElementById("hm-root-select");
    const melodicModeBtn = document.getElementById("hm-mode-melodic");
    const harmonicModeBtn = document.getElementById("hm-mode-harmonic");
    const readout = document.getElementById("hm-readout");
    const playButtons = Array.from(fig.querySelectorAll("[data-hm-cents]"));

    let mode = "melodic";
    let audioCtx = null;

    async function getCtx() {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      if (!audioCtx) audioCtx = new Ctx();
      if (audioCtx.state === "suspended") await audioCtx.resume();
      return audioCtx;
    }

    async function tone(freq, dur, delay, peak) {
      const ctx = await getCtx();
      if (!ctx) return;

      const start = ctx.currentTime + delay;
      const stop = start + dur + 0.04;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.linearRampToValueAtTime(peak, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(stop);
    }

    function syncRows() {
      const isHarmonic = mode === "harmonic";
      fig.querySelectorAll("[data-hm-row]").forEach((row) => {
        row.classList.toggle("is-consonant", !isHarmonic);
        row.classList.toggle("is-dissonant", isHarmonic);
        const tag = row.querySelector("[data-hm-tag]");
        if (tag) tag.textContent = isHarmonic ? "Dissonant" : "Consonant";
      });
    }

    function setMode(nextMode) {
      mode = nextMode === "harmonic" ? "harmonic" : "melodic";
      melodicModeBtn?.classList.toggle("active", mode === "melodic");
      harmonicModeBtn?.classList.toggle("active", mode === "harmonic");
      syncRows();
      updateReadout();
    }

    function updateReadout(cents = null) {
      if (!readout) return;
      const rootHz = parseFloat(rootSelect?.value || "293.66");
      const modeLabel =
        mode === "melodic"
          ? "Melodic (consonant step in sequence)"
          : "Harmonic (dissonant clash when sounded together)";

      if (cents === null) {
        readout.innerHTML = `<strong>Active Mode:</strong> ${modeLabel} · Base: <code>${rootHz.toFixed(2)} Hz</code>`;
        return;
      }

      const upperHz = rootHz * Math.pow(2, cents / 1200);
      readout.innerHTML =
        `<strong>${modeLabel}:</strong> <code>${rootHz.toFixed(2)} Hz</code> & <code>${upperHz.toFixed(2)} Hz</code> (<code>+${cents}¢</code>)`;
    }

    melodicModeBtn?.addEventListener("click", () => setMode("melodic"));
    harmonicModeBtn?.addEventListener("click", () => setMode("harmonic"));
    rootSelect?.addEventListener("change", () => updateReadout());

    playButtons.forEach((btn) => {
      btn.addEventListener("click", async () => {
        const cents = parseFloat(btn.getAttribute("data-hm-cents") || "150");
        const rootHz = parseFloat(rootSelect?.value || "293.66");
        const upperHz = rootHz * Math.pow(2, cents / 1200);

        await getCtx();
        updateReadout(cents);

        if (mode === "melodic") {
          tone(rootHz, 0.42, 0, 0.2);
          tone(upperHz, 0.5, 0.48, 0.2);
        } else {
          tone(rootHz, 0.95, 0, 0.15);
          tone(upperHz, 0.95, 0, 0.15);
        }
      });
    });

    updateReadout();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHarmonicMelodicFigure);
  } else {
    initHarmonicMelodicFigure();
  }
})();


(function () {
  function initDangExamplesFigure() {
    const fig = document.getElementById("dang-examples-figure");
    if (!fig) return;

    let audioCtx = null;
    let activeTimers = [];
    let activeButton = null;

    async function getCtx() {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      if (!audioCtx) audioCtx = new Ctx();
      if (audioCtx.state === "suspended") await audioCtx.resume();
      return audioCtx;
    }

    function clearPlaybackState() {
      activeTimers.forEach((id) => window.clearTimeout(id));
      activeTimers = [];
      fig.querySelectorAll(".dang-note-pill.is-lit").forEach((el) => {
        el.classList.remove("is-lit");
      });
      if (activeButton) {
        activeButton.classList.remove("is-playing");
        activeButton = null;
      }
    }

    async function scheduleTone(freq, startTime, duration) {
      const ctx = await getCtx();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.03);
    }

    fig.querySelectorAll(".dang-example-row").forEach((row) => {
      const btn = row.querySelector("[data-dang-play]");
      const pills = Array.from(row.querySelectorAll(".dang-note-pill"));
      const freqs = (row.getAttribute("data-freqs") || "")
        .split(",")
        .map((n) => parseFloat(n.trim()))
        .filter((n) => Number.isFinite(n) && n > 0);

      if (!btn || freqs.length === 0) return;

      btn.addEventListener("click", async () => {
        const ctx = await getCtx();
        if (!ctx) return;

        clearPlaybackState();
        activeButton = btn;
        btn.classList.add("is-playing");

        const stepSec = 0.46;
        const noteDurSec = 0.38;
        const t0 = ctx.currentTime + 0.02;

        freqs.forEach((freq, idx) => {
          const offsetSec = idx * stepSec;
          scheduleTone(freq, t0 + offsetSec, noteDurSec);

          const onId = window.setTimeout(() => {
            pills.forEach((p) => p.classList.remove("is-lit"));
            if (pills[idx]) pills[idx].classList.add("is-lit");
          }, offsetSec * 1000);

          const offId = window.setTimeout(() => {
            if (pills[idx]) pills[idx].classList.remove("is-lit");
          }, (offsetSec + noteDurSec) * 1000);

          activeTimers.push(onId, offId);
        });

        const endId = window.setTimeout(() => {
          btn.classList.remove("is-playing");
          if (activeButton === btn) activeButton = null;
        }, freqs.length * stepSec * 1000);

        activeTimers.push(endId);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initDangExamplesFigure);
  } else {
    initDangExamplesFigure();
  }
})();