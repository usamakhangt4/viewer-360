// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────

/** All configurable properties for the <viewer-360> component. */
export interface Viewer360Props {
  // ── Image inputs ──────────────────────────────────────────────────────────

  /**
   * Array of image URLs representing each frame of the 360° rotation. Required.
   * Order determines rotation sequence.
   */
  images: string[];

  /**
   * Optional parallel array of higher-resolution image URLs.
   * Must have the same length as `images`. When provided, the viewer
   * automatically swaps in the high-res variant for the current frame
   * once the user zooms in, without any additional API calls.
   */
  highResImages?: string[];

  // ── Rendering ─────────────────────────────────────────────────────────────

  /**
   * Cap (in CSS pixels) applied to the canvas dimensions during the initial
   * loading phase. Reduces GPU memory and compositing cost for large containers
   * while frames preload. Once the viewer activates, full-resolution rendering
   * resumes automatically.
   * @default undefined (no cap — renders at full container size)
   */
  initialResolution?: number;

  /**
   * Maximum device pixel ratio used when sizing the canvas.
   * Clamping at 2 prevents excessive memory use on high-DPI screens.
   * @default 2
   */
  dprCap?: number;

  // ── Rotation ──────────────────────────────────────────────────────────────

  /**
   * Starting frame number (1-based).
   * @default 1
   */
  frame?: number;

  /**
   * Enable auto-rotation when the viewer first becomes interactive.
   * @default false
   */
  autoRotate?: boolean;

  /**
   * Milliseconds between frames during auto-rotation.
   * Lower values produce faster rotation.
   * @default 100
   */
  speed?: number;

  /**
   * Direction of auto-rotation and manual arrow-button rotation.
   * @default 'right'
   */
  rotationDirection?: 'left' | 'right';

  // ── Zoom ──────────────────────────────────────────────────────────────────

  /**
   * Ordered array of discrete scale levels cycled by the zoom-in button
   * and double-tap/click. Must start at or above 1.
   * @default [1, 2, 4]
   */
  zoomLevels?: number[];

  /**
   * Minimum scale for continuous zoom (pinch gesture).
   * @default 1
   */
  minScale?: number;

  /**
   * Maximum scale for continuous zoom (pinch gesture).
   * @default 4
   */
  maxScale?: number;

  // ── UI toggles ────────────────────────────────────────────────────────────

  /**
   * Show the bottom rotation / play-pause control bar.
   * @default true
   */
  showControls?: boolean;

  /**
   * Show the zoom-in and zoom-out buttons in the top-right cluster.
   * @default true
   */
  showZoomButtons?: boolean;

  /**
   * Show the fullscreen toggle button.
   * @default true
   */
  showFullscreenButton?: boolean;

  /**
   * Show the loading overlay (spinner + progress bar) while frames preload.
   * @default true
   */
  showLoadingOverlay?: boolean;

  /**
   * Show the swipe / pinch hint banner on first touch interaction.
   * @default true
   */
  showMobileHint?: boolean;

  // ── Loading strategy ──────────────────────────────────────────────────────

  /**
   * Circular-distance threshold around the starting frame.
   * Frames within this range are eagerly preloaded; frames beyond it
   * are deferred to idle-time background loading.
   * @default 8
   */
  preloadCount?: number;

  /**
   * Maximum number of parallel image requests during preload.
   * Automatically reduced on slow / save-data connections.
   * @default 4
   */
  concurrentLoads?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Default values (exported so wrappers can reference them)
// ─────────────────────────────────────────────────────────────────────────────

export const VIEWER_360_DEFAULTS = {
  frame: 1,
  autoRotate: false,
  speed: 100,
  rotationDirection: 'right' as const,
  dprCap: 2,
  zoomLevels: [1, 2, 4] as number[],
  minScale: 1,
  maxScale: 4,
  showControls: true,
  showZoomButtons: true,
  showFullscreenButton: true,
  showLoadingOverlay: true,
  showMobileHint: true,
  preloadCount: 8,
  concurrentLoads: 4,
} satisfies Omit<Required<Viewer360Props>, 'images' | 'highResImages' | 'initialResolution'>;

// ─────────────────────────────────────────────────────────────────────────────
// Event detail payloads
// ─────────────────────────────────────────────────────────────────────────────

export interface Viewer360ReadyDetail extends Record<string, never> {}
export interface Viewer360FrameChangeDetail { frame: number }
export interface Viewer360ZoomChangeDetail { level: number }
export interface Viewer360AutoRotateChangeDetail { enabled: boolean }
export interface Viewer360CloseDetail extends Record<string, never> {}
export interface Viewer360ErrorDetail { message: string }

// ─────────────────────────────────────────────────────────────────────────────
// Event map — enables typed addEventListener on the element
// ─────────────────────────────────────────────────────────────────────────────

export interface Viewer360EventMap {
  /** Fired once the viewer is interactive and the first frames are rendered. */
  'viewer360:ready': CustomEvent<Viewer360ReadyDetail>;
  /** Fired whenever the displayed frame changes. */
  'viewer360:framechange': CustomEvent<Viewer360FrameChangeDetail>;
  /** Fired whenever the zoom level changes. */
  'viewer360:zoomchange': CustomEvent<Viewer360ZoomChangeDetail>;
  /** Fired whenever auto-rotation starts or stops. */
  'viewer360:autorotatechange': CustomEvent<Viewer360AutoRotateChangeDetail>;
  /** Fired when the user triggers the close action (e.g. exits fullscreen via the X button). */
  'viewer360:close': CustomEvent<Viewer360CloseDetail>;
  /** Fired when a non-recoverable error occurs (e.g. failed image load). */
  'viewer360:error': CustomEvent<Viewer360ErrorDetail>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Public element interface
// ─────────────────────────────────────────────────────────────────────────────

/** Public interface of the <viewer-360> custom element. */
export interface Viewer360ElementInterface extends HTMLElement {
  // ── Properties (mirror Viewer360Props with required types and defaults) ───
  images: string[];
  highResImages: string[];
  frame: number;
  autoRotate: boolean;
  speed: number;
  rotationDirection: 'left' | 'right';
  initialResolution: number | null;
  dprCap: number;
  zoomLevels: number[];
  minScale: number;
  maxScale: number;
  showControls: boolean;
  showZoomButtons: boolean;
  showFullscreenButton: boolean;
  showLoadingOverlay: boolean;
  showMobileHint: boolean;
  preloadCount: number;
  concurrentLoads: number;

  // ── Imperative API ────────────────────────────────────────────────────────
  /** Jump directly to the given 1-based frame number. */
  showFrame(frame: number): void;
  /** Set the zoom scale. Clamped to [minScale, maxScale]. */
  setZoom(level: number): void;
  /** Start auto-rotation. */
  startAutoRotate(): void;
  /** Stop auto-rotation. */
  stopAutoRotate(): void;
  /** Reset zoom to 1×, jump to frame 1, and stop auto-rotation. */
  reset(): void;

  // ── Typed event listeners ─────────────────────────────────────────────────
  addEventListener<K extends keyof Viewer360EventMap>(
    type: K,
    listener: (event: Viewer360EventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;

  removeEventListener<K extends keyof Viewer360EventMap>(
    type: K,
    listener: (event: Viewer360EventMap[K]) => void,
    options?: boolean | EventListenerOptions,
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Global HTML element type augmentation
// ─────────────────────────────────────────────────────────────────────────────

declare global {
  interface HTMLElementTagNameMap {
    'viewer-360': Viewer360ElementInterface;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Framework-specific prop re-exports
// ─────────────────────────────────────────────────────────────────────────────

/** Props accepted by the React <Viewer360> wrapper component. */
export interface Viewer360ReactProps extends Viewer360Props {
  className?: string;
  style?: Record<string, string | number>;
  /** Called when the viewer becomes interactive. */
  onReady?: () => void;
  /** Called when the displayed frame changes. */
  onFrameChange?: (detail: Viewer360FrameChangeDetail) => void;
  /** Called when the zoom level changes. */
  onZoomChange?: (detail: Viewer360ZoomChangeDetail) => void;
  /** Called when auto-rotation starts or stops. */
  onAutoRotateChange?: (detail: Viewer360AutoRotateChangeDetail) => void;
  /** Called when the close action is triggered. */
  onClose?: () => void;
  /** Called when an error occurs. */
  onError?: (detail: Viewer360ErrorDetail) => void;
}

/** Props accepted by the Vue 3 <Viewer360> wrapper component. */
export type Viewer360VueProps = Viewer360Props;
