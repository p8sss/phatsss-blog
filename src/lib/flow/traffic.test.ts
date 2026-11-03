import { describe, test } from "node:test";
import assert from "node:assert/strict";
import {
  DOT_COUNT,
  HOP_SECONDS,
  loadAt,
  metricsAt,
  planDots,
  SURGE_SECONDS,
  trafficAt,
  type SurgeConfig,
} from "./traffic.ts";

const surge: SurgeConfig = {
  routes: [
    { path: ["web", "lb", "app", "db"], weight: 2 },
    { path: ["bot", "lb", "app"], weight: 1, attack: true },
  ],
  bottleneck: "db",
  guards: ["lb"],
  metrics: { rps: [100, 1000], p95Ms: [80, 800], errorPct: [0, 10] },
};

const unguarded: SurgeConfig = { ...surge, guards: undefined };

describe("loadAt", () => {
  test("ramps from 0 to 1 and never goes backwards", () => {
    const samples = Array.from({ length: 21 }, (_, i) => loadAt((SURGE_SECONDS * i) / 20));
    assert.equal(samples[0], 0);
    assert.equal(samples[samples.length - 1], 1);
    samples.slice(1).forEach((value, i) => assert.ok(value >= samples[i]));
  });
});

describe("metricsAt", () => {
  test("reads the calm values at the start and the peak at full load", () => {
    assert.deepEqual(metricsAt(surge.metrics, 0), { rps: 100, p95Ms: 80, errorPct: 0, blockedPct: null });
    assert.deepEqual(metricsAt(surge.metrics, 1), { rps: 1000, p95Ms: 800, errorPct: 10, blockedPct: null });
  });

  test("reports blocked traffic only when the stage defines it", () => {
    const withBlocked = { ...surge.metrics, blockedPct: [0, 40] as const };
    assert.equal(metricsAt(withBlocked, 1).blockedPct, 40);
  });
});

describe("planDots", () => {
  test("is deterministic", () => {
    assert.deepEqual(planDots(surge), planDots(surge));
  });

  test("spawns a fixed number of dots, later ones closer together", () => {
    const dots = planDots(surge);
    assert.equal(dots.length, DOT_COUNT);
    const gaps = dots.slice(1).map((dot, i) => dot.spawn - dots[i].spawn);
    assert.ok(gaps[0] > gaps[gaps.length - 1]);
  });

  test("stops attack traffic at the first guard on its path", () => {
    const attacks = planDots(surge).filter((dot) => dot.attack);
    assert.ok(attacks.length > 0);
    attacks.forEach((dot) => {
      assert.equal(dot.fate, "blocked");
      assert.equal(dot.path[dot.stopAt], "lb");
    });
  });

  test("lets an attack slip past earlier guards to the one that stops it", () => {
    const sneaky: SurgeConfig = {
      ...surge,
      routes: [{ path: ["bot", "lb", "app", "db"], weight: 1, attack: true, blockedBy: "app" }],
      guards: ["lb", "app"],
    };
    planDots(sneaky).forEach((dot) => assert.equal(dot.path[dot.stopAt], "app"));
  });

  test("lets attack traffic through when nothing guards the path", () => {
    const attacks = planDots(unguarded).filter((dot) => dot.attack);
    attacks.forEach((dot) => {
      assert.equal(dot.fate, "breach");
      assert.equal(dot.stopAt, dot.path.length - 1);
    });
  });

  test("fails requests only at the bottleneck, and only once load is high", () => {
    const failed = planDots(surge).filter((dot) => dot.fate === "failed");
    assert.ok(failed.length > 0);
    failed.forEach((dot) => {
      assert.equal(dot.path[dot.stopAt], "db");
      assert.ok(loadAt(dot.spawn) > 0.5);
    });
  });

  test("fails nothing when the stage has no bottleneck", () => {
    const healthy = planDots({ ...surge, bottleneck: undefined });
    assert.ok(healthy.every((dot) => dot.fate !== "failed"));
  });
});

describe("trafficAt", () => {
  const dots = planDots(surge);

  test("shows nothing before the first dot spawns", () => {
    assert.deepEqual(trafficAt(dots, dots[0].spawn - 0.01), []);
  });

  test("places a moving dot on a hop of its own path", () => {
    const first = dots[0];
    const [shown] = trafficAt([first], first.spawn + 0.01);
    assert.equal(shown.from, first.path[0]);
    assert.equal(shown.to, first.path[1]);
    assert.equal(shown.ended, false);
    assert.ok(shown.progress > 0 && shown.progress < 1);
  });

  test("parks an ended dot at its stop and fades it out", () => {
    const blocked = dots.find((dot) => dot.fate === "blocked");
    assert.ok(blocked);
    const late = trafficAt([blocked], blocked.spawn + 10);
    assert.deepEqual(late, []);
    const parked = trafficAt([blocked], blocked.spawn + blocked.stopAt * HOP_SECONDS + 0.1);
    assert.equal(parked[0].ended, true);
    assert.equal(parked[0].to, blocked.path[blocked.stopAt]);
    assert.ok(parked[0].opacity < 1);
  });
});
