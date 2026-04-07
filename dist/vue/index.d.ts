import { type PropType } from 'vue';
import type { Viewer360VueProps, Viewer360FrameChangeDetail, Viewer360ZoomChangeDetail, Viewer360AutoRotateChangeDetail, Viewer360ErrorDetail } from '../core/types';
import '../index';
/**
 * Vue 3 wrapper for the <viewer-360> Web Component.
 *
 * Array/object props (`images`, `highResImages`, `zoomLevels`) are watched and
 * set imperatively on the element since HTML attributes can only hold strings.
 * Custom events are forwarded as Vue emits (`frameChange`, `zoomChange`, etc.).
 *
 * @example
 * ```vue
 * <Viewer360
 *   :images="frameUrls"
 *   :high-res-images="highResUrls"
 *   auto-rotate
 *   :speed="80"
 *   @frame-change="onFrameChange"
 * />
 * ```
 */
export declare const Viewer360: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    images: {
        type: PropType<string[]>;
        required: true;
    };
    highResImages: {
        type: PropType<string[]>;
        default: undefined;
    };
    frame: {
        type: NumberConstructor;
        default: number;
    };
    autoRotate: {
        type: BooleanConstructor;
        default: false;
    };
    speed: {
        type: NumberConstructor;
        default: number;
    };
    rotationDirection: {
        type: PropType<"left" | "right">;
        default: "right";
    };
    initialResolution: {
        type: NumberConstructor;
        default: undefined;
    };
    dprCap: {
        type: NumberConstructor;
        default: number;
    };
    zoomLevels: {
        type: PropType<number[]>;
        default: () => number[];
    };
    minScale: {
        type: NumberConstructor;
        default: number;
    };
    maxScale: {
        type: NumberConstructor;
        default: number;
    };
    showControls: {
        type: BooleanConstructor;
        default: true;
    };
    showZoomButtons: {
        type: BooleanConstructor;
        default: true;
    };
    showFullscreenButton: {
        type: BooleanConstructor;
        default: true;
    };
    showLoadingOverlay: {
        type: BooleanConstructor;
        default: true;
    };
    showMobileHint: {
        type: BooleanConstructor;
        default: true;
    };
    preloadCount: {
        type: NumberConstructor;
        default: number;
    };
    concurrentLoads: {
        type: NumberConstructor;
        default: number;
    };
}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    ready: (_payload: void) => true;
    frameChange: (_detail: Viewer360FrameChangeDetail) => true;
    zoomChange: (_detail: Viewer360ZoomChangeDetail) => true;
    autoRotateChange: (_detail: Viewer360AutoRotateChangeDetail) => true;
    close: (_payload: void) => true;
    error: (_detail: Viewer360ErrorDetail) => true;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    images: {
        type: PropType<string[]>;
        required: true;
    };
    highResImages: {
        type: PropType<string[]>;
        default: undefined;
    };
    frame: {
        type: NumberConstructor;
        default: number;
    };
    autoRotate: {
        type: BooleanConstructor;
        default: false;
    };
    speed: {
        type: NumberConstructor;
        default: number;
    };
    rotationDirection: {
        type: PropType<"left" | "right">;
        default: "right";
    };
    initialResolution: {
        type: NumberConstructor;
        default: undefined;
    };
    dprCap: {
        type: NumberConstructor;
        default: number;
    };
    zoomLevels: {
        type: PropType<number[]>;
        default: () => number[];
    };
    minScale: {
        type: NumberConstructor;
        default: number;
    };
    maxScale: {
        type: NumberConstructor;
        default: number;
    };
    showControls: {
        type: BooleanConstructor;
        default: true;
    };
    showZoomButtons: {
        type: BooleanConstructor;
        default: true;
    };
    showFullscreenButton: {
        type: BooleanConstructor;
        default: true;
    };
    showLoadingOverlay: {
        type: BooleanConstructor;
        default: true;
    };
    showMobileHint: {
        type: BooleanConstructor;
        default: true;
    };
    preloadCount: {
        type: NumberConstructor;
        default: number;
    };
    concurrentLoads: {
        type: NumberConstructor;
        default: number;
    };
}>> & Readonly<{
    onClose?: ((_payload?: void | undefined) => any) | undefined;
    onError?: ((_detail: Viewer360ErrorDetail) => any) | undefined;
    onReady?: ((_payload?: void | undefined) => any) | undefined;
    onFrameChange?: ((_detail: Viewer360FrameChangeDetail) => any) | undefined;
    onZoomChange?: ((_detail: Viewer360ZoomChangeDetail) => any) | undefined;
    onAutoRotateChange?: ((_detail: Viewer360AutoRotateChangeDetail) => any) | undefined;
}>, {
    highResImages: string[];
    initialResolution: number;
    dprCap: number;
    frame: number;
    autoRotate: boolean;
    speed: number;
    rotationDirection: "left" | "right";
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
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export type { Viewer360VueProps };
