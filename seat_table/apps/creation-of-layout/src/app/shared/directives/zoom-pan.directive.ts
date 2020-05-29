import { AfterViewInit, Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';
import { CommonService } from '../services/common.service';
import { MousePosition } from '../models/Venue';

@Directive({
  selector: '[appZoomPan]'
})
export class ZoomPanDirective implements AfterViewInit {
  @Output() zoomPanScale = new EventEmitter<number>();
  @Output() zoomScale = new EventEmitter<number>();

  private readonly maxZoomOut = 3000;
  private svgElement: SVGElement;
  private currentPosition = new MousePosition();
  private dragPan = false;
  private initialPosition = new MousePosition();
  zoomIntensity: number;
  originx: number;
  originy: number;
  visibleWidth: number;
  visibleHeight: number;
  scale: number;
  width: number;
  height: number;
  zoom = 1;
  dragx = 0;
  dragy = 0;
  traslatex = 0;
  translatey = 0;
  mainViewBox: HTMLElement;
  mainGroup: HTMLElement;
  constructor(private elementRef: ElementRef) {
  }

  ngAfterViewInit() {
    this.svgElement = this.elementRef.nativeElement;
    this.width = 1000;
    this.height = 1000;
    this.zoomIntensity = 0.000001;
    this.scale = 1;
    this.visibleWidth = this.width;
    this.visibleHeight = this.height;
    this.mainViewBox = document.getElementById('mainSvg');
    this.mainGroup = (this.svgElement as any).getElementById('shapeGroup');

  }

  // @HostListener('document:keydown', ['$event'])
  // handleKeyboardEvent(event: KeyboardEvent) {
  //   if (event.altKey) {
  //   } else {
  //   }
  // }

  @HostListener('mousewheel', ['$event'])
  mouseWheel(event: WheelEvent) {
    const maxScale = 4;
    const con = (this.svgElement as any).getElementById('shapeGroup');
    const wheel = event.deltaY < 0 ? 1 : -1;
    if ((event.deltaY < 0 ? this.zoom + Math.exp(wheel * this.zoomIntensity) : this.zoom - Math.exp(wheel * this.zoomIntensity)) > 0) {
      this.zoom = event.deltaY < 0 ? this.zoom + Math.exp(wheel * this.zoomIntensity) : this.zoom - Math.exp(wheel * this.zoomIntensity);
      if (this.zoom > 1) {
        con.setAttribute('transform', `translate(${this.originx}, ${this.originy})
      scale(${this.zoom}, ${this.zoom})
      translate(${-this.originx}, ${-this.originy})`);
        this.scale += wheel * this.zoomIntensity;
        this.scale = Math.max(1, Math.min(maxScale, this.scale));
        this.visibleWidth = this.width / this.scale;
        this.visibleHeight = this.height / this.scale;
        this.zoomPanScale.emit(this.zoom);
      } else {
        con.removeAttribute('transform');
      }
    }
    else {
      if (this.zoom >= -4) {
        this.zoom = event.deltaY < 0 ? this.zoom + Math.exp(wheel * this.zoomIntensity) : this.zoom - Math.exp(wheel * this.zoomIntensity);
      } else {
        this.zoom = event.deltaY < 0 ? this.zoom + Math.exp(wheel * this.zoomIntensity) : this.zoom;
      }
      if (this.zoom < 1) {
        const scaleZoom = 1 / Math.abs(this.zoom);
        con.setAttribute('transform', `translate(${this.originx}, ${this.originy})
      scale(${scaleZoom}, ${scaleZoom})
      translate(${-this.originx}, ${-this.originy})`);
        this.scale += wheel * this.zoomIntensity;
        this.scale = Math.max(1, Math.min(maxScale, this.scale));
        this.visibleWidth = this.width / this.scale;
        this.visibleHeight = this.height / this.scale;
        this.zoomPanScale.emit(this.zoom);
      }
      else {
        con.removeAttribute('transform');
      }

    }
  }

  @HostListener('mousedown', ['$event'])
  mouseDown(event) {
    this.currentPosition = CommonService.getMousePosition(this.mainGroup as any, event);
    this.dragPan = true;
    this.initialPosition = this.currentPosition;
    this.traslatex = this.dragx;
    this.translatey = this.dragy;
  }

  @HostListener('mousemove', ['$event'])
  mouseMove(event) {
    const con = (this.svgElement as any).getElementById('shapeGroup');
    const origin = CommonService.getMousePosition(this.mainGroup as any, event);
    this.originx = origin.x;
    this.originy = origin.y;
    this.currentPosition = CommonService.getMousePosition(this.mainGroup as any, event);
    if (this.dragPan && event.altKey && this.zoom > 1) {
      this.dragx = this.traslatex + (this.currentPosition.x - this.initialPosition.x);
      this.dragy = this.translatey + (this.currentPosition.y - this.initialPosition.y);
      con.setAttribute('transform', `translate(${this.originx}, ${this.originy})
      scale(${this.zoom}, ${this.zoom})
      translate(${-this.originx}, ${-this.originy}),translate(${this.dragx}, ${this.dragy})`);
    }
  }

  @HostListener('mouseup', ['$event'])
  mouseUp(event) {
    this.currentPosition = CommonService.getMousePosition(this.mainGroup as any, event);
    if (this.dragPan) {
      this.dragPan = false;
    }
  }
}
