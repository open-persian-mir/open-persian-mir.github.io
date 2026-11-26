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

  // 1. Five-Degree Functional Matrix
  const dmFig = document.getElementById("degree-matrix-figure");
  if (dmFig) {
    const pills = Array.from(dmFig.querySelectorAll("[data-dm-deg]"));
    const roleBtns = Array.from(dmFig.querySelectorAll("[data-dm-role-id]"));
    const playBtn = document.getElementById("dm-play");
    const readout = document.getElementById("dm-readout");

    const roles = {
      shahed: {
        targetIdx: 4,
        badge: "ش",
        sequence: [4, 5, 4, 3, 4, 5, 4],
        description: "Shāhed (G): The melodic center of gravity. Notice how the phrase repeatedly returns to and dwells on G, bearing witness to the mode."
      },
      khatemeh: {
        targetIdx: 1,
        badge: "خ",
        sequence: [4, 3, 2, 1, 0, 1],
        description: "Khātemeh (D): Definitive final closure. The descending cadence settles firmly on D, signaling that the piece has concluded."
      },
      ist: {
        targetIdx: 3,
        badge: "ی",
        sequence: [4, 5, 4, 3],
        description: "Īst (F): Temporary pause. The phrase halts on F, creating a suspended breath that makes the listener anticipate continuation."
      },
      moteghayyer: {
        targetIdx: 6,
        badge: "م",
        sequence: [4, 5, "Bnat", 7, 6, 5, 4],
        description: "Moteghayyer (B♮ / B♭): Variable degree. Pulled up to B♮ (493.88 Hz) when ascending to C5, then relaxed to B♭ (466.16 Hz) when descending."
      },
      aghaz: {
        targetIdx: 2,
        badge: "آ",
        sequence: [2, 3, 4, 5, 4],
        description: "Āghāz (E): Initial pitch. Launches the opening contour toward the Shāhed (G), though changing the starting note does not alter the maqām."
      }
    };

    let activeRole = "shahed";
    let dmTimers = [];

    function clearDm() {
      dmTimers.forEach((id) => window.clearTimeout(id));
      dmTimers = [];
      pills.forEach((p) => p.classList.remove("is-lit"));
    }

    function selectRole(id) {
      activeRole = roles[id] ? id : "shahed";
      const cfg = roles[activeRole];

      roleBtns.forEach((b) => b.classList.toggle("active", b.getAttribute("data-dm-role-id") === activeRole));
      pills.forEach((p, idx) => {
        const isTarget = idx === cfg.targetIdx;
        p.classList.toggle("is-target", isTarget);
        const badgeEl = p.querySelector("[data-dm-badge]");
        if (badgeEl) badgeEl.textContent = isTarget ? cfg.badge : "";
      });
      if (readout) readout.textContent = cfg.description;
    }

    roleBtns.forEach((b) => {
      b.addEventListener("click", () => {
        clearDm();
        selectRole(b.getAttribute("data-dm-role-id"));
      });
    });

    playBtn?.addEventListener("click", async () => {
      clearDm();
      const cfg = roles[activeRole];
      const stepSec = 0.42;
      const durSec = 0.35;

      const steps = cfg.sequence.map((item) => {
        if (item === "Bnat") {
          return { idx: 6, hz: 493.88 };
        }
        return {
          idx: item,
          hz: parseFloat(pills[item]?.getAttribute("data-hz") || "293.66")
        };
      });

      steps.forEach((s, i) => {
        const ms = i * stepSec * 1000;
        dmTimers.push(
          window.setTimeout(() => {
            pills.forEach((p) => p.classList.remove("is-lit"));
            pills[s.idx]?.classList.add("is-lit");
          }, ms),
          window.setTimeout(() => pills[s.idx]?.classList.remove("is-lit"), ms + durSec * 1000)
        );
      });

      const ctx = await unlockAudio();
      if (!ctx) return;
      const t0 = ctx.currentTime + 0.02;
      steps.forEach((s, i) => scheduleTone(ctx, s.hz, t0 + i * stepSec, durSec, 0.2));
    });

    selectRole(activeRole);
  }

  // Helper for sequential row players (Shāhed Comparison & Moteghayyer Lab)
  function initRowPlayer(figId, rowSel, btnSel, pillSel, freqAttr, descAttr, readoutId) {
    const fig = document.getElementById(figId);
    if (!fig) return;
    const readout = document.getElementById(readoutId);
    let timers = [];
    let activeBtn = null;

    function clear() {
      timers.forEach((id) => window.clearTimeout(id));
      timers = [];
      fig.querySelectorAll(`${pillSel}.is-lit`).forEach((p) => p.classList.remove("is-lit"));
      if (activeBtn) {
        activeBtn.classList.remove("is-playing");
        activeBtn = null;
      }
    }

    fig.querySelectorAll(rowSel).forEach((row) => {
      const btn = row.querySelector(btnSel);
      const pills = Array.from(row.querySelectorAll(pillSel));
      const desc = row.getAttribute(descAttr) || "";
      const freqs = (row.getAttribute(freqAttr) || "")
        .split(",")
        .map((n) => parseFloat(n.trim()))
        .filter((n) => Number.isFinite(n) && n > 0);

      if (!btn || freqs.length === 0) return;

      btn.addEventListener("click", async () => {
        clear();
        activeBtn = btn;
        btn.classList.add("is-playing");
        if (readout && desc) readout.textContent = desc;

        const stepSec = 0.42;
        const durSec = 0.35;

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
        freqs.forEach((f, idx) => scheduleTone(ctx, f, t0 + idx * stepSec, durSec, 0.2));
      });
    });
  }

  // 2. Single vs. Dual Shāhed Comparison
  initRowPlayer(
    "shahed-comparison-figure",
    ".sh-row",
    "[data-sh-play]",
    ".sh-pill",
    "data-sh-freqs",
    "data-sh-desc",
    "sh-readout"
  );

  // 3. Moteghayyer Directional Lab
  initRowPlayer(
    "moteghayyer-lab-figure",
    ".mt-row",
    "[data-mt-play]",
    ".mt-pill",
    "data-mt-freqs",
    "data-mt-desc",
    "mt-readout"
  );
});