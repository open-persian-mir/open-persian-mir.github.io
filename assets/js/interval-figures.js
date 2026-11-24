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
    if (readoutEl) {
      readoutEl.innerHTML =
        `<strong>𝄳 Koron</strong> (-${cfg.koronCents}¢): <code>${koronHz.toFixed(2)} Hz</code> · ` +
        `<strong>♮ Natural</strong> (0¢): <code>${baseHz.toFixed(2)} Hz</code> · ` +
        `<strong>𝄲 Sori</strong> (+${cfg.soriCents}¢): <code>${soriHz.toFixed(2)} Hz</code><br>` +
        `<span>${cfg.note}</span>`;
    }
    const KORON_SVG =
      '<svg class="accidental-svg" viewBox="0 0 18 24" width="0.85em" height="1.15em" aria-hidden="true" style="display:inline-block;vertical-align:-0.15em;">' +
      '<path d="M5.5 3v18M5.5 3L14 7.2L5.5 11.4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />' +
      "</svg>";

    const SORI_SVG =
      '<svg class="accidental-svg" viewBox="0 0 20 24" width="0.9em" height="1.15em" aria-hidden="true" style="display:inline-block;vertical-align:-0.15em;">' +
      '<path d="M7.5 3v18M12.5 2.5v18M3.5 8.5L15.5 12L3.5 15.5" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" />' +
      "</svg>";
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