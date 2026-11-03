import { describe, test } from "node:test";
import assert from "node:assert/strict";
import {
  chipSize,
  clipToBox,
  edgeAxis,
  edgeSegment,
  fitLayout,
  layoutFlow,
  NARROW_METRICS,
  placeChip,
  placeChipCentered,
  pointAlong,
  WIDE_METRICS,
} from "./geometry.ts";
import type { FlowActor } from "./types.ts";

const row: readonly FlowActor[] = [
  { id: "a", label: "A", kind: "client", col: 0, row: 0 },
  { id: "b", label: "B", kind: "server", col: 1, row: 0 },
  { id: "c", label: "C", kind: "database", col: 2, row: 0 },
];

describe("layoutFlow", () => {
  test("wide places actors on the grid and sizes the canvas to fit", () => {
    const { cellW, boxW, boxH, padX, padTop, padBottom } = WIDE_METRICS;
    const layout = layoutFlow(row, "wide");
    const contentW = 2 * cellW + boxW;
    assert.equal(layout.width, contentW + 2 * padX);
    assert.equal(layout.height, padTop + boxH + padBottom);
    assert.deepEqual(layout.placements.a, { x: padX + boxW / 2, y: padTop + boxH / 2 });
    assert.equal(layout.placements.c.x - layout.placements.b.x, cellW);
  });

  test("narrow transposes the grid so a row becomes a column", () => {
    const layout = layoutFlow(row, "narrow");
    const xs = new Set(Object.values(layout.placements).map((p) => p.x));
    assert.equal(xs.size, 1);
    assert.equal(layout.placements.b.y - layout.placements.a.y, NARROW_METRICS.cellH);
  });

  test("narrow keeps a minimum width and centers the column", () => {
    const layout = layoutFlow(row, "narrow");
    assert.equal(layout.width, NARROW_METRICS.minWidth);
    assert.equal(layout.placements.a.x, NARROW_METRICS.minWidth / 2);
  });
});

describe("clipToBox", () => {
  const center = { x: 0, y: 0 };

  test("exits through the side, the top, or whichever comes first", () => {
    assert.deepEqual(clipToBox(center, { x: 100, y: 0 }, 75, 32), { x: 75, y: 0 });
    assert.deepEqual(clipToBox(center, { x: 0, y: 100 }, 75, 32), { x: 0, y: 32 });
    assert.deepEqual(clipToBox(center, { x: 100, y: 100 }, 75, 32), { x: 32, y: 32 });
  });

  test("returns the center when the target is the center", () => {
    assert.deepEqual(clipToBox(center, center, 75, 32), center);
  });
});

describe("edgeSegment", () => {
  const a = { x: 0, y: 0 };
  const b = { x: 200, y: 0 };
  const box = { halfW: 50, halfH: 20 };

  test("runs border to border in its own lane", () => {
    const seg = edgeSegment(a, b, box, { lane: 8, gap: 0 });
    assert.deepEqual(seg, { start: { x: 50, y: 8 }, end: { x: 150, y: 8 } });
  });

  test("the reverse direction takes the opposite lane", () => {
    const seg = edgeSegment(b, a, box, { lane: 8, gap: 0 });
    assert.deepEqual(seg, { start: { x: 150, y: -8 }, end: { x: 50, y: -8 } });
  });
});

describe("pointAlong", () => {
  test("interpolates between the ends", () => {
    const seg = { start: { x: 0, y: 0 }, end: { x: 100, y: 50 } };
    assert.deepEqual(pointAlong(seg, 0.5), { x: 50, y: 25 });
    assert.deepEqual(pointAlong(seg, 0), seg.start);
  });
});

describe("chips", () => {
  test("monospace chip width follows the character count", () => {
    const small = chipSize("abcd", 10);
    const large = chipSize("abcdefgh", 10);
    assert.equal(large.w - small.w, 4 * 10 * 0.6);
    assert.equal(small.h, large.h);
  });

  const size = { w: 100, h: 20 };
  const horizontal = { start: { x: 100, y: 100 }, end: { x: 500, y: 100 } };
  const vertical = { start: { x: 160, y: 100 }, end: { x: 160, y: 300 } };

  test("sits beside a horizontal edge, on its lane side", () => {
    const chip = placeChip({ x: 300, y: 100 }, horizontal, size, 600);
    assert.equal(chip.x, 300);
    assert.ok(chip.y > 100 + size.h / 2);
  });

  test("a wider gap pushes the chip further from the lane", () => {
    const near = placeChip({ x: 300, y: 100 }, horizontal, size, 600);
    const far = placeChip({ x: 300, y: 100 }, horizontal, size, 600, 30);
    assert.ok(far.y > near.y);
  });

  test("rides with the packet on a vertical edge", () => {
    const chip = placeChip({ x: 160, y: 200 }, vertical, size, 320);
    assert.deepEqual(chip, { x: 160, y: 200 });
  });

  test("stays between the boxes at either end of a vertical edge", () => {
    assert.equal(placeChip({ x: 160, y: 100 }, vertical, size, 320).y, 100 + size.h / 2);
    assert.equal(placeChip({ x: 160, y: 300 }, vertical, size, 320).y, 300 - size.h / 2);
  });

  test("parks at the midpoint of a diagonal edge, wherever the packet is", () => {
    const diagonal = { start: { x: 100, y: 100 }, end: { x: 370, y: 270 } };
    const early = placeChip({ x: 120, y: 112 }, diagonal, size, 600);
    const late = placeChip({ x: 350, y: 258 }, diagonal, size, 600);
    assert.deepEqual(early, { x: 235, y: 185 });
    assert.deepEqual(late, early);
  });

  test("stays inside the canvas", () => {
    const chip = placeChip({ x: 10, y: 100 }, horizontal, size, 600);
    assert.ok(chip.x - size.w / 2 >= 0);
  });
});

describe("placeChipCentered", () => {
  test("keeps the point, pulled inside the canvas", () => {
    const size = { w: 100, h: 20 };
    assert.deepEqual(placeChipCentered({ x: 300, y: 80 }, size, 600), { x: 300, y: 80 });
    assert.equal(placeChipCentered({ x: 20, y: 80 }, size, 600).x, size.w / 2 + 4);
  });
});

describe("edgeAxis", () => {
  test("classifies edges by how far they lean", () => {
    const from = { x: 0, y: 0 };
    assert.equal(edgeAxis({ start: from, end: { x: 200, y: 10 } }), "horizontal");
    assert.equal(edgeAxis({ start: from, end: { x: 5, y: -200 } }), "vertical");
    assert.equal(edgeAxis({ start: from, end: { x: 270, y: 170 } }), "diagonal");
  });
});

describe("fitLayout", () => {
  const layout = layoutFlow(row, "wide");

  test("centers the diagram in a larger frame", () => {
    const fitted = fitLayout(layout, { w: layout.width + 100, h: layout.height + 40 });
    assert.equal(fitted.width, layout.width + 100);
    assert.equal(fitted.height, layout.height + 40);
    assert.deepEqual(fitted.placements.a, { x: layout.placements.a.x + 50, y: layout.placements.a.y + 20 });
  });

  test("never shrinks a diagram below its own size", () => {
    const fitted = fitLayout(layout, { w: 10, h: 10 });
    assert.equal(fitted.width, layout.width);
    assert.deepEqual(fitted.placements, layout.placements);
  });
});
