import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { LEARN_ROADMAPS } from "./roadmaps.ts";

const LEARN_DIR = fileURLToPath(new URL("../../../learn/", import.meta.url));

describe("LEARN_ROADMAPS", () => {
  test("follows the site's learning order: backend, frontend, devops", () => {
    assert.deepEqual(
      LEARN_ROADMAPS.map((r) => r.id).slice(0, 3),
      ["backend", "frontend", "devops"],
    );
  });

  test("roadmap ids are unique", () => {
    const ids = LEARN_ROADMAPS.map((r) => r.id);
    assert.equal(new Set(ids).size, ids.length);
  });

  test("topic ids are unique across every roadmap", () => {
    const ids = LEARN_ROADMAPS.flatMap((r) => r.sections.flatMap((s) => s.topics.map((t) => t.id)));
    assert.equal(new Set(ids).size, ids.length);
  });

  test("published topics live under their roadmap's folder", () => {
    for (const roadmap of LEARN_ROADMAPS) {
      for (const topic of roadmap.sections.flatMap((s) => s.topics)) {
        if (topic.to) assert.ok(topic.to.startsWith(`/learn/${roadmap.id}/`), topic.to);
      }
    }
  });

  test("reading topics never claim a page of their own", () => {
    const reading = LEARN_ROADMAPS.flatMap((r) => r.sections.flatMap((s) => s.topics)).filter(
      (t) => t.format === "reading",
    );
    assert.ok(reading.every((t) => !t.to));
  });

  test("every section has at least one topic", () => {
    assert.ok(LEARN_ROADMAPS.every((r) => r.sections.every((s) => s.topics.length > 0)));
  });

  test("every published topic has an MDX page behind its link", () => {
    for (const topic of LEARN_ROADMAPS.flatMap((r) => r.sections.flatMap((s) => s.topics))) {
      if (!topic.to) continue;
      const file = `${LEARN_DIR}${topic.to.replace(/^\/learn\//, "")}.mdx`;
      assert.ok(existsSync(file), `${topic.to} has no page at ${file}`);
    }
  });
});
