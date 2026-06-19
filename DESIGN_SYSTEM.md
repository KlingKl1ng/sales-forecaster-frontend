# Operartis APS — Design Language & Build System

> **Purpose:** This is the single source of truth for the visual and structural design language of the **Operartis Advanced Planning & Scheduling (APS)** platform. Use it to build new modules (e.g. Production, Logistics) so they stay visually and behaviorally consistent with the existing Terminal and modules.
>
> **Slogan:** *"Optimizing today, Growing tomorrow."*

---

## 1. Architecture Overview

Operartis is a multi-page application made of self-contained HTML files. Each page is a standalone React app rendered via Babel-in-the-browser. There is no build step — every file ships its own CDN imports, Tailwind config, and component tree.

There are **two archetypes** of page. Every screen you build is one of these:

### 1.1 The Terminal (`index.html`)
The **hub / launcher** shown after login. It is the home base of the APS system.
- Presents all optimization modules organized in a **planning-horizon matrix** (Strategic → Tactical → Operational → Cross-Functional).
- Groups modules into clickable **Module Blocks**; each block opens a **modal** listing its sub-modules.
- Contains the company "About" narrative.
- Visual tone: **immersive, dark-first, "command center"** — glassmorphism, grid backgrounds, blob animations, reveal-on-scroll.

### 1.2 Detailed Modules (`forecaster.html`, `mlforecaster.html`, `abcxyz.html`, `inventory.html`, …)
The **working tools**. Each is a focused, app-like workspace for one optimization problem.
- Layout: **left Sidebar (data + config) + top Header + main content area** (dashboards, charts, tables).
- Visual tone: **productive, data-dense, focused** — same brand language, but calmer; glass accents on chrome (sidebar/header), solid surfaces for content.

> **Rule of thumb:** The Terminal *sells and routes*. Modules *do the work*. Both speak the same visual language (gold + slate + glass), tuned to their job.

---

## 2. Tech Stack & Boilerplate (Non-negotiable)

Every page MUST include the same dependency stack so behavior and styling stay identical. Load order matters.

```html
<!-- In <head> -->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
<title>Operartis | {Module Name}</title>
<link rel="icon" type="image/png" href="./icononly_transparent_quadratic.png">

<!-- Tailwind (vendored, JIT in-browser) -->
<script src="./vendor/tailwindcss-3.4.17.js"></script>
<script> tailwind.config = { /* see Section 3 */ } </script>

<!-- Fonts + page styles -->
<style> @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&family=Roboto+Mono:wght@400;500&display=swap'); /* ... */ </style>

<!-- React 17 + Babel (vendored, in-browser JSX) -->
<script src="./vendor/react-17.0.2.production.min.js"></script>
<script src="./vendor/react-dom-17.0.2.production.min.js"></script>
<script src="./vendor/babel-standalone-7.26.10.min.js"></script>

<!-- Icons -->
<script src="./vendor/lucide-current.min.js"></script>

<!-- Data modules add as needed: -->
<script src="./vendor/prop-types-15.8.1.min.js"></script>
<script src="./vendor/recharts-2.1.12.min.js"></script>     <!-- charts -->
<script src="./vendor/xlsx-0.18.5.full.min.js"></script>    <!-- excel I/O -->
<script src="./vendor/lodash-4.17.21.min.js"></script>      <!-- utils -->
```

Body + mount point:

```html
<body>
  <div id="root" class="h-full w-full flex flex-col"></div>
  <script type="text/babel">
    const { useState, useEffect, useRef, useMemo, useCallback, memo } = React;
    // ... app code ...
    ReactDOM.render(<App />, document.getElementById('root'));
  </script>
</body>
```

**Conventions**
- **React 17** + `ReactDOM.render` (not `createRoot`). Keep this for consistency.
- Use **Recharts 2.x** for new modules (Terminal-era files used 1.8.5; standardize on 2.1.12).
- All JSX lives in one `<script type="text/babel">` block. This is intentional — modules are portable single files.
- Asset paths are relative (`./icononly_transparent_nobuffer.png`, etc.).
- The logo always links back to the Terminal: `./` (served by `index.html`).

---

## 3. Design Tokens

### 3.1 Tailwind Config (shared base)

Extend Tailwind identically in every page. The **Terminal** adds a few extra tokens (`obsidian`, `slate`, grid backgrounds) for its immersive look.

```js
tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          gold:   '#f59e0b',   // primary accent — actions, highlights, focus
          dark:   '#b45309',    // gold's deep companion — gradients, hover
          gray:   '#f8fafc',    // light surface
          border: '#e2e8f0',    // hairlines
          // Terminal-only:
          obsidian: '#0f172a',  // deep panel bg
          slate:    '#1e293b'   // grid lines / elevated dark surface
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace']
      },
      fontSize: { xxs: '0.65rem' },          // dense labels/badges
      animation: {
        'fade-in':    'fadeIn 0.2s ease-out',
        'slide-up':   'slideUp 0.3s ease-out',
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4,0,0.6,1) infinite'
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(10px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } }
      }
    }
  }
}
```

### 3.2 Color System

| Role | Light | Dark | Usage |
|---|---|---|---|
| **Brand Gold** | `#f59e0b` (`brand-gold`) | same | Primary CTAs, active states, focus rings, highlights, the "live" accent |
| **Brand Dark** | `#b45309` (`brand-dark`) | same | End of gold gradients, hover on gold |
| **Page bg** | `slate-50` | `#020617` (Terminal) / `#0f172a` (modules) | App background |
| **Surface** | `white` / `white/70` | `slate-900` / `slate-900/70` | Cards, panels, chrome |
| **Text primary** | `slate-800` / `slate-900` | `slate-100` / `white` | Headings, body |
| **Text secondary** | `slate-500` | `slate-400` | Labels, descriptions, meta |
| **Border / hairline** | `slate-200` / `e2e8f0` | `slate-800` / `white/10` | Dividers, card edges |
| **Success / Live** | `emerald-500` / `emerald-600` | `emerald-400` | LIVE badges, success status, export |
| **Danger / Reset** | `rose-500` | `rose-500` | Destructive (reset, remove) |
| **Info** | `sky-500/600` | `sky-400` | CLOUD connection, neutral info |

**Signature gradient** (titles, accents):
```html
<span class="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-brand-dark">...</span>
```

> **The gold rule:** Gold is precious — use it for *one* primary action / focus point per view. Everything else is slate. Overusing gold cheapens the brand.

### 3.3 Typography

- **Inter** — all UI text (weights 400/500/600/700/900). Headings use `font-bold`/`font-black` + `tracking-tight`.
- **Roboto Mono** (`font-mono`) — numbers, metrics, timestamps, status codes, version tags, "system" flavor text.
- **Section eyebrows:** `text-xxs font-bold uppercase tracking-widest text-brand-gold` (or `amber-600 dark:amber-500`).
- **Module title in header:** `font-black uppercase tracking-widest` + gold gradient.
- Tabular/metric numbers: pair `font-mono` with `tabular-nums` where alignment matters.

### 3.4 Spacing, Radius & Elevation

- **Radius scale:** `rounded-lg` (controls/inputs) → `rounded-xl` (cards) → `rounded-2xl` (panels, module blocks) → `rounded-full` (pills, toggles, avatars).
- **Chrome height:** header and sidebar-header are both `h-16`.
- **Sidebar width:** `w-64` expanded · `w-[76px]` collapsed (desktop rail; see §5.2).
- **Content max width:** `max-w-7xl mx-auto` for Terminal/dashboard content.
- **Padding rhythm:** `p-4` (compact cards) · `p-5`/`p-6` (cards/panels) · `p-6 md:p-8` (modals) · page gutters `p-4 sm:p-6 md:p-12`.
- **Shadows:** soft and layered. Signature glass shadow:
  `shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_0_rgba(255,255,255,0.15)]`.
  Gold glow for primary: `shadow-lg shadow-brand-gold/20 hover:shadow-brand-gold/40`.

---

## 4. The Glassmorphism System (Brand Signature)

The most recognizable Operartis trait is **frosted glass**: translucent surfaces, backdrop blur, a soft inner top-highlight, and a thin ring. Apply it to *chrome and elevated/interactive surfaces* (nav, sidebar, header, module blocks, pills), **not** to dense data surfaces (tables, chart bodies) which stay solid for legibility.

**Base glass recipe:**
```html
<div class="
  bg-gradient-to-br from-white/20 to-white/5
  dark:from-slate-800/30 dark:to-slate-900/10
  backdrop-blur-xl
  ring-1 ring-white/30 dark:ring-white/5
  shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_0_rgba(255,255,255,0.15)]
  rounded-2xl
">
```

**Chrome glass (nav / header / sidebar)** — more opaque so content underneath doesn't distract:
```html
<header class="h-16 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl
               border-b border-white/50 dark:border-white/10
               ring-1 ring-white/20 dark:ring-white/5 shadow-sm">
```

Helper class (in `<style>`):
```css
.glass-panel { backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
```

**Anatomy of the look (always combine):**
1. Translucent gradient fill (`from-white/20 to-white/5`).
2. `backdrop-blur-xl` / `backdrop-blur-2xl`.
3. Thin ring: `ring-1 ring-white/30 dark:ring-white/5`.
4. Inset top highlight inside the box-shadow (`inset_0_1px_0_0_rgba(255,255,255,...)`).
5. Soft drop shadow for float.

---

## 5. Core Components & Patterns

### 5.1 Top Navigation (Terminal) / Header (Modules)

Both are `h-16` glass bars with a left brand cluster and right utility cluster.

- **Brand cluster:** logo (`icononly_transparent_nobuffer.png`, `h-8 w-8 md:h-10 md:w-10`) linking to Terminal + wordmark `OPERARTIS` with gold `APS` suffix.
- **Module header title:** centered, absolutely positioned, `font-black uppercase tracking-widest` gold-gradient, truncated.
- **Right utilities:** status pill, mono clock, theme toggle, language toggle, settings gear, user avatar — grouped in a glass pill (`rounded-full` glass container).

**Status pill** (operational / connection):
```html
<div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
  <div class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
  <span class="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-300">SYSTEM OPERATIONAL</span>
</div>
```

**User avatar** (gold gradient chip): `h-8 w-8 rounded-full bg-gradient-to-tr from-brand-gold to-brand-dark text-white shadow-md`.

### 5.2 Sidebar (Modules)

Glass aside for data import, configuration, and primary actions. **Reference implementation:** `forecaster.html` (ML Forecaster).

#### 5.2.1 Layout & responsive behavior

| Breakpoint | Behavior |
|---|---|
| **Mobile / tablet** (`< lg`) | `fixed inset-y-0 left-0 z-50 w-64`. Hidden off-canvas (`-translate-x-full`); hamburger in main header opens it (`translate-x-0`). Semi-transparent scrim (`bg-slate-900/20 backdrop-blur-sm`) closes on tap. Close `X` in sidebar header. **No collapse rail** on small screens. |
| **Desktop** (`lg+`) | `relative` in flex row; always visible. Supports **expanded** (`lg:w-64`) and **collapsed** (`lg:w-[76px]`) widths with `transition-all duration-300`. Main content uses `flex-grow min-w-0` so charts expand when the rail is narrow. |

**Shell classes (forecaster pattern):**
```html
<aside class="
  flex fixed lg:relative inset-y-0 left-0 z-50
  w-64 lg:w-64                    /* lg:w-[76px] when collapsed */
  bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl
  border-r border-white/20 dark:border-white/10
  flex-col h-full shadow-2xl lg:shadow-none
  transition-all duration-300 ease-in-out
  -translate-x-full lg:translate-x-0   /* mobile drawer */
">
```

#### 5.2.2 Collapsible rail (desktop only)

Maximize chart area by collapsing the sidebar to a **76px icon rail**. State is persisted in `localStorage` (`fc-sidebar-collapsed`: `'1'` | `'0'`).

**Edge toggle** — circular chevron on the sidebar's right border, vertically centered in the header (`top-8 -translate-y-1/2 -right-3`), `hidden lg:flex`:

```html
<button class="
  hidden lg:flex absolute -right-3 top-8 -translate-y-1/2 z-30
  h-6 w-6 rounded-full
  bg-white dark:bg-slate-800
  border border-slate-200 dark:border-slate-700
  text-slate-500 hover:text-brand-gold hover:border-brand-gold shadow-md
">
  <!-- ChevronLeft when expanded · ChevronRight when collapsed -->
</button>
```

After toggling, bump a `layoutKey` (~320ms delay) so Recharts re-measures the wider main pane.

| State | Visible regions | Width |
|---|---|---|
| **Expanded** | Full scroll body + sticky footer | `lg:w-64` (256px) |
| **Collapsed** | Logo header (wordmark hidden) + icon rail only | `lg:w-[76px]` |

**Collapsed rail** (`hidden lg:flex` when collapsed): vertical stack of `h-11 w-11 rounded-xl` icon buttons with `title` tooltips (no text labels). Order top→bottom:

1. **Upload** — opens file picker; status dot on icon (`emerald-500` = mapped, `brand-gold` = action required).
2. **Mapping** (gear) — only when a file is loaded; opens column-mapping modal.
3. Hairline divider (`h-px w-8`).
4. **Execute** — gold fill when enabled; spinner when processing.
5. **Export** — emerald fill when enabled; spinner when exporting.
6. **Interface** (only when `batchResults` is loaded) — hairline divider, then:
   - **Batch Overview** (`LayoutDashboardIcon`) — active: `border-brand-gold/40 bg-brand-gold/10 text-brand-gold`.
   - **Detailed View** (`ChartLineIcon`) — same active treatment.
7. **Reset** — `mt-auto`, muted gray → red on hover.

Hide the expanded scroll body and footer with `lg:hidden` when collapsed.

#### 5.2.3 Structure (expanded)

Top→bottom:

1. **Logo header** — `h-16 shrink-0 sticky top-0 z-20`, `border-b border-white/20 dark:border-white/10`, `bg-white/80 dark:bg-slate-900/80 backdrop-blur-md`. Centered logo (`icononly_transparent_nobuffer.png`, `h-8 w-8 md:h-10 md:w-10`, `hover:scale-110`) + `OPERARTIS` wordmark (`font-bold text-base`). Logo links to Terminal.

2. **Scrollable body** — `flex-1 overflow-y-auto scroller px-3 pt-3 gap-6 min-h-0 flex flex-col`. Sections: Source Data → Configuration → Interface (conditional) → Reset (`!mt-auto`).

3. **Sticky footer** — `border-t border-white/20`, `bg-white/80 dark:bg-slate-900/80 backdrop-blur-md`, `shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]`. Centered `Operartis Analytics` (`text-xs font-bold uppercase tracking-wide`) + italic gold slogan.

#### 5.2.4 Section labels

Gold eyebrow with trailing rule (forecaster uses `text-brand-gold` on the line):

```html
<h3 class="text-xxs font-bold text-brand-gold uppercase tracking-widest mb-2
           flex items-center gap-2">
  Source Data
  <span class="h-px flex-1 bg-brand-gold"></span>
</h3>
```

Standard sections in forecaster (expanded body, top→bottom): **Source Data** → **Configuration** → **Interface** (after results load) → **Reset** at bottom of scroll area.

View switching (**Batch Overview** / **Detailed View**) lives in the sidebar **Interface** section — not in the KPI bar.

#### 5.2.5 Source Data dropzone

Dashed upload card; state-driven border and background:

| State | Border / background | Label |
|---|---|---|
| **Empty** | `border-dashed border-slate-300 dark:border-slate-700`; hover `bg-slate-50 dark:bg-slate-800` | Upload icon + `text-xs` prompt; whole card clickable |
| **Loaded + mapped** | `border-emerald-500` + `bg-gradient-to-br from-emerald-500/10 to-teal-500/10` | Filename (`truncate`), `UPLOADED & MAPPED` in `text-[10px] text-emerald-500 font-bold uppercase` |
| **Loaded, mapping incomplete** | `border-brand-gold` + `bg-amber-50/10` | `ACTION REQUIRED` in gold |

When a file is present, show two circular icon actions (`min-w-[28px] min-h-[28px] rounded-full`): **re-upload** and **edit mapping** (opens modal). Hidden `<input type="file" accept=".xlsx,.xls">` triggered by ref.

#### 5.2.6 Configuration block

Separated from Source Data by `border-t border-slate-100 dark:border-slate-800 pt-4`.

- **Field labels:** `text-[10px] font-bold text-slate-500 uppercase block mb-1`.
- **Inputs / selects:** `h-8 text-xxs`, `rounded`, `bg-white dark:bg-slate-800`, `focus:border-brand-gold`, `dark:[color-scheme:dark]` on number inputs.
- **Horizon row:** two `flex-1` number fields (Train / Test) side by side; helper line `text-[9px]` (`text-red-500` on validation mismatch).
- **Actions in form** (full-width, stacked):
  - **Execute Forecast** — primary gold (`bg-brand-gold`, disabled = slate muted).
  - **Export Report** — secondary emerald (`bg-emerald-500`, requires results).

#### 5.2.7 Interface (view mode)

Shown only when forecast results exist (`batchResults`). Separated from Configuration by `border-t border-slate-100 dark:border-slate-800 pt-4`. Section label uses `sidebar.interface` (EN: *Interface*, VI: *Giao diện*, DE: *Ansicht*).

Stacked full-width nav buttons (`flex flex-col gap-2`). Mirrors settings-modal nav styling:

| State | Classes |
|---|---|
| **Active** | `bg-brand-gold text-white shadow-md` |
| **Inactive** | `text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800` |

Buttons (icon + label, `text-xs font-bold uppercase tracking-wide`):

1. **Batch Overview** — `LayoutDashboardIcon`; sets `activeTab` to `'overview'`.
2. **Detailed View** — `ChartLineIcon`; sets `activeTab` to `'details'`.

Selecting a SKU from the overview table or search also switches to `'details'`. Execute resets to `'overview'` while polling.

#### 5.2.8 Reset (destructive, bottom of scroll)

Pushed to bottom with `!mt-auto` inside the scroll column. Not in the configuration form.

```html
<button class="w-full py-2 text-xxs font-bold text-slate-400
               hover:text-red-500 uppercase tracking-wide
               flex items-center justify-center gap-2">
  <RefreshIcon /> Reset Application
</button>
```

No top border/divider above reset in forecaster (keeps the footer area visually clean).

#### 5.2.9 React state (forecaster)

```js
const [isSidebarOpen, setIsSidebarOpen] = useState(false);           // mobile drawer
const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
  () => localStorage.getItem('fc-sidebar-collapsed') === '1'
);
const [isFullScreen, setIsFullScreen] = useState(false);             // hides sidebar entirely
const [activeTab, setActiveTab] = useState('overview');              // 'overview' | 'details' — Interface section
```

Copy keys under `TRANSLATIONS.*.sidebar`: `source_data`, `upload_label`, `uploaded_mapped`, `action_required`, `configuration`, `interface`, `val_method`, `train_h`, `test_h`, `fc_h`, `execute_btn`, `export_btn`, `reset_btn`, `footer_title`, `footer_slogan`, etc.

View-mode labels live under `TRANSLATIONS.*.dashboard`: `batch_overview`, `detailed_view`.

### 5.3 Buttons

| Type | Classes | When |
|---|---|---|
| **Primary** | `bg-brand-gold text-white font-bold rounded-lg shadow-lg shadow-brand-gold/20 hover:bg-amber-600 hover:shadow-brand-gold/40 hover:scale-[1.02] active:scale-95 transition-all` | The one main action (Execute, Run, Optimize) |
| **Success** | `bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/20` | Export / confirm / download |
| **Secondary / icon** | `p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 hover:text-brand-gold transition-colors` | Settings, toolbar icons |
| **Ghost / tab (inactive)** | `text-slate-600 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-white/10` | Tabs, nav items |
| **Tab (active)** | `bg-brand-gold/90 text-white shadow-lg ring-1 ring-white/20` | Active tab |
| **Destructive** | `text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20` | Reset / remove |

**Disabled:** `disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`.
**Loading:** swap icon for the spinner SVG (`animate-spin`) and change label (e.g. "Processing…", "Downloading…").

### 5.4 KPI / Metric Tiles

Compact stat with mono value + uppercase label. Used in the module KPI bar and overviews. Keep them quiet — value in primary text, label in `text-xxs uppercase tracking-wider text-slate-500`.

**Forecaster KPI bar** (`forecaster.html`): four glass metric tiles only — no view tabs (those moved to sidebar §5.2.7). Layout uses a balanced 3-column grid so metrics sit centered while SKU search stays right-aligned:

```html
<div class="grid grid-cols-[1fr_auto_1fr] h-full w-full min-h-16 items-center">
  <div aria-hidden="true"></div>
  <div class="flex items-stretch h-full overflow-x-auto snap-x snap-mandatory">
    <!-- MetricTile × 4 -->
  </div>
  <div class="flex items-center justify-end pl-6 pr-4">{SKU search}</div>
</div>
```

**Metric tile** (glass inset, `snap-start`):

```html
<div class="flex flex-col justify-center items-center px-3 md:px-6
            border-r border-white/20 dark:border-white/10
            bg-white/40 dark:bg-white/5 backdrop-blur-md h-full
            min-w-[100px] md:min-w-[140px] snap-start
            shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]">
  <span class="text-[9px] uppercase font-bold text-slate-500/80 tracking-wider">Total SKUs</span>
  <span class="text-base md:text-lg font-bold font-mono tabular-nums">1,248</span>
</div>
```

### 5.5 Cards

- **Module Block (Terminal):** large glass card, `rounded-2xl`, `min-h-[140px]`, hover lifts (`hover:-translate-y-2 hover:scale-[1.02]`) and reveals a dark **Quick View** overlay listing sub-modules. Live blocks get a gold tint + ring (`ring-1 ring-brand-gold/20`) and an animated emerald GO-LIVE badge.
- **Sub-module Card (modal):** `rounded-xl border`, `hover:border-brand-gold hover:-translate-y-1`. Live cards are full opacity + link out; planned cards are `opacity-70`, non-clickable, with a status chip.
- **Content card (modules):** solid surface `bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700`.

**Status chips:**
```html
<!-- Live --> <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">LIVE</span>
<!-- Planned --> <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-500">CONCEPT</span>
```

**Animated "live" dot** (ping):
```html
<span class="relative flex h-1.5 w-1.5">
  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
  <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
</span>
```

### 5.6 Modals

Centered overlay + blurred backdrop + slide-up content. Standard for module detail, settings, column mapping.

```html
<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
  <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm modal-backdrop" onclick={close}></div>
  <div class="relative w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col
              bg-white dark:bg-[#0f172a] rounded-2xl shadow-2xl
              border border-slate-200 dark:border-slate-800 p-6 md:p-8 modal-content">
    <!-- decorative gold blur in a corner -->
    <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-brand-gold/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
    <!-- header: title + fullDesc + close button -->
    <!-- scrollable body: custom-scrollbar -->
  </div>
</div>
```

Behaviors: close on **Escape**, close on backdrop click, lock body scroll (`document.body.style.overflow='hidden'`) while open. Animations defined as `modalFadeIn` (backdrop) + `modalContentSlideUp` (content) — see Section 6.

### 5.7 Tooltips

Dark, blurred, gold eyebrow + slate body, with a rotated-square arrow. Toggled on hover/click; positioned with absolute offsets.
```html
<div class="w-64 p-4 rounded-xl bg-slate-800/95 text-white backdrop-blur-md border border-slate-700 shadow-2xl">
  <div class="text-xs font-bold text-brand-gold mb-1 uppercase tracking-wider">{title}</div>
  <p class="text-[11px] leading-relaxed text-slate-300">{definition}</p>
</div>
```

### 5.8 Inputs & Forms

- **Text/number/select:** `text-xxs p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 dark:text-slate-200`. For dark date/number pickers add `dark:[color-scheme:dark]`.
- **Labels:** `text-xxs font-bold uppercase text-slate-500 dark:text-slate-400 mb-1`.
- **Inline editable cell** (`.scenario-input`): transparent, right-aligned; on focus → gold border + faint gold bg.
  ```css
  .scenario-input:focus { border-color:#f59e0b; background:rgba(245,158,11,0.1); outline:none; }
  ```
- **Range slider:** custom gold thumb (`#f59e0b`, white/`slate` border) on a `slate-200`/`slate-700` track.

### 5.9 Tables

Solid surface, hairline row dividers, gold-tinted hover. Header row uppercase mono-ish labels.
```css
.table-row-hover:hover td { background-color:#f8fafc; }
.dark .table-row-hover:hover td { background-color:#1e293b; }
```
Rows: `border-b border-slate-100 dark:border-slate-800`. Keep numeric columns `font-mono tabular-nums` and right-aligned.

### 5.10 Custom Scrollbars

Thin, neutral, theme-aware. Include in every page's `<style>`:
```css
::-webkit-scrollbar { width: 4px; height: 4px; }            /* modules: 4px; Terminal main: 6px */
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background:#cbd5e1; border-radius:2px; }
.dark ::-webkit-scrollbar-thumb { background:#475569; }
.scroller { -webkit-overflow-scrolling: touch; scrollbar-width: thin; }
/* For inner panels use a .custom-scrollbar variant at 4px / radius 2px */
```

### 5.11 Icons

**Lucide** (loaded via CDN). In these React-17 files, icons are written as **inline SVG functional components** (24×24, `stroke="currentColor"`, `strokeWidth="2"`, round caps/joins) so they inherit text color. Default sizes: `20×20` in chrome, `16×16` for inline meta.

Maintain a small icon library at the top of each file. Reuse existing glyphs for shared concepts (clock, user, settings/gear, globe = language, sun/moon/system = theme, server = connection, truck/box/factory = domain).

---

## 6. Motion & Animation

Subtle, physical, never flashy. Use the easing curve `cubic-bezier(0.16, 1, 0.3, 1)` for entrances.

| Pattern | Definition | Use |
|---|---|---|
| `animate-fade-in` | `fadeIn 0.2–0.3s ease-out` | Mounting content, tab switches |
| `animate-slide-up` | `slideUp 0.3s` (`translateY(10px)`→0) | Panels, lists appearing |
| **Reveal-on-scroll** (Terminal) | `IntersectionObserver` toggling `reveal-hidden`→`reveal-visible` over `1s`; hidden state = `opacity 0 + translateY(40px) + blur(8px)` | Sections/cards entering viewport, staggered via `delay={idx*100}` |
| **Modal** | `modalFadeIn` (backdrop blur 0→12px) + `modalContentSlideUp` (`translateY(20px) scale(0.95)`→0) | All modals |
| **Blob** (Terminal) | `blob 7s infinite` translating/scaling; offset with `.animation-delay-2000/4000` | Ambient background color blobs |
| Hover lift | `hover:-translate-y-1/2 hover:scale-[1.02]` + shadow growth | Cards/blocks |
| `animate-pulse` / `animate-ping` | Tailwind built-ins | Live dots, status indicators |
| `animate-spin` | Tailwind built-in | Button loading spinner |

Standard transition for interactive elements: `transition-all duration-300` (chrome/theme: up to `duration-500`). Reduce/limit motion on dense data views.

---

## 7. Dark Mode

- **Strategy:** Tailwind `darkMode: 'class'` — toggle `dark` class on `<html>`.
- **Three-state toggle:** `light → dark → system` (cycles). Persist to `localStorage('theme')`. Resolve `system` against `matchMedia('(prefers-color-scheme: dark)')` and subscribe to changes.
- Always author both light and dark classes. Dark surfaces trend toward `slate-900/950` and `#0f172a`/`#020617`; light toward `white`/`slate-50`.
- Icon for current state: `Sun` (when dark), `Moon` (when light), `System/monitor` (when system).

Reference implementation:
```js
const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'system');
useEffect(() => {
  const apply = () => {
    const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = theme === 'dark' || (theme === 'system' && sysDark);
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', theme);
  };
  apply();
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  const onChange = () => theme === 'system' && apply();
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}, [theme]);
```

---

## 8. Internationalization (i18n)

**Every module must ship bilingual: English (`en`) + Vietnamese (`vi`).** Default language is **`vi`** on the Terminal (set per product needs).

- Store all copy in a single `TRANSLATIONS = { en: {...}, vi: {...} }` object, grouped by area (`sidebar`, `header`, `dashboard`, `charts`, `settings`, `mapping`, …).
- Access via a `t('group.key')` helper or `const content = TRANSLATIONS[lang]`.
- Provide a **language toggle** (globe icon + `EN`/`VI`) in the header; persist choice.
- **Never hardcode UI strings** in JSX — always go through `TRANSLATIONS`.
- Keep brand mottos/slogans in English by design (e.g. *"Optimizing today, Growing tomorrow."*).
- The Terminal additionally keeps a **`registry`** (module name + description per language) and a **`matrix`** (horizon definitions) inside each language block.

---

## 9. Layout Skeletons (copy/paste starting points)

### 9.1 Detailed Module skeleton
```html
<div class="flex min-h-[100dvh] lg:h-full text-slate-800 dark:text-slate-100
            bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))]
            from-indigo-100 via-slate-50 to-teal-100
            dark:from-slate-950 dark:via-slate-900 dark:to-cyan-950">
  <!-- mobile scrim -->
  <aside class="w-64 lg:w-64 fixed inset-y-0 left-0 lg:relative
                bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl
                border-r border-white/20 dark:border-white/10 flex flex-col
                transition-all duration-300">
    <!-- optional: collapse toggle at -right-3 top-8 (lg+ only); see §5.2.2 -->
    <div class="h-16 border-b ...">{logo + wordmark}</div>
    <!-- collapsed: icon rail (lg only) OR expanded scroll body -->
    <div class="flex-1 overflow-y-auto scroller px-3 pt-3">{source data · config · interface · reset}</div>
    <div class="sticky bottom-0 border-t p-4 backdrop-blur-md">{Operartis Analytics + slogan}</div>
  </aside>

  <main class="flex-1 min-w-0 flex flex-col overflow-hidden">
    <header class="h-16 flex justify-between items-center px-4 md:px-6
                   bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl
                   border-b border-white/50 dark:border-white/10
                   ring-1 ring-white/20 dark:ring-white/5 shadow-sm">
      {menu btn} {centered gold-gradient TITLE} {status · clock · settings}
    </header>
    <div class="flex-1 overflow-hidden flex flex-col">{tabs + dashboard/content}</div>
  </main>
  {modals}
</div>
```

### 9.2 Terminal skeleton (immersive hub)
```html
<div class="h-full flex flex-col bg-slate-50 dark:bg-[#020617]">
  <nav class="h-16 glass-panel border-b ...">{brand} {status·clock·theme·lang·user}</nav>
  <main class="flex-1 overflow-y-auto">
    <div class="max-w-7xl mx-auto p-4 sm:p-6 md:p-12">
      {hero: header_title_1 + gold-gradient header_title_2 + desc}
      {matrix.map(horizon => <HorizonRow/>)}   <!-- Strategic→Tactical→Operational→Cross -->
      {AboutSection}
    </div>
  </main>
  <footer class="py-4 px-6 border-t glass-panel">{copyright + mono version/latency}</footer>
  {ModuleModal}
</div>
```

---

## 10. Adding a New Module (Production, Logistics, …) — Checklist

When you build the next module, follow this so it stays consistent:

**Build the module page**
1. Duplicate the boilerplate (`<head>` stack, Tailwind config, `<style>` scrollbars/backdrops, React/Babel mount) from Section 2–3.
2. Use the **Detailed Module skeleton** (9.1): glass sidebar (§5.2, copy `forecaster.html` for collapse rail) + glass `h-16` header + content area.
3. Title in header: `font-black uppercase tracking-widest` gold gradient (e.g. `PRODUCTION SCHEDULER`).
4. Reuse shared components: status pill, clock, theme toggle (3-state), language toggle, settings modal, upload dropzone, KPI tiles, glass cards, buttons, modals, custom scrollbars.
5. Add full `TRANSLATIONS` (`en` + `vi`). No hardcoded strings.
6. Charts via **Recharts 2.1.12**; Excel I/O via **xlsx**; keep number formatting consistent (`font-mono tabular-nums`).
7. Honor the gold rule (one primary action), glass-on-chrome / solid-on-data, and the motion guidelines.
8. Link the logo back to `./` (`index.html`); footer = `Operartis Analytics` + slogan.

**Register it in the Terminal (`index.html`)**
9. Add an icon component (Lucide-style inline SVG) for the module.
10. Add an entry to **`MODULE_STATIC_DATA`**:
    ```js
    'production_scheduler': { id:'production_scheduler', icon:<FactoryIcon/>, status:'live', href:'./production.html', version:'v1.0_LIVE' },
    ```
    (`status`: `'live' | 'planned'`; planned → `href:'#'`, `version:'CONCEPT'`.)
11. Add bilingual copy to **`registry`** (`name` + `desc`) in both `en` and `vi`.
12. Slot its `id` into the correct **horizon → block → `subModules`** array in the `matrix` (Strategic / Tactical / Operational / Cross-Functional) and mirror it in `MATRIX_STRUCTURE`.
13. Verify: light + dark, EN + VI, mobile (off-canvas sidebar) + desktop, and that the Quick View overlay / modal lists the module correctly.

---

## 11. Do / Don't

**Do**
- Keep gold as a scarce, intentional accent.
- Use glass for chrome + interactive surfaces; solid for data.
- Author light *and* dark for every element.
- Ship EN + VI for all copy.
- Reuse existing components, tokens, and icon conventions.
- Keep numbers in `font-mono` + `tabular-nums`.

**Don't**
- Don't flood the UI with gold or heavy gradients on data.
- Don't blur dense tables/charts (hurts legibility).
- Don't hardcode strings or skip a language.
- Don't introduce new fonts, new accent colors, or a different radius/shadow scale.
- Don't switch React versions or add a build step — these are portable single-file apps.

---

*Operartis Analytics — "Optimizing today, Growing tomorrow."*
