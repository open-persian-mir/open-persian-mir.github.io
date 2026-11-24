(function () {
  const sharedAudio = window.PersianMusicAudio || null;
  let localCtx = null;

  function getLocalCtx() {
    if (!localCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      localCtx = new AudioCtx();
    }
    if (localCtx.state === "suspended") {
      localCtx.resume();
    }
    return localCtx;
  }

  function tone(freq, duration = 0.85, delay = 0, peakGain = 0.18) {
    if (sharedAudio && typeof sharedAudio.playTone === "function") {
      sharedAudio.playTone(freq, duration, delay, "triangle", peakGain);
      return;
    }

    const ctx = getLocalCtx();
    const start = ctx.currentTime + delay;

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
    osc.stop(start + duration + 0.03);
    overtone.stop(start + duration + 0.03);
  }

  function sequence(freqs, step = 0.48, gap = 0.09) {
    freqs.forEach((f, i) => tone(f, step, i * (step + gap)));
  }

  function chord(freqs, duration = 1.2) {
    freqs.forEach((f) => tone(f, duration, 0, 0.13));
  }

  const ksLab = document.getElementById("koron-sori-lab");
  if (!ksLab) return;

  const baseSelect = document.getElementById("ks-base-select");
  const centsSlider = document.getElementById("ks-cents-slider");
  const centsReadout = document.getElementById("ks-cents-readout");
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
    [markerKoron, markerNatural, markerSori].forEach((m) => m?.classList.remove("is-active"));
    markers.forEach((m) => m?.classList.add("is-active"));
    setTimeout(() => {
      markers.forEach((m) => m?.classList.remove("is-active"));
    }, totalMs);
  }

  function pulseButton(btn) {
    if (!btn) return;
    btn.classList.add("is-playing");
    setTimeout(() => btn.classList.remove("is-playing"), 850);
  }

  function getState() {
    const baseHz = Number(baseSelect?.value || 293.66);
    const offsetCents = Number(centsSlider?.value || 140);
    const koronHz = baseHz * Math.pow(2, -offsetCents / 1200);
    const soriHz = baseHz * Math.pow(2, offsetCents / 1200);
    return { baseHz, offsetCents, koronHz, soriHz };
  }

  function updateUI() {
    const { baseHz, offsetCents, koronHz, soriHz } = getState();
    if (centsReadout) centsReadout.textContent = `±${offsetCents}¢`;
    if (hzKoronEl) hzKoronEl.textContent = `${koronHz.toFixed(1)} Hz (-${offsetCents}¢)`;
    if (hzNaturalEl) hzNaturalEl.textContent = `${baseHz.toFixed(1)} Hz (0¢)`;
    if (hzSoriEl) hzSoriEl.textContent = `${soriHz.toFixed(1)} Hz (+${offsetCents}¢)`;
    if (readoutEl) {
      readoutEl.innerHTML =
        `<strong>Koron</strong> lowers pitch to <code>${koronHz.toFixed(2)} Hz</code> (<code>-${offsetCents}¢</code>), ` +
        `<strong>Natural</strong> sits at <code>${baseHz.toFixed(2)} Hz</code>, and ` +
        `<strong>Sori</strong> raises pitch to <code>${soriHz.toFixed(2)} Hz</code> (<code>+${offsetCents}¢</code>).`;
    }
  }

  baseSelect?.addEventListener("change", updateUI);
  centsSlider?.addEventListener("input", updateUI);

  playKoronBtn?.addEventListener("click", () => {
    const { koronHz } = getState();
    pulseButton(playKoronBtn);
    highlightMarkers([markerKoron], 850);
    tone(koronHz, 0.85);
  });

  playNaturalBtn?.addEventListener("click", () => {
    const { baseHz } = getState();
    pulseButton(playNaturalBtn);
    highlightMarkers([markerNatural], 850);
    tone(baseHz, 0.85);
  });

  playSoriBtn?.addEventListener("click", () => {
    const { soriHz } = getState();
    pulseButton(playSoriBtn);
    highlightMarkers([markerSori], 850);
    tone(soriHz, 0.85);
  });

  playCompareBtn?.addEventListener("click", () => {
    const { koronHz, baseHz, soriHz } = getState();
    pulseButton(playCompareBtn);
    highlightMarkers([markerKoron, markerNatural, markerSori], 1650);
    sequence([koronHz, baseHz, soriHz], 0.48, 0.09);
  });

  playChordBtn?.addEventListener("click", () => {
    const { koronHz, baseHz, soriHz } = getState();
    pulseButton(playChordBtn);
    highlightMarkers([markerKoron, markerNatural, markerSori], 1200);
    chord([koronHz, baseHz, soriHz], 1.2);
  });

  updateUI();
})();