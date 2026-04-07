import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import type {
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
 * Angular wrapper for the <viewer-360> Web Component.
 *
 * Add `Viewer360Module` (or `Viewer360Component`) to your NgModule/standalone
 * imports. The module already includes `CUSTOM_ELEMENTS_SCHEMA` so Angular
 * does not warn about unknown HTML elements.
 *
 * Array/object inputs (`images`, `highResImages`, `zoomLevels`) are set
 * imperatively on the underlying element via AfterViewInit / OnChanges since
 * Angular's attribute binding serialises them as strings.
 *
 * @example
 * ```html
 * <ng-viewer360
 *   [images]="frameUrls"
 *   [highResImages]="highResUrls"
 *   [autoRotate]="true"
 *   [speed]="80"
 *   (frameChange)="onFrameChange($event)"
 * ></ng-viewer360>
 * ```
 */
@Component({
  selector: 'ng-viewer360',
  template: `<viewer-360
    #viewerEl
    [attr.frame]="frame"
    [attr.speed]="speed"
    [attr.rotation-direction]="rotationDirection"
    [attr.dpr-cap]="dprCap"
    [attr.min-scale]="minScale"
    [attr.max-scale]="maxScale"
    [attr.preload-count]="preloadCount"
    [attr.concurrent-loads]="concurrentLoads"
    [attr.auto-rotate]="autoRotate ? '' : null"
    [attr.initial-resolution]="initialResolution ?? null"
    [attr.show-controls]="showControls ? '' : 'false'"
    [attr.show-zoom-buttons]="showZoomButtons ? '' : 'false'"
    [attr.show-fullscreen-button]="showFullscreenButton ? '' : 'false'"
    [attr.show-loading-overlay]="showLoadingOverlay ? '' : 'false'"
    [attr.show-mobile-hint]="showMobileHint ? '' : 'false'"
  ></viewer-360>`,
  styles: [':host { display: contents; }'],
})
export class Viewer360Component implements AfterViewInit, OnChanges, OnDestroy {
  // ── Inputs ──────────────────────────────────────────────────────────────────
  @Input() images: string[]        = [];
  @Input() highResImages?: string[];
  @Input() frame: number           = VIEWER_360_DEFAULTS.frame;
  @Input() autoRotate: boolean     = VIEWER_360_DEFAULTS.autoRotate;
  @Input() speed: number           = VIEWER_360_DEFAULTS.speed;
  @Input() rotationDirection: 'left' | 'right' = VIEWER_360_DEFAULTS.rotationDirection;
  @Input() initialResolution?: number;
  @Input() dprCap: number          = VIEWER_360_DEFAULTS.dprCap;
  @Input() zoomLevels: number[]    = [...VIEWER_360_DEFAULTS.zoomLevels];
  @Input() minScale: number        = VIEWER_360_DEFAULTS.minScale;
  @Input() maxScale: number        = VIEWER_360_DEFAULTS.maxScale;
  @Input() showControls: boolean   = VIEWER_360_DEFAULTS.showControls;
  @Input() showZoomButtons: boolean = VIEWER_360_DEFAULTS.showZoomButtons;
  @Input() showFullscreenButton: boolean = VIEWER_360_DEFAULTS.showFullscreenButton;
  @Input() showLoadingOverlay: boolean   = VIEWER_360_DEFAULTS.showLoadingOverlay;
  @Input() showMobileHint: boolean       = VIEWER_360_DEFAULTS.showMobileHint;
  @Input() preloadCount: number    = VIEWER_360_DEFAULTS.preloadCount;
  @Input() concurrentLoads: number = VIEWER_360_DEFAULTS.concurrentLoads;

  // ── Outputs ─────────────────────────────────────────────────────────────────
  @Output() ready            = new EventEmitter<void>();
  @Output() frameChange      = new EventEmitter<Viewer360FrameChangeDetail>();
  @Output() zoomChange       = new EventEmitter<Viewer360ZoomChangeDetail>();
  @Output() autoRotateChange = new EventEmitter<Viewer360AutoRotateChangeDetail>();
  @Output() close            = new EventEmitter<void>();
  @Output() error            = new EventEmitter<Viewer360ErrorDetail>();

  @ViewChild('viewerEl') private viewerElRef!: ElementRef<Viewer360ElementInterface>;

  private listeners: Array<[string, EventListener]> = [];

  // ── Lifecycle ────────────────────────────────────────────────────────────────
  ngAfterViewInit(): void {
    const el = this.viewerElRef.nativeElement;
    this.syncObjectProps(el);
    this.attachListeners(el);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.viewerElRef) return;
    const el = this.viewerElRef.nativeElement;
    if (changes['images'] || changes['highResImages'] || changes['zoomLevels']) {
      this.syncObjectProps(el);
    }
  }

  ngOnDestroy(): void {
    const el = this.viewerElRef?.nativeElement;
    if (el) {
      this.listeners.forEach(([type, fn]) => el.removeEventListener(type, fn));
    }
    this.listeners = [];
  }

  // ── Imperative API ───────────────────────────────────────────────────────────
  showFrame(frame: number): void    { this.viewerElRef?.nativeElement.showFrame(frame); }
  setZoom(level: number): void       { this.viewerElRef?.nativeElement.setZoom(level); }
  startAutoRotate(): void            { this.viewerElRef?.nativeElement.startAutoRotate(); }
  stopAutoRotate(): void             { this.viewerElRef?.nativeElement.stopAutoRotate(); }
  reset(): void                      { this.viewerElRef?.nativeElement.reset(); }

  // ── Private helpers ──────────────────────────────────────────────────────────
  private syncObjectProps(el: Viewer360ElementInterface): void {
    el.images     = this.images;
    el.zoomLevels = this.zoomLevels;
    if (this.highResImages) el.highResImages = this.highResImages;
  }

  private attachListeners(el: Viewer360ElementInterface): void {
    const on = (type: string, handler: EventListener) => {
      el.addEventListener(type, handler);
      this.listeners.push([type, handler]);
    };

    on('viewer360:ready',           ()  => this.ready.emit());
    on('viewer360:framechange',     (e) => this.frameChange.emit((e as CustomEvent<Viewer360FrameChangeDetail>).detail));
    on('viewer360:zoomchange',      (e) => this.zoomChange.emit((e as CustomEvent<Viewer360ZoomChangeDetail>).detail));
    on('viewer360:autorotatechange',(e) => this.autoRotateChange.emit((e as CustomEvent<Viewer360AutoRotateChangeDetail>).detail));
    on('viewer360:close',           ()  => this.close.emit());
    on('viewer360:error',           (e) => this.error.emit((e as CustomEvent<Viewer360ErrorDetail>).detail));
  }
}
