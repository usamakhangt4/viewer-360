/** Shadow DOM inner HTML. IDs are scoped to the shadow root. */
export const TEMPLATE = /* html */ `
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
