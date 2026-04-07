import React from 'react';
import type { Viewer360ReactProps, Viewer360ElementInterface } from '../core/types';
import '../index';
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
export declare const Viewer360: React.ForwardRefExoticComponent<Viewer360ReactProps & React.RefAttributes<Viewer360ElementInterface>>;
export type { Viewer360ReactProps };
