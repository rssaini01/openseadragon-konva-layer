import OpenSeadragon from "openseadragon";
import { KonvaLayer } from "../src/konva-layer";
import Konva from "konva"; // use build output

// 1️⃣ Initialize OSD viewer
const viewer = OpenSeadragon({
  id: "osd-viewer",
  prefixUrl: "https://openseadragon.github.io/openseadragon/images/",
  tileSources: "https://openseadragon.github.io/example-images/duomo/duomo.dzi",
});

// 2️⃣ Wait until the image opens
viewer.addHandler("open", () => {
  // 3️⃣ Create Konva overlay
  const overlay = new KonvaLayer(viewer, {}, 1);
  const layer = overlay.getLayer();

  // 4️⃣ Add some demo shapes
  const circle = new Konva.Circle({
    x: 500,
    y: 500,
    radius: 50,
    fill: "rgba(255,0,0,0.6)",
    stroke: "black",
    strokeWidth: 3,
  });

  const rect = new Konva.Rect({
    x: 700,
    y: 300,
    width: 120,
    height: 80,
    fill: "rgba(0,0,255,0.4)",
    stroke: "black",
    strokeWidth: 2,
  });

  layer.add(circle);
  layer.add(rect);
  layer.draw();

  // 5️⃣ Optional: Click handler
  layer.on("click", (e) => {
    if (e.target) {
      alert(`Clicked on shape: ${e.target.className}`);
    }
  });
});
