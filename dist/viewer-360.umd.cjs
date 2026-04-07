(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Viewer360 = {}));
})(this, (function (exports) { 'use strict';

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
  const STYLES = /* css */ `
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

  /** Shadow DOM inner HTML. IDs are scoped to the shadow root. */
  const TEMPLATE = /* html */ `
<div
  class="zoom-progress-bar indeterminate"
  id="zoomProgressBar"
  role="progressbar"
  aria-valuemin="0"
  aria-valuemax="100"
  aria-hidden="true"
  aria-label="High resolution image load progress"
>
  <div class="progress-bar" id="zoomProgressBarFill"></div>
</div>

<div class="loading-overlay" id="loading">
  <div class="loading-spinner"></div>
  <div class="loading-text">Loading 360° view...</div>
  <div class="loading-progress">
    <div class="loading-progress-bar" id="progressBar"></div>
  </div>
</div>

<div class="viewer-viewport">
  <canvas
    class="viewer-image"
    id="viewerCanvas"
    aria-label="360° product view"
    style="display:none;"
  ></canvas>
</div>

<div class="viewer-controls" id="controls">
  <button id="leftBtn" title="Rotate Left" aria-label="Rotate left">
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
    </svg>
  </button>
  <button id="playBtn" title="Auto-Rotate" aria-label="Toggle auto-rotation">
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 5v14l11-7z"/>
    </svg>
  </button>
  <button id="rightBtn" title="Rotate Right" aria-label="Rotate right">
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 11h12.17l-5.59-5.59L12 4l8 8-8 8-1.41-1.41L16.17 13H4v-2z"/>
    </svg>
  </button>
</div>

<div class="viewer-top-right">
  <button
    class="fullscreen-button"
    id="fullscreenBtn"
    title="Toggle Fullscreen"
    aria-label="Toggle fullscreen"
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
    </svg>
  </button>
  <button
    class="viewer-close-button"
    id="viewerCloseBtn"
    title="Close"
    aria-label="Close viewer"
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
    </svg>
  </button>
  <button id="zoomInBtn" title="Zoom In" aria-label="Zoom in">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zm2.5-4h-2v2H9v-2H7V9h2V7h1v2h2v1z"/>
    </svg>
  </button>
  <button id="zoomOutBtn" title="Zoom Out" aria-label="Zoom out">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zM7 9h5v1H7z"/>
    </svg>
  </button>
</div>

<div class="mobile-hint" id="mobileHint" aria-hidden="true">
  Drag to rotate &bull; Pinch to zoom &bull; Double-tap to cycle zoom
</div>
`;

  // ─────────────────────────────────────────────────────────────────────────────
  // Props
  // ─────────────────────────────────────────────────────────────────────────────
  // ─────────────────────────────────────────────────────────────────────────────
  // Default values (exported so wrappers can reference them)
  // ─────────────────────────────────────────────────────────────────────────────
  const VIEWER_360_DEFAULTS = {
      frame: 1,
      autoRotate: false,
      speed: 100,
      rotationDirection: 'right',
      dprCap: 2,
      zoomLevels: [1, 2, 4],
      minScale: 1,
      maxScale: 4,
      showControls: true,
      showZoomButtons: true,
      showFullscreenButton: true,
      showLoadingOverlay: true,
      showMobileHint: true,
      preloadCount: 8,
      concurrentLoads: 4,
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────────────────────────────────────
  function parseJsonArray(value) {
      try {
          const parsed = JSON.parse(value);
          return Array.isArray(parsed) ? parsed : [];
      }
      catch (_a) {
          return [];
      }
  }
  function parseBool(value, fallback) {
      if (value === null)
          return fallback;
      return value !== 'false';
  }
  function parseInt10(value, fallback) {
      if (value === null)
          return fallback;
      const n = parseInt(value, 10);
      return Number.isFinite(n) ? n : fallback;
  }
  function parseFloat_(value, fallback) {
      if (value === null)
          return fallback;
      const n = parseFloat(value);
      return Number.isFinite(n) ? n : fallback;
  }
  // ─────────────────────────────────────────────────────────────────────────────
  // Web Component
  // ─────────────────────────────────────────────────────────────────────────────
  class Viewer360Element extends HTMLElement {
      static get observedAttributes() {
          return [
              'images', 'high-res-images',
              'frame', 'auto-rotate', 'speed', 'rotation-direction',
              'initial-resolution', 'dpr-cap',
              'zoom-levels', 'min-scale', 'max-scale',
              'show-controls', 'show-zoom-buttons', 'show-fullscreen-button',
              'show-loading-overlay', 'show-mobile-hint',
              'preload-count', 'concurrent-loads',
          ];
      }
      constructor() {
          super();
          // ── Configurable state (mirrors Viewer360Props) ───────────────────────────
          this._images = [];
          this._highResImages = [];
          this._frame = VIEWER_360_DEFAULTS.frame;
          this._autoRotate = VIEWER_360_DEFAULTS.autoRotate;
          this._speed = VIEWER_360_DEFAULTS.speed;
          this._rotationDirection = VIEWER_360_DEFAULTS.rotationDirection;
          this._initialResolution = null;
          this._dprCap = VIEWER_360_DEFAULTS.dprCap;
          this._zoomLevels = [...VIEWER_360_DEFAULTS.zoomLevels];
          this._minScale = VIEWER_360_DEFAULTS.minScale;
          this._maxScale = VIEWER_360_DEFAULTS.maxScale;
          this._showControls = VIEWER_360_DEFAULTS.showControls;
          this._showZoomButtons = VIEWER_360_DEFAULTS.showZoomButtons;
          this._showFullscreenButton = VIEWER_360_DEFAULTS.showFullscreenButton;
          this._showLoadingOverlay = VIEWER_360_DEFAULTS.showLoadingOverlay;
          this._showMobileHint = VIEWER_360_DEFAULTS.showMobileHint;
          this._preloadCount = VIEWER_360_DEFAULTS.preloadCount;
          this._concurrentLoads = VIEWER_360_DEFAULTS.concurrentLoads;
          this._canvas = null;
          this._ctx = null;
          this._loading = null;
          this._progressBar = null;
          this._playBtn = null;
          this._leftBtn = null;
          this._rightBtn = null;
          this._zoomInBtn = null;
          this._zoomOutBtn = null;
          this._fullscreenBtn = null;
          this._viewerCloseBtn = null;
          this._mobileHint = null;
          this._viewerTopRight = null;
          this._viewerControls = null;
          this._viewerViewport = null;
          this._zoomProgressBar = null;
          this._zoomProgressBarFill = null;
          // ── Runtime state ─────────────────────────────────────────────────────────
          this._currentFrame = 1;
          this._currentScale = 1;
          this._zoomLevelIndex = 0;
          this._isPlaying = false;
          this._isDragging = false;
          this._dragLastX = 0;
          this._dragLastY = 0;
          this._panX = 0;
          this._panY = 0;
          this._frameBuffer = {};
          this._highResBuffer = {};
          this._highResLRUOrder = [];
          this._isFetchingHighRes = false;
          this._pendingHighResFrame = null;
          this._highResBufferMax = 5;
          this._pendingIdleFrames = [];
          this._touchStartX = 0;
          this._touchStartY = 0;
          this._initialPinchDistance = 0;
          this._touchDirection = null;
          this._lastTap = 0;
          this._canvasCssWidth = 0;
          this._canvasCssHeight = 0;
          this._canvasDpr = 1;
          this._isPinching = false;
          this._rafHandle = null;
          this._rotationInterval = null;
          this._hideTimeout = null;
          this._totalFrames = 0;
          this._activated = false;
          this._connected = false;
          this._wasExpanded = false;
          this._concurrentLoadsEffective = VIEWER_360_DEFAULTS.concurrentLoads;
          // Document / window listeners stored for cleanup
          this._docListeners = [];
          this._winListeners = [];
          this._fullscreenEnterSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>';
          this._fullscreenExitSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>';
          this._shadow = this.attachShadow({ mode: 'open' });
          this._injectShadowDOM();
      }
      // ─────────────────────────────────────────────────────────────────────────
      // Lifecycle
      // ─────────────────────────────────────────────────────────────────────────
      connectedCallback() {
          this._connected = true;
          this._queryElements();
          this._applyUIToggles();
          this._setupEventListeners();
          this._wasExpanded = this._isExpanded();
          this._updateFullscreenUI(this._wasExpanded);
          if (this._images.length > 0) {
              this._initViewer();
          }
      }
      disconnectedCallback() {
          this._connected = false;
          this._teardown();
      }
      attributeChangedCallback(name, _old, value) {
          switch (name) {
              case 'images':
                  this._images = value ? parseJsonArray(value) : [];
                  if (this._connected)
                      this._initViewer();
                  break;
              case 'high-res-images':
                  this._highResImages = value ? parseJsonArray(value) : [];
                  this._clearHighResCache();
                  break;
              case 'frame':
                  this._frame = parseInt10(value, VIEWER_360_DEFAULTS.frame);
                  break;
              case 'auto-rotate':
                  this._autoRotate = parseBool(value, VIEWER_360_DEFAULTS.autoRotate);
                  break;
              case 'speed':
                  this._speed = parseInt10(value, VIEWER_360_DEFAULTS.speed);
                  break;
              case 'rotation-direction':
                  this._rotationDirection = value === 'left' ? 'left' : 'right';
                  break;
              case 'initial-resolution':
                  this._initialResolution = value ? (parseInt10(value, 0) || null) : null;
                  break;
              case 'dpr-cap':
                  this._dprCap = parseFloat_(value, VIEWER_360_DEFAULTS.dprCap);
                  break;
              case 'zoom-levels':
                  this._zoomLevels = value ? parseJsonArray(value) : [...VIEWER_360_DEFAULTS.zoomLevels];
                  this._updateZoomButtons();
                  break;
              case 'min-scale':
                  this._minScale = parseFloat_(value, VIEWER_360_DEFAULTS.minScale);
                  break;
              case 'max-scale':
                  this._maxScale = parseFloat_(value, VIEWER_360_DEFAULTS.maxScale);
                  break;
              case 'show-controls':
                  this._showControls = parseBool(value, true);
                  this._applyUIToggles();
                  break;
              case 'show-zoom-buttons':
                  this._showZoomButtons = parseBool(value, true);
                  this._applyUIToggles();
                  break;
              case 'show-fullscreen-button':
                  this._showFullscreenButton = parseBool(value, true);
                  this._applyUIToggles();
                  break;
              case 'show-loading-overlay':
                  this._showLoadingOverlay = parseBool(value, true);
                  this._applyUIToggles();
                  break;
              case 'show-mobile-hint':
                  this._showMobileHint = parseBool(value, true);
                  break;
              case 'preload-count':
                  this._preloadCount = parseInt10(value, VIEWER_360_DEFAULTS.preloadCount);
                  break;
              case 'concurrent-loads':
                  this._concurrentLoads = parseInt10(value, VIEWER_360_DEFAULTS.concurrentLoads);
                  this._concurrentLoadsEffective = this._concurrentLoads;
                  break;
          }
      }
      // ─────────────────────────────────────────────────────────────────────────
      // Public properties
      // ─────────────────────────────────────────────────────────────────────────
      get images() { return this._images; }
      set images(val) {
          this._images = val;
          if (this._connected)
              this._initViewer();
      }
      get highResImages() { return this._highResImages; }
      set highResImages(val) {
          this._highResImages = val;
          this._clearHighResCache();
      }
      get frame() { return this._frame; }
      set frame(val) { this._frame = val; }
      get autoRotate() { return this._autoRotate; }
      set autoRotate(val) { this._autoRotate = val; }
      get speed() { return this._speed; }
      set speed(val) {
          this._speed = val;
          // Hot-swap the interval so speed changes take effect immediately
          if (this._isPlaying && this._rotationInterval !== null) {
              clearInterval(this._rotationInterval);
              this._rotationInterval = setInterval(() => this._rotate(), this._speed);
          }
      }
      get rotationDirection() { return this._rotationDirection; }
      set rotationDirection(val) { this._rotationDirection = val; }
      get initialResolution() { return this._initialResolution; }
      set initialResolution(val) { this._initialResolution = val; }
      get dprCap() { return this._dprCap; }
      set dprCap(val) {
          this._dprCap = val;
          this._scheduleRender();
      }
      get zoomLevels() { return this._zoomLevels; }
      set zoomLevels(val) {
          this._zoomLevels = val;
          this._updateZoomButtons();
      }
      get minScale() { return this._minScale; }
      set minScale(val) { this._minScale = val; }
      get maxScale() { return this._maxScale; }
      set maxScale(val) { this._maxScale = val; }
      get showControls() { return this._showControls; }
      set showControls(val) { this._showControls = val; this._applyUIToggles(); }
      get showZoomButtons() { return this._showZoomButtons; }
      set showZoomButtons(val) { this._showZoomButtons = val; this._applyUIToggles(); }
      get showFullscreenButton() { return this._showFullscreenButton; }
      set showFullscreenButton(val) { this._showFullscreenButton = val; this._applyUIToggles(); }
      get showLoadingOverlay() { return this._showLoadingOverlay; }
      set showLoadingOverlay(val) { this._showLoadingOverlay = val; this._applyUIToggles(); }
      get showMobileHint() { return this._showMobileHint; }
      set showMobileHint(val) { this._showMobileHint = val; }
      get preloadCount() { return this._preloadCount; }
      set preloadCount(val) { this._preloadCount = val; }
      get concurrentLoads() { return this._concurrentLoads; }
      set concurrentLoads(val) {
          this._concurrentLoads = val;
          this._concurrentLoadsEffective = val;
      }
      // ─────────────────────────────────────────────────────────────────────────
      // Public imperative API
      // ─────────────────────────────────────────────────────────────────────────
      showFrame(frame) { this._showFrame(frame); }
      setZoom(level) { this._setZoom(level); }
      startAutoRotate() { this._startAutoRotate(); }
      stopAutoRotate() { this._stopAutoRotate(); }
      reset() {
          this._setZoom(1);
          this._showFrame(1);
          this._stopAutoRotate();
      }
      // ─────────────────────────────────────────────────────────────────────────
      // Shadow DOM setup
      // ─────────────────────────────────────────────────────────────────────────
      _injectShadowDOM() {
          const style = document.createElement('style');
          style.textContent = STYLES;
          this._shadow.appendChild(style);
          const wrapper = document.createElement('div');
          wrapper.innerHTML = TEMPLATE;
          while (wrapper.firstChild) {
              this._shadow.appendChild(wrapper.firstChild);
          }
      }
      _queryElements() {
          var _a, _b;
          const s = this._shadow;
          this._canvas = s.getElementById('viewerCanvas');
          this._ctx = (_b = (_a = this._canvas) === null || _a === void 0 ? void 0 : _a.getContext('2d', { alpha: false })) !== null && _b !== void 0 ? _b : null;
          this._loading = s.getElementById('loading');
          this._progressBar = s.getElementById('progressBar');
          this._playBtn = s.getElementById('playBtn');
          this._leftBtn = s.getElementById('leftBtn');
          this._rightBtn = s.getElementById('rightBtn');
          this._zoomInBtn = s.getElementById('zoomInBtn');
          this._zoomOutBtn = s.getElementById('zoomOutBtn');
          this._fullscreenBtn = s.getElementById('fullscreenBtn');
          this._viewerCloseBtn = s.getElementById('viewerCloseBtn');
          this._mobileHint = s.getElementById('mobileHint');
          this._viewerTopRight = s.querySelector('.viewer-top-right');
          this._viewerControls = s.getElementById('controls');
          this._viewerViewport = s.querySelector('.viewer-viewport');
          this._zoomProgressBar = s.getElementById('zoomProgressBar');
          this._zoomProgressBarFill = s.getElementById('zoomProgressBarFill');
      }
      _applyUIToggles() {
          if (this._viewerControls) {
              this._viewerControls.style.display = this._showControls ? '' : 'none';
          }
          if (this._zoomInBtn)
              this._zoomInBtn.style.display = this._showZoomButtons ? '' : 'none';
          if (this._zoomOutBtn)
              this._zoomOutBtn.style.display = this._showZoomButtons ? '' : 'none';
          if (this._fullscreenBtn) {
              this._fullscreenBtn.style.display = this._showFullscreenButton ? '' : 'none';
          }
          if (this._loading && !this._showLoadingOverlay) {
              this._loading.classList.add('hidden');
          }
      }
      // ─────────────────────────────────────────────────────────────────────────
      // Network-aware concurrency
      // ─────────────────────────────────────────────────────────────────────────
      _initNetworkProfile() {
          var _a, _b, _c, _d;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const conn = (_c = (_b = (_a = navigator.connection) !== null && _a !== void 0 ? _a : navigator.mozConnection) !== null && _b !== void 0 ? _b : navigator.webkitConnection) !== null && _c !== void 0 ? _c : null;
          let profile = 'unknown';
          if (conn) {
              if (conn.saveData) {
                  profile = 'save-data';
              }
              else {
                  const et = ((_d = conn.effectiveType) !== null && _d !== void 0 ? _d : '').toLowerCase();
                  if (et === 'slow-2g' || et === '2g')
                      profile = 'slow';
                  else if (et === '4g')
                      profile = 'fast';
                  else
                      profile = 'medium';
              }
          }
          const isSlow = profile === 'slow' || profile === 'save-data';
          this._highResBufferMax = isSlow ? 3 : 5;
          this._concurrentLoadsEffective = isSlow ? Math.min(2, this._concurrentLoads) : this._concurrentLoads;
      }
      // ─────────────────────────────────────────────────────────────────────────
      // Viewer initialisation
      // ─────────────────────────────────────────────────────────────────────────
      _initViewer() {
          if (!this._connected || !this._images.length)
              return;
          // Reset state
          this._frameBuffer = {};
          this._clearHighResCache();
          this._pendingIdleFrames = [];
          this._activated = false;
          this._totalFrames = this._images.length;
          this._currentFrame = Math.min(Math.max(1, this._frame), this._totalFrames);
          this._currentScale = 1;
          this._panX = 0;
          this._panY = 0;
          this._canvasCssWidth = 0;
          this._canvasCssHeight = 0;
          this._initNetworkProfile();
          // Reset loading UI
          if (this._loading && this._showLoadingOverlay) {
              this._loading.classList.remove('hidden');
          }
          if (this._canvas) {
              this._canvas.classList.remove('loaded');
              this._canvas.style.display = 'none';
          }
          if (this._progressBar)
              this._progressBar.style.width = '0%';
          this._preloadImages();
      }
      // ─────────────────────────────────────────────────────────────────────────
      // Image preloading
      // ─────────────────────────────────────────────────────────────────────────
      _circularDist(a, b, n) {
          const d = Math.abs(a - b);
          return Math.min(d, n - d);
      }
      _preloadImages() {
          var _a;
          const images = this._images;
          const total = images.length;
          if (total === 0) {
              const text = (_a = this._loading) === null || _a === void 0 ? void 0 : _a.querySelector('.loading-text');
              if (text)
                  text.textContent = 'No frames available';
              return;
          }
          const currentIndex = this._currentFrame - 1;
          const keyFrameIndices = [0, 8, 16, 24].filter(i => i < total);
          const allIndices = Array.from({ length: total }, (_, i) => i);
          const remainingIndices = allIndices.filter(i => !keyFrameIndices.includes(i));
          remainingIndices.sort((a, b) => this._circularDist(a, currentIndex, total) - this._circularDist(b, currentIndex, total));
          const nearbyIndices = remainingIndices.filter(i => this._circularDist(i, currentIndex, total) <= this._preloadCount);
          this._pendingIdleFrames = remainingIndices.filter(i => this._circularDist(i, currentIndex, total) > this._preloadCount);
          const loadingOrder = [...keyFrameIndices, ...nearbyIndices];
          let loadedCount = 0;
          let keyFramesLoaded = 0;
          let queueIndex = 0;
          let inFlight = 0;
          const concurrently = this._concurrentLoadsEffective;
          const onFrameDone = () => {
              inFlight--;
              if (queueIndex < loadingOrder.length)
                  startNext();
          };
          const startNext = () => {
              while (inFlight < concurrently && queueIndex < loadingOrder.length) {
                  const index = loadingOrder[queueIndex++];
                  const src = images[index];
                  const img = new Image();
                  inFlight++;
                  img.onload = () => {
                      this._frameBuffer[index] = img;
                      const finalize = () => {
                          loadedCount++;
                          if (keyFrameIndices.includes(index))
                              keyFramesLoaded++;
                          const progress = (loadedCount / loadingOrder.length) * 100;
                          if (this._progressBar)
                              this._progressBar.style.width = `${progress}%`;
                          if (index === currentIndex)
                              this._showFrame(this._currentFrame);
                          const firstLoaded = !!this._frameBuffer[currentIndex];
                          const enoughKeyFrames = keyFramesLoaded >= Math.min(keyFrameIndices.length, 3);
                          if (!this._activated && firstLoaded && enoughKeyFrames)
                              this._activateViewer();
                          if (loadedCount === loadingOrder.length && !this._activated)
                              this._activateViewer();
                          onFrameDone();
                      };
                      if (typeof img.decode === 'function') {
                          img.decode().then(finalize).catch(() => finalize());
                      }
                      else {
                          finalize();
                      }
                  };
                  img.onerror = () => { loadedCount++; onFrameDone(); };
                  img.src = src;
              }
          };
          startNext();
      }
      _scheduleIdleLoad(indices) {
          if (!indices.length)
              return;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const scheduleIdle = window.requestIdleCallback
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ? (fn) => window.requestIdleCallback(fn, { timeout: 3000 })
              : (fn) => setTimeout(() => fn({ timeRemaining: () => 50 }), 200);
          let i = 0;
          let idleInFlight = 0;
          const pump = (deadline) => {
              while (idleInFlight < this._concurrentLoadsEffective && i < indices.length) {
                  if (deadline.timeRemaining() < 5) {
                      scheduleIdle(pump);
                      return;
                  }
                  const index = indices[i++];
                  if (this._frameBuffer[index] || !this._images[index])
                      continue;
                  idleInFlight++;
                  const img = new Image();
                  img.onload = () => {
                      idleInFlight--;
                      this._frameBuffer[index] = img;
                      if (typeof img.decode === 'function')
                          img.decode().catch(() => undefined);
                      scheduleIdle(pump);
                  };
                  img.onerror = () => { idleInFlight--; scheduleIdle(pump); };
                  img.src = this._images[index];
              }
          };
          scheduleIdle(pump);
      }
      // ─────────────────────────────────────────────────────────────────────────
      // Rendering
      // ─────────────────────────────────────────────────────────────────────────
      _clamp(v, lo, hi) {
          return Math.max(lo, Math.min(hi, v));
      }
      _getFrameImage(frameNumber) {
          var _a;
          return (_a = this._frameBuffer[frameNumber - 1]) !== null && _a !== void 0 ? _a : null;
      }
      _getActiveImage() {
          if (this._currentScale > 1 && this._highResBuffer[this._currentFrame]) {
              // Maintain LRU access order
              const idx = this._highResLRUOrder.indexOf(this._currentFrame);
              if (idx !== -1 && idx !== this._highResLRUOrder.length - 1) {
                  this._highResLRUOrder.splice(idx, 1);
                  this._highResLRUOrder.push(this._currentFrame);
              }
              return this._highResBuffer[this._currentFrame];
          }
          return this._getFrameImage(this._currentFrame);
      }
      _clampPan(scaledW, scaledH) {
          const maxX = Math.max(0, (scaledW - this.clientWidth) / 2);
          const maxY = Math.max(0, (scaledH - this.clientHeight) / 2);
          this._panX = Math.max(-maxX, Math.min(maxX, this._panX));
          this._panY = Math.max(-maxY, Math.min(maxY, this._panY));
      }
      _render() {
          var _a;
          if (!this._canvas || !this._ctx)
              return;
          const activeImage = this._getActiveImage();
          if (!activeImage)
              return;
          const geoImage = (_a = this._getFrameImage(this._currentFrame)) !== null && _a !== void 0 ? _a : activeImage;
          const cssW = Math.max(1, this.clientWidth || 1);
          const cssH = Math.max(1, this.clientHeight || 1);
          const dpr = Math.max(1, Math.min(this._dprCap, window.devicePixelRatio || 1));
          // During preload: optionally cap canvas resolution
          let renderW = cssW;
          let renderH = cssH;
          if (!this._activated && this._initialResolution && this._initialResolution > 0) {
              const cap = this._initialResolution;
              const scale = Math.min(1, cap / Math.max(cssW, cssH));
              renderW = Math.round(cssW * scale);
              renderH = Math.round(cssH * scale);
          }
          if (this._canvasCssWidth !== renderW || this._canvasCssHeight !== renderH || this._canvasDpr !== dpr) {
              this._canvasCssWidth = renderW;
              this._canvasCssHeight = renderH;
              this._canvasDpr = dpr;
              this._canvas.width = Math.round(renderW * dpr);
              this._canvas.height = Math.round(renderH * dpr);
              // Keep the CSS size matching the container regardless of render resolution
              this._canvas.style.width = `${cssW}px`;
              this._canvas.style.height = `${cssH}px`;
          }
          const imgW = geoImage.naturalWidth || geoImage.width;
          const imgH = geoImage.naturalHeight || geoImage.height;
          if (!imgW || !imgH)
              return;
          const fitScale = Math.min(renderW / imgW, renderH / imgH);
          const drawW = imgW * fitScale;
          const drawH = imgH * fitScale;
          const scaledW = drawW * this._currentScale;
          const scaledH = drawH * this._currentScale;
          this._clampPan(scaledW, scaledH);
          const drawX = (renderW - scaledW) / 2 + this._panX;
          const drawY = (renderH - scaledH) / 2 + this._panY;
          this._ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          this._ctx.fillStyle = '#ffffff';
          this._ctx.fillRect(0, 0, renderW, renderH);
          this._ctx.drawImage(activeImage, drawX, drawY, scaledW, scaledH);
      }
      _scheduleRender() {
          if (this._rafHandle !== null)
              return;
          this._rafHandle = requestAnimationFrame(() => {
              this._rafHandle = null;
              this._render();
          });
      }
      _cancelScheduledRender() {
          if (this._rafHandle === null)
              return;
          cancelAnimationFrame(this._rafHandle);
          this._rafHandle = null;
      }
      /** Extra paint frames for Safari/WebKit compositing after a canvas source change. */
      _kickWebKitComposite() {
          requestAnimationFrame(() => {
              this._render();
              requestAnimationFrame(() => {
                  this._render();
                  setTimeout(() => this._render(), 0);
              });
          });
      }
      // ─────────────────────────────────────────────────────────────────────────
      // High-res loading
      // ─────────────────────────────────────────────────────────────────────────
      _clearHighResCache() {
          this._highResBuffer = {};
          this._highResLRUOrder = [];
          this._isFetchingHighRes = false;
          this._pendingHighResFrame = null;
      }
      _evictLRU(frameNumber) {
          const idx = this._highResLRUOrder.indexOf(frameNumber);
          if (idx !== -1)
              this._highResLRUOrder.splice(idx, 1);
          while (this._highResLRUOrder.length >= this._highResBufferMax) {
              const evicted = this._highResLRUOrder.shift();
              delete this._highResBuffer[evicted];
          }
          this._highResLRUOrder.push(frameNumber);
      }
      _setZoomProgressIndeterminate() {
          if (!this._zoomProgressBar || !this._zoomProgressBarFill)
              return;
          this._zoomProgressBar.classList.add('indeterminate');
          this._zoomProgressBarFill.style.transform = '';
          this._zoomProgressBar.removeAttribute('aria-valuenow');
      }
      _setZoomLoading(visible) {
          if (!this._zoomProgressBar)
              return;
          this._zoomProgressBar.classList.toggle('visible', visible);
          this._zoomProgressBar.setAttribute('aria-hidden', visible ? 'false' : 'true');
          if (visible) {
              this._setZoomProgressIndeterminate();
              this._zoomProgressBar.setAttribute('aria-valuetext', 'Loading high resolution image');
              this._zoomProgressBar.setAttribute('aria-busy', 'true');
          }
          else {
              this._zoomProgressBar.removeAttribute('aria-valuetext');
              this._zoomProgressBar.removeAttribute('aria-busy');
              this._setZoomProgressIndeterminate();
          }
      }
      _loadHighResFrame(frameNumber) {
          if (!this._highResImages.length)
              return;
          const src = this._highResImages[frameNumber - 1];
          if (!src)
              return;
          const cached = this._highResBuffer[frameNumber];
          if (cached === null || cached === void 0 ? void 0 : cached.complete)
              return;
          if (this._isFetchingHighRes) {
              this._pendingHighResFrame = frameNumber;
              return;
          }
          this._isFetchingHighRes = true;
          this._pendingHighResFrame = null;
          this._setZoomLoading(true);
          const finalize = () => {
              this._isFetchingHighRes = false;
              this._setZoomLoading(false);
              if (this._pendingHighResFrame !== null) {
                  const next = this._pendingHighResFrame;
                  this._pendingHighResFrame = null;
                  this._loadHighResFrame(next);
              }
          };
          const img = new Image();
          img.onload = () => {
              const apply = () => {
                  this._evictLRU(frameNumber);
                  this._highResBuffer[frameNumber] = img;
                  if (this._currentFrame === frameNumber) {
                      this._render();
                      this._kickWebKitComposite();
                  }
                  finalize();
              };
              if (typeof img.decode === 'function') {
                  img.decode().then(apply).catch(() => apply());
              }
              else {
                  apply();
              }
          };
          img.onerror = () => {
              this._emit('viewer360:error', { message: `Failed to load high-res frame ${frameNumber}` });
              finalize();
          };
          img.src = src;
      }
      // ─────────────────────────────────────────────────────────────────────────
      // Viewer activation
      // ─────────────────────────────────────────────────────────────────────────
      _activateViewer() {
          if (this._activated)
              return;
          this._activated = true;
          if (this._loading)
              this._loading.classList.add('hidden');
          if (this._canvas) {
              this._canvas.style.display = 'block';
              this._canvas.classList.add('loaded');
          }
          if (this._images.length && this._getFrameImage(this._currentFrame)) {
              this._showFrame(this._currentFrame);
              this._kickWebKitComposite();
          }
          if (this._autoRotate)
              this._startAutoRotate();
          this._updateZoomButtons();
          if ('ontouchstart' in window && this._showMobileHint && this._mobileHint) {
              this._mobileHint.classList.add('visible');
              setTimeout(() => { var _a; return (_a = this._mobileHint) === null || _a === void 0 ? void 0 : _a.classList.remove('visible'); }, 3000);
          }
          if (this._pendingIdleFrames.length > 0) {
              this._scheduleIdleLoad(this._pendingIdleFrames);
              this._pendingIdleFrames = [];
          }
          this._emit('viewer360:ready', {});
      }
      // ─────────────────────────────────────────────────────────────────────────
      // Frame display and rotation
      // ─────────────────────────────────────────────────────────────────────────
      _showFrame(frameNumber) {
          if (!this._getFrameImage(frameNumber))
              return;
          this._currentFrame = frameNumber;
          this._render();
          this._emit('viewer360:framechange', { frame: frameNumber });
          if (this._currentScale > 1 && !this._isDragging && !this._isPlaying) {
              this._loadHighResFrame(frameNumber);
          }
      }
      _rotate() {
          if (this._rotationDirection === 'right') {
              const next = this._currentFrame > 1 ? this._currentFrame - 1 : this._totalFrames;
              this._showFrame(next);
          }
          else {
              const next = this._currentFrame < this._totalFrames ? this._currentFrame + 1 : 1;
              this._showFrame(next);
          }
      }
      _rotateLeft() {
          const next = this._currentFrame < this._totalFrames ? this._currentFrame + 1 : 1;
          this._showFrame(next);
      }
      _rotateRight() {
          const next = this._currentFrame > 1 ? this._currentFrame - 1 : this._totalFrames;
          this._showFrame(next);
      }
      _startAutoRotate() {
          if (this._rotationInterval)
              return;
          this._isPlaying = true;
          if (this._playBtn) {
              this._playBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
          }
          this._rotationInterval = setInterval(() => this._rotate(), this._speed);
          this._emit('viewer360:autorotatechange', { enabled: true });
      }
      _stopAutoRotate() {
          if (!this._rotationInterval)
              return;
          this._isPlaying = false;
          if (this._playBtn) {
              this._playBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
          }
          clearInterval(this._rotationInterval);
          this._rotationInterval = null;
          this._emit('viewer360:autorotatechange', { enabled: false });
          if (this._currentScale > 1)
              this._loadHighResFrame(this._currentFrame);
      }
      // ─────────────────────────────────────────────────────────────────────────
      // Zoom
      // ─────────────────────────────────────────────────────────────────────────
      _syncZoomIndex() {
          this._zoomLevelIndex = this._zoomLevels.reduce((best, level, i) => {
              return Math.abs(level - this._currentScale) < Math.abs(this._zoomLevels[best] - this._currentScale)
                  ? i : best;
          }, 0);
      }
      _updateZoomButtons() {
          if (!this._zoomInBtn || !this._zoomOutBtn)
              return;
          this._syncZoomIndex();
          this._zoomInBtn.disabled = this._zoomLevelIndex >= this._zoomLevels.length - 1;
          this._zoomOutBtn.disabled = this._zoomLevelIndex <= 0;
      }
      _setZoom(level) {
          const prev = this._currentScale;
          this._currentScale = this._clamp(level, this._minScale, this._maxScale);
          if (this._currentScale <= 1) {
              this._panX = 0;
              this._panY = 0;
          }
          else {
              const ratio = this._currentScale / prev;
              this._panX = Math.round(this._panX * ratio);
              this._panY = Math.round(this._panY * ratio);
          }
          this._cancelScheduledRender();
          this._scheduleRender();
          this._updateZoomButtons();
          // Show/hide rotation controls based on zoom level
          this.classList.toggle('zoomed', this._currentScale > 1);
          if (this._currentScale > 1 && !this._isPinching) {
              this._loadHighResFrame(this._currentFrame);
          }
          this._emit('viewer360:zoomchange', { level: this._currentScale });
      }
      _zoomInStep() {
          this._syncZoomIndex();
          if (this._zoomLevelIndex >= this._zoomLevels.length - 1)
              return;
          this._setZoom(this._zoomLevels[++this._zoomLevelIndex]);
      }
      _cycleZoomForward() {
          this._syncZoomIndex();
          this._zoomLevelIndex = this._zoomLevelIndex >= this._zoomLevels.length - 1
              ? 0
              : this._zoomLevelIndex + 1;
          this._setZoom(this._zoomLevels[this._zoomLevelIndex]);
      }
      _zoomOutStep() {
          this._syncZoomIndex();
          if (this._zoomLevelIndex <= 0)
              return;
          this._setZoom(this._zoomLevels[--this._zoomLevelIndex]);
      }
      _zoomInAtPoint(clientX, clientY) {
          this._syncZoomIndex();
          this._zoomLevelIndex = this._zoomLevelIndex >= this._zoomLevels.length - 1
              ? 0
              : this._zoomLevelIndex + 1;
          const nextScale = this._zoomLevels[this._zoomLevelIndex];
          const prevScale = this._currentScale;
          if (nextScale <= 1) {
              this._setZoom(1);
              return;
          }
          const rect = this.getBoundingClientRect();
          const dx = (clientX - rect.left) - this.clientWidth / 2;
          const dy = (clientY - rect.top) - this.clientHeight / 2;
          const ratio = nextScale / prevScale;
          // Pre-divide so _setZoom's internal scale-pan-by-ratio lands on the desired position
          this._panX = ((this._panX - dx) * ratio + dx) / ratio;
          this._panY = ((this._panY - dy) * ratio + dy) / ratio;
          this._setZoom(nextScale);
      }
      // ─────────────────────────────────────────────────────────────────────────
      // Fullscreen
      // ─────────────────────────────────────────────────────────────────────────
      _fullscreenEl() {
          var _a, _b;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return (_b = (_a = document.fullscreenElement) !== null && _a !== void 0 ? _a : document.webkitFullscreenElement) !== null && _b !== void 0 ? _b : null;
      }
      _requestFs() {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (this.requestFullscreen)
              return this.requestFullscreen();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (this.webkitRequestFullscreen)
              return this.webkitRequestFullscreen();
          return Promise.reject(new Error('Fullscreen not supported'));
      }
      _exitFs() {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (document.exitFullscreen)
              return document.exitFullscreen();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if (document.webkitExitFullscreen)
              return document.webkitExitFullscreen();
          return Promise.resolve();
      }
      _isExpanded() {
          return !!this._fullscreenEl() || this.classList.contains('fullscreen-fallback');
      }
      _updateFullscreenUI(expanded) {
          if (!this._fullscreenBtn || !this._viewerCloseBtn)
              return;
          this._fullscreenBtn.innerHTML = expanded ? this._fullscreenExitSvg : this._fullscreenEnterSvg;
          this._fullscreenBtn.classList.toggle('hidden-in-fullscreen', expanded);
          this._viewerCloseBtn.classList.toggle('visible', expanded);
      }
      _syncFullscreenUI() {
          const expanded = this._isExpanded();
          if (expanded !== this._wasExpanded)
              this._setZoom(1);
          this._wasExpanded = expanded;
          this._updateFullscreenUI(expanded);
      }
      // ─────────────────────────────────────────────────────────────────────────
      // Control visibility (top-right cluster)
      // ─────────────────────────────────────────────────────────────────────────
      _showTopRightControls() {
          var _a;
          (_a = this._viewerTopRight) === null || _a === void 0 ? void 0 : _a.classList.add('controls-visible');
          if (this._hideTimeout !== null)
              clearTimeout(this._hideTimeout);
          this._hideTimeout = setTimeout(() => {
              var _a;
              (_a = this._viewerTopRight) === null || _a === void 0 ? void 0 : _a.classList.remove('controls-visible');
          }, 3000);
      }
      // ─────────────────────────────────────────────────────────────────────────
      // Event listeners setup
      // ─────────────────────────────────────────────────────────────────────────
      _setupEventListeners() {
          var _a, _b, _c, _d, _e, _f, _g, _h;
          // Top-right controls hover / auto-hide
          this.addEventListener('mouseenter', () => this._showTopRightControls());
          this.addEventListener('mousemove', () => this._showTopRightControls());
          this.addEventListener('mouseleave', () => {
              if (this._hideTimeout !== null)
                  clearTimeout(this._hideTimeout);
              this._hideTimeout = setTimeout(() => {
                  var _a;
                  (_a = this._viewerTopRight) === null || _a === void 0 ? void 0 : _a.classList.remove('controls-visible');
              }, 3000);
          });
          // ── Mouse drag ────────────────────────────────────────────────────────
          this.addEventListener('mousedown', (e) => {
              // Ignore clicks that originate on a button inside the shadow DOM.
              // Without this, clicking the play button triggers mousedown → stopAutoRotate()
              // before the button's click handler runs, causing an instant re-start.
              if (e.composedPath().some(el => el.tagName === 'BUTTON'))
                  return;
              this._isDragging = true;
              this._dragLastX = e.clientX;
              this._dragLastY = e.clientY;
              this.classList.add('grabbing');
              this._stopAutoRotate();
          });
          const onMouseMove = (e) => {
              if (!this._isDragging)
                  return;
              const ev = e;
              if (this._currentScale > 1) {
                  this._panX += ev.clientX - this._dragLastX;
                  this._panY += ev.clientY - this._dragLastY;
                  this._dragLastX = ev.clientX;
                  this._dragLastY = ev.clientY;
                  this._scheduleRender();
              }
              else {
                  const delta = ev.clientX - this._dragLastX;
                  if (Math.abs(delta) > 5) {
                      delta > 0 ? this._rotateLeft() : this._rotateRight();
                      this._dragLastX = ev.clientX;
                  }
              }
          };
          const onMouseUp = () => {
              this._isDragging = false;
              this.classList.remove('grabbing');
              this._cancelScheduledRender();
              this._render();
              if (this._currentScale > 1 && !this._highResBuffer[this._currentFrame]) {
                  this._loadHighResFrame(this._currentFrame);
              }
          };
          document.addEventListener('mousemove', onMouseMove);
          document.addEventListener('mouseup', onMouseUp);
          this._docListeners.push(['mousemove', onMouseMove], ['mouseup', onMouseUp]);
          // ── Touch ─────────────────────────────────────────────────────────────
          this.addEventListener('touchstart', (e) => {
              // Ignore touches that start on a button
              if (e.composedPath().some(el => el.tagName === 'BUTTON'))
                  return;
              this._touchDirection = null;
              if (e.touches.length === 2) {
                  this._isPinching = true;
                  const [t1, t2] = [e.touches[0], e.touches[1]];
                  this._initialPinchDistance = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
              }
              else {
                  this._touchStartX = e.touches[0].clientX;
                  this._touchStartY = e.touches[0].clientY;
                  this._stopAutoRotate();
              }
          }, { passive: true });
          this.addEventListener('touchmove', (e) => {
              if (e.touches.length === 2) {
                  e.preventDefault();
                  const [t1, t2] = [e.touches[0], e.touches[1]];
                  const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
                  this._setZoom(this._currentScale * (dist / Math.max(1, this._initialPinchDistance)));
                  this._initialPinchDistance = dist;
              }
              else if (this._currentScale > 1) {
                  e.preventDefault();
                  this._panX += e.touches[0].clientX - this._touchStartX;
                  this._panY += e.touches[0].clientY - this._touchStartY;
                  this._touchStartX = e.touches[0].clientX;
                  this._touchStartY = e.touches[0].clientY;
                  this._scheduleRender();
              }
              else {
                  const dX = e.touches[0].clientX - this._touchStartX;
                  const dY = e.touches[0].clientY - this._touchStartY;
                  if (!this._touchDirection && (Math.abs(dX) > 5 || Math.abs(dY) > 5)) {
                      this._touchDirection = Math.abs(dX) > Math.abs(dY) ? 'horizontal' : 'vertical';
                  }
                  if (this._touchDirection === 'horizontal') {
                      e.preventDefault();
                      if (Math.abs(dX) > 5) {
                          dX > 0 ? this._rotateLeft() : this._rotateRight();
                          this._touchStartX = e.touches[0].clientX;
                      }
                  }
              }
          }, { passive: false });
          this.addEventListener('touchend', (e) => {
              const wasPinching = this._isPinching;
              this._isPinching = false;
              if (e.touches.length === 0) {
                  const t = e.changedTouches[0];
                  if (t) {
                      const now = Date.now();
                      const tapLength = now - this._lastTap;
                      if (tapLength < 500 && tapLength > 0) {
                          e.preventDefault();
                          this._zoomInAtPoint(t.clientX, t.clientY);
                      }
                      this._lastTap = now;
                  }
              }
              this._cancelScheduledRender();
              this._render();
              if (this._currentScale > 1 && (wasPinching || !this._highResBuffer[this._currentFrame])) {
                  this._loadHighResFrame(this._currentFrame);
              }
          }, { passive: false });
          // ── Double-click zoom ─────────────────────────────────────────────────
          (_a = this._viewerViewport) === null || _a === void 0 ? void 0 : _a.addEventListener('dblclick', (e) => {
              e.preventDefault();
              this._isDragging = false;
              this.classList.remove('grabbing');
              this._zoomInAtPoint(e.clientX, e.clientY);
          });
          // ── Wheel (prevent page zoom on ctrl+scroll) ───────────────────────
          this.addEventListener('wheel', (e) => {
              if (e.ctrlKey || e.metaKey)
                  e.preventDefault();
          }, { passive: false });
          // ── Control bar buttons ───────────────────────────────────────────────
          (_b = this._playBtn) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => this._isPlaying ? this._stopAutoRotate() : this._startAutoRotate());
          // Disable rotation buttons when zoomed in — dragging pans instead of rotating at scale > 1
          (_c = this._leftBtn) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => { if (this._currentScale > 1)
              return; this._stopAutoRotate(); this._rotateLeft(); });
          (_d = this._rightBtn) === null || _d === void 0 ? void 0 : _d.addEventListener('click', () => { if (this._currentScale > 1)
              return; this._stopAutoRotate(); this._rotateRight(); });
          (_e = this._zoomInBtn) === null || _e === void 0 ? void 0 : _e.addEventListener('click', () => this._cycleZoomForward());
          (_f = this._zoomOutBtn) === null || _f === void 0 ? void 0 : _f.addEventListener('click', () => this._zoomOutStep());
          // ── Fullscreen ────────────────────────────────────────────────────────
          (_g = this._fullscreenBtn) === null || _g === void 0 ? void 0 : _g.addEventListener('click', () => {
              if (this._isExpanded()) {
                  if (this._fullscreenEl()) {
                      this._exitFs();
                  }
                  else {
                      this.classList.remove('fullscreen-fallback');
                      this._setZoom(1);
                      this._updateFullscreenUI(false);
                  }
                  return;
              }
              this._requestFs().catch(() => {
                  this.classList.add('fullscreen-fallback');
                  this._setZoom(1);
                  this._updateFullscreenUI(true);
              });
          });
          (_h = this._viewerCloseBtn) === null || _h === void 0 ? void 0 : _h.addEventListener('click', () => {
              if (this._fullscreenEl()) {
                  this._exitFs();
              }
              else if (this.classList.contains('fullscreen-fallback')) {
                  this.classList.remove('fullscreen-fallback');
                  this._setZoom(1);
                  this._updateFullscreenUI(false);
              }
              else {
                  this._emit('viewer360:close', {});
              }
          });
          const onFsChange = () => this._syncFullscreenUI();
          document.addEventListener('fullscreenchange', onFsChange);
          document.addEventListener('webkitfullscreenchange', onFsChange);
          this._docListeners.push(['fullscreenchange', onFsChange], ['webkitfullscreenchange', onFsChange]);
          // ── Keyboard ──────────────────────────────────────────────────────────
          const onKeyDown = (e) => {
              var _a, _b, _c;
              const ev = e;
              if ((_b = (_a = ev.target) === null || _a === void 0 ? void 0 : _a.matches) === null || _b === void 0 ? void 0 : _b.call(_a, 'input, textarea, select, [contenteditable]'))
                  return;
              switch (ev.key) {
                  case 'ArrowLeft':
                      if (this._currentScale > 1)
                          break;
                      this._stopAutoRotate();
                      this._rotateRight();
                      break;
                  case 'ArrowRight':
                      if (this._currentScale > 1)
                          break;
                      this._stopAutoRotate();
                      this._rotateLeft();
                      break;
                  case ' ':
                      ev.preventDefault();
                      this._isPlaying ? this._stopAutoRotate() : this._startAutoRotate();
                      break;
                  case '+':
                      this._zoomInStep();
                      break;
                  case '-':
                      this._zoomOutStep();
                      break;
                  case 'f':
                      (_c = this._fullscreenBtn) === null || _c === void 0 ? void 0 : _c.click();
                      break;
                  case 'r':
                      this.reset();
                      break;
              }
          };
          document.addEventListener('keydown', onKeyDown);
          this._docListeners.push(['keydown', onKeyDown]);
          // ── Resize ────────────────────────────────────────────────────────────
          const onResize = () => this._scheduleRender();
          window.addEventListener('resize', onResize);
          this._winListeners.push(['resize', onResize]);
      }
      // ─────────────────────────────────────────────────────────────────────────
      // Cleanup
      // ─────────────────────────────────────────────────────────────────────────
      _teardown() {
          if (this._rotationInterval !== null) {
              clearInterval(this._rotationInterval);
              this._rotationInterval = null;
          }
          if (this._rafHandle !== null) {
              cancelAnimationFrame(this._rafHandle);
              this._rafHandle = null;
          }
          if (this._hideTimeout !== null) {
              clearTimeout(this._hideTimeout);
              this._hideTimeout = null;
          }
          for (const [type, fn] of this._docListeners)
              document.removeEventListener(type, fn);
          this._docListeners = [];
          for (const [type, fn] of this._winListeners)
              window.removeEventListener(type, fn);
          this._winListeners = [];
      }
      // ─────────────────────────────────────────────────────────────────────────
      // Event dispatch
      // ─────────────────────────────────────────────────────────────────────────
      _emit(type, detail) {
          this.dispatchEvent(new CustomEvent(type, { bubbles: true, composed: true, detail }));
      }
  }

  // Register the custom element (safe to call multiple times — checks first)
  if (!customElements.get('viewer-360')) {
      customElements.define('viewer-360', Viewer360Element);
  }

  exports.VIEWER_360_DEFAULTS = VIEWER_360_DEFAULTS;
  exports.Viewer360Element = Viewer360Element;

}));
//# sourceMappingURL=viewer-360.umd.cjs.map
