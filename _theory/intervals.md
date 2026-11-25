---
title: Intervals & Dāng (Tetrachords)
summary: Acoustic foundations, pitch terminology, Persian interval classifications, consonance vs. dissonance, and Dāng construction rules.
order: 2
---

## Historical Notation & Pitch Terminology

* **Abjad Notation:** Classical Persian theorists notated pitches using the Arabic/Persian *Abjad* letter sequence (`ا ب ج د هـ و ز ح ط ی`), accompanied by numerals indicating rhythmic duration.

#### Approximate Abjad-to-Modern Pitch Mapping (*Alif* = *Do*)

| Abjad Letter (Octave 1) | Abjad Numerical Value | Abjad Letter (Octave 2) | Abjad Numerical Value | Equivalent Note |
| :--- | :---: | :--- | :---: | :--- |
| `ا` | 1 | `یح` | 18 | *Do* (`C`) |
| `ب` | 2 | `یط` | 19 | *Re*♭ (`Re b`) |
| `ج` | 3 | `ک` | 20 | *Re* <svg class="accidental-svg" viewBox="0 0 18 24" width="0.8em" height="1.1em" aria-label="Koron" style="display:inline-block;vertical-align:-0.15em;"><path d="M5.5 3v18M5.5 3L14 7.2L5.5 11.4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg> (`Re` Koron) |
| `د` | 4 | `کا` | 21 | *Re* (`Re`) |
| `ه` | 5 | `کب` | 22 | *Mi*♭ (`Mi b`) |
| `و` | 6 | `کج` | 23 | *Mi* <svg class="accidental-svg" viewBox="0 0 18 24" width="0.8em" height="1.1em" aria-label="Koron" style="display:inline-block;vertical-align:-0.15em;"><path d="M5.5 3v18M5.5 3L14 7.2L5.5 11.4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg> (`Mi` Koron) |
| `ز` | 7 | `کد` | 24 | *Mi* (`Mi`) |
| `ح` | 8 | `که` | 25 | *Fa* (`Fa`) |
| `ط` | 9 | `کو` | 26 | *Sol*♭ (`Sol b`) |
| `ی` | 10 | `کز` | 27 | *Sol* <svg class="accidental-svg" viewBox="0 0 18 24" width="0.8em" height="1.1em" aria-label="Koron" style="display:inline-block;vertical-align:-0.15em;"><path d="M5.5 3v18M5.5 3L14 7.2L5.5 11.4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg> (`Sol` Koron) |
| `یا` | 11 | `کح` | 28 | *Sol* (`Sol`) |
| `یب` | 12 | `کط` | 29 | *La*♭ (`La b`) |
| `یج` | 13 | `ل` | 30 | *La* <svg class="accidental-svg" viewBox="0 0 18 24" width="0.8em" height="1.1em" aria-label="Koron" style="display:inline-block;vertical-align:-0.15em;"><path d="M5.5 3v18M5.5 3L14 7.2L5.5 11.4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg> (`La` Koron) |
| `ید` | 14 | `لا` | 31 | *La* (`La`) |
| `یه` | 15 | `لب` | 32 | *Si*♭ (`Si b`) |
| `یو` | 16 | `لج` | 33 | *Si* <svg class="accidental-svg" viewBox="0 0 18 24" width="0.8em" height="1.1em" aria-label="Koron" style="display:inline-block;vertical-align:-0.15em;"><path d="M5.5 3v18M5.5 3L14 7.2L5.5 11.4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg> (`Si` Koron) |
| `یز` | 17 | `لد` | 34 | *Si* (`Si`) |
| `یح` | 18 | `له` | 35 | *Do* (`Do`) |

> **Important Note:** Because fret/pitch division criteria differ between older Persian treatises and contemporary practice, some *Abjad* letters do not align strictly with modern equivalents; this table serves as an approximation for cross-referencing.

* ***Zīr* vs. *Bam* (High vs. Low):** In Persian terminology, higher-frequency pitches are called ***Zīr*** (literally "below/under," also termed *Ḥeddat* or *Tīzī* in classical treatises) and lower-frequency pitches are called ***Bam*** (literally "above/on top," also termed *Ṯeql* or *Gerānī*). This convention originates from instruments like the *ʿŪd*, *Tār*, and *Setār*, where higher-pitched strings sit physically lower on the instrument (*Pāʾīn-dasteh*) and bass strings sit higher (*Bālā-dasteh*).
* ***Koron* and *Sori*:** Coined by ʿAlī-Naqī Vazīrī (derived via Abjad numerology from the letters of his own name, *ʿAlī-Naqī* $= 270$), *Koron* (<svg class="accidental-svg" viewBox="0 0 18 24" width="0.8em" height="1.1em" aria-label="Koron" style="display:inline-block;vertical-align:-0.15em;"><path d="M5.5 3v18M5.5 3L14 7.2L5.5 11.4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>) lowers a pitch by an approximate microtonal step, while *Sori* (<svg class="accidental-svg" viewBox="0 0 20 24" width="0.85em" height="1.1em" aria-label="Sori" style="display:inline-block;vertical-align:-0.15em;"><path d="M7.5 3v18M12.5 2.5v18M3.5 8.5L15.5 12L3.5 15.5" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/></svg>) raises it.

<figure class="interactive-figure" id="koron-sori-lab">
  <div class="figure-controls">
    <label for="ks-base-select">Reference Pitch:</label>
    <select id="ks-base-select">
      <option value="293.66" selected>D4 (Re ≈ 293.66 Hz)</option>
      <option value="261.63">C4 (Do ≈ 261.63 Hz)</option>
      <option value="329.63">E4 (Mi ≈ 329.63 Hz)</option>
      <option value="440.00">A4 (La = 440.00 Hz)</option>
    </select>

    <label for="ks-context-select">Intonation Context:</label>
    <select id="ks-context-select">
      <option value="theory" selected>Vazīrī Theory / Notation (±50¢ Quarter Tone)</option>
      <option value="shur">Performance Practice: Slightly Lower Koron, ~-60¢</option>
      <option value="segah">Performance Practice: Slightly Higher Koron, ~-40¢</option>
    </select>
  </div>

  <div class="figure-controls">
    <button type="button" class="audio-btn" id="ks-play-koron">
      <svg class="accidental-svg" viewBox="0 0 18 24" width="0.8em" height="1.1em" aria-label="Koron" style="display:inline-block;vertical-align:-0.15em;"><path d="M5.5 3v18M5.5 3L14 7.2L5.5 11.4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg> Koron
    </button>
    <button type="button" class="audio-btn" id="ks-play-natural">
      ▶ ♮ Natural (0¢)
    </button>
    <button type="button" class="audio-btn" id="ks-play-sori">
      ▶ <svg class="accidental-svg" viewBox="0 0 20 24" width="0.85em" height="1.1em" aria-hidden="true" style="display:inline-block;vertical-align:-0.15em;"><path d="M7.5 3v18M12.5 2.5v18M3.5 8.5L15.5 12L3.5 15.5" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/></svg> Sori
    </button>
    <button type="button" class="audio-btn" id="ks-play-compare">
      ▶ <svg class="accidental-svg" viewBox="0 0 18 24" width="0.8em" height="1.1em" aria-hidden="true" style="display:inline-block;vertical-align:-0.15em;"><path d="M5.5 3v18M5.5 3L14 7.2L5.5 11.4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg> → ♮ → <svg class="accidental-svg" viewBox="0 0 20 24" width="0.85em" height="1.1em" aria-hidden="true" style="display:inline-block;vertical-align:-0.15em;"><path d="M7.5 3v18M12.5 2.5v18M3.5 8.5L15.5 12L3.5 15.5" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <button type="button" class="audio-btn" id="ks-play-chord">▶ Harmonic Cluster</button>
  </div>

  <div class="ks-pitch-strip" aria-hidden="true">
    <div class="ks-marker" id="ks-marker-koron">
      <span class="ks-tag"><svg class="accidental-svg" viewBox="0 0 18 24" width="0.8em" height="1.1em" aria-hidden="true" style="display:inline-block;vertical-align:-0.15em;"><path d="M5.5 3v18M5.5 3L14 7.2L5.5 11.4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg> Koron (U+1D1EA)</span>
      <span class="ks-hz" id="ks-hz-koron">—</span>
    </div>
    <div class="ks-marker is-center" id="ks-marker-natural">
      <span class="ks-tag">♮ Natural (0¢)</span>
      <span class="ks-hz" id="ks-hz-natural">—</span>
    </div>
    <div class="ks-marker" id="ks-marker-sori">
      <span class="ks-tag"><svg class="accidental-svg" viewBox="0 0 20 24" width="0.85em" height="1.1em" aria-hidden="true" style="display:inline-block;vertical-align:-0.15em;"><path d="M7.5 3v18M12.5 2.5v18M3.5 8.5L15.5 12L3.5 15.5" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/></svg> Sori (U+1D1E9)</span>
      <span class="ks-hz" id="ks-hz-sori">—</span>
    </div>
  </div>

  <div id="ks-readout" class="figure-readout"></div>
  <figcaption>Interactive Koron (U+1D1EA) & Sori (U+1D1E9) figure: compare Vazīrī's theoretical quarter-tone definition (±50¢) with subtle context-dependent shifts in traditional Radif performance.</figcaption>
</figure>

### Theory vs. Performance Practice: Fixed Quarter Tone vs. Contextual Intonation

In standard Persian music theory and notation (the system introduced by ʿAlī-Naqī Vazīrī), **Koron** (<svg class="accidental-svg" viewBox="0 0 18 24" width="0.8em" height="1.1em" aria-label="Koron" style="display:inline-block;vertical-align:-0.15em;"><path d="M5.5 3v18M5.5 3L14 7.2L5.5 11.4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>) is defined as an exact **quarter tone** (one-fourth of a whole tone, or half of a flat $\flat$). In live performance and traditional instrument tuning, however, its exact pitch is not strictly fixed and shifts according to the *Dastgāh* and *Maqām* being performed:

* **In Theory & Notation (Exact Quarter Tone):** To make Persian music notatable on the international five-line staff, Vazīrī divided a whole tone into four equal parts. Within this theoretical framework, *Koron* (<svg class="accidental-svg" viewBox="0 0 18 24" width="0.8em" height="1.1em" aria-label="Koron" style="display:inline-block;vertical-align:-0.15em;"><path d="M5.5 3v18M5.5 3L14 7.2L5.5 11.4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>) lowers a pitch by an exact quarter tone ($-50\text{ ¢}$, half a semitone), and *Sori* (<svg class="accidental-svg" viewBox="0 0 20 24" width="0.85em" height="1.1em" aria-label="Sori" style="display:inline-block;vertical-align:-0.15em;"><path d="M7.5 3v18M12.5 2.5v18M3.5 8.5L15.5 12L3.5 15.5" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/></svg>) raises it by an exact quarter tone ($+50\text{ ¢}$).
* **In Performance Practice (Unequal / Contextual Intervals):** In traditional *Radif* performance—especially on instruments such as the *Tār*, *Setār*, and *Santūr*—the *Koron* (<svg class="accidental-svg" viewBox="0 0 18 24" width="0.8em" height="1.1em" aria-label="Koron" style="display:inline-block;vertical-align:-0.15em;"><path d="M5.5 3v18M5.5 3L14 7.2L5.5 11.4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>) interval is not strictly equal to an exact quarter tone. Guided by ear, musical expression, and the active modal context.

---

## Intervals (*Fāseleh* / *Boʿd*)

An **interval** (*Fāseleh* or *Boʿd*) is the difference in pitch (frequency) between two tones:

* **Harmonic Interval (*Fāseleh-ye Hamāhang*):** Two tones sounded simultaneously.
* **Melodic Interval (*Fāseleh-ye Laḥnī*):** Two tones sounded sequentially.

### The Three Primary Consonant Intervals

Three foundational intervals are shared with the earliest overtones of the harmonic series and are considered **consonant** (*Molāyem*) both harmonically and melodically:

| Persian Term | Classical Arabic Term | Western Equivalent | String Length Ratio (from Bridge) | Frequency Ratio | Example (from $C \approx 261\text{ Hz}$) |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **Hangām** | *Dhī al-Koll* | Octave | $\frac{1}{2}$ | $2 : 1$ | $261 \times 2 = 522\text{ Hz}$ |
| **Panjom-e Dorost** | *Dhī al-Khams* | Perfect Fifth | $\frac{2}{3}$ | $3 : 2$ | $261 \times \frac{3}{2} = 391.5\text{ Hz}$ |
| **Chahārom-e Dorost** | *Dhī al-Arbaʿ* | Perfect Fourth | $\frac{3}{4}$ | $4 : 3$ | $261 \times \frac{4}{3} = 348\text{ Hz}$ |

---

### The Four Seconds in Persian Music

Persian music distinguishes four step intervals within the family of seconds:

| Symbol | Persian Name | English / Western Analogy | Example | Description & Theoretical Notes |
| :---: | :--- | :--- | :--- | :--- |
| **ب** (*B*) | **Baqiyyeh** | Minor Second (~semitone) | *D* → *E*♭ | Smallest standard step used in practice. |
| **ج** (*J*) | **Mojannab** | Neutral Second ("half-major 2nd") | *D* → *E* <svg class="accidental-svg" viewBox="0 0 18 24" width="0.8em" height="1.1em" aria-label="Koron" style="display:inline-block;vertical-align:-0.15em;"><path d="M5.5 3v18M5.5 3L14 7.2L5.5 11.4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg> (*Mi* <svg class="accidental-svg" viewBox="0 0 18 24" width="0.8em" height="1.1em" aria-label="Koron" style="display:inline-block;vertical-align:-0.15em;"><path d="M5.5 3v18M5.5 3L14 7.2L5.5 11.4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>) | Larger than *Baqiyyeh*, smaller than *Ṭanīnī*; absent from 12-TET. Often approximated as "three-quarter tone," though not strictly $150\text{ ¢}$. |
| **ط** (*Ṭ*) | **Ṭanīnī** | Major Second (whole tone) | *C* → *D* | String length $\frac{8}{9}$, frequency ratio $9:8$. |
| **هـ** (*H*) | **Bīsh-Ṭanīnī** | Super-Major Second ("over-whole tone") | *D* <svg class="accidental-svg" viewBox="0 0 18 24" width="0.8em" height="1.1em" aria-label="Koron" style="display:inline-block;vertical-align:-0.15em;"><path d="M5.5 3v18M5.5 3L14 7.2L5.5 11.4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg> → *E* | Larger than a whole tone and smaller than a minor third; equals $\text{Mojannab} + \text{Baqiyyeh}$ ($\text{ج} + \text{ب}$). |

<figure class="interactive-figure" id="mojannab-lab">
  <div class="figure-controls">
    <label for="moj-root-select">Root Tone:</label>
    <select id="moj-root-select">
      <option value="293.66" selected>D4 (Re ≈ 293.66 Hz)</option>
      <option value="261.63">C4 (Do ≈ 261.63 Hz)</option>
      <option value="220.00">A3 (La = 220.00 Hz)</option>
      <option value="349.23">F4 (Fa ≈ 349.23 Hz)</option>
    </select>

    <label for="moj-cents-select">Mojannab (ج) Approximation:</label>
    <select id="moj-cents-select">
      <option value="150" selected>Standard Pedagogical (~150¢ Neutral 2nd)</option>
      <option value="140">Compact Neutral 2nd (~140¢)</option>
      <option value="160">Wide Neutral 2nd (~160¢)</option>
    </select>
  </div>

  <div class="figure-controls">
    <button type="button" class="audio-btn" id="moj-play-root">▶ Root Tone</button>
    <button type="button" class="audio-btn" id="moj-play-target">
      ▶ Target + <svg class="accidental-svg" viewBox="0 0 18 24" width="0.8em" height="1.1em" aria-label="Koron" style="display:inline-block;vertical-align:-0.15em;"><path d="M5.5 3v18M5.5 3L14 7.2L5.5 11.4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg> (ج)
    </button>
    <button type="button" class="audio-btn" id="moj-play-melodic">▶ Melodic Step</button>
    <button type="button" class="audio-btn" id="moj-play-harmonic">▶ Harmonic Interval</button>
  </div>

  <div class="ks-pitch-strip" aria-hidden="true">
    <div class="ks-marker is-center" id="moj-marker-root">
      <span class="ks-tag">Root (0¢)</span>
      <span class="ks-hz" id="moj-hz-root">—</span>
    </div>
    <div class="ks-marker" id="moj-marker-target">
      <span class="ks-tag">Mojannab ج</span>
      <span class="ks-hz" id="moj-hz-target">—</span>
    </div>
    <div class="ks-marker" id="moj-marker-ref">
      <span class="ks-tag">Ref: Baqiyyeh (100¢) / Ṭanīnī (200¢)</span>
      <span class="ks-hz" id="moj-hz-ref">—</span>
    </div>
  </div>

  <div id="moj-readout" class="figure-readout"></div>
  <figcaption>Interactive Mojannab (ج) figure: compare a neutral second against a minor second (Baqiyyeh) and major second (Ṭanīnī) melodically and harmonically.</figcaption>
</figure>

<figure class="interactive-figure" id="bish-tanini-lab">
  <div class="figure-controls">
    <label for="bt-root-select">Starting Tone:</label>
    <select id="bt-root-select">
      <option value="277.18" selected>D4 Koron (Re 𝄪/Koron ≈ 277.18 Hz)</option>
      <option value="261.63">C4 (Do ≈ 261.63 Hz)</option>
      <option value="293.66">D4 (Re ≈ 293.66 Hz)</option>
      <option value="329.63">E4 (Mi ≈ 329.63 Hz)</option>
    </select>

    <label for="bt-cents-select">Bīsh-Ṭanīnī (هـ = ج + ب) Span:</label>
    <select id="bt-cents-select">
      <option value="250" selected>~250¢ (150¢ Mojannab + 100¢ Baqiyyeh)</option>
      <option value="240">~240¢ (140¢ Mojannab + 100¢ Baqiyyeh)</option>
      <option value="260">~260¢ (160¢ Mojannab + 100¢ Baqiyyeh)</option>
    </select>
  </div>

  <div class="figure-controls">
    <button type="button" class="audio-btn" id="bt-play-start">▶ Lower Tone</button>
    <button type="button" class="audio-btn" id="bt-play-upper">▶ Upper Tone (هـ)</button>
    <button type="button" class="audio-btn" id="bt-play-melodic">▶ Melodic Step</button>
    <button type="button" class="audio-btn" id="bt-play-harmonic">▶ Harmonic Interval</button>
  </div>

  <div class="ks-pitch-strip" aria-hidden="true">
    <div class="ks-marker is-center" id="bt-marker-start">
      <span class="ks-tag">Lower Tone (0¢)</span>
      <span class="ks-hz" id="bt-hz-start">—</span>
    </div>
    <div class="ks-marker" id="bt-marker-upper">
      <span class="ks-tag">Bīsh-Ṭanīnī هـ</span>
      <span class="ks-hz" id="bt-hz-upper">—</span>
    </div>
    <div class="ks-marker" id="bt-marker-ref">
      <span class="ks-tag">Ref: Ṭanīnī (200¢) / Minor 3rd (300¢)</span>
      <span class="ks-hz" id="bt-hz-ref">—</span>
    </div>
  </div>

  <div id="bt-readout" class="figure-readout"></div>
  <figcaption>Interactive Bīsh-Ṭanīnī (هـ) figure: hear how a super-major second (ج + ب) sits between a major second (Ṭanīnī) and a minor third.</figcaption>
</figure>

> **Note on the "Quarter Tone" (*Robʿ-e Pardeh*):** Although a smaller interval (such as *E*♭ to *E* <svg class="accidental-svg" viewBox="0 0 18 24" width="0.8em" height="1.1em" aria-label="Koron" style="display:inline-block;vertical-align:-0.15em;"><path d="M5.5 3v18M5.5 3L14 7.2L5.5 11.4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>) exists physically between frets on the *Tār* and *Setār*, it is rarely used as a melodic step in Persian music and is excluded from standard *Dāng* construction.

---

### Summary Classification of Intervals (Smallest to Largest)

Using the step symbols **ب** (*Baqiyyeh*), **ج** (*Mojannab*), and **ط** (*Ṭanīnī*):

1. **Seconds (*Dovvom-hā*):**
   * Minor Second (*Baqiyyeh*): $\text{ب}$
   * Neutral Second (*Mojannab*): $\text{ج}$
   * Major Second (*Ṭanīnī*): $\text{ط}$
   * Super-Major Second (*Bīsh-Ṭanīnī*): $\text{ج} + \text{ب}$
2. **Thirds (*Sevvom-hā*):**
   * Minor Third (*Sevvom-e Kūchak*): $\text{ط} + \text{ب}$ (e.g., *C* → *E*♭)
   * Neutral Third (*Sevvom-e Nīm-Bozorg*): $\text{ط} + \text{ج}$ (e.g., *C* → *E* <svg class="accidental-svg" viewBox="0 0 18 24" width="0.8em" height="1.1em" aria-label="Koron" style="display:inline-block;vertical-align:-0.15em;"><path d="M5.5 3v18M5.5 3L14 7.2L5.5 11.4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>)
   * Major Third (*Sevvom-e Bozorg*): $\text{ط} + \text{ط}$ (e.g., *C* → *E*)
3. **Fourth, Fifth & Octave:**
   * Perfect Fourth (*Chahārom-e Dorost* / *Dhī al-Arbaʿ*): $\text{ط} + \text{ط} + \text{ب}$
   * Perfect Fifth (*Panjom-e Dorost* / *Dhī al-Khams*): $\text{ط} + \text{ط} + \text{ط} + \text{ب}$
   * Octave (*Hangām* / *Dhī al-Koll*): $\text{Perfect Fourth} + \text{Perfect Fifth}$

---

## Consonance vs. Dissonance (*Molāyem* vs. *Nāmolāyem*)

* **Harmonic vs. Melodic Consonance:** The four seconds (*Ṭanīnī, Baqiyyeh, Mojannab, Bīsh-Ṭanīnī*) are **dissonant when played simultaneously** (harmonically), yet **consonant when played sequentially** (melodically). Classical treatises refer to the first three (*Ṭanīnī, Baqiyyeh, Mojannab*) as *Abʿād-e Thalātheh-ye Laḥniyyeh* ("the three melodic intervals").
* **Melodic Restrictions in Persian Practice:**
  * Two consecutive *Baqiyyeh* intervals ($\text{ب} + \text{ب}$) are considered melodically dissonant.
  * Three consecutive *Ṭanīnī* intervals ($\text{ط} + \text{ط} + \text{ط}$) or three consecutive *Mojannab* intervals ($\text{ج} + \text{ج} + \text{ج}$) are avoided in sequence.
  * Melodic leaps larger than a **Perfect Fifth** are rarely used.

---

## *Dāng* (Tetrachord) & Construction Rules

A ***Dāng*** consists of **four consecutive tones** whose outer boundary spans a **Perfect Fourth** ($\text{Chahārom-e Dorost}$). In Persian classical music, melodic motion (*Gardesh-e Naghamāt*) primarily unfolds within a single *Dāng*, and larger modal ranges are formed by joining multiple *Dāngs* together.

### Valid *Dāng* Examples
* *C*, *D*, *E*, *F* → $\text{ط} + \text{ط} + \text{ب}$
* *D*, *E* <svg class="accidental-svg" viewBox="0 0 18 24" width="0.8em" height="1.1em" aria-label="Koron" style="display:inline-block;vertical-align:-0.15em;"><path d="M5.5 3v18M5.5 3L14 7.2L5.5 11.4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>, *F*, *G* → $\text{ج} + \text{ج} + \text{ط}$
* *A*, *B*♭, *C*, *D* → $\text{ب} + \text{ط} + \text{ط}$
* *E* <svg class="accidental-svg" viewBox="0 0 18 24" width="0.8em" height="1.1em" aria-label="Koron" style="display:inline-block;vertical-align:-0.15em;"><path d="M5.5 3v18M5.5 3L14 7.2L5.5 11.4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>, *F*, *G*, *A* <svg class="accidental-svg" viewBox="0 0 18 24" width="0.8em" height="1.1em" aria-label="Koron" style="display:inline-block;vertical-align:-0.15em;"><path d="M5.5 3v18M5.5 3L14 7.2L5.5 11.4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg> → $\text{ج} + \text{ط} + \text{ج}$
* *B*, *C*, *D*, *E* → $\text{ب} + \text{ط} + \text{ط}$

### Invalid *Dāng* Counterexamples
* *C*, *D* <svg class="accidental-svg" viewBox="0 0 18 24" width="0.8em" height="1.1em" aria-label="Koron" style="display:inline-block;vertical-align:-0.15em;"><path d="M5.5 3v18M5.5 3L14 7.2L5.5 11.4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>, *D*♮, *F* or *F*, *A*♭, *A* <svg class="accidental-svg" viewBox="0 0 18 24" width="0.8em" height="1.1em" aria-label="Koron" style="display:inline-block;vertical-align:-0.15em;"><path d="M5.5 3v18M5.5 3L14 7.2L5.5 11.4" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>, *B*♭: **Invalid**, because they contain an interval smaller than *Baqiyyeh* (a "quarter tone").
* *G*, *A*♭, *A*♮, *C* or *E*, *G*, *A*♭, *A*♮: **Invalid**, because they place two *Baqiyyeh* (half-step) intervals consecutively.

**Rule:** A valid Persian *Dāng* is constructed exclusively from sequences of *Ṭanīnī* ($\text{ط}$), *Mojannab* ($\text{ج}$), *Baqiyyeh* ($\text{ب}$), and *Bīsh-Ṭanīnī* ($\text{هـ}$) spanning a Perfect Fourth, **without ever placing two *Baqiyyeh* intervals consecutively**.
```