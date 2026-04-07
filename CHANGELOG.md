# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-04-07

### Added
- `<viewer-360>` Web Component with Shadow DOM encapsulation
- Canvas-based 360° rendering with drag-to-rotate, pinch/scroll zoom, and pan
- `images` prop — array of frame image URLs for standard-resolution rotation
- `highResImages` prop — optional parallel array of high-res URLs, swapped in on zoom (lazy, per-frame)
- `initialResolution` prop — cap canvas dimensions during preload to reduce GPU memory usage
- `dprCap` prop — limit device pixel ratio for canvas sizing (default 2)
- `frame`, `autoRotate`, `speed`, `rotationDirection` — rotation configuration
- `zoomLevels`, `minScale`, `maxScale` — zoom configuration
- `showControls`, `showZoomButtons`, `showFullscreenButton`, `showLoadingOverlay`, `showMobileHint` — UI toggle props
- `preloadCount`, `concurrentLoads` — loading strategy props with network-aware auto-reduction
- Fullscreen support with iOS Safari CSS fallback
- Keyboard shortcuts (arrow keys, space, +/-, F, R)
- Double-tap / double-click zoom cycling
- Idle-time background loading for distant frames
- LRU cache for high-res frames (configurable size)
- React wrapper (`viewer-360/react`) — handles array props via ref, maps `onXxx` callback props to custom events
- Vue 3 wrapper (`viewer-360/vue`) — typed `defineComponent`, watched array props, exposed imperative API
- Angular wrapper (`viewer-360/angular`) — `@Input`/`@Output`/`@ViewChild` component + `NgModule` with `CUSTOM_ELEMENTS_SCHEMA`, shipped as TypeScript source
- Full TypeScript: `Viewer360ElementInterface`, `Viewer360EventMap`, `Viewer360Props`, `HTMLElementTagNameMap` augmentation
- Rollup build: ESM + UMD core bundles, ESM React/Vue wrappers
- Demo playground page at `https://usamakhangt4.github.io/viewer-360/demo/`

### Fixed
- Rotation controls hidden when zoomed in (pan mode)
- Play button no longer double-toggles (mousedown on shadow DOM buttons no longer interferes)
- Arrow rotation buttons disabled at zoom > 1×
- Touch interactions correctly distinguish pan from rotate when zoomed

[0.1.0]: https://github.com/usamakhangt4/viewer-360/releases/tag/v0.1.0
