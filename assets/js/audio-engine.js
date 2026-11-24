(function () {
  let ctx = null;

  function getContext() {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      ctx = new AudioCtx();
    }
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    return ctx;
  }

  function playTone(freq, duration = 0.8, delay = 0, type = "triangle", peakGain = 0.18) {
    const audio = getContext();
    const start = audio.currentTime + delay;

    const osc = audio.createOscillator();
    const overtone = audio.createOscillator();
    const overtoneGain = audio.createGain();
    const env = audio.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);

    overtone.type = "sine";
    overtone.frequency.setValueAtTime(freq * 2, start);
    overtoneGain.gain.setValueAtTime(0.16, start);

    env.gain.setValueAtTime(0.0001, start);
    env.gain.linearRampToValueAtTime(peakGain, start + 0.025);
    env.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    osc.connect(env);
    overtone.connect(overtoneGain);
    overtoneGain.connect(env);
    env.connect(audio.destination);

    osc.start(start);
    overtone.start(start);
    osc.stop(start + duration + 0.03);
    overtone.stop(start + duration + 0.03);
  }

  function playNoiseBurst(duration = 0.45, peakGain = 0.16) {
    const audio = getContext();
    const sampleCount = Math.floor(audio.sampleRate * duration);
    const buffer = audio.createBuffer(1, sampleCount, audio.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < sampleCount; i++) {
      const decay = Math.exp(-i / (sampleCount * 0.35));
      data[i] = (Math.random() * 2 - 1) * decay;
    }

    const src = audio.createBufferSource();
    src.buffer = buffer;

    const filter = audio.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1400, audio.currentTime);
    filter.Q.setValueAtTime(0.8, audio.currentTime);

    const env = audio.createGain();
    env.gain.setValueAtTime(peakGain, audio.currentTime);
    env.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + duration);

    src.connect(filter);
    filter.connect(env);
    env.connect(audio.destination);
    src.start();
  }

  function playSequence(freqs, stepDuration = 0.42, gap = 0.08) {
    freqs.forEach((f, idx) => {
      playTone(f, stepDuration, idx * (stepDuration + gap));
    });
  }

  function playHarmonic(freqs, duration = 1.15) {
    freqs.forEach((f) => {
      playTone(f, duration, 0, "triangle", 0.13);
    });
  }

  window.PersianMusicAudio = {
    playTone,
    playNoiseBurst,
    playSequence,
    playHarmonic
  };

  document.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-play-freqs], [data-play-noise]");
    if (!btn) return;

    document.querySelectorAll(".audio-btn.is-playing").forEach((el) => {
      el.classList.remove("is-playing");
    });
    btn.classList.add("is-playing");
    setTimeout(() => btn.classList.remove("is-playing"), 900);

    if (btn.hasAttribute("data-play-noise")) {
      playNoiseBurst();
      return;
    }

    const freqs = (btn.getAttribute("data-play-freqs") || "")
      .split(",")
      .map((v) => Number(v.trim()))
      .filter((n) => Number.isFinite(n) && n > 0);

    if (!freqs.length) return;

    const mode = btn.getAttribute("data-mode") || "melodic";
    const step = Number(btn.getAttribute("data-step") || "0.42");

    if (mode === "harmonic") {
      playHarmonic(freqs);
    } else {
      playSequence(freqs, step, 0.08);
    }
  });
})();