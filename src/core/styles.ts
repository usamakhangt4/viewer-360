/**
 * Component styles injected into the Shadow DOM.
 *
 * All CSS custom properties are declared on :host so they can be overridden
 * from the outside (CSS custom properties pierce the Shadow DOM boundary).
 *
 * Theming surface — override any of these on viewer-360 or a parent selector:
 *   --viewer-color-bg, --viewer-color-accent, --viewer-color-text,
 *   --viewer-control-size, --viewer-icon-size,
 *   --viewer-duration-fast, --viewer-duration-base,
 *   --fab-color, --fab-bg-color, --fab-bg-color-hover, --fab-bg-color-active,
 *   --progress-bar-color, --progress-bar-height,
 *   --indicators-gap, --indicators-active-color, --indicators-color,
 *   --z-index-ios-fullscreen
 */
export const STYLES = /* css */ `
:host {
  /* ── Typography ─────────────────────────────────────────────────── */
  --viewer-font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, 'Open Sans', sans-serif;

  /* ── Colors ─────────────────────────────────────────────────────── */
  --viewer-color-bg: #ffffff;
  --viewer-color-surface: rgba(255, 255, 255, 0.9);
  --viewer-color-surface-hover: rgba(255, 255, 255, 1);
  --viewer-color-text: #333333;
  --viewer-color-accent: #3498db;
  --viewer-color-overlay-dark: rgba(0, 0, 0, 0.7);
  --viewer-color-spinner-track: #f3f3f3;
  --viewer-color-border-soft: rgba(0, 0, 0, 0.15);
  --viewer-color-hover: rgba(0, 0, 0, 0.1);
  --viewer-color-active: rgba(0, 0, 0, 0.2);
  --viewer-color-focus-ring: rgba(59, 130, 246, 0.5);

  /* ── Shadows ─────────────────────────────────────────────────────── */
  --viewer-shadow-control: 0 2px 5px rgba(0, 0, 0, 0.2);

  /* ── Sizing & spacing ────────────────────────────────────────────── */
  --viewer-control-size: 40px;
  --viewer-icon-size: 24px;
  --viewer-space-xs: 5px;
  --viewer-space-sm: 8px;
  --viewer-space-md: 10px;
  --viewer-space-lg: 15px;
  --viewer-radius-sm: 4px;
  --viewer-radius-pill: 20px;
  --viewer-radius-round: 50%;
  --viewer-progress-width: 200px;
  --viewer-progress-height: 4px;
  --viewer-hint-bottom: 70px;

  /* ── Motion ──────────────────────────────────────────────────────── */
  --viewer-duration-fast: 0.2s;
  --viewer-duration-base: 0.3s;
  --viewer-spin-duration: 1s;
  --viewer-ease: ease;
  --viewer-linear: linear;

  /* ── Layers ──────────────────────────────────────────────────────── */
  --viewer-z-controls: 10;
  --viewer-z-zoom-progress: 15;
  --viewer-z-loading: 20;

  /* ── Host-customization props (Cylindo-compatible) ───────────────── */
  --scoped-legacy-browser-aspect-ratio: var(--legacy-browser-aspect-ratio, auto);
  --scoped-fab-color: var(--fab-color, #0009);
  --scoped-fab-bg-color: var(--fab-bg-color, #e7edf1);
  --scoped-fab-bg-color-hover: var(--fab-bg-color-hover, #d7e0e5);
  --scoped-fab-bg-color-active: var(--fab-bg-color-active, #cbd7dd);
  --scoped-fab-outline-disabled: var(--fab-outline-disabled, none);
  --scoped-indicators-gap: var(--indicators-gap, 4px);
  --scoped-indicators-active-color: var(--indicators-active-color, #314756);
  --scoped-indicators-color: var(--indicators-color, #ccd5da);
  --scoped-z-index-ios-fullscreen: var(--z-index-ios-fullscreen, 250);
  --scoped-progress-bar-color: var(--progress-bar-color, #0009);
  --scoped-progress-bar-height: var(--progress-bar-height, 5px);

  /* ── Host container ──────────────────────────────────────────────── */
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
  aspect-ratio: var(--scoped-legacy-browser-aspect-ratio);
  overflow: hidden;
  background-color: var(--viewer-color-bg);
  font-family: var(--viewer-font-family);
  cursor: grab;
  touch-action: manipulation;
}

:host(.grabbing) {
  cursor: grabbing;
}

:host(.fullscreen-fallback) {
  position: fixed;
  inset: 0;
  z-index: var(--scoped-z-index-ios-fullscreen);
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  max-height: none;
  aspect-ratio: unset;
  background: var(--viewer-color-bg);
}

:host(:fullscreen) {
  width: 100%;
  height: 100%;
  aspect-ratio: unset;
}

:host(:-webkit-full-screen) {
  width: 100%;
  height: 100%;
  aspect-ratio: unset;
}

/* ── Zoom progress bar (top edge, shown while high-res loads) ─────── */

.zoom-progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: var(--scoped-progress-bar-height);
  z-index: var(--viewer-z-zoom-progress);
  overflow: hidden;
  pointer-events: none;
  background-color: var(--viewer-color-spinner-track);
  opacity: 0;
  visibility: hidden;
  transition:
    opacity var(--viewer-duration-fast) var(--viewer-ease),
    visibility var(--viewer-duration-fast) var(--viewer-ease);
}

.zoom-progress-bar.visible {
  opacity: 1;
  visibility: visible;
}

.zoom-progress-bar .progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: var(--scoped-progress-bar-height);
  background-color: var(--scoped-progress-bar-color);
  transition:
    transform 250ms var(--viewer-ease),
    opacity 400ms var(--viewer-ease);
  transform-origin: top left;
  overflow: hidden;
  transform: scaleX(0);
  opacity: 1;
}

.zoom-progress-bar.visible.indeterminate .progress-bar {
  width: 35%;
  transition: none;
  animation: zoom-progress-indeterminate 1.35s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@keyframes zoom-progress-indeterminate {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(286%); }
}

@media (prefers-reduced-motion: reduce) {
  .zoom-progress-bar .progress-bar {
    transition: none;
  }
}

/* ── Viewport & canvas ────────────────────────────────────────────── */

.viewer-viewport {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.viewer-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: auto;
  opacity: 0;
}

.viewer-image.loaded {
  opacity: 1;
}

#viewerCanvas {
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

/* ── Bottom control bar ───────────────────────────────────────────── */

.viewer-controls {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  min-height: var(--viewer-control-size);
  background-color: var(--viewer-color-surface);
  padding: var(--viewer-space-sm) var(--viewer-space-lg);
  border-radius: var(--viewer-radius-pill);
  box-shadow: var(--viewer-shadow-control);
  z-index: var(--viewer-z-controls);
  transition: opacity var(--viewer-duration-base) var(--viewer-ease);
}

.viewer-controls.hidden {
  opacity: 0;
  pointer-events: none;
}

/* Hide rotation controls while zoomed in — top-right cluster remains accessible */
:host(.zoomed) .viewer-controls {
  opacity: 0;
  pointer-events: none;
  transform: translateX(-50%) translateY(8px);
}

.viewer-controls button {
  flex-shrink: 0;
  min-width: var(--viewer-control-size);
  min-height: var(--viewer-control-size);
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--viewer-space-sm) 12px;
  margin: 0 var(--viewer-space-xs);
  border-radius: var(--viewer-radius-sm);
  transition:
    background-color var(--viewer-duration-fast),
    box-shadow var(--viewer-duration-fast);
  color: var(--viewer-color-text);
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.viewer-controls button:hover  { background-color: var(--viewer-color-hover); }
.viewer-controls button:active { background-color: var(--viewer-color-active); }
.viewer-controls button:focus  {
  outline: none;
  box-shadow: 0 0 0 2px var(--viewer-color-focus-ring);
}

.viewer-controls button svg {
  width: var(--viewer-icon-size);
  height: var(--viewer-icon-size);
  fill: currentColor;
  opacity: 0.8;
  transition: opacity var(--viewer-duration-fast) var(--viewer-ease);
}

.viewer-controls button:hover svg { opacity: 1; }

/* ── Loading overlay ──────────────────────────────────────────────── */

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--viewer-color-surface);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: var(--viewer-z-loading);
  transition: opacity var(--viewer-duration-base) var(--viewer-ease);
}

.loading-overlay.hidden {
  opacity: 0;
  pointer-events: none;
}

.loading-spinner {
  width: var(--viewer-control-size);
  height: var(--viewer-control-size);
  border: 3px solid var(--viewer-color-spinner-track);
  border-top: 3px solid var(--viewer-color-accent);
  border-radius: var(--viewer-radius-round);
  animation: spin var(--viewer-spin-duration) var(--viewer-linear) infinite;
  margin-bottom: var(--viewer-space-md);
}

@keyframes spin {
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 14px;
  color: var(--viewer-color-text);
  margin-top: var(--viewer-space-md);
}

.loading-progress {
  width: var(--viewer-progress-width);
  height: var(--viewer-progress-height);
  background-color: var(--viewer-color-spinner-track);
  border-radius: 2px;
  overflow: hidden;
  margin-top: var(--viewer-space-md);
}

.loading-progress-bar {
  width: 0%;
  height: 100%;
  background-color: var(--viewer-color-accent);
  transition: width var(--viewer-duration-base) var(--viewer-ease);
}

/* ── Top-right FAB cluster (zoom + fullscreen + close) ────────────── */

.viewer-top-right {
  position: absolute;
  top: var(--viewer-space-lg);
  right: var(--viewer-space-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--viewer-space-sm);
  z-index: var(--viewer-z-controls);
  visibility: hidden;
  opacity: 0;
  transition:
    opacity var(--viewer-duration-base) var(--viewer-ease),
    visibility var(--viewer-duration-base) var(--viewer-ease);
}

.viewer-top-right.controls-visible {
  visibility: visible;
  opacity: 1;
}

.viewer-top-right button {
  width: var(--viewer-control-size);
  height: var(--viewer-control-size);
  min-width: var(--viewer-control-size);
  min-height: var(--viewer-control-size);
  padding: 0;
  color: var(--scoped-fab-color);
  background: var(--scoped-fab-bg-color);
  border: none;
  border-radius: var(--viewer-radius-sm);
  cursor: pointer;
  box-shadow: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background-color var(--viewer-duration-fast) var(--viewer-ease),
    color var(--viewer-duration-fast) var(--viewer-ease);
}

.viewer-top-right button:hover  { background: var(--scoped-fab-bg-color-hover); }
.viewer-top-right button:active { background: var(--scoped-fab-bg-color-active); }

.viewer-top-right button:focus-visible {
  outline: 2px solid var(--scoped-fab-color);
  outline-offset: 2px;
}

.viewer-top-right button:focus:not(:focus-visible) { outline: none; }

.viewer-top-right button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  outline: var(--scoped-fab-outline-disabled);
}

.viewer-top-right button svg {
  width: var(--viewer-icon-size);
  height: var(--viewer-icon-size);
  fill: currentColor;
  opacity: 0.9;
  transition: opacity var(--viewer-duration-fast) var(--viewer-ease);
}

.viewer-top-right button:hover svg { opacity: 1; }

.viewer-top-right .fullscreen-button.hidden-in-fullscreen { display: none !important; }
.viewer-top-right .viewer-close-button                    { display: none !important; }
.viewer-top-right .viewer-close-button.visible            { display: flex !important; }

/* ── Mobile hint toast ────────────────────────────────────────────── */

.mobile-hint {
  position: absolute;
  bottom: var(--viewer-hint-bottom);
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--viewer-color-overlay-dark);
  color: white;
  padding: var(--viewer-space-sm) 16px;
  border-radius: var(--viewer-radius-pill);
  font-size: 14px;
  pointer-events: none;
  opacity: 0;
  transition: opacity var(--viewer-duration-base) var(--viewer-ease);
  white-space: nowrap;
}

.mobile-hint.visible { opacity: 1; }

/* ── Frame indicator dots (optional, rendered by host) ────────────── */

.viewer-indicators {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--scoped-indicators-gap);
}

.viewer-indicators .viewer-indicator         { color: var(--scoped-indicators-color); }
.viewer-indicators .viewer-indicator.is-active { color: var(--scoped-indicators-active-color); }

/* ── Mobile: hide fullscreen button ──────────────────────────────── */

@media (max-width: 768px) {
  .viewer-top-right .fullscreen-button { display: none; }
}
`;
