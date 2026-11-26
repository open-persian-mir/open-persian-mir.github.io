---
title: Intervals & Dāng (Tetrachords)
summary: Acoustic foundations, pitch terminology, Persian interval classifications, consonance vs. dissonance, and Dāng construction rules.
order: 2
page_css: pages/theory/intervals
page_js: pages/theory/intervals
---

## Historical Notation & Pitch Terminology

* **Abjad Notation:** Classical Persian theorists notated pitches using the Arabic/Persian *Abjad* letter sequence (`ا ب ج د هـ و ز ح ط ی`), accompanied by numerals indicating rhythmic duration.

#### Approximate Abjad-to-Modern Pitch Mapping (*Alif* = *Do*)

| Abjad Letter (Octave 1) | Abjad Numerical Value | Abjad Letter (Octave 2) | Abjad Numerical Value | Equivalent Note |
| :--- | :---: | :--- | :---: | :--- |
| `ا` | 1 | `یح` | 18 | *Do* (`C`) |
| `ب` | 2 | `یط` | 19 | *Re*♭ (`Re b`) |
| `ج` | 3 | `ک` | 20 | *Re* {% include accidental.html type="koron" %} (`Re` Koron) |
| `د` | 4 | `کا` | 21 | *Re* (`Re`) |
| `ه` | 5 | `کب` | 22 | *Mi*♭ (`Mi b`) |
| `و` | 6 | `کج` | 23 | *Mi* {% include accidental.html type="koron" %} (`Mi` Koron) |
| `ز` | 7 | `کد` | 24 | *Mi* (`Mi`) |
| `ح` | 8 | `که` | 25 | *Fa* (`Fa`) |
| `ط` | 9 | `کو` | 26 | *Sol*♭ (`Sol b`) |
| `ی` | 10 | `کز` | 27 | *Sol* {% include accidental.html type="koron" %} (`Sol` Koron) |
| `یا` | 11 | `کح` | 28 | *Sol* (`Sol`) |
| `یب` | 12 | `کط` | 29 | *La*♭ (`La b`) |
| `یج` | 13 | `ل` | 30 | *La* {% include accidental.html type="koron" %} (`La` Koron) |
| `ید` | 14 | `لا` | 31 | *La* (`La`) |
| `یه` | 15 | `لب` | 32 | *Si*♭ (`Si b`) |
| `یو` | 16 | `لج` | 33 | *Si* {% include accidental.html type="koron" %} (`Si` Koron) |
| `یز` | 17 | `لد` | 34 | *Si* (`Si`) |
| `یح` | 18 | `له` | 35 | *Do* (`Do`) |

> **Important Note:** Because fret/pitch division criteria differ between older Persian treatises and contemporary practice, some *Abjad* letters do not align strictly with modern equivalents; this table serves as an approximation for cross-referencing.

* ***Zīr* vs. *Bam* (High vs. Low):** In Persian terminology, higher-frequency pitches are called ***Zīr*** (literally "below/under," also termed *Ḥeddat* or *Tīzī* in classical treatises) and lower-frequency pitches are called ***Bam*** (literally "above/on top," also termed *Ṯeql* or *Gerānī*). This convention originates from instruments like the *ʿŪd*, *Tār*, and *Setār*, where higher-pitched strings sit physically lower on the instrument (*Pāʾīn-dasteh*) and bass strings sit higher (*Bālā-dasteh*).
* ***Koron* and *Sori*:** Coined by ʿAlī-Naqī Vazīrī (derived via Abjad numerology from the letters of his own name, *ʿAlī-Naqī* $= 270$), *Koron* ({% include accidental.html type="koron" %}) lowers a pitch by an approximate microtonal step, while *Sori* ({% include accidental.html type="sori" %}) raises it.

{% include figures/theory/intervals/koron-sori.html %}

### Theory vs. Performance Practice: Fixed Quarter Tone vs. Contextual Intonation

In standard Persian music theory and notation (the system introduced by ʿAlī-Naqī Vazīrī), **Koron** ({% include accidental.html type="koron" %}) is defined as an exact **quarter tone** (one-fourth of a whole tone, or half of a flat $\flat$). In live performance and traditional instrument tuning, however, its exact pitch is not strictly fixed and shifts according to the *Dastgāh* and *Maqām* being performed:

* **In Theory & Notation (Exact Quarter Tone):** To make Persian music notatable on the international five-line staff, Vazīrī divided a whole tone into four equal parts. Within this theoretical framework, *Koron* ({% include accidental.html type="koron" %}) lowers a pitch by an exact quarter tone ($-50\text{ ¢}$, half a semitone), and *Sori* ({% include accidental.html type="sori" %}) raises it by an exact quarter tone ($+50\text{ ¢}$).
* **In Performance Practice (Unequal / Contextual Intervals):** In traditional *Radif* performance—especially on instruments such as the *Tār*, *Setār*, and *Santūr*—the *Koron* ({% include accidental.html type="koron" %}) interval is not strictly equal to an exact quarter tone. Guided by ear, musical expression, and the active modal context.

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
| **ج** (*J*) | **Mojannab** | Neutral Second ("half-major 2nd") | *D* → *E* {% include accidental.html type="koron" %} (*Mi* {% include accidental.html type="koron" %}) | Larger than *Baqiyyeh*, smaller than *Ṭanīnī*; absent from 12-TET. Often approximated as "three-quarter tone," though not strictly $150\text{ ¢}$. |
| **ط** (*Ṭ*) | **Ṭanīnī** | Major Second (whole tone) | *C* → *D* | String length $\frac{8}{9}$, frequency ratio $9:8$. |
| **هـ** (*H*) | **Bīsh-Ṭanīnī** | Super-Major Second ("over-whole tone") | *D* {% include accidental.html type="koron" %} → *E* | Larger than a whole tone and smaller than a minor third; equals $\text{Mojannab} + \text{Baqiyyeh}$ ($\text{ج} + \text{ب}$). |

{% include figures/theory/intervals/step-lab.html key="mojannabLab" prefix="moj" root_label="Root Tone:" span_label="Mojannab (ج) Approximation:" %}

{% include figures/theory/intervals/step-lab.html key="bishTaniniLab" prefix="bt" root_label="Starting Tone:" span_label="Bīsh-Ṭanīnī (هـ = ج + ب) Span:" %}

> **Note on the "Quarter Tone" (*Robʿ-e Pardeh*):** Although a smaller interval (such as *E*♭ to *E* {% include accidental.html type="koron" %}) exists physically between frets on the *Tār* and *Setār*, it is rarely used as a melodic step in Persian music and is excluded from standard *Dāng* construction.

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
   * Neutral Third (*Sevvom-e Nīm-Bozorg*): $\text{ط} + \text{ج}$ (e.g., *C* → *E* {% include accidental.html type="koron" %})
   * Major Third (*Sevvom-e Bozorg*): $\text{ط} + \text{ط}$ (e.g., *C* → *E*)
3. **Fourth, Fifth & Octave:**
   * Perfect Fourth (*Chahārom-e Dorost* / *Dhī al-Arbaʿ*): $\text{ط} + \text{ط} + \text{ب}$
   * Perfect Fifth (*Panjom-e Dorost* / *Dhī al-Khams*): $\text{ط} + \text{ط} + \text{ط} + \text{ب}$
   * Octave (*Hangām* / *Dhī al-Koll*): $\text{Perfect Fourth} + \text{Perfect Fifth}$

---

## Consonance vs. Dissonance (*Molāyem* vs. *Nāmolāyem*)

* **Harmonic vs. Melodic Consonance:** The four seconds (*Ṭanīnī, Baqiyyeh, Mojannab, Bīsh-Ṭanīnī*) are **dissonant when played simultaneously**, yet **consonant when played sequentially**.

{% include figures/theory/intervals/harmonic-melodic.html %}

* **Melodic Restrictions in Persian Practice:**
  * Two consecutive *Baqiyyeh* intervals ($\text{ب} + \text{ب}$) are considered melodically dissonant.
  * Three consecutive *Ṭanīnī* intervals ($\text{ط} + \text{ط} + \text{ط}$) or three consecutive *Mojannab* intervals ($\text{ج} + \text{ج} + \text{ج}$) are avoided in sequence.
  * Melodic leaps larger than a **Perfect Fifth** are rarely used.

---

## *Dāng* (Tetrachord) & Construction Rules

A ***Dāng*** consists of **four consecutive tones** whose outer boundary spans a **Perfect Fourth**. In Persian classical music, melodic motion primarily unfolds within a single *Dāng*, and larger modal ranges are formed by joining multiple *Dāngs* together.

### Valid *Dāng* Examples
* *C*, *D*, *E*, *F* → $\text{ط} + \text{ط} + \text{ب}$
* *D*, *E* {% include accidental.html type="koron" %}, *F*, *G* → $\text{ج} + \text{ج} + \text{ط}$
* *A*, *B*♭, *C*, *D* → $\text{ب} + \text{ط} + \text{ط}$
* *E* {% include accidental.html type="koron" %}, *F*, *G*, *A* {% include accidental.html type="koron" %} → $\text{ج} + \text{ط} + \text{ج}$
* *B*, *C*, *D*, *E* → $\text{ب} + \text{ط} + \text{ط}$

{% include figures/theory/intervals/dang-examples.html %}

### Invalid *Dāng* Counterexamples
* *C*, *D* {% include accidental.html type="koron" %}, *D*♮, *F* or *F*, *A*♭, *A* {% include accidental.html type="koron" %}, *B*♭: **Invalid**, because they contain an interval smaller than *Baqiyyeh* (a "quarter tone").
* *G*, *A*♭, *A*♮, *C* or *E*, *G*, *A*♭, *A*♮: **Invalid**, because they place two *Baqiyyeh* (half-step) intervals consecutively.

**Rule:** A valid Persian *Dāng* is constructed exclusively from sequences of *Ṭanīnī* ($\text{ط}$), *Mojannab* ($\text{ج}$), *Baqiyyeh* ($\text{ب}$), and *Bīsh-Ṭanīnī* ($\text{هـ}$) spanning a Perfect Fourth, **without ever placing two *Baqiyyeh* intervals consecutively**.