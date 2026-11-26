document.addEventListener("DOMContentLoaded", () => {
  let audioCtx = null;

  async function getAudio() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === "suspended") {
      await audioCtx.resume();
    }
    return audioCtx;
  }

  async function playNote(freq, duration = 0.75, delay = 0, peak = 0.2) {
    const ctx = await getAudio();
    if (!ctx || !Number.isFinite(freq) || freq <= 0) return;

    const startTime = ctx.currentTime + delay;
    const stopTime = startTime + duration + 0.05;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(peak, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(stopTime);
  }

  function flash(els, ms = 850) {
    const valid = els.filter(Boolean);
    valid.forEach((el) => el.classList.add("is-active"));
    window.setTimeout(() => {
      valid.forEach((el) => el.classList.remove("is-active"));
    }, ms);
  }

  // 1. Koron & Sori Lab
  const ksBaseSelect = document.getElementById("ks-base-select");
  const ksContextSelect = document.getElementById("ks-context-select");
  if (ksBaseSelect && ksContextSelect) {
    const hzKoron = document.getElementById("ks-hz-koron");
    const hzNatural = document.getElementById("ks-hz-natural");
    const hzSori = document.getElementById("ks-hz-sori");
    const readout = document.getElementById("ks-readout");
    const markerKoron = document.getElementById("ks-marker-koron");
    const markerNatural = document.getElementById("ks-marker-natural");
    const markerSori = document.getElementById("ks-marker-sori");

    const contextMap = {
      theory: { k: -50, s: 50, note: "Vazīrī standard notation: exact quarter-tone shift (±50¢)." },
      shur: { k: -60, s: 50, note: "Contextual performance tendency (Shūr): Koron slightly lower (~-60¢)." },
      segah: { k: -40, s: 50, note: "Contextual performance tendency (Segāh): Koron slightly higher (~-40¢)." }
    };

    function getKsValues() {
      const baseHz = parseFloat(ksBaseSelect.value) || 293.66;
      const cfg = contextMap[ksContextSelect.value] || contextMap.theory;
      return {
        baseHz,
        koronHz: baseHz * Math.pow(2, cfg.k / 1200),
        soriHz: baseHz * Math.pow(2, cfg.s / 1200),
        cfg
      };
    }

    function updateKs() {
      const { baseHz, koronHz, soriHz, cfg } = getKsValues();
      if (hzKoron) hzKoron.textContent = `${koronHz.toFixed(1)} Hz (${cfg.k}¢)`;
      if (hzNatural) hzNatural.textContent = `${baseHz.toFixed(1)} Hz (0¢)`;
      if (hzSori) hzSori.textContent = `${soriHz.toFixed(1)} Hz (+${cfg.s}¢)`;
      if (readout) {
        readout.innerHTML =
          `<strong>Koron</strong> (<code>${cfg.k}¢</code>): <code>${koronHz.toFixed(2)} Hz</code> · ` +
          `<strong>Natural</strong> (<code>0¢</code>): <code>${baseHz.toFixed(2)} Hz</code> · ` +
          `<strong>Sori</strong> (<code>+${cfg.s}¢</code>): <code>${soriHz.toFixed(2)} Hz</code><br>` +
          `<span>${cfg.note}</span>`;
      }
    }

    ksBaseSelect.addEventListener("change", updateKs);
    ksContextSelect.addEventListener("change", updateKs);

    document.getElementById("ks-play-koron")?.addEventListener("click", () => {
      const { koronHz } = getKsValues();
      flash([markerKoron], 800);
      playNote(koronHz, 0.8, 0, 0.22);
    });

    document.getElementById("ks-play-natural")?.addEventListener("click", () => {
      const { baseHz } = getKsValues();
      flash([markerNatural], 800);
      playNote(baseHz, 0.8, 0, 0.22);
    });

    document.getElementById("ks-play-sori")?.addEventListener("click", () => {
      const { soriHz } = getKsValues();
      flash([markerSori], 800);
      playNote(soriHz, 0.8, 0, 0.22);
    });

    document.getElementById("ks-play-compare")?.addEventListener("click", async () => {
      const { baseHz, koronHz, soriHz } = getKsValues();
      await getAudio();
      flash([markerKoron, markerNatural, markerSori], 1500);
      playNote(koronHz, 0.42, 0, 0.22);
      playNote(baseHz, 0.42, 0.48, 0.22);
      playNote(soriHz, 0.5, 0.96, 0.22);
    });

    document.getElementById("ks-play-chord")?.addEventListener("click", async () => {
      const { baseHz, koronHz, soriHz } = getKsValues();
      await getAudio();
      flash([markerKoron, markerNatural, markerSori], 1150);
      playNote(koronHz, 1.05, 0, 0.14);
      playNote(baseHz, 1.05, 0, 0.14);
      playNote(soriHz, 1.05, 0, 0.14);
    });

    updateKs();
  }

  // 2. Mojannab Lab
  const mojRootSelect = document.getElementById("moj-root-select");
  const mojCentsSelect = document.getElementById("moj-cents-select");
  if (mojRootSelect && mojCentsSelect) {
    const hzRoot = document.getElementById("moj-hz-root");
    const hzTarget = document.getElementById("moj-hz-target");
    const hzRef = document.getElementById("moj-hz-ref");
    const readout = document.getElementById("moj-readout");
    const mRoot = document.getElementById("moj-marker-root");
    const mTarget = document.getElementById("moj-marker-target");

    function getMojValues() {
      const rootHz = parseFloat(mojRootSelect.value) || 293.66;
      const cents = parseFloat(mojCentsSelect.value) || 150;
      return {
        rootHz,
        cents,
        targetHz: rootHz * Math.pow(2, cents / 1200),
        baqHz: rootHz * Math.pow(2, 100 / 1200),
        tanHz: rootHz * Math.pow(2, 200 / 1200)
      };
    }

    function updateMoj() {
      const s = getMojValues();
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
    }

    mojRootSelect.addEventListener("change", updateMoj);
    mojCentsSelect.addEventListener("change", updateMoj);

    document.getElementById("moj-play-root")?.addEventListener("click", () => {
      const s = getMojValues();
      flash([mRoot], 800);
      playNote(s.rootHz, 0.8, 0, 0.22);
    });

    document.getElementById("moj-play-target")?.addEventListener("click", () => {
      const s = getMojValues();
      flash([mTarget], 800);
      playNote(s.targetHz, 0.8, 0, 0.22);
    });

    document.getElementById("moj-play-melodic")?.addEventListener("click", async () => {
      const s = getMojValues();
      await getAudio();
      flash([mRoot, mTarget], 1100);
      playNote(s.rootHz, 0.45, 0, 0.22);
      playNote(s.targetHz, 0.55, 0.52, 0.22);
    });

    document.getElementById("moj-play-harmonic")?.addEventListener("click", async () => {
      const s = getMojValues();
      await getAudio();
      flash([mRoot, mTarget], 1150);
      playNote(s.rootHz, 1.05, 0, 0.16);
      playNote(s.targetHz, 1.05, 0, 0.16);
    });

    updateMoj();
  }

  // 3. Bīsh-Ṭanīnī Lab
  const btRootSelect = document.getElementById("bt-root-select");
  const btCentsSelect = document.getElementById("bt-cents-select");
  if (btRootSelect && btCentsSelect) {
    const hzStart = document.getElementById("bt-hz-start");
    const hzUpper = document.getElementById("bt-hz-upper");
    const hzRef = document.getElementById("bt-hz-ref");
    const readout = document.getElementById("bt-readout");
    const mStart = document.getElementById("bt-marker-start");
    const mUpper = document.getElementById("bt-marker-upper");

    function getBtValues() {
      const startHz = parseFloat(btRootSelect.value) || 277.18;
      const cents = parseFloat(btCentsSelect.value) || 250;
      return {
        startHz,
        cents,
        upperHz: startHz * Math.pow(2, cents / 1200),
        tanHz: startHz * Math.pow(2, 200 / 1200),
        min3Hz: startHz * Math.pow(2, 300 / 1200)
      };
    }

    function updateBt() {
      const s = getBtValues();
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
    }

    btRootSelect.addEventListener("change", updateBt);
    btCentsSelect.addEventListener("change", updateBt);

    document.getElementById("bt-play-start")?.addEventListener("click", () => {
      const s = getBtValues();
      flash([mStart], 800);
      playNote(s.startHz, 0.8, 0, 0.22);
    });

    document.getElementById("bt-play-upper")?.addEventListener("click", () => {
      const s = getBtValues();
      flash([mUpper], 800);
      playNote(s.upperHz, 0.8, 0, 0.22);
    });

    document.getElementById("bt-play-melodic")?.addEventListener("click", async () => {
      const s = getBtValues();
      await getAudio();
      flash([mStart, mUpper], 1100);
      playNote(s.startHz, 0.45, 0, 0.22);
      playNote(s.upperHz, 0.55, 0.52, 0.22);
    });

    document.getElementById("bt-play-harmonic")?.addEventListener("click", async () => {
      const s = getBtValues();
      await getAudio();
      flash([mStart, mUpper], 1150);
      playNote(s.startHz, 1.05, 0, 0.16);
      playNote(s.upperHz, 1.05, 0, 0.16);
    });

    updateBt();
  }

  // 4. Harmonic vs. Melodic Consonance
  const hmFig = document.getElementById("harmonic-melodic-figure");
  if (hmFig) {
    const rootSelect = document.getElementById("hm-root-select");
    const melodicBtn = document.getElementById("hm-mode-melodic");
    const harmonicBtn = document.getElementById("hm-mode-harmonic");
    const readout = document.getElementById("hm-readout");
    let mode = "melodic";

    function syncRows() {
      const isHarmonic = mode === "harmonic";
      hmFig.querySelectorAll("[data-hm-row]").forEach((row) => {
        row.classList.toggle("is-consonant", !isHarmonic);
        row.classList.toggle("is-dissonant", isHarmonic);
        const tag = row.querySelector("[data-hm-tag]");
        if (tag) tag.textContent = isHarmonic ? "Dissonant" : "Consonant";
      });
    }

    function updateHm(cents = null) {
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

    function setMode(nextMode) {
      mode = nextMode === "harmonic" ? "harmonic" : "melodic";
      melodicBtn?.classList.toggle("active", mode === "melodic");
      harmonicBtn?.classList.toggle("active", mode === "harmonic");
      syncRows();
      updateHm();
    }

    melodicBtn?.addEventListener("click", () => setMode("melodic"));
    harmonicBtn?.addEventListener("click", () => setMode("harmonic"));
    rootSelect?.addEventListener("change", () => updateHm());

    hmFig.querySelectorAll("[data-hm-cents]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const cents = parseFloat(btn.getAttribute("data-hm-cents") || "150");
        const rootHz = parseFloat(rootSelect?.value || "293.66");
        const upperHz = rootHz * Math.pow(2, cents / 1200);
        await getAudio();
        updateHm(cents);

        if (mode === "melodic") {
          playNote(rootHz, 0.42, 0, 0.2);
          playNote(upperHz, 0.5, 0.48, 0.2);
        } else {
          playNote(rootHz, 0.95, 0, 0.15);
          playNote(upperHz, 0.95, 0, 0.15);
        }
      });
    });

    syncRows();
    updateHm();
  }

  // 5. Dāng Sequential Examples
  const dangFig = document.getElementById("dang-examples-figure");
  if (dangFig) {
    let timers = [];
    let activeBtn = null;

    function clearDang() {
      timers.forEach((id) => window.clearTimeout(id));
      timers = [];
      dangFig.querySelectorAll(".dang-note-pill.is-lit").forEach((pill) => {
        pill.classList.remove("is-lit");
      });
      if (activeBtn) {
        activeBtn.classList.remove("is-playing");
        activeBtn = null;
      }
    }

    dangFig.querySelectorAll(".dang-example-row").forEach((row) => {
      const btn = row.querySelector("[data-dang-play]");
      const pills = Array.from(row.querySelectorAll(".dang-note-pill"));
      const freqs = (row.getAttribute("data-freqs") || "")
        .split(",")
        .map((n) => parseFloat(n.trim()))
        .filter((n) => Number.isFinite(n) && n > 0);

      if (!btn || freqs.length === 0) return;

      btn.addEventListener("click", async () => {
        await getAudio();
        clearDang();
        activeBtn = btn;
        btn.classList.add("is-playing");

        const stepSec = 0.46;
        const noteDurSec = 0.38;

        freqs.forEach((freq, idx) => {
          const offsetSec = idx * stepSec;
          playNote(freq, noteDurSec, offsetSec, 0.2);

          const onId = window.setTimeout(() => {
            pills.forEach((p) => p.classList.remove("is-lit"));
            if (pills[idx]) pills[idx].classList.add("is-lit");
          }, offsetSec * 1000);

          const offId = window.setTimeout(() => {
            if (pills[idx]) pills[idx].classList.remove("is-lit");
          }, (offsetSec + noteDurSec) * 1000);

          timers.push(onId, offId);
        });

        const endId = window.setTimeout(() => {
          btn.classList.remove("is-playing");
          if (activeBtn === btn) activeBtn = null;
        }, freqs.length * stepSec * 1000);

        timers.push(endId);
      });
    });
  }
});