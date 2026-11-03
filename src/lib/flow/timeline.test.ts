import { describe, test } from "node:test";
import assert from "node:assert/strict";
import {
  buildTimeline,
  LOCAL_STEP_SECONDS,
  pacedSteps,
  sampleAt,
  stepHoldTime,
  stepStartTime,
  stepStatus,
  TRAVEL_STEP_SECONDS,
} from "./timeline.ts";
import type { FlowStep } from "./types.ts";

const steps: readonly FlowStep[] = [
  { id: "a", from: "x", to: "y", title: "A", detail: "a", duration: 2 },
  { id: "b", from: "y", title: "B", detail: "b", duration: 1 },
  { id: "c", from: "y", to: "x", title: "C", detail: "c", duration: 3 },
];

describe("buildTimeline", () => {
  test("lays steps end to end and sums the total", () => {
    const timeline = buildTimeline(steps);
    assert.deepEqual(
      timeline.segments.map((s) => [s.start, s.end]),
      [
        [0, 2],
        [2, 3],
        [3, 6],
      ],
    );
    assert.equal(timeline.total, 6);
  });

  test("uses travel and local defaults when duration is omitted", () => {
    const timeline = buildTimeline([
      { id: "a", from: "x", to: "y", title: "A", detail: "a" },
      { id: "b", from: "y", title: "B", detail: "b" },
    ]);
    assert.equal(timeline.total, TRAVEL_STEP_SECONDS + LOCAL_STEP_SECONDS);
  });

  test("returns an empty timeline for no steps", () => {
    assert.deepEqual(buildTimeline([]), { segments: [], total: 0 });
  });
});

describe("sampleAt", () => {
  const timeline = buildTimeline(steps);

  test("finds the step and progress within it", () => {
    assert.deepEqual(sampleAt(timeline, 1), { index: 0, progress: 0.5 });
    assert.deepEqual(sampleAt(timeline, 4.5), { index: 2, progress: 0.5 });
  });

  test("a boundary belongs to the step that starts there", () => {
    assert.deepEqual(sampleAt(timeline, 2), { index: 1, progress: 0 });
  });

  test("clamps before the start and after the end", () => {
    assert.deepEqual(sampleAt(timeline, -5), { index: 0, progress: 0 });
    assert.deepEqual(sampleAt(timeline, 99), { index: 2, progress: 1 });
  });

  test("handles an empty timeline", () => {
    assert.deepEqual(sampleAt(buildTimeline([]), 1), { index: 0, progress: 0 });
  });
});

describe("stepStatus", () => {
  test("marks steps done, active, or upcoming", () => {
    const sample = { index: 1, progress: 0.3 };
    assert.equal(stepStatus(0, sample), "done");
    assert.equal(stepStatus(1, sample), "active");
    assert.equal(stepStatus(2, sample), "upcoming");
  });
});

describe("step times", () => {
  const timeline = buildTimeline(steps);

  test("a step starts where the previous one ends", () => {
    assert.equal(stepStartTime(timeline, 0), 0);
    assert.equal(stepStartTime(timeline, 2), 3);
  });

  test("past the last step the start is the end of the flow", () => {
    assert.equal(stepStartTime(timeline, 9), 6);
  });

  test("the hold time shows a step finished without entering the next", () => {
    [0, 1, 2].forEach((index) => {
      const sample = sampleAt(timeline, stepHoldTime(timeline, index));
      assert.equal(sample.index, index);
      assert.ok(sample.progress > 0.99);
    });
  });
});

describe("pacedSteps", () => {
  test("scales explicit and default durations alike", () => {
    const paced = pacedSteps([steps[0], { id: "d", from: "x", to: "y", title: "D", detail: "d" }], 0.5);
    assert.deepEqual(
      paced.map((step) => step.duration),
      [1, TRAVEL_STEP_SECONDS * 0.5],
    );
  });

  test("leaves the original steps untouched", () => {
    pacedSteps(steps, 2);
    assert.equal(steps[0].duration, 2);
  });
});
