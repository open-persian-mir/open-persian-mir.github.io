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
  
  const KORON_SVG_INLINE =
    '<svg class="accidental-svg" viewBox="0 0 18 24" width="0.8em" height="1.1em" aria-label="Koron" style="display:inline-block;vertical-align:-0.15em;">' +
    '<path d="M5.5 3v18M5.5 3L14 7.2L5.5 11.4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />' +
    "</svg>";

  let sharedStepCtx = null;

  async function getStepCtx() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!sharedStepCtx) sharedStepCtx = new AudioCtx();
    if (sharedStepCtx.state === "suspended") await sharedStepCtx.resume();
    return sharedStepCtx;
  }

  async function playStepTone(freq, duration = 0.8, delaySec = 0, peakGain = 0.2) {
    const ctx = await getStepCtx();
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
    overtoneGain.gain.setValueAtTime(0.16, start);

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

  function flashMarkers(markers, durationMs = 950) {
    markers.forEach((el) => el && el.classList.add("is-active"));
    setTimeout(() => {
      markers.forEach((el) => el && el.classList.remove("is-active"));
    }, durationMs);
  }

  // 1. Mojannab (Neutral Second - ج)
  const mojLab = document.getElementById("mojannab-lab");
  if (mojLab) {
    const rootSelect = document.getElementById("moj-root-select");
    const centsSelect = document.getElementById("moj-cents-select");
    const hzRootEl = document.getElementById("moj-hz-root");
    const hzTargetEl = document.getElementById("moj-hz-target");
    const hzRefEl = document.getElementById("moj-hz-ref");
    const readoutEl = document.getElementById("moj-readout");

    const markerRoot = document.getElementById("moj-marker-root");
    const markerTarget = document.getElementById("moj-marker-target");

    const playRootBtn = document.getElementById("moj-play-root");
    const playTargetBtn = document.getElementById("moj-play-target");
    const playMelodicBtn = document.getElementById("moj-play-melodic");
    const playHarmonicBtn = document.getElementById("moj-play-harmonic");

    function getMojState() {
      const rootHz = Number(rootSelect && rootSelect.value ? rootSelect.value : 293.66);
      const cents = Number(centsSelect && centsSelect.value ? centsSelect.value : 150);
      const targetHz = rootHz * Math.pow(2, cents / 1200);
      const baqiyyehHz = rootHz * Math.pow(2, 100 / 1200);
      const taniniHz = rootHz * Math.pow(2, 200 / 1200);
      return { rootHz, cents, targetHz, baqiyyehHz, taniniHz };
    }

    function updateMojUI() {
      const { rootHz, cents, targetHz, baqiyyehHz, taniniHz } = getMojState();
      if (hzRootEl) hzRootEl.textContent = `${rootHz.toFixed(1)} Hz`;
      if (hzTargetEl) hzTargetEl.textContent = `${targetHz.toFixed(1)} Hz (+${cents}¢)`;
      if (hzRefEl) hzRefEl.textContent = `${baqiyyehHz.toFixed(1)} / ${taniniHz.toFixed(1)} Hz`;
      if (readoutEl) {
        readoutEl.innerHTML =
          `<strong>Root</strong>: <code>${rootHz.toFixed(2)} Hz</code> · ` +
          `<strong>Mojannab (ج)</strong>: <code>${targetHz.toFixed(2)} Hz</code> (<code>+${cents}¢</code>) · ` +
          `<em>Baqiyyeh (ب)</em>: <code>${baqiyyehHz.toFixed(2)} Hz</code> · ` +
          `<em>Ṭanīnī (ط)</em>: <code>${taniniHz.toFixed(2)} Hz</code>`;
      }
    }

    if (rootSelect) rootSelect.addEventListener("change", updateMojUI);
    if (centsSelect) centsSelect.addEventListener("change", updateMojUI);

    if (playRootBtn) {
      playRootBtn.addEventListener("click", () => {
        const { rootHz } = getMojState();
        flashMarkers([markerRoot], 800);
        playStepTone(rootHz, 0.8, 0, 0.22);
      });
    }

    if (playTargetBtn) {
      playTargetBtn.addEventListener("click", () => {
        const { targetHz } = getMojState();
        flashMarkers([markerTarget], 800);
        playStepTone(targetHz, 0.8, 0, 0.22);
      });
    }

    if (playMelodicBtn) {
      playMelodicBtn.addEventListener("click", async () => {
        const { rootHz, targetHz } = getMojState();
        await getStepCtx();
        flashMarkers([markerRoot, markerTarget], 1100);
        playStepTone(rootHz, 0.48, 0, 0.22);
        playStepTone(targetHz, 0.55, 0.56, 0.22);
      });
    }

    if (playHarmonicBtn) {
      playHarmonicBtn.addEventListener("click", async () => {
        const { rootHz, targetHz } = getMojState();
        await getStepCtx();
        flashMarkers([markerRoot, markerTarget], 1150);
        playStepTone(rootHz, 1.1, 0, 0.16);
        playStepTone(targetHz, 1.1, 0, 0.16);
      });
    }

    updateMojUI();
  }

  // 2. Bīsh-Ṭanīnī (Super-Major Second - هـ = ج + ب)
  const btLab = document.getElementById("bish-tanini-lab");
  if (btLab) {
    const rootSelect = document.getElementById("bt-root-select");
    const centsSelect = document.getElementById("bt-cents-select");
    const hzStartEl = document.getElementById("bt-hz-start");
    const hzUpperEl = document.getElementById("bt-hz-upper");
    const hzRefEl = document.getElementById("bt-hz-ref");
    const readoutEl = document.getElementById("bt-readout");

    const markerStart = document.getElementById("bt-marker-start");
    const markerUpper = document.getElementById("bt-marker-upper");

    const playStartBtn = document.getElementById("bt-play-start");
    const playUpperBtn = document.getElementById("bt-play-upper");
    const playMelodicBtn = document.getElementById("bt-play-melodic");
    const playHarmonicBtn = document.getElementById("bt-play-harmonic");

    function getBtState() {
      const startHz = Number(rootSelect && rootSelect.value ? rootSelect.value : 277.18);
      const cents = Number(centsSelect && centsSelect.value ? centsSelect.value : 250);
      const upperHz = startHz * Math.pow(2, cents / 1200);
      const taniniHz = startHz * Math.pow(2, 200 / 1200);
      const minThirdHz = startHz * Math.pow(2, 300 / 1200);
      return { startHz, cents, upperHz, taniniHz, minThirdHz };
    }

    function updateBtUI() {
      const { startHz, cents, upperHz, taniniHz, minThirdHz } = getBtState();
      if (hzStartEl) hzStartEl.textContent = `${startHz.toFixed(1)} Hz`;
      if (hzUpperEl) hzUpperEl.textContent = `${upperHz.toFixed(1)} Hz (+${cents}¢)`;
      if (hzRefEl) hzRefEl.textContent = `${taniniHz.toFixed(1)} / ${minThirdHz.toFixed(1)} Hz`;
      if (readoutEl) {
        readoutEl.innerHTML =
          `<strong>Lower Tone</strong>: <code>${startHz.toFixed(2)} Hz</code> · ` +
          `<strong>Bīsh-Ṭanīnī (هـ = ج + ب)</strong>: <code>${upperHz.toFixed(2)} Hz</code> (<code>+${cents}¢</code>) · ` +
          `<em>Ṭanīnī (ط)</em>: <code>${taniniHz.toFixed(2)} Hz</code> · ` +
          `<em>Minor 3rd</em>: <code>${minThirdHz.toFixed(2)} Hz</code>`;
      }
    }

    if (rootSelect) rootSelect.addEventListener("change", updateBtUI);
    if (centsSelect) centsSelect.addEventListener("change", updateBtUI);

    if (playStartBtn) {
      playStartBtn.addEventListener("click", () => {
        const { startHz } = getBtState();
        flashMarkers([markerStart], 800);
        playStepTone(startHz, 0.8, 0, 0.22);
      });
    }

    if (playUpperBtn) {
      playUpperBtn.addEventListener("click", () => {
        const { upperHz } = getBtState();
        flashMarkers([markerUpper], 800);
        playStepTone(upperHz, 0.8, 0, 0.22);
      });
    }

    if (playMelodicBtn) {
      playMelodicBtn.addEventListener("click", async () => {
        const { startHz, upperHz } = getBtState();
        await getStepCtx();
        flashMarkers([markerStart, markerUpper], 1100);
        playStepTone(startHz, 0.48, 0, 0.22);
        playStepTone(upperHz, 0.55, 0.56, 0.22);
      });
    }

    if (playHarmonicBtn) {
      playHarmonicBtn.addEventListener("click", async () => {
        const { startHz, upperHz } = getBtState();
        await getStepCtx();
        flashMarkers([markerStart, markerUpper], 1150);
        playStepTone(startHz, 1.1, 0, 0.16);
        playStepTone(upperHz, 1.1, 0, 0.16);
      });
    }

    updateBtUI();
  }
});