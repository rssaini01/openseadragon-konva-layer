import Konva from "konva";
import OpenSeadragon, { Viewer, Point } from "openseadragon";

export interface KonvaStageConfig {
  stageOptions?: Partial<Konva.StageConfig>;
}

export class KonvaLayer {
  private readonly _viewer: Viewer;
  private readonly _stage: Konva.Stage;
  private readonly _layer: Konva.Layer;
  private readonly _container: HTMLDivElement;
  private _resizeObserver?: ResizeObserver;

  constructor(
    viewer: Viewer,
    { stageOptions = {} }: KonvaStageConfig = {},
    id: number
  ) {
    this._viewer = viewer;

    // Create overlay div
    this._container = document.createElement("div");
    this._container.style.position = "absolute";
    this._container.style.top = "0";
    this._container.style.left = "0";
    this._container.style.width = "100%";
    this._container.style.height = "100%";
    this._container.style.pointerEvents = "none"; // Let OSD handle pan/zoom
    this._viewer.canvas.appendChild(this._container);

    this._stage = new Konva.Stage({
      container: this._container,
      width: this._container.clientWidth,
      height: this._container.clientHeight,
      ...stageOptions,
    });

    this._layer = new Konva.Layer();
    this._stage.add(this._layer);

    // Allow pointer events only on interactive Konva objects
    this._stage.on("mousedown touchstart", (e) => {
      // Only stop propagation if we're actually interacting with a shape
      const target = e.target;
      if (target !== this._stage) {
        e.evt.stopPropagation();
        this._container.style.pointerEvents = "auto";
      }
    });

    this._stage.on("mouseup touchend", (e) => {
      this._container.style.pointerEvents = "none";
    });

    // Bind viewer events - use more comprehensive event handling
    this._viewer.addHandler("animation", () => this._sync());
    this._viewer.addHandler("animation-finish", () => this._sync());
    this._viewer.addHandler("viewport-change", () => this._sync());
    this._viewer.addHandler("update-viewport", () => this._sync());
    this._viewer.addHandler("open", () => this._sync());
    this._viewer.addHandler("resize", () => this._sync());

    // Use ResizeObserver for better resize handling
    if (typeof ResizeObserver !== "undefined") {
      this._resizeObserver = new ResizeObserver(() => {
        this._sync();
      });
      this._resizeObserver.observe(this._viewer.container);
    } else {
      // Fallback for older browsers
      window.addEventListener("resize", () => this._sync());
    }

    // Initial sync
    this._sync();
  }

  private _sync() {
    if (!this._viewer.viewport || !this._viewer.isOpen()) {
      return;
    }

    const containerWidth = this._viewer.container.clientWidth;
    const containerHeight = this._viewer.container.clientHeight;

    // Update stage size
    this._stage.width(containerWidth);
    this._stage.height(containerHeight);

    // Get viewport bounds in normalized coordinates (0-1)
    const viewportBounds = this._viewer.viewport.getBounds();
    const zoom = this._viewer.viewport.getZoom();

    // Work in image pixel coordinates for easier shape positioning
    const tiledImage = this._viewer.world.getItemAt(0);
    if (!tiledImage) return;

    const imageSize = tiledImage.getContentSize();

    // Calculate scale: pixels per image pixel
    const imageToViewportScale = 1 / imageSize.x; // 1 image pixel = this many viewport units
    const viewportToPixelScale = containerWidth * zoom; // 1 viewport unit = this many screen pixels
    const imagePixelToScreenPixel = imageToViewportScale * viewportToPixelScale;

    // Calculate position offset
    const imageTopLeftInViewport = new Point(0, 0);
    const viewportTopLeft = new Point(viewportBounds.x, viewportBounds.y);

    const offsetX = (imageTopLeftInViewport.x - viewportTopLeft.x) * viewportToPixelScale;
    const offsetY = (imageTopLeftInViewport.y - viewportTopLeft.y) * viewportToPixelScale;

    // Apply transformation - now Konva coordinates are in image pixels
    this._stage.scale({ x: imagePixelToScreenPixel, y: imagePixelToScreenPixel });
    this._stage.position({ x: offsetX, y: offsetY });

    this._stage.batchDraw();
  }

  public getLayer(): Konva.Layer {
    return this._layer;
  }

  public getStage(): Konva.Stage {
    return this._stage;
  }

  public clearLayer(): void {
    this._layer.destroyChildren();
    this._layer.draw();
  }

  public destroy(): void {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }
    this._stage.destroy();
    this._container.remove();
  }

  // Helper method to convert image pixel coordinates to current Konva stage coordinates
  public imagePixelToStage(imagePoint: Point): Point {
    const tiledImage = this._viewer.world.getItemAt(0);
    if (!tiledImage) return imagePoint;

    // Image coordinates are already in the right system after our transform
    return imagePoint;
  }

  // Helper method to convert Konva stage coordinates to image pixel coordinates
  public stageToImagePixel(stagePoint: Point): Point {
    const tiledImage = this._viewer.world.getItemAt(0);
    if (!tiledImage) return stagePoint;

    // Stage coordinates are already in image pixel system after our transform
    return stagePoint;
  }

  // Helper method to convert viewport coordinates (0-1) to image pixels
  public viewportToImagePixel(viewportPoint: Point): Point {
    const tiledImage = this._viewer.world.getItemAt(0);
    if (!tiledImage) return viewportPoint;

    const imageSize = tiledImage.getContentSize();
    return new Point(
      viewportPoint.x * imageSize.x,
      viewportPoint.y * imageSize.y
    );
  }

  // Helper method to convert image pixels to viewport coordinates (0-1)
  public imagePixelToViewport(imagePixelPoint: Point): Point {
    const tiledImage = this._viewer.world.getItemAt(0);
    if (!tiledImage) return imagePixelPoint;

    const imageSize = tiledImage.getContentSize();
    return new Point(
      imagePixelPoint.x / imageSize.x,
      imagePixelPoint.y / imageSize.y
    );
  }
}