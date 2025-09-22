# openseadragon-konva-layer

[![npm version](https://img.shields.io/npm/v/openseadragon-konva-layer.svg)](https://www.npmjs.com/package/openseadragon-konva-layer)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/rssaini01/openseadragon-konva-layer/deploy-demo-site.yml?branch=main)](https://github.com/rssaini01/openseadragon-konva-layer/actions)
[![Downloads](https://img.shields.io/npm/dm/openseadragon-konva-layer.svg)](https://www.npmjs.com/package/openseadragon-konva-layer)

A TypeScript/ESM plugin that overlays **Konva.js** on top of **OpenSeadragon**, enabling smooth, zoom- and pan-synced vector drawing and annotation in _image-pixel coordinates_.

---

## Features

- Overlay a Konva canvas on top of an OpenSeadragon viewer
- Keeps vector graphics/annotations in sync with zoom and pan
- Works in **image pixel coordinates** (not screen pixels)
- Written in TypeScript & distributed as an ESM package

---

## Installation

```shell
npm install openseadragon-konva-layer
```

You’ll also need **OpenSeadragon** and **Konva**:

```shell
npm install openseadragon konva
```

---

## Quick Start

```typescript
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
});
```

---

## API

### `createOSDKonvaLayer(viewer, options?, id?)`

Creates and attaches a Konva overlay to an OpenSeadragon viewer.

Returns a `KonvaLayer` instance.

### `KonvaLayer`

Wrapper around a Konva `Layer` that stays synced with the OSD viewport.

| Method       | Description                                  |
| ------------ | -------------------------------------------- |
| `getLayer()` | Returns the underlying Konva `Layer`         |
| `destroy()`  | Removes the overlay from the viewer          |
| `resize()`   | Resizes the Konva stage to match viewer size |

---

## Development

```bash
git clone https://github.com/rssaini01/openseadragon-konva-layer.git
cd openseadragon-konva-layer
npm install
npm run build
```

---

## Contributing

Contributions are welcome!
Please open an issue or submit a PR if you’d like to add features, fix bugs, or improve documentation.

---

## Demo

OpenSeadragon and Konva Layer demo can be [found here.](https://rssaini01.github.io/openseadragon-konva-layer/)

---

## License

[MIT](./LICENSE)
