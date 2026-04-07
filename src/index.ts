import { Viewer360Element } from './core/Viewer360Element';

// Register the custom element (safe to call multiple times — checks first)
if (!customElements.get('viewer-360')) {
  customElements.define('viewer-360', Viewer360Element);
}

export { Viewer360Element };
export type {
  Viewer360Props,
  Viewer360EventMap,
  Viewer360ElementInterface,
  Viewer360ReactProps,
  Viewer360VueProps,
  Viewer360FrameChangeDetail,
  Viewer360ZoomChangeDetail,
  Viewer360AutoRotateChangeDetail,
  Viewer360ErrorDetail,
  Viewer360ReadyDetail,
  Viewer360CloseDetail,
} from './core/types';
export { VIEWER_360_DEFAULTS } from './core/types';
