import {
  defineComponent,
  ref,
  watch,
  onMounted,
  onUnmounted,
  h,
  type PropType,
} from 'vue';
import type {
  Viewer360VueProps,
  Viewer360ElementInterface,
  Viewer360FrameChangeDetail,
  Viewer360ZoomChangeDetail,
  Viewer360AutoRotateChangeDetail,
  Viewer360ErrorDetail,
} from '../core/types';
import { VIEWER_360_DEFAULTS } from '../core/types';
// Registers the custom element
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
export const Viewer360 = defineComponent({
  name: 'Viewer360',

  props: {
    images:          { type: Array  as PropType<string[]>,  required: true },
    highResImages:   { type: Array  as PropType<string[]>,  default: undefined },
    frame:           { type: Number,                        default: VIEWER_360_DEFAULTS.frame },
    autoRotate:      { type: Boolean,                       default: VIEWER_360_DEFAULTS.autoRotate },
    speed:           { type: Number,                        default: VIEWER_360_DEFAULTS.speed },
    rotationDirection: { type: String as PropType<'left' | 'right'>, default: VIEWER_360_DEFAULTS.rotationDirection },
    initialResolution: { type: Number,                      default: undefined },
    dprCap:          { type: Number,                        default: VIEWER_360_DEFAULTS.dprCap },
    zoomLevels:      { type: Array  as PropType<number[]>,  default: () => [...VIEWER_360_DEFAULTS.zoomLevels] },
    minScale:        { type: Number,                        default: VIEWER_360_DEFAULTS.minScale },
    maxScale:        { type: Number,                        default: VIEWER_360_DEFAULTS.maxScale },
    showControls:    { type: Boolean,                       default: VIEWER_360_DEFAULTS.showControls },
    showZoomButtons: { type: Boolean,                       default: VIEWER_360_DEFAULTS.showZoomButtons },
    showFullscreenButton: { type: Boolean,                  default: VIEWER_360_DEFAULTS.showFullscreenButton },
    showLoadingOverlay:   { type: Boolean,                  default: VIEWER_360_DEFAULTS.showLoadingOverlay },
    showMobileHint:  { type: Boolean,                       default: VIEWER_360_DEFAULTS.showMobileHint },
    preloadCount:    { type: Number,                        default: VIEWER_360_DEFAULTS.preloadCount },
    concurrentLoads: { type: Number,                        default: VIEWER_360_DEFAULTS.concurrentLoads },
  },

  emits: {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    ready:            (_payload: void) => true,
    frameChange:      (_detail: Viewer360FrameChangeDetail) => true,
    zoomChange:       (_detail: Viewer360ZoomChangeDetail) => true,
    autoRotateChange: (_detail: Viewer360AutoRotateChangeDetail) => true,
    close:            (_payload: void) => true,
    error:            (_detail: Viewer360ErrorDetail) => true,
    /* eslint-enable @typescript-eslint/no-unused-vars */
  },

  setup(props, { emit, expose }) {
    const elRef = ref<Viewer360ElementInterface | null>(null);
    const listeners: Array<[string, EventListener]> = [];

    // ── Sync array/object props to the element property (not attribute) ──────
    const syncArrayProps = (el: Viewer360ElementInterface) => {
      el.images = props.images;
      if (props.highResImages) el.highResImages = props.highResImages;
      el.zoomLevels = props.zoomLevels;
    };

    watch(() => props.images,        () => { if (elRef.value) elRef.value.images = props.images; },        { deep: true });
    watch(() => props.highResImages, () => { if (elRef.value && props.highResImages) elRef.value.highResImages = props.highResImages; }, { deep: true });
    watch(() => props.zoomLevels,    () => { if (elRef.value) elRef.value.zoomLevels = props.zoomLevels; }, { deep: true });

    // ── Lifecycle ─────────────────────────────────────────────────────────────
    onMounted(() => {
      const el = elRef.value;
      if (!el) return;
      syncArrayProps(el);

      const on = (type: string, handler: EventListener) => {
        el.addEventListener(type, handler);
        listeners.push([type, handler]);
      };

      on('viewer360:ready',           ()  => emit('ready'));
      on('viewer360:framechange',     (e) => emit('frameChange',      (e as CustomEvent<Viewer360FrameChangeDetail>).detail));
      on('viewer360:zoomchange',      (e) => emit('zoomChange',       (e as CustomEvent<Viewer360ZoomChangeDetail>).detail));
      on('viewer360:autorotatechange',(e) => emit('autoRotateChange', (e as CustomEvent<Viewer360AutoRotateChangeDetail>).detail));
      on('viewer360:close',           ()  => emit('close'));
      on('viewer360:error',           (e) => emit('error',            (e as CustomEvent<Viewer360ErrorDetail>).detail));
    });

    onUnmounted(() => {
      const el = elRef.value;
      if (el) listeners.forEach(([type, fn]) => el.removeEventListener(type, fn));
    });

    // ── Expose imperative API ─────────────────────────────────────────────────
    expose({
      showFrame:      (f: number)    => elRef.value?.showFrame(f),
      setZoom:        (level: number) => elRef.value?.setZoom(level),
      startAutoRotate: ()             => elRef.value?.startAutoRotate(),
      stopAutoRotate:  ()             => elRef.value?.stopAutoRotate(),
      reset:           ()             => elRef.value?.reset(),
    });

    // ── Render ────────────────────────────────────────────────────────────────
    return () => {
      const boolAttr = (val: boolean) => (val ? '' : 'false');

      return h('viewer-360', {
        ref: elRef,
        frame:              props.frame,
        speed:              props.speed,
        'rotation-direction': props.rotationDirection,
        'dpr-cap':          props.dprCap,
        'min-scale':        props.minScale,
        'max-scale':        props.maxScale,
        'preload-count':    props.preloadCount,
        'concurrent-loads': props.concurrentLoads,
        'show-controls':    boolAttr(props.showControls),
        'show-zoom-buttons':     boolAttr(props.showZoomButtons),
        'show-fullscreen-button': boolAttr(props.showFullscreenButton),
        'show-loading-overlay':   boolAttr(props.showLoadingOverlay),
        'show-mobile-hint':       boolAttr(props.showMobileHint),
        ...(props.autoRotate ? { 'auto-rotate': '' } : {}),
        ...(props.initialResolution != null ? { 'initial-resolution': props.initialResolution } : {}),
      });
    };
  },
});

export type { Viewer360VueProps };
