import { test } from "node:test";
import assert from "node:assert/strict";
import { validateFlow } from "../../lib/flow/validate.ts";
import type { FlowDefinition } from "../../lib/flow/types.ts";
import { JOURNEY_STAGES, type JourneyStage } from "./request-journey.ts";

function drawnEdges(flow: FlowDefinition): ReadonlySet<string> {
  return new Set(flow.steps.flatMap((step) => (step.to ? [`${step.from}>${step.to}`, `${step.to}>${step.from}`] : [])));
}

function hops(stage: JourneyStage): readonly (readonly [string, string])[] {
  return stage.surge.routes.flatMap((route) =>
    route.path.slice(1).map((to, i) => [route.path[i], to] as const),
  );
}

test("stage ids are unique", () => {
  const ids = JOURNEY_STAGES.map((stage) => stage.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("every stage starts with a web page and an app call", () => {
  JOURNEY_STAGES.forEach((stage) => {
    const ids = stage.flow.actors.map((actor) => actor.id);
    assert.ok(ids.includes("web") && ids.includes("app"), `${stage.id} is missing a client`);
  });
});

test("only the last stage holds up under load", () => {
  const tones = JOURNEY_STAGES.map((stage) => stage.verdict.tone);
  assert.deepEqual(tones, [...tones.slice(0, -1).map(() => "breaks"), "holds"]);
});

for (const stage of JOURNEY_STAGES) {
  test(`${stage.id}: the walk is a valid flow`, () => {
    assert.deepEqual(validateFlow(stage.flow), []);
  });

  test(`${stage.id}: surge traffic only travels edges the walk draws`, () => {
    const edges = drawnEdges(stage.flow);
    hops(stage).forEach(([from, to]) => assert.ok(edges.has(`${from}>${to}`), `no edge ${from} → ${to}`));
  });

  test(`${stage.id}: the bottleneck and guards sit on a route, past the sender`, () => {
    const { bottleneck, guards = [], routes } = stage.surge;
    const reachable = new Set(routes.flatMap((route) => route.path.slice(1)));
    [...(bottleneck ? [bottleneck] : []), ...guards].forEach((id) =>
      assert.ok(reachable.has(id), `${id} is never reached`),
    );
    routes
      .filter((route) => route.blockedBy)
      .forEach((route) => assert.ok(guards.includes(route.blockedBy ?? ""), `${route.blockedBy} is not a guard`));
  });

  test(`${stage.id}: metric ranges are well formed`, () => {
    Object.values(stage.surge.metrics).forEach(([calm, peak]) => {
      assert.ok(calm >= 0 && peak >= 0);
    });
  });
}
