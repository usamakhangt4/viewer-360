# viewer-360

[![npm](https://img.shields.io/npm/v/@usamakhangt4/viewer-360)](https://www.npmjs.com/package/@usamakhangt4/viewer-360)
[![license](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)
[![demo](https://img.shields.io/badge/demo-live-6c5ce7)](https://usamakhangt4.github.io/viewer-360/demo/)

A framework-agnostic 360° product viewer [Web Component](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) with first-class TypeScript support and ready-made wrappers for React, Vue 3, and Angular.

**[Try the live playground →](https://usamakhangt4.github.io/viewer-360/demo/)**

## Features

- Canvas-based rendering with drag-to-rotate, pinch/scroll zoom, and pan
- High-resolution image swap-in on zoom (pass a parallel `highResImages` array)
- Smart preloading: key frames + nearby frames first, idle-time background loading for the rest
- Network-aware: automatically reduces concurrency on slow / save-data connections
- Fullscreen support with iOS Safari fallback
- Keyboard shortcuts, touch double-tap zoom, mobile swipe hint
- Fully themeable via CSS custom properties (pierce Shadow DOM boundary)
- All props have sensible defaults — only `images` is required

---

## Installation

```bash
npm install @usamakhangt4/viewer-360
```

---

## Usage

### Vanilla JS / HTML

```html
<!-- Auto-registers <viewer-360> as a side effect -->
<script type="module" src="node_modules/@usamakhangt4/viewer-360/dist/viewer-360.esm.js"></script>

<!-- Or via CDN -->
<script type="module" src="https://unpkg.com/@usamakhangt4/viewer-360/dist/viewer-360.esm.js"></script>

<viewer-360 id="my-viewer" style="width:100%;height:500px;"></viewer-360>

<script type="module">
  const viewer = document.getElementById('my-viewer');

  viewer.images = [
    '/frames/001.webp',
    '/frames/002.webp',
    // ...
  ];

  // Optional high-res images (same length as images)
  viewer.highResImages = [
    '/frames-hires/001.webp',
    '/frames-hires/002.webp',
    // ...
  ];

  viewer.addEventListener('viewer360:framechange', (e) => {
    console.log('Frame:', e.detail.frame);
  });
</script>
```

### TypeScript

```ts
import '@usamakhangt4/viewer-360';
import type { Viewer360ElementInterface } from '@usamakhangt4/viewer-360';

const viewer = document.querySelector('viewer-360') as Viewer360ElementInterface;
viewer.images = frames;
viewer.autoRotate = true;
```

### React

```tsx
import { Viewer360 } from '@usamakhangt4/viewer-360/react';

function ProductPage() {
  return (
    <div style={{ width: '100%', height: 500 }}>
      <Viewer360
        images={frameUrls}
        highResImages={highResUrls}
        autoRotate
        speed={80}
        rotationDirection="right"
        zoomLevels={[1, 2, 4]}
        showControls={true}
        onReady={() => console.log('ready')}
        onFrameChange={({ frame }) => console.log(frame)}
        onZoomChange={({ level }) => console.log(level)}
      />
    </div>
  );
}
```

### Vue 3

```vue
<script setup lang="ts">
import { Viewer360 } from '@usamakhangt4/viewer-360/vue';
const frames = ref<string[]>([...]);
</script>

<template>
  <div style="width: 100%; height: 500px">
    <Viewer360
      :images="frames"
      :auto-rotate="true"
      :speed="80"
      @frame-change="onFrameChange"
      @zoom-change="onZoomChange"
    />
  </div>
</template>
```

### Angular

Add the module to your `NgModule`:

```ts
import { Viewer360Module } from '@usamakhangt4/viewer-360/angular';

@NgModule({
  imports: [Viewer360Module],
})
export class AppModule {}
```

Use in templates:

```html
<div style="width: 100%; height: 500px">
  <ng-viewer360
    [images]="frameUrls"
    [highResImages]="highResUrls"
    [autoRotate]="true"
    [speed]="80"
    (frameChange)="onFrameChange($event)"
    (zoomChange)="onZoomChange($event)"
  ></ng-viewer360>
</div>
```

> **Note:** Angular consumers must add `"experimentalDecorators": true` to their `tsconfig.json`.

---

## Props / Attributes

All props can be set as HTML attributes (kebab-case strings) or JavaScript properties (camelCase values).

### Image inputs

| Prop | Attribute | Type | Default | Description |
|------|-----------|------|---------|-------------|
| `images` | `images` | `string[]` | **required** | Frame image URLs in rotation order |
| `highResImages` | `high-res-images` | `string[]` | `undefined` | Parallel high-res URLs; swapped in on zoom |

### Rendering

| Prop | Attribute | Type | Default | Description |
|------|-----------|------|---------|-------------|
| `initialResolution` | `initial-resolution` | `number` | `undefined` | Cap canvas dimensions during preload (px) |
| `dprCap` | `dpr-cap` | `number` | `2` | Max device pixel ratio for canvas sizing |

### Rotation

| Prop | Attribute | Type | Default | Description |
|------|-----------|------|---------|-------------|
| `frame` | `frame` | `number` | `1` | Starting frame (1-based) |
| `autoRotate` | `auto-rotate` | `boolean` | `false` | Start rotating on load |
| `speed` | `speed` | `number` | `100` | Ms between frames during auto-rotation |
| `rotationDirection` | `rotation-direction` | `'left' \| 'right'` | `'right'` | Auto-rotate direction |

### Zoom

| Prop | Attribute | Type | Default | Description |
|------|-----------|------|---------|-------------|
| `zoomLevels` | `zoom-levels` | `number[]` | `[1, 2, 4]` | Discrete zoom steps (button / double-tap) |
| `minScale` | `min-scale` | `number` | `1` | Floor for pinch zoom |
| `maxScale` | `max-scale` | `number` | `4` | Ceiling for pinch zoom |

### UI toggles

| Prop | Attribute | Type | Default | Description |
|------|-----------|------|---------|-------------|
| `showControls` | `show-controls` | `boolean` | `true` | Bottom rotation / play-pause bar |
| `showZoomButtons` | `show-zoom-buttons` | `boolean` | `true` | Zoom in/out buttons |
| `showFullscreenButton` | `show-fullscreen-button` | `boolean` | `true` | Fullscreen toggle |
| `showLoadingOverlay` | `show-loading-overlay` | `boolean` | `true` | Loading spinner and progress |
| `showMobileHint` | `show-mobile-hint` | `boolean` | `true` | Swipe/pinch hint on first touch |

### Loading strategy

| Prop | Attribute | Type | Default | Description |
|------|-----------|------|---------|-------------|
| `preloadCount` | `preload-count` | `number` | `8` | Eager-load radius around the starting frame |
| `concurrentLoads` | `concurrent-loads` | `number` | `4` | Max parallel image requests |

---

## Events

| Event | Detail type | Description |
|-------|-------------|-------------|
| `viewer360:ready` | `{}` | Viewer is interactive, first frame rendered |
| `viewer360:framechange` | `{ frame: number }` | Displayed frame changed |
| `viewer360:zoomchange` | `{ level: number }` | Zoom level changed |
| `viewer360:autorotatechange` | `{ enabled: boolean }` | Auto-rotation toggled |
| `viewer360:close` | `{}` | Close button pressed (outside fullscreen) |
| `viewer360:error` | `{ message: string }` | Non-recoverable error (e.g. failed image load) |

```ts
import type { Viewer360EventMap } from '@usamakhangt4/viewer-360';

viewer.addEventListener('viewer360:framechange', (e) => {
  // e.detail is typed as { frame: number }
  console.log(e.detail.frame);
});
```

---

## Imperative methods

```ts
const viewer = document.querySelector('viewer-360');

viewer.showFrame(6);        // Jump to frame 6
viewer.setZoom(2);          // Set zoom to 2×
viewer.startAutoRotate();   // Start rotating
viewer.stopAutoRotate();    // Stop rotating
viewer.reset();             // Zoom 1×, frame 1, stop rotation
```

---

## Theming

All visual properties are CSS custom properties declared on `:host`. Override them on `viewer-360` or any ancestor — they pierce the Shadow DOM boundary.

```css
viewer-360 {
  --viewer-color-accent: #e74c3c;     /* spinner and progress bar colour */
  --viewer-color-bg: #f0f0f0;         /* container background */
  --viewer-color-text: #111111;       /* control bar text */
  --viewer-control-size: 44px;        /* button size */
  --viewer-icon-size: 20px;           /* SVG icon size */
  --viewer-duration-base: 0.4s;       /* transition speed */
  --viewer-radius-pill: 24px;         /* control bar border radius */

  /* FAB buttons (zoom, fullscreen) */
  --fab-color: #ffffff;
  --fab-bg-color: rgba(0,0,0,0.4);
  --fab-bg-color-hover: rgba(0,0,0,0.6);

  /* Top loading progress bar */
  --progress-bar-color: #e74c3c;
  --progress-bar-height: 3px;

  /* Loading spinner/progress */
  --viewer-color-spinner-track: #dddddd;
}
```

Full list of available variables can be found in `src/core/styles.ts`.

---

## Keyboard shortcuts

| Key | Action |
|-----|--------|
| `←` | Rotate right (one frame) |
| `→` | Rotate left (one frame) |
| `Space` | Toggle auto-rotation |
| `+` | Zoom in one step |
| `-` | Zoom out one step |
| `F` | Toggle fullscreen |
| `R` | Reset (zoom 1×, frame 1) |

Shortcuts are disabled when focus is inside a form element.

---

## Browser support

Any browser that supports [Custom Elements v1](https://caniuse.com/?search=custom-elementsv1) and [Shadow DOM v1](https://caniuse.com/?search=shadowdomv1):

- Chrome / Edge 67+
- Firefox 63+
- Safari 12.1+

---

## License

MIT — see [LICENSE](./LICENSE) for details.
