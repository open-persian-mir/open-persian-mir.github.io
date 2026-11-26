# Adding Interactive Figures Across Pages and Collections

This guide specifies the conventions, file layout, and wiring required when adding interactive figures (with JSON-backed data, Liquid includes, per-page Sass/CSS, and Web Audio JavaScript) to pages in `_theory/` or any other collection (`_history/`, `_instruments/`, `_styles/`, `_aesthetics/`, `_mir/`).

---

## 1. Directory & File Conventions

Organize figure assets by **collection** and **page slug** so every page remains self-contained while sharing common helpers (such as `_includes/accidental.html`) and site-wide layout hooks:

| Asset Type | Path Convention | Example (`_theory/intervals.md`) |
| :--- | :--- | :--- |
| **Page Content** | `_<collection>/<page-slug>.md` | `_theory/intervals.md` |
| **Figure Data (JSON)** | `_data/figures/<collection>/<page-slug>.json` | `_data/figures/theory/intervals.json` |
| **Figure Includes (Liquid/HTML)** | `_includes/figures/<collection>/<page-slug>/<figure-name>.html` | `_includes/figures/theory/intervals/koron-sori.html` |
| **Per-Page Styles (Sass)** | `_sass/pages/<collection>/_<page-slug>.scss` | `_sass/pages/theory/_intervals.scss` |
| **Per-Page Script (JS)** | `assets/js/pages/<collection>/<page-slug>.js` | `assets/js/pages/theory/intervals.js` |

---

## 2. Front Matter & Layout Wiring

Every page that hosts interactive figures must declare its per-page CSS and JS in its front matter, and the layout applied to that collection must render those assets.

### Page Front Matter

Set `page_css` and `page_js` without leading `/assets/` or trailing file extensions:

```yaml
---
title: Intervals & Dāng (Tetrachords)
summary: Acoustic foundations, pitch terminology, Persian interval classifications, consonance vs. dissonance, and Dāng construction rules.
order: 2
page_css: pages/theory/intervals
page_js: pages/theory/intervals
---
```

### Layout Requirements

Confirm that the active layout for your collection (for example, `_layouts/default.html` or `_layouts/article.html` as configured in `_config.yml`) outputs both conditional asset tags:

**In `<head>`:**
```liquid
{% if page.page_css %}
  <link rel="stylesheet" href="{{ '/assets/css/' | append: page.page_css | append: '.css' | relative_url }}" />
{% endif %}
```

**Before `</body>`:**
```liquid
{% if page.page_js %}
  <script src="{{ '/assets/js/' | append: page.page_js | append: '.js' | relative_url }}" defer></script>
{% endif %}
```

> **Note:** If a collection uses a nested layout (e.g., `_layouts/article.html` wrapping `layout: default`), ensure the conditional `page.page_css` and `page.page_js` tags are present in the layout chain so every collection page receives its assets.

---

## 3. Data, Include, and DOM Contracts

Keep data out of Liquid templates and keep element IDs and `data-*` attributes strictly aligned between each HTML include and the page's JavaScript module.

### JSON Data (`_data/figures/<collection>/<page-slug>.json`)

* Group each figure under a clear `camelCase` key (e.g., `koronSoriLab`, `mojannabLab`, `harmonicMelodic`, `dangExamples`).
* Include:
  * `id`: Must match the root `<figure id="...">` element queried by JavaScript.
  * Option arrays (`value`, `label`, `selected`) for `<select>` controls.
  * Pitch/interval definitions (`cents`, `hz`, `label`, `accidental`, `symbol`, `formula`).
  * `caption`: Descriptive caption text rendered inside `<figcaption>`.

### Include Templates (`_includes/figures/<collection>/<page-slug>/<figure-name>.html`)

* Bind the figure's JSON node at the top of the file:
  ```liquid
  {% assign fig = site.data.figures.<collection>.<page-slug>.<figureKey> %}
  ```
* Wrap the figure in `<figure class="interactive-figure" id="{{ fig.id }}">`.
* Always use `<button type="button">` for interactive controls so clicks never trigger unintended form behavior.
* Render microtonal accidentals via the shared helper:
  ```liquid
  {% include accidental.html type="koron" %}
  {% include accidental.html type="sori" %}
  ```
* Include explicit readout containers (e.g., `*-readout`, `*-hz-*`) and standard visual state classes (`is-active`, `is-lit`, `is-playing`, `is-consonant`, `is-dissonant`).
* For sequential players (such as *Dāng* tetrachords), serialize note frequencies into a comma-separated `data-freqs` attribute on each row and attach a `.dang-note-pill` class (or equivalent pill class) to each note span.

### Embedding in Markdown

Include the figure cleanly in `_<collection>/<page-slug>.md`:

```liquid
{% include figures/theory/intervals/koron-sori.html %}
```

For reusable figure templates (such as `step-lab.html`), pass parameters explicitly:

```liquid
{% include figures/theory/intervals/step-lab.html key="mojannabLab" prefix="moj" root_label="Root Pitch:" span_label="Interval Span:" %}
```

---

## 4. Audio & Interaction Rules for Page Scripts

When authoring `assets/js/pages/<collection>/<page-slug>.js`:

1. **Initialize After DOM Ready:** Wrap setup in `DOMContentLoaded` (or check `document.readyState === "loading"`) and guard every figure block by checking for its root container or required elements before binding listeners.
2. **Unlock Web Audio on User Gesture:** Lazily create `window.AudioContext || window.webkitAudioContext` and `await audioCtx.resume()` inside click handlers before scheduling tones.
3. **Schedule Clean Envelopes:**
   * Anchor all note start times to `ctx.currentTime` (plus any sequential offset).
   * Ramp gain from a small positive floor (`0.0001`) up to peak gain (`0.14`–`0.22`) over ~`0.02s`, then exponentially ramp down to `0.0001` over the note duration to prevent clicks and Web Audio `exponentialRampToValueAtTime` errors.
   * Stop oscillators slightly after the gain ramp completes (`duration + 0.05s`).
4. **Synchronize Visual State & Timers:** Clear any active `setTimeout` handles and remove highlight classes (`is-lit`, `is-active`, `is-playing`) whenever a new playback starts so rapid or overlapping clicks never leave stale highlights.

---

## 5. Checklist for Adding a New Figure or Page

| Step | Action | Verification |
| :--- | :--- | :--- |
| **1. Data** | Create or update `_data/figures/<collection>/<page-slug>.json` with valid JSON. | Restart/rebuild Jekyll with zero JSON parse errors; `<select>` dropdowns and labels populate. |
| **2. Include** | Create `_includes/figures/<collection>/<page-slug>/<name>.html` referencing `site.data.figures...` and `accidental.html`. | Embedding `{% include figures/... %}` renders the figure structure and controls cleanly. |
| **3. Front Matter & Layout** | Set `page_css` and `page_js` in the page's front matter and confirm the layout outputs both tags. | Rendered HTML in `_site/` contains valid `<link>` and `<script>` URLs with no `404` responses. |
| **4. Styles** | Add scoped styles in `_sass/pages/<collection>/_<page-slug>.scss` and import/compile as needed. | Controls, tables, markers, and note pills align cleanly without horizontal overflow. |
| **5. Script** | Add UI update and Web Audio handlers in `assets/js/pages/<collection>/<page-slug>.js`. | Initial `Hz`/readout placeholders update on load; changing dropdowns recalculates values; clicking play highlights markers/pills and plays audio. |