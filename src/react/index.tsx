import React, { forwardRef, useEffect, useRef } from 'react';
import type { Viewer360ReactProps, Viewer360ElementInterface } from '../core/types';
import { VIEWER_360_DEFAULTS } from '../core/types';
// Registers the custom element
import '../index';

// ── JSX type declaration ──────────────────────────────────────────────────────
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'viewer-360': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & React.ClassAttributes<HTMLElement> & {
        frame?: number;
        speed?: number;
        'rotation-direction'?: string;
        'dpr-cap'?: number;
        'min-scale'?: number;
        'max-scale'?: number;
        'preload-count'?: number;
        'concurrent-loads'?: number;
        'auto-rotate'?: string | boolean;
        'initial-resolution'?: number;
        'show-controls'?: string;
        'show-zoom-buttons'?: string;
        'show-fullscreen-button'?: string;
        'show-loading-overlay'?: string;
        'show-mobile-hint'?: string;
      };
    }
  }
}

/**
 * React wrapper for the <viewer-360> Web Component.
 *
 * Handles React's limitation of serialising non-primitive props (arrays/objects)
 * as strings by setting them imperatively via a ref. Custom events are forwarded
 * as typed `onXxx` callback props.
 *
 * @example
 * ```tsx
 * <Viewer360
 *   images={frameUrls}
 *   highResImages={highResUrls}
 *   autoRotate
 *   speed={80}
 *   onFrameChange={({ frame }) => console.log(frame)}
 * />
 * ```
 */
export const Viewer360 = forwardRef<Viewer360ElementInterface, Viewer360ReactProps>(
  function Viewer360(props, forwardedRef) {
    const {
      images,
      highResImages,
      frame          = VIEWER_360_DEFAULTS.frame,
      autoRotate     = VIEWER_360_DEFAULTS.autoRotate,
      speed          = VIEWER_360_DEFAULTS.speed,
      rotationDirection = VIEWER_360_DEFAULTS.rotationDirection,
      initialResolution,
      dprCap         = VIEWER_360_DEFAULTS.dprCap,
      zoomLevels     = VIEWER_360_DEFAULTS.zoomLevels,
      minScale       = VIEWER_360_DEFAULTS.minScale,
      maxScale       = VIEWER_360_DEFAULTS.maxScale,
      showControls       = VIEWER_360_DEFAULTS.showControls,
      showZoomButtons    = VIEWER_360_DEFAULTS.showZoomButtons,
      showFullscreenButton = VIEWER_360_DEFAULTS.showFullscreenButton,
      showLoadingOverlay = VIEWER_360_DEFAULTS.showLoadingOverlay,
      showMobileHint     = VIEWER_360_DEFAULTS.showMobileHint,
      preloadCount   = VIEWER_360_DEFAULTS.preloadCount,
      concurrentLoads = VIEWER_360_DEFAULTS.concurrentLoads,
      onReady,
      onFrameChange,
      onZoomChange,
      onAutoRotateChange,
      onClose,
      onError,
      className,
      style,
    } = props;

    const innerRef = useRef<Viewer360ElementInterface>(null);

    // Merge forwarded ref and inner ref
    const setRef = (el: Viewer360ElementInterface | null) => {
      (innerRef as React.MutableRefObject<Viewer360ElementInterface | null>).current = el;
      if (typeof forwardedRef === 'function') {
        forwardedRef(el);
      } else if (forwardedRef) {
        (forwardedRef as React.MutableRefObject<Viewer360ElementInterface | null>).current = el;
      }
    };

    // ── Set array/object props imperatively (React can't pass these via attributes) ──
    useEffect(() => {
      const el = innerRef.current;
      if (el) el.images = images;
    }, [images]);

    useEffect(() => {
      const el = innerRef.current;
      if (el && highResImages) el.highResImages = highResImages;
    }, [highResImages]);

    useEffect(() => {
      const el = innerRef.current;
      if (el) el.zoomLevels = zoomLevels;
    }, [zoomLevels]);

    // ── Event listeners ───────────────────────────────────────────────────────
    useEffect(() => {
      const el = innerRef.current;
      if (!el) return;

      const handlers: Array<[string, EventListener]> = [];

      const on = (type: string, handler: EventListener) => {
        el.addEventListener(type, handler);
        handlers.push([type, handler]);
      };

      if (onReady)            on('viewer360:ready',           () => onReady());
      if (onFrameChange)      on('viewer360:framechange',     (e) => onFrameChange((e as CustomEvent).detail));
      if (onZoomChange)       on('viewer360:zoomchange',      (e) => onZoomChange((e as CustomEvent).detail));
      if (onAutoRotateChange) on('viewer360:autorotatechange',(e) => onAutoRotateChange((e as CustomEvent).detail));
      if (onClose)            on('viewer360:close',           () => onClose());
      if (onError)            on('viewer360:error',           (e) => onError((e as CustomEvent).detail));

      return () => {
        handlers.forEach(([type, fn]) => el.removeEventListener(type, fn));
      };
    }, [onReady, onFrameChange, onZoomChange, onAutoRotateChange, onClose, onError]);

    // ── Build attribute map for non-array primitive props ─────────────────────
    const boolAttr = (val: boolean) => (val ? '' : 'false');

    return (
      <viewer-360
        ref={setRef as unknown as React.Ref<HTMLElement>}
        className={className}
        style={style as React.CSSProperties}
        frame={frame}
        speed={speed}
        rotation-direction={rotationDirection}
        dpr-cap={dprCap}
        min-scale={minScale}
        max-scale={maxScale}
        preload-count={preloadCount}
        concurrent-loads={concurrentLoads}
        {...(autoRotate ? { 'auto-rotate': '' } : {})}
        {...(initialResolution != null ? { 'initial-resolution': initialResolution } : {})}
        show-controls={boolAttr(showControls)}
        show-zoom-buttons={boolAttr(showZoomButtons)}
        show-fullscreen-button={boolAttr(showFullscreenButton)}
        show-loading-overlay={boolAttr(showLoadingOverlay)}
        show-mobile-hint={boolAttr(showMobileHint)}
      />
    );
  },
);

Viewer360.displayName = 'Viewer360';

export type { Viewer360ReactProps };
