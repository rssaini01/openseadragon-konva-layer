import OpenSeadragon from "openseadragon";
import { createOSDKonvaLayer, KonvaLayer } from "openseadragon-konva-layer";
import Konva from "konva"; // use build output

const viewer = OpenSeadragon({
  id: "osd-viewer",
  prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
  tileSources: "https://openseadragon.github.io/example-images/duomo/duomo.dzi",
});

viewer.addHandler("open", () => {
  const overlay: KonvaLayer = createOSDKonvaLayer(viewer, {}, "1");
  const layer = overlay.getLayer();

  const circle = new Konva.Circle({
    x: 5000,
    y: 5000,
    radius: 150,
    fill: "rgba(255,0,0,0.6)",
    stroke: "black",
    strokeWidth: 3,
  });

  const rect = new Konva.Rect({
    x: 7000,
    y: 3000,
    width: 1200,
    height: 800,
    fill: "rgba(0,0,255,0.4)",
    stroke: "black",
    strokeWidth: 2,
  });

  layer.add(circle);
  layer.add(rect);
  layer.draw();

  layer.on("click", (e) => {
    if (e.target) {
      alert(`Clicked on shape: ${e.target.className}`);
    }
  });
});
