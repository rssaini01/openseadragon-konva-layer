import Konva from "konva";
import OpenSeadragon, { Viewer, Point } from "openseadragon";

export interface KonvaOverlayConfig {
  // Any Konva.Stage config you want to allow
  stageOptions?: Partial<Konva.StageConfig>;
}

export class KonvaOverlay {
  private readonly _viewer: Viewer;
  private readonly _stage: Konva.Stage;
  private readonly _layer: Konva.Layer;
  private readonly _container: HTMLDivElement;

  private _containerWidth: number;
  private _containerHeight: number;

  constructor(
    viewer: Viewer,
    { stageOptions = {} }: KonvaOverlayConfig = {},
    id: number
  ) {
    this._viewer = viewer;

    this._containerWidth = 0;
    this._containerHeight = 0;

    // Create overlay div
    this._container = document.createElement("div");
    this._container.style.position = "absolute";
    this._container.style.top = "0";
    this._container.style.left = "0";
    this._container.style.width = "100%";
    this._container.style.height = "100%";
    this._viewer.canvas.appendChild(this._container);

    this._stage = new Konva.Stage({
      container: this._container,
      width: this._container.clientWidth,
      height: this._container.clientHeight,
      ...stageOptions,
    });

    this._layer = new Konva.Layer();
    this._stage.add(this._layer);

    // Prevent OSD from handling Konva mouse events
    this._stage.on("mousedown touchstart", (e) => {
      e.evt.stopPropagation();
    });
    this._stage.on("mouseup touchend", (e) => {
      e.evt.stopPropagation();
    });

    // Bind viewer events
    this._viewer.addHandler("update-viewport", () => this._sync());
    this._viewer.addHandler("open", () => this._sync());
    window.addEventListener("resize", () => this._sync());

    // Initial sync
    this._sync();
  }

  private _sync() {
    const viewportZoom = this._viewer.viewport.getZoom(true);
    const viewportBounds = this._viewer.viewport.getBounds(true);

    const width = this._viewer.container.clientWidth;
    const height = this._viewer.container.clientHeight;

    this._stage.width(width);
    this._stage.height(height);

    // Scale stage by viewport zoom
    this._stage.scale({ x: viewportZoom, y: viewportZoom });

    // Pan stage according to OSD viewport
    const origin = new Point(0, 0);
    const viewportWindow = this._viewer.viewport.viewportToWindowCoordinates(origin);

    const rect = this._container.getBoundingClientRect();
    const pageScroll = OpenSeadragon.getPageScroll();

    this._stage.position({
      x: rect.left - viewportWindow.x + pageScroll.x,
      y: rect.top - viewportWindow.y + pageScroll.y,
    });

    this._stage.batchDraw();
  }

  public getLayer(): Konva.Layer {
    return this._layer;
  }

  public clearLayer(): void {
    this._layer.destroyChildren();
    this._layer.draw();
  }
}
