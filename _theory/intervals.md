---
title: Intervals & Dāng (Tetrachords)
summary: Acoustic foundations, pitch terminology, Persian interval classifications, consonance vs. dissonance, and Dāng construction rules.
order: 2
---

In Persian music theory, the study of intervals (*Fāseleh* or *Boʿd*) begins with the physical nature of sound, periodic pitch (*Naghmeh*), and string-length ratios on traditional instruments such as the *Tār* and *Setār*.

---

## 1. Historical Notation & Pitch Terminology

* **Abjad Notation:** Classical Persian theorists notated pitches using the Arabic/Persian *Abjad* letter sequence (`ا ب ج د هـ و ز ح ط ی` followed by `یا یب یج ...` for the upper octave), accompanied by numerals indicating rhythmic duration.
* ***Zīr* vs. *Bam* (High vs. Low):** In Persian terminology, higher-frequency pitches are called ***Zīr*** (literally "below/under," also termed *Ḥeddat* or *Tīzī* in classical treatises) and lower-frequency pitches are called ***Bam*** (literally "above/on top," also termed *Ṯeql* or *Gerānī*). This convention originates from instruments like the *ʿŪd*, *Tār*, and *Setār*, where higher-pitched strings sit physically lower on the instrument (*Pāʾīn-dasteh*) and bass strings sit higher (*Bālā-dasteh*).
* ***Koron* and *Sori*:** Coined by ʿAlī-Naqī Vazīrī (derived via Abjad numerology from the letters of his own name, *ʿAlī-Naqī* $= 270$), *Koron* lowers a pitch by an approximate microtonal step, while *Sori* raises it.

<figure class="interactive-figure" id="koron-sori-lab">
  <div class="figure-controls">
    <label for="ks-base-select">Reference Pitch:</label>
    <select id="ks-base-select">
      <option value="293.66" selected>D4 (Re ≈ 293.66 Hz)</option>
      <option value="261.63">C4 (Do ≈ 261.63 Hz)</option>
      <option value="329.63">E4 (Mi ≈ 329.63 Hz)</option>
      <option value="440.00">A4 (La = 440.00 Hz)</option>
    </select>

    <label for="ks-cents-slider">Microtonal Offset:</label>
    <input id="ks-cents-slider" type="range" min="30" max="200" step="5" value="140" />
    <code id="ks-cents-readout">±140¢</code>
  </div>

  <div class="figure-controls">
    <button type="button" class="audio-btn" id="ks-play-koron">▶ Koron (Lowered)</button>
    <button type="button" class="audio-btn" id="ks-play-natural">▶ Natural (♮)</button>
    <button type="button" class="audio-btn" id="ks-play-sori">▶ Sori (Raised)</button>
    <button type="button" class="audio-btn" id="ks-play-compare">▶ Koron → Natural → Sori</button>
    <button type="button" class="audio-btn" id="ks-play-chord">▶ Harmonic Cluster</button>
  </div>

  <div class="ks-pitch-strip" aria-hidden="true">
    <div class="ks-marker" id="ks-marker-koron">
      <span class="ks-tag">Koron</span>
      <span class="ks-hz" id="ks-hz-koron">—</span>
    </div>
    <div class="ks-marker is-center" id="ks-marker-natural">
      <span class="ks-tag">Natural (♮)</span>
      <span class="ks-hz" id="ks-hz-natural">—</span>
    </div>
    <div class="ks-marker" id="ks-marker-sori">
      <span class="ks-tag">Sori</span>
      <span class="ks-hz" id="ks-hz-sori">—</span>
    </div>
  </div>

  <div id="ks-readout" class="figure-readout"></div>
</figure>

---

## 2. Definition & Types of Intervals (*Fāseleh* / *Boʿd*)

An **interval** (*Fāseleh* or *Boʿd*) is the difference in pitch (frequency) between two tones:

* **Harmonic Interval (*Fāseleh-ye Hamāhang*):** Two tones sounded simultaneously.
* **Melodic Interval (*Fāseleh-ye Laḥnī*):** Two tones sounded sequentially.

---

## 3. The Three Primary Consonant Intervals

Three foundational intervals are shared with the earliest overtones of the harmonic series and are considered **consonant** (*Molāyem*) both harmonically and melodically:

| Persian Term | Classical Arabic Term | Western Equivalent | String Length Ratio (from Bridge) | Frequency Ratio | Example (from $C \approx 261\text{ Hz}$) |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **Hangām** | *Dhī al-Koll* | Octave | $\frac{1}{2}$ | $2 : 1$ | $261 \times 2 = 522\text{ Hz}$ |
| **Panjom-e Dorost** | *Dhī al-Khams* | Perfect Fifth | $\frac{2}{3}$ | $3 : 2$ | $261 \times \frac{3}{2} = 391.5\text{ Hz}$ |
| **Chahārom-e Dorost** | *Dhī al-Arbaʿ* | Perfect Fourth | $\frac{3}{4}$ | $4 : 3$ | $261 \times \frac{4}{3} = 348\text{ Hz}$ |

---

## 4. The Four Seconds in Persian Music

Persian music distinguishes four step intervals within the family of seconds:

| Symbol | Persian Name | English / Western Analogy | Example | Description & Theoretical Notes |
| :---: | :--- | :--- | :--- | :--- |
| **ب** (*B*) | **Baqiyyeh** | Minor Second (~semitone) | $D \rightarrow E\flat$ | Smallest standard step used in practice. |
| **ج** (*J*) | **Mojannab** | Neutral Second ("half-major 2nd") | $D \rightarrow E\flat\!\!\!/$ (*Mi Koron*) | Larger than *Baqiyyeh*, smaller than *Ṭanīnī*; absent from 12-TET. Often approximated as "three-quarter tone," though not strictly $150\text{ ¢}$. |
| **ط** (*Ṭ*) | **Ṭanīnī** | Major Second (whole tone) | $C \rightarrow D$ | String length $\frac{8}{9}$, frequency ratio $9:8$. |
| **هـ** (*H*) | **Bīsh-Ṭanīnī** | Super-Major Second ("over-whole tone") | $D\flat\!\!\!/ \rightarrow E$ | Larger than a whole tone and smaller than a minor third; equals $\text{Mojannab} + \text{Baqiyyeh}$ ($\text{ج} + \text{ب}$). |

> **Note on the "Quarter Tone" (*Robʿ-e Pardeh*):** Although a smaller interval (such as $E\flat$ to $E\flat\!\!\!/$) exists physically between frets on the *Tār* and *Setār*, it is rarely used as a melodic step in Persian music and is excluded from standard *Dāng* construction.

---

## 5. Summary Classification of Intervals (Smallest to Largest)

Using the step symbols **ب** (*Baqiyyeh*), **ج** (*Mojannab*), and **ط** (*Ṭanīnī*):

1. **Seconds (*Dovvom-hā*):**
   * Minor Second (*Baqiyyeh*): $\text{ب}$
   * Neutral Second (*Mojannab*): $\text{ج}$
   * Major Second (*Ṭanīnī*): $\text{ط}$
   * Super-Major Second (*Bīsh-Ṭanīnī*): $\text{ج} + \text{ب}$
2. **Thirds (*Sevvom-hā*):**
   * Minor Third (*Sevvom-e Kūchak*): $\text{ط} + \text{ب}$ (e.g., $C \rightarrow E\flat$)
   * Neutral Third (*Sevvom-e Nīm-Bozorg*): $\text{ط} + \text{ج}$ (e.g., $C \rightarrow E\flat\!\!\!/$)
   * Major Third (*Sevvom-e Bozorg*): $\text{ط} + \text{ط}$ (e.g., $C \rightarrow E$)
3. **Fourth, Fifth & Octave:**
   * Perfect Fourth (*Chahārom-e Dorost* / *Dhī al-Arbaʿ*): $\text{ط} + \text{ط} + \text{ب}$
   * Perfect Fifth (*Panjom-e Dorost* / *Dhī al-Khams*): $\text{ط} + \text{ط} + \text{ط} + \text{ب}$
   * Octave (*Hangām* / *Dhī al-Koll*): $\text{Perfect Fourth} + \text{Perfect Fifth}$

---

## 6. Consonance vs. Dissonance (*Molāyem* vs. *Nāmolāyem*)

* **Harmonic vs. Melodic Consonance:** The four seconds (*Ṭanīnī, Baqiyyeh, Mojannab, Bīsh-Ṭanīnī*) are **dissonant when played simultaneously** (harmonically), yet **consonant when played sequentially** (melodically). Classical treatises refer to the first three (*Ṭanīnī, Baqiyyeh, Mojannab*) as *Abʿād-e Thalātheh-ye Laḥniyyeh* ("the three melodic intervals").
* **Melodic Restrictions in Persian Practice:**
  * Two consecutive *Baqiyyeh* intervals ($\text{ب} + \text{ب}$) are considered melodically dissonant.
  * Three consecutive *Ṭanīnī* intervals ($\text{ط} + \text{ط} + \text{ط}$) or three consecutive *Mojannab* intervals ($\text{ج} + \text{ج} + \text{ج}$) are avoided in sequence.
  * Melodic leaps larger than a **Perfect Fifth** are rarely used.

---

## 7. *Dāng* (Tetrachord) & Construction Rules

A ***Dāng*** consists of **four consecutive tones** whose outer boundary spans a **Perfect Fourth** ($\text{Chahārom-e Dorost}$). In Persian classical music, melodic motion (*Gardesh-e Naghamāt*) primarily unfolds within a single *Dāng*, and larger modal ranges are formed by joining multiple *Dāngs* together.

### Valid *Dāng* Examples
* $C, D, E, F \rightarrow \text{ط} + \text{ط} + \text{ب}$
* $D, E\flat\!\!\!/, F, G \rightarrow \text{ج} + \text{ج} + \text{ط}$
* $A, B\flat, C, D \rightarrow \text{ب} + \text{ط} + \text{ط}$
* $E\flat\!\!\!/, F, G, A\flat\!\!\!/ \rightarrow \text{ج} + \text{ط} + \text{ج}$
* $B, C, D, E \rightarrow \text{ب} + \text{ط} + \text{ط}$

### Invalid *Dāng* Counterexamples
* $C, D\flat\!\!\!/, D\natural, F$ or $F, A\flat, A\flat\!\!\!/, B\flat$: **Invalid**, because they contain an interval smaller than *Baqiyyeh* (a "quarter tone").
* $G, A\flat, A\natural, C$ or $E, G, A\flat, A\natural$: **Invalid**, because they place two *Baqiyyeh* (half-step) intervals consecutively.

**Rule:** A valid Persian *Dāng* is constructed exclusively from sequences of *Ṭanīnī* ($\text{ط}$), *Mojannab* ($\text{ج}$), *Baqiyyeh* ($\text{ب}$), and *Bīsh-Ṭanīnī* ($\text{هـ}$) spanning a Perfect Fourth, **without ever placing two *Baqiyyeh* intervals consecutively**.