import { STYLES } from './styles';
import { TEMPLATE } from './template';
import type { Viewer360ElementInterface, Viewer360EventMap } from './types';
import { VIEWER_360_DEFAULTS } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function parseJsonArray<T>(value: string): T[] {
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

function parseBool(value: string | null, fallback: boolean): boolean {
  if (value === null) return fallback;
  return value !== 'false';
}

function parseInt10(value: string | null, fallback: number): number {
  if (value === null) return fallback;
  const n = parseInt(value, 10);
  return Number.isFinite(n) ? n : fallback;
}

function parseFloat_(value: string | null, fallback: number): number {
  if (value === null) return fallback;
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : fallback;
}

// ─────────────────────────────────────────────────────────────────────────────
// Web Component
// ─────────────────────────────────────────────────────────────────────────────

export class Viewer360Element extends HTMLElement implements Viewer360ElementInterface {

  static get observedAttributes(): string[] {
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

  // ── Configurable state (mirrors Viewer360Props) ───────────────────────────
  private _images: string[] = [];
  private _highResImages: string[] = [];
  private _frame: number = VIEWER_360_DEFAULTS.frame;
  private _autoRotate: boolean = VIEWER_360_DEFAULTS.autoRotate;
  private _speed: number = VIEWER_360_DEFAULTS.speed;
  private _rotationDirection: 'left' | 'right' = VIEWER_360_DEFAULTS.rotationDirection;
  private _initialResolution: number | null = null;
  private _dprCap: number = VIEWER_360_DEFAULTS.dprCap;
  private _zoomLevels: number[] = [...VIEWER_360_DEFAULTS.zoomLevels];
  private _minScale: number = VIEWER_360_DEFAULTS.minScale;
  private _maxScale: number = VIEWER_360_DEFAULTS.maxScale;
  private _showControls: boolean = VIEWER_360_DEFAULTS.showControls;
  private _showZoomButtons: boolean = VIEWER_360_DEFAULTS.showZoomButtons;
  private _showFullscreenButton: boolean = VIEWER_360_DEFAULTS.showFullscreenButton;
  private _showLoadingOverlay: boolean = VIEWER_360_DEFAULTS.showLoadingOverlay;
  private _showMobileHint: boolean = VIEWER_360_DEFAULTS.showMobileHint;
  private _preloadCount: number = VIEWER_360_DEFAULTS.preloadCount;
  private _concurrentLoads: number = VIEWER_360_DEFAULTS.concurrentLoads;

  // ── Shadow DOM element refs ───────────────────────────────────────────────
  private readonly _shadow: ShadowRoot;
  private _canvas: HTMLCanvasElement | null = null;
  private _ctx: CanvasRenderingContext2D | null = null;
  private _loading: HTMLElement | null = null;
  private _progressBar: HTMLElement | null = null;
  private _playBtn: HTMLButtonElement | null = null;
  private _leftBtn: HTMLButtonElement | null = null;
  private _rightBtn: HTMLButtonElement | null = null;
  private _zoomInBtn: HTMLButtonElement | null = null;
  private _zoomOutBtn: HTMLButtonElement | null = null;
  private _fullscreenBtn: HTMLButtonElement | null = null;
  private _viewerCloseBtn: HTMLButtonElement | null = null;
  private _mobileHint: HTMLElement | null = null;
  private _viewerTopRight: HTMLElement | null = null;
  private _viewerControls: HTMLElement | null = null;
  private _viewerViewport: HTMLElement | null = null;
  private _zoomProgressBar: HTMLElement | null = null;
  private _zoomProgressBarFill: HTMLElement | null = null;

  // ── Runtime state ─────────────────────────────────────────────────────────
  private _currentFrame: number = 1;
  private _currentScale: number = 1;
  private _zoomLevelIndex: number = 0;
  private _isPlaying: boolean = false;
  private _isDragging: boolean = false;
  private _dragLastX: number = 0;
  private _dragLastY: number = 0;
  private _panX: number = 0;
  private _panY: number = 0;
  private _frameBuffer: Record<number, HTMLImageElement> = {};
  private _highResBuffer: Record<number, HTMLImageElement> = {};
  private _highResLRUOrder: number[] = [];
  private _isFetchingHighRes: boolean = false;
  private _pendingHighResFrame: number | null = null;
  private _highResBufferMax: number = 5;
  private _pendingIdleFrames: number[] = [];
  private _touchStartX: number = 0;
  private _touchStartY: number = 0;
  private _initialPinchDistance: number = 0;
  private _touchDirection: 'horizontal' | 'vertical' | null = null;
  private _lastTap: number = 0;
  private _canvasCssWidth: number = 0;
  private _canvasCssHeight: number = 0;
  private _canvasDpr: number = 1;
  private _isPinching: boolean = false;
  private _rafHandle: number | null = null;
  private _rotationInterval: ReturnType<typeof setInterval> | null = null;
  private _hideTimeout: ReturnType<typeof setTimeout> | null = null;
  private _totalFrames: number = 0;
  private _activated: boolean = false;
  private _connected: boolean = false;
  private _wasExpanded: boolean = false;
  private _concurrentLoadsEffective: number = VIEWER_360_DEFAULTS.concurrentLoads;

  // Document / window listeners stored for cleanup
  private _docListeners: Array<[string, EventListener]> = [];
  private _winListeners: Array<[string, EventListener]> = [];

  private readonly _fullscreenEnterSvg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>';
  private readonly _fullscreenExitSvg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>';

  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'open' });
    this._injectShadowDOM();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Lifecycle
  // ─────────────────────────────────────────────────────────────────────────

  connectedCallback(): void {
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

  disconnectedCallback(): void {
    this._connected = false;
    this._teardown();
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    switch (name) {
      case 'images':
        this._images = value ? parseJsonArray<string>(value) : [];
        if (this._connected) this._initViewer();
        break;
      case 'high-res-images':
        this._highResImages = value ? parseJsonArray<string>(value) : [];
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
        this._zoomLevels = value ? parseJsonArray<number>(value) : [...VIEWER_360_DEFAULTS.zoomLevels];
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

  get images(): string[] { return this._images; }
  set images(val: string[]) {
    this._images = val;
    if (this._connected) this._initViewer();
  }

  get highResImages(): string[] { return this._highResImages; }
  set highResImages(val: string[]) {
    this._highResImages = val;
    this._clearHighResCache();
  }

  get frame(): number { return this._frame; }
  set frame(val: number) { this._frame = val; }

  get autoRotate(): boolean { return this._autoRotate; }
  set autoRotate(val: boolean) { this._autoRotate = val; }

  get speed(): number { return this._speed; }
  set speed(val: number) {
    this._speed = val;
    // Hot-swap the interval so speed changes take effect immediately
    if (this._isPlaying && this._rotationInterval !== null) {
      clearInterval(this._rotationInterval);
      this._rotationInterval = setInterval(() => this._rotate(), this._speed);
    }
  }

  get rotationDirection(): 'left' | 'right' { return this._rotationDirection; }
  set rotationDirection(val: 'left' | 'right') { this._rotationDirection = val; }

  get initialResolution(): number | null { return this._initialResolution; }
  set initialResolution(val: number | null) { this._initialResolution = val; }

  get dprCap(): number { return this._dprCap; }
  set dprCap(val: number) {
    this._dprCap = val;
    this._scheduleRender();
  }

  get zoomLevels(): number[] { return this._zoomLevels; }
  set zoomLevels(val: number[]) {
    this._zoomLevels = val;
    this._updateZoomButtons();
  }

  get minScale(): number { return this._minScale; }
  set minScale(val: number) { this._minScale = val; }

  get maxScale(): number { return this._maxScale; }
  set maxScale(val: number) { this._maxScale = val; }

  get showControls(): boolean { return this._showControls; }
  set showControls(val: boolean) { this._showControls = val; this._applyUIToggles(); }

  get showZoomButtons(): boolean { return this._showZoomButtons; }
  set showZoomButtons(val: boolean) { this._showZoomButtons = val; this._applyUIToggles(); }

  get showFullscreenButton(): boolean { return this._showFullscreenButton; }
  set showFullscreenButton(val: boolean) { this._showFullscreenButton = val; this._applyUIToggles(); }

  get showLoadingOverlay(): boolean { return this._showLoadingOverlay; }
  set showLoadingOverlay(val: boolean) { this._showLoadingOverlay = val; this._applyUIToggles(); }

  get showMobileHint(): boolean { return this._showMobileHint; }
  set showMobileHint(val: boolean) { this._showMobileHint = val; }

  get preloadCount(): number { return this._preloadCount; }
  set preloadCount(val: number) { this._preloadCount = val; }

  get concurrentLoads(): number { return this._concurrentLoads; }
  set concurrentLoads(val: number) {
    this._concurrentLoads = val;
    this._concurrentLoadsEffective = val;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Public imperative API
  // ─────────────────────────────────────────────────────────────────────────

  showFrame(frame: number): void { this._showFrame(frame); }
  setZoom(level: number): void { this._setZoom(level); }
  startAutoRotate(): void { this._startAutoRotate(); }
  stopAutoRotate(): void { this._stopAutoRotate(); }
  reset(): void {
    this._setZoom(1);
    this._showFrame(1);
    this._stopAutoRotate();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Shadow DOM setup
  // ─────────────────────────────────────────────────────────────────────────

  private _injectShadowDOM(): void {
    const style = document.createElement('style');
    style.textContent = STYLES;
    this._shadow.appendChild(style);
    const wrapper = document.createElement('div');
    wrapper.innerHTML = TEMPLATE;
    while (wrapper.firstChild) {
      this._shadow.appendChild(wrapper.firstChild);
    }
  }

  private _queryElements(): void {
    const s = this._shadow;
    this._canvas          = s.getElementById('viewerCanvas') as HTMLCanvasElement | null;
    this._ctx             = this._canvas?.getContext('2d', { alpha: false }) ?? null;
    this._loading         = s.getElementById('loading');
    this._progressBar     = s.getElementById('progressBar');
    this._playBtn         = s.getElementById('playBtn') as HTMLButtonElement | null;
    this._leftBtn         = s.getElementById('leftBtn') as HTMLButtonElement | null;
    this._rightBtn        = s.getElementById('rightBtn') as HTMLButtonElement | null;
    this._zoomInBtn       = s.getElementById('zoomInBtn') as HTMLButtonElement | null;
    this._zoomOutBtn      = s.getElementById('zoomOutBtn') as HTMLButtonElement | null;
    this._fullscreenBtn   = s.getElementById('fullscreenBtn') as HTMLButtonElement | null;
    this._viewerCloseBtn  = s.getElementById('viewerCloseBtn') as HTMLButtonElement | null;
    this._mobileHint      = s.getElementById('mobileHint');
    this._viewerTopRight  = s.querySelector('.viewer-top-right');
    this._viewerControls  = s.getElementById('controls');
    this._viewerViewport  = s.querySelector('.viewer-viewport');
    this._zoomProgressBar     = s.getElementById('zoomProgressBar');
    this._zoomProgressBarFill = s.getElementById('zoomProgressBarFill');
  }

  private _applyUIToggles(): void {
    if (this._viewerControls) {
      this._viewerControls.style.display = this._showControls ? '' : 'none';
    }
    if (this._zoomInBtn)  this._zoomInBtn.style.display  = this._showZoomButtons ? '' : 'none';
    if (this._zoomOutBtn) this._zoomOutBtn.style.display = this._showZoomButtons ? '' : 'none';
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

  private _initNetworkProfile(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const conn = (navigator as any).connection ?? (navigator as any).mozConnection ?? (navigator as any).webkitConnection ?? null;
    let profile = 'unknown';
    if (conn) {
      if (conn.saveData) {
        profile = 'save-data';
      } else {
        const et: string = (conn.effectiveType ?? '').toLowerCase();
        if (et === 'slow-2g' || et === '2g') profile = 'slow';
        else if (et === '4g') profile = 'fast';
        else profile = 'medium';
      }
    }
    const isSlow = profile === 'slow' || profile === 'save-data';
    this._highResBufferMax         = isSlow ? 3 : 5;
    this._concurrentLoadsEffective = isSlow ? Math.min(2, this._concurrentLoads) : this._concurrentLoads;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Viewer initialisation
  // ─────────────────────────────────────────────────────────────────────────

  private _initViewer(): void {
    if (!this._connected || !this._images.length) return;

    // Reset state
    this._frameBuffer  = {};
    this._clearHighResCache();
    this._pendingIdleFrames = [];
    this._activated    = false;
    this._totalFrames  = this._images.length;
    this._currentFrame = Math.min(Math.max(1, this._frame), this._totalFrames);
    this._currentScale = 1;
    this._panX = 0;
    this._panY = 0;
    this._canvasCssWidth  = 0;
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
    if (this._progressBar) this._progressBar.style.width = '0%';

    this._preloadImages();
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Image preloading
  // ─────────────────────────────────────────────────────────────────────────

  private _circularDist(a: number, b: number, n: number): number {
    const d = Math.abs(a - b);
    return Math.min(d, n - d);
  }

  private _preloadImages(): void {
    const images = this._images;
    const total  = images.length;

    if (total === 0) {
      const text = this._loading?.querySelector('.loading-text');
      if (text) text.textContent = 'No frames available';
      return;
    }

    const currentIndex    = this._currentFrame - 1;
    const keyFrameIndices = [0, 8, 16, 24].filter(i => i < total);
    const allIndices      = Array.from({ length: total }, (_, i) => i);
    const remainingIndices = allIndices.filter(i => !keyFrameIndices.includes(i));

    remainingIndices.sort(
      (a, b) => this._circularDist(a, currentIndex, total) - this._circularDist(b, currentIndex, total),
    );

    const nearbyIndices = remainingIndices.filter(
      i => this._circularDist(i, currentIndex, total) <= this._preloadCount,
    );
    this._pendingIdleFrames = remainingIndices.filter(
      i => this._circularDist(i, currentIndex, total) > this._preloadCount,
    );

    const loadingOrder  = [...keyFrameIndices, ...nearbyIndices];
    let loadedCount     = 0;
    let keyFramesLoaded = 0;
    let queueIndex      = 0;
    let inFlight        = 0;
    const concurrently  = this._concurrentLoadsEffective;

    const onFrameDone = () => {
      inFlight--;
      if (queueIndex < loadingOrder.length) startNext();
    };

    const startNext = () => {
      while (inFlight < concurrently && queueIndex < loadingOrder.length) {
        const index = loadingOrder[queueIndex++];
        const src   = images[index];
        const img   = new Image();
        inFlight++;

        img.onload = () => {
          this._frameBuffer[index] = img;

          const finalize = () => {
            loadedCount++;
            if (keyFrameIndices.includes(index)) keyFramesLoaded++;

            const progress = (loadedCount / loadingOrder.length) * 100;
            if (this._progressBar) this._progressBar.style.width = `${progress}%`;

            if (index === currentIndex) this._showFrame(this._currentFrame);

            const firstLoaded    = !!this._frameBuffer[currentIndex];
            const enoughKeyFrames = keyFramesLoaded >= Math.min(keyFrameIndices.length, 3);
            if (!this._activated && firstLoaded && enoughKeyFrames) this._activateViewer();
            if (loadedCount === loadingOrder.length && !this._activated) this._activateViewer();

            onFrameDone();
          };

          if (typeof img.decode === 'function') {
            img.decode().then(finalize).catch(() => finalize());
          } else {
            finalize();
          }
        };

        img.onerror = () => { loadedCount++; onFrameDone(); };
        img.src = src;
      }
    };

    startNext();
  }

  private _scheduleIdleLoad(indices: number[]): void {
    if (!indices.length) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scheduleIdle = (window as any).requestIdleCallback
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ? (fn: IdleRequestCallback) => (window as any).requestIdleCallback(fn, { timeout: 3000 })
      : (fn: (d: { timeRemaining: () => number }) => void) =>
          setTimeout(() => fn({ timeRemaining: () => 50 }), 200);

    let i = 0;
    let idleInFlight = 0;

    const pump = (deadline: { timeRemaining: () => number }) => {
      while (idleInFlight < this._concurrentLoadsEffective && i < indices.length) {
        if (deadline.timeRemaining() < 5) { scheduleIdle(pump); return; }
        const index = indices[i++];
        if (this._frameBuffer[index] || !this._images[index]) continue;
        idleInFlight++;
        const img = new Image();
        img.onload = () => {
          idleInFlight--;
          this._frameBuffer[index] = img;
          if (typeof img.decode === 'function') img.decode().catch(() => undefined);
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

  private _clamp(v: number, lo: number, hi: number): number {
    return Math.max(lo, Math.min(hi, v));
  }

  private _getFrameImage(frameNumber: number): HTMLImageElement | null {
    return this._frameBuffer[frameNumber - 1] ?? null;
  }

  private _getActiveImage(): HTMLImageElement | null {
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

  private _clampPan(scaledW: number, scaledH: number): void {
    const maxX = Math.max(0, (scaledW - this.clientWidth)  / 2);
    const maxY = Math.max(0, (scaledH - this.clientHeight) / 2);
    this._panX = Math.max(-maxX, Math.min(maxX, this._panX));
    this._panY = Math.max(-maxY, Math.min(maxY, this._panY));
  }

  private _render(): void {
    if (!this._canvas || !this._ctx) return;

    const activeImage = this._getActiveImage();
    if (!activeImage) return;

    const geoImage = this._getFrameImage(this._currentFrame) ?? activeImage;

    const cssW = Math.max(1, this.clientWidth  || 1);
    const cssH = Math.max(1, this.clientHeight || 1);
    const dpr  = Math.max(1, Math.min(this._dprCap, window.devicePixelRatio || 1));

    // During preload: optionally cap canvas resolution
    let renderW = cssW;
    let renderH = cssH;
    if (!this._activated && this._initialResolution && this._initialResolution > 0) {
      const cap   = this._initialResolution;
      const scale = Math.min(1, cap / Math.max(cssW, cssH));
      renderW     = Math.round(cssW * scale);
      renderH     = Math.round(cssH * scale);
    }

    if (this._canvasCssWidth !== renderW || this._canvasCssHeight !== renderH || this._canvasDpr !== dpr) {
      this._canvasCssWidth  = renderW;
      this._canvasCssHeight = renderH;
      this._canvasDpr       = dpr;
      this._canvas.width    = Math.round(renderW * dpr);
      this._canvas.height   = Math.round(renderH * dpr);
      // Keep the CSS size matching the container regardless of render resolution
      this._canvas.style.width  = `${cssW}px`;
      this._canvas.style.height = `${cssH}px`;
    }

    const imgW = geoImage.naturalWidth  || (geoImage as HTMLImageElement).width;
    const imgH = geoImage.naturalHeight || (geoImage as HTMLImageElement).height;
    if (!imgW || !imgH) return;

    const fitScale   = Math.min(renderW / imgW, renderH / imgH);
    const drawW      = imgW * fitScale;
    const drawH      = imgH * fitScale;
    const scaledW    = drawW * this._currentScale;
    const scaledH    = drawH * this._currentScale;

    this._clampPan(scaledW, scaledH);

    const drawX = (renderW - scaledW) / 2 + this._panX;
    const drawY = (renderH - scaledH) / 2 + this._panY;

    this._ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this._ctx.fillStyle = '#ffffff';
    this._ctx.fillRect(0, 0, renderW, renderH);
    this._ctx.drawImage(activeImage, drawX, drawY, scaledW, scaledH);
  }

  private _scheduleRender(): void {
    if (this._rafHandle !== null) return;
    this._rafHandle = requestAnimationFrame(() => {
      this._rafHandle = null;
      this._render();
    });
  }

  private _cancelScheduledRender(): void {
    if (this._rafHandle === null) return;
    cancelAnimationFrame(this._rafHandle);
    this._rafHandle = null;
  }

  /** Extra paint frames for Safari/WebKit compositing after a canvas source change. */
  private _kickWebKitComposite(): void {
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

  private _clearHighResCache(): void {
    this._highResBuffer     = {};
    this._highResLRUOrder   = [];
    this._isFetchingHighRes = false;
    this._pendingHighResFrame = null;
  }

  private _evictLRU(frameNumber: number): void {
    const idx = this._highResLRUOrder.indexOf(frameNumber);
    if (idx !== -1) this._highResLRUOrder.splice(idx, 1);
    while (this._highResLRUOrder.length >= this._highResBufferMax) {
      const evicted = this._highResLRUOrder.shift()!;
      delete this._highResBuffer[evicted];
    }
    this._highResLRUOrder.push(frameNumber);
  }

  private _setZoomProgressIndeterminate(): void {
    if (!this._zoomProgressBar || !this._zoomProgressBarFill) return;
    this._zoomProgressBar.classList.add('indeterminate');
    this._zoomProgressBarFill.style.transform = '';
    this._zoomProgressBar.removeAttribute('aria-valuenow');
  }

  private _setZoomLoading(visible: boolean): void {
    if (!this._zoomProgressBar) return;
    this._zoomProgressBar.classList.toggle('visible', visible);
    this._zoomProgressBar.setAttribute('aria-hidden', visible ? 'false' : 'true');
    if (visible) {
      this._setZoomProgressIndeterminate();
      this._zoomProgressBar.setAttribute('aria-valuetext', 'Loading high resolution image');
      this._zoomProgressBar.setAttribute('aria-busy', 'true');
    } else {
      this._zoomProgressBar.removeAttribute('aria-valuetext');
      this._zoomProgressBar.removeAttribute('aria-busy');
      this._setZoomProgressIndeterminate();
    }
  }

  private _loadHighResFrame(frameNumber: number): void {
    if (!this._highResImages.length) return;
    const src = this._highResImages[frameNumber - 1];
    if (!src) return;

    const cached = this._highResBuffer[frameNumber];
    if (cached?.complete) return;

    if (this._isFetchingHighRes) {
      this._pendingHighResFrame = frameNumber;
      return;
    }

    this._isFetchingHighRes   = true;
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
      } else {
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

  private _activateViewer(): void {
    if (this._activated) return;
    this._activated = true;

    if (this._loading) this._loading.classList.add('hidden');
    if (this._canvas) {
      this._canvas.style.display = 'block';
      this._canvas.classList.add('loaded');
    }

    if (this._images.length && this._getFrameImage(this._currentFrame)) {
      this._showFrame(this._currentFrame);
      this._kickWebKitComposite();
    }

    if (this._autoRotate) this._startAutoRotate();
    this._updateZoomButtons();

    if ('ontouchstart' in window && this._showMobileHint && this._mobileHint) {
      this._mobileHint.classList.add('visible');
      setTimeout(() => this._mobileHint?.classList.remove('visible'), 3000);
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

  private _showFrame(frameNumber: number): void {
    if (!this._getFrameImage(frameNumber)) return;
    this._currentFrame = frameNumber;
    this._render();
    this._emit('viewer360:framechange', { frame: frameNumber });
    if (this._currentScale > 1 && !this._isDragging && !this._isPlaying) {
      this._loadHighResFrame(frameNumber);
    }
  }

  private _rotate(): void {
    if (this._rotationDirection === 'right') {
      const next = this._currentFrame > 1 ? this._currentFrame - 1 : this._totalFrames;
      this._showFrame(next);
    } else {
      const next = this._currentFrame < this._totalFrames ? this._currentFrame + 1 : 1;
      this._showFrame(next);
    }
  }

  private _rotateLeft(): void {
    const next = this._currentFrame < this._totalFrames ? this._currentFrame + 1 : 1;
    this._showFrame(next);
  }

  private _rotateRight(): void {
    const next = this._currentFrame > 1 ? this._currentFrame - 1 : this._totalFrames;
    this._showFrame(next);
  }

  private _startAutoRotate(): void {
    if (this._rotationInterval) return;
    this._isPlaying = true;
    if (this._playBtn) {
      this._playBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
    }
    this._rotationInterval = setInterval(() => this._rotate(), this._speed);
    this._emit('viewer360:autorotatechange', { enabled: true });
  }

  private _stopAutoRotate(): void {
    if (!this._rotationInterval) return;
    this._isPlaying = false;
    if (this._playBtn) {
      this._playBtn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
    }
    clearInterval(this._rotationInterval);
    this._rotationInterval = null;
    this._emit('viewer360:autorotatechange', { enabled: false });
    if (this._currentScale > 1) this._loadHighResFrame(this._currentFrame);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Zoom
  // ─────────────────────────────────────────────────────────────────────────

  private _syncZoomIndex(): void {
    this._zoomLevelIndex = this._zoomLevels.reduce((best, level, i) => {
      return Math.abs(level - this._currentScale) < Math.abs(this._zoomLevels[best] - this._currentScale)
        ? i : best;
    }, 0);
  }

  private _updateZoomButtons(): void {
    if (!this._zoomInBtn || !this._zoomOutBtn) return;
    this._syncZoomIndex();
    this._zoomInBtn.disabled  = this._zoomLevelIndex >= this._zoomLevels.length - 1;
    this._zoomOutBtn.disabled = this._zoomLevelIndex <= 0;
  }

  private _setZoom(level: number): void {
    const prev        = this._currentScale;
    this._currentScale = this._clamp(level, this._minScale, this._maxScale);

    if (this._currentScale <= 1) {
      this._panX = 0;
      this._panY = 0;
    } else {
      const ratio = this._currentScale / prev;
      this._panX  = Math.round(this._panX * ratio);
      this._panY  = Math.round(this._panY * ratio);
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

  private _zoomInStep(): void {
    this._syncZoomIndex();
    if (this._zoomLevelIndex >= this._zoomLevels.length - 1) return;
    this._setZoom(this._zoomLevels[++this._zoomLevelIndex]);
  }

  private _cycleZoomForward(): void {
    this._syncZoomIndex();
    this._zoomLevelIndex = this._zoomLevelIndex >= this._zoomLevels.length - 1
      ? 0
      : this._zoomLevelIndex + 1;
    this._setZoom(this._zoomLevels[this._zoomLevelIndex]);
  }

  private _zoomOutStep(): void {
    this._syncZoomIndex();
    if (this._zoomLevelIndex <= 0) return;
    this._setZoom(this._zoomLevels[--this._zoomLevelIndex]);
  }

  private _zoomInAtPoint(clientX: number, clientY: number): void {
    this._syncZoomIndex();
    this._zoomLevelIndex = this._zoomLevelIndex >= this._zoomLevels.length - 1
      ? 0
      : this._zoomLevelIndex + 1;

    const nextScale = this._zoomLevels[this._zoomLevelIndex];
    const prevScale = this._currentScale;

    if (nextScale <= 1) { this._setZoom(1); return; }

    const rect    = this.getBoundingClientRect();
    const dx      = (clientX - rect.left) - this.clientWidth  / 2;
    const dy      = (clientY - rect.top)  - this.clientHeight / 2;
    const ratio   = nextScale / prevScale;

    // Pre-divide so _setZoom's internal scale-pan-by-ratio lands on the desired position
    this._panX = ((this._panX - dx) * ratio + dx) / ratio;
    this._panY = ((this._panY - dy) * ratio + dy) / ratio;
    this._setZoom(nextScale);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Fullscreen
  // ─────────────────────────────────────────────────────────────────────────

  private _fullscreenEl(): Element | null {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (document as any).fullscreenElement ?? (document as any).webkitFullscreenElement ?? null;
  }

  private _requestFs(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((this as any).requestFullscreen)       return (this as any).requestFullscreen();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((this as any).webkitRequestFullscreen) return (this as any).webkitRequestFullscreen();
    return Promise.reject(new Error('Fullscreen not supported'));
  }

  private _exitFs(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((document as any).exitFullscreen)       return (document as any).exitFullscreen();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((document as any).webkitExitFullscreen) return (document as any).webkitExitFullscreen();
    return Promise.resolve();
  }

  private _isExpanded(): boolean {
    return !!this._fullscreenEl() || this.classList.contains('fullscreen-fallback');
  }

  private _updateFullscreenUI(expanded: boolean): void {
    if (!this._fullscreenBtn || !this._viewerCloseBtn) return;
    this._fullscreenBtn.innerHTML = expanded ? this._fullscreenExitSvg : this._fullscreenEnterSvg;
    this._fullscreenBtn.classList.toggle('hidden-in-fullscreen', expanded);
    this._viewerCloseBtn.classList.toggle('visible', expanded);
  }

  private _syncFullscreenUI(): void {
    const expanded = this._isExpanded();
    if (expanded !== this._wasExpanded) this._setZoom(1);
    this._wasExpanded = expanded;
    this._updateFullscreenUI(expanded);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Control visibility (top-right cluster)
  // ─────────────────────────────────────────────────────────────────────────

  private _showTopRightControls(): void {
    this._viewerTopRight?.classList.add('controls-visible');
    if (this._hideTimeout !== null) clearTimeout(this._hideTimeout);
    this._hideTimeout = setTimeout(() => {
      this._viewerTopRight?.classList.remove('controls-visible');
    }, 3000);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Event listeners setup
  // ─────────────────────────────────────────────────────────────────────────

  private _setupEventListeners(): void {
    // Top-right controls hover / auto-hide
    this.addEventListener('mouseenter', () => this._showTopRightControls());
    this.addEventListener('mousemove',  () => this._showTopRightControls());
    this.addEventListener('mouseleave', () => {
      if (this._hideTimeout !== null) clearTimeout(this._hideTimeout);
      this._hideTimeout = setTimeout(() => {
        this._viewerTopRight?.classList.remove('controls-visible');
      }, 3000);
    });

    // ── Mouse drag ────────────────────────────────────────────────────────
    this.addEventListener('mousedown', (e: MouseEvent) => {
      // Ignore clicks that originate on a button inside the shadow DOM.
      // Without this, clicking the play button triggers mousedown → stopAutoRotate()
      // before the button's click handler runs, causing an instant re-start.
      if (e.composedPath().some(el => (el as Element).tagName === 'BUTTON')) return;
      this._isDragging = true;
      this._dragLastX  = e.clientX;
      this._dragLastY  = e.clientY;
      this.classList.add('grabbing');
      this._stopAutoRotate();
    });

    const onMouseMove: EventListener = (e) => {
      if (!this._isDragging) return;
      const ev = e as MouseEvent;
      if (this._currentScale > 1) {
        this._panX      += ev.clientX - this._dragLastX;
        this._panY      += ev.clientY - this._dragLastY;
        this._dragLastX  = ev.clientX;
        this._dragLastY  = ev.clientY;
        this._scheduleRender();
      } else {
        const delta = ev.clientX - this._dragLastX;
        if (Math.abs(delta) > 5) {
          delta > 0 ? this._rotateLeft() : this._rotateRight();
          this._dragLastX = ev.clientX;
        }
      }
    };

    const onMouseUp: EventListener = () => {
      this._isDragging = false;
      this.classList.remove('grabbing');
      this._cancelScheduledRender();
      this._render();
      if (this._currentScale > 1 && !this._highResBuffer[this._currentFrame]) {
        this._loadHighResFrame(this._currentFrame);
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup',   onMouseUp);
    this._docListeners.push(['mousemove', onMouseMove], ['mouseup', onMouseUp]);

    // ── Touch ─────────────────────────────────────────────────────────────
    this.addEventListener('touchstart', (e: TouchEvent) => {
      // Ignore touches that start on a button
      if (e.composedPath().some(el => (el as Element).tagName === 'BUTTON')) return;
      this._touchDirection = null;
      if (e.touches.length === 2) {
        this._isPinching = true;
        const [t1, t2]   = [e.touches[0], e.touches[1]];
        this._initialPinchDistance = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      } else {
        this._touchStartX = e.touches[0].clientX;
        this._touchStartY = e.touches[0].clientY;
        this._stopAutoRotate();
      }
    }, { passive: true });

    this.addEventListener('touchmove', (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const [t1, t2] = [e.touches[0], e.touches[1]];
        const dist     = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        this._setZoom(this._currentScale * (dist / Math.max(1, this._initialPinchDistance)));
        this._initialPinchDistance = dist;
      } else if (this._currentScale > 1) {
        e.preventDefault();
        this._panX += e.touches[0].clientX - this._touchStartX;
        this._panY += e.touches[0].clientY - this._touchStartY;
        this._touchStartX = e.touches[0].clientX;
        this._touchStartY = e.touches[0].clientY;
        this._scheduleRender();
      } else {
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

    this.addEventListener('touchend', (e: TouchEvent) => {
      const wasPinching = this._isPinching;
      this._isPinching  = false;

      if (e.touches.length === 0) {
        const t = e.changedTouches[0];
        if (t) {
          const now       = Date.now();
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
    this._viewerViewport?.addEventListener('dblclick', (e: MouseEvent) => {
      e.preventDefault();
      this._isDragging = false;
      this.classList.remove('grabbing');
      this._zoomInAtPoint(e.clientX, e.clientY);
    });

    // ── Wheel (prevent page zoom on ctrl+scroll) ───────────────────────
    this.addEventListener('wheel', (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) e.preventDefault();
    }, { passive: false });

    // ── Control bar buttons ───────────────────────────────────────────────
    this._playBtn?.addEventListener('click',  () => this._isPlaying ? this._stopAutoRotate() : this._startAutoRotate());
    // Disable rotation buttons when zoomed in — dragging pans instead of rotating at scale > 1
    this._leftBtn?.addEventListener('click',  () => { if (this._currentScale > 1) return; this._stopAutoRotate(); this._rotateLeft();  });
    this._rightBtn?.addEventListener('click', () => { if (this._currentScale > 1) return; this._stopAutoRotate(); this._rotateRight(); });
    this._zoomInBtn?.addEventListener('click',  () => this._cycleZoomForward());
    this._zoomOutBtn?.addEventListener('click', () => this._zoomOutStep());

    // ── Fullscreen ────────────────────────────────────────────────────────
    this._fullscreenBtn?.addEventListener('click', () => {
      if (this._isExpanded()) {
        if (this._fullscreenEl()) {
          this._exitFs();
        } else {
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

    this._viewerCloseBtn?.addEventListener('click', () => {
      if (this._fullscreenEl()) {
        this._exitFs();
      } else if (this.classList.contains('fullscreen-fallback')) {
        this.classList.remove('fullscreen-fallback');
        this._setZoom(1);
        this._updateFullscreenUI(false);
      } else {
        this._emit('viewer360:close', {});
      }
    });

    const onFsChange: EventListener = () => this._syncFullscreenUI();
    document.addEventListener('fullscreenchange',        onFsChange);
    document.addEventListener('webkitfullscreenchange',  onFsChange);
    this._docListeners.push(['fullscreenchange', onFsChange], ['webkitfullscreenchange', onFsChange]);

    // ── Keyboard ──────────────────────────────────────────────────────────
    const onKeyDown: EventListener = (e) => {
      const ev = e as KeyboardEvent;
      if ((ev.target as HTMLElement)?.matches?.('input, textarea, select, [contenteditable]')) return;
      switch (ev.key) {
        case 'ArrowLeft':
          if (this._currentScale > 1) break;
          this._stopAutoRotate(); this._rotateRight(); break;
        case 'ArrowRight':
          if (this._currentScale > 1) break;
          this._stopAutoRotate(); this._rotateLeft(); break;
        case ' ':
          ev.preventDefault();
          this._isPlaying ? this._stopAutoRotate() : this._startAutoRotate(); break;
        case '+': this._zoomInStep();  break;
        case '-': this._zoomOutStep(); break;
        case 'f': this._fullscreenBtn?.click(); break;
        case 'r': this.reset(); break;
      }
    };
    document.addEventListener('keydown', onKeyDown);
    this._docListeners.push(['keydown', onKeyDown]);

    // ── Resize ────────────────────────────────────────────────────────────
    const onResize: EventListener = () => this._scheduleRender();
    window.addEventListener('resize', onResize);
    this._winListeners.push(['resize', onResize]);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Cleanup
  // ─────────────────────────────────────────────────────────────────────────

  private _teardown(): void {
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
    for (const [type, fn] of this._docListeners) document.removeEventListener(type, fn);
    this._docListeners = [];
    for (const [type, fn] of this._winListeners) window.removeEventListener(type, fn);
    this._winListeners = [];
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Event dispatch
  // ─────────────────────────────────────────────────────────────────────────

  private _emit<K extends keyof Viewer360EventMap>(
    type: K,
    detail: Viewer360EventMap[K] extends CustomEvent<infer D> ? D : never,
  ): void {
    this.dispatchEvent(new CustomEvent(type, { bubbles: true, composed: true, detail }));
  }
}
